'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  Building2,
  Database,
  FileText,
  Layers,
  ScanText,
  ServerCog,
  ShieldCheck,
  Upload,
  Wallet,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const pipeline = [
  { label: 'Upload', icon: Upload, description: 'Upload PDFs, scans, or forms.' },
  { label: 'OCR Extraction', icon: ScanText, description: 'Extract text from every document page.' },
  { label: 'AI Analysis', icon: Brain, description: 'AI understands layout and key fields.' },
  { label: 'Structured Data', icon: Database, description: 'Get clean structured outputs.' },
];

const technologies = [
  { name: 'Next.js', icon: Layers },
  { name: 'FastAPI', icon: ServerCog },
  { name: 'Supabase', icon: Database },
  { name: 'AI OCR', icon: ScanText },
];

const audience = [
  { name: 'Operations Teams', icon: Building2 },
  { name: 'Finance Teams', icon: Wallet },
  { name: 'Compliance Teams', icon: ShieldCheck },
];

export default function AboutCinematicPage() {
  const cardClass =
    'rounded-xl border border-white/10 bg-white/5 backdrop-blur p-6 transition hover:border-indigo-500/50 hover:scale-[1.02]';

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 10%, rgba(99,102,241,0.22), transparent 38%), radial-gradient(circle at 80% 20%, rgba(167,139,250,0.2), transparent 36%), radial-gradient(circle at 50% 80%, rgba(34,211,238,0.12), transparent 40%)',
        }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(120deg, rgba(99,102,241,0.12), rgba(167,139,250,0.08), rgba(34,211,238,0.1), rgba(99,102,241,0.12))',
          backgroundSize: '220% 220%',
        }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <section className="py-40 text-center border-t border-white/10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-6xl font-bold tracking-tight text-center">
              Turn documents into{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
                intelligence
              </span>
              .
            </h1>
            <p className="text-lg text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed">
              DocuMind transforms PDFs, forms, and scans into structured data using AI automation.
            </p>
            <div className="mt-10 flex justify-center gap-4 flex-wrap">
              <Link
                href="/#upload"
                className="bg-indigo-500 hover:bg-indigo-400 px-6 py-3 rounded-lg font-medium transition inline-flex items-center text-white"
              >
                Try Live Demo
              </Link>
              <Link
                href="/docs/getting-started"
                className="border border-white/20 px-6 py-3 rounded-lg hover:border-white/40 transition inline-flex items-center gap-2 text-white"
              >
                Read Docs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </section>

        <section className="py-32 border-t border-white/10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-semibold text-center">The Problem</h2>
            <div className="mt-10 max-w-3xl mx-auto text-center space-y-5">
              <p className="text-2xl md:text-3xl font-medium leading-relaxed text-slate-100">
                Teams spend hours copying information from PDFs.
              </p>
              <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
                Manual document processing slows down operations across finance, operations, and compliance.
              </p>
              <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
                Spreadsheets become messy and error-prone as document volume grows.
              </p>
            </div>
          </motion.div>
        </section>

        <section className="py-32 border-t border-white/10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-semibold text-center">How DocuMind Works</h2>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pipeline.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.article
                    key={step.label}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.45 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className={cardClass}
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-300/20 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-indigo-200" />
                    </div>
                    <h3 className="mt-4 text-xl font-medium">{step.label}</h3>
                    <p className="mt-2 text-gray-400 leading-relaxed text-sm">{step.description}</p>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>
        </section>

        <section className="py-32 border-t border-white/10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-semibold text-center">Technology Stack</h2>
            </div>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8">
              {technologies.map((tech, index) => {
                const Icon = tech.icon;
                return (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                    className="p-5 rounded-lg border border-white/10 text-center bg-white/5 backdrop-blur transition hover:border-indigo-500/50 hover:scale-[1.02]"
                  >
                    <div className="w-9 h-9 rounded-md bg-indigo-500/20 border border-indigo-300/20 mx-auto flex items-center justify-center">
                      <Icon className="h-4 w-4 text-indigo-200" />
                    </div>
                    <p className="text-lg font-medium mt-3">{tech.name}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        <section className="py-32 border-t border-white/10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-semibold text-center">Who Uses DocuMind</h2>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {audience.map((group, index) => {
                const Icon = group.icon;
                return (
                  <motion.div
                    key={group.name}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.45 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className={`${cardClass} text-center`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-300/20 mx-auto flex items-center justify-center">
                      <Icon className="h-5 w-5 text-cyan-200" />
                    </div>
                    <p className="mt-4 text-xl font-medium">{group.name}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        <section className="py-32 border-t border-white/10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center rounded-xl border border-white/10 backdrop-blur p-6 bg-white/5"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-300/20 mx-auto flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-200" />
            </div>
            <h2 className="mt-5 text-3xl font-semibold text-center">Built By</h2>
            <p className="mt-2 text-2xl font-semibold text-slate-100">HB Technologies</p>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Building intelligent automation tools for teams that depend on accurate document workflows.
            </p>
          </motion.div>
        </section>

        <section className="py-40 border-t border-white/10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.45 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold tracking-tight text-center mx-auto">
              Turn your documents into intelligence.
            </h2>
            <p className="mt-6 text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Move from manual copy-paste to reliable AI-driven document workflows in minutes.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/#upload"
                className="bg-indigo-500 hover:bg-indigo-400 px-6 py-3 rounded-lg font-medium transition inline-flex items-center text-white"
              >
                Start Processing Documents
              </Link>
              <Link
                href="/docs/getting-started"
                className="border border-white/20 px-6 py-3 rounded-lg hover:border-white/40 transition inline-flex items-center gap-2 text-white"
              >
                View Documentation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
