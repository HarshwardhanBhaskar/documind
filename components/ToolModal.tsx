'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, File, Loader2, Download } from 'lucide-react';
import { ApiError, processingApi, uploadApi, utilitiesApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';

export type ToolType = 'merge' | 'compress' | 'convert' | 'ocr' | 'ai' | 'extract';

interface ToolModalProps {
    isOpen: boolean;
    onClose: () => void;
    tool: ToolType;
    title: string;
    description: string;
}

export default function ToolModal({ isOpen, onClose, tool, title, description }: ToolModalProps) {
    const { isAuth, token } = useAuth();
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [resultFilename, setResultFilename] = useState('result.bin');
    const [resultPreview, setResultPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [authOpen, setAuthOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isAiTool = tool === 'ocr' || tool === 'ai' || tool === 'extract';
    const singleFileTool = tool !== 'merge' && tool !== 'compress';

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selected = Array.from(e.target.files);
            setFiles(prev => singleFileTool ? selected.slice(0, 1) : [...prev, ...selected]);
            setError(null);
            setResultBlob(null);
            setResultPreview(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            const dropped = Array.from(e.dataTransfer.files);
            setFiles(prev => singleFileTool ? dropped.slice(0, 1) : [...prev, ...dropped]);
            setError(null);
            setResultBlob(null);
            setResultPreview(null);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const getBaseName = (filename: string) => {
        const i = filename.lastIndexOf('.');
        return i > 0 ? filename.slice(0, i) : filename;
    };

    const getAcceptTypes = () => {
        if (tool === 'merge' || tool === 'convert') return 'application/pdf';
        if (isAiTool) return '.pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg';
        return '*/*';
    };

    const runTool = async () => {
        if (files.length === 0) return;

        if (tool === 'merge' && files.length < 2) {
            setError("Please select at least 2 PDF files to merge.");
            return;
        }
        if (singleFileTool && files.length !== 1) {
            setError('Please select exactly one file for this tool.');
            return;
        }
        if (isAiTool && (!isAuth || !token)) {
            setAuthOpen(true);
            setError('Please sign in to use AI tools.');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setResultPreview(null);

        try {
            let blob: Blob;
            let filename = 'result.bin';
            let preview: string | null = null;

            if (tool === 'merge') {
                blob = await utilitiesApi.merge(files, token ?? undefined);
                filename = 'merged_document.pdf';
                downloadBlob(blob, filename);
                reset();
                onClose();
                return;
            } else if (tool === 'compress') {
                blob = await utilitiesApi.compress(files, token ?? undefined);
                filename = 'compressed_archive.zip';
                downloadBlob(blob, filename);
                reset();
                onClose();
                return;
            } else if (tool === 'convert') {
                blob = await utilitiesApi.convertPdf(files[0], 'png', token ?? undefined);
                filename = 'converted_images.zip';
                downloadBlob(blob, filename);
                reset();
                onClose();
                return;
            } else if (tool === 'ocr') {
                const doc = await uploadApi.upload(files[0], token as string);
                const ocr = await processingApi.ocr(doc.id, token as string);
                const text = ocr.raw_text?.trim() || 'No text extracted.';
                blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
                filename = `ocr-${getBaseName(files[0].name)}.txt`;
                preview = text.slice(0, 1200);
            } else if (tool === 'ai') {
                const doc = await uploadApi.upload(files[0], token as string);
                const ocr = await processingApi.ocr(doc.id, token as string);
                const classification = await processingApi.classify(doc.id, token as string);
                const payload = {
                    document_id: doc.id,
                    classified_type: classification.classified_type,
                    confidence: classification.confidence,
                    suggested_tags: classification.suggested_tags,
                    ocr_preview: ocr.raw_text.slice(0, 350),
                };
                blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                filename = `classification-${getBaseName(files[0].name)}.json`;
                preview = `Type: ${classification.classified_type}\nConfidence: ${(classification.confidence * 100).toFixed(1)}%\nTags: ${classification.suggested_tags.join(', ') || 'none'}`;
            } else if (tool === 'extract') {
                const doc = await uploadApi.upload(files[0], token as string);
                const pipeline = await processingApi.process(doc.id, token as string);
                const fields = pipeline.extraction.extracted_fields;
                blob = new Blob([JSON.stringify(fields, null, 2)], { type: 'application/json' });
                filename = `extraction-${getBaseName(files[0].name)}.json`;
                preview = Object.entries(fields).slice(0, 8).map(([k, v]) => `${k}: ${String(v)}`).join('\n') || 'No fields extracted.';
            } else {
                throw new Error("Unknown tool");
            }

            setResultBlob(blob);
            setResultFilename(filename);
            setResultPreview(preview);
        } catch (err: unknown) {
            if (err instanceof ApiError && err.status === 401) {
                setAuthOpen(true);
            }
            setError(err instanceof Error ? err.message : 'Failed to process files');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadResult = () => {
        if (!resultBlob) return;
        const url = URL.createObjectURL(resultBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = resultFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const reset = () => {
        setFiles([]);
        setResultBlob(null);
        setResultPreview(null);
        setError(null);
    };

    const downloadBlob = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    return (
        <>
        <AnimatePresence>
            {isOpen && (
                <div key="modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg overflow-hidden rounded-2xl p-6 shadow-2xl"
                        style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            boxShadow: '0 25px 50px -12px var(--dashboard-shadow)',
                        }}
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 rounded-full p-2 transition-colors cursor-pointer"
                            style={{ color: 'var(--text-secondary)' }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'var(--surface-muted)';
                                e.currentTarget.style.color = 'var(--text-primary)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--text-secondary)';
                            }}
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h2>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{description}</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {!resultBlob ? (
                            <>
                                <div
                                    onDragOver={e => e.preventDefault()}
                                    onDrop={handleDrop}
                                    className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50/20 transition-colors group mb-4"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        multiple={!singleFileTool}
                                        accept={getAcceptTypes()}
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                    />
                                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <UploadCloud className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Click to browse or drag & drop</p>
                                    <p className="text-xs font-normal" style={{ color: 'var(--text-secondary)' }}>
                                        {tool === 'merge'
                                            ? 'Select multiple PDFs'
                                            : tool === 'compress'
                                                ? 'Select files to compress'
                                                : isAiTool
                                                    ? 'Select one PDF/PNG/JPG image'
                                                    : 'Select a single PDF'}
                                    </p>
                                </div>

                                {isAiTool && !isAuth && (
                                    <p className="text-xs text-amber-600 mb-4 font-semibold">
                                        Sign in is required for AI tools.
                                    </p>
                                )}

                                {files.length > 0 && (
                                    <div className="max-h-32 overflow-y-auto mb-6 pr-2">
                                        {files.map((file, i) => (
                                            <div key={i} className="flex flex-row items-center justify-between p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] mb-2">
                                                <div className="flex flex-row items-center gap-2 overflow-hidden">
                                                    <File className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                                    <span className="text-sm truncate font-medium" style={{ color: 'var(--text-primary)' }}>{file.name}</span>
                                                </div>
                                                <button onClick={() => removeFile(i)} className="text-slate-500 hover:text-red-500 transition-colors p-1 rounded cursor-pointer">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={runTool}
                                    disabled={files.length === 0 || isProcessing}
                                    className="w-full flex items-center justify-center py-2.5 rounded-lg font-medium transition-all cursor-pointer"
                                    style={{
                                        background: files.length > 0 && !isProcessing ? 'var(--accent)' : 'var(--border)',
                                        color: files.length > 0 && !isProcessing ? 'white' : 'var(--text-muted)',
                                        opacity: isProcessing ? 0.7 : 1,
                                    }}
                                    onMouseEnter={e => {
                                        if (files.length > 0 && !isProcessing) {
                                            e.currentTarget.style.background = 'var(--accent-strong)';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (files.length > 0 && !isProcessing) {
                                            e.currentTarget.style.background = 'var(--accent)';
                                        }
                                    }}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Run Tool'
                                    )}
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 border shadow-sm"
                                     style={{ background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.24)' }}>
                                    <File className="w-8 h-8" style={{ color: 'var(--emerald)' }} />
                                </div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Success!</h3>
                                <p className="text-center mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>Your files have been processed successfully.</p>
                                {resultPreview && (
                                    <pre className="w-full mb-6 max-h-40 overflow-auto p-3 rounded-lg border border-[var(--border)] text-xs whitespace-pre-wrap font-mono" style={{ background: 'rgba(94, 80, 70, 0.02)', color: 'var(--text-primary)' }}>
                                        {resultPreview}
                                    </pre>
                                )}

                                <div className="flex flex-row gap-3 w-full">
                                    <button
                                        onClick={reset}
                                        className="flex-1 py-2.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-muted)] transition-colors font-semibold text-sm cursor-pointer"
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        Do Another
                                    </button>
                                    <button
                                        onClick={downloadResult}
                                        className="flex-1 flex items-center justify-center text-white py-2.5 rounded-lg transition-colors font-semibold text-sm shadow-lg cursor-pointer"
                                        style={{
                                            background: 'var(--accent)',
                                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = 'var(--accent-strong)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = 'var(--accent)';
                                        }}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
    );
}
