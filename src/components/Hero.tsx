// src/components/Hero.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const styles = [
    {
        id: 'gradient',
        name: 'Gradient base',
        description: 'Eye-catching gradient text with bold typography that pops off the screen',
        video: '/landing-page-videos/GB.mp4',
    },
    {
        id: 'Combo',
        name: 'Combo',
        description: 'Dynamic multi-style captions that add visual rhythm to your content',
        video: '/landing-page-videos/Combo.mp4',
    },
    {
        id: 'Glow',
        name: 'Glow',
        description: 'Elegant italic text with a subtle glow for a premium, cinematic feel',
        video: '/landing-page-videos/GlowI.mp4',
    },
]

export function Hero() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        // Auto-rotate every 7 seconds
        intervalRef.current = setInterval(() => {
            setIsTransitioning(true)
            setTimeout(() => {
                setActiveIndex((prev) => (prev + 1) % styles.length)
                setIsTransitioning(false)
            }, 300)
        }, 7000)

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [])

    useEffect(() => {
        // Play video when active index changes
        if (videoRef.current) {
            videoRef.current.load()
            videoRef.current.play().catch(() => {
                // Auto-play might be blocked, that's okay
            })
        }
    }, [activeIndex])

    const handleStyleClick = (index: number) => {
        if (index === activeIndex) return

        if (intervalRef.current) clearInterval(intervalRef.current)
        setIsTransitioning(true)
        setTimeout(() => {
            setActiveIndex(index)
            setIsTransitioning(false)
        }, 300)

        // Restart auto-rotation
        intervalRef.current = setInterval(() => {
            setIsTransitioning(true)
            setTimeout(() => {
                setActiveIndex((prev) => (prev + 1) % styles.length)
                setIsTransitioning(false)
            }, 300)
        }, 7000)
    }

    const activeStyle = styles[activeIndex]

    return (
        <section className="pt-32 pb-20 px-6 bg-[var(--color-bg)] min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-secondary)] rounded-full border border-[var(--color-border)]">
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
                            href="/authentication"
                            className="w-full sm:w-auto px-8 py-4 bg-[var(--color-primary)] text-[var(--color-bg)] text-sm font-semibold uppercase tracking-wider rounded-2xl hover:bg-[var(--color-primary-hover)] active:scale-[0.98] transition-all"
                        >
                            Start creating free
                        </Link>
                        {/* <button
                            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-4 bg-[var(--color-bg-card)] text-[var(--color-text)] text-sm font-semibold uppercase tracking-wider rounded-2xl border border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] active:scale-[0.98] transition-all"
                        >
                            See demo
                        </button> */}
                    </div>
                </div>

                {/* Video Player + Styles Grid */}
                <div className="grid lg:grid-cols-2  items-start my-32"> {/* Reduced gap from gap-8 to gap-4 */}
                    {/* Left: Video Player */}
                    <div className="relative "> {/* Added vertical margins */}
                        <div className="relative bg-[var(--color-bg-secondary)] rounded-3xl border border-[var(--color-border)] overflow-hidden shadow-2xl mx-auto"
                            style={{ height: 'calc(100vh - 180px)', aspectRatio: '9/16', maxWidth: '100%' }}>
                            {/* Video */}
                            <video
                                ref={videoRef}
                                key={activeStyle.video}
                                src={activeStyle.video}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className={`w-full h-full object-cover transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                            />

                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>

                            {/* Progress indicator */}
                            <div className="absolute top-4 left-4 right-4 flex gap-2">
                                {styles.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden"
                                    >
                                        <div
                                            className={`h-full bg-white rounded-full transition-all duration-100 ${idx === activeIndex ? 'w-full' : idx < activeIndex ? 'w-full' : 'w-0'}`}
                                            style={{
                                                transitionDuration: idx === activeIndex ? '7000ms' : '300ms',
                                                transitionTimingFunction: idx === activeIndex ? 'linear' : 'ease-out',
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Style badge */}
                            <div className="absolute bottom-4 left-4">
                                <div className="px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full">
                                    <span className="text-xs font-medium text-white">
                                        {activeStyle.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Style Cards */}
                    <div className="flex flex-col gap-4 lg:pt-12 mt-8">
                        {styles.map((style, index) => {
                            const isActive = index === activeIndex
                            return (
                                <button
                                    key={style.id}
                                    onClick={() => handleStyleClick(index)}
                                    className={`group relative w-full text-left p-6 rounded-2xl border transition-all duration-300 ${isActive
                                        ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] border-[var(--color-primary)] scale-[1.02] shadow-lg shadow-[var(--color-primary)]/20'
                                        : 'bg-[var(--color-bg-card)] border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] hover:border-[var(--color-border-hover)]'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className={`text-lg font-bold mb-1 ${isActive ? 'text-white' : 'text-[var(--color-text)]'}`}>
                                                {style.name}
                                            </h3>
                                            <p className={`text-sm ${isActive ? 'text-white/80' : 'text-[var(--color-text-muted)]'}`}>
                                                {style.description}
                                            </p>
                                        </div>

                                        {/* Active indicator */}
                                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${isActive ? 'bg-white scale-100' : 'bg-[var(--color-border)] scale-75'}`}>
                                            {isActive && (
                                                <div className="w-full h-full rounded-full bg-white animate-ping opacity-75"></div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Active state glow */}
                                    {isActive && (
                                        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] opacity-20 blur-xl -z-10"></div>
                                    )}
                                </button>
                            )
                        })}

                        {/* "Many more" indicator */}
                        <div className="relative mt-2">
                            <div className="flex items-center justify-center gap-3">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent"></div>
                                <span className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                    And many more
                                </span>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent"></div>
                            </div>
                        </div>

                        {/* Helper text */}
                        {/* <p className="text-center text-sm text-[var(--color-text-muted)] mt-4">
                            Click a style to preview, or wait for auto-rotation
                        </p> */}
                    </div>
                </div>
            </div>
        </section>
    )
}