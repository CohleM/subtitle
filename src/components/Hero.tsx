// src/components/Hero.tsx
'use client'

import Link from 'next/link'

export function Hero() {
    return (
        <section className="pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 mb-8">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Now with AI-powered styling
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black mb-6 leading-[1.1]">
                    Stunning subtitles
                    <br />
                    <span className="text-gray-400">in seconds</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Professional, animated captions that make your videos stand out.
                    No editing skills required—just upload and let AI do the magic.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/editor"
                        className="w-full sm:w-auto px-8 py-4 bg-black text-white text-sm font-semibold uppercase tracking-wider rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all"
                    >
                        Start creating free
                    </Link>
                    <button
                        onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                        className="w-full sm:w-auto px-8 py-4 bg-white text-black text-sm font-semibold uppercase tracking-wider rounded-2xl border border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all"
                    >
                        See demo
                    </button>
                </div>

                <div className="mt-16 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none h-32 bottom-0"></div>
                    <div className="relative bg-gray-100 rounded-3xl border border-gray-200 overflow-hidden aspect-video max-w-4xl mx-auto shadow-2xl">
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-black rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-400 font-medium">Video preview</p>
                            </div>
                        </div>
                        {/* Mock subtitle overlay */}
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/90 px-6 py-3 rounded-xl">
                            <p className="text-white text-lg font-bold tracking-wide">
                                This is how your subtitles will look ✨
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}