'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Zap, Menu, X, ChevronRight, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';

const LINKS = [
    { label: 'Features', href: '/#features' },
    { label: 'Tools', href: '/#tools' },
    { label: 'AI Demo', href: '/#demo' },
    { label: 'Pricing', href: '/pricing' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

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

    // Load initial theme
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setTheme('light');
            document.documentElement.classList.add('light');
        } else {
            setTheme('dark');
            document.documentElement.classList.remove('light');
        }
    }, []);

    // Close user menu when clicking outside
    useEffect(() => {
        if (!userMenuOpen) return;
        const handler = () => setUserMenuOpen(false);
        window.addEventListener('click', handler);
        return () => window.removeEventListener('click', handler);
    }, [userMenuOpen]);

    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
            document.documentElement.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        } else {
            setTheme('light');
            document.documentElement.classList.add('light');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <>
            <motion.header
                initial={{ y: -72, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
                style={{
                    background: scrolled ? 'var(--nav-bg-scrolled)' : 'var(--nav-bg)',
                    backdropFilter: 'blur(28px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(28px) saturate(200%)',
                    borderBottom: '1px solid var(--nav-border)',
                    boxShadow: scrolled ? '0 4px 30px var(--dashboard-shadow)' : 'none',
                    paddingTop: scrolled ? '0.625rem' : '1.125rem',
                    paddingBottom: scrolled ? '0.625rem' : '1.125rem',
                }}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                    {/* Logo */}
                    <a href="#" className="flex items-center gap-2.5 group shrink-0" aria-label="NeuroDocs">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg,#6366F1,#A78BFA)', boxShadow: '0 0 14px rgba(99,102,241,0.35)' }}>
                            <FileText className="w-[18px] h-[18px] text-white" />
                        </div>
                        <span className="font-black text-[1.1rem] tracking-tight" style={{ color: 'var(--text-primary)' }}>
                            Neuro<span className="gradient-text">Docs</span>
                        </span>
                    </a>

                    {/* Nav links */}
                    <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
                        {LINKS.map(l => (
                            <a key={l.label} href={l.href}
                                className="relative px-4 py-2 text-sm font-medium rounded-lg group transition-all duration-200"
                                style={{ color: 'var(--text-secondary)' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; (e.currentTarget as HTMLElement).style.background = 'var(--nav-dropdown-hover)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                                {l.label}
                                <span className="absolute bottom-1 left-4 right-4 h-px rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-250 origin-left"
                                    style={{ background: 'linear-gradient(90deg,#6366F1,#A78BFA)' }} />
                            </a>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Theme Toggle Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleTheme}
                            className="p-2 rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-indigo-500/30"
                            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
                            {theme === 'light' ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4 text-amber-400" />}
                        </motion.button>

                        {!loading && (
                            isAuth ? (
                                /* ── Logged-in state ── */
                                <div className="relative">
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={e => { e.stopPropagation(); setUserMenuOpen(v => !v); }}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all border border-[var(--border)] bg-[var(--bg-card)]"
                                        style={{ color: 'var(--text-primary)' }}>
                                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                                            style={{ background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}>
                                            {(user?.email?.[0] ?? 'U').toUpperCase()}
                                        </div>
                                        <span style={{ color: 'var(--text-secondary)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                                                    background: 'var(--nav-dropdown-bg)',
                                                    border: '1px solid var(--nav-dropdown-border)',
                                                    backdropFilter: 'blur(24px)',
                                                    boxShadow: '0 20px 60px var(--dashboard-shadow)',
                                                }}
                                                onClick={e => e.stopPropagation()}>
                                                <div className="px-4 py-3 border-b border-[var(--border)]">
                                                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{fullName ?? 'User'}</p>
                                                    <p className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                                                </div>
                                                <Link href="/dashboard" className="w-full flex items-center gap-2 px-4 py-3 text-xs font-medium transition-colors hover:bg-[var(--nav-dropdown-hover)]" style={{ color: 'var(--text-secondary)' }}>
                                                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                                                    Dashboard
                                                </Link>
                                                <button
                                                    onClick={() => { logout(); setUserMenuOpen(false); }}
                                                    className="w-full flex items-center gap-2 px-4 py-3 text-xs font-medium transition-colors hover:bg-[var(--nav-dropdown-hover)]"
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
                                        style={{ color: 'var(--text-muted)' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
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

                    {/* Hamburger and Mobile Actions */}
                    <div className="flex md:hidden items-center gap-2">
                        {/* Mobile Theme Toggle Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleTheme}
                            className="p-2 rounded-xl transition-all duration-300 flex items-center justify-center border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)]"
                            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
                            {theme === 'light' ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4 text-amber-400" />}
                        </motion.button>

                        <button
                            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors glass border border-[var(--border)]"
                            style={{ color: 'var(--text-secondary)' }}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
                            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="md:hidden overflow-hidden"
                            style={{ borderTop: '1px solid var(--nav-border)', background: 'var(--nav-dropdown-bg)' }}>
                            <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-1">
                                {LINKS.map(l => (
                                    <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium"
                                        style={{ color: 'var(--text-secondary)' }}>
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
