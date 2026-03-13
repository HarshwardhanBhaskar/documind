'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Upload, ArrowRight, Sparkles, Shield, Zap, FileText,
    CheckCircle, Cpu, ChevronRight, Activity
} from 'lucide-react';

const STATS = [
    { label: 'Documents Processed', value: '10M+' },
    { label: 'Accuracy', value: '99.8%' },
    { label: 'Time Saved', value: '80%' },
];

const TRUST = [
    { icon: Shield, label: 'SOC 2 Certified' },
    { icon: Zap, label: 'Real-time AI' },
    { icon: Sparkles, label: 'GPT-4 Powered' },
];

/* ─── Particles ─── */
type Dot = { w: string; h: string; left: string; top: string; bg: string; op: number; anim: string; delay: string };

function seeded01(seed: number): number {
    // Deterministic pseudo-random value in [0, 1) to keep SSR/CSR output identical.
    let x = seed | 0;
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
}

function createDots(count = 24): Dot[] {
    const pal = ['#6366F1', '#A78BFA', '#22D3EE'];
    return Array.from({ length: count }, (_, i) => ({
        w: `${(seeded01((i + 1) * 101) * 2.2 + 0.8).toFixed(1)}px`,
        h: `${(seeded01((i + 1) * 103) * 2.2 + 0.8).toFixed(1)}px`,
        left: `${(seeded01((i + 1) * 107) * 100).toFixed(1)}%`,
        top: `${(seeded01((i + 1) * 109) * 100).toFixed(1)}%`,
        bg: pal[i % 3],
        op: +(seeded01((i + 1) * 113) * 0.4 + 0.15).toFixed(2),
        anim: `particle-drift ${(seeded01((i + 1) * 127) * 16 + 10).toFixed(1)}s ease-in-out infinite`,
        delay: `${(seeded01((i + 1) * 131) * 9).toFixed(1)}s`,
    }));
}

function Particles() {
    const dots = useMemo(() => createDots(), []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {dots.map((d, i) => (
                <div key={i} className="absolute rounded-full"
                    style={{
                        width: d.w, height: d.h, left: d.left, top: d.top,
                        background: d.bg, opacity: d.op, animation: d.anim, animationDelay: d.delay
                    }} />
            ))}
        </div>
    );
}

/* ─── Pipeline Preview ─── */
const STEPS = [
    { icon: Upload, label: 'Document Received', sub: 'PDF · 2.4 MB', color: '#6366F1' },
    { icon: Cpu, label: 'AI Analyzing', sub: 'Parsing structure…', color: '#A78BFA' },
    { icon: FileText, label: 'Data Extracted', sub: '12 fields identified', color: '#22D3EE' },
    { icon: CheckCircle, label: 'Ready to Export', sub: 'All formats available', color: '#34D399' },
];
const FIELDS = [
    { k: 'Document Type', v: 'Invoice', hi: false },
    { k: 'Vendor', v: 'Acme Corp Ltd.', hi: false },
    { k: 'Amount', v: '$24,500.00', hi: true },
    { k: 'Date', v: 'Mar 7, 2026', hi: false },
    { k: 'Confidence', v: '99.4%', hi: true },
];

