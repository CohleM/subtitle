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
    const [_, setLocalStorage] = useLocalStorage("affiliate_access_token", "");


    const handleGoogleLoginSuccess = async (response: any) => {
        const token = response.credential;
        const referralCode = localStorage.getItem("referral_code") ?? null;

        try {
            // Changed: POST request to /auth/google with token in body
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/affiliate/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, referral_code: referralCode }), // Send token in request body
            });

            if (res.ok) {
                const data = await res.json();
                if (data.affiliate_access_token) {
                    // localStorage.setItem("access_token", data.access_token);
                    setLocalStorage(data.affiliate_access_token);
                    setIsSuccess(true);
                    push("/referral");
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
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
                {/* Base background */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(145deg, #FF3898 0%, #f51682 50%, #c4006a 100%)'
                }} />

                {/* Subtle noise texture overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
                    opacity: 0.4
                }} />

                {/* Soft glow circles */}
                <div style={{
                    position: 'absolute', top: '-100px', right: '-100px',
                    width: '450px', height: '450px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)'
                }} />
                <div style={{
                    position: 'absolute', bottom: '-80px', left: '-80px',
                    width: '380px', height: '380px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)'
                }} />

                <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .aff-fade-1 { animation: fadeUp 0.6s ease forwards 0.1s; opacity: 0; }
        .aff-fade-2 { animation: fadeUp 0.6s ease forwards 0.25s; opacity: 0; }
        .aff-fade-3 { animation: fadeUp 0.6s ease forwards 0.4s; opacity: 0; }
        .aff-fade-4 { animation: fadeUp 0.6s ease forwards 0.55s; opacity: 0; }
    `}</style>

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 10, padding: '3.5rem', maxWidth: '460px', width: '100%' }}>

                    {/* Badge */}
                    <div className="aff-fade-1" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '7px',
                        background: 'rgba(255,255,255,0.15)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '100px', padding: '5px 14px', marginBottom: '2.2rem'
                    }}>
                        <div style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            background: '#fff', boxShadow: '0 0 6px rgba(255,255,255,0.8)'
                        }} />
                        <span style={{
                            color: 'rgba(255,255,255,0.95)', fontSize: '11px',
                            fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase'
                        }}>
                            Affiliate Program
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="aff-fade-2">
                        <h2 style={{
                            fontFamily: 'Georgia, serif',
                            fontSize: 'clamp(2.6rem, 4vw, 3.4rem)',
                            fontWeight: 700,
                            lineHeight: 1.1,
                            color: '#fff',
                            marginBottom: '1rem'
                        }}>
                            Earn 30%<br />
                            <span style={{ opacity: 0.85 }}>on every customer</span><br />
                            <span style={{ opacity: 0.85 }}>you refer.</span>
                        </h2>
                    </div>

                    {/* Subline */}
                    <div className="aff-fade-2">
                        <p style={{
                            color: 'rgba(255,255,255,0.7)', fontSize: '14px',
                            lineHeight: 1.6, marginBottom: '2rem'
                        }}>
                            Share your link. Get paid every month.
                        </p>
                    </div>

                    {/* Payout cards */}
                    <div className="aff-fade-3" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2.5rem' }}>
                        {[
                            { plan: 'Premium', price: '$19/mo', earn: '+$5.70' },
                            { plan: 'Ultra', price: '$39/mo', earn: '+$11.70' },
                        ].map(item => (
                            <div key={item.plan} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                background: 'rgba(255,255,255,0.12)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '12px', padding: '13px 18px',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '7px', height: '7px', borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.9)'
                                    }} />
                                    <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: 500 }}>
                                        {item.plan}
                                    </span>
                                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                                        {item.price}
                                    </span>
                                </div>
                                <span style={{
                                    color: '#fff', fontWeight: 700, fontSize: '15px',
                                    fontFamily: 'monospace', letterSpacing: '-0.02em'
                                }}>
                                    {item.earn}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div style={{
                        height: '1px',
                        background: 'rgba(255,255,255,0.15)',
                        marginBottom: '1.8rem'
                    }} />

                    {/* Footer stats */}
                    <div className="aff-fade-4" style={{ display: 'flex', gap: '2.5rem' }}>
                        {[
                            { label: 'Commission', value: '30%' },
                            // { label: 'Cookie life', value: '30 days' },
                            { label: 'Payout', value: 'Monthly' },
                        ].map(s => (
                            <div key={s.label}>
                                <p style={{ color: '#fff', fontWeight: 700, fontSize: '17px', lineHeight: 1 }}>{s.value}</p>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '4px' }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
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