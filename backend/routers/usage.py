"""
routers/usage.py
Plan, subscription, and monthly usage dashboard endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from database.models import PlanTierRow, UsageDashboardRow, UserSubscriptionRow
from database.supabase_client import supabase
from services.saas_service import get_plan_tiers, get_subscription, get_usage_dashboard

router = APIRouter(prefix="/usage", tags=["Usage"])
security = HTTPBearer()


def _require_user(credentials: HTTPAuthorizationCredentials) -> str:
    token = credentials.credentials
    try:
        resp = supabase.auth.get_user(token)
    except Exception as e:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token.") from e
    if resp.user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found.")
    return str(resp.user.id)


@router.get(
    "/plans",
    response_model=list[PlanTierRow],
    summary="List available plan tiers",
)
async def list_plan_tiers():
    rows = get_plan_tiers()
    return [PlanTierRow(**row) for row in rows]


@router.get(
    "/subscription",
    response_model=UserSubscriptionRow,
    summary="Get current user's subscription",
)
async def get_user_subscription(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    user_id = _require_user(credentials)
    row = get_subscription(user_id)
    return UserSubscriptionRow(**row)


@router.get(
    "/dashboard",
    response_model=UsageDashboardRow,
    summary="Get current month's usage dashboard metrics",
)
async def usage_dashboard(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    user_id = _require_user(credentials)
    row = get_usage_dashboard(user_id)
    return UsageDashboardRow(**row)