function ProductPreview() {
    const [step, setStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [show, setShow] = useState(false);
    const iv = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        iv.current = setInterval(() => {
            setStep(prev => {
                const next = (prev + 1) % STEPS.length;
                if (next === 0) { setShow(false); setProgress(0); }
                if (next === STEPS.length - 1) setShow(true);
                return next;
            });
        }, 1500);
        return () => { if (iv.current) clearInterval(iv.current); };
    }, []);

    useEffect(() => {
        const id = setInterval(() => setProgress(p => Math.min(p + 1.4, 100)), 60);
        return () => clearInterval(id);
    }, [step]);

    return (
        /* FIX: outer "device frame" container gives visual depth and clear boundary */
        <div className="relative w-full max-w-[390px] mx-auto">
            {/* Ambient glow */}
            <div className="absolute -inset-8 rounded-3xl pointer-events-none" aria-hidden="true"
                style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.18) 0%, rgba(167,139,250,0.10) 45%, transparent 70%)' }} />

            {/* FIX: parent "frame" wrapping all three sub-panels */}
            <div className="relative flex flex-col gap-3 p-4 rounded-3xl"
                style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}>

                {/* Title bar dots */}
                <div className="flex items-center gap-1.5 px-1 mb-1" aria-hidden="true">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(239,68,68,0.7)' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(234,179,8,0.7)' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(34,197,94,0.7)' }} />
                    <div className="flex-1 mx-4 h-5 rounded-md flex items-center justify-center text-[10px] font-mono"
                        style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.2)' }}>
                        app.documind.ai
                    </div>
                </div>

                {/* File card */}
                <div className="relative rounded-xl p-3.5 overflow-hidden"
                    style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.2)',
                        boxShadow: '0 0 0 1px rgba(99,102,241,0.12), 0 8px 24px rgba(0,0,0,0.3)'
                    }}>
                    {/* Scan line */}
                    <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none" aria-hidden="true">
                        <div className="w-full h-0.5"
                            style={{
                                background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.7),transparent)',
                                animation: 'scan 3s ease-in-out infinite'
                            }} />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: 'linear-gradient(135deg,#6366F1,#A78BFA)', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
                            <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-[13px] font-semibold truncate">Q4_Invoice_2024.pdf</p>
                            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>2.4 MB · PDF Document</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full glow-breathe" style={{ background: '#34D399' }} />
                            <span className="text-[10px] font-medium" style={{ color: '#34D399' }}>Live</span>
                        </div>
                    </div>
                    <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <div className="h-full rounded-full transition-all duration-100"
                            style={{
                                width: `${progress}%`, background: 'linear-gradient(90deg,#6366F1,#22D3EE)',
                                boxShadow: '0 0 8px rgba(99,102,241,0.6)'
                            }} />
                    </div>
                    <div className="mt-1.5 flex justify-between">
                        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.28)' }}>{STEPS[step].sub}</span>
                        <span className="text-[10px] font-bold" style={{ color: '#818CF8' }}>{Math.round(progress)}%</span>
                    </div>
                </div>

                {/* Pipeline grid */}
                <div className="grid grid-cols-2 gap-2">
                    {STEPS.map((s, idx) => {
                        const Icon = s.icon;
                        const done = idx < step;
                        const cur = idx === step;
                        return (
                            <div key={s.label}
                                className="relative flex items-center gap-2 px-2.5 py-2.5 rounded-xl transition-all duration-300"
                                style={{
                                    background: cur ? `${s.color}12` : done ? 'rgba(52,211,153,0.06)' : 'rgba(255,255,255,0.02)',
                                    border: cur ? `1px solid ${s.color}45` : done ? '1px solid rgba(52,211,153,0.18)' : '1px solid rgba(255,255,255,0.06)',
                                }}>
                                {cur && (
                                    <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
                                        style={{ border: `1px solid ${s.color}55` }}
                                        animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }}
                                        aria-hidden="true" />
                                )}
                                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ background: `${s.color}18` }}>
                                    {done
                                        ? <CheckCircle style={{ width: '0.875rem', height: '0.875rem', color: '#34D399' }} />
                                        : <Icon className="w-3.5 h-3.5" style={{ color: cur ? s.color : 'rgba(255,255,255,0.22)' }} />}
                                </div>
                                <p className={`text-[11px] font-semibold leading-tight truncate ${cur || done ? 'text-white' : 'text-white/25'}`}>
                                    {s.label}
                                </p>
                                {cur && (
                                    <motion.div className="shrink-0 w-1.5 h-1.5 rounded-full ml-auto"
                                        style={{ background: s.color }}
                                        animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.9, repeat: Infinity }} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Extracted data */}
                <div className="rounded-xl p-3.5"
                    style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.14)' }}>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-4 h-4 rounded flex items-center justify-center"
                            style={{ background: 'rgba(167,139,250,0.15)' }}>
                            <Sparkles className="w-2.5 h-2.5" style={{ color: '#A78BFA' }} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(167,139,250,0.6)' }}>
                            AI Extracted Fields
                        </span>
                        <div className="ml-auto flex items-center gap-1">
                            <Activity className="w-2.5 h-2.5" style={{ color: '#34D399' }} />
                            <span className="text-[10px]" style={{ color: '#34D399' }}>Live</span>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        {FIELDS.map((f, idx) => (
                            <motion.div key={f.k}
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: show ? 1 : 0.15, x: show ? 0 : 8 }}
                                transition={{ delay: idx * 0.07, duration: 0.25 }}
                                className="flex items-center justify-between py-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.32)' }}>{f.k}</span>
                                <span className={`text-[11px] font-semibold ${f.hi ? 'text-indigo-300' : 'text-white/75'}`}>{f.v}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Hero ─── */
export default function Hero() {
    return (
        <section
            id="hero"
            className="relative flex flex-col justify-center overflow-hidden grid-bg border-t border-white/10 py-40"
            style={{ minHeight: '760px' }}
        >

            {/* Blobs */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute -top-32 -left-16 w-[700px] h-[700px] rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.10) 0%,transparent 65%)' }} />
                <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(167,139,250,0.08) 0%,transparent 70%)' }} />
                <div className="absolute -bottom-32 left-0 w-[400px] h-[400px] rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(34,211,238,0.06) 0%,transparent 70%)' }} />
            </div>
            <Particles />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* ── Copy ── */}
                    <div className="flex flex-col gap-7">

                        {/* Badge */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <div className="w-fit flex items-center gap-2.5 px-4 py-2 rounded-full"
                                style={{ background: 'rgba(99,102,241,0.09)', border: '1px solid rgba(99,102,241,0.22)', backdropFilter: 'blur(16px)' }}>
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                        style={{ background: '#818CF8' }}></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#818CF8' }}></span>
                                </span>
                                <span className="text-xs font-semibold tracking-wider uppercase"
                                    style={{ color: 'rgba(199,210,254,0.72)' }}>AI-Powered · Public Beta</span>
                            </div>
                        </motion.div>

                        {/* Headline — FIX: explicit padding-left ensures it's never flush to viewport edge */}
                        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, delay: 0.1 }}
                            className="font-black text-white"
                            style={{ fontSize: 'clamp(2.5rem,5vw,4.5rem)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
                            Intelligent<br />
                            <span style={{
                                background: 'linear-gradient(90deg,#818CF8 0%,#C7D2FE 35%,#818CF8 55%,#A78BFA 100%)',
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                animation: 'shimmer-move 3s linear infinite',
                            }}>Document AI</span><br />
                            <span style={{ color: '#F1F5F9' }}>for modern teams</span>
                        </motion.h1>

                        {/* Sub */}
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-base lg:text-lg leading-[1.8] max-w-[460px]"
                            style={{ color: 'rgba(241,245,249,0.52)' }}>
                            Automate document workflows with cutting-edge AI — merge, split, compress,
                            extract, and classify at enterprise scale. From upload to insight in seconds.
                        </motion.p>

                        {/* Trust badges */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.28 }} className="flex flex-wrap gap-2">
                            {TRUST.map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass text-xs font-medium"
                                    style={{ color: 'rgba(241,245,249,0.5)', border: '1px solid rgba(255,255,255,0.09)' }}>
                                    <Icon className="w-3.5 h-3.5" style={{ color: '#818CF8' }} />
                                    {label}
                                </div>
                            ))}
                        </motion.div>

                        {/* CTAs */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.36 }} className="flex flex-wrap items-center gap-4">
                            <motion.a
                                href="#demo" id="hero-upload-btn"
                                whileHover={{ y: -4, scale: 1.04, boxShadow: '0 0 48px rgba(99,102,241,0.70), 0 12px 48px rgba(99,102,241,0.38)' }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                                className="group relative inline-flex items-center gap-2.5 rounded-2xl text-sm font-bold text-white overflow-hidden"
                                style={{
                                    padding: '0.875rem 1.875rem',
                                    background: 'linear-gradient(135deg,#6366F1 0%,#818CF8 50%,#A78BFA 100%)',
                                    boxShadow: '0 0 28px rgba(99,102,241,0.50),0 8px 32px rgba(99,102,241,0.28)'
                                }}>
                                <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ background: 'linear-gradient(135deg,#818CF8,#A78BFA)' }} aria-hidden="true" />
                                <Upload className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform" />
                                <span className="relative z-10">Upload a Document</span>
                                <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                            </motion.a>
                            <motion.a
                                href="#features"
                                whileHover={{ y: -3, scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                                className="group inline-flex items-center gap-2 rounded-2xl text-sm font-semibold"
                                style={{
                                    padding: '0.875rem 1.625rem', background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.11)', color: 'rgba(241,245,249,0.65)'
                                }}>
                                See how it works
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </motion.a>
                        </motion.div>

                        {/* Stats */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.52 }}
                            className="flex gap-8 pt-6 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                            {STATS.map(s => (
                                <div key={s.label} className="flex flex-col gap-1">
                                    <span className="text-2xl font-black" style={{
                                        background: 'linear-gradient(135deg,#818CF8,#22D3EE)',
                                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                                    }}>{s.value}</span>
                                    <span className="text-[11px] font-medium uppercase tracking-wide"
                                        style={{ color: 'rgba(241,245,249,0.3)' }}>{s.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* ── Preview ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 32, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="hidden lg:block float-anim"
                        style={{ animationDuration: '8s' }}
                        aria-label="DocuMind product preview">
                        <ProductPreview />
                    </motion.div>

                </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none"
                style={{ background: 'linear-gradient(to top,#0A0A0A 0%,transparent 100%)' }} />
        </section>
    );
}
