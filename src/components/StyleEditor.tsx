'use client';

import { SubtitleStyleConfig, FontType, FontStyleDefinition } from '../../types/style';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { useState } from 'react';

type StyleEditorProps = {
    config: SubtitleStyleConfig;
    onChange: (config: SubtitleStyleConfig) => void;
    onBack: () => void;
};

const fontFamilies = [
    'Inter',
    'Bebas Neue',
    'Poppins',
    'Montserrat',
    'Oswald',
    'Arial',
    'Helvetica'
];

const fontWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];

export const StyleEditor: React.FC<StyleEditorProps> = ({ config, onChange, onBack }) => {
    const [activeTab, setActiveTab] = useState<FontType>('bold');

    const updateFontStyle = (type: FontType, updates: Partial<FontStyleDefinition>) => {
        onChange({
            ...config,
            fonts: {
                ...config.fonts,
                [type]: { ...config.fonts[type], ...updates }
            }
        });
    };

    const currentFont = config.fonts[activeTab];

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{config.name}</span>
                        <button className="p-1 hover:bg-gray-100 rounded">
                            <span className="text-gray-400 text-sm">✏️</span>
                        </button>
                    </div>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">
                    <Sparkles className="w-4 h-4" />
                    Create theme
                </button>
            </div>

            {/* Font Type Tabs */}
            <div className="flex gap-2 px-6 py-3 border-b border-gray-200 bg-gray-50">
                {(['bold', 'thin', 'normal', 'italic'] as FontType[]).map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveTab(type)}
                        className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all ${activeTab === type
                                ? 'bg-black text-white'
                                : 'text-gray-600 hover:text-black hover:bg-gray-200'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Font Family */}
                <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Font Family
                    </label>
                    <select
                        value={currentFont.fontFamily}
                        onChange={(e) => updateFontStyle(activeTab, { fontFamily: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                    >
                        {fontFamilies.map(font => (
                            <option key={font} value={font}>{font}</option>
                        ))}
                    </select>
                    <button className="text-xs text-orange-500 flex items-center gap-1 mt-1">
                        <Sparkles className="w-3 h-3" />
                        Upload your own font
                    </button>
                </div>

                {/* Font Weight & Uppercase Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Font Weight
                        </label>
                        <select
                            value={currentFont.fontWeight}
                            onChange={(e) => updateFontStyle(activeTab, { fontWeight: Number(e.target.value) })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black"
                        >
                            {fontWeights.map(w => (
                                <option key={w} value={w}>{w}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Uppercase
                        </label>
                        <div className="flex gap-2">
                            {['Yes', 'No'].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => updateFontStyle(activeTab, { uppercase: option === 'Yes' })}
                                    className={`flex-1 py-3 text-xs font-medium rounded-xl border transition-all ${(currentFont.uppercase && option === 'Yes') || (!currentFont.uppercase && option === 'No')
                                            ? 'border-black bg-gray-50 text-black'
                                            : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Size with Slider */}
                <div className="space-y-3">
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Size
                    </label>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-24">
                            <input
                                type="number"
                                value={currentFont.fontSize}
                                onChange={(e) => updateFontStyle(activeTab, { fontSize: Number(e.target.value) })}
                                className="w-full bg-transparent text-sm font-medium text-center outline-none"
                            />
                            <span className="text-xs text-gray-400">px</span>
                        </div>
                        <input
                            type="range"
                            min="20"
                            max="200"
                            value={currentFont.fontSize}
                            onChange={(e) => updateFontStyle(activeTab, { fontSize: Number(e.target.value) })}
                            className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-black"
                        />
                    </div>
                </div>

                {/* Font Color */}
                <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Font Color
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={currentFont.color || '#ffffff'}
                            onChange={(e) => updateFontStyle(activeTab, { color: e.target.value })}
                            className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={currentFont.color || '#ffffff'}
                            onChange={(e) => updateFontStyle(activeTab, { color: e.target.value })}
                            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase"
                        />
                    </div>
                </div>

                {/* Stroke Weight */}
                <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Stroke Weight
                    </label>
                    <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
                        {['None', 'Small', 'Medium', 'Large'].map((size) => (
                            <button
                                key={size}
                                onClick={() => updateFontStyle(activeTab, { strokeWeight: size.toLowerCase() as any })}
                                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${currentFont.strokeWeight === size.toLowerCase()
                                        ? 'bg-white text-black shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stroke Color */}
                <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Stroke Color
                    </label>
                    <input
                        type="color"
                        value={currentFont.strokeColor || '#000000'}
                        onChange={(e) => updateFontStyle(activeTab, { strokeColor: e.target.value })}
                        className="w-full h-12 rounded-xl border border-gray-200 cursor-pointer"
                    />
                </div>

                {/* Shadow */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Shadow
                        </label>
                        <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
                            {['None', 'Small', 'Medium', 'Large'].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => updateFontStyle(activeTab, { shadow: size.toLowerCase() as any })}
                                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${currentFont.shadow === size.toLowerCase()
                                            ? 'bg-white text-black shadow-sm'
                                            : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Shadow Color
                        </label>
                        <input
                            type="color"
                            value={currentFont.shadowColor || '#000000'}
                            onChange={(e) => updateFontStyle(activeTab, { shadowColor: e.target.value })}
                            className="w-full h-12 rounded-xl border border-gray-200 cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};