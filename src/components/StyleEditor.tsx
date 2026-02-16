// src/components/StyleEditor.tsx
import React, { useState, useCallback, useMemo } from 'react';
import {
    ChevronLeft,
    Type,
    Palette,
    Layers,
    Sparkles,
    Save,
    AlertCircle,
    Move,
    Maximize,
    Info
} from 'lucide-react';
import { SubtitleStyleConfig, FontStyleDefinition, AnimationType } from '../../types/style';

type StyleEditorProps = {
    config: SubtitleStyleConfig;
    onChange: (config: SubtitleStyleConfig) => void;
    onBack: () => void;
    onSave: (config: SubtitleStyleConfig) => Promise<void>;
    isSaving: boolean;
    hasChanges: boolean;
};

const ALL_ANIMATION_TYPES: { value: AnimationType; label: string; description: string }[] = [
    { value: 'slide-up', label: 'Slide Up', description: 'Slides in from below' },
    { value: 'slide-down', label: 'Slide Down', description: 'Slides in from above' },
    { value: 'slide-left', label: 'Slide Left', description: 'Slides in from right' },
    { value: 'slide-right', label: 'Slide Right', description: 'Slides in from left' },
    { value: 'scale', label: 'Scale', description: 'Scales up from center' },
    { value: 'fade-blur', label: 'Fade Blur', description: 'Fades in with blur' },
];

const AVAILABLE_FONTS = [
    'Inter',
    'Bebas Neue',
    'Poppins',
    'Montserrat',
    'Oswald',
    'Cormorant Garamond',
] as const;

const FONT_TYPES = ['normal', 'bold', 'italic', 'thin'] as const;
type FontType = typeof FONT_TYPES[number];

