"""
services/smart_classify_service.py
──────────────────────────────────────────────────────────────────────────────
Unified smart document classification pipeline.

Pipeline
─────────
1. OCR  – Extract raw text from the document (using existing OCR service)
2. Classify – Determine document type using keyword + optional zero-shot AI
3. Extract – Pull structured fields based on the detected document type

Response shape
──────────────
{
    "document_type": "Invoice",
    "confidence": 0.91,
    "fields": {
        "vendor": "Acme Corp",
        "amount": "$24,500.00",
        "invoice_no": "INV-2024-1192",
        "date": "March 7, 2024",
        "due_date": "March 21, 2024"
    }
}
"""

import logging
import io
import re
from typing import Any

logger = logging.getLogger(__name__)


# ── Keyword rules (same 5 primary types as the user requested) ────────────────

_RULES: list[tuple[str, list[str]]] = [
    ("Invoice",     ["invoice", "bill to", "due date", "total amount", "amount due", "payment terms", "invoice no", "invoice number"]),
    ("Receipt",     ["receipt", "thank you for your purchase", "order total", "subtotal", "cash", "card ending", "items purchased", "transaction"]),
    ("Contract",    ["agreement", "terms and conditions", "whereas", "obligations", "party of the first part", "indemnif", "hereinafter"]),
    ("Resume",      ["curriculum vitae", "work experience", "education", "objective", "references available", "linkedin", "skills", "career"]),
    ("Certificate", ["certificate", "certify", "awarded", "completion", "this is to certify", "hereby certifies", "conferred upon", "achievement"]),
]


# ── Per-type field extractors (regex patterns) ────────────────────────────────

_FIELDS: dict[str, list[tuple[str, str]]] = {
    "Invoice": [
        ("vendor",      r"(?:from|vendor|billed?\s*by|company|seller)[:\s]*([A-Za-z0-9 ,\.]+?)(?:\n|$)"),
        ("client",      r"(?:to|bill\s*to|client|customer|buyer)[:\s]*([A-Za-z0-9 ,\.]+?)(?:\n|$)"),
        ("invoice_id",  r"(?:invoice\s*(?:no|number|#|id)[:\s]*)([A-Z0-9\-]+)"),
        ("date",        r"(?:invoice\s*date|date)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|[A-Z][a-z]+ \d{1,2},?\s*\d{4})"),
        ("due_date",    r"(?:due\s*date|payment\s*due)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|[A-Z][a-z]+ \d{1,2},?\s*\d{4})"),
        ("amount",      r"(?:total|amount\s*due|total\s*amount|grand\s*total)[:\s]*(\$?[\d,]+\.?\d{0,2})"),
        ("tax",         r"(?:tax|vat|gst)[:\s]*(\$?[\d,]+\.?\d{0,2})"),
        ("currency",    r"(\bUSD\b|\bEUR\b|\bGBP\b|\bINR\b|\bCAD\b)"),
    ],
    "Receipt": [
        ("store_name",    r"^([A-Z][A-Za-z0-9 &\'\-]+)\n"),
        ("receipt_no",    r"(?:receipt\s*(?:no|number|#)[:\s]*)([A-Z0-9\-]+)"),
        ("date",          r"(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})"),
        ("subtotal",      r"(?:subtotal|sub\s*total)[:\s]*(\$?[\d,]+\.\d{2})"),
        ("tax",           r"(?:tax|vat|gst)[:\s]*(\$?[\d,]+\.\d{2})"),
        ("total",         r"(?:total|order\s*total|grand\s*total)[:\s]*(\$?[\d,]+\.\d{2})"),
        ("payment_method",r"(?:paid\s*by|payment|method|tender)[:\s]*([A-Za-z ]+?)(?:\n|$)"),
        ("cashier",       r"(?:cashier|served\s*by|associate)[:\s]*([A-Za-z ]+?)(?:\n|$)"),
    ],
    "Contract": [
        ("parties",         r"(?:between|party|parties)[:\s]*([A-Za-z0-9 ,\.]+?)(?:\n|and )"),
        ("effective_date",  r"(?:effective\s*date|dated?)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|[A-Z][a-z]+ \d{1,2},?\s*\d{4})"),
        ("expiry_date",     r"(?:expir(?:y|ation)\s*date|termination)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})"),
        ("jurisdiction",    r"(?:jurisdiction|governed\s*by|laws\s*of)[:\s]*([A-Za-z ]+?)(?:\n|,|\.$)"),
        ("consideration",   r"(?:consideration|value|amount)[:\s]*(\$?[\d,]+\.?\d{0,2})"),
    ],
    "Resume": [
        ("name",         r"^([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\n"),
        ("email",        r"([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)"),
        ("phone",        r"(\+?[\d\s\-\(\)]{7,15})"),
        ("linkedin",     r"(linkedin\.com/in/[A-Za-z0-9\-]+)"),
        ("current_role", r"(?:objective|title|role|position)[:\s]*([A-Za-z ]+?)(?:\n|$)"),
        ("skills",       r"(?:skills?|technologies|expertise)[:\s]*([A-Za-z ,/\+\#]+?)(?:\n|$)"),
    ],
    "Certificate": [
        ("recipient_name",    r"(?:awarded\s*to|conferred\s*upon|presented\s*to|certifies\s*that)[:\s]*([A-Za-z .]+?)(?:\n|for|in)"),
        ("certificate_title", r"(?:certificate\s*of|certify\s*that)[:\s]*([A-Za-z ]+?)(?:\n|$)"),
        ("issued_by",         r"(?:issued\s*by|awarded\s*by|authorized\s*by|signed\s*by)[:\s]*([A-Za-z ,.]+?)(?:\n|$)"),
        ("date",              r"(?:date|issued\s*on|awarded\s*on)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|[A-Z][a-z]+ \d{1,2},?\s*\d{4})"),
        ("course_name",       r"(?:completion\s*of|for\s*completing|course)[:\s]*([A-Za-z0-9 ,\-]+?)(?:\n|$)"),
        ("organization",      r"(?:university|institute|school|academy|college|organization)[:\s]*([A-Za-z0-9 ,\.]+?)(?:\n|$)"),
    ],
}

