"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Decode JWT without verification (client-side check only)
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");

            // No token = redirect to login
            if (!token) {
                router.replace("/admin/login");
                return;
            }

            // Dev Bypass Check
            if (token === "dev-token-bypass") {
                setIsAuthorized(true);
                setIsChecking(false);
                return;
            }

            // Parse and validate token
            const decoded = parseJwt(token);

            if (!decoded) {
                // Invalid token format
                localStorage.removeItem("token");
                localStorage.removeItem("admin");
                router.replace("/admin/login");
                return;
            }

            // Check if token is expired
            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp && decoded.exp < currentTime) {
                // Token expired
                localStorage.removeItem("token");
                localStorage.removeItem("admin");
                router.replace("/admin/login");
                return;
            }

            // STRICT: Check if user has admin role
            if (decoded.role !== "admin" && decoded.role !== "ADMIN") {
                // Not an admin
                localStorage.removeItem("token");
                localStorage.removeItem("admin");
                router.replace("/admin/login");
                return;
            }

            // All checks passed
            setIsAuthorized(true);
            setIsChecking(false);
        };

        checkAuth();
    }, [router]);

    if (isChecking || !isAuthorized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Verifying admin access...</p>
            </div>
        );
    }

    return <>{children}</>;
}
