// src/components/HowItWorks.tsx
const steps = [
    {
        number: '01',
        title: 'Upload your video',
        description: 'Drop any video file or paste a YouTube link. We support all major formats up to 4K.'
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
        description: 'Download your video with baked-in subtitles or export as SRT/VTT for flexibility.'
    }
]

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">How it works</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-6">
                            Simple as it should be
                        </h2>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            No complicated timelines or steep learning curves. Get professional results in four simple steps.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex gap-6 group">
                                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-black transition-colors">
                                    <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">
                                        {step.number}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-black mb-2">{step.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}