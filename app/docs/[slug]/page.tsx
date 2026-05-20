import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookText, Code2 } from 'lucide-react';

type DocSection = {
  title: string;
  points: string[];
};

type QuickLink = {
  label: string;
  href: string;
};

type CodeSample = {
  title: string;
  code: string;
};

type DocContent = {
  title: string;
  strapline: string;
  description: string;
  updated: string;
  sections: DocSection[];
  quickLinks: QuickLink[];
  sample?: CodeSample;
};

const docOrder = ['getting-started', 'api-reference', 'guides', 'integrations', 'sdks'] as const;

const docs: Record<string, DocContent> = {
  'getting-started': {
    title: 'Getting Started',
    strapline: 'Launch your first complete document flow in minutes.',
    description: 'Set up NeuroDocs locally and run your first document processing flow.',
    updated: 'March 12, 2026',
    sections: [
      {
        title: 'Environment Setup',
        points: [
          'Configure Supabase URL, anon key, and service key in backend and frontend env files.',
          'Install Poppler and Tesseract so OCR and page-count parsing work for PDF files.',
        ],
      },
      {
        title: 'Local Run Commands',
        points: [
          'Start backend API and frontend app in separate terminals.',
          'Validate health routes, auth flow, and storage upload permissions before first demo.',
        ],
      },
      {
        title: 'End-to-End Validation',
        points: [
          'Upload one PDF and one image, then confirm OCR text and extraction outputs.',
          'Check status transitions so processing does not stall at high progress values.',
        ],
      },
    ],
    quickLinks: [
      { label: 'Upload Demo', href: '/#upload' },
      { label: 'Feature Overview', href: '/#features' },
      { label: 'API Reference', href: '/docs/api-reference' },
    ],
    sample: {
      title: 'Backend startup',
      code: 'uvicorn main:app --reload --host 0.0.0.0 --port 8000',
    },
  },
  'api-reference': {
    title: 'API Reference',
    strapline: 'Production-oriented endpoints for document lifecycle operations.',
    description: 'REST endpoints for uploads, processing jobs, status checks, and export data.',
    updated: 'March 12, 2026',
    sections: [
      {
        title: 'Authentication and Access',
        points: [
          'Use bearer tokens for protected routes and service role keys only in backend contexts.',
          'Enforce RLS-compatible user scoping when reading jobs and extraction results.',
        ],
      },
      {
        title: 'Core Endpoints',
        points: [
          'Upload endpoint for file intake and metadata creation.',
          'Processing endpoint for OCR, classification, extraction orchestration.',
          'Status endpoint for polling progress and failure reasons by stage.',
        ],
      },
      {
        title: 'Error and Retry Model',
        points: [
          'Return explicit stage failures with actionable reasons for users and operators.',
          'Retry only idempotent stages and preserve audit logs for every attempt.',
        ],
      },
    ],
    quickLinks: [
      { label: 'Guides', href: '/docs/guides' },
      { label: 'Integrations', href: '/docs/integrations' },
      { label: 'Pricing', href: '/#pricing' },
    ],
    sample: {
      title: 'Process a document',
      code: "POST /api/processing/start\n{\n  \"document_id\": \"doc_123\",\n  \"mode\": \"invoice\"\n}",
    },
  },
  guides: {
    title: 'Guides',
    strapline: 'Hands-on implementation patterns for real workflows.',
    description: 'Practical implementation walkthroughs for common product workflows.',
    updated: 'March 12, 2026',
    sections: [
      {
        title: 'Domain-first Pipeline Design',
        points: [
          'Pick one domain schema and tune extraction to that format for higher quality.',
          'Add confidence thresholds and human-review checkpoints for low-confidence fields.',
        ],
      },
      {
        title: 'Asynchronous UX',
        points: [
          'Use status polling or websockets to avoid blocking user requests.',
          'Expose stage-level progress: queued, OCR, classify, extract, validate, complete.',
        ],
      },
      {
        title: 'Export and Handoff',
        points: [
          'Map extracted fields into stable JSON and CSV exports for downstream systems.',
          'Version output schema so integrations do not break when fields evolve.',
        ],
      },
    ],
    quickLinks: [
      { label: 'API Reference', href: '/docs/api-reference' },
      { label: 'SDKs', href: '/docs/sdks' },
      { label: 'Roadmap', href: '/roadmap' },
    ],
  },
  integrations: {
    title: 'Integrations',
    strapline: 'Connect NeuroDocs with your existing stack.',
    description: 'Connect NeuroDocs with storage, messaging, and business automation tools.',
    updated: 'March 12, 2026',
    sections: [
      {
        title: 'Storage and Auth',
        points: [
          'Supabase handles object storage, auth, and row-level authorization.',
          'Use scoped bucket policies so users can only access their own files.',
        ],
      },
      {
        title: 'Event-driven Processing',
        points: [
          'Trigger background workers from queue events instead of synchronous APIs.',
          'Push completion events to webhook consumers for downstream automation.',
        ],
      },
      {
        title: 'Business System Sync',
        points: [
          'Sync extracted records to ERP/CRM with stable identifiers and retry-safe writes.',
          'Keep a reconciliation job for failed sync events and reprocessing.',
        ],
      },
    ],
    quickLinks: [
      { label: 'Getting Started', href: '/docs/getting-started' },
      { label: 'Guides', href: '/docs/guides' },
      { label: 'Security', href: '/security' },
    ],
  },
  sdks: {
    title: 'SDKs',
    strapline: 'Ship integrations faster with shared clients and models.',
    description: 'Client libraries and helper modules for faster integration.',
    updated: 'March 12, 2026',
    sections: [
      {
        title: 'SDK Design Goals',
        points: [
          'Provide type-safe wrappers for upload, processing, and status APIs.',
          'Keep model types aligned with backend schema and version changes.',
        ],
      },
      {
        title: 'Frontend and Backend Clients',
        points: [
          'Frontend SDK focuses on authenticated user actions and status presentation.',
          'Backend SDK supports service credentials, retries, and batch ingestion.',
        ],
      },
      {
        title: 'Testing and Versioning',
        points: [
          'Publish semantic versions and migration notes for every breaking update.',
          'Run integration tests against real API contracts before each release.',
        ],
      },
    ],
    quickLinks: [
      { label: 'API Reference', href: '/docs/api-reference' },
      { label: 'Integrations', href: '/docs/integrations' },
      { label: 'Changelog', href: '/changelog' },
    ],
    sample: {
      title: 'TypeScript client usage',
      code: "import { neurodocs } from '@/lib/api';\n\nconst job = await neurodocs.startProcessing(documentId, 'invoice');",
    },
  },
};

