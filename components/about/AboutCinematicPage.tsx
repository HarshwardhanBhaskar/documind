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

export default function AboutCinematicPage() {
  const cardClass =
    'relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] backdrop-blur p-6 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_15px_40px_var(--dashboard-shadow)] group';

  return (
    <div className="relative overflow-hidden transition-colors duration-300">
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
        <section className="pt-36 pb-20 border-t border-[var(--border)]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left"
          >
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--bg-card)] border border-[var(--border)] text-indigo-500 dark:text-indigo-300 w-fit mb-6">
                <Sparkles className="h-3 w-3 animate-pulse" />
                Next-Gen Document Intelligence
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.1] lg:leading-[1.05]">
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
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative group w-full max-w-xs sm:max-w-sm aspect-square flex items-center justify-center rounded-3xl glass p-4 float-anim transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_30px_70px_rgba(99,102,241,0.18)]">
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--indigo)] to-[var(--violet)] opacity-10 blur-2xl rounded-3xl group-hover:opacity-20 transition-opacity duration-500" />
                <img
                  src="/about_illustration.png"
                  alt="About Illustration"
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] group-hover:rotate-1 transition-transform duration-500"
                />
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
            className="space-y-16"
          >
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-indigo-500 dark:text-indigo-400">The Problem & The Paradigm</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">Why Legacy Document Processing Fails</h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Traditional OCR and templates fail the moment layouts shift. NeuroDocs introduces dynamic schema parsing to keep pipelines robust.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* The Manual struggle */}
              <div className="rounded-3xl p-8 bg-[var(--bg-card)] border border-red-500/10 dark:border-red-500/5 relative overflow-hidden group shadow-[0_15px_40px_var(--dashboard-shadow)]">
                <div className="absolute top-0 right-0 p-6 opacity-5 text-red-500 group-hover:opacity-10 transition-opacity duration-300">
                  <XCircle className="h-32 w-32" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/25">
                    <Clock className="h-5 w-5 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">The Manual Bottleneck</h3>
                </div>
                <ul className="mt-8 space-y-5">
                  <li className="flex items-start gap-3.5">
                    <XCircle className="h-5 w-5 text-red-500/70 mt-0.5 shrink-0" />
                    <p className="text-sm sm:text-base text-[var(--text-secondary)]">Manual copy-pasting from files is slow, scaling costs exponentially.</p>
                  </li>
                  <li className="flex items-start gap-3.5">
                    <XCircle className="h-5 w-5 text-red-500/70 mt-0.5 shrink-0" />
                    <p className="text-sm sm:text-base text-[var(--text-secondary)]">Rigid regex and zonal template systems break down on minor layout updates.</p>
                  </li>
                  <li className="flex items-start gap-3.5">
                    <XCircle className="h-5 w-5 text-red-500/70 mt-0.5 shrink-0" />
                    <p className="text-sm sm:text-base text-[var(--text-secondary)]">Data entries lack direct visual verification pipelines, yielding hidden errors.</p>
                  </li>
                </ul>
              </div>

              {/* The Intelligent Solution */}
              <div className="rounded-3xl p-8 bg-[var(--bg-card)] border border-emerald-500/20 dark:border-emerald-500/10 relative overflow-hidden group shadow-[0_15px_40px_var(--dashboard-shadow)]">
                <div className="absolute top-0 right-0 p-6 opacity-5 text-emerald-500 group-hover:opacity-10 transition-opacity duration-300">
                  <CheckCircle2 className="h-32 w-32" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/25">
                    <Zap className="h-5 w-5 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">The Intelligent Solution</h3>
                </div>
                <ul className="mt-8 space-y-5">
                  <li className="flex items-start gap-3.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-sm sm:text-base text-[var(--text-secondary)]">AI automatically maps documents to custom data schemas in seconds.</p>
                  </li>
                  <li className="flex items-start gap-3.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-sm sm:text-base text-[var(--text-secondary)]">Adaptive models understand semantic meaning, ignoring spatial layout shifts.</p>
                  </li>
                  <li className="flex items-start gap-3.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-sm sm:text-base text-[var(--text-secondary)]">Direct page side-by-side verification tools keep database extraction audit-ready.</p>
                  </li>
                </ul>
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
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-indigo-500 dark:text-indigo-400">Step-by-step pipeline</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">How NeuroDocs Operates</h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)]">
                A seamless sequence connecting your raw file upload to a clean, actionable data endpoint.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {pipeline.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.article
                    key={step.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className={cardClass}
                  >
                    <div className="absolute top-4 right-4 text-xs font-bold text-slate-400/20 dark:text-slate-500/20">
                      0{index + 1}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-300/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-indigo-500 dark:text-indigo-300" />
                    </div>
                    <h3 className="mt-6 text-lg font-bold text-[var(--text-primary)]">{step.label}</h3>
                    <p className="mt-2.5 leading-relaxed text-sm text-[var(--text-secondary)]">{step.description}</p>
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
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">The Technology Stack</h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)]">
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
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">Who Uses NeuroDocs</h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)]">
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
