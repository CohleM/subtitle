'use client';

import { Player } from '@remotion/player';
import { useEffect, useState, useMemo, memo, useCallback, useRef, Suspense } from 'react';
// import { Plus, Trash2, Monitor, Maximize, Wand2 } from 'lucide-react';
import { SubtitleGroup } from '../../../types/subtitles';
import { Main } from '../../remotion/Main';
import { StyleSelector } from '../../components/StyleSelector';
import { SubtitleStyleConfig } from '../../../types/style';
import { defaultStyleConfigs } from '../../config/styleConfigs';
import { StyleEditor } from '../../components/StyleEditor';
import { OptimizedTranscriptEditor } from '../../components/OptimizedTranscriptEditor';
import { Navbar } from '../../components/DashboardNavbar';
import { useSearchParams } from "next/navigation";
import useLocalStorage from 'use-local-storage';
import { AlertCircle, Save } from 'lucide-react';
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
    customStyleConfigs,
    videoUrl,
    videoInfo
}: {
    transcript: SubtitleGroup[];
    selectedStyle: string;
    compositionWidth: number;
    compositionHeight: number;
    captionPadding: number;
    customStyleConfigs?: SubtitleStyleConfig;
    videoUrl: string;
    videoInfo: VideoInfo
}) {
    const inputProps = useMemo(() => ({
        transcript,
        style: selectedStyle,
        captionPadding,
        customStyleConfigs: customStyleConfigs ?? defaultStyleConfigs[selectedStyle],
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

function PlayerPageContent() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const [accessToken] = useLocalStorage("access_token", "");
    const searchParams = useSearchParams();
    const videoId = searchParams.get("videoId");

    const [transcript, setTranscript] = useState<SubtitleGroup[]>([]);
    const [activeTab, setActiveTab] = useState<'style' | 'captions'>('captions');
    // const [isPortrait, setIsPortrait] = useState(true);
    const [selectedStyle, setSelectedStyle] = useState('basic');
    const [editingStyle, setEditingStyle] = useState<string | null>(null);
    const [customConfig, setCustomConfig] = useState<SubtitleStyleConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lowresUrl, setLowresUrl] = useState('')
    const [videoInfo, setVideoInfo] = useState<VideoInfo>({ width: 0, height: 0, duration: 0, fps: 0 });
    const router = useRouter();

    // NEW: Store the style table ID for auto-saving
    const [currentStyleTableId, setCurrentStyleTableId] = useState<number | null>(null);

    // NEW: Auto-save states for transcript
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedTranscriptRef = useRef<string>('');

    // NEW: Auto-save states for caption padding
    const [paddingSaveStatus, setPaddingSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const paddingSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedPaddingRef = useRef<number>(0);

    const [pendingStyleChange, setPendingStyleChange] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [styleChangeError, setStyleChangeError] = useState<string | null>(null);

    const [originalEditingConfig, setOriginalEditingConfig] = useState<SubtitleStyleConfig | null>(null);
    const [isSavingStyle, setIsSavingStyle] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [compositionWidth, setCompositionWidth] = useState(1080)
    const [compositionHeight, setCompositionHeight] = useState(1920)

    const [captionPadding, setCaptionPadding] = useState(0);

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
                if (!videoRes.ok) {
                    if (videoRes.status === 404) {
                        setStyleChangeError("404 Not Found");
                        return;
                    }
                    throw new Error(`HTTP error ${videoRes.status}`);
                }
                const video = await videoRes.json();

                const currentStyle = video.current_style;
                const styleKey = currentStyle?.id || "basic";
                const styleId = video.all_styles_mapping[styleKey];
                const capPadding = video.caption_padding || 0

                console.log('current style:', currentStyle, 'styleKey:', styleKey, 'styleId:', styleId);

                let styleTableData = null;
                if (styleId) {
                    setCurrentStyleTableId(styleId);

                    const styleRes = await fetch(`${apiUrl}/styles/${styleId}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        }
                    });
                    styleTableData = await styleRes.json();
                }

                const transcriptFromStyle = styleTableData?.styled_transcript || [];

                lastSavedTranscriptRef.current = JSON.stringify(transcriptFromStyle);
                lastSavedPaddingRef.current = capPadding;

                setCaptionPadding(capPadding)
                setTranscript(transcriptFromStyle);
                setCustomConfig(currentStyle ?? null);
                setSelectedStyle(styleKey);
                setLowresUrl(video.low_res_url);
                setCompositionHeight(video.height);
                setCompositionWidth(video.width);
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

    // NEW: Debounced auto-save effect for TRANSCRIPT
    useEffect(() => {
        if (isLoading || !currentStyleTableId || transcript.length === 0) return;

        const currentTranscriptHash = JSON.stringify(transcript);
        if (currentTranscriptHash === lastSavedTranscriptRef.current) return;

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        setSaveStatus('idle');

        saveTimeoutRef.current = setTimeout(async () => {
            setSaveStatus('saving');

            try {
                const response = await fetch(`${apiUrl}/styles/${currentStyleTableId}/transcript`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ styled_transcript: transcript }),
                });

                if (!response.ok) {
                    throw new Error(`Save failed: ${response.status}`);
                }

                lastSavedTranscriptRef.current = currentTranscriptHash;
                setSaveStatus('saved');

                setTimeout(() => setSaveStatus('idle'), 2000);

            } catch (error) {
                console.error('Auto-save failed:', error);
                setSaveStatus('error');
            }
        }, 800);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [transcript, currentStyleTableId, apiUrl, accessToken, isLoading]);

    // NEW: Debounced auto-save effect for CAPTION PADDING
    useEffect(() => {
        if (isLoading || !videoId) return;

        // Don't save if padding hasn't changed from last saved version
        if (captionPadding === lastSavedPaddingRef.current) return;

        // Clear existing timeout
        if (paddingSaveTimeoutRef.current) {
            clearTimeout(paddingSaveTimeoutRef.current);
        }

        // Set status to indicate pending save
        setPaddingSaveStatus('idle');

        // Debounced save - shorter delay for slider (300ms feels more responsive)
        paddingSaveTimeoutRef.current = setTimeout(async () => {
            setPaddingSaveStatus('saving');

            try {
                const response = await fetch(`${apiUrl}/videos/${videoId}/caption-padding`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ caption_padding: captionPadding }),
                });

                if (!response.ok) {
                    throw new Error(`Save failed: ${response.status}`);
                }

                // Update last saved value
                lastSavedPaddingRef.current = captionPadding;
                setPaddingSaveStatus('saved');

                // Clear "saved" status after 2 seconds
                setTimeout(() => setPaddingSaveStatus('idle'), 2000);

            } catch (error) {
                console.error('Caption padding auto-save failed:', error);
                setPaddingSaveStatus('error');
            }
        }, 5000); // 5000 sec for slider - more responsive than transcript

        // Cleanup timeout on unmount or padding change
        return () => {
            if (paddingSaveTimeoutRef.current) {
                clearTimeout(paddingSaveTimeoutRef.current);
            }
        };
    }, [captionPadding, videoId, apiUrl, accessToken, isLoading]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            if (paddingSaveTimeoutRef.current) {
                clearTimeout(paddingSaveTimeoutRef.current);
            }
        };
    }, []);

    // const currentStyleConfig = useMemo(() => {
    //     return customConfig || defaultStyleConfigs[selectedStyle];
    // }, [customConfig, selectedStyle]);

    const hasUnsavedChanges = useMemo(() => {
        if (!editingStyle || !originalEditingConfig) return false;
        return JSON.stringify(customConfig) !== JSON.stringify(originalEditingConfig);
    }, [customConfig, editingStyle, originalEditingConfig]);

    const handleStyleUpdate = useCallback((config: SubtitleStyleConfig) => {
        setCustomConfig(config);
    }, []);

    const handleEditStyle = useCallback((styleId: string) => {
        setEditingStyle(styleId);
        const configToEdit = customConfig || defaultStyleConfigs[styleId];
        setOriginalEditingConfig(JSON.parse(JSON.stringify(configToEdit)));
    }, [customConfig]);

    const handleBackFromEditor = useCallback(() => {
        setEditingStyle(null);
        setOriginalEditingConfig(null);
    }, []);

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
                if (result.result) {
                    setTranscript(result.result);
                    lastSavedTranscriptRef.current = JSON.stringify(result.result);
                }

                setOriginalEditingConfig(JSON.parse(JSON.stringify(config)));

                if (result.current_style) {
                    setCustomConfig(result.current_style);
                }
            }

        } catch (error) {
            console.error('Error saving style:', error);
            setStyleChangeError(error instanceof Error ? error.message : 'Failed to save style');
            throw error;
        } finally {
            setIsSavingStyle(false);
        }
    }, [videoId, apiUrl, accessToken]);

    const handleStyleSelect = useCallback((styleId: string) => {
        if (styleId === selectedStyle) return;

        const styleConfig = defaultStyleConfigs[styleId];
        if (!styleConfig) {
            console.error(`Style "${styleId}" not found`);
            return;
        }

        setPendingStyleChange(styleId);
    }, [selectedStyle]);

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
                    lastSavedTranscriptRef.current = JSON.stringify(result.result);
                }

                setSelectedStyle(pendingStyleChange);

                if (result.current_style) {
                    setCustomConfig(result.current_style);
                }

                if (result.style_id) {
                    setCurrentStyleTableId(result.style_id);
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

            // alert("Export started successfully!");

        } catch (error) {
            console.error("Export error:", error);
            setStyleChangeError(
                error instanceof Error ? error.message : "Export failed"
            );
        } finally {
            setIsExporting(false);
        }
    }, [videoId, apiUrl, accessToken, router]);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <p className="text-sm text-gray-500">Loading project...</p>
            </div>
        );
    }

    if (styleChangeError === "404 Not Found") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl font-semibold">404 Not Found</div>
            </div>
        );
    }



    return (
        <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
            {/* <Navbar /> */}
            <Navbar showLogo={true} />

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

                                    <div className="flex items-center gap-3">
                                        {/* Combined Save Status Indicator */}
                                        {activeTab === 'captions' && (
                                            <div className={`
                                                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                                                ${(saveStatus === 'saving' || paddingSaveStatus === 'saving') ? 'text-amber-600 bg-amber-50' : ''}
                                                ${(saveStatus === 'saved' && paddingSaveStatus === 'saved') ? 'text-green-600 bg-green-50' : ''}
                                                ${(saveStatus === 'error' || paddingSaveStatus === 'error') ? 'text-red-600 bg-red-50' : ''}
                                                ${(saveStatus === 'idle' && paddingSaveStatus === 'idle') ? 'text-gray-400' : ''}
                                            `}>
                                                <Save className="w-3.5 h-3.5" />
                                                <span>
                                                    {(saveStatus === 'saving' || paddingSaveStatus === 'saving') && 'Saving...'}
                                                    {(saveStatus === 'saved' && paddingSaveStatus === 'saved') && 'Saved'}
                                                    {(saveStatus === 'error' || paddingSaveStatus === 'error') && 'Save failed'}
                                                    {(saveStatus === 'idle' && paddingSaveStatus === 'idle') && ''}
                                                </span>
                                            </div>
                                        )}

                                        {/* Export Button */}
                                        <button
                                            onClick={handleExport}
                                            disabled={isExporting}
                                            className={`
                                                px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl
                                                transition-all
                                                ${isExporting
                                                    ? 'bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] cursor-not-allowed'
                                                    : 'bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-primary-hover)] active:scale-[0.98]'
                                                }
                                            `}
                                        >
                                            {isExporting ? "Exporting..." : "Export"}
                                        </button>
                                    </div>
                                </div>

                                {activeTab === 'style' ? (
                                    <StyleSelector
                                        selectedStyle={selectedStyle}
                                        onStyleSelect={handleStyleSelect}
                                        onEditStyle={handleEditStyle}
                                    />
                                ) : (
                                    <div className="flex-1 overflow-y-auto min-h-0">
                                        <OptimizedTranscriptEditor
                                            transcript={transcript}
                                            setTranscript={setTranscript}
                                        />
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

export default function Page() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center bg-white">
                <p className="text-sm text-gray-500">Loading player...</p>
            </div>
        }>
            <PlayerPageContent />
        </Suspense>
    );
}