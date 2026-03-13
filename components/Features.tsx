'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Files, Minimize2, RefreshCcw, ScanText, BrainCircuit, Database, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ToolModal, { ToolType } from '@/components/ToolModal';

type FeatureId = ToolType | 'ocr' | 'ai' | 'extract';

interface FeatureItem {
    id: FeatureId;
    icon: LucideIcon;
    title: string;
    description: string;
    g: [string, string];
    glow: string;
    tag: string | null;
    interactive: boolean;
}

const FEATURES: FeatureItem[] = [
    { id: 'merge', icon: Files, title: 'Merge PDFs', description: 'Combine multiple PDFs into a single, perfectly ordered document in seconds.', g: ['#6366F1', '#4F46E5'], glow: 'rgba(99,102,241,0.22)', tag: 'Most Used', interactive: true },
    { id: 'compress', icon: Minimize2, title: 'Compress Documents', description: 'Reduce file size by up to 90% with lossless compression — zero quality loss.', g: ['#8B5CF6', '#7C3AED'], glow: 'rgba(139,92,246,0.22)', tag: null, interactive: true },
    { id: 'convert', icon: RefreshCcw, title: 'Convert Files', description: 'Convert PDF to PNG images with round-trip fidelity guaranteed.', g: ['#22D3EE', '#0EA5E9'], glow: 'rgba(34,211,238,0.22)', tag: null, interactive: true },
    { id: 'ocr', icon: ScanText, title: 'OCR Extraction', description: 'Extract searchable text from scanned documents and images with 99.8% accuracy.', g: ['#34D399', '#059669'], glow: 'rgba(52,211,153,0.22)', tag: 'AI-Powered', interactive: true },
    { id: 'ai', icon: BrainCircuit, title: 'AI Classification', description: 'Auto-classify and tag documents by type, department and priority using GPT-4.', g: ['#F472B6', '#DB2777'], glow: 'rgba(244,114,182,0.22)', tag: 'AI-Powered', interactive: true },
    { id: 'extract', icon: Database, title: 'Smart Extraction', description: 'Pull structured data from invoices, contracts, and forms into JSON, CSV or any other system.', g: ['#FB923C', '#EA580C'], glow: 'rgba(251,146,60,0.22)', tag: null, interactive: true },
];

function isToolType(id: FeatureId): id is ToolType {
    return id === 'merge' || id === 'compress' || id === 'convert';
}

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.10 } },
};

const item = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function Features() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTool, setSelectedTool] = useState<{ id: ToolType; title: string; desc: string } | null>(null);

    const openTool = (f: FeatureItem) => {
        if (!f.interactive || !isToolType(f.id)) return;
        setSelectedTool({ id: f.id, title: f.title, desc: f.description });
        setModalOpen(true);
    };

    return (
        <section id="features" className="relative py-32 border-t border-white/10">
            <div id="tools" className="absolute -top-24" aria-hidden="true" />
            <div className="section-divider absolute top-0 inset-x-0" />

            {/* Ambient blobs */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/2 -translate-y-1/2 -left-40 w-[520px] h-[520px] rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)' }} />
                <div className="absolute top-1/2 -translate-y-1/2 -right-40 w-[520px] h-[520px] rounded-full"
                    style={{ background: 'radial-gradient(circle,rgba(167,139,250,0.07) 0%,transparent 70%)' }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center text-center mb-16">

                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
                        style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.18)', backdropFilter: 'blur(16px)' }}>
                        <BrainCircuit className="w-3.5 h-3.5" style={{ color: '#A78BFA' }} />
                        <span className="text-badge" style={{ color: 'rgba(167,139,250,0.72)' }}>Tools &amp; Features</span>
                    </div>

                    <h2 className="text-3xl font-semibold text-center text-white mb-4 max-w-2xl mx-auto">
                        Everything you need to{' '}
                        <span className="gradient-text">master documents</span>
                    </h2>
                    <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto text-center">
                        A complete AI-powered toolkit — from basic PDF transformations to intelligent
                        data extraction and classification.
                    </p>
                </motion.div>

                {/* ── Cards grid ── */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {FEATURES.map(f => {
                        const Icon = f.icon;
                        return (
                            <motion.article
                                key={f.title}
                                variants={item}
                                whileHover={{ y: -8, scale: 1.012 }}
                                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                                className="group relative rounded-xl overflow-hidden cursor-pointer p-6 border border-white/10 bg-white/5 backdrop-blur hover:border-indigo-500/50 hover:scale-[1.02] transition duration-300"
                                onClick={() => openTool(f)}>

                                {/* Hover glow fill */}
                                <div
                                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                    style={{ background: `radial-gradient(circle at 25% 25%,${f.glow},transparent 60%)` }}
                                    aria-hidden="true" />

                                {/* Top shimmer line */}
                                <div
                                    className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-70 transition-opacity duration-300 rounded-full"
                                    style={{ background: `linear-gradient(90deg,transparent,${f.g[0]},${f.g[1]},transparent)` }}
                                    aria-hidden="true" />

                                <div className="relative z-10">
                                    {/* Icon + tag row */}
                                    <div className="flex items-start justify-between mb-5">
                                        <motion.div
                                            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                                            whileHover={{ scale: 1.15, rotate: 5 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                                            style={{
                                                background: `linear-gradient(135deg,${f.g[0]},${f.g[1]})`,
                                                boxShadow: `0 6px 20px ${f.glow}`,
                                            }}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </motion.div>

                                        {f.tag && (
                                            <span
                                                className="text-badge px-2.5 py-1 rounded-full"
                                                style={{
                                                    background: 'rgba(99,102,241,0.12)',
                                                    color: '#818CF8',
                                                    border: '1px solid rgba(99,102,241,0.22)',
                                                }}>
                                                {f.tag}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-medium text-white mb-2">{f.title}</h3>
                                    <p className="text-gray-400 leading-relaxed text-sm">{f.description}</p>

                                    {/* Explore link */}
                                    <div
                                        className="mt-5 flex items-center gap-1 text-xs font-semibold group-hover:text-indigo-400 transition-colors duration-250"
                                        style={{ color: 'rgba(241,245,249,0.35)' }}>
                                        <span>Explore</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-250" />
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </motion.div>
            </div>

            <div className="section-divider absolute bottom-0 inset-x-0" />

            {/* Tool Interactive Modal */}
            <ToolModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                tool={selectedTool?.id || 'merge'}
                title={selectedTool?.title || ''}
                description={selectedTool?.desc || ''}
            />
        </section>
    );
}
