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
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6"
                    >
                        <span className="text-sm font-medium bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Simple Pricing
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white"
                    >
                        Scale intelligence, <br className="hidden md:block" />
                        <span className="text-slate-400">not your budget.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-400"
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
                            className={`relative p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.02] ${
                                plan.popular 
                                    ? 'bg-gradient-to-b from-indigo-500/10 to-transparent border-indigo-500/30 shadow-[0_0_40px_-15px_rgba(99,102,241,0.3)]' 
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                            }`}
                            style={{ backdropFilter: 'blur(20px)' }}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-500 text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-indigo-500/20">
                                    Most Popular
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-4">
                                {plan.icon && <plan.icon className={`w-5 h-5 ${plan.popular ? 'text-indigo-400' : 'text-slate-400'}`} />}
                                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                            </div>
                            
                            <p className="text-sm text-slate-400 mb-6 min-h-[40px]">
                                {plan.description}
                            </p>

                            <div className="mb-8">
                                <span className="text-4xl font-bold text-white tracking-tight">{plan.price}</span>
                                {plan.period && <span className="text-slate-400 ml-1">{plan.period}</span>}
                            </div>

                            <ul className="space-y-4 mb-8 min-h-[200px]">
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <div className={`mt-1 shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${plan.popular ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/10 text-slate-300'}`}>
                                            <Check className="w-2.5 h-2.5" />
                                        </div>
                                        <span className="text-sm text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <a href="#demo"
                                className={`block w-full py-3 px-4 rounded-xl text-center text-sm font-semibold transition-all duration-200 ${
                                    plan.popular
                                        ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25'
                                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
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