export function generateStaticParams() {
  return docOrder.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = docs[slug];
  if (!data) {
    return {
      title: 'Documentation Not Found | NeuroDocs Docs',
      description: 'The requested documentation page could not be found.',
    };
  }

  return {
    title: `${data.title} | NeuroDocs Docs`,
    description: data.description,
  };
}

export default async function DocsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: currentSlug } = await params;
  const data = docs[currentSlug];
  if (!data) {
    notFound();
  }
  const currentIndex = docOrder.indexOf(currentSlug as (typeof docOrder)[number]);
  const prevSlug = currentIndex > 0 ? docOrder[currentIndex - 1] : null;
  const nextSlug = currentIndex < docOrder.length - 1 ? docOrder[currentIndex + 1] : null;

  return (
    <main className="relative overflow-hidden bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300" style={{ minHeight: '100vh' }}>
      <div
        className="pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2 h-80 w-[45rem] blur-3xl opacity-60 dark:opacity-100"
        style={{ background: 'linear-gradient(120deg, rgba(34,211,238,0.22), rgba(99,102,241,0.24), rgba(167,139,250,0.18))' }}
        aria-hidden="true"
      />

      <div className="cx py-12 md:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-[var(--text-primary)] transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mt-7 grid gap-6 lg:grid-cols-[16rem_1fr]">
          <aside className="h-fit lg:sticky lg:top-8 space-y-4">
            <div className="rounded-2xl p-4 bg-[var(--bg-card)] border border-[var(--border)]">
              <p className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Docs Menu
              </p>
              <div className="mt-3 space-y-2">
                {docOrder.map((slug) => {
                  const item = docs[slug];
                  const active = slug === currentSlug;
                  return (
                    <Link
                      key={slug}
                      href={`/docs/${slug}`}
                      className="block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-[var(--text-primary)] hover:bg-[var(--border)] border"
                      style={{
                        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                        background: active ? 'rgba(99,102,241,0.12)' : 'var(--bg-card)',
                        borderColor: active ? 'var(--border-glow)' : 'var(--border)',
                      }}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl p-4 bg-[var(--bg-card)] border border-[var(--border)]">
              <p className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Quick Links
              </p>
              <div className="mt-3 space-y-2">
                {data.quickLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm transition-colors hover:text-[var(--text-primary)] hover:bg-[var(--border)] border border-[var(--border)]"
                    style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <section className="space-y-5">
            <div
              className="rounded-3xl p-7 md:p-9 bg-[var(--bg-card)] border border-[var(--border)]"
              style={{
                boxShadow: '0 25px 60px var(--dashboard-shadow)',
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 flex flex-col justify-center">
                  <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>
                    Documentation
                  </p>
                  <h1 className="mt-3 text-3xl md:text-5xl font-black tracking-tight text-[var(--text-primary)]">{data.title}</h1>
                  <p className="mt-3 text-sm md:text-base leading-7 font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {data.strapline}
                  </p>
                  <p className="mt-4 text-sm md:text-base leading-7" style={{ color: 'var(--text-muted)' }}>
                    {data.description}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    <span className="inline-flex items-center gap-1.5">
                      <BookText className="h-3.5 w-3.5 text-indigo-400" />
                      Last updated: {data.updated}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                      {data.sections.length} key sections
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-4 flex justify-center items-center">
                  <div className="relative group w-full max-w-[200px] aspect-square flex items-center justify-center rounded-2xl glass p-3 float-anim transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(99,102,241,0.12)]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--indigo)] to-[var(--violet)] opacity-10 blur-xl rounded-2xl group-hover:opacity-20 transition-opacity duration-500" />
                    <img
                      src="/docs_illustration.png"
                      alt="Docs Illustration"
                      className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] group-hover:rotate-2 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {data.sections.map((section, index) => (
                <article
                  key={section.title}
                  className="rounded-2xl p-6 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] transition-all duration-300 hover:border-indigo-500/20"
                >
                  <p className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Section {index + 1}
                  </p>
                  <h2 className="mt-2 text-xl font-bold">{section.title}</h2>
                  <ul className="mt-4 space-y-2.5">
                    {section.points.map((point) => (
                      <li
                        key={point}
                        className="rounded-lg px-3.5 py-2.5 text-sm leading-6 border border-[var(--border)] transition-colors hover:border-indigo-500/10"
                        style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)' }}
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            {data.sample ? (
              <div className="rounded-2xl p-6 bg-[#0F172A] border border-[var(--border)] shadow-xl overflow-hidden">
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#818CF8]">
                  {data.sample.title}
                </p>
                <pre className="mt-4 overflow-x-auto rounded-lg p-4 text-sm leading-6 bg-[#020617] text-[#C7D2FE] border border-white/5 font-mono">
                  <code>{data.sample.code}</code>
                </pre>
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              {prevSlug ? (
                <Link
                  href={`/docs/${prevSlug}`}
                  className="rounded-2xl p-4 bg-[var(--bg-card)] border border-[var(--border)] hover:border-indigo-500/20 transition-all text-[var(--text-primary)]"
                >
                  <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>
                    Previous
                  </p>
                  <p className="mt-2 text-sm font-semibold">{docs[prevSlug].title}</p>
                </Link>
              ) : (
                <div className="rounded-2xl p-4 bg-[var(--bg-card)] border border-[var(--border)] opacity-30" />
              )}

              {nextSlug ? (
                <Link
                  href={`/docs/${nextSlug}`}
                  className="rounded-2xl p-4 text-right bg-[var(--bg-card)] border border-[var(--border)] hover:border-indigo-500/20 transition-all text-[var(--text-primary)]"
                >
                  <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>
                    Next
                  </p>
                  <p className="mt-2 text-sm font-semibold inline-flex items-center gap-1.5">
                    {docs[nextSlug].title}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </p>
                </Link>
              ) : (
                <div className="rounded-2xl p-4 bg-[var(--bg-card)] border border-[var(--border)] opacity-30" />
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
