"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Auth Landing Page
 * Redirects to buyer sign-in by default
 */
export default function AuthPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to buyer sign-in by default
        router.push("/auth/buyer-sign-in");
    }, [router]);

    return null;
}
