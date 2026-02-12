// src/components/Navbar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tight text-black">
                    SubtitleAI
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm text-gray-600 hover:text-black transition-colors">
                        Features
                    </Link>
                    <Link href="#how-it-works" className="text-sm text-gray-600 hover:text-black transition-colors">
                        How it works
                    </Link>
                    <Link href="#pricing" className="text-sm text-gray-600 hover:text-black transition-colors">
                        Pricing
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="hidden md:block text-sm font-medium text-gray-600 hover:text-black transition-colors"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/editor"
                        className="px-5 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all"
                    >
                        Try for free
                    </Link>
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2"
                >
                    <div className="w-5 h-0.5 bg-black mb-1.5"></div>
                    <div className="w-5 h-0.5 bg-black mb-1.5"></div>
                    <div className="w-5 h-0.5 bg-black"></div>
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-4">
                    <Link href="#features" className="block text-sm text-gray-600">Features</Link>
                    <Link href="#how-it-works" className="block text-sm text-gray-600">How it works</Link>
                    <Link href="#pricing" className="block text-sm text-gray-600">Pricing</Link>
                    <Link href="/login" className="block text-sm text-gray-600">Log in</Link>
                </div>
            )}
        </nav>
    )
}