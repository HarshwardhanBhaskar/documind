"""
Document AI processing pipeline endpoints.

Endpoints
- POST /process-document        -> synchronous full pipeline
- POST /process-document-async  -> queue background processing job
- GET  /jobs/{job_id}           -> poll async job status
- POST /ocr                     -> OCR only
- POST /classify-document       -> classification only
- POST /extract-fields          -> extraction only
"""

import asyncio
import logging
import os
from datetime import datetime, timezone
from time import perf_counter
from typing import Any, Callable
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from database.models import (
    AsyncProcessResponse,
    ClassificationResult,
    ExtractionResult,
    JobStatus,
    OcrResult,
    PipelineResult,
    ProcessingJobRow,
    ProcessingStatus,
    ProcessRequest,
)
from database.supabase_client import service_supabase, supabase
from services.classification_service import ClassificationService
from services.extraction_service import ExtractionService
from services.ocr_service import OcrService
from services.saas_service import consume_processing_credit, record_processing_outcome

router = APIRouter(tags=["Processing"])
security = HTTPBearer()
logger = logging.getLogger(__name__)

# Service singletons (lazy-initialized inside each route to avoid slowing startup)
_ocr_svc: OcrService | None = None
_cls_svc: ClassificationService | None = None
_ext_svc: ExtractionService | None = None
_OCR_SUPPORTED_TYPES = {"pdf", "png", "jpg", "jpeg"}
_STALE_PROCESSING_MINUTES = int(os.getenv("STALE_PROCESSING_MINUTES", "20"))


def _get_ocr() -> OcrService:
    global _ocr_svc
    if _ocr_svc is None:
        _ocr_svc = OcrService()
    return _ocr_svc


def _get_cls() -> ClassificationService:
    global _cls_svc
    if _cls_svc is None:
        _cls_svc = ClassificationService()
    return _cls_svc


def _get_ext() -> ExtractionService:
    global _ext_svc
    if _ext_svc is None:
        _ext_svc = ExtractionService()
    return _ext_svc


def _ensure_supported_ocr_type(file_type: str) -> str:
    normalized = file_type.lower()
    if normalized not in _OCR_SUPPORTED_TYPES:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            f"File type '{file_type}' is not supported for AI processing yet. "
            "Supported: pdf, png, jpg, jpeg.",
        )
    return normalized


def _is_stale_processing(doc: dict[str, Any]) -> bool:
    if doc.get("processing_status") != ProcessingStatus.PROCESSING.value:
        return False

    # If any output already exists, assume active/partial work and avoid override.
    if doc.get("ocr_text") or doc.get("classified_type") or doc.get("extracted_fields"):
        return False

    upload_time = doc.get("upload_time")
    if not upload_time:
        return False
    try:
        ts = datetime.fromisoformat(str(upload_time).replace("Z", "+00:00"))
    except ValueError:
        return False

    return (datetime.now(timezone.utc) - ts).total_seconds() > (_STALE_PROCESSING_MINUTES * 60)


def _require_user(credentials: HTTPAuthorizationCredentials) -> str:
    token = credentials.credentials
    try:
        resp = supabase.auth.get_user(token)
    except Exception as e:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token.") from e
    if resp.user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found.")
    return str(resp.user.id)


def _fetch_document(doc_id: UUID, user_id: str) -> dict[str, Any]:
    try:
        resp = (
            service_supabase.table("documents")
            .select("*")
            .eq("id", str(doc_id))
            .eq("user_id", user_id)
            .single()
            .execute()
        )
    except Exception as e:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, str(e)) from e

    if not resp.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found.")

    return resp.data


def _update_document(doc_id: UUID, user_id: str, updates: dict[str, Any]) -> None:
    try:
        (
            service_supabase.table("documents")
            .update(updates)
            .eq("id", str(doc_id))
            .eq("user_id", user_id)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, str(e)) from e


def _fetch_job(job_id: UUID, user_id: str) -> dict[str, Any]:
    try:
        resp = (
            service_supabase.table("processing_jobs")
            .select("*")
            .eq("id", str(job_id))
            .eq("user_id", user_id)
            .single()
            .execute()
        )
    except Exception as e:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, str(e)) from e

    if not resp.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Processing job not found.")
    return resp.data


def _create_job(doc_id: UUID, user_id: str) -> UUID:
    now = datetime.now(timezone.utc).isoformat()
    payload = {
        "document_id": str(doc_id),
        "user_id": user_id,
        "status": JobStatus.PENDING.value,
        "progress": 0,
        "step": "Queued",
        "created_at": now,
        "updated_at": now,
    }
    try:
        resp = service_supabase.table("processing_jobs").insert(payload).execute()
    except Exception as e:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, str(e)) from e

    rows = resp.data or []
    if not rows or not rows[0].get("id"):
        raise HTTPException(
            status.HTTP_502_BAD_GATEWAY,
            "Could not create processing job.",
        )
    return UUID(str(rows[0]["id"]))


