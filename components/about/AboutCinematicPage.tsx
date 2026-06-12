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
  Clock,
  XCircle,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const pipeline = [
  { label: 'Upload', icon: Upload, description: 'Upload PDFs, scans, or forms instantly.' },
  { label: 'OCR Extraction', icon: ScanText, description: 'Extract high-fidelity text from every page.' },
  { label: 'AI Analysis', icon: Brain, description: 'AI automatically understands layouts and key fields.' },
  { label: 'Structured Data', icon: Database, description: 'Obtain clean, exportable database records.' },
];

const technologies = [
  { name: 'Next.js', icon: Layers, role: 'Frontend & SSG' },
  { name: 'FastAPI', icon: ServerCog, role: 'High-Performance API' },
  { name: 'Supabase', icon: Database, role: 'Secure Storage & Auth' },
  { name: 'Gemini AI', icon: ScanText, role: 'Vision & Extraction' },
];

const audience = [
  { 
    name: 'Operations Teams', 
    icon: Building2, 
    benefit: 'Eliminate 90% of manual data entry tasks and speed up routine processing pipelines.' 
  },
  { 
    name: 'Finance Teams', 
    icon: Wallet, 
    benefit: 'Instantly extract data from incoming invoices, bills, and payment records without error.' 
  },
  { 
    name: 'Compliance Teams', 
    icon: ShieldCheck, 
    benefit: 'Ensure end-to-end data auditability with isolated storage environments.' 
  },
];

function DocumentScannerMockup() {
  return (
    <div className="relative w-full max-w-lg aspect-[1.35/1] rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_20px_50px_var(--dashboard-shadow)] overflow-hidden flex p-4 gap-3 md:gap-4 backdrop-blur-md">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-cyan-500/5 pointer-events-none" />
      
      {/* Left side: Simulated Invoice File */}
      <div className="flex-1 rounded-2xl border border-[var(--border)] bg-white/5 dark:bg-black/20 p-3.5 flex flex-col justify-between relative overflow-hidden">
        {/* Animated Scanning Beam */}
        <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-scan-beam z-10" />
        
        <div>
          <div className="flex justify-between items-center border-b border-[var(--border)] pb-2 mb-3">
            <span className="text-[10px] font-extrabold tracking-wider text-indigo-500 dark:text-indigo-400">INVOICE</span>
            <span className="text-[8px] text-[var(--text-muted)] font-mono">#INV-2026</span>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-16 bg-slate-400/20 dark:bg-slate-700/40 rounded animate-pulse" />
            <div className="h-1.5 w-24 bg-slate-400/15 dark:bg-slate-700/25 rounded" />
            <div className="h-1.5 w-12 bg-slate-400/15 dark:bg-slate-700/25 rounded" />
          </div>
        </div>
        
        <div className="border-t border-[var(--border)] pt-2">
          <div className="flex justify-between text-[8px] font-semibold text-[var(--text-secondary)] mb-1">
            <span>Item</span>
            <span>Total</span>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-[var(--text-primary)]">
            <span>Enterprise API</span>
            <span>$1,250.00</span>
          </div>
        </div>
      </div>

      {/* Middle: Data Flow Channel */}
      <div className="w-6 md:w-8 flex flex-col items-center justify-between h-full py-6 relative">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
        <div className="w-[1px] h-full bg-gradient-to-b from-indigo-500/20 via-indigo-500/40 to-cyan-500/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-indigo-500 to-cyan-500 rounded animate-scan-beam" style={{ animationDuration: '3s' }} />
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping delay-300" />
      </div>

      {/* Right side: Structured JSON Result */}
      <div className="flex-1 rounded-2xl border border-indigo-500/20 bg-slate-950/90 dark:bg-black/60 p-3.5 font-mono text-[9px] sm:text-[10px] leading-relaxed text-slate-300 shadow-inner flex flex-col justify-between">
        <div className="text-slate-500 text-[8px] mb-2">// Extraction Pipeline</div>
        <div className="space-y-1.5 flex-1 select-none">
          <div>
            <span className="text-purple-400">"doc"</span>: <span className="text-emerald-400">"Invoice"</span>,
          </div>
          <div>
            <span className="text-purple-400">"vendor"</span>: <span className="text-emerald-400">"Acme Corp"</span>,
          </div>
          <div>
            <span className="text-purple-400">"total"</span>: <span className="text-indigo-400">1250.00</span>,
          </div>
          <div>
            <span className="text-purple-400">"currency"</span>: <span className="text-emerald-400">"USD"</span>,
          </div>
          <div>
            <span className="text-purple-400">"status"</span>: <span className="text-emerald-400">"valid"</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-between items-center">
          <span className="text-[8px] text-slate-500 font-sans">Confidence</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold">99.8%</span>
        </div>
      </div>
    </div>
  );
}

