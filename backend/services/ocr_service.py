"""
OCR service using pypdf for digital PDFs and Gemini Vision for images/scanned docs.

Supported inputs:
- PDF
- PNG / JPG / JPEG
"""

import io
import logging
import os
import re
from urllib.parse import unquote, urlparse
from uuid import UUID

import httpx
from PIL import Image
from pypdf import PdfReader

from database.models import OcrResult
from database.supabase_client import service_supabase

logger = logging.getLogger(__name__)
_BUCKET = os.getenv("SUPABASE_BUCKET", "documents")


class OcrService:
    """OCR service: pypdf for digital PDFs, Gemini Vision for images."""

    def __init__(self, languages: list[str] | None = None) -> None:
        self._languages = languages or ["en"]

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

    async def _ocr_image_bytes(self, image_bytes: bytes) -> tuple[str, float | None]:
        """
        Run OCR on image bytes using Gemini Vision API.
        Returns (text, confidence).
        """
        try:
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                raise ValueError("GEMINI_API_KEY not set — cannot OCR images without AI.")

            import google.generativeai as genai

            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-2.0-flash")

            # Load image for Gemini
            image = Image.open(io.BytesIO(image_bytes))

            response = model.generate_content(
                [
                    "Extract ALL text from this image exactly as it appears. "
                    "Preserve the layout, line breaks, and formatting as closely as possible. "
                    "Do not add any commentary — return ONLY the extracted text.",
                    image,
                ]
            )

            text = response.text.strip() if response.text else ""
            if text:
                logger.info("Gemini Vision OCR extracted %d characters", len(text))
                return text, 0.90  # Gemini is highly accurate
            else:
                raise ValueError("Gemini returned empty text for this image.")

        except Exception as exc:
            logger.warning("Gemini Vision OCR failed: %s", exc)
            raise ValueError(
                f"Image OCR failed: {exc}. "
                "Ensure GEMINI_API_KEY is set for image text extraction."
            ) from exc

    def _extract_pdf_text(self, pdf_bytes: bytes) -> tuple[str, float | None, int]:
        """
        Extract embedded text from PDF using pypdf.
        For digital PDFs this is fast and accurate.
        """
        reader = PdfReader(io.BytesIO(pdf_bytes))
        page_count = len(reader.pages)
        chunks: list[str] = []

        for page in reader.pages:
            text = page.extract_text() or ""
            if text.strip():
                chunks.append(text)

        combined = "\n\n".join(chunks).strip()
        return combined, None, page_count

    async def _ocr_pdf_bytes(self, pdf_bytes: bytes) -> tuple[str, float | None, int]:
        """
        Extract text from PDF. Tries pypdf first (fast), then falls back
        to Gemini Vision for scanned/image PDFs.
        """
        # Try embedded text extraction first
        text, confidence, page_count = self._extract_pdf_text(pdf_bytes)

        if text and len(text.strip()) > 50:
            logger.info("PDF text extracted via pypdf: %d chars, %d pages", len(text), page_count)
            return text, confidence, page_count

        # If pypdf got very little text, the PDF might be scanned → use Gemini
        logger.info("PDF has little embedded text (%d chars), trying Gemini Vision...", len(text.strip()))
        try:
            # Convert first page to image and OCR with Gemini
            gemini_text, gemini_conf = await self._ocr_image_bytes(pdf_bytes)
            if gemini_text:
                return gemini_text, gemini_conf, page_count
        except Exception as exc:
            logger.warning("Gemini PDF OCR fallback failed: %s", exc)

        # If we got at least some text from pypdf, return that
        if text.strip():
            return text, confidence, page_count

        raise ValueError(
            "Could not extract text from this PDF: no embedded text found "
            "and Gemini Vision OCR also failed."
        )

    async def extract_text_from_bytes(
        self,
        file_bytes: bytes,
        filename: str,
        content_type: str,
    ) -> str:
        """
        Direct OCR helper for raw uploaded bytes, used by file-upload endpoints
        that don't persist the document first.
        """
        normalized_type = (content_type or "").lower()
        if normalized_type == "application/pdf" or filename.lower().endswith(".pdf"):
            text, _confidence, _pages = await self._ocr_pdf_bytes(file_bytes)
            return text

        if normalized_type.startswith("image/"):
            text, _confidence = await self._ocr_image_bytes(file_bytes)
            return text

        raise ValueError(
            f"Unsupported file type '{content_type}' for OCR. Supported: PDF and common image formats."
        )

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
            raw_text, confidence, page_count = await self._ocr_pdf_bytes(file_bytes)
        else:
            raw_text, confidence = await self._ocr_image_bytes(file_bytes)

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
