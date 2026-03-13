"""
routers/documents.py
──────────────────────────────────────────────────────────────────────────────
User dashboard document CRUD endpoints.

Endpoints
─────────
GET    /documents            – paginated list (user's own documents)
GET    /documents/{id}       – full detail including AI results
DELETE /documents/{id}       – delete document + Storage object
"""

import os
import re
from uuid import UUID

from fastapi import (
    APIRouter, Depends, HTTPException, Query, status
)
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from database.models import (
    DocumentDetail, MessageResponse, PaginatedDocuments, DocumentSummary
)
from database.supabase_client import service_supabase, supabase

router   = APIRouter(prefix="/documents", tags=["Documents"])
security = HTTPBearer()
_BUCKET  = os.getenv("SUPABASE_BUCKET", "documents")


# ─── Auth helper (reused from upload router) ──────────────────────────────────

def _require_user(credentials: HTTPAuthorizationCredentials) -> str:
    token = credentials.credentials
    try:
        resp = supabase.auth.get_user(token)
    except Exception as e:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token.") from e
    if resp.user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found.")
    return str(resp.user.id)


def _extract_storage_path(storage_url: str) -> str | None:
    """Pull the storage path from Supabase public/sign/authenticated URLs."""
    match = re.search(r"/object/(?:public|sign|authenticated)/[^/]+/(.+)$", storage_url)
    return match.group(1) if match else None


# ─── Routes ───────────────────────────────────────────────────────────────────

@router.get(
    "",
    response_model=PaginatedDocuments,
    summary="List the current user's documents",
)
async def list_documents(
    page:      int = Query(1,  ge=1,  description="Page number (1-indexed)"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    Returns a paginated list of documents owned by the authenticated user,
    ordered by most recent upload first.
    """
    user_id = _require_user(credentials)
    offset  = (page - 1) * page_size

    try:
        # Count
        count_resp = (
            service_supabase.table("documents")
            .select("id", count="exact")
            .eq("user_id", user_id)
            .execute()
        )
        total = count_resp.count or 0

        # Data
        data_resp = (
            service_supabase.table("documents")
            .select(
                "id, filename, file_type, upload_time, "
                "processing_status, storage_url"
            )
            .eq("user_id", user_id)
            .order("upload_time", desc=True)
            .range(offset, offset + page_size - 1)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, str(e)) from e

    items = [DocumentSummary(**row) for row in (data_resp.data or [])]
    return PaginatedDocuments(
        total=total, page=page, page_size=page_size, items=items
    )


@router.get(
    "/{document_id}",
    response_model=DocumentDetail,
    summary="Get full document detail including AI results",
)
async def get_document(
    document_id: UUID,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    user_id = _require_user(credentials)
    try:
        resp = (
            service_supabase.table("documents")
            .select("*")
            .eq("id", str(document_id))
            .eq("user_id", user_id)
            .single()
            .execute()
        )
    except Exception as e:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, str(e)) from e

    if not resp.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found.")

    return DocumentDetail(**resp.data)


@router.delete(
    "/{document_id}",
    response_model=MessageResponse,
    summary="Delete a document and its stored file",
)
async def delete_document(
    document_id: UUID,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    user_id = _require_user(credentials)

    # 1. Fetch the document (verifies ownership via user_id filter)
    try:
        resp = (
            service_supabase.table("documents")
            .select("id, storage_url")
            .eq("id", str(document_id))
            .eq("user_id", user_id)
            .single()
            .execute()
        )
    except Exception as e:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, str(e)) from e

    if not resp.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found.")

    # 2. Delete the Storage object (best-effort)
    storage_url = resp.data.get("storage_url", "")
    if storage_url:
        path = _extract_storage_path(storage_url)
        if path:
            try:
                service_supabase.storage.from_(_BUCKET).remove([path])
            except Exception:
                pass  # Log in production; don't block DB delete

    # 3. Delete the database row
    try:
        (
            service_supabase.table("documents")
            .delete()
            .eq("id", str(document_id))
            .eq("user_id", user_id)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, str(e)) from e

    return MessageResponse(message=f"Document {document_id} deleted successfully.")
