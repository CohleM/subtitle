// src/components/Features.tsx
import { Zap, Palette, Globe, Sparkles } from 'lucide-react'

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
        icon: Globe,
        title: '48 languages',
        description: 'Automatic transcription and translation. Reach global audiences effortlessly.'
    },
    {
        icon: Sparkles,
        title: 'Auto-sync',
        description: 'Perfect timing, every time. AI matches captions to speech with frame-level precision.'
    }
]

export function Features() {
    return (
        <section id="features" className="py-24 px-6 bg-gray-50/50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Features</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
                        Everything you need
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="group p-8 bg-white rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all"
                        >
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-black mb-3">{feature.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}