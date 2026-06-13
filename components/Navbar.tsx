'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/context/AuthContext';

type Theme = 'light' | 'dark';

const links = [
  { label: 'Capabilities', href: '/#features' },
  { label: 'Workflow', href: '/#demo' },
  { label: 'Docs', href: '/docs/getting-started' },
  { label: 'Pricing', href: '/pricing' },
];

const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
};

const applyTheme = (nextTheme: Theme) => {
  document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  document.documentElement.classList.toggle('light', nextTheme === 'light');
  localStorage.setItem('theme', nextTheme);
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  const { isAuth, user, logout, loading } = useAuth();
  const fullName = typeof user?.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : null;
  const displayName = fullName ?? user?.email ?? 'Account';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = () => setUserMenuOpen(false);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [userMenuOpen]);

  const toggleTheme = () => setTheme((current) => current === 'light' ? 'dark' : 'light');

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 border-b transition ${scrolled ? 'border-[var(--border)] bg-[var(--nav-bg-scrolled)] shadow-sm' : 'border-transparent bg-[var(--nav-bg)]'}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3" aria-label="NeuroDocs">
            <img src="/logo.png" alt="NeuroDocs Logo" className="h-9 w-9 rounded-md object-cover" />
            <span className="text-base font-semibold text-[var(--text-primary)]">NeuroDocs</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link key={link.label} href={link.href} className="rounded-md px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <button onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]" aria-label="Toggle theme">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {!loading && (
              isAuth ? (
                <div className="relative">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setUserMenuOpen((open) => !open);
                    }}
                    className="flex h-9 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 text-sm font-medium text-[var(--text-primary)]"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-xs font-semibold text-white">
                      {(user?.email?.[0] ?? 'U').toUpperCase()}
                    </span>
                    <span className="max-w-32 truncate">{displayName}</span>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        onClick={(event) => event.stopPropagation()}
                        className="absolute right-0 mt-2 w-52 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-lg"
                      >
                        <div className="border-b border-[var(--border)] px-4 py-3">
                          <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{fullName ?? 'User'}</p>
                          <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">{user?.email}</p>
                        </div>
                        <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]">
                          <FileText className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <button onClick={() => setAuthOpen(true)} className="h-9 rounded-md px-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]">
                    Log in
                  </button>
                  <button onClick={() => setAuthOpen(true)} className="h-9 rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]">
                    Start trial
                  </button>
                </>
              )
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]" aria-label="Toggle theme">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <button onClick={() => setMobileOpen((open) => !open)} className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-[var(--border)] bg-[var(--surface)] md:hidden">
              <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
                {links.map((link) => (
                  <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]">
                    {link.label}
                  </Link>
                ))}
                {!loading && !isAuth && (
                  <button onClick={() => setAuthOpen(true)} className="mt-2 h-10 rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-white">
                    Start trial
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
