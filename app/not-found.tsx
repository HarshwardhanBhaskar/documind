'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <section
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, #080c14 60%)' }}
        >
            {/* Ambient glow blobs */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }}
                />
                <div
                    className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)' }}
                />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto">

                {/* Animated 404 GIF from original source */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative mb-2"
                    style={{ width: '100%', maxWidth: '480px', height: '280px' }}
                >
                    {/* The 404 number as large gradient text overlaid on the GIF */}
                    <div
                        className="absolute inset-0 rounded-2xl overflow-hidden"
                        style={{ backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.85 }}
                    />
                    {/* Dark overlay to blend with site theme */}
                    <div
                        className="absolute inset-0 rounded-2xl"
                        style={{ background: 'linear-gradient(to bottom, rgba(8,12,20,0.1) 0%, rgba(8,12,20,0.55) 100%)' }}
                    />
                </motion.div>

                {/* Text content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h1
                        className="text-8xl font-black mb-2 leading-none"
                        style={{ background: 'linear-gradient(135deg, #6366F1, #A78BFA, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                    >
                        404
                    </h1>
                    <h2 className="text-2xl font-bold text-white mb-3">
                        Look like you&apos;re lost
                    </h2>
                    <p className="text-slate-400 text-base mb-8 leading-relaxed">
                        The page you are looking for is not available!<br />
                        It might have been moved, deleted, or never existed.
                    </p>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-3"
                >
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                            boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
                        }}
                    >
                        <Home className="w-4 h-4" />
                        Go to Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-slate-300 font-semibold transition-all duration-200 hover:bg-slate-800 hover:text-white"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </motion.div>

                {/* DocuMind branding */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-12 text-xs text-slate-600"
                >
                    © DocuMind — Intelligent Document AI
                </motion.p>
            </div>
        </section>
    );
}
