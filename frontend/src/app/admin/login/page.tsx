"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        // Dev Mode Bypass
        if (email === "dev@admin.com" && password === "dev") {
            setTimeout(() => {
                localStorage.setItem("token", "dev-token-bypass");
                router.push("/admin/dashboard");
            }, 800);
            return;
        }

        try {
            setError("");
            const res = await api.post("/api/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("admin", JSON.stringify(res.data.admin));
            router.push("/admin/dashboard");
        } catch (err) {
            setError("Invalid credentials or server error");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Secure access for PPDI Staff
                    </p>
                    <div className="mt-4 p-2 bg-primary-50 dark:bg-primary-900/10 rounded border border-primary-100 dark:border-primary-800/50 text-[10px] text-primary-600 dark:text-primary-400 font-medium">
                        Dev Access: email: <span className="font-bold">dev@admin.com</span> | pass: <span className="font-bold">dev</span>
                    </div>
                </div>

                <div className="mt-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/30"
                    >
                        {loading ? "Authenticating..." : "Sign In to Dashboard"}
                        {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                    </button>

                    <div className="text-center mt-4">
                        <Link href="/" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
