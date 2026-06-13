'use client';

import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, FileImage, FileText, Loader2, LogIn, Upload, X } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/context/AuthContext';
import { ApiError, processingApi, uploadApi } from '@/lib/api';
import type { PipelineResult, ProcessingJob } from '@/lib/api';

const fileTypes: Record<string, { icon: typeof FileText; color: string }> = {
  pdf: { icon: FileText, color: '#dc2626' },
  doc: { icon: FileText, color: '#2563eb' },
  docx: { icon: FileText, color: '#2563eb' },
  png: { icon: FileImage, color: '#7c3aed' },
  jpg: { icon: FileImage, color: '#7c3aed' },
  jpeg: { icon: FileImage, color: '#7c3aed' },
};

const processingPollMs = 1500;
const processingTimeoutMs = 10 * 60 * 1000;

const fmtBytes = (bytes: number) => (
  bytes < 1_048_576 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1_048_576).toFixed(1)} MB`
);

export default function UploadDemo() {
  const { isAuth, token } = useAuth();
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [aiResult, setAiResult] = useState<PipelineResult | null>(null);
  const [processingStepLabel, setProcessingStepLabel] = useState('Queued');

  const pollJobUntilDone = useCallback(async (jobId: string): Promise<PipelineResult> => {
    if (!token) throw new Error('Missing auth token.');

    const startedAt = Date.now();
    while (true) {
      const job: ProcessingJob = await processingApi.getJobStatus(jobId, token);
      setProgress(Math.max(0, Math.min(100, job.progress)));
      if (job.step) setProcessingStepLabel(job.step);

      if (job.status === 'completed') {
        const result = job.result as PipelineResult | null;
        if (!result) throw new Error('Processing completed, but no result payload was returned.');
        return result;
      }

      if (job.status === 'failed') {
        throw new Error(job.error || 'Processing failed.');
      }

      if (Date.now() - startedAt > processingTimeoutMs) {
        throw new Error('Processing timed out. Please try again.');
      }

      await new Promise((resolve) => setTimeout(resolve, processingPollMs));
    }
  }, [token]);

  const process = async () => {
    if (!file || !token) return;

    setStep('uploading');
    setProgress(10);
    setError(null);
    setAiResult(null);
    setProcessingStepLabel('Queued');

    try {
      const doc = await uploadApi.upload(file, token);
      setProgress(38);
      setStep('processing');
      setProcessingStepLabel('Starting OCR');

      const started = await processingApi.processAsync(doc.id, token);
      setProgress(50);

      const result = await pollJobUntilDone(started.job_id);
      setAiResult(result);
      setProgress(100);
      setStep('done');
    } catch (err) {
      const message = err instanceof ApiError || err instanceof Error ? err.message : 'Upload or processing failed.';
      setError(message);
      setStep('error');
    }
  };

  const handleFile = (nextFile: File) => {
    setFile(nextFile);
    setStep('idle');
    setError(null);
    setProgress(0);
    setAiResult(null);
    setProcessingStepLabel('Queued');
  };

  const reset = () => {
    setFile(null);
    setStep('idle');
    setError(null);
    setProgress(0);
    setAiResult(null);
    setProcessingStepLabel('Queued');
  };

  const ext = file?.name.split('.').pop()?.toLowerCase() ?? 'pdf';
  const { icon: FileIcon = FileText, color: fileColor = '#2563eb' } = fileTypes[ext] ?? {};
  const busy = step === 'uploading' || step === 'processing';

  return (
    <section id="demo" className="border-b border-[var(--border)] bg-[var(--bg)] py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase text-blue-700">Live workflow</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[var(--text-primary)]">
            Upload a document and see the processing path.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
            This is the same surface an operator would use: select a file, start processing, watch status, then review the extracted data.
          </p>
        </div>

        <div className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] shadow-lg shadow-slate-200/60">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-[var(--text-primary)]">Document intake</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">PDF, Word, PNG, or JPG</p>
              </div>
              {isAuth ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">Authenticated</span>
              ) : (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">Login required</span>
              )}
            </div>
          </div>

          <div className="p-5">
            {!file ? (
              <label
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  const dropped = event.dataTransfer.files?.[0];
                  if (dropped) handleFile(dropped);
                }}
                className={`flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center transition ${dragging ? 'border-blue-400 bg-blue-50' : 'border-[var(--border-strong)] bg-[var(--surface-muted)]'}`}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(event) => {
                    const selected = event.target.files?.[0];
                    if (selected) handleFile(selected);
                  }}
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white text-blue-700 shadow-sm">
                  <Upload className="h-5 w-5" />
                </div>
                <div className="mt-4 text-sm font-semibold text-[var(--text-primary)]">Drop a document here</div>
                <div className="mt-1 text-sm text-[var(--text-secondary)]">or click to choose a file from your computer</div>
              </label>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white shadow-sm">
                      <FileIcon className="h-5 w-5" style={{ color: fileColor }} />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-[var(--text-primary)]">{file.name}</div>
                      <div className="text-xs text-[var(--text-secondary)]">{fmtBytes(file.size)} · {ext.toUpperCase()}</div>
                    </div>
                  </div>
                  <button onClick={reset} disabled={busy} className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-white text-slate-500 disabled:opacity-50" aria-label="Remove file">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="rounded-lg border border-[var(--border)] bg-white p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-900">
                      {step === 'idle' && 'Ready to process'}
                      {step === 'uploading' && 'Uploading'}
                      {step === 'processing' && processingStepLabel}
                      {step === 'done' && 'Processing complete'}
                      {step === 'error' && 'Action needed'}
                    </span>
                    <span className="font-medium text-slate-500">{progress}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
                  </div>

                  {error && (
                    <div className="mt-4 flex gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {isAuth ? (
                    <button onClick={process} disabled={busy || step === 'done'} className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60">
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {busy ? 'Processing' : step === 'done' ? 'Complete' : 'Start processing'}
                    </button>
                  ) : (
                    <button onClick={() => setAuthOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]">
                      <LogIn className="h-4 w-4" />
                      Log in to process
                    </button>
                  )}
                  <button onClick={reset} className="h-10 rounded-md border border-[var(--border-strong)] bg-white px-4 text-sm font-semibold text-slate-700">
                    Reset
                  </button>
                </div>

                <AnimatePresence>
                  {step === 'done' && aiResult && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                        <CheckCircle2 className="h-4 w-4" />
                        {aiResult.classification.classified_type}
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {Object.entries(aiResult.extraction.extracted_fields).slice(0, 6).map(([key, value]) => (
                          <div key={key} className="rounded-md bg-white p-3 ring-1 ring-emerald-100">
                            <div className="text-xs font-semibold uppercase text-slate-500">{key.replaceAll('_', ' ')}</div>
                            <div className="mt-1 truncate text-sm font-medium text-slate-950">{value || '-'}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </section>
  );
}
