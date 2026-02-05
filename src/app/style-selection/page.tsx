'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UploadFlow } from '../../components/UploadFlow';
import { Navbar } from '../../components/DashboardNavbar';

export default function StyleSelectionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isGenerating, setIsGenerating] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [videoFileName, setVideoFileName] = useState<string>('');

    useEffect(() => {
        const video = searchParams.get('video');
        const filename = searchParams.get('filename');

        if (!video) {
            // Redirect back to dashboard if no video
            router.push('/dashboard');
            return;
        }

        setVideoUrl(decodeURIComponent(video));
        setVideoFileName(filename ? decodeURIComponent(filename) : 'Untitled Video');
    }, [searchParams, router]);

    const handleStyleComplete = async (videoUrl: string, selectedStyle: string) => {
        setIsGenerating(true);

        // TODO: Add your API call here to process the video
        console.log('Video URL:', videoUrl);
        console.log('Selected Style:', selectedStyle);

        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // After processing, redirect to editor or show results
        // router.push('/editor'); // Uncomment when you have an editor route
        setIsGenerating(false);
    };

    const handleCancel = () => {
        router.push('/dashboard');
    };

    if (isGenerating) {
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
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
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
                    {/* Navbar */}
                    <Navbar />

                    {/* Generating State */}
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
                            <div className="max-w-md mx-auto space-y-3">
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-black rounded-full animate-pulse" style={{ width: '60%' }} />
                                </div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">
                                    Processing your video
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!videoUrl) {
        return null; // or a loading state
    }

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
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
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
                {/* Navbar */}
                <Navbar />

                {/* Style Selection Flow */}
                <div className="flex-1 overflow-hidden">
                    <UploadFlow
                        videoUrl={videoUrl}
                        videoFileName={videoFileName}
                        onComplete={handleStyleComplete}
                        onCancel={handleCancel}
                    />
                </div>
            </div>
        </div>
    );
}