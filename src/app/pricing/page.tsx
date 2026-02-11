'use client';

import React, { useState, useEffect } from 'react';
import useLocalStorage from 'use-local-storage';
import { useSearchParams } from 'next/navigation';
import { Check, Loader2, X } from 'lucide-react';
import Link from 'next/link';

type PricingPlan = {
    name: string;
    price: string;
    period: string;
    features: string[];
    ctaText: string;
    ctaLink: string;
    highlighted?: boolean;
    planType: 'free' | 'premium' | 'ultra';
};

const pricingPlans: PricingPlan[] = [
    {
        name: 'Free',
        price: '$0',
        period: '/month',
        features: [
            '1 short per month',
            '2 days data retention',
            '720p export',
            '50 MB upload',
            'Watermark included',
        ],
        ctaText: 'Get started',
        ctaLink: '/editor',
        planType: 'free',
    },
    {
        name: 'Premium',
        price: '$19',
        period: '/month',
        features: [
            '25 shorts per month',
            '30 days retention',
            '1080p export',
            '2 GB upload',
            'No watermark',
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
        features: [
            '50 shorts per month',
            '30 days retention',
            '1080p export',
            '2 GB upload',
            'No watermark',
        ],
        ctaText: 'Upgrade',
        ctaLink: '',
        highlighted: true,
        planType: 'ultra',
    },
];

export default function PricingPage() {
    const [accessToken] = useLocalStorage('access_token', '');
    const [loadingPlan, setLoadingPlan] = useState<'premium' | 'ultra' | null>(null);
    const [checkoutLinks, setCheckoutLinks] = useState<{ premium: string; ultra: string }>({ premium: '', ultra: '' });
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const canceled = searchParams.get('canceled');
        if (canceled === 'true') {
            setError('Payment was canceled. You can try again when ready.');
        }
    }, [searchParams]);

    const handleUpgradeClick = async (planType: 'premium' | 'ultra') => {
        setError(null);

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
        <div className="min-h-screen bg-white">
            <div className="max-w-screen-lg mx-auto px-6 py-20">
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
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

                <div className="text-center mb-12">
                    <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                        Pricing
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Simple and easy pricing
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {pricingPlans.map((plan) => {
                        const isFree = plan.planType === 'free';
                        const isLoading = loadingPlan === plan.planType;

                        return (
                            <div
                                key={plan.name}
                                className={`
                                    flex flex-col p-6 rounded-2xl border bg-white
                                    ${plan.highlighted
                                        ? 'border-gray-200 shadow-sm'
                                        : 'border-gray-100'
                                    }
                                `}
                            >
                                <h3 className="mb-4 text-sm font-semibold text-gray-900">
                                    {plan.name}
                                </h3>

                                <div className="flex items-baseline mb-6">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {plan.price}
                                    </span>
                                    <span className="ml-1 text-xs text-gray-400">
                                        {plan.period}
                                    </span>
                                </div>

                                {isFree ? (
                                    <Link
                                        href={plan.ctaLink}
                                        className="
                                            mb-6 w-full py-2.5 px-4 rounded-lg text-xs font-medium uppercase tracking-wider
                                            text-center transition-all bg-gray-100 text-gray-900 hover:bg-gray-200
                                        "
                                    >
                                        {plan.ctaText}
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => handleUpgradeClick(plan.planType as 'premium' | 'ultra')}
                                        disabled={isLoading}
                                        className={`
                                            mb-6 w-full py-2.5 px-4 rounded-lg text-xs font-medium uppercase tracking-wider
                                            text-center transition-all
                                            ${plan.highlighted
                                                ? 'bg-gray-900 text-white hover:bg-gray-800'
                                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                            }
                                            disabled:opacity-50 disabled:cursor-wait
                                        `}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                        ) : (
                                            plan.ctaText
                                        )}
                                    </button>
                                )}

                                <ul className="space-y-3">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                                            <Check className="w-3.5 h-3.5 text-gray-400" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}