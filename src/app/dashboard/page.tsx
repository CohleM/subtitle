'use client';

import { useState } from 'react';
import { UploadFlow } from '../../components/UploadFlow';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const [isGenerating, setIsGenerating] = useState(false);

    const handleUploadComplete = async (videoUrl: string, selectedStyle: string) => {
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
        // Optional: redirect to home or another page
        // router.push('/');
        console.log('Upload cancelled');
    };

    if (isGenerating) {
        return (
            <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
                {/* Navbar */}
                <nav className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-black rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xs">S</span>
                        </div>
                        <span className="font-medium text-gray-900 tracking-wide text-sm uppercase">Submagic</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">U</span>
                        </div>
                    </div>
                </nav>

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
        );
    }

    return (
        <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
            {/* Navbar */}
            <nav className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-black rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-xs">S</span>
                    </div>
                    <span className="font-medium text-gray-900 tracking-wide text-sm uppercase">Submagic</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">U</span>
                    </div>
                </div>
            </nav>

            {/* Upload Flow */}
            <div className="flex-1 overflow-hidden">
                <UploadFlow
                    onComplete={handleUploadComplete}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}