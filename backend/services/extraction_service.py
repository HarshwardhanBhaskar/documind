"""
services/extraction_service.py
──────────────────────────────────────────────────────────────────────────────
Structured field extraction from document text.

Strategy
─────────
Each document type has a set of regex-based extractors that pull out
well-known fields (amounts, dates, names, etc.).

For fields not covered by regex, the service falls back to a simple
keyword-window search (grab the N words after a label keyword).

Result shape
─────────────
Returns a dict of field_name → extracted_value, e.g.:

    {
        "vendor":      "Acme Corp Ltd.",
        "amount":      "$24,500.00",
        "invoice_no":  "INV-2024-1192",
        "date":        "March 7, 2026",
        "due_date":    "March 21, 2026",
    }
"""

import logging
import re
from typing import Any
from uuid import UUID

from database.models import ExtractionResult

logger = logging.getLogger(__name__)


# ─── Type-specific field extractors ──────────────────────────────────────────

# Each extractor is (field_name, regex_pattern).
# The first capture group is taken as the value.
_EXTRACTORS: dict[str, list[tuple[str, str]]] = {
    "Invoice": [
        ("invoice_no",   r"(?:invoice\s*(?:no|number|#)[:\s]*)([A-Z0-9\-]+)"),
        ("date",         r"(?:invoice\s*date|date)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|[A-Z][a-z]+ \d{1,2},?\s*\d{4})"),
        ("due_date",     r"(?:due\s*date|payment\s*due)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|[A-Z][a-z]+ \d{1,2},?\s*\d{4})"),
        ("vendor",       r"(?:from|vendor|billed?\s*by|company)[:\s]*([A-Za-z0-9 ,\.]+?)(?:\n|$)"),
        ("client",       r"(?:to|bill\s*to|client|customer)[:\s]*([A-Za-z0-9 ,\.]+?)(?:\n|$)"),
        ("amount",       r"(?:total|amount\s*due|total\s*amount)[:\s]*(\$?[\d,]+\.?\d{0,2})"),
        ("currency",     r"(\bUSD\b|\bEUR\b|\bGBP\b|\bINR\b|\bCAD\b)"),
        ("tax",          r"(?:tax|vat|gst)[:\s]*(\$?[\d,]+\.?\d{0,2})"),
    ],
    "Contract": [
        ("parties",      r"(?:between|party|parties)[:\s]*([A-Za-z0-9 ,\.]+?)(?:\n|and )"),
        ("effective_date", r"(?:effective\s*date|dated?)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|[A-Z][a-z]+ \d{1,2},?\s*\d{4})"),
        ("expiry_date",  r"(?:expir(?:y|ation)\s*date|termination)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})"),
        ("jurisdiction", r"(?:jurisdiction|governed\s*by|under\s*the\s*laws\s*of)[:\s]*([A-Za-z ]+?)(?:\n|,|\.|\.|$)"),
        ("value",        r"(?:consideration|value|amount)[:\s]*(\$?[\d,]+\.?\d{0,2})"),
    ],
    "Resume": [
        ("name",         r"^([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\n"),
        ("email",        r"([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)"),
        ("phone",        r"(\+?[\d\s\-\(\)]{7,15})"),
        ("linkedin",     r"(linkedin\.com/in/[A-Za-z0-9\-]+)"),
        ("current_role", r"(?:objective|title|role)[:\s]*([A-Za-z ]+?)(?:\n|$)"),
    ],
    "Medical Record": [
        ("patient_name", r"(?:patient|name)[:\s]*([A-Za-z ]+?)(?:\n|$)"),
        ("dob",          r"(?:date\s*of\s*birth|dob)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})"),
        ("diagnosis",    r"(?:diagnosis|dx)[:\s]*([A-Za-z0-9 ,\.\-]+?)(?:\n|$)"),
        ("physician",    r"(?:physician|doctor|dr\.?)[:\s]*([A-Za-z ]+?)(?:\n|$)"),
        ("date",         r"(?:date|visit\s*date)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})"),
    ],
    "Financial Statement": [
        ("period",       r"(?:period|fiscal\s*year|year\s*ended?)[:\s]*([A-Za-z0-9 ,]+?)(?:\n|$)"),
        ("total_revenue",r"(?:total\s*revenue|net\s*revenue|net\s*sales)[:\s]*(\$?[\d,]+\.?\d{0,2})"),
        ("net_income",   r"(?:net\s*income|net\s*profit|net\s*loss)[:\s]*(\$?[\d,]+\.?\d{0,2})"),
        ("total_assets", r"(?:total\s*assets)[:\s]*(\$?[\d,]+\.?\d{0,2})"),
        ("currency",     r"(\bUSD\b|\bEUR\b|\bGBP\b|\bINR\b)"),
    ],
    "Receipt": [
        ("store_name",   r"^([A-Z][A-Za-z0-9 &\'\-]+)\n"),
        ("receipt_no",   r"(?:receipt\s*(?:no|number|#)[:\s]*)([A-Z0-9\-]+)"),
        ("date",         r"(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})"),
        ("subtotal",     r"(?:subtotal|sub\s*total)[:\s]*(\$?[\d,]+\.\d{2})"),
        ("tax",          r"(?:tax|vat|gst)[:\s]*(\$?[\d,]+\.\d{2})"),
        ("total",        r"(?:total|order\s*total|grand\s*total)[:\s]*(\$?[\d,]+\.\d{2})"),
        ("payment_method",r"(?:paid\s*by|payment|tender)[:\s]*([A-Za-z ]+?)(?:\n|$)"),
        ("cashier",      r"(?:cashier|served\s*by|associate)[:\s]*([A-Za-z ]+?)(?:\n|$)"),
    ],
    "Certificate": [
        ("recipient_name",r"(?:awarded\s*to|conferred\s*upon|presented\s*to|this\s*certifies\s*that)[:\s]*([A-Za-z .]+?)(?:\n|for|in)"),
        ("certificate_title", r"(?:certificate\s*of|this\s*is\s*to\s*certify)[:\s]*([A-Za-z ]+?)(?:\n|$)"),
        ("issued_by",    r"(?:issued\s*by|awarded\s*by|authorized\s*by|signed\s*by)[:\s]*([A-Za-z ,.]+?)(?:\n|$)"),
        ("date",         r"(?:date|issued\s*on|awarded\s*on)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|[A-Z][a-z]+ \d{1,2},?\s*\d{4})"),
        ("course_name",  r"(?:completion\s*of|for\s*completing|course)[:\s]*([A-Za-z0-9 ,\-]+?)(?:\n|$)"),
        ("organization", r"(?:university|institute|school|academy|college|organization)[:\s]*([A-Za-z0-9 ,\.]+?)(?:\n|$)"),
    ],
}

