'use client';

import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2, CircleDollarSign, FileText, Search, SlidersHorizontal } from 'lucide-react';

const queue = [
  { name: 'Invoice batch', docs: 42, status: '12 need review', color: 'text-amber-700 bg-amber-50 ring-amber-200' },
  { name: 'Vendor contracts', docs: 18, status: 'All approved', color: 'text-emerald-700 bg-emerald-50 ring-emerald-200' },
  { name: 'Claims intake', docs: 67, status: '8 routed', color: 'text-blue-700 bg-blue-50 ring-blue-200' },
];

export default function DashboardPreview() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--bg)] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-blue-700">Operator console</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight text-[var(--text-primary)]">
              A dashboard that looks like work, not a demo animation.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[var(--text-secondary)]">
            Your team sees queues, exceptions, field confidence, and export health in one place.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] shadow-xl shadow-slate-200/60"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
              <BarChart3 className="h-4 w-4 text-blue-700" />
              Processing overview
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 text-sm text-slate-600">
                <Search className="h-4 w-4" />
                Search
              </button>
              <button className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 text-sm text-slate-600">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[16rem_1fr_18rem]">
            <aside className="border-b border-[var(--border)] bg-white p-4 lg:border-b-0 lg:border-r">
              <div className="space-y-2">
                {queue.map((item) => (
                  <div key={item.name} className="rounded-md border border-[var(--border)] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-950">{item.name}</span>
                      <span className="text-xs text-slate-500">{item.docs}</span>
                    </div>
                    <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-medium ring-1 ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </aside>

            <div className="min-w-0 p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['Processed today', '1,284', FileText],
                  ['Auto-approved', '76%', CheckCircle2],
                  ['Value checked', '$2.8M', CircleDollarSign],
                ].map(([label, value, Icon]) => (
                  <div key={label as string} className="rounded-md border border-[var(--border)] bg-white p-4">
                    <Icon className="h-4 w-4 text-blue-700" />
                    <div className="mt-3 text-2xl font-semibold text-slate-950">{value as string}</div>
                    <div className="mt-1 text-xs text-slate-500">{label as string}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 overflow-hidden rounded-md border border-[var(--border)] bg-white">
                <div className="grid grid-cols-[1fr_0.7fr_0.7fr_0.7fr] border-b border-[var(--border)] px-4 py-2.5 text-xs font-medium uppercase text-slate-500">
                  <span>Field</span>
                  <span>Extracted</span>
                  <span>Confidence</span>
                  <span className="text-right">Action</span>
                </div>
                {[
                  ['Invoice number', 'INV-2407', '99%', 'Approve'],
                  ['PO match', 'PO-6620', '97%', 'Approve'],
                  ['Tax total', '$642.18', '72%', 'Review'],
                  ['Due date', 'Jul 18, 2026', '95%', 'Approve'],
                ].map(([field, value, confidence, action]) => (
                  <div key={field} className="grid grid-cols-[1fr_0.7fr_0.7fr_0.7fr] items-center border-b border-[var(--border)] px-4 py-3 text-sm last:border-b-0">
                    <span className="font-medium text-slate-900">{field}</span>
                    <span className="truncate text-slate-600">{value}</span>
                    <span className="text-slate-600">{confidence}</span>
                    <span className="text-right text-sm font-semibold text-blue-700">{action}</span>
                  </div>
                ))}
              </div>
            </div>

            <aside className="border-t border-[var(--border)] bg-slate-950 p-5 text-white lg:border-l lg:border-t-0">
              <div className="text-sm font-semibold">Audit log</div>
              <div className="mt-5 space-y-4">
                {['Uploaded by ap@northstar.com', 'Schema validation passed', 'Tax total flagged', 'Reviewer assigned'].map((event) => (
                  <div key={event} className="flex gap-3 text-sm">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-400" />
                    <div>
                      <div className="text-slate-100">{event}</div>
                      <div className="text-xs text-slate-500">Just now</div>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
