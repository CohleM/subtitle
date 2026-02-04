// src/components/UploadFlow.tsx
'use client';

import { useState, useCallback } from 'react';
import { Upload, Sparkles, ArrowRight, Check, Video, X } from 'lucide-react';
import { SubtitleStyle } from '../../types/style';

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

type UploadState = 'idle' | 'uploading' | 'success';

export const UploadFlow: React.FC<{
    onComplete: (videoUrl: string, selectedStyle: string) => void;
    onCancel?: () => void;
}> = ({ onComplete, onCancel }) => {
    const [step, setStep] = useState<'upload' | 'style'>('upload');
    const [uploadState, setUploadState] = useState<UploadState>('idle');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<typeof categories[number]>('All');
    const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setVideoFile(file);
        setUploadState('uploading');

        // Create preview
        const url = URL.createObjectURL(file);
        setVideoPreview(url);

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    setUploadState('success');
                    setStep('style');
                }, 400);
            }
            setUploadProgress(Math.min(progress, 100));
        }, 200);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) {
            const input = document.getElementById('video-upload') as HTMLInputElement;
            if (input) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                input.files = dataTransfer.files;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    }, []);

    const handleGenerate = useCallback(() => {
        if (videoPreview && selectedStyle) {
            onComplete(videoPreview, selectedStyle);
        }
    }, [videoPreview, selectedStyle, onComplete]);

    const filteredStyles = activeCategory === 'All'
        ? styles
        : styles.filter(s => s.category === activeCategory);

    // Upload Step
    if (step === 'upload') {
        return (
            <div className="h-full flex flex-col bg-white  border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-white shrink-0">
                    <div className="max-w-3xl mx-auto pb-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-sm font-semibold text-gray-900">New Project</h1>
                                    <p className="text-xs text-gray-500">Upload a video to get started</p>
                                </div>
                            </div>
                            {onCancel && (
                                <button
                                    onClick={onCancel}
                                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Upload Area */}
                <div className="flex-1 flex items-center justify-center px-6 py-8 bg-white">
                    <div className="w-full max-w-3xl">
                        <label
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            className={`
                                relative flex flex-col items-center justify-center
                                w-full h-80 rounded-2xl border-2 border-dashed
                                transition-all duration-300 cursor-pointer
                                ${uploadState === 'uploading'
                                    ? 'border-orange-400 bg-orange-50/30'
                                    : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50/50 bg-gray-50/30'
                                }
                            `}
                        >
                            <input
                                id="video-upload"
                                type="file"
                                accept="video/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {uploadState === 'idle' && (
                                <div className="flex flex-col items-center gap-4 text-center p-8">
                                    <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center shadow-lg">
                                        <Upload className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 mb-1">
                                            Drop your video here, or click to browse
                                        </p>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">
                                            MP4, MOV, WebM up to 500MB
                                        </p>
                                    </div>
                                </div>
                            )}

                            {uploadState === 'uploading' && (
                                <div className="flex flex-col items-center gap-5 w-full max-w-xs px-8">
                                    <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                                        <Video className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="w-full space-y-2.5">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-gray-700">Uploading...</span>
                                            <span className="text-orange-500">{Math.round(uploadProgress)}%</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-orange-500 rounded-full transition-all duration-200"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                    {videoFile && (
                                        <p className="text-xs text-gray-500 truncate max-w-full">
                                            {videoFile.name}
                                        </p>
                                    )}
                                </div>
                            )}

                            {uploadState === 'success' && (
                                <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
                                    <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center shadow-lg">
                                        <Check className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">Upload complete!</p>
                                </div>
                            )}
                        </label>

                        {/* Recent uploads hint */}
                        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
                            <span className="uppercase tracking-wider">Or select from</span>
                            <button className="text-black font-medium hover:underline">
                                recent uploads
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Style Selection Step
    return (
        <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-white shrink-0">
                <div className="max-w-3xl mx-auto pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setStep('upload')}
                                className="p-1.5 -ml-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-black"
                            >
                                <ArrowRight className="w-4 h-4 rotate-180" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
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
                            disabled={!selectedStyle}
                            className={`
                                flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-medium uppercase tracking-wider
                                transition-all duration-200
                                ${selectedStyle
                                    ? 'bg-black text-white hover:bg-gray-800'
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

            {/* Video Preview Strip */}
            {videoPreview && (
                <div className="px-6 py-3 bg-white shrink-0">
                    <div className="max-w-3xl mx-auto pb-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-16 aspect-video bg-black rounded-lg overflow-hidden relative">
                                <video
                                    src={videoPreview}
                                    className="w-full h-full object-cover"
                                    muted
                                    playsInline
                                />
                                <div className="absolute inset-0 bg-black/20" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 truncate">
                                    {videoFile?.name || 'Untitled Video'}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">
                                    Ready to generate
                                </p>
                            </div>
                            <button
                                onClick={() => setStep('upload')}
                                className="text-[10px] font-medium text-gray-500 hover:text-black uppercase tracking-wider transition-colors"
                            >
                                Change
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Tabs */}
            <div className="px-6 py-3 bg-white shrink-0">
                <div className="max-w-3xl mx-auto pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-1 overflow-x-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`
                                    px-3 py-1 text-[10px] font-medium uppercase tracking-wider rounded-lg 
                                    transition-all whitespace-nowrap
                                    ${activeCategory === cat
                                        ? 'bg-black text-white'
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
                <div className="grid grid-cols-4 gap-3 max-w-3xl mx-auto">
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
                                    <div className={`
                                        absolute inset-0 flex flex-col items-center justify-center 
                                        bg-gradient-to-br transition-colors duration-200
                                        ${isSelected
                                            ? 'from-gray-100 to-gray-200'
                                            : 'from-gray-100 to-gray-300 group-hover:from-gray-200 group-hover:to-gray-300'
                                        }
                                    `}>
                                        {/* Mock Caption Preview */}
                                        <div className="space-y-1 px-3 w-full">
                                            <div className={`
                                                h-1.5 rounded-full mx-auto transition-all
                                                ${isSelected ? 'bg-black w-3/4' : 'bg-gray-400 w-2/3'}
                                            `} />
                                            <div className={`
                                                h-2 rounded-full mx-auto transition-all
                                                ${isSelected ? 'bg-black w-1/2' : 'bg-gray-500 w-1/2'}
                                            `} />
                                            <div className={`
                                                h-1.5 rounded-full mx-auto transition-all
                                                ${isSelected ? 'bg-gray-600 w-2/3' : 'bg-gray-400 w-3/5'}
                                            `} />
                                        </div>
                                        <span className={`
                                            mt-2 text-[9px] font-bold uppercase tracking-wider transition-colors
                                            ${isSelected ? 'text-black' : 'text-gray-600'}
                                        `}>
                                            {style.name}
                                        </span>
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
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Bar - Selected Style Info */}
            {selectedStyle && (
                <div className="px-6 py-3 bg-white shrink-0 animate-in slide-in-from-bottom duration-200">
                    <div className="max-w-3xl mx-auto pt-3 border-t border-gray-200">
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
                                className="flex items-center gap-2 px-4 py-1.5 bg-black text-white text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-gray-800 transition-colors"
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