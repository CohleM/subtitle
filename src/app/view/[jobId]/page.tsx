'use client';

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import useLocalStorage from "use-local-storage";

type RenderStatusResponse = {
    status?: string;
    progress?: number;
    videoUrl?: string;
    [key: string]: any; // allow backend to evolve safely
};

export default function RenderViewPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.jobId as string;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [accessToken] = useLocalStorage("access_token", "");

    const [data, setData] = useState<RenderStatusResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    // Detect completion generically
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

    // Poll render status
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
                console.log(json)
                setData(json);

                // Stop polling if finished
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

    // Loading state
    if (!data && !error) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <Loader2 className="animate-spin w-6 h-6 text-gray-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">

            {/* Header */}
            <div className="border-b border-gray-200 px-8 py-5 flex justify-between items-center">
                <div>
                    <h1 className="text-lg font-semibold">Render Job</h1>
                    <p className="text-xs text-gray-500 mt-1">Job ID: {jobId}</p>
                </div>

                <button
                    onClick={() => router.push("/dashboard")}
                    className="text-xs font-semibold uppercase tracking-wide px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                >
                    Back
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center p-10">

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-5 flex gap-3 items-center">
                        <XCircle className="text-red-500 w-5 h-5" />
                        <span className="text-red-700 text-sm font-medium">{error}</span>
                    </div>
                )}

                {!error && data && !isCompleted(data.status) && !isFailed(data.status) && (
                    <div className="w-full max-w-lg text-center">

                        {/* Spinner */}
                        <div className="flex justify-center mb-6">
                            <Loader2 className="animate-spin w-10 h-10 text-black" />
                        </div>

                        {/* Status */}
                        <h2 className="text-xl font-semibold mb-2">
                            {formatStatus(data.status)}
                        </h2>

                        {/* Progress */}
                        <div className="mt-6 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-black h-full transition-all duration-500"
                                style={{ width: `${data.progress ?? 10}%` }}
                            />
                        </div>

                        <p className="text-xs text-gray-500 mt-3">
                            {data.progress ?? 0}% complete
                        </p>

                    </div>
                )}

                {/* Completed */}
                {!error && data && isCompleted(data.status) && data.videoUrl && (
                    <div className="w-full max-w-4xl">

                        <div className="flex items-center gap-2 mb-6 justify-center">
                            <CheckCircle2 className="text-green-500 w-6 h-6" />
                            <h2 className="text-xl font-semibold">Render Complete</h2>
                        </div>

                        <video
                            src={data.videoUrl}
                            controls
                            autoPlay
                            className="w-full rounded-2xl border border-gray-200 shadow"
                        />

                    </div>
                )}

                {/* Failed */}
                {!error && data && isFailed(data.status) && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-5 flex gap-3 items-center">
                        <XCircle className="text-red-500 w-5 h-5" />
                        <span className="text-red-700 text-sm font-medium">
                            {formatStatus(data.status)}
                        </span>
                    </div>
                )}

            </div>
        </div>
    );
}
