'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap, CheckCircle } from 'lucide-react';

const PERKS = [
    'No credit card required',
    '50 free documents / month',
    'All AI features included',
    'Cancel anytime',
];

export default function CTA() {
    return (
        <section id="pricing" className="relative py-40 border-t border-white/10 overflow-hidden text-center">
            <div className="section-divider absolute top-0 inset-x-0" />

            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full"
                    style={{ background: 'radial-gradient(ellipse,rgba(99,102,241,0.10) 0%,rgba(167,139,250,0.06) 45%,transparent 70%)' }} />
                <div className="absolute inset-0 grid-bg opacity-40" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.65 }}
                    className="flex flex-col items-center gap-8 max-w-3xl mx-auto">

                    {/* FIX: badge pill instead of floating icon box */}
                    <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full"
                        style={{ background: 'rgba(99,102,241,0.09)', border: '1px solid rgba(99,102,241,0.22)', backdropFilter: 'blur(16px)' }}>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                style={{ background: '#818CF8' }}></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: '#818CF8' }}></span>
                        </span>
                        <span className="text-xs font-bold uppercase tracking-[0.1em]" style={{ color: 'rgba(199,210,254,0.72)' }}>
                            AI-Powered Document Platform
                        </span>
                    </div>

                    {/* Headline */}
                    <div>
                        <h2 className="text-4xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-5 text-center mx-auto">
                            Start processing<br />
                            <span style={{
                                background: 'linear-gradient(90deg,#818CF8 0%,#C7D2FE 35%,#818CF8 55%,#A78BFA 100%)',
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                animation: 'shimmer-move 3s linear infinite',
                            }}>documents today</span>
                        </h2>
                        <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto text-center text-lg">
                            Join 50,000+ teams who automate their document workflows.
                            Set up in minutes — no complex configuration needed.
                        </p>
                    </div>

                    {/* Perks */}
                    <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm">
                        {PERKS.map(p => (
                            <div key={p} className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
                                style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.09)', backdropFilter: 'blur(20px)' }}>
                                <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: '#34D399' }} />
                                <span className="text-xs font-medium" style={{ color: 'rgba(241,245,249,0.55)' }}>{p}</span>
                            </div>
                        ))}
                    </div>

                    {/* Buttons — FIX: minWidth on primary so it reads as dominant on wide viewports */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <motion.a
                            href="#demo" id="cta-main-btn"
                            whileHover={{ y: -4, scale: 1.03, boxShadow: '0 0 56px rgba(99,102,241,0.75), 0 16px 56px rgba(99,102,241,0.40)' }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                            className="group relative inline-flex items-center gap-2.5 rounded-2xl text-base font-bold text-white overflow-hidden"
                            style={{
                                padding: '1rem 2.25rem',
                                minWidth: '280px',
                                justifyContent: 'center',
                                background: 'linear-gradient(135deg,#6366F1 0%,#818CF8 50%,#A78BFA 100%)',
                                boxShadow: '0 0 36px rgba(99,102,241,0.55),0 12px 40px rgba(99,102,241,0.30)',
                            }}>
                            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                                style={{ background: 'linear-gradient(135deg,#818CF8,#A78BFA)' }} aria-hidden="true" />
                            <Zap className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                            <span className="relative z-10">Start Processing Documents</span>
                            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                        </motion.a>
                        {/* FIX: secondary has a visible border so it reads as a button, not text */}
                        <a href="#features"
                            className="group inline-flex items-center justify-center gap-2 rounded-2xl text-base font-semibold transition-all duration-250 hover:-translate-y-1"
                            style={{
                                padding: '1rem 1.875rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.14)',
                                color: 'rgba(241,245,249,0.65)',
                            }}>
                            View All Features
                        </a>
                    </div>

                    <p className="text-xs" style={{ color: 'rgba(241,245,249,0.2)' }}>
                        Trusted by startups, Fortune 500s, and government agencies worldwide.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
