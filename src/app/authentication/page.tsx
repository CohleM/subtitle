"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { CheckCircle } from "lucide-react";
import useLocalStorage from "use-local-storage";

export default function Login() {
    const { push } = useRouter();
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [_, setLocalStorage] = useLocalStorage("access_token", "");

    const handleGoogleLoginSuccess = async (response: any) => {
        const token = response.credential;

        try {
            // Changed: POST request to /auth/google with token in body
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }), // Send token in request body
            });

            if (res.ok) {
                const data = await res.json();
                if (data.access_token) {
                    // localStorage.setItem("access_token", data.access_token);
                    setLocalStorage(data.access_token);
                    setIsSuccess(true);
                    push("/dashboard");
                } else {
                    setIsError(true);
                }
            } else {
                setIsError(true);
            }
        } catch (error) {
            setIsError(true);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left side - Image/GIF */}
            <div className="hidden lg:flex lg:w-1/2 bg-[var(--color-bg)] items-center justify-center p-12">
                <div className="max-w-md text-center">
                    {/* <img
                        src="/your-gif-or-image.gif"
                        alt="App preview"
                        className="w-full rounded-lg shadow-sm mb-6"
                    /> */}
                    <h2 className="text-4xl font-semibold text-[var(--color-primary)] mb-2">
                        Create stunning videos
                    </h2>
                    <p className="text-[var(--color-text-muted)]">
                        Edit transcripts, add stunning styles, and export in minutes.
                    </p>
                </div>
            </div>

            {/* Right side - Login */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
                <div className="w-full max-w-sm">
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Welcome back</h1>
                        <p className="text-neutral-500">Sign in to continue to your workspace</p>
                    </div>

                    <div className="space-y-4">
                        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                            <GoogleLogin
                                onSuccess={handleGoogleLoginSuccess}
                                onError={() => setIsError(true)}
                                width="100%"
                                size="large"
                                text="continue_with"
                                logo_alignment="center"
                                type="standard"
                                context="signin"
                            />
                        </GoogleOAuthProvider>

                        {isSuccess && (
                            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-700">Success! Redirecting...</span>
                            </div>
                        )}

                        {isError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                <span className="text-sm text-red-700">Sign in failed. Please try again.</span>
                            </div>
                        )}
                    </div>

                    <p className="mt-8 text-xs text-neutral-400 text-center">
                        By signing in, you agree to our Terms and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}