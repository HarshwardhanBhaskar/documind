'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, FileInput, ListChecks, ScanLine, Send, UserCheck } from 'lucide-react';

const steps = [
  { icon: FileInput, title: 'Ingest', detail: 'Email inbox, API, dashboard upload, or storage bucket.' },
  { icon: ScanLine, title: 'Read', detail: 'OCR, layout detection, table parsing, and field candidates.' },
  { icon: ListChecks, title: 'Validate', detail: 'Schema rules, duplicate checks, totals, dates, and confidence gates.' },
  { icon: UserCheck, title: 'Review', detail: 'Only exceptions go to people, with source highlights and edit history.' },
  { icon: Send, title: 'Export', detail: 'Send approved records to ERP, CRM, data warehouse, or webhook.' },
];

export default function AIPipeline() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface-muted)] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-blue-700">Workflow</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[var(--text-primary)]">
              Built for the messy middle between upload and approval.
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
              The product keeps each document moving through a clear lifecycle, so operators can trust the queue instead of chasing files across channels.
            </p>
            <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                Production guardrail
              </div>
              <p className="mt-1">Automation handles confident records. Exceptions stay visible until reviewed.</p>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
            <div className="space-y-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="grid grid-cols-[2.75rem_1fr] gap-4 rounded-md border border-[var(--border)] bg-white p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold uppercase text-slate-400">0{index + 1}</span>
                        <h3 className="text-sm font-semibold text-slate-950">{step.title}</h3>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{step.detail}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
