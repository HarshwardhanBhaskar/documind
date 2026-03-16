"""
routers/smart_classify.py
──────────────────────────────────────────────────────────────────────────────
POST /smart-classify

Unified endpoint that accepts a document file, runs OCR, classifies the
document type, and extracts structured fields — all in one request.

Supported document types:
  Invoice | Receipt | Contract | Resume | Certificate
  (+ Medical Record, Financial Statement, Legal Filing, Report)

Response:
  {
    "document_type": "Invoice",
    "confidence": 0.91,
    "fields": {
      "vendor":     "Acme Corp Ltd.",
      "amount":     "$24,500.00",
      "invoice_id": "INV-2024-1192",
      "date":       "March 7, 2024",
      "due_date":   "March 21, 2024"
    }
  }
"""

import logging
import io
import re
from typing import Annotated

from fastapi import APIRouter, File, UploadFile, HTTPException, status
from pydantic import BaseModel

from services.smart_classify_service import smart_classify_text

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/smart-classify", tags=["Smart Classification"])


# ── Response model ────────────────────────────────────────────────────────────

class SmartClassifyResponse(BaseModel):
    document_type: str
    confidence: float
    fields: dict


# ── POST /smart-classify (text input) ────────────────────────────────────────

@router.post(
    "/text",
    response_model=SmartClassifyResponse,
    summary="Classify document from raw text",
    description=(
        "Provide raw document text. The AI will classify the document type "
        "(Invoice, Receipt, Contract, Resume, Certificate, etc.) "
        "and extract all relevant structured fields."
    ),
)
async def classify_from_text(body: dict):
    """
    Accept a JSON body: { "text": "..." }
    Returns document_type, confidence, and structured fields.
    """
    text: str = body.get("text", "").strip()
    if not text:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Field 'text' is required and cannot be empty.")
    if len(text) < 20:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Text is too short to classify. Provide more content.")

    try:
        result = await smart_classify_text(text)
        return result
    except Exception as e:
        logger.exception("Smart classify failed: %s", e)
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"Classification error: {e}")


# ── POST /smart-classify/file (direct file upload) ───────────────────────────

@router.post(
    "/file",
    response_model=SmartClassifyResponse,
    summary="Classify an uploaded document (PDF or image)",
    description=(
        "Upload a PDF or image file. The backend will run OCR to extract text, "
        "then classify the document type and extract structured fields."
    ),
)
async def classify_from_file(
    file: UploadFile = File(...),
):
    """
    Accept a raw file upload. Runs OCR → classify → extract pipeline.
    Returns document_type, confidence, and extracted fields.
    """
    # Validate file type
    allowed_types = {
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/tiff",
        "image/webp",
    }
    if file.content_type not in allowed_types:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"Unsupported file type: {file.content_type}. Allowed: PDF, JPEG, PNG, TIFF, WEBP."
        )

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Uploaded file is empty.")

    # Run OCR to get text
    try:
        from services.ocr_service import OcrService
        ocr = OcrService()
        text = await ocr.extract_text_from_bytes(
            file_bytes=file_bytes,
            filename=file.filename or "document",
            content_type=file.content_type or "application/pdf",
        )
    except Exception as e:
        logger.exception("OCR failed during smart classify: %s", e)
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"OCR error: {e}")

    if not text or len(text.strip()) < 10:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "Could not extract readable text from the document. Ensure the file is not scanned as a blank image."
        )

    # Classify + extract
    try:
        result = await smart_classify_text(text)
        return result
    except Exception as e:
        logger.exception("Classification failed: %s", e)
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"Classification error: {e}")
