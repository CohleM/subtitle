'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/DashboardNavbar';
import { Upload, Video, Pencil, Eye, Loader2 } from 'lucide-react';
import useLocalStorage from 'use-local-storage';

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

interface Project {
    id: number;
    name: string | null;
    original_url: string | null;
    low_res_url: string | null;
    status: string;           // uploaded | processing | ready | error
    progress: number;         // 0-100  ← new field
    current_step: string;     // "downloading" | "transcribing" etc. ← new field
    created_at: string;
    updated_at: string;
    current_style?: any;
    style_id?: number;
    transcript?: any;
    render_job_id?: any;
}

// Human-readable labels for each pipeline step
const STEP_LABELS: Record<string, string> = {
    queued: 'Queued...',
    downloading: 'Downloading...',
    converting: 'Converting to low-res...',
    extracting_audio: 'Extracting audio...',
    transcribing: 'Transcribing...',
    applying_styles: 'Applying styles...',
    completed: 'Finishing up...',
};

function getStepLabel(step: string): string {
    return STEP_LABELS[step] ?? 'Processing...';
}

export default function DashboardPage() {
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const [uploadState, setUploadState] = useState<UploadState>('idle');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [accessToken] = useLocalStorage("access_token", "");

    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [projectsError, setProjectsError] = useState<string | null>(null);

    // Polling interval ref — so we can clear it when no longer needed
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // ─── Check if any project is currently processing ───────────────────────
    const hasProcessingVideos = (list: Project[]) =>
        list.some((p) => p.status === 'processing');

    // ─── Fetch all projects ──────────────────────────────────────────────────
    const fetchProjects = useCallback(async (showLoadingSpinner = true) => {
        try {
            if (showLoadingSpinner) {
                setIsLoadingProjects(true);
            }
            setProjectsError(null);

            const response = await fetch(`${apiUrl}/videos/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch projects');

            const data: Project[] = await response.json();
            setProjects(data);
            return data;
        } catch (err) {
            console.error('Error fetching projects:', err);
            setProjectsError('Failed to load projects');
            return null;
        } finally {
            setIsLoadingProjects(false);
        }
    }, [accessToken, apiUrl]);

    // ─── Polling logic ───────────────────────────────────────────────────────
    // Starts polling every 3s while any video is processing.
    // Stops automatically once all are done.
    const startPolling = useCallback(() => {
        if (pollIntervalRef.current) return; // already polling

        pollIntervalRef.current = setInterval(async () => {
            const updated = await fetchProjects(false); // silent refresh, no spinner

            if (updated && !hasProcessingVideos(updated)) {
                // All done — stop polling
                clearInterval(pollIntervalRef.current!);
                pollIntervalRef.current = null;
            }
        }, 3000);
    }, [fetchProjects]);

    const stopPolling = useCallback(() => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }
    }, []);

    // Initial fetch on mount
    useEffect(() => {
        if (!accessToken) return;

        fetchProjects(true).then((data) => {
            if (data && hasProcessingVideos(data)) {
                startPolling();
            }
        });

        return () => stopPolling(); // cleanup on unmount
    }, [accessToken]);

    // If a new project comes in that's processing, make sure polling is running
    useEffect(() => {
        if (hasProcessingVideos(projects)) {
            startPolling();
        }
    }, [projects]);

    // ─── Upload ──────────────────────────────────────────────────────────────
    const uploadToBackend = async (file: File) => {
        try {
            setUploadState('uploading');
            setUploadProgress(5);
            setError(null);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("name", file.name);

            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) return prev;
                    return prev + Math.random() * 5;
                });
            }, 300);

            const response = await fetch(`${apiUrl}/uploads/video`, {
                method: "POST",
                headers: { Authorization: `Bearer ${accessToken}` },
                body: formData,
            });

            clearInterval(progressInterval);

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Upload failed");
            }

            const data = await response.json();
            setUploadProgress(100);
            setUploadState('success');

            setTimeout(() => {
                router.push(
                    `/style-selection?videoId=${encodeURIComponent(data.video_id)}&originalUrl=${encodeURIComponent(data.original_url)}&filename=${encodeURIComponent(data.name)}&userId=${encodeURIComponent(data.user_id)}`
                );
            }, 500);

        } catch (err) {
            console.error(err);
            setUploadState('error');
            setError("Upload failed. Please try again.");
        }
    };

    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('video/')) return;
        setVideoFile(file);
        await uploadToBackend(file);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) {
            const input = document.getElementById('video-upload') as HTMLInputElement;
            if (input) {
                const dt = new DataTransfer();
                dt.items.add(file);
                input.files = dt.files;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    }, []);

    const getDisplayTime = (project: Project) => {
        const created = new Date(project.created_at).getTime();
        const updated = project.updated_at ? new Date(project.updated_at).getTime() : 0;

        // Return the more recent timestamp
        if (updated > created) {
            return { time: project.updated_at, label: 'updated' };
        }
        return { time: project.created_at, label: 'created' };
    };


    // ─── Helpers ─────────────────────────────────────────────────────────────
    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
        return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    };

    const isProcessing = (project: Project) => project.status === 'processing';
    const isClickable = (project: Project) => project.status === 'ready';

    const handleEdit = (e: React.MouseEvent, project: Project) => {
        e.stopPropagation();
        if (!isClickable(project)) return;
        router.push(`/player?videoId=${project.id}`);
    };

    const handleView = (e: React.MouseEvent, project: Project) => {
        e.stopPropagation();
        if (!isClickable(project)) return;
        if (project.render_job_id) {
            router.push(`/view/${project.render_job_id}`);
        }
    };

    const handleCardClick = (project: Project) => {
        if (!isClickable(project)) return;
        router.push(`/player?videoId=${project.id}`);
    };

    // ─── Render ──────────────────────────────────────────────────────────────
    return (
        <div className="h-screen w-full bg-white flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-black rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xs">S</span>
                        </div>
                        <span className="font-medium text-gray-900 tracking-wide text-sm uppercase">Submagic</span>
                    </div>
                </div>
                <nav className="flex-1 px-4 space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Upgrade
                    </button>
                </nav>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />

                <main className="flex-1 overflow-y-auto bg-gray-50/30">
                    <div className="max-w-5xl mx-auto p-8 space-y-8">

                        {/* Upload */}
                        <div className="space-y-3">
                            <h2 className="text-base font-semibold text-gray-900">Create New Project</h2>
                            <label
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                className={`
                                    relative flex flex-col items-center justify-center
                                    w-full h-44 rounded-lg border-2 border-dashed
                                    transition-all duration-300 cursor-pointer
                                    ${uploadState === 'uploading'
                                        ? 'border-black bg-gray-50'
                                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50 bg-white'
                                    }
                                `}
                            >
                                <input id="video-upload" type="file" accept="video/*" onChange={handleFileSelect} className="hidden" />

                                {uploadState === 'idle' && (
                                    <div className="flex flex-col items-center gap-3 text-center p-6">
                                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                            <Upload className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-900 mb-0.5">Drop your video here or click to browse</p>
                                            <p className="text-[11px] text-gray-500">MP4, MOV, WebM up to 2GB</p>
                                        </div>
                                    </div>
                                )}

                                {uploadState === 'uploading' && (
                                    <div className="flex flex-col items-center gap-4 w-full max-w-xs px-6">
                                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center animate-pulse">
                                            <Video className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="w-full space-y-1.5">
                                            <div className="flex justify-between text-[11px] font-medium">
                                                <span className="text-gray-700">Uploading...</span>
                                                <span className="text-gray-900">{Math.round(uploadProgress)}%</span>
                                            </div>
                                            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-black rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                                            </div>
                                        </div>
                                        {videoFile && <p className="text-[11px] text-gray-500 truncate max-w-full">{videoFile.name}</p>}
                                    </div>
                                )}

                                {uploadState === 'success' && <p className="text-green-500 text-sm">Upload successful ✓ Redirecting...</p>}
                                {uploadState === 'error' && <p className="text-red-500 text-sm">{error}</p>}
                            </label>
                        </div>

                        {/* Projects */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-base font-semibold text-gray-900">Recent Projects</h2>
                                    {/* Live indicator — shows when polling is active */}
                                    {pollIntervalRef.current && (
                                        <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                                            Live
                                        </span>
                                    )}
                                </div>
                                {projects.length > 0 && (
                                    <button
                                        onClick={() => fetchProjects(false)}
                                        className="text-[10px] font-medium text-gray-600 hover:text-gray-900 uppercase tracking-wider"
                                    >
                                        Refresh
                                    </button>
                                )}
                            </div>

                            {isLoadingProjects ? (
                                <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500">Loading projects...</p>
                                </div>
                            ) : projectsError ? (
                                <div className="text-center py-8 bg-white rounded-lg border border-red-200">
                                    <p className="text-xs text-red-500">{projectsError}</p>
                                    <button onClick={() => fetchProjects()} className="mt-2 text-xs text-gray-600 hover:text-gray-900 underline">Try again</button>
                                </div>
                            ) : projects.length === 0 ? (
                                <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500">No projects yet. Create your first one above!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 gap-3">
                                    {[...projects]
                                        .sort((a, b) => {
                                            const aDate = new Date(a.updated_at || a.created_at).getTime();
                                            const bDate = new Date(b.updated_at || b.created_at).getTime();
                                            return bDate - aDate; // newest first
                                        })
                                        .map((project) => {
                                            const processing = isProcessing(project);
                                            const clickable = isClickable(project);

                                            return (
                                                <div
                                                    key={project.id}
                                                    onClick={() => handleCardClick(project)}
                                                    className={`
            bg-white rounded-lg border overflow-hidden transition-all duration-200 group
            ${clickable
                                                            ? 'border-gray-200 hover:shadow-sm cursor-pointer'
                                                            : 'border-gray-100 cursor-not-allowed opacity-80'
                                                        }
          `}
                                                >
                                                    {/* Thumbnail */}
                                                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                                        {project.low_res_url ? (
                                                            <video src={project.low_res_url} className="w-full h-full object-cover" muted playsInline />
                                                        ) : project.original_url ? (
                                                            <video src={project.original_url} className="w-full h-full object-cover" muted playsInline />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Video className="w-6 h-6 text-gray-300" />
                                                            </div>
                                                        )}

                                                        {/* ── Processing overlay ── */}
                                                        {processing && (
                                                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 px-4">
                                                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                                                                <p className="text-[10px] text-white/90 font-medium text-center leading-tight">
                                                                    {getStepLabel(project.current_step)}
                                                                </p>
                                                                {/* Progress bar */}
                                                                <div className="w-full h-0.5 bg-white/20 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                                                                        style={{ width: `${project.progress ?? 0}%` }}
                                                                    />
                                                                </div>
                                                                <p className="text-[9px] text-white/50 font-medium tabular-nums">
                                                                    {project.progress ?? 0}%
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* ── Status badges (non-processing) ── */}
                                                        {project.status === 'error' && (
                                                            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-red-500/90 backdrop-blur-sm rounded text-[9px] font-medium text-white uppercase tracking-wider">
                                                                Error
                                                            </div>
                                                        )}
                                                        {project.status === 'uploaded' && (
                                                            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-gray-500/80 backdrop-blur-sm rounded text-[9px] font-medium text-white uppercase tracking-wider">
                                                                Pending
                                                            </div>
                                                        )}

                                                        {/* ── Hover actions — only when ready ── */}
                                                        {clickable && (
                                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={(e) => handleEdit(e, project)}
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-[11px] font-semibold rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
                                                                >
                                                                    <Pencil className="w-3 h-3" />
                                                                    Edit
                                                                </button>
                                                                {project.render_job_id && (
                                                                    <button
                                                                        onClick={(e) => handleView(e, project)}
                                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-[11px] font-semibold rounded-lg hover:bg-gray-800 active:scale-95 transition-all"
                                                                    >
                                                                        <Eye className="w-3 h-3" />
                                                                        View
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Card footer */}
                                                    <div className="p-3">
                                                        <h3 className="text-xs font-medium text-gray-900 mb-0.5 truncate">
                                                            {project.name || `Video ${project.id}`}
                                                        </h3>
                                                        <p className="text-[10px] text-gray-500">
                                                            {(() => {
                                                                const { time, label } = getDisplayTime(project);
                                                                return `${label} ${getRelativeTime(time)}`;
                                                            })()}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}