'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Zap, Menu, X, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';

const LINKS = [
    { label: 'Features', href: '#features' },
    { label: 'Tools', href: '#tools' },
    { label: 'AI Demo', href: '#demo' },
    { label: 'Pricing', href: '#pricing' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const { isAuth, user, logout, loading } = useAuth();
    const fullName = typeof user?.user_metadata?.full_name === 'string'
        ? user.user_metadata.full_name
        : null;
    const displayName = fullName ?? user?.email ?? 'Account';

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 24);
        fn();
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    // Close user menu when clicking outside
    useEffect(() => {
        if (!userMenuOpen) return;
        const handler = () => setUserMenuOpen(false);
        window.addEventListener('click', handler);
        return () => window.removeEventListener('click', handler);
    }, [userMenuOpen]);

    return (
        <>
            <motion.header
                initial={{ y: -72, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
                style={{
                    background: scrolled ? 'rgba(10,10,10,0.92)' : 'rgba(10,10,10,0.72)',
                    backdropFilter: 'blur(28px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(28px) saturate(200%)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.6)' : 'none',
                    paddingTop: scrolled ? '0.625rem' : '1.125rem',
                    paddingBottom: scrolled ? '0.625rem' : '1.125rem',
                }}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                    {/* Logo */}
                    <a href="#" className="flex items-center gap-2.5 group shrink-0" aria-label="DocuMind">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg,#6366F1,#A78BFA)', boxShadow: '0 0 14px rgba(99,102,241,0.35)' }}>
                            <FileText className="w-[18px] h-[18px] text-white" />
                        </div>
                        <span className="font-black text-[1.1rem] tracking-tight text-white">
                            Docu<span className="gradient-text">Mind</span>
                        </span>
                    </a>

                    {/* Nav links */}
                    <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
                        {LINKS.map(l => (
                            <a key={l.label} href={l.href}
                                className="relative px-4 py-2 text-sm font-medium rounded-lg group transition-all duration-200"
                                style={{ color: 'rgba(241,245,249,0.52)' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F1F5F9'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(241,245,249,0.52)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                                {l.label}
                                <span className="absolute bottom-1 left-4 right-4 h-px rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-250 origin-left"
                                    style={{ background: 'linear-gradient(90deg,#6366F1,#A78BFA)' }} />
                            </a>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {!loading && (
                            isAuth ? (
                                /* ── Logged-in state ── */
                                <div className="relative">
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={e => { e.stopPropagation(); setUserMenuOpen(v => !v); }}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                                        style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
                                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                                            style={{ background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}>
                                            {(user?.email?.[0] ?? 'U').toUpperCase()}
                                        </div>
                                        <span style={{ color: 'rgba(241,245,249,0.75)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {displayName}
                                        </span>
                                    </motion.button>

                                    {/* User dropdown */}
                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden"
                                                style={{
                                                    background: 'rgba(15,15,20,0.97)',
                                                    border: '1px solid rgba(255,255,255,0.10)',
                                                    backdropFilter: 'blur(24px)',
                                                    boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                                                }}
                                                onClick={e => e.stopPropagation()}>
                                                <div className="px-4 py-3 border-b border-white/8">
                                                    <p className="text-xs font-semibold text-white truncate">{fullName ?? 'User'}</p>
                                                    <p className="text-[10px] mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{user?.email}</p>
                                                </div>
                                                <button
                                                    onClick={() => { logout(); setUserMenuOpen(false); }}
                                                    className="w-full flex items-center gap-2 px-4 py-3 text-xs font-medium transition-colors hover:bg-white/5"
                                                    style={{ color: 'rgba(239,68,68,0.80)' }}>
                                                    <LogOut className="w-3.5 h-3.5" />
                                                    Sign out
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                /* ── Logged-out state ── */
                                <>
                                    <button
                                        onClick={() => setAuthOpen(true)}
                                        className="text-sm font-semibold transition-colors duration-200"
                                        style={{ color: 'rgba(241,245,249,0.48)' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(241,245,249,0.82)')}
                                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(241,245,249,0.48)')}>
                                        Sign in
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.04, y: -1 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setAuthOpen(true)}
                                        className="inline-flex items-center gap-1.5 rounded-xl text-sm font-bold text-white"
                                        style={{
                                            padding: '0.625rem 1.25rem',
                                            background: 'linear-gradient(135deg,#6366F1,#A78BFA)',
                                            boxShadow: '0 0 18px rgba(99,102,241,0.40), 0 4px 14px rgba(99,102,241,0.22)',
                                        }}>
                                        <Zap className="w-3.5 h-3.5" />
                                        Try Free
                                    </motion.button>
                                </>
                            )
                        )}
                    </div>

                    {/* Hamburger */}
                    <button
                        className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-colors glass"
                        style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(241,245,249,0.7)' }}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
                        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="md:hidden overflow-hidden"
                            style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(10,10,10,0.97)' }}>
                            <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-1">
                                {LINKS.map(l => (
                                    <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium"
                                        style={{ color: 'rgba(241,245,249,0.52)' }}>
                                        {l.label}<ChevronRight className="w-4 h-4 opacity-40" />
                                    </a>
                                ))}
                                {isAuth ? (
                                    <button onClick={() => { logout(); setMobileOpen(false); }}
                                        className="mt-3 flex items-center justify-center gap-2 rounded-xl text-sm font-bold"
                                        style={{ padding: '0.75rem 1.25rem', background: 'rgba(239,68,68,0.12)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.22)' }}>
                                        <LogOut className="w-4 h-4" /> Sign out
                                    </button>
                                ) : (
                                    <button onClick={() => { setAuthOpen(true); setMobileOpen(false); }}
                                        className="mt-3 flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-white"
                                        style={{ padding: '0.75rem 1.25rem', background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}>
                                        <Zap className="w-4 h-4" /> Try Free
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Auth modal – mounted at Navbar level so it's above everything */}
            <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        </>
    );
}
