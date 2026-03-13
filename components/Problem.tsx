'use client';

import { motion } from 'framer-motion';
import { FileX2, Clock4, AlertTriangle } from 'lucide-react';

const PROBLEMS = [
    {
        icon: FileX2,
        title: 'Manual data entry is killing productivity',
        description: 'Teams spend 40% of their time extracting data from documents by hand — error-prone, tedious, and unscalable.',
        color: '#F87171',
    },
    {
        icon: Clock4,
        title: 'Processing backlogs pile up fast',
        description: 'Without automation, document queues grow exponentially during peak periods, delaying decisions that matter.',
        color: '#FB923C',
    },
    {
        icon: AlertTriangle,
        title: 'Siloed formats, zero structure',
        description: 'PDFs, scans, Word docs — critical business data locked in formats that no software can read or act on.',
        color: '#FBBF24',
    },
];

export default function Problem() {
    return (
        <section className="relative py-32 overflow-hidden border-t border-white/5">
            <div className="section-divider absolute top-0 inset-x-0" />
            <div className="absolute inset-0 pointer-events-none grid-bg opacity-20" aria-hidden="true" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <p className="text-xs uppercase tracking-widest font-bold text-red-400/70 mb-4">The Problem</p>
                    <h2 className="text-h2 text-white mb-4 max-w-2xl mx-auto">
                        Documents are your{' '}
                        <span style={{ color: '#F87171' }}>biggest bottleneck</span>
                    </h2>
                    <p className="text-body max-w-xl mx-auto">
                        Every business drowns in unstructured documents. Most teams process them manually — slowly, expensively, inaccurately.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PROBLEMS.map((p, i) => {
                        const Icon = p.icon;
                        return (
                            <motion.div
                                key={p.title}
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="card-hover rounded-2xl p-6"
                                style={{
                                    background: 'rgba(255,255,255,0.025)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    backdropFilter: 'blur(16px)',
                                }}
                            >
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                    style={{ background: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                                    <Icon className="w-5 h-5" style={{ color: p.color }} />
                                </div>
                                <h3 className="text-h3 text-white mb-2">{p.title}</h3>
                                <p className="text-muted text-sm leading-relaxed">{p.description}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* The solution bridge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-12 text-center"
                >
                    <p className="text-sm text-slate-500">
                        DocuMind solves all three — automatically, at scale, in seconds.
                    </p>
                </motion.div>
            </div>
            <div className="section-divider absolute bottom-0 inset-x-0" />
        </section>
    );
}