def _update_job(job_id: UUID, user_id: str, updates: dict[str, Any]) -> None:
    payload = {
        **updates,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    try:
        (
            service_supabase.table("processing_jobs")
            .update(payload)
            .eq("id", str(job_id))
            .eq("user_id", user_id)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, str(e)) from e


def _safe_update_job(job_id: UUID, user_id: str, updates: dict[str, Any]) -> None:
    try:
        _update_job(job_id, user_id, updates)
    except Exception as exc:  # pragma: no cover - best effort logging only
        logger.warning("Failed to update job %s: %s", job_id, exc)


def _ensure_document_ready_for_processing(doc_id: UUID, user_id: str) -> dict[str, Any]:
    doc = _fetch_document(doc_id, user_id)
    if doc.get("processing_status") == ProcessingStatus.PROCESSING.value:
        if _is_stale_processing(doc):
            _update_document(doc_id, user_id, {"processing_status": ProcessingStatus.PENDING.value})
            doc["processing_status"] = ProcessingStatus.PENDING.value
        else:
            raise HTTPException(status.HTTP_409_CONFLICT, "Document is already being processed.")
    return doc


async def _run_pipeline(
    document_id: UUID,
    user_id: str,
    doc: dict[str, Any],
    on_progress: Callable[[int, str], None] | None = None,
) -> PipelineResult:
    storage_url = doc.get("storage_url", "")
    file_type = _ensure_supported_ocr_type(doc.get("file_type", "pdf"))

    _update_document(document_id, user_id, {"processing_status": ProcessingStatus.PROCESSING.value})

    if on_progress:
        on_progress(10, "Running OCR")

    try:
        ocr_result = await _get_ocr().extract(
            document_id=document_id,
            storage_url=storage_url,
            file_type=file_type,
        )

        if on_progress:
            on_progress(60, "Classifying document")

        cls_result = await _get_cls().classify(
            document_id=document_id,
            text=ocr_result.raw_text,
        )

        if on_progress:
            on_progress(85, "Extracting fields")

        ext_result = await _get_ext().extract(
            document_id=document_id,
            text=ocr_result.raw_text,
            document_type=cls_result.classified_type,
        )

        _update_document(
            document_id,
            user_id,
            {
                "processing_status": ProcessingStatus.COMPLETED.value,
                "ocr_text": ocr_result.raw_text,
                "classified_type": cls_result.classified_type,
                "extracted_fields": ext_result.extracted_fields,
                "page_count": ocr_result.page_count,
            },
        )

        if on_progress:
            on_progress(100, "Completed")

        return PipelineResult(
            document_id=document_id,
            ocr=ocr_result,
            classification=cls_result,
            extraction=ext_result,
            status=ProcessingStatus.COMPLETED,
        )
    except HTTPException:
        _update_document(document_id, user_id, {"processing_status": ProcessingStatus.FAILED.value})
        raise
    except ValueError as e:
        _update_document(document_id, user_id, {"processing_status": ProcessingStatus.FAILED.value})
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, str(e)) from e
    except Exception as e:
        _update_document(document_id, user_id, {"processing_status": ProcessingStatus.FAILED.value})
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, str(e)) from e


async def _run_pipeline_job(job_id: UUID, doc_id: UUID, user_id: str) -> None:
    started = perf_counter()
    _safe_update_job(
        job_id,
        user_id,
        {
            "status": JobStatus.PROCESSING.value,
            "progress": 5,
            "step": "Starting",
            "error": None,
        },
    )

    try:
        doc = _fetch_document(doc_id, user_id)
        result = await _run_pipeline(
            document_id=doc_id,
            user_id=user_id,
            doc=doc,
            on_progress=lambda progress, step: _safe_update_job(
                job_id,
                user_id,
                {"progress": progress, "step": step},
            ),
        )
        _safe_update_job(
            job_id,
            user_id,
            {
                "status": JobStatus.COMPLETED.value,
                "progress": 100,
                "step": "Completed",
                "result": result.model_dump(mode="json"),
                "error": None,
            },
        )
        duration_ms = int((perf_counter() - started) * 1000)
        record_processing_outcome(user_id=user_id, success=True, duration_ms=duration_ms)
    except HTTPException as exc:
        duration_ms = int((perf_counter() - started) * 1000)
        record_processing_outcome(user_id=user_id, success=False, duration_ms=duration_ms)
        detail = str(exc.detail) if exc.detail else str(exc)
        _safe_update_job(
            job_id,
            user_id,
            {
                "status": JobStatus.FAILED.value,
                "progress": 100,
                "step": "Failed",
                "error": detail,
            },
        )
    except Exception as exc:
        duration_ms = int((perf_counter() - started) * 1000)
        record_processing_outcome(user_id=user_id, success=False, duration_ms=duration_ms)
        _safe_update_job(
            job_id,
            user_id,
            {
                "status": JobStatus.FAILED.value,
                "progress": 100,
                "step": "Failed",
                "error": str(exc),
            },
        )


