/**
 * components/AuthModal.tsx
 * ──────────────────────────────────────────────────────────────────────────
 * Login / Sign-up modal with Framer Motion animation.
 * Calls the FastAPI /auth endpoints via the AuthContext.
 */
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Lock, Mail, User, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
    open: boolean;
    onClose: () => void;
    /** If provided, called after successful auth */
    onSuccess?: () => void;
}

type Mode = 'login' | 'signup';

export default function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
    const { login, signup } = useAuth();

    const [mode, setMode] = useState<Mode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reset = () => {
        setEmail(''); setPassword(''); setName(''); setError(null); setLoading(false);
    };

    const close = () => { reset(); onClose(); };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(email, password);
            } else {
                await signup(email, password, name || undefined);
            }
            reset();
            onSuccess?.();
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
                        onClick={close}
                        aria-hidden="true"
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.94, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 24 }}
                        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className="w-full max-w-md rounded-2xl pointer-events-auto"
                            style={{
                                background: 'rgba(15,15,20,0.95)',
                                border: '1px solid rgba(255,255,255,0.10)',
                                backdropFilter: 'blur(32px)',
                                boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.15)',
                            }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
                                <div>
                                    <h2 className="text-white font-bold text-lg leading-tight">
                                        {mode === 'login' ? 'Welcome back' : 'Create account'}
                                    </h2>
                                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                        {mode === 'login' ? 'Sign in to DocuMind' : 'Start for free – no card required'}
                                    </p>
                                </div>
                                <button
                                    onClick={close}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}
                                    aria-label="Close">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={submit} className="px-6 py-6 flex flex-col gap-4">
                                {/* Name (signup only) */}
                                <AnimatePresence>
                                    {mode === 'signup' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                                            <Field
                                                icon={<User className="w-4 h-4" />}
                                                type="text" placeholder="Full name (optional)"
                                                value={name} onChange={setName} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Field
                                    icon={<Mail className="w-4 h-4" />}
                                    type="email" placeholder="Email address"
                                    value={email} onChange={setEmail} required />

                                <div className="relative">
                                    <Field
                                        icon={<Lock className="w-4 h-4" />}
                                        type={showPwd ? 'text' : 'password'}
                                        placeholder="Password (min 8 chars)"
                                        value={password} onChange={setPassword} required />
                                    <button
                                        type="button"
                                        onClick={() => setShowPwd(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 transition-opacity"
                                        style={{ color: 'white' }}
                                        aria-label={showPwd ? 'Hide password' : 'Show password'}>
                                        {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>

                                {/* Error */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="text-xs px-3 py-2 rounded-lg"
                                            style={{ background: 'rgba(239,68,68,0.10)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.22)' }}>
                                            {error}
                                        </motion.p>
                                    )}
                                </AnimatePresence>

                                {/* Submit */}
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
                                    whileTap={!loading ? { scale: 0.98 } : {}}
                                    className="flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-white h-11 disabled:opacity-60"
                                    style={{
                                        background: 'linear-gradient(135deg,#6366F1,#A78BFA)',
                                        boxShadow: '0 0 24px rgba(99,102,241,0.40)',
                                    }}>
                                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {mode === 'login' ? 'Sign in' : 'Create account'}
                                </motion.button>

                                {/* Mode toggle */}
                                <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                    {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                                    <button
                                        type="button"
                                        onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(null); }}
                                        className="font-semibold hover:opacity-80 transition-opacity"
                                        style={{ color: '#818CF8' }}>
                                        {mode === 'login' ? 'Sign up' : 'Sign in'}
                                    </button>
                                </p>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ── Shared field component ─────────────────────────────────────────────────────
function Field({
    icon, value, onChange, ...props
}: {
    icon: React.ReactNode;
    value: string;
    onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
    return (
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-35" style={{ color: 'white' }}>
                {icon}
            </div>
            <input
                {...props}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full h-11 pl-9 pr-4 rounded-xl text-sm text-white outline-none transition-all"
                style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    caretColor: '#818CF8',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.55)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
            />
        </div>
    );
}
