"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ReferralTracker() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const via = searchParams.get("via");
        if (via) {
            localStorage.setItem("referral_code", via);
            document.cookie = `referral_code=${via}; max-age=2592000; path=/; SameSite=Lax`;

            // Track click on backend
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/referral/click/${via}`, {
                method: "POST",
            }).catch(() => { }); // silently fail
        }
    }, []);

    return null;
}