'use client';

import { Code2, Database, KeyRound, Lock, Server, Webhook } from 'lucide-react';

const items = [
  { icon: Server, label: 'REST API', detail: 'Upload, process, review, export' },
  { icon: Webhook, label: 'Webhooks', detail: 'Document state and field events' },
  { icon: Database, label: 'Supabase', detail: 'Storage, auth, and row security' },
  { icon: KeyRound, label: 'Scoped keys', detail: 'Environment and team controls' },
  { icon: Lock, label: 'Access control', detail: 'Private documents by default' },
  { icon: Code2, label: 'JSON output', detail: 'Typed payloads for your systems' },
];

export default function TechStack() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface-muted)] py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase text-blue-700">Developer ready</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">Fits into the stack you already run.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
                  <Icon className="h-5 w-5 text-blue-700" />
                  <div className="mt-3 text-sm font-semibold text-[var(--text-primary)]">{item.label}</div>
                  <div className="mt-1 text-sm leading-5 text-[var(--text-secondary)]">{item.detail}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
