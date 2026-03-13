import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

type Section = {
  heading: string;
  body: string[];
};

type PageContent = {
  category: 'Company' | 'Legal' | 'Product';
  title: string;
  strapline: string;
  description: string;
  updated: string;
  highlights: string[];
  sections: Section[];
  related: string[];
};

const pages: Record<string, PageContent> = {
  about: {
    category: 'Company',
    title: 'About',
    strapline: 'A Product Team Built Around Reliability',
    description: 'Learn what DocuMind is building and why it exists.',
    updated: 'March 12, 2026',
    highlights: ['Mission first', 'Enterprise ready', 'API driven'],
    sections: [
      {
        heading: 'What We Build',
        body: [
          'DocuMind is a document intelligence platform for teams that need OCR, classification, and structured extraction with production-grade reliability.',
          'The goal is to reduce manual document handling and help operations teams process files faster with clear auditability.',
        ],
      },
      {
        heading: 'Who It Is For',
        body: [
          'Operations, finance, compliance, and back-office teams that process high volumes of PDFs, images, and forms.',
          'It is designed for both startup teams and enterprise deployments with secure, API-first workflows.',
        ],
      },
    ],
    related: ['careers', 'blog', 'roadmap'],
  },
  privacy: {
    category: 'Legal',
    title: 'Privacy Policy',
    strapline: 'Your Data Remains Your Data',
    description: 'How DocuMind handles, stores, and protects personal data.',
    updated: 'March 12, 2026',
    highlights: ['Data minimization', 'Encrypted transport', 'Retention controls'],
    sections: [
      {
        heading: 'Data We Process',
        body: [
          'DocuMind processes document files and metadata needed to deliver OCR, classification, and extraction features.',
          'Only data required for service operation, support, billing, and security monitoring is retained.',
        ],
      },
      {
        heading: 'Security and Retention',
        body: [
          'Documents are stored in secured infrastructure with access controls and encrypted transport.',
          'Retention periods can be configured based on account plan and compliance requirements.',
        ],
      },
    ],
    related: ['security', 'terms', 'cookies'],
  },
  terms: {
    category: 'Legal',
    title: 'Terms of Service',
    strapline: 'Clear Usage Terms For Every Workspace',
    description: 'The agreement governing use of DocuMind services.',
    updated: 'March 12, 2026',
    highlights: ['Usage rules', 'Plan limits', 'Liability framework'],
    sections: [
      {
        heading: 'Service Access',
        body: [
          'By using DocuMind, you agree to use the platform in compliance with all applicable laws and internal policies.',
          'Account owners are responsible for activity under their workspace, including team member access management.',
        ],
      },
      {
        heading: 'Limits and Liability',
        body: [
          'Service availability and processing accuracy are provided on a best-effort basis subject to plan-level guarantees.',
          'Liability limits, disclaimers, and governing law terms apply as outlined in your signed or accepted agreement.',
        ],
      },
    ],
    related: ['privacy', 'cookies', 'security'],
  },
  cookies: {
    category: 'Legal',
    title: 'Cookie Policy',
    strapline: 'Transparent Preferences And Tracking Controls',
    description: 'How cookies and similar technologies are used by DocuMind.',
    updated: 'March 12, 2026',
    highlights: ['Session security', 'Analytics clarity', 'Browser controls'],
    sections: [
      {
        heading: 'Why We Use Cookies',
        body: [
          'Cookies help keep sessions secure, remember user preferences, and improve performance.',
          'Analytics cookies help us understand feature usage and improve product quality.',
        ],
      },
      {
        heading: 'Managing Preferences',
        body: [
          'You can control cookies through browser settings and, where available, in-app preference controls.',
          'Disabling some cookies may affect authentication and product functionality.',
        ],
      },
    ],
    related: ['privacy', 'terms', 'security'],
  },
  changelog: {
    category: 'Product',
    title: 'Changelog',
    strapline: 'Every Meaningful Product Update In One Place',
    description: 'Track product improvements and release milestones.',
    updated: 'March 12, 2026',
    highlights: ['Release notes', 'Feature delivery', 'Fix visibility'],
    sections: [
      {
        heading: 'Latest Updates',
        body: [
          'Added asynchronous processing pipeline support with stage-wise status tracking hooks.',
          'Improved upload handling, Supabase storage integration, and frontend processing indicators.',
        ],
      },
      {
        heading: 'What Is Next',
        body: [
          'Upcoming improvements include richer domain templates, extraction confidence reporting, and better retry diagnostics.',
        ],
      },
    ],
    related: ['roadmap', 'docs/getting-started', 'docs/api-reference'],
  },
  roadmap: {
    category: 'Product',
    title: 'Roadmap',
    strapline: 'What The Team Is Shipping Next',
    description: 'Planned product direction for upcoming releases.',
    updated: 'March 12, 2026',
    highlights: ['Domain focus', 'Platform maturity', 'Reliability roadmap'],
    sections: [
      {
        heading: 'Current Priorities',
        body: [
          'Domain-specific extraction packs for invoices, legal documents, and educational administration workflows.',
          'SaaS billing controls with quotas, credits, and feature gating by plan.',
        ],
      },
      {
        heading: 'Platform Direction',
        body: [
          'Queue-backed reliability, richer observability, and customer-facing job logs remain core roadmap themes.',
        ],
      },
    ],
    related: ['changelog', 'docs/guides', 'docs/integrations'],
  },
  blog: {
    category: 'Company',
    title: 'Blog',
    strapline: 'Technical Learnings From Real Document Workflows',
    description: 'Insights, product notes, and technical deep dives from DocuMind.',
    updated: 'March 12, 2026',
    highlights: ['Engineering stories', 'Use cases', 'Architecture notes'],
    sections: [
      {
        heading: 'Editorial Focus',
        body: [
          'We publish updates on OCR quality improvements, extraction architecture, and deployment lessons.',
          'Customer use-cases and implementation guides are prioritized for practical relevance.',
        ],
      },
      {
        heading: 'Upcoming Content',
        body: [
          'Expect posts on invoice automation benchmarks, resilient job orchestration, and schema design for extracted data.',
        ],
      },
    ],
    related: ['about', 'changelog', 'docs/guides'],
  },
  careers: {
    category: 'Company',
    title: 'Careers',
    strapline: 'Build With A Team That Cares About Quality',
    description: 'Join the team building reliable document intelligence.',
    updated: 'March 12, 2026',
    highlights: ['Ownership culture', 'Fast iteration', 'Customer impact'],
    sections: [
      {
        heading: 'What We Value',
        body: [
          'We value engineering rigor, clear communication, and customer-first product decisions.',
          'Team members are expected to own outcomes across product, code, and reliability.',
        ],
      },
      {
        heading: 'How To Apply',
        body: [
          'Share your portfolio, practical project work, and impact-focused resume.',
          'Roles are posted with clear expectations, scope, and growth paths.',
        ],
      },
    ],
    related: ['about', 'roadmap', 'security'],
  },
  security: {
    category: 'Company',
    title: 'Security',
    strapline: 'Defense In Depth For Documents And Workspaces',
    description: 'How DocuMind approaches application and data security.',
    updated: 'March 12, 2026',
    highlights: ['Least privilege', 'Incident response', 'Continuous hardening'],
    sections: [
      {
        heading: 'Security Practices',
        body: [
          'The platform uses least-privilege access, transport encryption, and audited data access patterns.',
          'Critical dependencies are monitored and updated regularly with security reviews.',
        ],
      },
      {
        heading: 'Incident Response',
        body: [
          'Security events are triaged using documented incident procedures with severity-based escalation.',
          'Customers are informed of material incidents according to contractual and legal requirements.',
        ],
      },
    ],
    related: ['privacy', 'terms', 'docs/api-reference'],
  },
};