# Generic extractors applied to all document types
_GENERIC_EXTRACTORS: list[tuple[str, str]] = [
    ("email",    r"([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)"),
    ("date",     r"(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})"),
    ("phone",    r"(\+?[\d\s\-\(\)]{7,15})"),
    ("currency", r"(\bUSD\b|\bEUR\b|\bGBP\b|\bINR\b|\bCAD\b)"),
    ("amount",   r"(\$[\d,]+\.?\d{0,2})"),
]


class ExtractionService:
    """Extracts structured fields from document text using regex rules."""

    async def extract(
        self,
        document_id:   UUID,
        text:          str,
        document_type: str = "Unknown",
    ) -> ExtractionResult:
        """
        Run field extraction on `text` for the given `document_type`.
        Returns an ExtractionResult with a dict of found fields.
        """
        logger.info(
            "Extraction start: document_id=%s  type=%s  chars=%d",
            document_id, document_type, len(text),
        )

        fields: dict[str, Any] = {}

        # Type-specific extractors
        extractors = _EXTRACTORS.get(document_type, [])
        for field_name, pattern in extractors:
            value = _regex_extract(pattern, text)
            if value:
                fields[field_name] = value.strip()

        # Generic extractors (fill in gaps)
        for field_name, pattern in _GENERIC_EXTRACTORS:
            if field_name not in fields:
                value = _regex_extract(pattern, text)
                if value:
                    fields[field_name] = value.strip()

        # Deduplicate list-type values
        fields = {k: v for k, v in fields.items() if v}

        logger.info(
            "Extraction done: document_id=%s  fields=%s",
            document_id, list(fields.keys()),
        )

        return ExtractionResult(document_id=document_id, extracted_fields=fields)


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _regex_extract(pattern: str, text: str) -> str | None:
    """Return the first capture group of `pattern` found in `text`, or None."""
    match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
    if match:
        try:
            return match.group(1)
        except IndexError:
            return match.group(0)
    return None