@router.post(
    "/process-document",
    response_model=PipelineResult,
    summary="Run the full AI pipeline on a document",
    description=(
        "Executes OCR -> classification -> field extraction sequentially "
        "and saves all results to the database."
    ),
)
async def process_document(
    body: ProcessRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    user_id = _require_user(credentials)
    doc = _ensure_document_ready_for_processing(body.document_id, user_id)
    consume_processing_credit(user_id=user_id, count=1)
    started = perf_counter()
    try:
        result = await _run_pipeline(
            document_id=body.document_id,
            user_id=user_id,
            doc=doc,
        )
    except Exception:
        duration_ms = int((perf_counter() - started) * 1000)
        record_processing_outcome(user_id=user_id, success=False, duration_ms=duration_ms)
        raise

    duration_ms = int((perf_counter() - started) * 1000)
    record_processing_outcome(user_id=user_id, success=True, duration_ms=duration_ms)
    return result


@router.post(
    "/process-document-async",
    response_model=AsyncProcessResponse,
    summary="Queue background AI processing for a document",
)
async def process_document_async(
    body: ProcessRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    user_id = _require_user(credentials)
    _ensure_document_ready_for_processing(body.document_id, user_id)

    job_id = _create_job(body.document_id, user_id)
    try:
        consume_processing_credit(user_id=user_id, count=1)
    except HTTPException:
        try:
            (
                service_supabase.table("processing_jobs")
                .delete()
                .eq("id", str(job_id))
                .eq("user_id", user_id)
                .execute()
            )
        except Exception:
            pass
        raise

    _safe_update_job(
        job_id,
        user_id,
        {
            "status": JobStatus.PROCESSING.value,
            "progress": 5,
            "step": "Queued",
        },
    )
    _update_document(body.document_id, user_id, {"processing_status": ProcessingStatus.PROCESSING.value})
    asyncio.create_task(_run_pipeline_job(job_id, body.document_id, user_id))
    return AsyncProcessResponse(job_id=job_id, status=JobStatus.PROCESSING)


@router.get(
    "/jobs/{job_id}",
    response_model=ProcessingJobRow,
    summary="Get async processing job status",
)
async def get_job_status(
    job_id: UUID,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    user_id = _require_user(credentials)
    job = _fetch_job(job_id, user_id)
    return ProcessingJobRow(**job)


@router.post(
    "/ocr",
    response_model=OcrResult,
    summary="Run OCR on an uploaded document",
)
async def run_ocr(
    body: ProcessRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    user_id = _require_user(credentials)
    doc = _fetch_document(body.document_id, user_id)
    file_type = _ensure_supported_ocr_type(doc.get("file_type", "pdf"))

    try:
        result = await _get_ocr().extract(
            document_id=body.document_id,
            storage_url=doc.get("storage_url", ""),
            file_type=file_type,
        )
    except ValueError as e:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, str(e)) from e

    _update_document(body.document_id, user_id, {"ocr_text": result.raw_text, "page_count": result.page_count})
    return result


@router.post(
    "/classify-document",
    response_model=ClassificationResult,
    summary="Classify a document by type",
)
async def classify_document(
    body: ProcessRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    user_id = _require_user(credentials)
    doc = _fetch_document(body.document_id, user_id)
    text: str = doc.get("ocr_text") or ""
    if not text:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Document has no OCR text. Run /ocr first.",
        )

    result = await _get_cls().classify(document_id=body.document_id, text=text)
    _update_document(body.document_id, user_id, {"classified_type": result.classified_type})
    return result


@router.post(
    "/extract-fields",
    response_model=ExtractionResult,
    summary="Extract structured fields from a document",
)
async def extract_fields(
    body: ProcessRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    user_id = _require_user(credentials)
    doc = _fetch_document(body.document_id, user_id)
    text: str = doc.get("ocr_text") or ""
    document_type: str = doc.get("classified_type") or "Unknown"

    if not text:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Document has no OCR text. Run /ocr first.",
        )

    result = await _get_ext().extract(
        document_id=body.document_id,
        text=text,
        document_type=document_type,
    )
    _update_document(body.document_id, user_id, {"extracted_fields": result.extracted_fields})
    return result
