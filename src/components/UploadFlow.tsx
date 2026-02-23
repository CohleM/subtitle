'use client';
import { useState, useCallback } from 'react';
import { Sparkles, ArrowRight, Check, Globe } from 'lucide-react';
import { styles, categories } from "../config/styleConfigs"

const languages: Record<string, string> = {
    "Afrikaans": "af",
    "Arabic": "ar",
    "Armenian": "hy",
    "Azerbaijani": "az",
    "Belarusian": "be",
    "Bosnian": "bs",
    "Bulgarian": "bg",
    "Catalan": "ca",
    "Chinese": "zh",
    "Croatian": "hr",
    "Czech": "cs",
    "Danish": "da",
    "Dutch": "nl",
    "English": "en",
    "Estonian": "et",
    "Finnish": "fi",
    "French": "fr",
    "Galician": "gl",
    "German": "de",
    "Greek": "el",
    "Hebrew": "he",
    "Hindi": "hi",
    "Hungarian": "hu",
    "Icelandic": "is",
    "Indonesian": "id",
    "Italian": "it",
    "Japanese": "ja",
    "Kannada": "kn",
    "Kazakh": "kk",
    "Korean": "ko",
    "Latvian": "lv",
    "Lithuanian": "lt",
    "Macedonian": "mk",
    "Malay": "ms",
    "Marathi": "mr",
    "Maori": "mi",
    "Nepali": "ne",
    "Norwegian": "no",
    "Persian": "fa",
    "Polish": "pl",
    "Portuguese": "pt",
    "Romanian": "ro",
    "Russian": "ru",
    "Serbian": "sr",
    "Slovak": "sk",
    "Slovenian": "sl",
    "Spanish": "es",
    "Swahili": "sw",
    "Swedish": "sv",
    "Tagalog": "tl",
    "Tamil": "ta",
    "Thai": "th",
    "Turkish": "tr",
    "Ukrainian": "uk",
    "Urdu": "ur",
    "Vietnamese": "vi",
    "Welsh": "cy"
};

