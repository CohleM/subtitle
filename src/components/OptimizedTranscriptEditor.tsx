// src/components/OptimizedTranscriptEditor.tsx
'use client';

import { useState, useCallback, useMemo, memo, useEffect } from 'react';
import { SubtitleGroup, Line, Word } from '../../types/subtitles';
import { X, Edit3 } from 'lucide-react';

// Color coding for different font types
const FONT_TYPE_COLORS: Record<string, { border: string; bg: string; hover: string }> = {
    'bold': { border: 'border-orange-400', bg: 'bg-orange-50', hover: 'hover:bg-orange-100' },
    'thin': { border: 'border-blue-300', bg: 'bg-blue-50', hover: 'hover:bg-blue-100' },
    'normal': { border: 'border-gray-300', bg: 'bg-white', hover: 'hover:bg-gray-100' },
    'italic': { border: 'border-purple-300', bg: 'bg-purple-50', hover: 'hover:bg-purple-100' },
};

const DEFAULT_COLOR = { border: 'border-gray-300', bg: 'bg-white', hover: 'hover:bg-gray-100' };

// Flatten to lines
interface FlatLine extends Line {
    groupId: string;
    groupIndex: number;
    lineIndex: number;
    displayText: string;
}

const flattenToLines = (transcript: SubtitleGroup[]): FlatLine[] => {
    const flatLines: FlatLine[] = [];
    transcript.forEach((group, groupIndex) => {
        group.lines.forEach((line, lineIndex) => {
            flatLines.push({
                ...line,
                groupId: group.id,
                groupIndex,
                lineIndex,
                displayText: line.words.map(w => w.word).join(' '),
            });
        });
    });
    return flatLines;
};

// Compact inline line chip - minimal size
const LineChip = memo(function LineChip({
    line,
    onClick,
}: {
    line: FlatLine;
    onClick: (line: FlatLine) => void;
}) {
    const colors = FONT_TYPE_COLORS[line.font_type] || DEFAULT_COLOR;

    return (
        <button
            onClick={() => onClick(line)}
            className={`
        inline-flex items-center px-2 py-1 mx-0.5 my-0.5 rounded border ${colors.border} ${colors.bg} ${colors.hover}
        hover:shadow-sm active:scale-95 transition-all duration-100 cursor-pointer
        text-sm text-gray-800 leading-tight
      `}
            title={`${line.font_type} • ${line.start.toFixed(2)}s`}
        >
            <span className="truncate max-w-[200px]">{line.displayText}</span>
        </button>
    );
});

// Edit Modal
const EditModal = ({
    line,
    onSave,
    onClose,
}: {
    line: FlatLine | null;
    onSave: (lineId: string, groupId: string, newText: string, newFontType: Line['font_type']) => void;
    onClose: () => void;
}) => {
    const [text, setText] = useState('');
    const [fontType, setFontType] = useState<Line['font_type']>('normal');
    const [hasInit, setHasInit] = useState(false);

    useEffect(() => {
        if (line && !hasInit) {
            setText(line.displayText);
            setFontType(line.font_type);
            setHasInit(true);
        }
        if (!line) setHasInit(false);
    }, [line, hasInit]);

    if (!line) return null;

    const handleSave = () => {
        onSave(line.id, line.groupId, text, fontType);
        onClose();
    };

    const colors = FONT_TYPE_COLORS[fontType] || DEFAULT_COLOR;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                    <span className="font-semibold text-gray-900">Edit Line</span>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black resize-none"
                        rows={2}
                        autoFocus
                    />

                    <div className="flex gap-2">
                        {(Object.keys(FONT_TYPE_COLORS) as Line['font_type'][]).map((type) => {
                            const typeColors = FONT_TYPE_COLORS[type];
                            const isSelected = fontType === type;
                            return (
                                <button
                                    key={type}
                                    onClick={() => setFontType(type)}
                                    className={`
                    px-3 py-1.5 rounded border text-xs font-medium capitalize
                    ${isSelected ? `${typeColors.border} ${typeColors.bg}` : 'border-gray-200 bg-white text-gray-600'}
                  `}
                                >
                                    {type}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <button onClick={onClose} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-1.5 bg-black text-white text-sm rounded hover:bg-gray-800"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

// Legend
const FontTypeLegend = () => (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-200 bg-white text-xs sticky top-0 z-10">
        {Object.entries(FONT_TYPE_COLORS).map(([type, colors]) => (
            <div key={type} className={`flex items-center gap-1 px-2 py-0.5 rounded border ${colors.border} ${colors.bg}`}>
                <span className="capitalize text-gray-700">{type}</span>
            </div>
        ))}
    </div>
);

export const OptimizedTranscriptEditor: React.FC<{
    transcript: SubtitleGroup[];
    setTranscript: (t: SubtitleGroup[]) => void;
}> = ({ transcript, setTranscript }) => {
    const [editingLine, setEditingLine] = useState<FlatLine | null>(null);
    const flatLines = useMemo(() => flattenToLines(transcript), [transcript]);

    const handleLineClick = useCallback((line: FlatLine) => {
        setEditingLine(line);
    }, []);
    // In OptimizedTranscriptEditor.tsx - Modify handleSave
    const handleSave = useCallback((lineId: string, groupId: string, newText: string, newFontType: Line['font_type']) => {
        const wordsArray = newText.trim().split(/\s+/).filter(Boolean);

        const newTranscript = transcript.map(group => {
            if (group.id !== groupId) return group;

            return {
                ...group,
                lines: group.lines.map(line => {
                    if (line.id !== lineId) return line;

                    const duration = line.end - line.start;
                    const wordDuration = duration / wordsArray.length;

                    // ✅ Preserve existing word IDs where possible to maintain React key stability
                    const existingWords = line.words;

                    return {
                        ...line,
                        font_type: newFontType,
                        words: wordsArray.map((w, i) => ({
                            word: w,
                            start: line.start + i * wordDuration,
                            end: line.start + (i + 1) * wordDuration,
                            // ✅ Reuse existing ID if available, only generate new for new words
                            id: existingWords[i]?.id || `${line.id}-w${i}-${Date.now()}`,
                        })),
                        text: newText
                    };
                })
            };
        });

        setTranscript(newTranscript);
    }, [transcript, setTranscript]);

    if (!transcript.length) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No transcript
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gray-50">
            <FontTypeLegend />

            {/* Continuous inline layout */}
            <div className="flex-1 overflow-y-auto p-3">
                <div className="flex flex-wrap content-start">
                    {flatLines.map((line, index) => (
                        <LineChip
                            key={`${line.id}-${index}`}
                            line={line}
                            onClick={handleLineClick}
                        />
                    ))}
                </div>
            </div>

            <EditModal
                line={editingLine}
                onSave={handleSave}
                onClose={() => setEditingLine(null)}
            />
        </div>
    );
};