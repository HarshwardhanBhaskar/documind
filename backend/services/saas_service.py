"""
services/saas_service.py
Helpers for plan tiers, monthly quotas, and usage analytics.
"""

from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException, status

from database.supabase_client import service_supabase


def _current_month_start_iso() -> str:
    return datetime.now(timezone.utc).date().replace(day=1).isoformat()


def _rpc(name: str, params: dict[str, Any]) -> Any:
    try:
        resp = service_supabase.rpc(name, params).execute()
    except Exception as e:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, f"RPC '{name}' failed: {e}") from e
    return resp.data


def consume_upload_quota(user_id: str, count: int = 1) -> dict[str, Any]:
    data = _rpc("try_consume_upload", {"p_user_id": user_id, "p_count": count}) or {}
    if not data.get("allowed", False):
        raise HTTPException(
            status.HTTP_402_PAYMENT_REQUIRED,
            {
                "reason": data.get("reason", "upload_quota_exceeded"),
                "used": data.get("used", 0),
                "limit": data.get("limit", 0),
                "message": "Monthly upload quota exceeded for your current plan.",
            },
        )
    return data


def consume_processing_credit(user_id: str, count: int = 1) -> dict[str, Any]:
    data = _rpc("try_consume_processing_credit", {"p_user_id": user_id, "p_count": count}) or {}
    if not data.get("allowed", False):
        raise HTTPException(
            status.HTTP_402_PAYMENT_REQUIRED,
            {
                "reason": data.get("reason", "processing_credit_exceeded"),
                "used": data.get("used", 0),
                "limit": data.get("limit", 0),
                "message": "Monthly processing credits exceeded for your current plan.",
            },
        )
    return data


def record_processing_outcome(user_id: str, success: bool, duration_ms: int) -> None:
    # Best effort metric write; failures should not break request handling.
    try:
        _rpc(
            "record_processing_outcome",
            {
                "p_user_id": user_id,
                "p_success": success,
                "p_duration_ms": max(0, int(duration_ms)),
            },
        )
    except Exception:
        pass


def get_plan_tiers() -> list[dict[str, Any]]:
    try:
        resp = service_supabase.table("plan_tiers").select("*").order("id").execute()
    except Exception as e:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, str(e)) from e
    return resp.data or []


def get_subscription(user_id: str) -> dict[str, Any]:
    # Ensure there is at least a default subscription row.
    try:
        service_supabase.table("user_subscriptions").upsert(
            {"user_id": user_id, "plan_id": "free"},
            on_conflict="user_id",
            ignore_duplicates=True,
        ).execute()
    except Exception:
        pass

    try:
        resp = (
            service_supabase.table("user_subscriptions")
            .select("*")
            .eq("user_id", user_id)
            .single()
            .execute()
        )
    except Exception as e:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, str(e)) from e

    if not resp.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Subscription not found.")
    return resp.data


def get_usage_dashboard(user_id: str) -> dict[str, Any]:
    month_start = _current_month_start_iso()
    _rpc("ensure_usage_row", {"p_user_id": user_id, "p_month": month_start})

    try:
        resp = (
            service_supabase.table("user_usage_dashboard")
            .select("*")
            .eq("user_id", user_id)
            .eq("month_start", month_start)
            .limit(1)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, str(e)) from e

    rows = resp.data or []
    if not rows:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Usage dashboard row not found.")
    return rows[0]
