"""
OCR service using EasyOCR with PDF rendering via pdf2image.

Supported inputs:
- PDF
- PNG / JPG / JPEG
"""

import io
import logging
import os
import re
from typing import Any
from urllib.parse import unquote, urlparse
from uuid import UUID

import httpx
from PIL import Image
from pypdf import PdfReader

from database.models import OcrResult
from database.supabase_client import service_supabase

logger = logging.getLogger(__name__)
_BUCKET = os.getenv("SUPABASE_BUCKET", "documents")

_EASYOCR_MODULE: Any | None = None
_EASYOCR_IMPORT_ERROR: Exception | None = None
_EASYOCR_IMPORT_ATTEMPTED = False


def _load_easyocr_module() -> Any | None:
    """Lazily import EasyOCR only when OCR is actually requested."""
    global _EASYOCR_MODULE, _EASYOCR_IMPORT_ERROR, _EASYOCR_IMPORT_ATTEMPTED

    if _EASYOCR_IMPORT_ATTEMPTED:
        return _EASYOCR_MODULE

    _EASYOCR_IMPORT_ATTEMPTED = True
    try:
        import easyocr  # type: ignore

        _EASYOCR_MODULE = easyocr
        _EASYOCR_IMPORT_ERROR = None
    except Exception as exc:  # pragma: no cover
        _EASYOCR_MODULE = None
        _EASYOCR_IMPORT_ERROR = exc

    return _EASYOCR_MODULE


