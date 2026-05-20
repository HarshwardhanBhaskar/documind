'use client';

import { motion, type Variants } from 'framer-motion';
import { Upload, ScanText, BrainCircuit, Database, ArrowRight, CheckCircle2 } from 'lucide-react';

const STEPS = [
    {
        step: '01',
        icon: Upload,
        title: 'Upload Document',
        description: 'Drag & drop any PDF, image, or scanned form. Supports 20+ formats with instant preview.',
        color: '#6366F1',
        glow: 'rgba(99,102,241,0.25)',
    },
    {
        step: '02',
        icon: ScanText,
        title: 'OCR Extraction',
        description: 'EasyOCR runs on every page at 99.8% accuracy, extracting raw text even from low-quality scans.',
        color: '#A78BFA',
        glow: 'rgba(167,139,250,0.25)',
    },
    {
        step: '03',
        icon: BrainCircuit,
        title: 'AI Analysis',
        description: 'Our classification engine detects document type — Invoice, Contract, Resume, Certificate, and more.',
        color: '#22D3EE',
        glow: 'rgba(34,211,238,0.25)',
    },
    {
        step: '04',
        icon: Database,
        title: 'Structured Output',
        description: 'Relevant fields are extracted and returned as clean JSON — ready for any downstream system.',
        color: '#34D399',
        glow: 'rgba(52,211,153,0.25)',
    },
];

const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

const card: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function AIPipeline() {
    return (
        <section id="pipeline" className="relative py-32 overflow-hidden">
            <div className="section-divider absolute top-0 inset-x-0" />

            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full"
                    style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 70%)' }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center text-center mb-16"
                >
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)', backdropFilter: 'blur(16px)' }}>
                        <BrainCircuit className="w-3.5 h-3.5" style={{ color: 'var(--cyan)' }} />
                        <span className="text-badge" style={{ color: 'var(--cyan)' }}>AI Processing Pipeline</span>
                    </div>

                    <h2 className="text-h2 mb-4 max-w-2xl" style={{ color: 'var(--text-primary)' }}>
                        From upload to{' '}
                        <span className="gradient-text">structured intelligence</span>
                    </h2>
                    <p className="text-body max-w-xl">
                        Four automated stages transform any raw document into clean, structured data — in seconds.
                    </p>
                </motion.div>

                {/* 4-step grid */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {STEPS.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <motion.div
                                key={s.step}
                                variants={card}
                                whileHover={{ y: -6, scale: 1.02 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                                className="card-hover group relative rounded-2xl overflow-hidden"
                                style={{
                                    padding: '1.75rem',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    backdropFilter: 'blur(20px)',
                                }}
                            >
                                {/* Hover glow */}
                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                    style={{ background: `radial-gradient(circle at 30% 30%, ${s.glow}, transparent 65%)` }} />

                                {/* Step number */}
                                <div className="absolute top-4 right-4 text-xs font-black tracking-widest"
                                    style={{ color: s.color, opacity: 0.4 }}>
                                    {s.step}
                                </div>

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                                        style={{ background: `${s.color}18`, border: `1px solid ${s.color}33` }}>
                                        <Icon className="w-5 h-5" style={{ color: s.color }} />
                                    </div>

                                    <h3 className="text-h3 mb-2" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
                                    <p className="text-muted text-sm leading-relaxed">{s.description}</p>

                                    {/* Connector arrow (not on last) */}
                                    {i < STEPS.length - 1 && (
                                        <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                                            <ArrowRight className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                                        </div>
                                    )}

                                    {/* Check on complete */}
                                    {i === STEPS.length - 1 && (
                                        <div className="mt-4 flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--emerald)' }} />
                                            <span className="text-xs font-semibold" style={{ color: 'var(--emerald)' }}>Output ready</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Sample output card with integrated premium illustration */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, delay: 0.3 }}
                    className="mt-12 rounded-2xl overflow-hidden"
                    style={{
                        background: 'var(--dashboard-bg)',
                        border: '1px solid var(--dashboard-border)',
                        boxShadow: '0 20px 60px var(--dashboard-shadow)',
                        backdropFilter: 'blur(24px)',
                    }}
                >
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--border)]">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                        <span className="ml-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>POST /smart-classify/file → 200 OK</span>
                    </div>
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch font-mono text-sm">
                        {/* Illustration Panel */}
                        <div className="relative h-64 lg:h-auto overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-center group/panel">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-cyan-500/5 pointer-events-none z-10" />
                            <img
                                src="/ai_engine_illustration.png"
                                alt="AI Engine Document Parsing pipeline"
                                className="w-full h-full object-cover select-none transition-transform duration-700 group-hover/panel:scale-105"
                            />
                        </div>
                        {/* Response Block */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="mb-2 text-xs uppercase tracking-widest font-sans" style={{ color: 'var(--text-muted)' }}>Response</p>
                                <pre className="text-left leading-7" style={{ color: 'var(--text-secondary)' }}>{`{
  "document_type": "Invoice",
  "confidence": 0.94,
  "fields": {
    "vendor": "Acme Corp Ltd.",
    "invoice_id": "INV-2024-0099",
    "amount": "$5,400.00",
    "date": "March 14, 2024",
    "due_date": "March 28, 2024"
  }
}`}</pre>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="mb-1 text-xs uppercase tracking-widest font-sans" style={{ color: 'var(--text-muted)' }}>Extracted Fields</p>
                                {[
                                    { k: 'document_type', v: 'Invoice', color: 'var(--indigo)' },
                                    { k: 'confidence', v: '94%', color: 'var(--emerald)' },
                                    { k: 'vendor', v: 'Acme Corp Ltd.', color: 'var(--text-primary)' },
                                    { k: 'amount', v: '$5,400.00', color: 'var(--emerald)' },
                                    { k: 'date', v: 'March 14, 2024', color: 'var(--text-primary)' },
                                ].map(row => (
                                    <div key={row.k} className="flex items-center justify-between py-1.5 border-b border-[var(--border)]">
                                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{row.k}</span>
                                        <span className="text-xs font-semibold" style={{ color: row.color }}>{row.v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="section-divider absolute bottom-0 inset-x-0" />
        </section>
    );
}
