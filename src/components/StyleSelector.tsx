// src/app/components/StyleSelector.tsx
'use client';

import { SubtitleStyle } from '../../types/style';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

const styles: SubtitleStyle[] = [
    { id: 'matt', name: 'Matt', category: 'New', isNew: true },
    { id: 'jess', name: 'Jess', category: 'Trend', isNew: true },
    { id: 'jack', name: 'Jack', category: 'New', isNew: true },
    { id: 'nick', name: 'Nick', category: 'New', isNew: true },
    { id: 'laura', name: 'Laura', category: 'Trend' },
    { id: 'kelly2', name: 'Kelly 2', category: 'Premium', isPremium: true },
    { id: 'caleb', name: 'Caleb', category: 'All' },
    { id: 'kendrick', name: 'Kendrick', category: 'Trend' },
    { id: 'lewis', name: 'Lewis', category: 'Premium', isPremium: true },
    { id: 'doug', name: 'Doug', category: 'All' },
    { id: 'carlos', name: 'Carlos', category: 'All' },
    { id: 'luke', name: 'Luke', category: 'Speakers' },
    { id: 'mark', name: 'Mark', category: 'Premium', isPremium: true },
    { id: 'sara', name: 'Sara', category: 'Premium', isPremium: true },
    { id: 'daniel', name: 'Daniel', category: 'Premium', isPremium: true },
    { id: 'dan2', name: 'Dan 2', category: 'All' },
    { id: 'hormozi4', name: 'Hormozi 4', category: 'Trend', isPremium: true },
    { id: 'basic', name: 'Basic ThreeLines', category: 'All' },
];

const categories = ['All', 'Trend', 'New', 'Premium', 'Emoji', 'Speakers'] as const;

export const StyleSelector: React.FC<{
    selectedStyle: string;
    onStyleSelect: (styleId: string) => void;
}> = ({ selectedStyle, onStyleSelect }) => {
    const [activeCategory, setActiveCategory] = useState<typeof categories[number]>('All');

    const filteredStyles = activeCategory === 'All'
        ? styles
        : styles.filter(s => s.category === activeCategory);

    return (
        <div className="h-full flex flex-col bg-gray-50/30">
            {/* Category Tabs - SMALLER FONT */}
            <div className="flex items-center gap-1 px-8 py-4 border-b border-gray-200 bg-white shrink-0">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider rounded-lg transition-all ${activeCategory === cat
                            ? 'bg-black text-white'
                            : 'text-gray-500 hover:text-black hover:bg-gray-100'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Styles Grid - SMALLER FONT */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-3 gap-4">
                    {filteredStyles.map((style) => (
                        <button
                            key={style.id}
                            onClick={() => onStyleSelect(style.id)}
                            className={`relative group aspect-video bg-gray-200 rounded-2xl overflow-hidden border-2 transition-all hover:scale-[1.02] ${selectedStyle === style.id
                                ? 'border-black ring-2 ring-black ring-offset-2'
                                : 'border-transparent hover:border-gray-300'
                                }`}
                        >
                            {/* Preview Placeholder - SMALLER TEXT */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-300 group-hover:bg-gray-200 transition-colors">
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    {style.name}
                                </span>
                            </div>

                            {/* Badges - SMALLER TOO */}
                            <div className="absolute top-3 left-3 flex gap-2">
                                {style.isNew && (
                                    <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[9px] font-bold uppercase tracking-wider rounded">
                                        New
                                    </span>
                                )}
                                {style.isPremium && (
                                    <Sparkles className="w-3 h-3 text-orange-500 fill-orange-500" />
                                )}
                            </div>

                            {/* Selected Indicator - SMALLER CHECK ICON */}
                            {selectedStyle === style.id && (
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};