// src/components/Pricing.tsx
import Link from 'next/link'
import { Check } from 'lucide-react'

const plans = [
    {
        name: 'Free',
        price: '$0',
        description: 'Perfect for trying out',
        features: [
            '3 videos per month',
            '720p export quality',
            '5 subtitle styles',
            'Basic customization'
        ],
        cta: 'Get started',
        popular: false
    },
    {
        name: 'Pro',
        price: '$12',
        period: '/month',
        description: 'For content creators',
        features: [
            'Unlimited videos',
            '4K export quality',
            'All 15+ styles',
            'Advanced customization',
            'Priority processing',
            'No watermark'
        ],
        cta: 'Start free trial',
        popular: true
    },
    {
        name: 'Team',
        price: '$39',
        period: '/month',
        description: 'For agencies & teams',
        features: [
            'Everything in Pro',
            '5 team members',
            'Brand kits',
            'API access',
            'Dedicated support',
            'Custom integrations'
        ],
        cta: 'Contact sales',
        popular: false
    }
]

export function Pricing() {
    return (
        <section id="pricing" className="py-24 px-6 bg-[var(--color-bg-secondary)]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-widest mb-4">Pricing</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] tracking-tight mb-4">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-[var(--color-text-muted)]">Start free, upgrade when you need more</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative p-8 rounded-3xl border ${plan.popular
                                ? 'bg-[var(--color-primary)] text-[var(--color-bg)] border-[var(--color-primary)]'
                                : 'bg-[var(--color-bg-card)] text-[var(--color-text)] border-[var(--color-border)]'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="px-4 py-1.5 bg-[var(--color-bg)] text-[var(--color-text)] text-xs font-semibold uppercase tracking-wider rounded-full">
                                        Most popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                                <p className={`text-sm ${plan.popular ? 'text-[var(--color-bg)]/70' : 'text-[var(--color-text-muted)]'}`}>
                                    {plan.description}
                                </p>
                            </div>

                            <div className="mb-6">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                {plan.period && (
                                    <span className={`text-sm ${plan.popular ? 'text-[var(--color-bg)]/70' : 'text-[var(--color-text-muted)]'}`}>
                                        {plan.period}
                                    </span>
                                )}
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-sm">
                                        <Check className={`w-4 h-4 ${plan.popular ? 'text-[var(--color-bg)]' : 'text-[var(--color-primary)]'}`} />
                                        <span className={plan.popular ? 'text-[var(--color-bg)]/90' : 'text-[var(--color-text-muted)]'}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/editor"
                                className={`block w-full py-3 text-center text-sm font-semibold uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] ${plan.popular
                                    ? 'bg-[var(--color-bg)] text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]'
                                    : 'bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-primary-hover)]'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}