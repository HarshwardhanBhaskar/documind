'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload, Cpu, FileSearch, Download, CheckCircle,
    FileText, FileImage, X, AlertCircle,
    Sparkles, LogIn, Loader2, Hash
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import { ApiError, uploadApi, processingApi } from '@/lib/api';
import type { PipelineResult, ProcessingJob } from '@/lib/api';

// ── File type mapping ─────────────────────────────────────────────────────────
const FILE_TYPES: Record<string, { icon: typeof FileText; color: string }> = {
    pdf: { icon: FileText, color: '#EF4444' },
    doc: { icon: FileText, color: '#3B82F6' },
    docx: { icon: FileText, color: '#3B82F6' },
    png: { icon: FileImage, color: '#8B5CF6' },
    jpg: { icon: FileImage, color: '#8B5CF6' },
    jpeg: { icon: FileImage, color: '#8B5CF6' },
};

const fmtBytes = (b: number) =>
    b < 1_048_576 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1_048_576).toFixed(1)} MB`;
const PROCESSING_POLL_MS = 1500;
const PROCESSING_TIMEOUT_MS = 10 * 60 * 1000;

// ── Uploaded doc state ────────────────────────────────────────────────────────
interface UploadedDoc {
    id: string;
    filename: string;
    storage_url: string;
    file_type: string;
}

export default function UploadDemo() {
    const { isAuth, user, token } = useAuth();

    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [step, setStep] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [uploaded, setUploaded] = useState<UploadedDoc | null>(null);
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
                if (!result) {
                    throw new Error('Processing completed, but no result payload was returned.');
                }
                return result;
            }

            if (job.status === 'failed') {
                throw new Error(job.error || 'Processing failed.');
            }

            if (Date.now() - startedAt > PROCESSING_TIMEOUT_MS) {
                throw new Error('AI processing timed out. Please try again.');
            }

            await new Promise(resolve => setTimeout(resolve, PROCESSING_POLL_MS));
        }
    }, [token]);

    // ── Upload via FastAPI ───────────────────────────────────────────────────
    const runUploadAndProcess = useCallback(async (f: File) => {
        if (!token) return;
        setStep('uploading'); setProgress(10); setError(null); setUploaded(null); setAiResult(null); setProcessingStepLabel('Queued');

        try {
            // 1. Upload via FastAPI backend (handles Storage + DB insert using service key)
            setProgress(40);
            const doc = await uploadApi.upload(f, token);
            setProgress(100);

            setUploaded({
                id: doc.id,
                filename: doc.filename,
                storage_url: doc.storage_url || '',
                file_type: doc.file_type
            });

            // 2. Run the AI Pipeline via FastAPI
            setStep('processing');
            setProgress(5);
            setProcessingStepLabel('Queued');

            const job = await processingApi.processAsync(doc.id, token);
            const result = await pollJobUntilDone(job.job_id);

            setProgress(100);
            setProcessingStepLabel('Completed');
            setAiResult(result);
            setStep('done');

        } catch (e: unknown) {
            if (e instanceof ApiError) {
                setError(e.message || 'Processing failed.');
            } else if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('Processing failed.');
            }
            setStep('error');
        }
    }, [pollJobUntilDone, token]);

    const handleFile = useCallback((f: File) => {
        if (!isAuth) { setAuthOpen(true); return; }
        setFile(f); setStep('idle'); setError(null); setUploaded(null); setProgress(0); setAiResult(null); setProcessingStepLabel('Queued');
        runUploadAndProcess(f);
    }, [isAuth, runUploadAndProcess]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault(); setDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
    }, [handleFile]);

    const reset = () => {
        setFile(null); setStep('idle'); setError(null);
        setUploaded(null); setProgress(0); setAiResult(null); setProcessingStepLabel('Queued');
    };

    const ext = file?.name.split('.').pop()?.toLowerCase() ?? '';
    const { icon: FIcon = FileText, color: fColor = '#6366F1' } = FILE_TYPES[ext] ?? {};

    return (
        <section id="demo" className="relative py-32 border-t border-white/10">
            <div className="section-divider absolute top-0 inset-x-0" />

            {/* Ambient blobs */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(34,211,238,0.07) 0%,transparent 70%)' }} />
                <div className="absolute top-1/2 -left-20 w-60 h-60 rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.06) 0%,transparent 70%)' }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.55 }}
                    className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
                        style={{ background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.18)', backdropFilter: 'blur(16px)' }}>
                        <Cpu className="w-3.5 h-3.5" style={{ color: '#22D3EE' }} />
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(34,211,238,0.72)' }}>
                            Interactive Demo
                        </span>
                    </div>
                    <h2 className="text-3xl font-semibold text-center text-white mb-4">
                        Upload a real <span className="gradient-text">document</span>
                    </h2>
                    <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto text-center">
                        Drop any PDF, image, or Word file — it gets stored securely
                        in your Supabase account and gets processed by the Python OCR pipeline.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.1 }}
                    className="max-w-2xl mx-auto">

                    {/* ── Drop zone ── */}
                    <div
                        className={`drop-zone rounded-2xl ${dragging ? 'dragging' : ''}`}
                        style={{
                            background: dragging ? 'rgba(99,102,241,0.12)'
                                : file ? 'rgba(255,255,255,0.02)'
                                    : 'rgba(99,102,241,0.04)',
                            cursor: !file ? 'pointer' : 'default',
                            border: '1px solid rgba(99,102,241,0.30)',
                            borderRadius: '1rem',
                            padding: file ? '1.25rem' : '0',
                        }}
                        onDragOver={e => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => !file && document.getElementById('fup-demo')?.click()}
                        role={!file ? 'button' : undefined}
                        tabIndex={!file ? 0 : undefined}
                        aria-label="Upload document"
                        onKeyDown={e => !file && e.key === 'Enter' && document.getElementById('fup-demo')?.click()}>

                        <input id="fup-demo" type="file" className="hidden"
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

                        <AnimatePresence mode="wait">
                            {!file ? (
                                /* Empty state */
                                <motion.div key="empty"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-5 py-14 px-8 text-center">

                                    <motion.div
                                        animate={{ y: [0, -6, 0] }}
                                        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg,#6366F1,#A78BFA)', boxShadow: '0 0 36px rgba(99,102,241,0.45)' }}>
                                        {isAuth
                                            ? <Upload className="w-7 h-7 text-white" />
                                            : <LogIn className="w-7 h-7 text-white" />
                                        }
                                    </motion.div>

                                    <div>
                                        <p className="text-white font-semibold text-base mb-1.5">
                                            {isAuth
                                                ? 'Drop your document here'
                                                : 'Sign in to upload documents'}
                                        </p>
                                        <p className="text-sm" style={{ color: 'rgba(241,245,249,0.40)' }}>
                                            {isAuth
                                                ? <>PDF, DOC, DOCX, PNG, JPG &nbsp;·&nbsp; or <span
                                                    className="font-semibold cursor-pointer"
                                                    style={{ color: '#818CF8', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                                                    click to browse</span></>
                                                : 'Your files are stored privately in your account'
                                            }
                                        </p>
                                    </div>

                                    {!isAuth && (
                                        <motion.button
                                            whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                                            onClick={e => { e.stopPropagation(); setAuthOpen(true); }}
                                            className="inline-flex items-center gap-2 rounded-xl text-sm font-bold text-white"
                                            style={{ padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg,#6366F1,#A78BFA)', boxShadow: '0 0 24px rgba(99,102,241,0.45)' }}>
                                            <LogIn className="w-4 h-4" />
                                            Sign in / Create account
                                        </motion.button>
                                    )}

                                    {isAuth && (
                                        <p className="text-xs" style={{ color: 'rgba(241,245,249,0.25)' }}>
                                            Signed in as {user?.email}
                                        </p>
                                    )}

                                    <div className="flex gap-2 flex-wrap justify-center">
                                        {['PDF', 'DOCX', 'PNG', 'JPG'].map(t => (
                                            <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                                                style={{ background: 'rgba(99,102,241,0.09)', border: '1px solid rgba(99,102,241,0.18)', color: 'rgba(129,140,248,0.75)' }}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                /* File loaded — upload progress */
                                <motion.div key="loaded"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                                    {/* Error */}
                                    {step === 'error' && error && (
                                        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl"
                                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#EF4444' }} />
                                            <span className="text-xs" style={{ color: '#EF4444' }}>{error}</span>
                                        </div>
                                    )}

                                    {/* File info row */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: `${fColor}18` }}>
                                            <FIcon className="w-5 h-5" style={{ color: fColor }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-semibold text-sm truncate">{file.name}</p>
                                            <p className="text-xs mt-0.5" style={{ color: 'rgba(241,245,249,0.35)' }}>
                                                {ext.toUpperCase()} · {fmtBytes(file.size)}
                                            </p>
                                        </div>
                                        {step !== 'uploading' && step !== 'processing' && (
                                            <button onClick={reset}
                                                className="w-7 h-7 rounded-lg flex items-center justify-center"
                                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(241,245,249,0.4)' }}>
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Progress bar */}
                                    {(step === 'uploading' || step === 'processing') && (
                                        <>
                                            <div className="mb-1 flex justify-between">
                                                <span className="text-xs flex items-center gap-1" style={{ color: 'rgba(241,245,249,0.38)' }}>
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                    {step === 'uploading'
                                                        ? 'Uploading to Supabase...'
                                                        : `AI Processing: ${processingStepLabel}`}
                                                </span>
                                                <span className="text-xs font-bold" style={{ color: '#818CF8' }}>{Math.round(progress)}%</span>
                                            </div>
                                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                                                <motion.div className="h-full rounded-full"
                                                    style={{ background: 'linear-gradient(90deg,#6366F1,#22D3EE)' }}
                                                    animate={{ width: `${progress}%` }}
                                                    transition={{ duration: 0.3 }} />
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Hint text */}
                    <p className="text-center text-sm mt-3" style={{ color: 'rgba(241,245,249,0.30)' }}>
                        Supported: PDF&nbsp;•&nbsp;DOC&nbsp;•&nbsp;DOCX&nbsp;•&nbsp;PNG&nbsp;•&nbsp;JPG
                        &nbsp;&nbsp;·&nbsp;&nbsp;Max&nbsp;10&nbsp;MB
                    </p>

                    {/* Static AI pipeline */}
                    <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
                        {[
                            { label: 'Upload', icon: Upload, color: '#6366F1' },
                            { label: 'OCR', icon: FileSearch, color: '#A78BFA' },
                            { label: 'AI Analysis', icon: Cpu, color: '#22D3EE' },
                            { label: 'Extract Data', icon: Download, color: '#34D399' },
                        ].map((s, i, arr) => {
                            const Icon = s.icon;
                            return (
                                <div key={s.label} className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                                            style={{ background: `${s.color}18` }}>
                                            <Icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                                        </div>
                                        <span className="text-sm font-medium" style={{ color: 'rgba(241,245,249,0.45)' }}>{s.label}</span>
                                    </div>
                                    {i < arr.length - 1 && (
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                            <path d="M3 7h8M8 4l3 3-3 3" stroke="rgba(241,245,249,0.18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Success result panel ── */}
                    <AnimatePresence>
                        {step === 'done' && uploaded && aiResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="mt-6 rounded-2xl overflow-hidden"
                                style={{ border: '1px solid rgba(52,211,153,0.22)', background: 'rgba(52,211,153,0.04)' }}>

                                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/7">
                                    <CheckCircle className="w-4 h-4" style={{ color: '#34D399' }} />
                                    <span className="text-sm font-bold text-white">Pipeline Complete!</span>
                                    <span className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full"
                                        style={{ background: 'rgba(99,102,241,0.12)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.22)' }}>
                                        {aiResult.classification?.classified_type || 'Document'}
                                    </span>
                                </div>

                                <div className="divide-y divide-white/5">
                                    {Object.entries(aiResult.extraction?.extracted_fields || {}).map(([k, v]) => (
                                        <div key={k} className="flex items-center gap-3 px-5 py-2.5">
                                            <Hash className="w-3 h-3 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.18)' }} />
                                            <span className="text-xs font-semibold w-28 flex-shrink-0 capitalize" style={{ color: 'rgba(255,255,255,0.40)' }}>
                                                {k.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs text-white font-medium">{String(v)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="px-5 py-3 border-t border-white/5 flex flex-col gap-2">
                                    <span className="text-xs font-semibold" style={{ color: 'rgba(241,245,249,0.45)' }}>OCR PREVIEW</span>
                                    <p className="text-xs line-clamp-2" style={{ color: 'rgba(241,245,249,0.30)' }}>
                                        {aiResult.ocr?.raw_text || 'No text extracted.'}
                                    </p>
                                </div>

                                <div className="flex gap-3 flex-wrap px-5 py-4 border-t border-white/5">
                                    <motion.button
                                        whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}
                                        onClick={reset}
                                        className="inline-flex items-center gap-2 rounded-xl text-sm font-bold text-white"
                                        style={{ padding: '0.625rem 1.25rem', background: 'linear-gradient(135deg,#6366F1,#A78BFA)', boxShadow: '0 0 20px rgba(99,102,241,0.35)' }}>
                                        <Sparkles className="w-4 h-4" />
                                        Process Another
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        </section>
    );
}
