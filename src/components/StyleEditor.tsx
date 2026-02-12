// src/components/StyleEditor.tsx
'use client';

import { SubtitleStyleConfig, FontType, FontStyleDefinition } from '../../types/style';
import { ChevronLeft, Save, RotateCcw } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';

type StyleEditorProps = {
    config: SubtitleStyleConfig;
    onChange: (config: SubtitleStyleConfig) => void;
    onBack: () => void;
    onSave: (config: SubtitleStyleConfig) => Promise<void>; // New prop
    isSaving?: boolean; // New prop
    hasChanges?: boolean; // New prop
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

export const StyleEditor: React.FC<StyleEditorProps> = ({
    config,
    onChange,
    onBack,
    onSave,
    isSaving = false,
    hasChanges = false
}) => {
    const [activeTab, setActiveTab] = useState<FontType>('bold');
    const [localConfig, setLocalConfig] = useState<SubtitleStyleConfig>(config);
    const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

    // Track if we're trying to navigate away with unsaved changes
    const pendingBackRef = useRef(false);

    // Sync local config when prop changes (initial load)
    useEffect(() => {
        setLocalConfig(config);
    }, [config.id]); // Only sync when style ID changes, not on every config change

    const updateFontStyle = (type: FontType, updates: Partial<FontStyleDefinition>) => {
        const newConfig = {
            ...localConfig,
            fonts: {
                ...localConfig.fonts,
                [type]: { ...localConfig.fonts[type], ...updates }
            }
        };
        setLocalConfig(newConfig);
        onChange(newConfig); // Notify parent of changes
    };

    const handleBack = useCallback(() => {
        if (hasChanges) {
            setShowUnsavedWarning(true);
            pendingBackRef.current = true;
        } else {
            onBack();
        }
    }, [hasChanges, onBack]);

    const handleConfirmBack = useCallback(async () => {
        setShowUnsavedWarning(false);
        if (pendingBackRef.current) {
            // Save before going back
            await onSave(localConfig);
            onBack();
        }
    }, [localConfig, onSave, onBack]);

    const handleCancelBack = useCallback(() => {
        setShowUnsavedWarning(false);
        pendingBackRef.current = false;
        // Revert changes
        setLocalConfig(config);
        onBack();
    }, [config, onBack, onChange]);

    const handleSave = useCallback(async () => {
        await onSave(localConfig);
    }, [localConfig, onSave]);

    const currentFont = localConfig.fonts[activeTab];

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-[var(--color-bg-hover)] rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-[var(--color-text-muted)]" />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--color-text)]">{localConfig.name}</span>
                        {hasChanges && (
                            <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full" title="Unsaved changes" />
                        )}
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving || !hasChanges}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${hasChanges
                        ? 'bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-primary-hover)]'
                        : 'bg-[var(--color-bg-hover)] text-[var(--color-text-light)] cursor-not-allowed'
                        }`}
                >
                    {isSaving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-[var(--color-bg)]/30 border-t-[var(--color-bg)] rounded-full animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                        </>
                    )}
                </button>
            </div>

            {/* Unsaved Changes Warning Dialog */}
            {showUnsavedWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center">
                                <Save className="w-5 h-5 text-[var(--color-primary)]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--color-text)]">Unsaved Changes</h3>
                                <p className="text-sm text-[var(--color-text-muted)]">You have unsaved style modifications</p>
                            </div>
                        </div>

                        <p className="text-sm text-[var(--color-text-muted)] mb-6">
                            Would you like to save your changes before going back, or discard them?
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelBack}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Discard
                            </button>
                            <button
                                onClick={handleConfirmBack}
                                disabled={isSaving}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-[var(--color-bg)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save & Exit
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Font Type Tabs */}
            <div className="flex gap-2 px-6 py-3 border-b border-gray-200 bg-gray-50">
                {(['bold', 'thin', 'normal', 'italic'] as FontType[]).map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveTab(type)}
                        className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all ${activeTab === type
                            ? 'bg-[var(--color-primary)] text-[var(--color-bg)]'
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
                                        ? 'border-[var(--color-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-primary)]'
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
                                    ? 'bg-[var(--color-bg-card)] text-[var(--color-primary)] shadow-sm'
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
                                        ? 'bg-[var(--color-bg-card)] text-[var(--color-primary)] shadow-sm'
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