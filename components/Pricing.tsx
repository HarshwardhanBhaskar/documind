'use client';

import { motion } from 'framer-motion';
import { Check, Star, Zap } from 'lucide-react';

const plans = [
    {
        name: 'Starter',
        price: 'Free',
        description: 'Perfect for individuals and side projects.',
        features: [
            'Up to 50 documents/month',
            'Basic PDF Utilities',
            'Standard OCR extraction',
            'Community support',
        ],
        cta: 'Start for free',
        popular: false,
        icon: Star
    },
    {
        name: 'Pro',
        price: '$29',
        period: '/month',
        description: 'For power users and small teams.',
        features: [
            'Up to 1,000 documents/month',
            'Advanced AI Classification',
            'Priority OCR processing',
            'Smart Field Extraction',
            'Email support'
        ],
        cta: 'Upgrade to Pro',
        popular: true,
        icon: Zap
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For growing businesses with high volume.',
        features: [
            'Unlimited documents',
            'Custom AI Models',
            'Dedicated account manager',
            'API Access',
            'SLA guarantee'
        ],
        cta: 'Contact Sales',
        popular: false,
        icon: undefined
    }
];

export default function Pricing() {
    return (
        <section id="pricing" className="pt-24 pb-16 relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] mb-6 bg-[var(--bg-card)] shadow-xs"
                    >
                        <span className="text-sm font-semibold" style={{ color: 'var(--indigo)' }}>
                            Simple Pricing
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        Scale intelligence, <br className="hidden md:block" />
                        <span style={{ color: 'var(--text-secondary)' }}>not your budget.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        Transparent pricing for teams of all sizes. Start for free, upgrade when you need to process more documents.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className={`relative p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.02] shadow-sm ${
                                plan.popular 
                                    ? 'bg-gradient-to-b from-indigo-50/20 to-transparent border-indigo-500/30 shadow-[0_20px_50px_rgba(99,102,241,0.08)]' 
                                    : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-indigo-200'
                            }`}
                            style={{ backdropFilter: 'blur(20px)' }}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-indigo-600/10">
                                    Most Popular
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-4">
                                {plan.icon && <plan.icon className={`w-5 h-5 ${plan.popular ? 'text-indigo-600' : 'text-slate-500'}`} />}
                                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
                            </div>
                            
                            <p className="text-sm mb-6 min-h-[40px]" style={{ color: 'var(--text-secondary)' }}>
                                {plan.description}
                            </p>

                            <div className="mb-8">
                                <span className="text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>{plan.price}</span>
                                {plan.period && <span className="ml-1 text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>{plan.period}</span>}
                            </div>

                            <ul className="space-y-4 mb-8 min-h-[200px]">
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <div className={`mt-1 shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${plan.popular ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                                            <Check className="w-2.5 h-2.5" />
                                        </div>
                                        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <a href="#demo"
                                className={`block w-full py-3 px-4 rounded-xl text-center text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                    plan.popular
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/10'
                                        : 'bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-slate-50 border border-[var(--border)] shadow-xs'
                                }`}
                            >
                                {plan.cta}
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
