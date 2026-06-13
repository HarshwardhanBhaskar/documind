'use client';

import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Capabilities', href: '/#features' },
      { label: 'Workflow', href: '/#demo' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Roadmap', href: '/roadmap' },
      { label: 'Security', href: '/security' },
    ],
  },
  {
    title: 'Docs',
    links: [
      { label: 'Getting started', href: '/docs/getting-started' },
      { label: 'API reference', href: '/docs/api-reference' },
      { label: 'Integrations', href: '/docs/integrations' },
    ],
  },
];

const socials = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/harshwardhan-bhaskar-991949294/', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-3" aria-label="NeuroDocs">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-950 text-sm font-semibold text-white">ND</span>
              <span className="text-base font-semibold text-[var(--text-primary)]">NeuroDocs</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
              A practical document intelligence workspace for teams that need extraction, review, and export controls.
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a key={social.label} href={social.href} target={social.href === '#' ? undefined : '_blank'} rel={social.href === '#' ? undefined : 'noopener noreferrer'} aria-label={social.label} className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-secondary)] transition hover:border-slate-400 hover:text-[var(--text-primary)]">
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold uppercase text-[var(--text-muted)]">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--border)] pt-6 text-xs text-[var(--text-muted)] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} NeuroDocs. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
