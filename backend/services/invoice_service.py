import re
from datetime import datetime
from typing import Any
from uuid import UUID

from database.models import ReviewStatus
from database.supabase_client import service_supabase

INVOICE_EXPORT_FIELDS = [
    "vendor",
    "invoice_no",
    "invoice_date",
    "due_date",
    "po_number",
    "subtotal",
    "tax",
    "total",
    "currency",
    "client",
]

_FIELD_ALIASES: dict[str, tuple[str, ...]] = {
    "vendor": ("vendor", "supplier", "billed_by", "company", "store_name"),
    "invoice_no": ("invoice_no", "invoice_number", "invoice_id", "receipt_no"),
    "invoice_date": ("invoice_date", "date", "issued_on"),
    "due_date": ("due_date", "payment_due"),
    "po_number": ("po_number", "po_no", "purchase_order", "purchase_order_no"),
    "subtotal": ("subtotal", "sub_total"),
    "tax": ("tax", "vat", "gst"),
    "total": ("total", "amount", "amount_due", "grand_total"),
    "currency": ("currency",),
    "client": ("client", "customer", "bill_to"),
}


def normalize_invoice_fields(fields: dict[str, Any] | None) -> dict[str, str]:
    source = fields or {}
    normalized: dict[str, str] = {}

    for target_field, aliases in _FIELD_ALIASES.items():
        for alias in aliases:
            value = source.get(alias)
            if value is None:
                continue
            text = str(value).strip()
            if text:
                normalized[target_field] = text
                break

    if "currency" not in normalized:
        for candidate in (normalized.get("total"), normalized.get("subtotal"), normalized.get("tax")):
            inferred = _infer_currency(candidate)
            if inferred:
                normalized["currency"] = inferred
                break

    return normalized


def validate_invoice_fields(fields: dict[str, str]) -> list[str]:
    flags: list[str] = []

    for required_field in ("vendor", "invoice_no", "invoice_date", "total"):
        if not fields.get(required_field):
            flags.append(f"missing_{required_field}")

    if fields.get("total") and _parse_amount(fields["total"]) is None:
        flags.append("invalid_total")

    invoice_date = _parse_date(fields.get("invoice_date"))
    due_date = _parse_date(fields.get("due_date"))
    if fields.get("invoice_date") and invoice_date is None:
        flags.append("invalid_invoice_date")
    if fields.get("due_date") and due_date is None:
        flags.append("invalid_due_date")
    if invoice_date and due_date and due_date < invoice_date:
        flags.append("due_date_before_invoice_date")

    return flags


def recommend_review_status(flags: list[str], duplicate_detected: bool) -> ReviewStatus:
    if duplicate_detected or flags:
        return ReviewStatus.NEEDS_REVIEW
    return ReviewStatus.NEW


def find_duplicate_invoice(
    *,
    user_id: str,
    document_id: UUID,
    fields: dict[str, str],
) -> bool:
    vendor = _normalize_token(fields.get("vendor"))
    invoice_no = _normalize_token(fields.get("invoice_no"))
    total = _normalize_amount(fields.get("total"))

    if not vendor or not invoice_no or not total:
        return False

    response = (
        service_supabase.table("documents")
        .select("id, extracted_fields, classified_type")
        .eq("user_id", user_id)
        .eq("classified_type", "Invoice")
        .neq("id", str(document_id))
        .execute()
    )

    for row in response.data or []:
        comparison = normalize_invoice_fields(row.get("extracted_fields") or {})
        if (
            _normalize_token(comparison.get("vendor")) == vendor
            and _normalize_token(comparison.get("invoice_no")) == invoice_no
            and _normalize_amount(comparison.get("total")) == total
        ):
            return True

    return False


def build_invoice_export_rows(rows: list[dict[str, Any]]) -> list[dict[str, str]]:
    export_rows: list[dict[str, str]] = []
    for row in rows:
        normalized = normalize_invoice_fields(row.get("extracted_fields") or {})
        export_rows.append(
            {
                "document_id": str(row.get("id", "")),
                "filename": str(row.get("filename", "")),
                "uploaded_at": str(row.get("upload_time", "")),
                "review_status": str(row.get("review_status", "")),
                "duplicate_detected": str(bool(row.get("duplicate_detected", False))).lower(),
                "issue_flags": ", ".join(row.get("invoice_issue_flags") or []),
                "review_notes": str(row.get("review_notes", "") or ""),
                **{field: normalized.get(field, "") for field in INVOICE_EXPORT_FIELDS},
            }
        )
    return export_rows


def _infer_currency(value: str | None) -> str | None:
    if not value:
        return None
    if "$" in value:
        return "USD"
    if "EUR" in value or "€" in value:
        return "EUR"
    if "GBP" in value or "£" in value:
        return "GBP"
    if "INR" in value or "Rs" in value or "₹" in value:
        return "INR"
    return None


def _parse_amount(value: str | None) -> float | None:
    if not value:
        return None
    cleaned = re.sub(r"[^0-9.\-]", "", value)
    if cleaned.count(".") > 1 or not cleaned:
        return None
    try:
        return round(float(cleaned), 2)
    except ValueError:
        return None


def _normalize_amount(value: str | None) -> str | None:
    parsed = _parse_amount(value)
    return None if parsed is None else f"{parsed:.2f}"


def _parse_date(value: str | None) -> datetime | None:
    if not value:
        return None

    for pattern in ("%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y", "%Y-%m-%d", "%B %d, %Y", "%b %d, %Y"):
        try:
            return datetime.strptime(value.strip(), pattern)
        except ValueError:
            continue
    return None


def _normalize_token(value: str | None) -> str:
    if not value:
        return ""
    return re.sub(r"[^a-z0-9]", "", value.lower())
