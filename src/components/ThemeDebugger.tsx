// src/components/ThemeDebugger.tsx
'use client'

import { useState, useEffect } from 'react'

interface ColorConfig {
    name: string
    var: string
    value: string
}

export function ThemeDebugger() {
    const [isOpen, setIsOpen] = useState(false)
    const [colors, setColors] = useState<ColorConfig[]>([
        { name: 'Primary', var: '--color-primary', value: '#FF3898' },
        { name: 'Primary Hover', var: '--color-primary-hover', value: '#f51682' },
        { name: 'Text', var: '--color-text', value: '#1E1E24' },
        { name: 'Text Muted', var: '--color-text-muted', value: '#6b7280' },
        { name: 'Text Light', var: '--color-text-light', value: '#FF5FAC' },
        { name: 'Background', var: '--color-bg', value: '#f5f5f5' },
        { name: 'Background Secondary', var: '--color-bg-secondary', value: '#f9fafb' },
        { name: 'Background Card', var: '--color-bg-card', value: '#ffffff' },
        { name: 'Background Hover', var: '--color-bg-hover', value: '#f3f4f6' },
        { name: 'Border', var: '--color-border', value: '#e5e7eb' },
        { name: 'Border Light', var: '--color-border-light', value: '#f3f4f6' },
    ])

    const [presets] = useState([
        { name: 'Classic B&W', colors: { '--color-primary': '#000000', '--color-primary-hover': '#333333', '--color-text': '#000000', '--color-text-muted': '#6b7280', '--color-text-light': '#9ca3af', '--color-bg': '#ffffff', '--color-bg-secondary': '#f9fafb', '--color-bg-card': '#ffffff', '--color-bg-hover': '#f3f4f6', '--color-border': '#e5e7eb', '--color-border-light': '#f3f4f6' } },
        { name: 'Midnight Blue', colors: { '--color-primary': '#1e3a8a', '--color-primary-hover': '#1e40af', '--color-text': '#0f172a', '--color-text-muted': '#475569', '--color-text-light': '#94a3b8', '--color-bg': '#ffffff', '--color-bg-secondary': '#f8fafc', '--color-bg-card': '#ffffff', '--color-bg-hover': '#f1f5f9', '--color-border': '#e2e8f0', '--color-border-light': '#f1f5f9' } },
        { name: 'Forest Green', colors: { '--color-primary': '#166534', '--color-primary-hover': '#15803d', '--color-text': '#14532d', '--color-text-muted': '#4ade80', '--color-text-light': '#86efac', '--color-bg': '#ffffff', '--color-bg-secondary': '#f0fdf4', '--color-bg-card': '#ffffff', '--color-bg-hover': '#dcfce7', '--color-border': '#bbf7d0', '--color-border-light': '#dcfce7' } },
        { name: 'Soft Purple', colors: { '--color-primary': '#7c3aed', '--color-primary-hover': '#8b5cf6', '--color-text': '#2e1065', '--color-text-muted': '#6b7280', '--color-text-light': '#9ca3af', '--color-bg': '#faf5ff', '--color-bg-secondary': '#f3e8ff', '--color-bg-card': '#ffffff', '--color-bg-hover': '#ede9fe', '--color-border': '#ddd6fe', '--color-border-light': '#ede9fe' } },
        { name: 'Warm Sand', colors: { '--color-primary': '#92400e', '--color-primary-hover': '#b45309', '--color-text': '#451a03', '--color-text-muted': '#78716c', '--color-text-light': '#a8a29e', '--color-bg': '#fffbeb', '--color-bg-secondary': '#fef3c7', '--color-bg-card': '#ffffff', '--color-bg-hover': '#fde68a', '--color-border': '#fcd34d', '--color-border-light': '#fde68a' } },
        { name: 'High Contrast', colors: { '--color-primary': '#000000', '--color-primary-hover': '#000000', '--color-text': '#000000', '--color-text-muted': '#000000', '--color-text-light': '#666666', '--color-bg': '#ffffff', '--color-bg-secondary': '#ffffff', '--color-bg-card': '#ffffff', '--color-bg-hover': '#eeeeee', '--color-border': '#000000', '--color-border-light': '#cccccc' } },
        { name: 'Dark Mode', colors: { '--color-primary': '#ffffff', '--color-primary-hover': '#e5e5e5', '--color-text': '#ffffff', '--color-text-muted': '#a1a1aa', '--color-text-light': '#71717a', '--color-bg': '#09090b', '--color-bg-secondary': '#18181b', '--color-bg-card': '#27272a', '--color-bg-hover': '#3f3f46', '--color-border': '#3f3f46', '--color-border-light': '#27272a' } },
    ])

    useEffect(() => {
        const root = document.documentElement
        colors.forEach(color => {
            root.style.setProperty(color.var, color.value)
        })
    }, [colors])

    const updateColor = (index: number, value: string) => {
        const newColors = [...colors]
        newColors[index].value = value
        setColors(newColors)
    }

    const applyPreset = (presetColors: Record<string, string>) => {
        const newColors = colors.map(c => ({
            ...c,
            value: presetColors[c.var] || c.value
        }))
        setColors(newColors)
    }

    const copyCSS = () => {
        const css = `:root {\n${colors.map(c => `  ${c.var}: ${c.value};`).join('\n')}\n}`
        navigator.clipboard.writeText(css)
        alert('CSS copied to clipboard!')
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
            >
                🎨 Theme
            </button>
        )
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 w-80 max-h-[80vh] overflow-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-black">Theme Debugger</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-black"
                >
                    ✕
                </button>
            </div>

            <div className="mb-6">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {presets.map(preset => (
                        <button
                            key={preset.name}
                            onClick={() => applyPreset(preset.colors)}
                            className="px-3 py-2 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-left"
                        >
                            {preset.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                    Custom Colors
                </label>
                {colors.map((color, index) => (
                    <div key={color.var} className="flex items-center gap-3">
                        <input
                            type="color"
                            value={color.value}
                            onChange={(e) => updateColor(index, e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                        />
                        <div className="flex-1">
                            <div className="text-xs font-medium text-gray-700">{color.name}</div>
                            <div className="text-[10px] text-gray-400 font-mono">{color.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={copyCSS}
                className="w-full py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
                Copy CSS Variables
            </button>
        </div>
    )
}