'use client';

import { Player } from '@remotion/player';
import { useEffect, useState, useMemo, memo, useCallback, useRef } from 'react';
import { Plus, Trash2, Monitor, Maximize, Wand2 } from 'lucide-react';
import transcriptJson from '../../data/transcript_30_min.json';
import { SubtitleGroup } from '../../../types/subtitles';
import { Main } from '../../remotion/Main';
import { TranscriptEditor } from '../../components/TranscriptEditor';
import { StyleSelector } from '../../components/StyleSelector';
import { SubtitleStyleConfig } from '../../../types/style';
import { defaultStyleConfigs } from '../../config/styleConfigs';
import { StyleEditor } from '../../components/StyleEditor';
import { OptimizedTranscriptEditor } from '../../components/OptimizedTranscriptEditor';
import { Navbar } from '../../components/DashboardNavbar';
import { useSearchParams } from "next/navigation";
import useLocalStorage from 'use-local-storage';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { StyleChangeDialog } from '../../components/StyleChangeDialogue';

type VideoInfo = {
    width: number,
    height: number,
    duration: number,
    fps: number
};

const VideoPlayer = memo(function VideoPlayer({
    transcript,
    selectedStyle,
    compositionWidth,
    compositionHeight,
    captionPadding,
    customStyleConfigs, // this can be undefined
    videoUrl,
    videoInfo
}: {
    transcript: SubtitleGroup[];
    selectedStyle: string;
    compositionWidth: number;
    compositionHeight: number;
    captionPadding: number;
    customStyleConfigs?: SubtitleStyleConfig; // ← mark as optional here
    videoUrl: string;
    videoInfo: VideoInfo
}) {
    const inputProps = useMemo(() => ({
        transcript,
        style: selectedStyle,
        captionPadding,
        customStyleConfigs: customStyleConfigs ?? defaultStyleConfigs[selectedStyle], // ← provide default, never undefined
        videoUrl,
        videoInfo: {
            width: videoInfo.width,
            height: videoInfo.height,
            durationInFrames: Math.floor(videoInfo.duration * videoInfo.fps),
            fps: videoInfo.fps
        }
    }), [transcript, selectedStyle, captionPadding, customStyleConfigs, videoUrl, videoInfo]);

    return (
        <div className="w-full h-full bg-black overflow-hidden rounded-3xl border border-gray-200">
            <Player
                component={Main}
                inputProps={inputProps}
                durationInFrames={Math.floor(videoInfo.duration * videoInfo.fps)}
                fps={Math.floor(videoInfo.fps)}
                compositionWidth={Math.floor(videoInfo.width)}
                compositionHeight={Math.floor(videoInfo.height)}
                controls
                showVolumeControls={false}
                renderLoading={() => null}
                acknowledgeRemotionLicense={true}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
        </div>
    );
});

