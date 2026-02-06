'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/DashboardNavbar';
import { Upload, Video } from 'lucide-react';
import useLocalStorage from 'use-local-storage';

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

interface Project {
    id: number;
    name: string | null;
    original_url: string | null;
    low_res_url: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    current_style?: any;
    style_id?: number;
    transcript?: any;
}

export default function DashboardPage() {
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const [uploadState, setUploadState] = useState<UploadState>('idle');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [accessToken] = useLocalStorage("access_token", "");

    // State for projects
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [projectsError, setProjectsError] = useState<string | null>(null);

    // ========== FETCH PROJECTS ==========
    const fetchProjects = async () => {
        try {
            setIsLoadingProjects(true);
            setProjectsError(null);

            const response = await fetch(`${apiUrl}/videos/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }

            const data = await response.json();
            console.log('data', data)
            setProjects(data);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setProjectsError('Failed to load projects');
        } finally {
            setIsLoadingProjects(false);
        }
    };

    // Fetch projects on component mount
    useEffect(() => {
        if (accessToken) {
            fetchProjects();
        }
    }, [accessToken]);

    // ========== BACKEND UPLOAD FUNCTION ==========
    const uploadToBackend = async (file: File) => {
        try {
            setUploadState('uploading');
            setUploadProgress(5);
            setError(null);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("name", file.name);

            console.log('accessToken ggg', localStorage.getItem('access_token'));

            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) return prev;
                    return prev + Math.random() * 5;
                });
            }, 300);

            const response = await fetch(`${apiUrl}/uploads/video`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData
            });

            clearInterval(progressInterval);

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Upload failed");
            }

            const data = await response.json();

            setUploadProgress(100);
            setUploadState('success');

            const videoId = data.video_id;
            const originalUrl = data.original_url;
            const filename = data.name
            const user_id = data.user_id

            console.log('video id', videoId, 'full data', data)

            setTimeout(() => {
                router.push(`/style-selection?videoId=${encodeURIComponent(videoId)}&originalUrl=${encodeURIComponent(originalUrl)}&filename=${encodeURIComponent(filename)}&userId=${encodeURIComponent(user_id)}`);
            }, 500);

        } catch (err) {
            console.error(err);
            setUploadState('error');
            setError("Upload failed. Please try again.");
        }
    };

    // ========== FILE SELECT ==========
    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('video/')) return;

        setVideoFile(file);
        await uploadToBackend(file);

    }, []);

    // ========== DRAG & DROP ==========
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

    // ========== HELPER FUNCTIONS ==========
    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
        return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    };

    const handleProjectClick = (project: Project) => {
        router.push(`/player?videoId=${project.id}`);
    };

    return (
        <div className="h-screen w-full bg-white flex overflow-hidden">
            {/* Left Sidebar */}
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />

                <main className="flex-1 overflow-y-auto bg-gray-50/30">
                    <div className="max-w-5xl mx-auto p-8 space-y-8">

                        {/* Upload Section */}
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
                                <input
                                    id="video-upload"
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                {uploadState === 'idle' && (
                                    <div className="flex flex-col items-center gap-3 text-center p-6">
                                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                            <Upload className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-900 mb-0.5">
                                                Drop your video here or click to browse
                                            </p>
                                            <p className="text-[11px] text-gray-500">
                                                MP4, MOV, WebM up to 2GB
                                            </p>
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
                                                <div
                                                    className="h-full bg-black rounded-full transition-all duration-200"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                        {videoFile && (
                                            <p className="text-[11px] text-gray-500 truncate max-w-full">
                                                {videoFile.name}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {uploadState === 'success' && (
                                    <p className="text-green-500 text-sm">
                                        Upload successful ✓ Redirecting...
                                    </p>
                                )}

                                {uploadState === 'error' && (
                                    <p className="text-red-500 text-sm">{error}</p>
                                )}
                            </label>
                        </div>

                        {/* Projects Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-semibold text-gray-900">Recent Projects</h2>
                                {projects.length > 0 && (
                                    <button
                                        onClick={fetchProjects}
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
                                    <button
                                        onClick={fetchProjects}
                                        className="mt-2 text-xs text-gray-600 hover:text-gray-900 underline"
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : projects.length === 0 ? (
                                <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-500">No projects yet. Create your first one above!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 gap-3">
                                    {projects.map((project) => (
                                        <div
                                            key={project.id}
                                            onClick={() => handleProjectClick(project)}
                                            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow cursor-pointer group"
                                        >
                                            <div className="aspect-video bg-gray-100 relative">
                                                {project.low_res_url ? (
                                                    <video
                                                        src={project.low_res_url}
                                                        className="w-full h-full object-cover"
                                                        muted
                                                        playsInline
                                                    />
                                                ) : project.original_url ? (
                                                    <video
                                                        src={project.original_url}
                                                        className="w-full h-full object-cover"
                                                        muted
                                                        playsInline
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Video className="w-6 h-6 text-gray-300" />
                                                    </div>
                                                )}

                                                {project.status === 'processing' && (
                                                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm rounded text-[9px] font-medium text-white uppercase tracking-wider">
                                                        Processing
                                                    </div>
                                                )}

                                                {project.status === 'uploading' && (
                                                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-blue-500/80 backdrop-blur-sm rounded text-[9px] font-medium text-white uppercase tracking-wider">
                                                        Uploading
                                                    </div>
                                                )}

                                                {project.status === 'error' && (
                                                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-red-500/80 backdrop-blur-sm rounded text-[9px] font-medium text-white uppercase tracking-wider">
                                                        Error
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-3">
                                                <h3 className="text-xs font-medium text-gray-900 mb-0.5 group-hover:text-black transition-colors truncate">
                                                    {project.name || `Video ${project.id}`}
                                                </h3>
                                                <p className="text-[10px] text-gray-500">
                                                    {getRelativeTime(project.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}