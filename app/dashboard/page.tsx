'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    CheckCircle2,
    Download,
    FileSpreadsheet,
    Loader2,
    LogOut,
    RefreshCw,
    Search,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import {
    DocumentDetail,
    DocumentSummary,
    ReviewStatus,
    documentsApi,
} from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const INVOICE_FIELDS = [
    { key: 'vendor', label: 'Vendor' },
    { key: 'invoice_no', label: 'Invoice Number' },
    { key: 'invoice_date', label: 'Invoice Date' },
    { key: 'due_date', label: 'Due Date' },
    { key: 'po_number', label: 'PO Number' },
    { key: 'subtotal', label: 'Subtotal' },
    { key: 'tax', label: 'Tax' },
    { key: 'total', label: 'Total' },
    { key: 'currency', label: 'Currency' },
    { key: 'client', label: 'Client' },
] as const;

export default function DashboardPage() {
    const router = useRouter();
    const { isAuth, token, loading: authLoading, logout } = useAuth();

    const [documents, setDocuments] = useState<DocumentSummary[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedDoc, setSelectedDoc] = useState<DocumentDetail | null>(null);
    const [reviewStatus, setReviewStatus] = useState<ReviewStatus>('new');
    const [reviewNotes, setReviewNotes] = useState('');
    const [reviewFields, setReviewFields] = useState<Record<string, string>>({});
    const [search, setSearch] = useState('');
    const [detailReloadKey, setDetailReloadKey] = useState(0);
    const [loadingDocs, setLoadingDocs] = useState(true);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [saving, setSaving] = useState(false);
    const [exporting, setExporting] = useState<'csv' | 'json' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuth) {
            router.replace('/?login=true');
        }
    }, [authLoading, isAuth, router]);

    useEffect(() => {
        let mounted = true;

        async function loadDocs() {
            if (!token) return;
            try {
                setLoadingDocs(true);
                setError(null);
                const response = await documentsApi.list(token, 1, 100);
                if (!mounted) return;
                setDocuments(response.items);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to load invoice queue.';
                if (mounted) setError(message);
            } finally {
                if (mounted) setLoadingDocs(false);
            }
        }

        if (token) {
            void loadDocs();
        }

        return () => {
            mounted = false;
        };
    }, [token]);

    const invoiceDocuments = useMemo(
        () =>
            documents
                .filter((doc) => doc.classified_type === 'Invoice')
                .filter((doc) => {
                    const term = search.trim().toLowerCase();
                    if (!term) return true;
                    return doc.filename.toLowerCase().includes(term);
                }),
        [documents, search],
    );

    useEffect(() => {
        if (!invoiceDocuments.length) {
            setSelectedId(null);
            setSelectedDoc(null);
            return;
        }

        if (!selectedId || !invoiceDocuments.some((doc) => doc.id === selectedId)) {
            setSelectedId(invoiceDocuments[0].id);
        }
    }, [invoiceDocuments, selectedId]);

    useEffect(() => {
        let mounted = true;

        async function loadDetail() {
            if (!token || !selectedId) return;
            try {
                setLoadingDetail(true);
                setError(null);
                const detail = await documentsApi.get(selectedId, token);
                if (!mounted) return;
                setSelectedDoc(detail);
                setReviewStatus(detail.review_status);
                setReviewNotes(detail.review_notes ?? '');
                setReviewFields(detail.extracted_fields ?? {});
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to load invoice details.';
                if (mounted) setError(message);
            } finally {
                if (mounted) setLoadingDetail(false);
            }
        }

        if (selectedId && token) {
            void loadDetail();
        }

        return () => {
            mounted = false;
        };
    }, [detailReloadKey, selectedId, token]);

    const stats = useMemo(() => {
        const invoices = documents.filter((doc) => doc.classified_type === 'Invoice');
        return {
            total: invoices.length,
            needsReview: invoices.filter((doc) => doc.review_status === 'needs_review').length,
            approved: invoices.filter((doc) => doc.review_status === 'approved').length,
            duplicates: invoices.filter((doc) => doc.duplicate_detected).length,
        };
    }, [documents]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const handleFieldChange = (key: string, value: string) => {
        setReviewFields((current) => ({ ...current, [key]: value }));
    };

    const handleSaveReview = async () => {
        if (!token || !selectedDoc) return;
        try {
            setSaving(true);
            setError(null);
            setNotice(null);
            const updated = await documentsApi.reviewInvoice(
                selectedDoc.id,
                {
                    review_status: reviewStatus,
                    review_notes: reviewNotes,
                    extracted_fields: reviewFields,
                },
                token,
            );

            setSelectedDoc(updated);
            setReviewStatus(updated.review_status);
            setReviewNotes(updated.review_notes ?? '');
            setReviewFields(updated.extracted_fields ?? {});
            setDocuments((current) =>
                current.map((doc) =>
                    doc.id === updated.id
                        ? {
                              ...doc,
                              review_status: updated.review_status,
                              invoice_issue_flags: updated.invoice_issue_flags,
                              duplicate_detected: updated.duplicate_detected,
                          }
                        : doc,
                ),
            );
            setNotice('Invoice review saved.');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to save invoice review.';
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    const handleExport = async (format: 'csv' | 'json') => {
        if (!token) return;
        try {
            setExporting(format);
            setError(null);
            const blob = await documentsApi.exportInvoices(token, format, 'approved');
            const href = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = href;
            anchor.download = format === 'csv' ? 'approved_invoices.csv' : 'approved_invoices.json';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            window.setTimeout(() => URL.revokeObjectURL(href), 1000);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Export failed.';
            setError(message);
        } finally {
            setExporting(null);
        }
    };

    if (authLoading || !isAuth) {
        return (
            <main className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white overflow-x-hidden">
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-indigo-300/70 mb-3">Finance Workflow</p>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Invoice Review Queue</h1>
                        <p className="text-slate-400 mt-3 max-w-2xl">
                            Review extracted invoice fields, resolve duplicate warnings, approve clean records, and export them for accounting.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => handleExport('csv')}
                            disabled={exporting !== null}
                            className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm font-medium disabled:opacity-60"
                        >
                            {exporting === 'csv' ? 'Exporting CSV...' : 'Export Approved CSV'}
                        </button>
                        <button
                            onClick={() => handleExport('json')}
                            disabled={exporting !== null}
                            className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm font-medium disabled:opacity-60"
                        >
                            {exporting === 'json' ? 'Exporting JSON...' : 'Export Approved JSON'}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm font-medium text-slate-300 inline-flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Invoices', value: stats.total },
                        { label: 'Needs Review', value: stats.needsReview },
                        { label: 'Approved', value: stats.approved },
                        { label: 'Duplicates', value: stats.duplicates },
                    ].map((item) => (
                        <div key={item.label} className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
                            <p className="text-sm text-slate-400">{item.label}</p>
                            <p className="text-3xl font-semibold mt-2">{item.value}</p>
                        </div>
                    ))}
                </div>

                {(error || notice) && (
                    <div className="space-y-3 mb-6">
                        {error && (
                            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                        {notice && (
                            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 shrink-0" />
                                <span>{notice}</span>
                            </div>
                        )}
                    </div>
                )}

                {loadingDocs ? (
                    <div className="flex items-center justify-center py-20 rounded-3xl border border-white/10 bg-white/5">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    </div>
                ) : !stats.total ? (
                    <div className="text-center py-20 rounded-3xl border border-dashed border-white/10 bg-white/5">
                        <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-500 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No invoices in the queue yet</h2>
                        <p className="text-slate-400 max-w-xl mx-auto">
                            Upload invoice PDFs or images from the main tools page. Once the AI pipeline classifies them as invoices, they will appear here for finance review.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-6">
                        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">
                            <div className="p-5 border-b border-white/10">
                                <div className="flex items-center gap-3 rounded-xl bg-black/20 border border-white/10 px-3 py-2">
                                    <Search className="w-4 h-4 text-slate-500" />
                                    <input
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Search invoices..."
                                        className="w-full bg-transparent outline-none text-sm text-white placeholder:text-slate-500"
                                    />
                                </div>
                            </div>

                            <div className="max-h-[760px] overflow-y-auto p-4 space-y-3">
                                {invoiceDocuments.map((doc) => {
                                    const active = doc.id === selectedId;
                                    return (
                                        <button
                                            key={doc.id}
                                            onClick={() => setSelectedId(doc.id)}
                                            className={`w-full text-left p-4 rounded-2xl border transition ${
                                                active
                                                    ? 'border-indigo-400/60 bg-indigo-500/10'
                                                    : 'border-white/10 bg-black/10 hover:border-white/20'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="font-medium truncate">{doc.filename}</p>
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        {new Date(doc.upload_time).toLocaleDateString()} • {doc.review_status.replace('_', ' ')}
                                                    </p>
                                                </div>
                                                {doc.duplicate_detected && (
                                                    <span className="text-[10px] uppercase tracking-wider text-amber-300">Dup</span>
                                                )}
                                            </div>
                                            {doc.invoice_issue_flags.length > 0 && (
                                                <p className="text-xs text-amber-300 mt-3">
                                                    {doc.invoice_issue_flags.length} review flag{doc.invoice_issue_flags.length > 1 ? 's' : ''}
                                                </p>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
                            {loadingDetail || !selectedDoc ? (
                                <div className="flex items-center justify-center min-h-[420px]">
                                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                </div>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                                        <div>
                                            <h2 className="text-2xl font-semibold">{selectedDoc.filename}</h2>
                                            <p className="text-slate-400 mt-2">
                                                Classified as {selectedDoc.classified_type ?? 'Unknown'} • Uploaded on{' '}
                                                {new Date(selectedDoc.upload_time).toLocaleString()}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setDetailReloadKey((current) => current + 1)}
                                            className="px-3 py-2 rounded-xl border border-white/10 bg-black/10 text-sm inline-flex items-center gap-2"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Refresh
                                        </button>
                                    </div>

                                    {selectedDoc.duplicate_detected && (
                                        <div className="mb-5 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-200">
                                            Possible duplicate invoice detected. Check vendor, invoice number, and amount before approval.
                                        </div>
                                    )}

                                    {selectedDoc.invoice_issue_flags.length > 0 && (
                                        <div className="mb-6 p-4 rounded-2xl border border-white/10 bg-black/20">
                                            <p className="text-sm font-medium mb-3">Review flags</p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedDoc.invoice_issue_flags.map((flag) => (
                                                    <span key={flag} className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs">
                                                        {flag.replaceAll('_', ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        {INVOICE_FIELDS.map((field) => (
                                            <label key={field.key} className="block">
                                                <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{field.label}</span>
                                                <input
                                                    value={reviewFields[field.key] ?? ''}
                                                    onChange={(event) => handleFieldChange(field.key, event.target.value)}
                                                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-indigo-400/50"
                                                />
                                            </label>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-4 mb-6">
                                        <label className="block">
                                            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Review Status</span>
                                            <select
                                                value={reviewStatus}
                                                onChange={(event) => setReviewStatus(event.target.value as ReviewStatus)}
                                                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-indigo-400/50"
                                            >
                                                <option value="new">New</option>
                                                <option value="needs_review">Needs Review</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </label>

                                        <label className="block">
                                            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Review Notes</span>
                                            <textarea
                                                value={reviewNotes}
                                                onChange={(event) => setReviewNotes(event.target.value)}
                                                rows={4}
                                                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-indigo-400/50 resize-none"
                                                placeholder="Add finance review notes or approval context..."
                                            />
                                        </label>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={handleSaveReview}
                                            disabled={saving}
                                            className="px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition font-medium disabled:opacity-60"
                                        >
                                            {saving ? 'Saving Review...' : 'Save Review'}
                                        </button>
                                        <button
                                            onClick={() => handleExport('csv')}
                                            disabled={exporting !== null}
                                            className="px-5 py-3 rounded-xl border border-white/10 bg-black/20 hover:bg-black/30 transition font-medium inline-flex items-center gap-2 disabled:opacity-60"
                                        >
                                            <Download className="w-4 h-4" />
                                            Export Approved CSV
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </section>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
