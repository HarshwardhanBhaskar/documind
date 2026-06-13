'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Clock3, FileText, ShieldCheck, Sparkles, TriangleAlert } from 'lucide-react';

const rows = [
  { id: 'INV-2407', type: 'Invoice', owner: 'AP inbox', value: '$8,420.00', status: 'Approved', tone: 'green' },
  { id: 'MSA-1182', type: 'Contract', owner: 'Legal', value: '42 pages', status: 'Review', tone: 'amber' },
  { id: 'CLM-9034', type: 'Claim', owner: 'Ops queue', value: '18 fields', status: 'Ready', tone: 'blue' },
  { id: 'PO-6620', type: 'Purchase order', owner: 'Finance', value: '$2,180.50', status: 'Matched', tone: 'green' },
];

const metrics = [
  { label: 'field accuracy', value: '99.2%' },
  { label: 'avg processing', value: '41s' },
  { label: 'manual checks saved', value: '68%' },
];

function StatusPill({ status, tone }: { status: string; tone: string }) {
  const classes = {
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    blue: 'bg-blue-50 text-blue-700 ring-blue-200',
  }[tone] ?? 'bg-slate-100 text-slate-700 ring-slate-200';

  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${classes}`}>{status}</span>;
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg)] pt-28">
      <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(37,99,235,0.08),transparent)]" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-16 pt-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:pb-24 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            Document AI for operations teams
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-normal text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
            Turn document work into a monitored production workflow.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
            NeuroDocs extracts, validates, and routes business documents with the controls teams expect: review queues, audit trails, confidence scores, and export-ready data.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#demo" className="inline-flex h-11 items-center gap-2 rounded-md bg-[var(--accent)] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--accent-strong)]">
              Try the workflow
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#features" className="inline-flex h-11 items-center rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-5 text-sm font-semibold text-[var(--text-primary)] transition hover:border-slate-400">
              View capabilities
            </a>
          </div>

          <div className="mt-8 grid max-w-xl grid-cols-3 divide-x divide-[var(--border)] rounded-md border border-[var(--border)] bg-[var(--surface)]">
            {metrics.map((metric) => (
              <div key={metric.label} className="px-4 py-3">
                <div className="text-lg font-semibold text-[var(--text-primary)]">{metric.value}</div>
                <div className="mt-0.5 text-xs leading-4 text-[var(--text-muted)]">{metric.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] shadow-2xl shadow-slate-200/70">
            <div className="flex items-center justify-between border-b border-[var(--border)] bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Operations queue</div>
                  <div className="text-xs text-slate-500">Live extraction review</div>
                </div>
              </div>
              <div className="hidden items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 sm:flex">
                <CheckCircle2 className="h-3.5 w-3.5" />
                API healthy
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_18rem]">
              <div className="min-w-0">
                <div className="grid grid-cols-[1.1fr_0.8fr_0.7fr_0.7fr] border-b border-[var(--border)] px-5 py-2.5 text-xs font-medium uppercase text-slate-500">
                  <span>Document</span>
                  <span>Owner</span>
                  <span>Value</span>
                  <span className="text-right">Status</span>
                </div>
                <div className="divide-y divide-[var(--border)]">
                  {rows.map((row) => (
                    <div key={row.id} className="grid grid-cols-[1.1fr_0.8fr_0.7fr_0.7fr] items-center px-5 py-4 text-sm">
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-slate-950">{row.id}</div>
                        <div className="truncate text-xs text-slate-500">{row.type}</div>
                      </div>
                      <div className="truncate text-slate-600">{row.owner}</div>
                      <div className="truncate font-medium text-slate-800">{row.value}</div>
                      <div className="text-right">
                        <StatusPill status={row.status} tone={row.tone} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--border)] bg-slate-950 p-5 text-white lg:border-l lg:border-t-0">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Extraction details</div>
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                </div>
                <div className="mt-5 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Vendor</span>
                      <span>98%</span>
                    </div>
                    <div className="mt-1 rounded bg-slate-900 px-3 py-2 text-sm">Northstar Supply Co.</div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Tax ID</span>
                      <span>96%</span>
                    </div>
                    <div className="mt-1 rounded bg-slate-900 px-3 py-2 text-sm">US-47-8120039</div>
                  </div>
                  <div className="rounded-md border border-amber-400/30 bg-amber-400/10 p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-200">
                      <TriangleAlert className="h-3.5 w-3.5" />
                      Needs review
                    </div>
                    <p className="mt-1 text-xs leading-5 text-amber-100/80">Line item total differs from invoice total by $12.00.</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock3 className="h-3.5 w-3.5" />
                    Synced to ERP 2 minutes ago
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
