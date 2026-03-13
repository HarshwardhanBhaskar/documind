'use client';

import { motion } from 'framer-motion';
import { Server, Lock, Zap, Globe } from 'lucide-react';

const STACK = [
    { icon: Globe, label: 'Next.js 16', sub: 'Frontend & Routing', color: '#6366F1' },
    { icon: Zap, label: 'FastAPI', sub: 'Python Backend', color: '#22D3EE' },
    { icon: Server, label: 'Supabase', sub: 'DB + Auth + Storage', color: '#34D399' },
    { icon: Lock, label: 'EasyOCR + BART', sub: 'AI Processing', color: '#A78BFA' },
];

export default function TechStack() {
    return (
        <section className="relative py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-xs uppercase tracking-widest text-slate-600 font-bold mb-8"
                >
                    Built with modern, production-grade technologies
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {STACK.map((t) => {
                        const Icon = t.icon;
                        return (
                            <div
                                key={t.label}
                                className="card-hover flex flex-col items-center gap-3 py-6 px-4 rounded-xl text-center"
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    backdropFilter: 'blur(16px)',
                                }}
                            >
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ background: `${t.color}18`, border: `1px solid ${t.color}30` }}>
                                    <Icon className="w-5 h-5" style={{ color: t.color }} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{t.label}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{t.sub}</p>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
