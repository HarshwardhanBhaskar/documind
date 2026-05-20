/**
 * context/AuthContext.tsx
 * Frontend auth state backed by the FastAPI auth endpoints.
 *
 * Keeping browser auth behind our API avoids direct client-side dependency on
 * Supabase DNS/CORS and makes the rest of the app use one backend origin.
 */
'use client';

import {
    createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { authApi } from '@/lib/api';
import type { TokenResponse, UserResponse } from '@/lib/api';

type AuthUser = {
    id: string;
    email: string;
    user_metadata: {
        full_name?: string | null;
    };
};

type AuthSession = {
    access_token: string;
    refresh_token: string | null;
    expires_in: number;
};

interface StoredAuth {
    access_token: string;
    refresh_token: string | null;
    expires_in: number;
    user_id: string;
    email?: string;
    full_name?: string | null;
}

interface AuthContextValue {
    user: AuthUser | null;
    session: AuthSession | null;
    token: string | null;
    loading: boolean;
    isAuth: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => Promise<void>;
}

const STORAGE_KEY = 'neurodocs-auth';
const AuthContext = createContext<AuthContextValue | null>(null);

function toUser(data: UserResponse | StoredAuth): AuthUser {
    const id = 'id' in data ? data.id : data.user_id;

    return {
        id,
        email: data.email ?? '',
        user_metadata: {
            full_name: data.full_name ?? null,
        },
    };
}

function toStoredAuth(token: TokenResponse, email?: string, fullName?: string | null): StoredAuth {
    return {
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        expires_in: token.expires_in,
        user_id: token.user_id,
        email,
        full_name: fullName ?? null,
    };
}

function toSession(data: StoredAuth): AuthSession {
    return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
    };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [session, setSession] = useState<AuthSession | null>(null);
    const [loading, setLoading] = useState(true);

    const applyAuth = useCallback((stored: StoredAuth) => {
        setSession(toSession(stored));
        setUser(toUser(stored));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    }, []);

    const clearAuth = useCallback(() => {
        setUser(null);
        setSession(null);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function restoreSession() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) return;

                const stored = JSON.parse(raw) as StoredAuth;
                if (!stored.access_token) return;

                setSession(toSession(stored));
                setUser(toUser(stored));

                const remoteUser = await authApi.getUser(stored.access_token);
                if (cancelled) return;

                const refreshed: StoredAuth = {
                    ...stored,
                    user_id: remoteUser.id,
                    email: remoteUser.email,
                    full_name: remoteUser.full_name,
                };
                applyAuth(refreshed);
            } catch {
                if (!cancelled) clearAuth();
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        restoreSession();

        return () => {
            cancelled = true;
        };
    }, [applyAuth, clearAuth]);

    const login = useCallback(async (email: string, password: string) => {
        const token = await authApi.login(email, password);
        if (!token.access_token) {
            throw new Error('Login failed. Please try again.');
        }

        const userProfile = await authApi.getUser(token.access_token);
        applyAuth(toStoredAuth(token, userProfile.email, userProfile.full_name));
    }, [applyAuth]);

    const signup = useCallback(async (email: string, password: string, name?: string) => {
        const token = await authApi.signup(email, password, name);
        if (!token.access_token) {
            throw new Error('Account created. Please confirm your email before logging in.');
        }

        const userProfile = await authApi.getUser(token.access_token);
        applyAuth(toStoredAuth(token, userProfile.email, userProfile.full_name));
    }, [applyAuth]);

    const logout = useCallback(async () => {
        const accessToken = session?.access_token;
        clearAuth();

        if (accessToken) {
            try {
                await authApi.logout(accessToken);
            } catch {
                // Local logout should still succeed even if the remote session is already invalid.
            }
        }
    }, [clearAuth, session?.access_token]);

    const value = useMemo<AuthContextValue>(() => ({
        user,
        session,
        token: session?.access_token ?? null,
        loading,
        isAuth: Boolean(session?.access_token && user),
        login,
        signup,
        logout,
    }), [loading, login, logout, session, signup, user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
    return ctx;
}
