// src/components/StyleSelector.tsx
'use client';

// import { SubtitleStyle } from '../../types/style';
import { Sparkles, Pencil } from 'lucide-react';
import { useState } from 'react';
import { styles, categories } from "../config/styleConfigs"

// const styles: SubtitleStyle[] = [
//     { id: 'matt', name: 'Matt', category: 'New', isNew: true },
//     { id: 'ThreeLines', name: 'ThreeLines', category: 'Trend', isNew: true },
//     { id: 'jack', name: 'Jack', category: 'New', isNew: true },
//     { id: 'nick', name: 'Nick', category: 'New', isNew: true },
//     { id: 'laura', name: 'Laura', category: 'Trend' },
//     { id: 'kelly2', name: 'Kelly 2', category: 'Premium', isPremium: true },
//     { id: 'caleb', name: 'Caleb', category: 'All' },
//     { id: 'kendrick', name: 'Kendrick', category: 'Trend' },
//     { id: 'lewis', name: 'Lewis', category: 'Premium', isPremium: true },
//     { id: 'doug', name: 'Doug', category: 'All' },
//     { id: 'carlos', name: 'Carlos', category: 'All' },
//     { id: 'luke', name: 'Luke', category: 'Speakers' },
//     { id: 'mark', name: 'Mark', category: 'Premium', isPremium: true },
//     { id: 'sara', name: 'Sara', category: 'Premium', isPremium: true },
//     { id: 'daniel', name: 'Daniel', category: 'Premium', isPremium: true },
//     { id: 'dan2', name: 'Dan 2', category: 'All' },
//     { id: 'hormozi4', name: 'Hormozi 4', category: 'Trend', isPremium: true },
//     { id: 'basic', name: 'Basic ThreeLines', category: 'All' },
// ];

// const categories = ['All', 'Trend', 'New', 'Premium', 'Emoji', 'Speakers'] as const;

export const StyleSelector: React.FC<{
    selectedStyle: string;
    onStyleSelect: (styleId: string) => void;
    onEditStyle?: (styleId: string) => void;
}> = ({ selectedStyle, onStyleSelect, onEditStyle }) => {
    const [activeCategory, setActiveCategory] = useState<typeof categories[number]>('All');
    const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);

    const filteredStyles = activeCategory === 'All'
        ? styles
        : styles.filter(s => s.category === activeCategory);

    const isSelected = (styleId: string) => selectedStyle === styleId;

    return (
        <div className="h-full flex flex-col bg-gray-50/30">
            {/* Category Tabs */}
            <div className="flex items-center gap-1 px-8 py-4 border-b border-gray-200 bg-white shrink-0 overflow-x-auto">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider rounded-lg transition-all whitespace-nowrap ${activeCategory === cat
                            ? 'bg-[var(--color-primary)] text-[var(--color-bg)]'
                            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Styles Grid */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-3 gap-4">
                    {filteredStyles.map((style) => {
                        const selected = isSelected(style.id);
                        const isHovered = hoveredStyle === style.id;

                        return (
                            <div
                                key={style.id}
                                className="relative aspect-video"
                                onMouseEnter={() => setHoveredStyle(style.id)}
                                onMouseLeave={() => setHoveredStyle(null)}
                            >
                                {/* Main Card Button */}
                                <button
                                    onClick={() => onStyleSelect(style.id)}
                                    className={`w-full h-full relative group bg-gray-200 rounded-2xl overflow-hidden border-2 transition-all hover:scale-[1.02] ${selected
                                        ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-offset-2'
                                        : 'border-transparent hover:border-[var(--color-border)]'
                                        }`}
                                >
                                    {/* Preview Placeholder */}
                                    <div className="absolute inset-0 bg-gray-200">
                                        <img
                                            src={isHovered ? `/previews/${style.id}.gif` : `/previews/png/${style.id}.png`}
                                            alt={style.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        {style.isNew && (
                                            <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[9px] font-bold uppercase tracking-wider rounded shadow-sm">
                                                New
                                            </span>
                                        )}
                                        {style.isPremium && (
                                            <div className="w-5 h-5 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                                                <Sparkles className="w-3 h-3 text-orange-500 fill-orange-500" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Selected Checkmark (Top Right) */}
                                    {selected && (
                                        <div className="absolute top-3 right-3 w-6 h-6 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-[var(--color-bg)] shadow-lg">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>

                                {/* Edit Button - Appears on hover when selected */}
                                {selected && isHovered && onEditStyle && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditStyle(style.id);
                                        }}
                                        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer z-10"
                                    >
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                                            <Pencil className="w-5 h-5 text-black" />
                                        </div>
                                        <span className="text-white text-xs font-medium uppercase tracking-wider">
                                            Customize Style
                                        </span>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};