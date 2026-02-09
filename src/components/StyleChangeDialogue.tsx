// src/components/StyleChangeDialog.tsx
'use client';

import { useState } from 'react';
import { Sparkles, Clock, AlertCircle } from 'lucide-react';

interface StyleChangeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    styleName: string;
    isGenerating: boolean;
}

export const StyleChangeDialog: React.FC<StyleChangeDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    styleName,
    isGenerating
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={!isGenerating ? onClose : undefined}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Change Video Style?</h3>
                            <p className="text-white/80 text-sm">Switch to "{styleName}"</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                        You're about to change the caption style for this video. This will update how your captions look throughout the entire video.
                    </p>

                    {/* Warning about generation time */}
                    <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-amber-800 uppercase tracking-wider mb-1">
                                Processing Time
                            </p>
                            <p className="text-xs text-amber-700">
                                Style generation may take 30-60 seconds depending on video length. Please don't close this page.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isGenerating}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isGenerating}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <span>Change Style</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};