const themes: Record<string, { from: string; to: string; ring: string }> = {
  about: { from: 'rgba(34,211,238,0.24)', to: 'rgba(99,102,241,0.2)', ring: 'rgba(34,211,238,0.45)' },
  privacy: { from: 'rgba(99,102,241,0.24)', to: 'rgba(167,139,250,0.2)', ring: 'rgba(99,102,241,0.45)' },
  terms: { from: 'rgba(99,102,241,0.24)', to: 'rgba(167,139,250,0.2)', ring: 'rgba(167,139,250,0.45)' },
  cookies: { from: 'rgba(99,102,241,0.24)', to: 'rgba(34,211,238,0.2)', ring: 'rgba(34,211,238,0.45)' },
  changelog: { from: 'rgba(16,185,129,0.24)', to: 'rgba(34,211,238,0.2)', ring: 'rgba(16,185,129,0.45)' },
  roadmap: { from: 'rgba(16,185,129,0.24)', to: 'rgba(99,102,241,0.2)', ring: 'rgba(99,102,241,0.45)' },
  blog: { from: 'rgba(34,211,238,0.24)', to: 'rgba(167,139,250,0.2)', ring: 'rgba(167,139,250,0.45)' },
  careers: { from: 'rgba(16,185,129,0.24)', to: 'rgba(99,102,241,0.2)', ring: 'rgba(16,185,129,0.45)' },
  security: { from: 'rgba(99,102,241,0.24)', to: 'rgba(34,211,238,0.2)', ring: 'rgba(99,102,241,0.45)' },
};

