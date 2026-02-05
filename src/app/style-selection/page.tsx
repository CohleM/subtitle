'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UploadFlow } from '../../components/UploadFlow';
import { Navbar } from '../../components/DashboardNavbar';

export default function StyleSelectionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isGenerating, setIsGenerating] = useState(false);
    const [videoId, setVideoId] = useState<string>('');
    const [originalUrl, setOriginalUrl] = useState<string>('');

    useEffect(() => {
        const vid = searchParams.get('videoId');
        const url = searchParams.get('originalUrl');

        if (!vid || !url) {
            // Redirect back to dashboard if params are missing
            router.push('/dashboard');
            return;
        }

        setVideoId(decodeURIComponent(vid));
        setOriginalUrl(decodeURIComponent(url));
    }, [searchParams, router]);

    const handleStyleComplete = async (videoUrl: string, selectedStyle: string) => {
        setIsGenerating(true);

        // TODO: Add API call to process the video
        console.log('Video ID:', videoId);
        console.log('Original URL:', originalUrl);
        console.log('Selected Style:', selectedStyle);

        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsGenerating(false);
        // router.push('/editor'); // Redirect to editor or results
    };

    const handleCancel = () => {
        router.push('/dashboard');
    };

    if (isGenerating) {
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
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                            Home
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                            Upgrade
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar />
                    <div className="flex-1 flex items-center justify-center bg-gray-50/30">
                        <div className="text-center space-y-8">
                            <div className="flex justify-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-medium text-gray-900">Generating Captions</h1>
                                <p className="text-sm text-gray-500">This may take a few moments...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!videoId || !originalUrl) {
        return null; // Or a loading state
    }

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
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Home
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                        Upgrade
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <div className="flex-1 overflow-hidden">
                    <UploadFlow
                        videoUrl={originalUrl}
                        videoFileName={videoId}
                        onComplete={handleStyleComplete}
                        onCancel={handleCancel}
                    />
                </div>
            </div>
        </div>
    );
}
