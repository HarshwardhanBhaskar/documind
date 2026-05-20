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
    description: 'Learn what NeuroDocs is building and why it exists.',
    updated: 'March 12, 2026',
    highlights: ['Mission first', 'Enterprise ready', 'API driven'],
    sections: [
      {
        heading: 'What We Build',
        body: [
          'NeuroDocs is a document intelligence platform for teams that need OCR, classification, and structured extraction with production-grade reliability.',
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
    description: 'How NeuroDocs handles, stores, and protects personal data.',
    updated: 'March 12, 2026',
    highlights: ['Data minimization', 'Encrypted transport', 'Retention controls'],
    sections: [
      {
        heading: 'Data We Process',
        body: [
          'NeuroDocs processes document files and metadata needed to deliver OCR, classification, and extraction features.',
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
    description: 'The agreement governing use of NeuroDocs services.',
    updated: 'March 12, 2026',
    highlights: ['Usage rules', 'Plan limits', 'Liability framework'],
    sections: [
      {
        heading: 'Service Access',
        body: [
          'By using NeuroDocs, you agree to use the platform in compliance with all applicable laws and internal policies.',
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
    description: 'How cookies and similar technologies are used by NeuroDocs.',
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
    description: 'Insights, product notes, and technical deep dives from NeuroDocs.',
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
    description: 'How NeuroDocs approaches application and data security.',
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = pages[slug];
  if (!data) {
    return {
      title: 'Page Not Found | NeuroDocs',
      description: 'The page you requested does not exist.',
    };
  }

  return {
    title: `${data.title} | NeuroDocs`,
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

const illustrationMap: Record<string, string> = {
  about: '/about_illustration.png',
  careers: '/careers_illustration.png',
  roadmap: '/roadmap_illustration.png',
  security: '/security_illustration.png',
};

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = pages[slug];
  if (!data) {
    notFound();
  }
  const theme = themes[slug];
  const illustration = illustrationMap[slug];

  return (
    <main
      className="relative overflow-hidden bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300"
      style={{ minHeight: '100vh' }}
    >
      <div
        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-80 w-[40rem] blur-3xl opacity-60 dark:opacity-100"
        style={{ background: `linear-gradient(120deg, ${theme.from}, ${theme.to})` }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full blur-3xl opacity-30 dark:opacity-60"
        style={{ background: theme.to }}
        aria-hidden="true"
      />

      <div className="cx py-12 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold hover:text-[var(--text-primary)] transition-colors duration-200"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <section
          className="mt-6 rounded-3xl p-7 md:p-10 bg-[var(--bg-card)] border border-[var(--border)] transition-all duration-300"
          style={{
            boxShadow: '0 30px 70px var(--dashboard-shadow)',
          }}
        >
          <div className={illustration ? 'grid grid-cols-1 lg:grid-cols-12 gap-8 items-center' : 'flex flex-col'}>
            <div className={illustration ? 'lg:col-span-7 flex flex-col justify-center' : 'flex flex-col'}>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {data.category}
              </p>
              <h1 className="mt-3 text-3xl md:text-5xl font-black tracking-tight text-[var(--text-primary)]">{data.title}</h1>
              <p className="mt-3 text-sm md:text-base leading-7 font-medium" style={{ color: 'var(--text-secondary)' }}>
                {data.strapline}
              </p>
              <p className="mt-4 max-w-2xl text-sm md:text-base leading-7" style={{ color: 'var(--text-muted)' }}>
                {data.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {data.highlights.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full px-3 py-1 text-xs font-semibold bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] hover:border-indigo-500/30 transition-colors"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl p-4 bg-[var(--bg-card)] border border-[var(--border)]">
                  <p className="text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Last Updated</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{data.updated}</p>
                </div>
                <div className="rounded-xl p-4 bg-[var(--bg-card)] border border-[var(--border)]">
                  <p className="text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Sections</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{data.sections.length} Topics</p>
                </div>
                <div className="rounded-xl p-4 bg-[var(--bg-card)] border border-[var(--border)]">
                  <p className="text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Reference Docs</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">Available in Footer</p>
                </div>
              </div>
            </div>

            {illustration && (
              <div className="lg:col-span-5 flex justify-center items-center">
                <div className="relative group w-full max-w-xs sm:max-w-sm aspect-square flex items-center justify-center rounded-2xl glass p-4 float-anim transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(99,102,241,0.12)]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[var(--indigo)] to-[var(--violet)] opacity-10 blur-xl rounded-2xl group-hover:opacity-20 transition-opacity duration-500" />
                  <img
                    src={illustration}
                    alt={`${data.title} Illustration`}
                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] group-hover:rotate-2 transition-transform duration-500"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {data.sections.map((section, index) => (
              <article
                id={`section-${index + 1}`}
                key={section.heading}
                className="rounded-2xl p-6 md:p-7 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] transition-all duration-300 hover:border-indigo-500/20"
              >
                <h2 className="text-xl font-bold">{section.heading}</h2>
                <div className="mt-3 space-y-3 text-sm md:text-base leading-7" style={{ color: 'var(--text-secondary)' }}>
                  {section.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <aside className="lg:sticky lg:top-8 h-fit space-y-4">
            <div className="rounded-2xl p-5 bg-[var(--bg-card)] border border-[var(--border)]">
              <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>
                On This Page
              </p>
              <div className="mt-4 space-y-2">
                {data.sections.map((section, index) => (
                  <a
                    key={section.heading}
                    href={`#section-${index + 1}`}
                    className="block rounded-lg px-3 py-2 text-sm transition-colors hover:text-[var(--text-primary)] hover:bg-[var(--border)]"
                    style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                  >
                    {section.heading}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5 bg-[var(--bg-card)] border border-[var(--border)]">
              <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>
                Explore More
              </p>
              <div className="mt-4 space-y-2">
                {data.related.map((path) => (
                  <Link
                    key={path}
                    href={path.startsWith('docs/') ? `/${path}` : `/${path}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:text-[var(--text-primary)] hover:bg-[var(--border)] border border-[var(--border)]"
                    style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)' }}
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
          className="mt-8 rounded-3xl p-6 md:p-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-[var(--bg-card)] border border-[var(--border)]"
          style={{ boxShadow: '0 20px 40px var(--dashboard-shadow)' }}
        >
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Need implementation details?</h3>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Jump into technical docs and API references for practical integration steps.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/docs/getting-started"
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)', color: 'var(--text-primary)' }}
            >
              Open Docs
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              View Pricing
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