export function generateStaticParams() {
  return Object.keys(pages)
    .filter((slug) => slug !== 'about')
    .map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const data = pages[params.slug];
  if (!data) {
    return {
      title: 'Page Not Found | DocuMind',
      description: 'The page you requested does not exist.',
    };
  }

  return {
    title: `${data.title} | DocuMind`,
    description: data.description,
  };
}

function labelForPath(path: string) {
  if (path.startsWith('docs/')) {
    const slug = path.replace('docs/', '');
    return slug
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  return pages[path]?.title ?? path;
}

export default function CompanyPage({ params }: { params: { slug: string } }) {
  const data = pages[params.slug];
  if (!data) {
    notFound();
  }
  const theme = themes[params.slug];

  return (
    <main
      className="relative overflow-hidden"
      style={{ minHeight: '100vh', background: '#0A0A0A', color: '#F1F5F9' }}
    >
      <div
        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-80 w-[40rem] blur-3xl"
        style={{ background: `linear-gradient(120deg, ${theme.from}, ${theme.to})` }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full blur-3xl"
        style={{ background: theme.to }}
        aria-hidden="true"
      />

      <div className="cx py-12 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: 'rgba(241,245,249,0.7)' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <section
          className="mt-6 rounded-3xl p-7 md:p-10"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${theme.ring}`,
            boxShadow: `0 30px 70px rgba(0,0,0,0.45), 0 0 0 1px ${theme.from}`,
          }}
        >
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'rgba(241,245,249,0.52)' }}>
            {data.category}
          </p>
          <h1 className="mt-3 text-3xl md:text-5xl font-black tracking-tight">{data.title}</h1>
          <p className="mt-3 text-sm md:text-base leading-7" style={{ color: 'rgba(241,245,249,0.75)' }}>
            {data.strapline}
          </p>
          <p className="mt-4 max-w-2xl text-sm md:text-base leading-7" style={{ color: 'rgba(241,245,249,0.62)' }}>
            {data.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {data.highlights.map((pill) => (
              <span
                key={pill}
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)' }}
              >
                {pill}
              </span>
            ))}
          </div>

          <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs uppercase tracking-[0.15em]" style={{ color: 'rgba(241,245,249,0.5)' }}>Last Updated</p>
              <p className="mt-2 text-sm font-semibold">{data.updated}</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs uppercase tracking-[0.15em]" style={{ color: 'rgba(241,245,249,0.5)' }}>Sections</p>
              <p className="mt-2 text-sm font-semibold">{data.sections.length} Topics</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs uppercase tracking-[0.15em]" style={{ color: 'rgba(241,245,249,0.5)' }}>Reference Docs</p>
              <p className="mt-2 text-sm font-semibold">Available in Footer</p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {data.sections.map((section, index) => (
              <article
                id={`section-${index + 1}`}
                key={section.heading}
                className="rounded-2xl p-6 md:p-7"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <h2 className="text-xl font-bold">{section.heading}</h2>
                <div className="mt-3 space-y-3 text-sm md:text-base leading-7" style={{ color: 'rgba(241,245,249,0.72)' }}>
                  {section.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <aside className="lg:sticky lg:top-8 h-fit space-y-4">
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'rgba(241,245,249,0.45)' }}>
                On This Page
              </p>
              <div className="mt-4 space-y-2">
                {data.sections.map((section, index) => (
                  <a
                    key={section.heading}
                    href={`#section-${index + 1}`}
                    className="block rounded-lg px-3 py-2 text-sm transition-colors"
                    style={{ color: 'rgba(241,245,249,0.8)', background: 'rgba(255,255,255,0.02)' }}
                  >
                    {section.heading}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'rgba(241,245,249,0.45)' }}>
                Explore More
              </p>
              <div className="mt-4 space-y-2">
                {data.related.map((path) => (
                  <Link
                    key={path}
                    href={path.startsWith('docs/') ? `/${path}` : `/${path}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm"
                    style={{ color: 'rgba(241,245,249,0.85)', background: 'rgba(255,255,255,0.02)' }}
                  >
                    {labelForPath(path)}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section
          className="mt-8 rounded-3xl p-6 md:p-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          style={{ background: 'linear-gradient(120deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div>
            <h3 className="text-xl font-bold">Need implementation details?</h3>
            <p className="mt-2 text-sm" style={{ color: 'rgba(241,245,249,0.68)' }}>
              Jump into technical docs and API references for practical integration steps.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/docs/getting-started"
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(129,140,248,0.45)', color: '#C7D2FE' }}
            >
              Open Docs
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.13)', color: '#E2E8F0' }}
            >
              View Pricing
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
