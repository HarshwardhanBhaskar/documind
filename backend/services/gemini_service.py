"""
services/gemini_service.py
──────────────────────────────────────────────────────────────────────────────
Central wrapper around the Google Gemini API.

Provides lightweight async helpers for:
  - Document classification
  - Structured field extraction
  - Text summarization

Uses gemini-2.0-flash (fast, generous free tier).
"""

import json
import logging
import os
from typing import Any

logger = logging.getLogger(__name__)

_CLIENT = None
_MODEL = None


def _get_model():
    """Lazy-initialize the Gemini model on first call."""
    global _CLIENT, _MODEL

    if _MODEL is not None:
        return _MODEL

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.warning("GEMINI_API_KEY not set – Gemini features disabled.")
        return None

    try:
        import google.generativeai as genai

        genai.configure(api_key=api_key)
        _MODEL = genai.GenerativeModel("gemini-2.0-flash")
        logger.info("Gemini model initialized (gemini-2.0-flash).")
        return _MODEL
    except Exception as exc:
        logger.error("Failed to initialize Gemini: %s", exc)
        return None


def _clean_json_response(text: str) -> str:
    """Strip markdown code fences and whitespace from Gemini's response."""
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()


async def gemini_classify(text: str) -> dict[str, Any] | None:
    """
    Ask Gemini to classify a document from its text content.

    Returns:
        {"document_type": str, "confidence": float} or None if unavailable.
    """
    model = _get_model()
    if model is None:
        return None

    prompt = f"""You are a document classification AI. Analyze the following document text and classify it into ONE of these categories:
- Invoice
- Receipt
- Contract
- Resume
- Certificate
- Medical Record
- Financial Statement
- Legal Filing
- Report
- Unknown

Respond with ONLY a JSON object in this exact format (no extra text):
{{"document_type": "<type>", "confidence": <0.0-1.0>}}

Document text (first 3000 chars):
\"\"\"
{text[:3000]}
\"\"\""""

    try:
        response = model.generate_content(prompt)
        raw = _clean_json_response(response.text)
        result = json.loads(raw)
        logger.info("Gemini classified as: %s (%.2f)", result.get("document_type"), result.get("confidence", 0))
        return result
    except Exception as exc:
        logger.warning("Gemini classification failed: %s", exc)
        return None


async def gemini_extract_fields(text: str, document_type: str) -> dict[str, Any] | None:
    """
    Ask Gemini to extract structured fields from document text.

    Returns:
        dict of field_name -> value, or None if unavailable.
    """
    model = _get_model()
    if model is None:
        return None

    prompt = f"""You are a document data extraction AI. The following document has been classified as a "{document_type}".

Extract ALL relevant structured fields from the text. Common fields include:
- For Invoices: vendor, client, invoice_no, date, due_date, amount, tax, currency
- For Receipts: store_name, receipt_no, date, subtotal, tax, total, payment_method
- For Contracts: parties, effective_date, expiry_date, jurisdiction, value
- For Resumes: name, email, phone, linkedin, current_role, skills, education
- For Certificates: recipient_name, certificate_title, issued_by, date, course_name, organization
- For Medical Records: patient_name, dob, diagnosis, physician, date
- For Financial Statements: period, total_revenue, net_income, total_assets, currency

Respond with ONLY a JSON object mapping field names to their extracted values.
If a field is not found, do NOT include it. Example:
{{"vendor": "Acme Corp", "amount": "$1,500.00", "date": "March 15, 2026"}}

Document text (first 4000 chars):
\"\"\"
{text[:4000]}
\"\"\""""

    try:
        response = model.generate_content(prompt)
        raw = _clean_json_response(response.text)
        fields = json.loads(raw)
        logger.info("Gemini extracted %d fields", len(fields))
        return fields
    except Exception as exc:
        logger.warning("Gemini extraction failed: %s", exc)
        return None


async def gemini_summarize(text: str) -> str | None:
    """
    Ask Gemini to produce a concise summary of the document.

    Returns:
        Summary string, or None if unavailable.
    """
    model = _get_model()
    if model is None:
        return None

    prompt = f"""Summarize the following document in 2-4 sentences. Be concise and focus on the key information.

Document text (first 3000 chars):
\"\"\"
{text[:3000]}
\"\"\""""

    try:
        response = model.generate_content(prompt)
        summary = response.text.strip()
        logger.info("Gemini summary generated (%d chars)", len(summary))
        return summary
    except Exception as exc:
        logger.warning("Gemini summarization failed: %s", exc)
        return None
