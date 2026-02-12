'use client';

import { useEffect, useState, useRef, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, Download, Pencil } from "lucide-react";
import useLocalStorage from "use-local-storage";
import { Navbar } from '../../../components/DashboardNavbar';

type RenderStatusResponse = {
    status?: string;
    progress?: number;
    videoUrl?: string;
    [key: string]: any;
    videoId?: number;
};

function RenderViewPageContent() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.jobId as string;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [accessToken] = useLocalStorage("access_token", "");

    const [data, setData] = useState<RenderStatusResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    function isCompleted(status?: string) {
        if (!status) return false;
        return status.toLowerCase().includes("complete");
    }

    function isFailed(status?: string) {
        if (!status) return false;
        return status.toLowerCase().includes("fail");
    }

    function formatStatus(status?: string) {
        if (!status) return "Starting...";
        return status
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
    }

    useEffect(() => {
        if (!jobId) return;

        async function fetchStatus() {
            try {
                const res = await fetch(`${apiUrl}/videos/render/${jobId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch render status");

                const json = await res.json();
                setData(json);

                if (isCompleted(json.status) || isFailed(json.status)) {
                    if (pollingRef.current) {
                        clearInterval(pollingRef.current);
                        pollingRef.current = null;
                    }
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch render status");
            }
        }

        fetchStatus();
        pollingRef.current = setInterval(fetchStatus, 2000);

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [jobId, apiUrl, accessToken]);

    // Initial loading state — no data yet
    if (!data && !error) {
        return (
            <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
            <Navbar />

            <div className="flex-1 overflow-hidden flex items-center justify-center p-8">

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-5 flex gap-3 items-center">
                        <XCircle className="text-red-500 w-5 h-5 shrink-0" />
                        <span className="text-red-700 text-sm font-medium">{error}</span>
                    </div>
                )}

                {/* Rendering in progress */}
                {!error && data && !isCompleted(data.status) && !isFailed(data.status) && (
                    <div className="w-full max-w-md">

                        <div className="bg-white border border-gray-200 rounded-3xl p-10 flex flex-col items-center text-center">

                            <div className="mb-6">
                                <Loader2 className="animate-spin w-8 h-8 text-black" />
                            </div>

                            <h2 className="text-base font-semibold mb-1">
                                {formatStatus(data.status)}
                            </h2>

                            <p className="text-xs text-gray-400 font-mono mb-8">
                                {jobId}
                            </p>

                            {/* Progress bar */}
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-black h-full rounded-full transition-all duration-500"
                                    style={{ width: `${Math.max(data.progress ?? 0, 4)}%` }}
                                />
                            </div>

                            <p className="text-xs text-gray-400 mt-3 uppercase tracking-wider">
                                {data.progress ?? 0}% complete
                            </p>

                        </div>
                    </div>
                )}

                {/* Completed */}
                {!error && data && isCompleted(data.status) && data.videoUrl && (
                    <div className="w-full max-w-4xl flex flex-col items-center gap-6">

                        {/* Status badge */}
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                            <CheckCircle2 className="text-black w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-black">
                                Render Complete
                            </span>
                        </div>

                        {/* Video player */}
                        <div className="w-full bg-black overflow-hidden rounded-3xl border border-gray-200">
                            <video
                                src={data.videoUrl}
                                controls
                                // autoPlay
                                className="w-full max-h-[60vh] object-contain"
                            />
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3">
                            <a
                                href={data.videoUrl}
                                download={`video-${jobId}.mp4`}
                                className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all"
                            >
                                <Download className="w-3.5 h-3.5" />
                                Download
                            </a>

                            <button
                                onClick={() => router.push(`/player?videoId=${data.videoId}`)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-black text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                                Edit
                            </button>
                        </div>

                    </div>
                )}

                {/* Failed */}
                {!error && data && isFailed(data.status) && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-5 flex gap-3 items-center">
                        <XCircle className="text-red-500 w-5 h-5 shrink-0" />
                        <span className="text-red-700 text-sm font-medium">
                            {formatStatus(data.status)}
                        </span>
                    </div>
                )}

            </div>
        </div>
    );
}


export default function RenderViewPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center bg-white">
                <p className="text-sm text-gray-500">Loading...</p>
            </div>
        }>
            <RenderViewPageContent />
        </Suspense>
    );
}