export const UploadFlow: React.FC<{
    videoUrl: string;
    videoFileName: string;
    onComplete: (videoUrl: string, selectedStyle: string, languageCode: string) => void;
    onCancel?: () => void;
}> = ({ videoUrl, videoFileName, onComplete, onCancel }) => {
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string>("");
    const [activeCategory, setActiveCategory] = useState<typeof categories[number]>('All');
    const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);

    const handleGenerate = useCallback(() => {
        if (videoUrl && selectedStyle && selectedLanguage) {
            const languageCode = languages[selectedLanguage];
            onComplete(videoUrl, selectedStyle, languageCode);
        }
    }, [videoUrl, selectedStyle, selectedLanguage, onComplete]);

    const filteredStyles = activeCategory === 'All'
        ? styles
        : styles.filter(s => s.category === activeCategory);

    const canGenerate = selectedStyle && selectedLanguage;

    console.log('selected style gg', selectedStyle)
    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-white shrink-0 border-b border-gray-200">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {onCancel && (
                                <button
                                    onClick={onCancel}
                                    className="p-1.5 -ml-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-black"
                                >
                                    <ArrowRight className="w-4 h-4 rotate-180" />
                                </button>
                            )}
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-sm font-semibold text-gray-900">Select Style</h1>
                                    <p className="text-xs text-gray-500">Choose a caption style</p>
                                </div>
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={!canGenerate}
                            className={`
                                flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-medium uppercase tracking-wider
                                transition-all duration-200
                                ${canGenerate
                                    ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-text-light)]'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }
                            `}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Generate
                        </button>
                    </div>
                </div>
            </div>

            {/* Video Preview Strip with Language Selection */}
            {videoUrl && (
                <div className="px-6 py-3 bg-white shrink-0 border-b border-gray-200">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Language Selection - Required */}


                        {/* Video Info */}
                        <div className="flex items-center gap-3">
                            <div className="w-16 aspect-video bg-black rounded-lg overflow-hidden relative">
                                <video
                                    src={videoUrl}
                                    className="w-full h-full object-cover"
                                    muted
                                    playsInline
                                />
                                <div className="absolute inset-0 bg-black/20" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 truncate">
                                    {videoFileName || 'Untitled Video'}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">
                                    Ready to generate
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center border border-gray-200">
                                <Globe className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="language-select" className="block text-xs font-semibold text-gray-900 uppercase tracking-wider">
                                    Video Language <span className="text-red-500">*</span>
                                </label>
                                <p className="text-[10px] text-gray-500">Select the language spoken in your video</p>
                            </div>
                            <select
                                id="language-select"
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className={`
                                    block w-48 rounded-lg border py-2 px-3 text-xs focus:ring-2 focus:ring-black focus:border-black
                                    ${!selectedLanguage ? 'border-red-300 bg-red-50 text-gray-500' : 'border-gray-300 bg-white text-gray-900'}
                                `}
                            >
                                <option value="" disabled>Select language...</option>
                                {Object.keys(languages).sort().map((lang) => (
                                    <option key={lang} value={lang}>
                                        {lang}
                                    </option>
                                ))}
                            </select>
                            {selectedLanguage && (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 rounded-md">
                                    <Check className="w-3 h-3" />
                                    <span className="text-[10px] font-medium uppercase tracking-wider">{languages[selectedLanguage]}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Category Tabs */}
            <div className="px-6 py-3 bg-white shrink-0 border-b border-gray-200">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-1 overflow-x-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`
                                    px-3 py-1 text-[10px] font-medium uppercase tracking-wider rounded-lg 
                                    transition-all whitespace-nowrap
                                    ${activeCategory === cat
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'text-gray-500 hover:text-black hover:bg-gray-100'
                                    }
                                `}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Styles Grid */}
            <div className="flex-1 overflow-y-auto px-6 py-6 bg-white">
                <div className="grid grid-cols-4 gap-3 max-w-4xl mx-auto">
                    {filteredStyles.map((style) => {
                        const isSelected = selectedStyle === style.id;
                        const isHovered = hoveredStyle === style.id;

                        return (
                            <div
                                key={style.id}
                                className="relative aspect-video"
                                onMouseEnter={() => setHoveredStyle(style.id)}
                                onMouseLeave={() => setHoveredStyle(null)}
                            >
                                <button
                                    onClick={() => setSelectedStyle(style.id)}
                                    className={`
                                        w-full h-full relative group bg-gray-200 rounded-xl overflow-hidden 
                                        border-2 transition-all duration-200
                                        ${isSelected
                                            ? 'border-black ring-2 ring-black ring-offset-2 scale-[1.02]'
                                            : 'border-transparent hover:border-gray-300 hover:scale-[1.02]'
                                        }
                                    `}
                                >
                                    {/* Preview Placeholder */}
                                    {/* Preview */}
                                    <div className="absolute inset-0 bg-gray-200">
                                        <img
                                            src={isHovered ? `/previews/${style.id}.gif` : `/previews/png/${style.id}.png`}
                                            alt={style.name}
                                            className="w-full h-full object-cover"
                                        />

                                    </div>

                                    {/* Badges */}
                                    <div className="absolute top-2 left-2 flex gap-1.5">
                                        {style.isNew && (
                                            <span className="px-1 py-0.5 bg-orange-500 text-white text-[8px] font-bold uppercase tracking-wider rounded shadow-sm">
                                                New
                                            </span>
                                        )}
                                        {style.isPremium && (
                                            <div className="w-4 h-4 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                                                <Sparkles className="w-2.5 h-2.5 text-orange-500 fill-orange-500" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Selected Indicator */}
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-5 h-5 bg-black rounded-full flex items-center justify-center text-white shadow-lg animate-in zoom-in duration-200">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}

                                    {/* Hover Overlay */}
                                    {!isSelected && isHovered && (
                                        <div className="absolute inset-0 bg-black/5 transition-colors" />
                                    )}
                                </button>
                                <p className={`
        mt-1.5 text-[10px] font-bold text-center uppercase tracking-wider truncate
        ${isSelected ? 'text-black' : 'text-gray-500'}
    `}>
                                    {style.name}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Bar - Selected Style Info */}
            {selectedStyle && (
                <div className="px-6 py-3 bg-white shrink-0 border-t border-gray-200 animate-in slide-in-from-bottom duration-200">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Check className="w-4 h-4 text-black" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Selected Style</p>
                                    <p className="text-xs font-semibold text-gray-900">
                                        {styles.find(s => s.id === selectedStyle)?.name}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleGenerate}
                                disabled={!canGenerate}
                                className={`
                                    flex items-center gap-2 px-4 py-1.5 text-xs font-medium uppercase tracking-wider rounded-lg transition-colors
                                    ${canGenerate
                                        ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-text-light)]'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }
                                `}
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Generate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};