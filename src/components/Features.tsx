// src/components/Features.tsx
import { Zap, Palette, Sparkles, Edit3 } from 'lucide-react'

const features = [
    {
        icon: Zap,
        title: 'Lightning fast',
        description: 'Get professional subtitles in under 60 seconds. Our AI processes your video instantly.'
    },
    {
        icon: Palette,
        title: 'Beautiful styles',
        description: 'Choose from 10+ professionally designed caption styles. Customize colors, fonts, and animations.'
    },
    {
        icon: Edit3, // or Sliders
        title: 'Precise editing',
        description: 'Fine-tune timing, and adjust positioning with our intuitive editor.'
    },
    {
        icon: Sparkles,
        title: 'Auto-sync',
        description: 'Perfect timing, every time. AI matches captions to speech with frame-level precision.'
    }
]

export function Features() {
    return (
        <section id="features" className="py-24 px-6 bg-[var(--color-bg-secondary)]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-widest mb-4">Features</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] tracking-tight">
                        Everything you need
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="group p-8 bg-[var(--color-bg-card)] rounded-3xl border border-[var(--color-border)] hover:border-[var(--color-border)] hover:shadow-lg transition-all"
                        >
                            <div className="w-12 h-12 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6 text-[var(--color-bg)]" />
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">{feature.title}</h3>
                            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}