# Generic fallback extractors applied regardless of type
_GENERIC: list[tuple[str, str]] = [
    ("email",  r"([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)"),
    ("date",   r"(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})"),
    ("amount", r"(\$[\d,]+\.?\d{0,2})"),
    ("phone",  r"(\+?[\d\s\-\(\)]{7,15})"),
]


# ── Core classification logic ─────────────────────────────────────────────────

def _classify(text: str) -> tuple[str, float]:
    """
    Keyword-scoring classifier.
    Returns (document_type, confidence_0_to_1).
    """
    lower = text.lower()
    scores: dict[str, int] = {}

    for doc_type, keywords in _RULES:
        hits = sum(1 for kw in keywords if kw in lower)
        if hits > 0:
            scores[doc_type] = hits

    if not scores:
        return "Unknown", 0.0

    best_type = max(scores, key=lambda t: scores[t])
    best_hits = scores[best_type]
    total_keywords = len(next(kws for dt, kws in _RULES if dt == best_type))

    # Confidence: scales 0.45 → 0.98 based on keyword coverage
    raw_conf = min(0.45 + (best_hits / total_keywords) * 0.55, 0.98)
    return best_type, round(raw_conf, 3)


def _extract(text: str, doc_type: str) -> dict[str, Any]:
    """
    Extract structured fields from text based on document type.
    """
    fields: dict[str, Any] = {}

    # Type-specific extractors
    for field_name, pattern in _FIELDS.get(doc_type, []):
        m = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
        if m:
            try:
                val = m.group(1).strip()
            except IndexError:
                val = m.group(0).strip()
            if val:
                fields[field_name] = val

    # Generic extractors to fill gaps
    for field_name, pattern in _GENERIC:
        if field_name not in fields:
            m = re.search(pattern, text, re.IGNORECASE)
            if m:
                try:
                    val = m.group(1).strip()
                except IndexError:
                    val = m.group(0).strip()
                if val:
                    fields[field_name] = val

    return fields


# ── Public entry point ────────────────────────────────────────────────────────

async def smart_classify_text(text: str) -> dict[str, Any]:
    """
    Run the full classify → extract pipeline on already-extracted text.
    
    Returns:
        {
            "document_type": str,
            "confidence": float,
            "fields": dict
        }
    """
    doc_type, confidence = _classify(text)
    fields = _extract(text, doc_type)

    return {
        "document_type": doc_type,
        "confidence": confidence,
        "fields": fields,
    }
