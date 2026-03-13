"""
routers/upload.py
──────────────────────────────────────────────────────────────────────────────
File upload endpoint.

Workflow
─────────
1. Validate file type & size against env limits.
2. Stream file to Supabase Storage (bucket = SUPABASE_BUCKET env var).
3. Insert a metadata row into the `documents` table.
4. Return the new document record.

Endpoint
─────────
POST /upload
"""

import os
import uuid
from datetime import datetime, timezone
from typing import Annotated

from fastapi import (
    APIRouter, Depends, File, HTTPException, UploadFile, status
)
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from database.models import DocumentRow, FileType, ProcessingStatus
from database.supabase_client import service_supabase, supabase
from services.saas_service import consume_upload_quota

router  = APIRouter(prefix="", tags=["Upload"])
security = HTTPBearer()

# ── Read limits once at import time ──────────────────────────────────────────
_MAX_BYTES: int = int(os.getenv("MAX_FILE_SIZE_BYTES", 10 * 1024 * 1024))   # 10 MB
_BUCKET:    str = os.getenv("SUPABASE_BUCKET", "documents")

_ALLOWED_TYPES: dict[str, FileType] = {
    "application/pdf":  FileType.PDF,
    "image/png":        FileType.PNG,
    "image/jpeg":       FileType.JPG,
    "application/msword": FileType.DOC,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": FileType.DOCX,
}


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _get_current_user_id(
    credentials: HTTPAuthorizationCredentials,
) -> str:
    """Validate the bearer token and return the Supabase user ID."""
    token = credentials.credentials
    try:
        response = supabase.auth.get_user(token)
    except Exception as e:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "Invalid or expired token.",
        ) from e

    if response.user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Could not identify user.")

    return str(response.user.id)


# ─── Route ────────────────────────────────────────────────────────────────────

@router.post(
    "/upload",
    response_model=DocumentRow,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a document",
    description=(
        "Accepts PDF, PNG, JPG, DOC, or DOCX files up to 10 MB. "
        "Stores the file in Supabase Storage and creates a document record "
        "with `processing_status = 'pending'`."
    ),
)
async def upload_document(
    file: Annotated[UploadFile, File(description="Document file to upload")],
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    # 1. Authenticate
    user_id = _get_current_user_id(credentials)

    # 2. Validate MIME type
    content_type = file.content_type or ""
    if content_type not in _ALLOWED_TYPES:
        raise HTTPException(
            status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            f"File type '{content_type}' is not supported. "
            f"Allowed: {', '.join(_ALLOWED_TYPES.keys())}",
        )
    file_type = _ALLOWED_TYPES[content_type]

    # 3. Read & validate size
    content = await file.read()
    if len(content) > _MAX_BYTES:
        mb = _MAX_BYTES / (1024 * 1024)
        raise HTTPException(
            status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            f"File exceeds the maximum allowed size of {mb:.0f} MB.",
        )

    # 4. Generate a unique storage path
    doc_id       = str(uuid.uuid4())
    ext          = file.filename.rsplit(".", 1)[-1] if file.filename else file_type.value
    storage_path = f"{user_id}/{doc_id}.{ext}"

    # 5. Upload to Supabase Storage (using service client to bypass RLS)
    try:
        service_supabase.storage.from_(_BUCKET).upload(
            path=storage_path,
            file=content,
            file_options={"content-type": content_type},
        )
    except Exception as e:
        raise HTTPException(
            status.HTTP_502_BAD_GATEWAY,
            f"Storage upload failed: {e}",
        ) from e

    # 6. Build the canonical storage URL (used as object locator later)
    public_url = service_supabase.storage.from_(_BUCKET).get_public_url(storage_path)
    storage_url: str = public_url if isinstance(public_url, str) else public_url.get("publicUrl", "")

    # 7. Insert metadata row
    row = {
        "id":                doc_id,
        "user_id":           user_id,
        "filename":          file.filename or f"document.{ext}",
        "file_type":         file_type.value,
        "upload_time":       datetime.now(tz=timezone.utc).isoformat(),
        "processing_status": ProcessingStatus.PENDING.value,
        "storage_url":       storage_url,
        "file_size_bytes":   len(content),
    }

    try:
        # Token identity was already verified; service role write avoids per-request session mutation.
        result = service_supabase.table("documents").insert(row).execute()
    except Exception as e:
        # Attempt to clean up orphaned storage object
        try:
            service_supabase.storage.from_(_BUCKET).remove([storage_path])
        except Exception:
            pass
        raise HTTPException(
            status.HTTP_502_BAD_GATEWAY,
            f"Database insert failed: {e}",
        ) from e

    if not result.data:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "No data returned from insert.")

    # 8. Enforce monthly upload quota after a successful insert.
    # If user exceeded quota, roll back DB row + storage object.
    try:
        consume_upload_quota(user_id=user_id, count=1)
    except HTTPException:
        try:
            (
                service_supabase.table("documents")
                .delete()
                .eq("id", doc_id)
                .eq("user_id", user_id)
                .execute()
            )
        except Exception:
            pass
        try:
            service_supabase.storage.from_(_BUCKET).remove([storage_path])
        except Exception:
            pass
        raise

    return DocumentRow(**result.data[0])