class OcrService:
    """Wraps OCR initialization and exposes a single async extract method."""

    def __init__(self, languages: list[str] | None = None) -> None:
        self._languages = languages or ["en"]
        self._reader: Any | None = None

    def _get_reader(self):
        easyocr_module = _load_easyocr_module()
        if easyocr_module is None:
            raise RuntimeError(
                "EasyOCR is unavailable in this environment. "
                f"Import error: {_EASYOCR_IMPORT_ERROR}"
            )

        if self._reader is None:
            logger.info("Initializing EasyOCR reader (first call)...")
            self._reader = easyocr_module.Reader(self._languages, gpu=False)
        return self._reader

    def _extract_storage_path(self, url: str) -> str | None:
        """
        Extract object path from Supabase storage URL forms:
        - /storage/v1/object/public/<bucket>/<path>
        - /storage/v1/object/sign/<bucket>/<path>
        - /storage/v1/object/authenticated/<bucket>/<path>
        """
        parsed = urlparse(url)
        path = unquote(parsed.path)

        patterns = [
            rf"/storage/v1/object/public/{re.escape(_BUCKET)}/(.+)$",
            rf"/storage/v1/object/sign/{re.escape(_BUCKET)}/(.+)$",
            rf"/storage/v1/object/authenticated/{re.escape(_BUCKET)}/(.+)$",
        ]
        for pattern in patterns:
            match = re.search(pattern, path)
            if match:
                return match.group(1)

        if path.startswith(f"/{_BUCKET}/"):
            return path[len(_BUCKET) + 2 :]
        if path.startswith(f"{_BUCKET}/"):
            return path[len(_BUCKET) + 1 :]
        return None

    async def _download_file(self, url: str) -> bytes:
        """
        Download using service-role storage API first (private-bucket friendly),
        then fall back to direct HTTP download.
        """
        storage_path = self._extract_storage_path(url)
        if storage_path:
            try:
                data = service_supabase.storage.from_(_BUCKET).download(storage_path)
                if isinstance(data, (bytes, bytearray)):
                    return bytes(data)
            except Exception as exc:
                logger.warning("Storage download fallback to HTTP for %s: %s", storage_path, exc)

        async with httpx.AsyncClient(follow_redirects=True, timeout=30) as client:
            response = await client.get(url)
            response.raise_for_status()
            return response.content

    def _ocr_image_bytes(self, image_bytes: bytes) -> tuple[str, float | None]:
        """Run OCR on raw image bytes. Returns (text, average_confidence)."""
        if _load_easyocr_module() is None:
            raise ValueError(
                "Image OCR unavailable because EasyOCR failed to load in this environment. "
                f"Import error: {_EASYOCR_IMPORT_ERROR}"
            )

        reader = self._get_reader()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        results = reader.readtext(
            image,
            detail=1,       # returns [(bbox, text, confidence), ...]
            paragraph=True,  # group text into paragraphs
        )

        texts: list[str] = []
        confidences: list[float] = []
        for (_bbox, text, conf) in results:
            texts.append(text)
            confidences.append(conf)

        combined_text = "\n".join(texts)
        avg_conf = sum(confidences) / len(confidences) if confidences else None
        return combined_text, avg_conf

    def _ocr_pdf_bytes(self, pdf_bytes: bytes) -> tuple[str, float | None, int]:
        """
        Convert each PDF page to an image and OCR it.
        Returns (combined_text, average_confidence, page_count).
        """
        if _load_easyocr_module() is None:
            logger.warning(
                "EasyOCR unavailable, using embedded-text PDF fallback only. "
                "Scanned PDFs need a compatible OCR environment. Error: %s",
                _EASYOCR_IMPORT_ERROR,
            )
            return self._extract_pdf_text_fallback(pdf_bytes)

        from pdf2image import convert_from_bytes  # type: ignore

        poppler_path = os.getenv("POPPLER_PATH") or None
        try:
            images = convert_from_bytes(pdf_bytes, dpi=200, poppler_path=poppler_path)
        except Exception as exc:
            logger.warning("PDF raster OCR unavailable, falling back to native text extraction: %s", exc)
            return self._extract_pdf_text_fallback(pdf_bytes)

        all_text: list[str] = []
        all_conf: list[float] = []

        for page_image in images:
            buf = io.BytesIO()
            page_image.save(buf, format="PNG")
            buf.seek(0)
            text, conf = self._ocr_image_bytes(buf.read())
            all_text.append(text)
            if conf is not None:
                all_conf.append(conf)

        combined = "\n\n".join(all_text)
        avg_conf = sum(all_conf) / len(all_conf) if all_conf else None
        return combined, avg_conf, len(images)

    def _extract_pdf_text_fallback(self, pdf_bytes: bytes) -> tuple[str, float | None, int]:
        """
        Fallback when raster OCR is unavailable:
        extract embedded text directly from PDF.
        """
        reader = PdfReader(io.BytesIO(pdf_bytes))
        page_count = len(reader.pages)
        chunks: list[str] = []

        for page in reader.pages:
            text = page.extract_text() or ""
            if text.strip():
                chunks.append(text)

        combined = "\n\n".join(chunks).strip()
        if not combined:
            raise ValueError(
                "Could not OCR this PDF: no embedded text found and OCR runtime is unavailable. "
                "Install Poppler and a compatible EasyOCR stack for scanned PDFs."
            )

        return combined, None, page_count

    async def extract(
        self,
        document_id: UUID,
        storage_url: str,
        file_type: str,
    ) -> OcrResult:
        """
        Download storage_url, run OCR, and return an OcrResult.
        """
        logger.info("OCR start: document_id=%s type=%s", document_id, file_type)

        file_bytes = await self._download_file(storage_url)
        page_count = 1
        normalized_type = file_type.lower()

        if normalized_type not in {"pdf", "png", "jpg", "jpeg"}:
            raise ValueError(
                f"Unsupported file type '{file_type}' for OCR. "
                "Supported: pdf, png, jpg, jpeg."
            )

        if normalized_type == "pdf":
            raw_text, confidence, page_count = self._ocr_pdf_bytes(file_bytes)
        else:
            raw_text, confidence = self._ocr_image_bytes(file_bytes)

        logger.info(
            "OCR done: document_id=%s pages=%d chars=%d confidence=%.2f",
            document_id,
            page_count,
            len(raw_text),
            confidence or 0.0,
        )

        return OcrResult(
            document_id=document_id,
            raw_text=raw_text,
            confidence=confidence,
            page_count=page_count,
        )
