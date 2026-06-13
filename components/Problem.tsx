'use client';

import { motion } from 'framer-motion';
import { AlertCircle, ClipboardCheck, FileSearch, Workflow } from 'lucide-react';

const pains = [
  {
    icon: FileSearch,
    title: 'Unclear document state',
    description: 'Teams know a file arrived, but not whether it was read, validated, approved, or exported.',
  },
  {
    icon: AlertCircle,
    title: 'Silent extraction risk',
    description: 'Bad OCR and missing fields slip into downstream systems when confidence is not visible.',
  },
  {
    icon: Workflow,
    title: 'Manual handoffs',
    description: 'Email, spreadsheets, and one-off scripts become the workflow instead of the exception path.',
  },
  {
    icon: ClipboardCheck,
    title: 'No audit trail',
    description: 'When a number changes, teams need to know who reviewed it, when, and why.',
  },
];

export default function Problem() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface-muted)] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-sm font-semibold uppercase text-blue-700">Why teams switch</p>
            <h2 className="mt-3 max-w-md text-3xl font-semibold leading-tight text-[var(--text-primary)]">
              Document automation fails when it is only a parser.
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-[var(--text-secondary)]">
              Real teams need a system around extraction: queues, review states, role-aware actions, confidence, and clean exports.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {pains.map((pain, index) => {
              const Icon = pain.icon;
              return (
                <motion.article
                  key={pain.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[var(--text-primary)]">{pain.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{pain.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
