// src/components/Navbar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tight text-[var(--color-text)]">
                    SubtitleAI
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                        Features
                    </Link>
                    <Link href="#how-it-works" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                        How it works
                    </Link>
                    <Link href="#pricing" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                        Pricing
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="hidden md:block text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/editor"
                        className="px-5 py-2.5 bg-[var(--color-primary)] text-[var(--color-bg)] text-sm font-medium rounded-xl hover:bg-[var(--color-primary-hover)] active:scale-[0.98] transition-all"
                    >
                        Try for free
                    </Link>
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2"
                >
                    <div className="w-5 h-0.5 bg-[var(--color-text)] mb-1.5"></div>
                    <div className="w-5 h-0.5 bg-[var(--color-text)] mb-1.5"></div>
                    <div className="w-5 h-0.5 bg-[var(--color-text)]"></div>
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-4 space-y-4">
                    <Link href="#features" className="block text-sm text-[var(--color-text-muted)]">Features</Link>
                    <Link href="#how-it-works" className="block text-sm text-[var(--color-text-muted)]">How it works</Link>
                    <Link href="#pricing" className="block text-sm text-[var(--color-text-muted)]">Pricing</Link>
                    <Link href="/login" className="block text-sm text-[var(--color-text-muted)]">Log in</Link>
                </div>
            )}
        </nav>
    )
}