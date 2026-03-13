"""
database/models.py
──────────────────────────────────────────────────────────────────────────────
Pydantic v2 models that represent database rows, request payloads, and API
responses.  These act as the single source of truth for schema validation
across routers and services.

SQL reference (run in Supabase SQL editor to create the tables):
──────────────────────────────────────────────────────────────────
create table public.documents (
    id              uuid primary key default gen_random_uuid(),
    user_id         uuid not null references auth.users(id) on delete cascade,
    filename        text not null,
    file_type       text not null,
    upload_time     timestamptz not null default now(),
    processing_status text not null default 'pending',
    storage_url     text,
    ocr_text        text,
    classified_type text,
    extracted_fields jsonb,
    file_size_bytes bigint,
    page_count      int
);

alter table public.documents enable row level security;

-- Users can only see / modify their own documents
create policy "owner access" on public.documents
    using (auth.uid() = user_id);
──────────────────────────────────────────────────────────────────
"""

from datetime import date, datetime
from enum import Enum
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


# ─── Enums ────────────────────────────────────────────────────────────────────

class ProcessingStatus(str, Enum):
    PENDING    = "pending"
    PROCESSING = "processing"
    COMPLETED  = "completed"
    FAILED     = "failed"


class JobStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class FileType(str, Enum):
    PDF  = "pdf"
    PNG  = "png"
    JPG  = "jpg"
    JPEG = "jpeg"
    DOC  = "doc"
    DOCX = "docx"


# ─── Auth models ──────────────────────────────────────────────────────────────

class SignUpRequest(BaseModel):
    email:    str = Field(..., examples=["user@example.com"])
    password: str = Field(..., min_length=8)
    full_name: str | None = None


class LoginRequest(BaseModel):
    email:    str
    password: str


class TokenResponse(BaseModel):
    access_token:  str
    token_type:    str = "bearer"
    expires_in:    int
    refresh_token: str | None = None
    user_id:       str


class UserResponse(BaseModel):
    id:         str
    email:      str
    full_name:  str | None = None
    created_at: datetime | None = None


# ─── Document models ──────────────────────────────────────────────────────────

class DocumentBase(BaseModel):
    filename:    str
    file_type:   FileType
    storage_url: str | None = None


class DocumentCreate(DocumentBase):
    user_id:         UUID
    file_size_bytes: int | None = None


class DocumentRow(DocumentBase):
    """Mirrors the `documents` table row 1-to-1."""
    id:                UUID
    user_id:           UUID
    upload_time:       datetime
    processing_status: ProcessingStatus = ProcessingStatus.PENDING
    ocr_text:          str | None = None
    classified_type:   str | None = None
    extracted_fields:  dict[str, Any] | None = None
    file_size_bytes:   int | None = None
    page_count:        int | None = None

    class Config:
        from_attributes = True


class DocumentSummary(BaseModel):
    """Lightweight version returned in list endpoints."""
    id:                UUID
    filename:          str
    file_type:         FileType
    upload_time:       datetime
    processing_status: ProcessingStatus
    storage_url:       str | None = None


class DocumentDetail(DocumentRow):
    """Full document including AI results."""
    pass


# ─── Processing models ────────────────────────────────────────────────────────

class ProcessRequest(BaseModel):
    document_id: UUID


class OcrResult(BaseModel):
    document_id: UUID
    raw_text:    str
    confidence:  float | None = None
    page_count:  int | None = None


class ClassificationResult(BaseModel):
    document_id:      UUID
    classified_type:  str          # e.g. "Invoice", "Contract", "Report"
    confidence:       float
    suggested_tags:   list[str] = []


class ExtractionResult(BaseModel):
    document_id:      UUID
    extracted_fields: dict[str, Any]   # e.g. {"vendor": "Acme", "amount": 1200}


class PipelineResult(BaseModel):
    document_id:  UUID
    ocr:          OcrResult
    classification: ClassificationResult
    extraction:   ExtractionResult
    status:       ProcessingStatus = ProcessingStatus.COMPLETED


class ProcessingJobRow(BaseModel):
    id: UUID
    user_id: UUID
    document_id: UUID
    status: JobStatus
    progress: int = 0
    step: str | None = None
    error: str | None = None
    result: dict[str, Any] | None = None
    created_at: datetime
    updated_at: datetime


class AsyncProcessResponse(BaseModel):
    job_id: UUID
    status: JobStatus


class PlanTierRow(BaseModel):
    id: str
    name: str
    monthly_upload_limit: int
    monthly_processing_credits: int
    feature_flags: dict[str, Any] = {}
    created_at: datetime | None = None


class UserSubscriptionRow(BaseModel):
    user_id: UUID
    plan_id: str
    status: str
    started_at: datetime | None = None
    current_period_start: date | None = None
    current_period_end: date | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class UsageDashboardRow(BaseModel):
    user_id: UUID
    month_start: date
    plan_id: str
    monthly_upload_limit: int
    monthly_processing_credits: int
    uploads_count: int
    credits_used: int
    processed_success: int
    processed_failed: int
    success_rate_percent: float
    avg_processing_seconds: float


# ─── Generic response wrappers ────────────────────────────────────────────────

class MessageResponse(BaseModel):
    message: str
    detail:  str | None = None


class PaginatedDocuments(BaseModel):
    total:     int
    page:      int
    page_size: int
    items:     list[DocumentSummary]
