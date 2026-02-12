// src/components/Hero.tsx
'use client'

import Link from 'next/link'

export function Hero() {
    return (
        <section className="pt-32 pb-20 px-6 bg-[var(--color-bg)]">
            <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-secondary)] rounded-full border border-[var(--color-border)] mb-8">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                        Now with AI-powered styling
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--color-text)] mb-6 leading-[1.1]">
                    Stunning subtitles
                    <br />
                    <span className="text-[var(--color-text-light)]">in seconds</span>
                </h1>

                <p className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
                    Professional, animated captions that make your videos stand out.
                    No editing skills required—just upload and let AI do the magic.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/editor"
                        className="w-full sm:w-auto px-8 py-4 bg-[var(--color-primary)] text-[var(--color-bg)] text-sm font-semibold uppercase tracking-wider rounded-2xl hover:bg-[var(--color-primary-hover)] active:scale-[0.98] transition-all"
                    >
                        Start creating free
                    </Link>
                    <button
                        onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                        className="w-full sm:w-auto px-8 py-4 bg-[var(--color-bg-card)] text-[var(--color-text)] text-sm font-semibold uppercase tracking-wider rounded-2xl border border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] active:scale-[0.98] transition-all"
                    >
                        See demo
                    </button>
                </div>

                <div className="mt-16 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent z-10 pointer-events-none h-32 bottom-0"></div>
                    <div className="relative bg-[var(--color-bg-secondary)] rounded-3xl border border-[var(--color-border)] overflow-hidden aspect-video max-w-4xl mx-auto shadow-2xl">
                        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-secondary)]">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-[var(--color-primary)] rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-[var(--color-bg)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-[var(--color-text-light)] font-medium">Video preview</p>
                            </div>
                        </div>
                        {/* Mock subtitle overlay */}
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-[var(--color-primary)]/90 px-6 py-3 rounded-xl">
                            <p className="text-[var(--color-bg)] text-lg font-bold tracking-wide">
                                This is how your subtitles will look ✨
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}