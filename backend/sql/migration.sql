-- ============================================================
-- DocuMind - Supabase SQL Migration
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================

-- 1) Documents table
create table if not exists public.documents (
    id                uuid primary key default gen_random_uuid(),
    user_id           uuid not null references auth.users(id) on delete cascade,
    filename          text not null,
    file_type         text not null check (file_type in ('pdf','png','jpg','jpeg','doc','docx')),
    upload_time       timestamptz not null default now(),
    processing_status text not null default 'pending'
                        check (processing_status in ('pending','processing','completed','failed')),
    storage_url       text,
    ocr_text          text,
    classified_type   text,
    extracted_fields  jsonb,
    file_size_bytes   bigint,
    page_count        int
);

-- 2) Document indexes
create index if not exists documents_user_id_idx
    on public.documents(user_id);

create index if not exists documents_upload_time_idx
    on public.documents(upload_time desc);

create index if not exists documents_status_idx
    on public.documents(processing_status);

-- 3) Document RLS policies
alter table public.documents enable row level security;

drop policy if exists "Users can view own documents" on public.documents;
create policy "Users can view own documents"
    on public.documents
    for select
    using (auth.uid() = user_id);

drop policy if exists "Users can insert own documents" on public.documents;
create policy "Users can insert own documents"
    on public.documents
    for insert
    with check (auth.uid() = user_id);

drop policy if exists "Users can update own documents" on public.documents;
create policy "Users can update own documents"
    on public.documents
    for update
    using (auth.uid() = user_id);

drop policy if exists "Users can delete own documents" on public.documents;
create policy "Users can delete own documents"
    on public.documents
    for delete
    using (auth.uid() = user_id);

-- Service role bypasses RLS (used by the FastAPI backend).

-- 4) Async processing jobs table
create table if not exists public.processing_jobs (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references auth.users(id) on delete cascade,
    document_id uuid not null references public.documents(id) on delete cascade,
    status      text not null default 'pending'
                    check (status in ('pending','processing','completed','failed')),
    progress    int not null default 0 check (progress >= 0 and progress <= 100),
    step        text,
    error       text,
    result      jsonb,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

create index if not exists processing_jobs_user_id_idx
    on public.processing_jobs(user_id, created_at desc);

create index if not exists processing_jobs_document_id_idx
    on public.processing_jobs(document_id);

alter table public.processing_jobs enable row level security;

drop policy if exists "Users can view own processing jobs" on public.processing_jobs;
create policy "Users can view own processing jobs"
    on public.processing_jobs
    for select
    using (auth.uid() = user_id);

drop policy if exists "Users can insert own processing jobs" on public.processing_jobs;
create policy "Users can insert own processing jobs"
    on public.processing_jobs
    for insert
    with check (auth.uid() = user_id);

drop policy if exists "Users can update own processing jobs" on public.processing_jobs;
create policy "Users can update own processing jobs"
    on public.processing_jobs
    for update
    using (auth.uid() = user_id);

drop policy if exists "Users can delete own processing jobs" on public.processing_jobs;
create policy "Users can delete own processing jobs"
    on public.processing_jobs
    for delete
    using (auth.uid() = user_id);

-- 5) Supabase Storage bucket
-- Run this section separately in Storage tab if needed.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'documents',
    'documents',
    false,
    10485760,
    array[
        'application/pdf',
        'image/png',
        'image/jpeg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
)
on conflict (id) do nothing;

drop policy if exists "Owner can read own files" on storage.objects;
create policy "Owner can read own files"
    on storage.objects
    for select
    using (
        bucket_id = 'documents'
        and auth.uid()::text = (storage.foldername(name))[1]
    );

drop policy if exists "Owner can delete own files" on storage.objects;
create policy "Owner can delete own files"
    on storage.objects
    for delete
    using (
        bucket_id = 'documents'
        and auth.uid()::text = (storage.foldername(name))[1]
    );

-- 6) Helpful dashboard view
create or replace view public.document_summaries as
select
    id,
    user_id,
    filename,
    file_type,
    upload_time,
    processing_status,
    storage_url,
    classified_type,
    file_size_bytes,
    page_count
from public.documents;