export default function AboutCinematicPage() {
  const cardClass =
    'relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] backdrop-blur p-6 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_15px_40px_var(--dashboard-shadow)] group';

  return (
    <div className="relative overflow-hidden transition-colors duration-300 w-full">
      {/* Dynamic Theme Glow Overlays */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-80"
        style={{
          background:
            'radial-gradient(circle at 10% 10%, var(--border-glow), transparent 45%), radial-gradient(circle at 90% 15%, rgba(167,139,250,0.18), transparent 40%), radial-gradient(circle at 50% 80%, rgba(34,211,238,0.12), transparent 45%)',
        }}
        aria-hidden="true"
      />
      
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-10 dark:opacity-20"
        style={{
          background: 'linear-gradient(120deg, rgba(99,102,241,0.08), rgba(167,139,250,0.05), rgba(34,211,238,0.06), rgba(99,102,241,0.08))',
          backgroundSize: '220% 220%',
        }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HERO SECTION */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 w-full">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-16 items-center text-left w-full"
          >
            <div className="lg:col-span-7 flex flex-col justify-center text-left w-full">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--bg-card)] border border-[var(--border)] text-indigo-500 dark:text-indigo-300 w-fit mb-6">
                <Sparkles className="h-3 w-3 animate-pulse text-indigo-500" />
                Next-Gen Document Intelligence
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.2] lg:leading-[1.15]">
                Turn raw documents <br className="hidden sm:inline" />
                into <span className="gradient-text">structured intelligence</span>.
              </h1>
              <p className="text-base sm:text-lg mt-6 leading-relaxed max-w-xl text-[var(--text-secondary)]">
                NeuroDocs combines state-of-the-art vision models and structured AI schemas to extract, classify, and audit documents in seconds.
              </p>
              <div className="mt-10 flex gap-4 flex-wrap">
                <Link href="/#upload" className="btn-primary text-white">
                  Try Live Demo
                </Link>
                <Link
                  href="/docs/getting-started"
                  className="border border-[var(--border)] px-6 py-3 rounded-xl hover:border-indigo-500/30 transition inline-flex items-center gap-2 text-[var(--text-primary)] bg-[var(--bg-card)] font-semibold shadow-[0_4px_12px_var(--dashboard-shadow)]"
                >
                  Read Docs
                  <ArrowRight className="h-4 w-4 text-[var(--text-secondary)]" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center items-center w-full">
              <div className="w-full max-w-md">
                <DocumentScannerMockup />
              </div>
            </div>
          </motion.div>
        </section>

        {/* THE PROBLEM / SOLUTION SECTION */}
        <section className="py-24 border-t border-[var(--border)]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16"
          >
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/5 border border-indigo-500/15 text-indigo-500 dark:text-indigo-300 w-fit">
                The Paradigm Shift
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.2]">
                Why Legacy OCR <br className="hidden sm:inline" />Systems Fail
              </h2>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                Traditional templates and rigid keyword searches break the moment a document layout shifts even slightly. NeuroDocs leverages LLM-based cognitive schemas to ensure robust, auto-healing data extraction.
              </p>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] shadow-md hover:border-red-500/20 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <Clock className="h-5 w-5 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">The Fragile Legacy Way</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-4.5 w-4.5 text-red-500/70 mt-0.5 shrink-0" />
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Manual template setup takes hours of regex matching for each new vendor format.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="h-4.5 w-4.5 text-red-500/70 mt-0.5 shrink-0" />
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Slight shifts in scan alignments or image quality cause regex extractions to fail completely.</p>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[var(--bg-card)] border border-indigo-500/10 dark:border-indigo-500/5 shadow-lg hover:border-emerald-500/25 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Zap className="h-5 w-5 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">The NeuroDocs Intelligent Way</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Zero templates. AI adapts automatically to any document format, table, or font variation.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Side-by-side human-in-the-loop validation tools ensure perfect accuracy before saving.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-24 border-t border-[var(--border)]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-indigo-500 dark:text-indigo-400">Processing Flow</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">How NeuroDocs Operates</h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
                A streamlined multi-agent intelligence pipeline converting unstructured PDFs into clean, schema-perfect API endpoints.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Connector line for large screens */}
              <div className="hidden lg:block absolute top-1/2 left-4 right-4 h-[1px] bg-gradient-to-r from-indigo-500/10 via-cyan-500/20 to-indigo-500/10 -translate-y-8 z-0 pointer-events-none" />

              {pipeline.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.article
                    key={step.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] backdrop-blur p-6 transition-all duration-300 hover:border-indigo-500/40 hover:translate-y-[-4px] hover:shadow-[0_15px_35px_var(--dashboard-shadow)] group z-10"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-300/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6 text-indigo-500 dark:text-indigo-300" />
                      </div>
                      <span className="text-xs font-black text-indigo-500/50 dark:text-indigo-300/35 bg-indigo-500/5 px-2.5 py-0.5 rounded-lg border border-indigo-500/10">
                        STEP 0{index + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{step.label}</h3>
                    <p className="mt-3 leading-relaxed text-sm text-[var(--text-secondary)]">{step.description}</p>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* TECHNOLOGY STACK SECTION */}
        <section className="py-24 border-t border-[var(--border)]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-indigo-500 dark:text-indigo-400">Enterprise Frameworks</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">The Technology Stack</h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
                Our technology choices prioritize processing speed, schema compliance, and secure data storage.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
              {technologies.map((tech, index) => {
                const Icon = tech.icon;
                return (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                    className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] backdrop-blur transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_15px_30px_var(--dashboard-shadow)] text-center group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-300/10 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-5 w-5 text-indigo-500 dark:text-indigo-300" />
                    </div>
                    <p className="text-lg font-bold mt-4 text-[var(--text-primary)]">{tech.name}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1.5 font-medium">{tech.role}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* AUDIENCE / USER GROUPS */}
        <section className="py-24 border-t border-[var(--border)]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-indigo-500 dark:text-indigo-400">Tailored Core Workflows</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">Who Uses NeuroDocs</h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
                Our features are engineered to solve high-volume paper problems across vital enterprise business departments.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {audience.map((group, index) => {
                const Icon = group.icon;
                return (
                  <motion.div
                    key={group.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className={`${cardClass} text-left`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-300/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-[var(--text-primary)]">{group.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{group.benefit}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* BUILT BY SIGNATURE CARD */}
        <section className="py-24 border-t border-[var(--border)]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] backdrop-blur p-8 sm:p-10 shadow-[0_20px_50px_var(--dashboard-shadow)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-50 pointer-events-none" />
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-300/10 mx-auto flex items-center justify-center">
              <FileText className="h-6 w-6 text-purple-500 dark:text-purple-300" />
            </div>
            <h2 className="mt-6 text-xs uppercase tracking-[0.2em] font-semibold text-[var(--text-secondary)]">Platform Architected By</h2>
            <p className="mt-2 text-3xl font-black text-[var(--text-primary)]">HB Technologies</p>
            <p className="mt-5 max-w-xl mx-auto leading-relaxed text-sm sm:text-base text-[var(--text-secondary)]">
              We build precise, production-grade automation systems and high-end software solutions designed for reliability and visual excellence.
            </p>
          </motion.div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-32 border-t border-[var(--border)]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.45 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-center mx-auto text-[var(--text-primary)] leading-tight">
              Ready to automate your <br className="hidden sm:inline" />
              document processing workflows?
            </h2>
            <p className="mt-6 leading-relaxed max-w-2xl mx-auto text-base sm:text-lg text-[var(--text-secondary)]">
              Move from manual copying and errors to flawless structured database extraction today.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/#upload"
                className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3.5 rounded-xl font-bold transition inline-flex items-center text-white shadow-[0_6px_24px_rgba(99,102,241,0.35)] hover:scale-102 duration-300"
              >
                Start Processing Now
              </Link>
              <Link
                href="/docs/getting-started"
                className="border border-[var(--border)] px-8 py-3.5 rounded-xl hover:border-indigo-500/30 transition inline-flex items-center gap-2 text-[var(--text-primary)] bg-[var(--bg-card)] font-bold shadow-[0_4px_12px_var(--dashboard-shadow)]"
              >
                Read Technical Docs
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}
