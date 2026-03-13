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
    description: 'Set up DocuMind locally and run your first document processing flow.',
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
    strapline: 'Connect DocuMind with your existing stack.',
    description: 'Connect DocuMind with storage, messaging, and business automation tools.',
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
      code: "import { documind } from '@/lib/api';\n\nconst job = await documind.startProcessing(documentId, 'invoice');",
    },
  },
};

export function generateStaticParams() {
  return docOrder.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const data = docs[params.slug];
  if (!data) {
    return {
      title: 'Documentation Not Found | DocuMind',
      description: 'The requested documentation page could not be found.',
    };
  }

  return {
    title: `${data.title} | DocuMind Docs`,
    description: data.description,
  };
}

export default function DocsPage({ params }: { params: { slug: string } }) {
  const data = docs[params.slug];
  if (!data) {
    notFound();
  }
  const currentIndex = docOrder.indexOf(params.slug as (typeof docOrder)[number]);
  const prevSlug = currentIndex > 0 ? docOrder[currentIndex - 1] : null;
  const nextSlug = currentIndex < docOrder.length - 1 ? docOrder[currentIndex + 1] : null;

  return (
    <main className="relative overflow-hidden" style={{ minHeight: '100vh', background: '#0A0A0A', color: '#F1F5F9' }}>
      <div
        className="pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2 h-80 w-[45rem] blur-3xl"
        style={{ background: 'linear-gradient(120deg, rgba(34,211,238,0.22), rgba(99,102,241,0.24), rgba(167,139,250,0.18))' }}
        aria-hidden="true"
      />

      <div className="cx py-12 md:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'rgba(241,245,249,0.72)' }}>
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mt-7 grid gap-6 lg:grid-cols-[16rem_1fr]">
          <aside className="h-fit lg:sticky lg:top-8 space-y-4">
            <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)' }}>
              <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'rgba(241,245,249,0.45)' }}>
                Docs Menu
              </p>
              <div className="mt-3 space-y-2">
                {docOrder.map((slug) => {
                  const item = docs[slug];
                  const active = slug === params.slug;
                  return (
                    <Link
                      key={slug}
                      href={`/docs/${slug}`}
                      className="block rounded-lg px-3 py-2 text-sm font-medium"
                      style={{
                        color: active ? '#EDE9FE' : 'rgba(241,245,249,0.78)',
                        background: active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.02)',
                        border: active ? '1px solid rgba(129,140,248,0.5)' : '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)' }}>
              <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'rgba(241,245,249,0.45)' }}>
                Quick Links
              </p>
              <div className="mt-3 space-y-2">
                {data.quickLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm"
                    style={{ color: 'rgba(241,245,249,0.85)', background: 'rgba(255,255,255,0.02)' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <section className="space-y-5">
            <div
              className="rounded-3xl p-7 md:p-9"
              style={{
                background: 'rgba(255,255,255,0.035)',
                border: '1px solid rgba(129,140,248,0.42)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.45)',
              }}
            >
              <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'rgba(241,245,249,0.45)' }}>
                Documentation
              </p>
              <h1 className="mt-3 text-3xl md:text-5xl font-black tracking-tight">{data.title}</h1>
              <p className="mt-3 text-sm md:text-base leading-7" style={{ color: 'rgba(241,245,249,0.75)' }}>
                {data.strapline}
              </p>
              <p className="mt-4 text-sm md:text-base leading-7" style={{ color: 'rgba(241,245,249,0.63)' }}>
                {data.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs" style={{ color: 'rgba(241,245,249,0.58)' }}>
                <span className="inline-flex items-center gap-1.5">
                  <BookText className="h-3.5 w-3.5" />
                  Last updated: {data.updated}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Code2 className="h-3.5 w-3.5" />
                  {data.sections.length} key sections
                </span>
              </div>
            </div>

            <div className="grid gap-4">
              {data.sections.map((section, index) => (
                <article
                  key={section.title}
                  className="rounded-2xl p-6"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'rgba(241,245,249,0.45)' }}>
                    Section {index + 1}
                  </p>
                  <h2 className="mt-2 text-xl font-bold">{section.title}</h2>
                  <ul className="mt-4 space-y-2.5">
                    {section.points.map((point) => (
                      <li
                        key={point}
                        className="rounded-lg px-3.5 py-2.5 text-sm leading-6"
                        style={{ color: 'rgba(241,245,249,0.75)', background: 'rgba(255,255,255,0.02)' }}
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            {data.sample ? (
              <div className="rounded-2xl p-6" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.11)' }}>
                <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'rgba(241,245,249,0.48)' }}>
                  {data.sample.title}
                </p>
                <pre className="mt-4 overflow-x-auto rounded-lg p-4 text-sm leading-6" style={{ background: 'rgba(2,6,23,0.7)', color: '#C7D2FE' }}>
                  <code>{data.sample.code}</code>
                </pre>
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              {prevSlug ? (
                <Link
                  href={`/docs/${prevSlug}`}
                  className="rounded-2xl p-4"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'rgba(241,245,249,0.45)' }}>
                    Previous
                  </p>
                  <p className="mt-2 text-sm font-semibold">{docs[prevSlug].title}</p>
                </Link>
              ) : (
                <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }} />
              )}

              {nextSlug ? (
                <Link
                  href={`/docs/${nextSlug}`}
                  className="rounded-2xl p-4 text-right"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'rgba(241,245,249,0.45)' }}>
                    Next
                  </p>
                  <p className="mt-2 text-sm font-semibold inline-flex items-center gap-1.5">
                    {docs[nextSlug].title}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </p>
                </Link>
              ) : (
                <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }} />
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
