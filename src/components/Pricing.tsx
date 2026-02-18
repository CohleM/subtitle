'use client';

import { useState, useEffect, Suspense } from 'react';
import useLocalStorage from 'use-local-storage';
import { useSearchParams } from 'next/navigation';
import { Check, Loader2, X } from 'lucide-react';
import Link from 'next/link';

type PricingPlan = {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    ctaText: string;
    ctaLink: string;
    highlighted?: boolean;
    planType: 'free' | 'premium' | 'ultra';
};

type PricingProps = {
    isLandingPage?: boolean;
};

const pricingPlans: PricingPlan[] = [
    {
        name: 'Free',
        price: '$0',
        period: '',
        description: 'Perfect for trying the editor and short clips',
        features: [
            '2 credits per month',
            'Export up to 1 minute total video',
            'Max 2 minutes per video',
            'Basic subtitles',
        ],
        ctaText: 'Get started',
        ctaLink: '/authentication',
        highlighted: false,
        planType: 'free',
    },
    {
        name: 'Premium',
        price: '$19',
        period: '/month',
        description: 'Best for consistent content creators',
        features: [
            '100 credits per month',
            'Export up to 50 minutes total video',
            'Max 2 minutes per video',
            '4K export quality',
            'All subtitle styles',
            'Advanced customization',
            'Priority processing',
            'No watermark'
        ],
        ctaText: 'Upgrade',
        ctaLink: '',
        highlighted: true,
        planType: 'premium',
    },
    {
        name: 'Ultra',
        price: '$39',
        period: '/month',
        description: 'For power users and long-form content',
        features: [
            '300 credits per month',
            'Export up to 150 minutes total video',
            'Max 10 minutes per video',
            '4K export quality',
            'All subtitle styles',
            'Advanced customization',
            'Priority processing',
            'No watermark'
        ],
        ctaText: 'Upgrade',
        ctaLink: '',
        highlighted: false,
        planType: 'ultra',
    },
];

// Separate the component that uses useSearchParams
function PricingContent({ isLandingPage = false }: PricingProps) {
    const [accessToken] = useLocalStorage('access_token', '');
    const [loadingPlan, setLoadingPlan] = useState<'premium' | 'ultra' | null>(null);
    const [checkoutLinks, setCheckoutLinks] = useState<{ premium: string; ultra: string }>({ premium: '', ultra: '' });
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Check if user is logged in
    const isLoggedIn = !!accessToken;

    useEffect(() => {
        const canceled = searchParams.get('canceled');
        if (canceled === 'true') {
            setError('Payment was canceled. You can try again when ready.');
        }
    }, [searchParams]);

    const handleUpgradeClick = async (planType: 'premium' | 'ultra') => {
        setError(null);

        // If on landing page and not logged in, redirect to login
        if (isLandingPage && !isLoggedIn) {
            window.location.href = '/authentication';
            return;
        }

        // If logged in, proceed with checkout
        if (checkoutLinks[planType]) {
            window.location.href = checkoutLinks[planType];
            return;
        }

        setLoadingPlan(planType);
        try {
            const response = await fetch(`${apiUrl}/payments/create-checkout-session`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to create checkout session');
            }

            const data = await response.json();
            const newLinks = {
                premium: data.premium || '',
                ultra: data.ultra || '',
            };
            setCheckoutLinks(newLinks);

            const targetUrl = newLinks[planType];
            if (targetUrl) {
                window.location.href = targetUrl;
            } else {
                throw new Error('Checkout URL not available');
            }
        } catch (err) {
            console.error('Error creating checkout session:', err);
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setLoadingPlan(null);
        }
    };

    const clearError = () => setError(null);

    return (
        <section id="pricing" className="py-24 px-6 bg-[var(--color-bg-secondary)]">
            <div className="max-w-6xl mx-auto">
                {error && (
                    <div className="mb-8 max-w-5xl mx-auto p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                        <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <p className="text-xs text-red-700">{error}</p>
                        </div>
                        <button
                            onClick={clearError}
                            className="text-red-400 hover:text-red-600"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-widest mb-4">
                        Pricing
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] tracking-tight mb-4">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-[var(--color-text-muted)]">Start free, upgrade when you need more</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {pricingPlans.map((plan) => {
                        const isFree = plan.planType === 'free';
                        const isLoading = loadingPlan === plan.planType;

                        return (
                            <div
                                key={plan.name}
                                className={`relative p-8 rounded-3xl border ${plan.highlighted
                                    ? 'bg-[var(--color-primary)] text-[var(--color-bg)] border-[var(--color-primary)]'
                                    : 'bg-[var(--color-bg-card)] text-[var(--color-text)] border-[var(--color-border)]'
                                    }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="px-4 py-1.5 bg-[var(--color-bg)] text-[var(--color-text)] text-xs font-semibold uppercase tracking-wider rounded-full">
                                            Most popular
                                        </span>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                                    <p className={`text-sm ${plan.highlighted ? 'text-[var(--color-bg)]/70' : 'text-[var(--color-text-muted)]'}`}>
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.period && (
                                        <span className={`text-sm ${plan.highlighted ? 'text-[var(--color-bg)]/70' : 'text-[var(--color-text-muted)]'}`}>
                                            {plan.period}
                                        </span>
                                    )}
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-sm">
                                            <Check className={`w-4 h-4 ${plan.highlighted ? 'text-[var(--color-bg)]' : 'text-[var(--color-primary)]'}`} />
                                            <span className={plan.highlighted ? 'text-[var(--color-bg)]/90' : 'text-[var(--color-text-muted)]'}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {isFree ? (
                                    <Link
                                        href={plan.ctaLink}
                                        className={`block w-full py-3 text-center text-sm font-semibold uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] ${plan.highlighted
                                            ? 'bg-[var(--color-bg)] text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]'
                                            : 'bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-primary-hover)]'
                                            }`}
                                    >
                                        {plan.ctaText}
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => handleUpgradeClick(plan.planType as 'premium' | 'ultra')}
                                        disabled={isLoading}
                                        className={`w-full py-3 text-center text-sm font-semibold uppercase tracking-wider rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait ${plan.highlighted
                                            ? 'bg-[var(--color-bg)] text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]'
                                            : 'bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-primary-hover)]'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                        ) : (
                                            plan.ctaText
                                        )}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// Loading fallback for Suspense
function PricingSkeleton() {
    return (
        <section className="py-24 px-6 bg-[var(--color-bg-secondary)]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <div className="h-3 w-16 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
                    <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
                    <div className="h-4 w-48 bg-gray-200 rounded mx-auto animate-pulse" />
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
                            <div className="h-6 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
                            <div className="h-4 w-full bg-gray-200 rounded mb-6 animate-pulse" />
                            <div className="h-10 w-24 bg-gray-200 rounded mb-6 animate-pulse" />
                            <div className="space-y-4 mb-8">
                                {[1, 2, 3, 4, 5].map((j) => (
                                    <div key={j} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                                ))}
                            </div>
                            <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Reusable Pricing component (can be used in landing page sections)
export function Pricing({ isLandingPage = false }: PricingProps) {
    return (
        <Suspense fallback={<PricingSkeleton />}>
            <PricingContent isLandingPage={isLandingPage} />
        </Suspense>
    );
}