export default function Page() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const [accessToken] = useLocalStorage("access_token", "");
    const searchParams = useSearchParams();
    const videoId = searchParams.get("videoId");

    const [transcript, setTranscript] = useState<SubtitleGroup[]>([]);
    const [activeTab, setActiveTab] = useState<'style' | 'captions'>('captions');
    const [isPortrait, setIsPortrait] = useState(true);
    const [selectedStyle, setSelectedStyle] = useState('basic');
    const [editingStyle, setEditingStyle] = useState<string | null>(null);
    const [customConfig, setCustomConfig] = useState<SubtitleStyleConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lowresUrl, setLowresUrl] = useState('')
    const [videoInfo, setVideoInfo] = useState<VideoInfo>({ width: 0, height: 0, duration: 0, fps: 0 });
    const router = useRouter();
    // New state for style change dialog
    const [pendingStyleChange, setPendingStyleChange] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [styleChangeError, setStyleChangeError] = useState<string | null>(null);

    // Track original config for comparison to detect changes
    const [originalEditingConfig, setOriginalEditingConfig] = useState<SubtitleStyleConfig | null>(null);
    const [isSavingStyle, setIsSavingStyle] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        const loadVideoData = async () => {
            if (!videoId) return;

            try {
                setIsLoading(true);
                setStyleChangeError(null);

                const videoRes = await fetch(`${apiUrl}/videos/${videoId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                });
                const video = await videoRes.json();

                const currentStyle = video.current_style;
                const styleKey = currentStyle?.id || "basic";
                const styleId = video.all_styles_mapping[styleKey];

                console.log('current style gg yolo haha ', currentStyle)

                let styleTableData = null;
                if (styleId) {
                    const styleRes = await fetch(`${apiUrl}/styles/${styleId}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        }
                    });
                    styleTableData = await styleRes.json();
                }

                const transcriptFromStyle = styleTableData?.styled_transcript || [];

                setTranscript(transcriptFromStyle);
                setCustomConfig(currentStyle ?? null);
                setSelectedStyle(styleKey);
                setLowresUrl(video.low_res_url);
                setVideoInfo({
                    width: video.width,
                    height: video.height,
                    duration: video.duration,
                    fps: video.fps
                });

            } catch (err) {
                console.error("Failed to load player data", err);
                setStyleChangeError("Failed to load video data");
            } finally {
                setIsLoading(false);
            }
        };

        loadVideoData();
    }, [videoId, apiUrl, accessToken]);

    const compositionWidth = isPortrait ? 1080 : 1920;
    const compositionHeight = isPortrait ? 1920 : 1080;
    const [captionPadding, setCaptionPadding] = useState(540);

    const currentStyleConfig = useMemo(() => {
        return customConfig || defaultStyleConfigs[selectedStyle];
    }, [customConfig, selectedStyle]);

    // Check if there are unsaved changes in the editor
    const hasUnsavedChanges = useMemo(() => {
        if (!editingStyle || !originalEditingConfig) return false;
        return JSON.stringify(customConfig) !== JSON.stringify(originalEditingConfig);
    }, [customConfig, editingStyle, originalEditingConfig]);

    const handleStyleUpdate = useCallback((config: SubtitleStyleConfig) => {
        setCustomConfig(config);
    }, []);

    // Handle entering edit mode - store original config
    const handleEditStyle = useCallback((styleId: string) => {
        setEditingStyle(styleId);
        // Store a deep copy of the current config for comparison
        const configToEdit = customConfig || defaultStyleConfigs[styleId];
        setOriginalEditingConfig(JSON.parse(JSON.stringify(configToEdit)));
    }, [customConfig]);

    // Handle exiting edit mode
    const handleBackFromEditor = useCallback(() => {
        setEditingStyle(null);
        setOriginalEditingConfig(null);
    }, []);

    // Save style config to backend
    const handleSaveStyleConfig = useCallback(async (config: SubtitleStyleConfig): Promise<void> => {
        if (!videoId) return;

        setIsSavingStyle(true);
        setStyleChangeError(null);

        try {
            const requestData = {
                video_id: videoId,
                style_config: config,
            };

            const response = await fetch(`${apiUrl}/videos/change_styles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Save failed with status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Style save result:', result);

            if (result.success) {
                // Update transcript if new one was generated
                if (result.result) {
                    setTranscript(result.result);
                }

                // Update the original config to match saved state
                setOriginalEditingConfig(JSON.parse(JSON.stringify(config)));

                // Update custom config with server response
                if (result.current_style) {
                    setCustomConfig(result.current_style);
                }
            }

        } catch (error) {
            console.error('Error saving style:', error);
            setStyleChangeError(error instanceof Error ? error.message : 'Failed to save style');
            throw error; // Re-throw so editor can handle it
        } finally {
            setIsSavingStyle(false);
        }
    }, [videoId, apiUrl, accessToken]);

    // Handle style selection - show confirmation dialog
    const handleStyleSelect = useCallback((styleId: string) => {
        if (styleId === selectedStyle) return;

        const styleConfig = defaultStyleConfigs[styleId];
        if (!styleConfig) {
            console.error(`Style "${styleId}" not found`);
            return;
        }

        setPendingStyleChange(styleId);
    }, [selectedStyle]);

    // Handle confirmed style change
    const handleConfirmStyleChange = useCallback(async () => {
        if (!pendingStyleChange || !videoId) return;

        setIsGenerating(true);
        setStyleChangeError(null);

        try {
            const styleConfig = defaultStyleConfigs[pendingStyleChange];

            const requestData = {
                video_id: videoId,
                style_config: styleConfig,
            };

            const response = await fetch(`${apiUrl}/videos/change_styles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Style change failed with status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Style change result:', result);

            if (result.success) {
                if (result.result) {
                    setTranscript(result.result);
                }

                setSelectedStyle(pendingStyleChange);

                if (result.current_style) {
                    setCustomConfig(result.current_style);
                }
            }

        } catch (error) {
            console.error('Error changing style:', error);
            setStyleChangeError(error instanceof Error ? error.message : 'Failed to change style');
        } finally {
            setIsGenerating(false);
            setPendingStyleChange(null);
        }
    }, [pendingStyleChange, videoId, apiUrl, accessToken]);

    const handleCancelStyleChange = useCallback(() => {
        setPendingStyleChange(null);
    }, []);

    const pendingStyleName = useMemo(() => {
        if (!pendingStyleChange) return '';
        const style = defaultStyleConfigs[pendingStyleChange];
        return style?.name || pendingStyleChange;
    }, [pendingStyleChange]);

    const handleExport = useCallback(async () => {
        if (!videoId) return;

        setIsExporting(true);
        setStyleChangeError(null);

        try {
            const response = await fetch(`${apiUrl}/videos/render?video_id=${videoId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Export failed");
            }

            const data = await response.json();
            router.push(`/view/${data.jobId}`)
            console.log("Render job created:", data.jobId);

            // optional UI feedback
            alert("Export started successfully!");

        } catch (error) {
            console.error("Export error:", error);
            setStyleChangeError(
                error instanceof Error ? error.message : "Export failed"
            );
        } finally {
            setIsExporting(false);
        }
    }, [videoId, apiUrl, accessToken]);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <p className="text-sm text-gray-500">Loading project...</p>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
            <Navbar />

            {/* Error Toast */}
            {styleChangeError && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{styleChangeError}</span>
                    <button
                        onClick={() => setStyleChangeError(null)}
                        className="ml-2 text-red-600 hover:text-red-800"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-hidden">
                <div className="h-full grid grid-cols-2">
                    <div className="h-full flex flex-col items-center justify-center bg-gray-50/30 border-r border-gray-200 p-8">
                        <div className="relative w-full h-full max-h-[calc(100%-4rem)]">
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    margin: 'auto',
                                    aspectRatio: `${compositionWidth} / ${compositionHeight}`,
                                    maxHeight: '100%',
                                    maxWidth: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <VideoPlayer
                                    transcript={transcript}
                                    selectedStyle={selectedStyle}
                                    compositionWidth={compositionWidth}
                                    compositionHeight={compositionHeight}
                                    captionPadding={captionPadding}
                                    customStyleConfigs={customConfig ?? undefined}
                                    videoUrl={lowresUrl}
                                    videoInfo={videoInfo}
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex items-center gap-4 w-full max-w-sm bg-white border border-gray-200 rounded-xl px-4 py-3">
                            <span className="text-xs font-medium uppercase tracking-wider text-gray-500 shrink-0">
                                Position
                            </span>
                            <input
                                type="range"
                                min="0"
                                max={compositionHeight}
                                value={captionPadding}
                                onChange={(e) => setCaptionPadding(Number(e.target.value))}
                                className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-black hover:bg-gray-300 transition-colors"
                            />
                            <span className="text-[10px] font-mono text-gray-600 w-10 text-right">
                                {captionPadding}px
                            </span>
                        </div>
                    </div>

                    <div className="h-full bg-white flex flex-col overflow-hidden rounded-l-3xl">
                        {editingStyle ? (
                            <StyleEditor
                                config={customConfig || defaultStyleConfigs[editingStyle]}
                                onChange={handleStyleUpdate}
                                onBack={handleBackFromEditor}
                                onSave={handleSaveStyleConfig}
                                isSaving={isSavingStyle}
                                hasChanges={hasUnsavedChanges}
                            />
                        ) : (
                            <>
                                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 shrink-0">
                                    <div className="flex items-center gap-2 bg-gray-100/50 p-1 rounded-xl">
                                        <button
                                            onClick={() => setActiveTab('style')}
                                            className={`px-5 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all ${activeTab === 'style'
                                                ? 'bg-white text-black'
                                                : 'text-gray-400'
                                                }`}
                                        >
                                            Style
                                        </button>

                                        <button
                                            onClick={() => setActiveTab('captions')}
                                            className={`px-5 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all ${activeTab === 'captions'
                                                ? 'bg-white text-black'
                                                : 'text-gray-400'
                                                }`}
                                        >
                                            Captions
                                        </button>
                                    </div>

                                    {/* Export Button */}
                                    <button
                                        onClick={handleExport}
                                        disabled={isExporting}
                                        className={`
                                            px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl
                                            transition-all
                                            ${isExporting
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-black text-white hover:bg-gray-800 active:scale-[0.98]'
                                            }
                                        `}
                                    >
                                        {isExporting ? "Exporting..." : "Export"}
                                    </button>
                                </div>

                                {activeTab === 'style' ? (
                                    <StyleSelector
                                        selectedStyle={selectedStyle}
                                        onStyleSelect={handleStyleSelect}
                                        onEditStyle={handleEditStyle}
                                    />
                                ) : (
                                    <div className="flex-1 overflow-y-auto min-h-0">
                                        <OptimizedTranscriptEditor transcript={transcript} setTranscript={setTranscript} />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <StyleChangeDialog
                isOpen={!!pendingStyleChange}
                onClose={handleCancelStyleChange}
                onConfirm={handleConfirmStyleChange}
                styleName={pendingStyleName}
                isGenerating={isGenerating}
            />
        </div>
    );
}