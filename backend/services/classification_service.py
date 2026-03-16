"""
services/classification_service.py
──────────────────────────────────────────────────────────────────────────────
Document type classification using a keyword + zero-shot-classification
hybrid strategy.

Strategy
─────────
1.  Fast path  – regex / keyword rules that cover the most common types.
    Runs in microseconds; no model required.

2.  Slow path  – HuggingFace zero-shot classification (BART-MNLI) for
    documents that don't match any keyword rule.
    The model is loaded lazily on first use.

Supported document types (expandable)
──────────────────────────────────────
Invoice  |  Contract  |  Report  |  Resume  |
Medical Record  |  Legal Filing  |  Financial Statement  |  Unknown
"""

import logging
import os
import re
from uuid import UUID

from database.models import ClassificationResult

logger = logging.getLogger(__name__)

# ── Keyword rules (fast path) ─────────────────────────────────────────────────
_KEYWORD_RULES: list[tuple[str, list[str]]] = [
    ("Invoice",             ["invoice", "bill to", "due date", "total amount", "amount due", "payment terms"]),
    ("Contract",            ["agreement", "terms and conditions", "whereas", "obligations", "party of the first part", "indemnif"]),
    ("Resume",              ["curriculum vitae", "work experience", "education", "objective", "references available", "linkedin"]),
    ("Medical Record",      ["patient", "diagnosis", "prescription", "physician", "icd-", "medication", "dosage"]),
    ("Financial Statement", ["balance sheet", "income statement", "cash flow", "revenue", "net income", "fiscal year"]),
    ("Legal Filing",        ["plaintiff", "defendant", "court", "jurisdiction", "filing", "affidavit", "testimony"]),
    ("Report",              ["executive summary", "findings", "methodology", "conclusion", "recommendations", "analysis"]),
]


def _classify_by_keywords(text: str) -> tuple[str, float] | None:
    """
    Returns (document_type, confidence) if a keyword match is found,
    otherwise None.
    """
    lower = text.lower()
    best_type: str | None = None
    best_hits = 0

    for doc_type, keywords in _KEYWORD_RULES:
        hits = sum(1 for kw in keywords if kw in lower)
        if hits > best_hits:
            best_hits = hits
            best_type = doc_type

    if best_type and best_hits >= 2:
        # Confidence scales with the number of matching keywords
        confidence = min(0.55 + (best_hits - 2) * 0.08, 0.98)
        return best_type, round(confidence, 3)

    return None


class ClassificationService:
    """
    Classifies document text into predefined document types.
    Uses keyword rules as a fast path and zero-shot classification as fallback.
    """

    def __init__(self) -> None:
        self._pipeline = None   # Lazy-loaded HuggingFace pipeline
        self._enable_zero_shot = os.getenv("ENABLE_ZERO_SHOT_CLASSIFIER", "false").lower() in {
            "1", "true", "yes", "on"
        }

    def _get_pipeline(self):
        if not self._enable_zero_shot:
            return None
        if self._pipeline is None:
            logger.info("Loading zero-shot classification model…")
            try:
                from transformers import pipeline  # type: ignore
                self._pipeline = pipeline(
                    "zero-shot-classification",
                    model="facebook/bart-large-mnli",
                )
                logger.info("Classification model loaded.")
            except Exception as e:
                logger.warning("Could not load classification model: %s", e)
                self._pipeline = None
        return self._pipeline

    async def classify(
        self,
        document_id: UUID,
        text:        str,
    ) -> ClassificationResult:
        """
        Classify the given document text.

        Returns a ClassificationResult with the type, confidence, and
        suggested tags.
        """
        logger.info("Classification start: document_id=%s  chars=%d", document_id, len(text))

        # Fast path: keyword rules
        keyword_result = _classify_by_keywords(text)
        if keyword_result:
            doc_type, confidence = keyword_result
            logger.info("Classified by keywords: %s (%.2f)", doc_type, confidence)
            return ClassificationResult(
                document_id=document_id,
                classified_type=doc_type,
                confidence=confidence,
                suggested_tags=_build_tags(doc_type, text),
            )

        # Slow path: zero-shot classification
        pipe = self._get_pipeline()
        if pipe is not None:
            candidate_labels = [t for t, _ in _KEYWORD_RULES] + ["Other"]
            # Truncate to the first 1 000 characters for speed
            snippet = text[:1000]
            try:
                result = pipe(snippet, candidate_labels=candidate_labels)
                doc_type   = result["labels"][0]
                confidence = float(result["scores"][0])
                logger.info("Classified by model: %s (%.2f)", doc_type, confidence)
                return ClassificationResult(
                    document_id=document_id,
                    classified_type=doc_type,
                    confidence=round(confidence, 3),
                    suggested_tags=_build_tags(doc_type, text),
                )
            except Exception as e:
                logger.warning("Model classification failed: %s", e)

        # Fallback
        return ClassificationResult(
            document_id=document_id,
            classified_type="Unknown",
            confidence=0.0,
            suggested_tags=[],
        )


# ── Tag helpers ───────────────────────────────────────────────────────────────

def _build_tags(doc_type: str, text: str) -> list[str]:
    """Derive a few contextual tags from the document type and content."""
    tags = [doc_type]
    lower = text.lower()

    if re.search(r"\b(2023|2024|2025|2026)\b", lower):
        tags.append("recent")
    if "confidential" in lower:
        tags.append("confidential")
    if re.search(r"\b[a-z]+\.(pdf|doc|docx)\b", lower):
        tags.append("has-attachment")
    if "urgent" in lower or "asap" in lower:
        tags.append("urgent")

    return list(dict.fromkeys(tags))   # deduplicate, preserve order
