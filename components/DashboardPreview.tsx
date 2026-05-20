'use client';

import { motion } from 'framer-motion';
import {
    Eye, FolderOpen, Wrench, Clock, Settings, FileText,
    MoreHorizontal, Download, Tag, ChevronRight, Zap, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

const sidebarItems = [
    { icon: FolderOpen, label: 'Documents', active: true, badge: '124' },
    { icon: Wrench, label: 'AI Tools', active: false, badge: '6' },
    { icon: TrendingUp, label: 'Analytics', active: false, badge: null },
    { icon: Clock, label: 'History', active: false, badge: '48' },
    { icon: Settings, label: 'Settings', active: false, badge: null },
];

const files = [
    { name: 'Q4_Financial_Report.pdf', type: 'PDF', size: '2.4 MB', tag: 'Finance', tagC: '#6366F1', ok: true },
    { name: 'Contract_Amendment_v3.docx', type: 'DOCX', size: '890 KB', tag: 'Legal', tagC: '#A78BFA', ok: true },
    { name: 'Invoice_Dec_2024.pdf', type: 'PDF', size: '156 KB', tag: 'Billing', tagC: '#22D3EE', ok: true },
    { name: 'Employee_Handbook.pdf', type: 'PDF', size: '5.1 MB', tag: 'HR', tagC: '#34D399', ok: false },
];

const dataFields = [
    { k: 'Document Type', v: 'Financial Report' },
    { k: 'Date', v: 'December 2024' },
    { k: 'Author', v: 'Finance Dept.' },
    { k: 'Pages', v: '42' },
    { k: 'Language', v: 'English' },
    { k: 'Confidence', v: '99.2%' },
];

export default function DashboardPreview() {
    return (
        <section id="dashboard" className="relative py-32 border-t border-[var(--border)]">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-0 inset-x-0 section-divider" />
                <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)' }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.55 }}
                    className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full border border-[var(--border)] mb-5">
                        <Eye className="w-3.5 h-3.5" style={{ color: 'var(--violet)' }} />
                        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Dashboard Preview</span>
                    </div>
                    <h2 className="text-3xl font-semibold text-center mb-4" style={{ color: 'var(--text-primary)' }}>
                        Your intelligent{' '}
                        <span className="gradient-text">document hub</span>
                    </h2>
                    <p className="leading-relaxed max-w-2xl mx-auto text-center" style={{ color: 'var(--text-secondary)' }}>
                        One unified workspace where every document is processed, organised, and ready to act on.
                    </p>
                </motion.div>

                {/* Dashboard mockup — max-w-5xl centred product card */}
                <div className="mt-16 w-full max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        whileHover={{ y: -4, scale: 1.006 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.72, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="dashboard-frame"
                        role="img" aria-label="NeuroDocs dashboard"
                    >
                        {/* Title bar */}
                        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--border)]"
                            style={{ background: 'var(--bg-card)' }}>
                            <div className="flex gap-1.5" aria-hidden="true">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="px-5 py-1 rounded-md text-xs font-mono border border-[var(--border)]"
                                    style={{ background: 'var(--border)', color: 'var(--text-muted)' }}>
                                    app.neurodocs.ai/dashboard
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}>
                                    <Zap className="w-3.5 h-3.5 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="flex min-h-[500px]">
                            {/* ── Sidebar ── */}
                            <aside className="w-52 border-r border-[var(--border)] flex flex-col p-3 gap-0.5 shrink-0"
                                style={{ background: 'var(--bg-card)' }}>
                                {/* Logo in sidebar */}
                                <div className="flex items-center gap-2 px-3 py-2.5 mb-3">
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}>
                                        <FileText className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <span className="font-black text-sm" style={{ color: 'var(--text-primary)' }}>NeuroDocs</span>
                                </div>

                                {sidebarItems.map(({ icon: Icon, label, active, badge }) => (
                                    <Link href="/dashboard" key={label}
                                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${active
                                            ? 'font-semibold'
                                            : 'hover:bg-[var(--nav-dropdown-hover)]'
                                            }`}
                                        style={active 
                                            ? { background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.18)', color: 'var(--indigo)' } 
                                            : { color: 'var(--text-secondary)' }
                                        }
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        <span className="text-sm flex-1">{label}</span>
                                        {badge && (
                                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                                                style={{ background: active ? 'rgba(99,102,241,0.15)' : 'var(--border)', color: active ? 'var(--indigo)' : 'var(--text-muted)' }}>
                                                {badge}
                                            </span>
                                        )}
                                    </Link>
                                ))}

                                {/* Storage widget */}
                                <div className="mt-auto mx-1 p-3 rounded-xl border border-[var(--border)]"
                                    style={{ background: 'rgba(99,102,241,0.06)' }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Storage</p>
                                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>6.2/10 GB</p>
                                    </div>
                                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                                        <div className="h-full w-[62%] rounded-full"
                                            style={{ background: 'linear-gradient(90deg,#6366F1,#A78BFA)' }} />
                                    </div>
                                </div>
                            </aside>

                            {/* ── Main ── */}
                            <main className="flex-1 flex flex-col min-w-0" style={{ background: 'var(--bg)' }}>
                                {/* Topbar */}
                                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)]">
                                    <div>
                                        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>All Documents</h3>
                                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>124 files · 3 processing</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-xl border border-[var(--border)] text-xs" style={{ color: 'var(--text-secondary)' }}>
                                            <Tag className="w-3 h-3" /> Filter
                                        </div>
                                        <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white font-semibold cursor-pointer transition-opacity hover:opacity-90"
                                            style={{ background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}>
                                            + Upload
                                        </Link>
                                    </div>
                                </div>

                                <div className="flex flex-1 min-h-0">
                                    {/* File list */}
                                    <div className="flex-1 p-4 space-y-2 overflow-auto">
                                        {files.map((f) => (
                                            <Link href="/dashboard" key={f.name}
                                                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-indigo-500/20 transition-colors group cursor-pointer"
                                                style={{ background: 'var(--bg-card)' }}>
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                                    style={{ background: `${f.tagC}15` }}>
                                                    <FileText className="w-4 h-4" style={{ color: f.tagC }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{f.name}</p>
                                                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{f.type} · {f.size}</p>
                                                </div>
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                                                    style={{ background: `${f.tagC}18`, color: f.tagC }}>
                                                    {f.tag}
                                                </span>
                                                <div className={`w-2 h-2 rounded-full shrink-0 ${f.ok ? 'bg-[var(--emerald)]' : 'bg-amber-400 animate-pulse'}`} />
                                                <MoreHorizontal className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" style={{ color: 'var(--text-muted)' }} />
                                            </Link>
                                        ))}
                                    </div>

                                    {/* ── Extracted data panel ── */}
                                    <aside className="w-52 border-l border-[var(--border)] p-4 shrink-0 hidden lg:flex flex-col gap-4" style={{ background: 'var(--bg-card)' }}>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>AI Extracted Data</p>
                                            <div className="space-y-3">
                                                {dataFields.map(({ k, v }) => (
                                                    <div key={k} className="flex flex-col gap-0.5">
                                                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{k}</span>
                                                        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{v}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-auto space-y-2">
                                            <button className="w-full flex items-center gap-2 px-3 py-2 glass rounded-xl border border-[var(--border)] text-xs hover:text-white transition-colors" style={{ color: 'var(--text-secondary)' }}>
                                                <Eye className="w-3 h-3" /> Preview
                                                <ChevronRight className="w-3 h-3 ml-auto" />
                                            </button>
                                            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                                                style={{ background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.2)', color: 'var(--emerald)' }}>
                                                <Download className="w-3 h-3" /> Export
                                                <ChevronRight className="w-3 h-3 ml-auto" />
                                            </button>
                                        </div>
                                    </aside>
                                </div>
                            </main>
                        </div>
                    </motion.div>
                </div>{/* /max-w-5xl wrapper */}
            </div>
        </section>
    );
}
