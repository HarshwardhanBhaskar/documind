/**
 * lib/api.ts
 * ──────────────────────────────────────────────────────────────────────────
 * Typed API client for the DocuMind FastAPI backend.
 * All functions read NEXT_PUBLIC_API_URL from the environment.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
const REQUEST_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? '180000');

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string | null;
    user_id: string;
}

export interface UserResponse {
    id: string;
    email: string;
    full_name: string | null;
    created_at: string | null;
}

export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface DocumentSummary {
    id: string;
    filename: string;
    file_type: string;
    upload_time: string;
    processing_status: ProcessingStatus;
    storage_url: string | null;
}

export interface DocumentDetail extends DocumentSummary {
    user_id: string;
    ocr_text: string | null;
    classified_type: string | null;
    extracted_fields: Record<string, string> | null;
    file_size_bytes: number | null;
    page_count: number | null;
}

export interface OcrResult {
    document_id: string;
    raw_text: string;
    confidence: number | null;
    page_count: number | null;
}

export interface ClassificationResult {
    document_id: string;
    classified_type: string;
    confidence: number;
    suggested_tags: string[];
}

export interface ExtractionResult {
    document_id: string;
    extracted_fields: Record<string, string>;
}

export interface PipelineResult {
    document_id: string;
    ocr: OcrResult;
    classification: ClassificationResult;
    extraction: ExtractionResult;
    status: ProcessingStatus;
}

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AsyncProcessResponse {
    job_id: string;
    status: JobStatus;
}

export interface ProcessingJob {
    id: string;
    user_id: string;
    document_id: string;
    status: JobStatus;
    progress: number;
    step: string | null;
    error: string | null;
    result: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
}

export interface PlanTier {
    id: string;
    name: string;
    monthly_upload_limit: number;
    monthly_processing_credits: number;
    feature_flags: Record<string, boolean>;
    created_at: string | null;
}

export interface UserSubscription {
    user_id: string;
    plan_id: string;
    status: string;
    started_at: string | null;
    current_period_start: string | null;
    current_period_end: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface UsageDashboard {
    user_id: string;
    month_start: string;
    plan_id: string;
    monthly_upload_limit: number;
    monthly_processing_credits: number;
    uploads_count: number;
    credits_used: number;
    processed_success: number;
    processed_failed: number;
    success_rate_percent: number;
    avg_processing_seconds: number;
}

export interface PaginatedDocuments {
    total: number;
    page: number;
    page_size: number;
    items: DocumentSummary[];
}

// ── Base fetch helper ─────────────────────────────────────────────────────────

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
    token?: string,
): Promise<T> {
    const headers: Record<string, string> = {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers as Record<string, string>),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let res: Response;
    try {
        res = await fetch(`${BASE_URL}${path}`, {
            ...options,
            headers,
            signal: controller.signal,
        });
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new ApiError(408, `Request timed out after ${Math.round(REQUEST_TIMEOUT_MS / 1000)}s`);
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }

    if (!res.ok) {
        let message = `HTTP ${res.status}`;
        try {
            const err = await res.json();
            message = err.detail ?? err.message ?? message;
        } catch {
            /* ignore parse error */
        }
        throw new ApiError(res.status, message);
    }

    // Handle 204 No Content
    if (res.status === 204) return undefined as unknown as T;

    return res.json() as Promise<T>;
}

// ── Auth endpoints ────────────────────────────────────────────────────────────

export const authApi = {
    signup: (email: string, password: string, full_name?: string) =>
        apiFetch<TokenResponse>('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, full_name }),
        }),

    login: (email: string, password: string) =>
        apiFetch<TokenResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    logout: (token: string) =>
        apiFetch<{ message: string }>('/auth/logout', { method: 'POST' }, token),

    getUser: (token: string) =>
        apiFetch<UserResponse>('/auth/user', {}, token),
};

// ── Upload endpoint ───────────────────────────────────────────────────────────

export const uploadApi = {
    upload: (file: File, token: string) => {
        const form = new FormData();
        form.append('file', file);
        return apiFetch<DocumentDetail>('/upload', { method: 'POST', body: form }, token);
    },
};

// ── Document CRUD endpoints ───────────────────────────────────────────────────

export const documentsApi = {
    list: (token: string, page = 1, page_size = 20) =>
        apiFetch<PaginatedDocuments>(
            `/documents?page=${page}&page_size=${page_size}`,
            {},
            token,
        ),

    get: (id: string, token: string) =>
        apiFetch<DocumentDetail>(`/documents/${id}`, {}, token),

    delete: (id: string, token: string) =>
        apiFetch<{ message: string }>(`/documents/${id}`, { method: 'DELETE' }, token),
};

// ── Processing endpoints ──────────────────────────────────────────────────────

export const processingApi = {
    process: (document_id: string, token: string) =>
        apiFetch<PipelineResult>('/process-document', {
            method: 'POST',
            body: JSON.stringify({ document_id }),
        }, token),

    processAsync: (document_id: string, token: string) =>
        apiFetch<AsyncProcessResponse>('/process-document-async', {
            method: 'POST',
            body: JSON.stringify({ document_id }),
        }, token),

    getJobStatus: (job_id: string, token: string) =>
        apiFetch<ProcessingJob>(`/jobs/${job_id}`, {}, token),

    ocr: (document_id: string, token: string) =>
        apiFetch<OcrResult>('/ocr', {
            method: 'POST',
            body: JSON.stringify({ document_id }),
        }, token),

    classify: (document_id: string, token: string) =>
        apiFetch<ClassificationResult>('/classify-document', {
            method: 'POST',
            body: JSON.stringify({ document_id }),
        }, token),

    extract: (document_id: string, token: string) =>
        apiFetch<ExtractionResult>('/extract-fields', {
            method: 'POST',
            body: JSON.stringify({ document_id }),
        }, token),
};

// ── Utility endpoints ─────────────────────────────────────────────────────────

export const usageApi = {
    plans: () => apiFetch<PlanTier[]>('/usage/plans'),

    subscription: (token: string) =>
        apiFetch<UserSubscription>('/usage/subscription', {}, token),

    dashboard: (token: string) =>
        apiFetch<UsageDashboard>('/usage/dashboard', {}, token),
};

export const utilitiesApi = {
    merge: async (files: File[], token?: string) => {
        const form = new FormData();
        files.forEach(f => form.append('files', f));
        // We handle binary Blobs manually instead of JSON
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${BASE_URL}/utilities/merge-pdfs`, {
            method: 'POST',
            body: form,
            headers,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
    },

    compress: async (files: File[], token?: string) => {
        const form = new FormData();
        files.forEach(f => form.append('files', f));
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${BASE_URL}/utilities/compress`, {
            method: 'POST',
            body: form,
            headers,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
    },

    convertPdf: async (file: File, format: 'png' | 'jpeg', token?: string) => {
        const form = new FormData();
        form.append('file', file);
        form.append('output_format', format);
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${BASE_URL}/utilities/convert-pdf`, {
            method: 'POST',
            body: form,
            headers,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
    },
};

export { ApiError };
