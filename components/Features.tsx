'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Database, FileStack, Minimize2, RefreshCcw, ScanText, ShieldCheck, Tags, Workflow } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ToolModal, { ToolType } from '@/components/ToolModal';

type FeatureId = ToolType | 'review' | 'export' | 'audit';

interface FeatureItem {
  id: FeatureId;
  icon: LucideIcon;
  title: string;
  description: string;
  tag: string;
  interactive: boolean;
}

const features: FeatureItem[] = [
  { id: 'ocr', icon: ScanText, title: 'OCR and layout reading', description: 'Read scanned PDFs, images, and mixed layouts while preserving tables, labels, and section context.', tag: 'Capture', interactive: true },
  { id: 'ai', icon: Tags, title: 'Classification rules', description: 'Separate invoices, contracts, IDs, claims, statements, and custom document types automatically.', tag: 'Route', interactive: true },
  { id: 'extract', icon: Database, title: 'Structured extraction', description: 'Return clean JSON fields with confidence scores, source text, and validation status.', tag: 'Extract', interactive: true },
  { id: 'review', icon: Workflow, title: 'Human review queue', description: 'Send low-confidence fields to review before data reaches your accounting, CRM, or operations tools.', tag: 'Control', interactive: false },
  { id: 'audit', icon: ShieldCheck, title: 'Audit-ready history', description: 'Track each document, reviewer action, field edit, and export event in one searchable record.', tag: 'Govern', interactive: false },
  { id: 'merge', icon: FileStack, title: 'PDF workspace tools', description: 'Merge, compress, and convert files without leaving the workflow your team already uses.', tag: 'Prepare', interactive: true },
];

const utilityTools: FeatureItem[] = [
  { id: 'compress', icon: Minimize2, title: 'Compress files', description: 'Reduce large PDFs for email and upload limits.', tag: 'Utility', interactive: true },
  { id: 'convert', icon: RefreshCcw, title: 'Convert pages', description: 'Turn PDF pages into clean image exports.', tag: 'Utility', interactive: true },
];

function isToolType(id: FeatureId): id is ToolType {
  return id === 'merge' || id === 'compress' || id === 'convert' || id === 'ocr' || id === 'ai' || id === 'extract';
}

export default function Features() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<{ id: ToolType; title: string; desc: string } | null>(null);

  const openTool = (feature: FeatureItem) => {
    if (!feature.interactive || !isToolType(feature.id)) return;
    setSelectedTool({ id: feature.id, title: feature.title, desc: feature.description });
    setModalOpen(true);
  };

  return (
    <section id="features" className="border-b border-[var(--border)] bg-[var(--bg)] py-20">
      <div id="tools" className="absolute -mt-24" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-blue-700">Platform capabilities</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight text-[var(--text-primary)]">
              Everything around document intelligence, not just the AI step.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[var(--text-secondary)]">
            Use the core pipeline for production work, and keep lightweight file utilities close by for everyday document handling.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...features, ...utilityTools].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={`${feature.id}-${feature.title}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.35, delay: index * 0.03 }}
                onClick={() => openTool(feature)}
                className={`group rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs transition ${feature.interactive ? 'cursor-pointer hover:border-blue-300 hover:shadow-md' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{feature.tag}</span>
                </div>
                <h3 className="mt-5 text-base font-semibold text-[var(--text-primary)]">{feature.title}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-[var(--text-secondary)]">{feature.description}</p>
                {feature.interactive && (
                  <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700">
                    Open tool
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>

      <ToolModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tool={selectedTool?.id || 'merge'}
        title={selectedTool?.title || ''}
        description={selectedTool?.desc || ''}
      />
    </section>
  );
}
