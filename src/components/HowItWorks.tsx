// src/components/HowItWorks.tsx
const steps = [
    {
        number: '01',
        title: 'Upload your video',
        description: 'Drop any video file. We support all major sizes i.e landscape, portrait videos up to 1080p'
    },
    {
        number: '02',
        title: 'Pick a style',
        description: 'Choose from our curated collection of subtitle styles. Preview instantly in the player.'
    },
    {
        number: '03',
        title: 'Fine-tune',
        description: 'Edit text, adjust timing, or customize colors. Full control with zero complexity.'
    },
    {
        number: '04',
        title: 'Export',
        description: 'Download your video with baked-in subtitles in seconds.'
    }
]

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 px-6 bg-[var(--color-bg)]">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <p className="text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-widest mb-4">How it works</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] tracking-tight mb-6">
                            Simple as it should be
                        </h2>
                        <p className="text-[var(--color-text-muted)] text-lg leading-relaxed">
                            No complicated timelines or steep learning curves. Get professional results in four simple steps.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {steps.map((step) => (
                            <div key={step.number} className="flex gap-6 group">
                                <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-bg-secondary)] rounded-2xl flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors">
                                    <span className="text-sm font-bold text-[var(--color-text-light)] group-hover:text-[var(--color-bg)] transition-colors">
                                        {step.number}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">{step.title}</h3>
                                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}