export const StyleEditor: React.FC<StyleEditorProps> = ({
    config,
    onChange,
    onBack,
    onSave,
    isSaving,
    hasChanges,
}) => {
    const [saveError, setSaveError] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<'typography' | 'colors' | 'effects' | 'animation'>('typography');
    const [selectedFontType, setSelectedFontType] = useState<FontType>('normal');
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

    // Check if this is the Combo style
    const isComboStyle = config.id === 'Combo';

    console.log('lets check config', config)
    const handleUpdateFontStyle = useCallback((fontType: FontType, updates: Partial<FontStyleDefinition>) => {
        const newConfig: SubtitleStyleConfig = {
            ...config,
            fonts: {
                ...config.fonts,
                [fontType]: {
                    ...config.fonts[fontType],
                    ...updates,
                },
            },
        };
        onChange(newConfig);
    }, [config, onChange]);

    const handleAnimationTypeChange = useCallback((animationType: AnimationType) => {
        handleUpdateFontStyle(selectedFontType, { animationType });
    }, [handleUpdateFontStyle, selectedFontType]);

    const handleSave = useCallback(async () => {
        setSaveError(null);
        try {
            await onSave(config);
        } catch (error) {
            setSaveError(error instanceof Error ? error.message : 'Failed to save');
        }
    }, [config, onSave]);

    const handleBackClick = useCallback(() => {
        if (hasChanges) {
            setShowUnsavedDialog(true);
        } else {
            onBack();
        }
    }, [hasChanges, onBack]);

    const handleDiscardChanges = useCallback(() => {
        setShowUnsavedDialog(false);
        onBack();
    }, [onBack]);

    const handleSaveAndBack = useCallback(async () => {
        try {
            await onSave(config);
            setShowUnsavedDialog(false);
            onBack();
        } catch (error) {
            setSaveError(error instanceof Error ? error.message : 'Failed to save');
        }
    }, [config, onSave, onBack]);

    const currentFontStyle = config.fonts[selectedFontType];

    const fontTypeButtons = useMemo(() => [
        { id: 'normal', label: 'Normal', icon: Type },
        { id: 'bold', label: 'Bold', icon: Type },
        { id: 'italic', label: 'Italic', icon: Type },
        { id: 'thin', label: 'Thin', icon: Type },
    ] as const, []);

    const sectionButtons = useMemo(() => [
        { id: 'typography', label: 'Typography', icon: Type },
        { id: 'colors', label: 'Colors', icon: Palette },
        { id: 'effects', label: 'Effects', icon: Layers },
        { id: 'animation', label: 'Animation', icon: Sparkles },
    ] as const, []);

    return (
        <div className="h-full flex flex-col">
            {/* Unsaved Changes Dialog */}
            {showUnsavedDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                            Unsaved Changes
                        </h3>
                        <p className="text-sm text-[var(--color-text-muted)] mb-6">
                            You have unsaved changes. Would you like to save them before leaving?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDiscardChanges}
                                className="flex-1 px-4 py-3 bg-[var(--color-bg-hover)] text-[var(--color-text)] text-sm font-medium rounded-xl hover:bg-[var(--color-bg-secondary)] transition-all"
                            >
                                Discard
                            </button>
                            <button
                                onClick={() => setShowUnsavedDialog(false)}
                                className="flex-1 px-4 py-3 bg-[var(--color-bg-secondary)] text-[var(--color-text)] text-sm font-medium rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] transition-all"
                            >
                                Keep Editing
                            </button>
                            <button
                                onClick={handleSaveAndBack}
                                disabled={isSaving}
                                className="flex-1 px-4 py-3 bg-[var(--color-primary)] text-[var(--color-bg)] text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? 'Saving...' : 'Save & Exit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--color-border)] shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBackClick}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-hover)] rounded-xl transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div className="h-6 w-px bg-[var(--color-border)]" />
                    <h2 className="text-sm font-semibold text-[var(--color-text)]">Style Editor</h2>
                </div>

                <div className="flex items-center gap-3">
                    {saveError && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{saveError}</span>
                        </div>
                    )}

                    {hasChanges && !saveError && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-600 bg-amber-50">
                            <span>Unsaved changes</span>
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                        className={`
                            flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl
                            transition-all active:scale-[0.98]
                            ${isSaving || !hasChanges
                                ? 'bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] cursor-not-allowed'
                                : 'bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-primary-hover)]'
                            }
                        `}
                    >
                        <Save className="w-3.5 h-3.5" />
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Font Type Selector */}
            <div className="px-8 py-4 border-b border-[var(--color-border)] shrink-0">
                <div className="flex items-center gap-2 bg-[var(--color-bg-secondary)] p-1 rounded-xl">
                    {fontTypeButtons.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setSelectedFontType(id as FontType)}
                            className={`
                                flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all
                                ${selectedFontType === id
                                    ? 'bg-[var(--color-bg)] text-[var(--color-text)] shadow-sm'
                                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                                }
                            `}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Section Tabs */}
            <div className="px-8 py-3 border-b border-[var(--color-border)] shrink-0">
                <div className="flex items-center gap-1">
                    {sectionButtons.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveSection(id as typeof activeSection)}
                            className={`
                                flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all
                                ${activeSection === id
                                    ? 'bg-[var(--color-primary)] text-[var(--color-bg)]'
                                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]'
                                }
                            `}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0 p-8">
                <div className="max-w-2xl mx-auto space-y-6">

                    {/* Typography Section */}
                    {activeSection === 'typography' && (
                        <div className="space-y-6">
                            <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 border border-[var(--color-border)]">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4 flex items-center gap-2">
                                    <Type className="w-4 h-4" />
                                    Font Settings
                                </h3>

                                {isComboStyle && (
                                    <div className="mb-4 flex items-start gap-2 text-xs text-amber-600 bg-amber-50/50 border border-amber-200 px-3 py-2 rounded-lg">
                                        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                        <span>Font sizes are set dynamically based on content. Changes here may not have the exact effect intended.</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-[var(--color-text)]">Font Family</label>
                                        <select
                                            value={currentFontStyle.fontFamily}
                                            onChange={(e) => handleUpdateFontStyle(selectedFontType, { fontFamily: e.target.value })}
                                            className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                                        >
                                            {AVAILABLE_FONTS.map((font) => (
                                                <option key={font} value={font}>{font}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-[var(--color-text)]">Font Size</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="range"
                                                min="20"
                                                max="120"
                                                value={currentFontStyle.fontSize}
                                                onChange={(e) => handleUpdateFontStyle(selectedFontType, { fontSize: Number(e.target.value) })}
                                                className="flex-1 h-1.5 bg-[var(--color-bg-secondary)] rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
                                                disabled={isComboStyle}
                                            />
                                            <span className={`text-xs font-mono w-12 text-right ${isComboStyle ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-muted)]'}`}>
                                                {currentFontStyle.fontSize}px
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-[var(--color-text)]">Font Weight</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="range"
                                                min="100"
                                                max="900"
                                                step="100"
                                                value={currentFontStyle.fontWeight}
                                                onChange={(e) => handleUpdateFontStyle(selectedFontType, { fontWeight: Number(e.target.value) })}
                                                className="flex-1 h-1.5 bg-[var(--color-bg-secondary)] rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
                                            />
                                            <span className="text-xs font-mono text-[var(--color-text-muted)] w-12 text-right">
                                                {currentFontStyle.fontWeight}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-3">
                                    <label className="flex items-center gap-2 text-xs font-medium text-[var(--color-text)] cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={currentFontStyle.uppercase || false}
                                            onChange={(e) => handleUpdateFontStyle(selectedFontType, { uppercase: e.target.checked })}
                                            className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]/20"
                                        />
                                        Uppercase
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Colors Section */}
                    {activeSection === 'colors' && (
                        <div className="space-y-6">
                            <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 border border-[var(--color-border)]">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4 flex items-center gap-2">
                                    <Palette className="w-4 h-4" />
                                    Color Settings
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-[var(--color-text)]">Text Color</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={currentFontStyle.color || '#ffffff'}
                                                onChange={(e) => handleUpdateFontStyle(selectedFontType, { color: e.target.value })}
                                                className="w-10 h-10 rounded-xl border border-[var(--color-border)] cursor-pointer bg-transparent"
                                            />
                                            <input
                                                type="text"
                                                value={currentFontStyle.color || '#ffffff'}
                                                onChange={(e) => handleUpdateFontStyle(selectedFontType, { color: e.target.value })}
                                                className="flex-1 px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm font-mono uppercase text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Effects Section */}
                    {activeSection === 'effects' && (
                        <div className="space-y-6">
                            <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 border border-[var(--color-border)]">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4 flex items-center gap-2">
                                    <Layers className="w-4 h-4" />
                                    Text Effects
                                </h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-[var(--color-text)]">Shadow Type</label>
                                            <select
                                                value={currentFontStyle.shadow || 'none'}
                                                onChange={(e) => handleUpdateFontStyle(selectedFontType, { shadow: e.target.value as any })}
                                                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                            >
                                                <option value="none">None</option>
                                                <option value="small">Small</option>
                                                <option value="medium">Medium</option>
                                                <option value="large">Large</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-[var(--color-text)]">Shadow Color</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={currentFontStyle.shadowColor || currentFontStyle.color || '#ffffff'}
                                                    onChange={(e) => handleUpdateFontStyle(selectedFontType, { shadowColor: e.target.value })}
                                                    className="w-10 h-10 rounded-xl border border-[var(--color-border)] cursor-pointer bg-transparent"
                                                />
                                                <input
                                                    type="text"
                                                    value={currentFontStyle.shadowColor || currentFontStyle.color || '#ffffff'}
                                                    onChange={(e) => handleUpdateFontStyle(selectedFontType, { shadowColor: e.target.value })}
                                                    className="flex-1 px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm font-mono uppercase text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-[var(--color-text)]">Stroke Weight</label>
                                            <select
                                                value={currentFontStyle.strokeWeight || 'none'}
                                                onChange={(e) => handleUpdateFontStyle(selectedFontType, { strokeWeight: e.target.value as any })}
                                                className="w-full px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                            >
                                                <option value="none">None</option>
                                                <option value="small">Small</option>
                                                <option value="medium">Medium</option>
                                                <option value="large">Large</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-[var(--color-text)]">Stroke Color</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={currentFontStyle.strokeColor || '#000000'}
                                                    onChange={(e) => handleUpdateFontStyle(selectedFontType, { strokeColor: e.target.value })}
                                                    className="w-10 h-10 rounded-xl border border-[var(--color-border)] cursor-pointer bg-transparent"
                                                />
                                                <input
                                                    type="text"
                                                    value={currentFontStyle.strokeColor || '#000000'}
                                                    onChange={(e) => handleUpdateFontStyle(selectedFontType, { strokeColor: e.target.value })}
                                                    className="flex-1 px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm font-mono uppercase text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Animation Section */}
                    {activeSection === 'animation' && (
                        <div className="space-y-6">
                            <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 border border-[var(--color-border)]">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Animation Settings
                                </h3>

                                {isComboStyle && (
                                    <div className="mb-4 flex items-start gap-2 text-xs text-amber-600 bg-amber-50/50 border border-amber-200 px-3 py-2 rounded-lg">
                                        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                        <span>Animations are auto-generated and cannot be edited for this style</span>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <label className="text-xs font-medium text-[var(--color-text)]">Animation Type</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {ALL_ANIMATION_TYPES.map(({ value, label, description }) => (
                                                <button
                                                    key={value}
                                                    onClick={() => !isComboStyle && handleAnimationTypeChange(value)}
                                                    disabled={isComboStyle}
                                                    className={`
                                                        relative p-4 rounded-xl border-2 text-left transition-all
                                                        ${isComboStyle
                                                            ? 'opacity-50 cursor-not-allowed border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]'
                                                            : 'active:scale-[0.98] ' + (currentFontStyle.animationType === value
                                                                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-text)]'
                                                                : 'border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] hover:border-[var(--color-text-muted)]'
                                                            )
                                                        }
                                                    `}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`
                                                            p-2 rounded-lg
                                                            ${isComboStyle ? 'bg-[var(--color-bg)]' :
                                                                currentFontStyle.animationType === value ? 'bg-[var(--color-primary)]/20' : 'bg-[var(--color-bg-secondary)]'
                                                            }
                                                        `}>
                                                            {value.includes('slide') && <Move className="w-4 h-4" />}
                                                            {value === 'scale' && <Maximize className="w-4 h-4" />}
                                                            {value === 'fade-blur' && <Sparkles className="w-4 h-4" />}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium">{label}</div>
                                                            <div className={`
                                                                text-xs mt-0.5
                                                                ${isComboStyle ? 'text-[var(--color-text-muted)]' :
                                                                    currentFontStyle.animationType === value ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-light)]'
                                                                }
                                                            `}>
                                                                {description}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {!isComboStyle && currentFontStyle.animationType === value && (
                                                        <div className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-primary)] rounded-full" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};