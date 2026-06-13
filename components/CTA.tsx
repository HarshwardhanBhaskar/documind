'use client';

import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CTA() {
  return (
    <section className="bg-[var(--bg)] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 rounded-lg border border-[var(--border-strong)] bg-slate-950 p-8 text-white shadow-xl shadow-slate-200/50 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight">Put one document workflow in front of every team.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              Start with upload and extraction today. Add review, audit, and exports as your process matures.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-300">
              {['No credit card for trial', 'Works with existing files', 'API and dashboard included'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <a href="#demo" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
            Try the workflow
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
