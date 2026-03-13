'use client';

import Link from 'next/link';
import { FileText, Github, Linkedin, Twitter } from 'lucide-react';

const nav = {
    Product: [
        { label: 'Features', href: '/#features' },
        { label: 'AI Tools', href: '/#tools' },
        { label: 'Pricing', href: '/#pricing' },
        { label: 'Changelog', href: '/changelog' },
        { label: 'Roadmap', href: '/roadmap' },
    ],
    Documentation: [
        { label: 'Getting Started', href: '/docs/getting-started' },
        { label: 'API Reference', href: '/docs/api-reference' },
        { label: 'Guides', href: '/docs/guides' },
        { label: 'Integrations', href: '/docs/integrations' },
        { label: 'SDKs', href: '/docs/sdks' },
    ],
    Company: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Careers', href: '/careers' },
        { label: 'Security', href: '/security' },
        { label: 'Privacy Policy', href: '/privacy' },
    ],
} as const;

const social = [
    { Icon: Github, label: 'GitHub', href: 'https://github.com/' },
    { Icon: Twitter, label: 'Twitter', href: 'https://x.com/' },
    { Icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/' },
] as const;

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative pt-20 pb-10" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.5),rgba(167,139,250,0.4),transparent)' }}
                aria-hidden="true"
            />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">
                    <div className="col-span-2 flex flex-col gap-5">
                        <Link href="/" className="flex items-center gap-2.5 w-fit" aria-label="DocuMind">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}>
                                <FileText className="w-[18px] h-[18px] text-white" />
                            </div>
                            <span className="font-black text-[1.1rem] text-white tracking-tight">
                                Docu<span className="gradient-text">Mind</span>
                            </span>
                        </Link>

                        <p className="text-sm leading-[1.85] max-w-[260px]" style={{ color: 'rgba(241,245,249,0.32)' }}>
                            AI-powered document processing for fast-moving teams and enterprises worldwide.
                        </p>

                        <div className="flex gap-2.5">
                            {social.map(({ Icon, label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                                    style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        color: 'rgba(241,245,249,0.35)',
                                    }}>
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>

                        <a
                            href="https://github.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-fit flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(241,245,249,0.45)' }}>
                            <Github className="w-3.5 h-3.5" />
                            View on GitHub
                            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: 'rgba(99,102,241,0.18)', color: '#818CF8' }}>
                                OSS
                            </span>
                        </a>
                    </div>

                    {Object.entries(nav).map(([section, items]) => (
                        <div key={section} className="flex flex-col gap-4">
                            <h3 className="text-white text-xs font-bold uppercase tracking-widest">{section}</h3>
                            {items.map(item => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="text-sm transition-colors duration-200"
                                    style={{ color: 'rgba(241,245,249,0.32)' }}>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-xs" style={{ color: 'rgba(241,245,249,0.18)' }}>
                        © {year} DocuMind, Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/terms" className="text-xs transition-colors duration-200" style={{ color: 'rgba(241,245,249,0.18)' }}>
                            Terms
                        </Link>
                        <Link href="/privacy" className="text-xs transition-colors duration-200" style={{ color: 'rgba(241,245,249,0.18)' }}>
                            Privacy
                        </Link>
                        <Link href="/cookies" className="text-xs transition-colors duration-200" style={{ color: 'rgba(241,245,249,0.18)' }}>
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

