'use client';

import { motion } from 'framer-motion';
import {
    Eye, FolderOpen, Wrench, Clock, Settings, FileText,
    MoreHorizontal, Download, Tag, ChevronRight, Zap, TrendingUp
} from 'lucide-react';

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
        <section id="dashboard" className="relative py-32 border-t border-white/10">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-0 inset-x-0 section-divider" />
                <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)' }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.55 }}
                    className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full border border-violet-500/20 mb-5">
                        <Eye className="w-3.5 h-3.5 text-violet-400" />
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Dashboard Preview</span>
                    </div>
                    <h2 className="text-3xl font-semibold text-center text-white mb-4">
                        Your intelligent{' '}
                        <span className="gradient-text">document hub</span>
                    </h2>
                    <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto text-center">
                        One unified workspace where every document is processed, organised, and ready to act on.
                    </p>
                </motion.div>

                {/* Dashboard mockup — max-w-5xl centred product card */}`n                <div className="mt-16 w-full max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        whileHover={{ y: -4, scale: 1.006 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.72, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="dashboard-frame"
                        role="img" aria-label="DocuMind dashboard"
                    >
                        {/* Title bar */}
                        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/7"
                            style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <div className="flex gap-1.5" aria-hidden="true">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="px-5 py-1 rounded-md text-xs text-white/25 font-mono border border-white/8"
                                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                                    app.documind.ai/dashboard
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
                            <aside className="w-52 border-r border-white/7 flex flex-col p-3 gap-0.5 shrink-0"
                                style={{ background: 'rgba(255,255,255,0.01)' }}>
                                {/* Logo in sidebar */}
                                <div className="flex items-center gap-2 px-3 py-2.5 mb-3">
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}>
                                        <FileText className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <span className="text-white font-black text-sm">DocuMind</span>
                                </div>

                                {sidebarItems.map(({ icon: Icon, label, active, badge }) => (
                                    <div key={label}
                                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${active
                                            ? 'text-indigo-300 font-semibold'
                                            : 'text-white/35 hover:text-white/60 hover:bg-white/4'
                                            }`}
                                        style={active ? { background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.18)' } : {}}
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        <span className="text-sm flex-1">{label}</span>
                                        {badge && (
                                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                                                style={{ background: active ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.07)', color: active ? '#818CF8' : 'rgba(255,255,255,0.35)' }}>
                                                {badge}
                                            </span>
                                        )}
                                    </div>
                                ))}

                                {/* Storage widget */}
                                <div className="mt-auto mx-1 p-3 rounded-xl border border-white/7"
                                    style={{ background: 'rgba(99,102,241,0.06)' }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-[11px] text-white/40 font-medium">Storage</p>
                                        <p className="text-[11px] text-white/30">6.2/10 GB</p>
                                    </div>
                                    <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                                        <div className="h-full w-[62%] rounded-full"
                                            style={{ background: 'linear-gradient(90deg,#6366F1,#A78BFA)' }} />
                                    </div>
                                </div>
                            </aside>

                            {/* ── Main ── */}
                            <main className="flex-1 flex flex-col min-w-0">
                                {/* Topbar */}
                                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/7">
                                    <div>
                                        <h3 className="text-white font-bold text-sm">All Documents</h3>
                                        <p className="text-white/30 text-xs mt-0.5">124 files · 3 processing</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-xl border border-white/10 text-xs text-white/40">
                                            <Tag className="w-3 h-3" /> Filter
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white font-semibold cursor-pointer transition-opacity hover:opacity-90"
                                            style={{ background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}>
                                            + Upload
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-1 min-h-0">
                                    {/* File list */}
                                    <div className="flex-1 p-4 space-y-2 overflow-auto">
                                        {files.map((f) => (
                                            <div key={f.name}
                                                className="flex items-center gap-3 p-3 rounded-xl border border-white/7 hover:border-white/14 transition-colors group cursor-pointer"
                                                style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                                    style={{ background: `${f.tagC}15` }}>
                                                    <FileText className="w-4 h-4" style={{ color: f.tagC }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-xs font-medium truncate">{f.name}</p>
                                                    <p className="text-white/30 text-xs mt-0.5">{f.type} · {f.size}</p>
                                                </div>
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                                                    style={{ background: `${f.tagC}18`, color: f.tagC }}>
                                                    {f.tag}
                                                </span>
                                                <div className={`w-2 h-2 rounded-full shrink-0 ${f.ok ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                                                <MoreHorizontal className="w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* ── Extracted data panel ── */}
                                    <aside className="w-52 border-l border-white/7 p-4 shrink-0 hidden lg:flex flex-col gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">AI Extracted Data</p>
                                            <div className="space-y-3">
                                                {dataFields.map(({ k, v }) => (
                                                    <div key={k} className="flex flex-col gap-0.5">
                                                        <span className="text-[10px] text-white/25">{k}</span>
                                                        <span className="text-xs font-semibold text-white/75">{v}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-auto space-y-2">
                                            <button className="w-full flex items-center gap-2 px-3 py-2 glass rounded-xl border border-white/10 text-xs text-white/50 hover:text-white transition-colors">
                                                <Eye className="w-3 h-3" /> Preview
                                                <ChevronRight className="w-3 h-3 ml-auto" />
                                            </button>
                                            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-colors"
                                                style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.2)', color: '#34D399' }}>
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
