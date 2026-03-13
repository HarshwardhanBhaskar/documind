/**
 * context/AuthContext.tsx
 * ──────────────────────────────────────────────────────────────────────────
 * Auth context using the Supabase JS SDK directly.
 * — Signup / login / logout work WITHOUT the FastAPI backend running.
 * — Once logged in, the Supabase session token is also forwarded to
 *   the FastAPI backend for document upload & processing.
 */
'use client';

import {
    createContext, useCallback, useContext, useEffect, useState,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────────

interface AuthContextValue {
    user: User | null;
    session: Session | null;
    token: string | null;       // access_token for FastAPI calls
    loading: boolean;
    isAuth: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    // Restore session on mount + listen for auth changes
    useEffect(() => {
        // Get current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Subscribe to auth state changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
    }, []);

    const signup = useCallback(async (email: string, password: string, name?: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } },
        });
        if (error) throw new Error(error.message);
    }, []);

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            session,
            token: session?.access_token ?? null,
            loading,
            isAuth: Boolean(session?.user),
            login,
            signup,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
    return ctx;
}
