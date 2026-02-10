"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminGuard from "@/components/AdminGuard";
import api from "@/lib/api";
import { Book as BookIcon, Calendar, TrendingUp, Loader2 } from "lucide-react";

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/api/monnify/stats");
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch stats");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <AdminGuard>
            <div className="flex bg-gray-50 dark:bg-gray-950 min-h-screen">
                <AdminSidebar />
                <main className="flex-1 md:ml-64 p-4 md:p-8 pt-24 md:pt-10">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard Overview</h1>

                    {loading ? (
                        <div className="flex items-center justify-center p-20">
                            <Loader2 className="animate-spin text-primary-600" size={32} />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white dark:bg-gray-900 p-6 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                                        <BookIcon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Books</p>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.books || 0}</h2>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-900 p-6 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Events</p>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.events || 0}</h2>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-900 p-6 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                    <div className="p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-xl">
                                        <TrendingUp size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Revenue</p>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">₦{stats?.revenue?.toLocaleString() || 0}</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-900 p-8 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Recent Performance</h3>
                                <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                    <div className="text-center">
                                        <p className="text-gray-400 font-medium">Automatic calculation engine active.</p>
                                        <p className="text-gray-400 text-sm">Tracking {stats?.salesCount || 0} successful orders across all products.</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </AdminGuard>
    );
}
