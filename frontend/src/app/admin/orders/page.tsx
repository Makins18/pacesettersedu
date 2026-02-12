"use client";
import { CheckCircle, Clock, ExternalLink, Filter, Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminGuard from "@/components/AdminGuard";

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    const filteredOrders = orders.filter(o =>
        o.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get("/api/monnify/orders");
                setOrders(res.data);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <AdminGuard>
            <div className="flex bg-gray-50 dark:bg-gray-950 min-h-screen">
                <AdminSidebar />
                <main className="flex-1 md:ml-64 p-4 md:p-8 pt-24 md:pt-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders & Transactions</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Track all sales and event registrations.</p>
                            </div>
                            <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
                                <Filter size={18} />
                                Filter
                            </button>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by Order ID or Customer..."
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <Loader2 className="animate-spin text-primary-600" size={40} />
                                        <p className="text-gray-500 font-medium">Fetching transactions...</p>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-20 text-gray-500">No orders found.</div>
                                ) : (
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-800/50">
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reference</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Items</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Invoice</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {filteredOrders.map((order) => (
                                                <motion.tr
                                                    key={order.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                                                >
                                                    <td className="px-6 py-4 font-mono text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase">{order.reference}</td>
                                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{order.userEmail}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 truncate max-w-[180px]">
                                                        {order.items?.map((i: any) => i.title).join(", ")}
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">₦{order.totalAmount?.toLocaleString()}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit ${order.paymentStatus === "paid"
                                                            ? "bg-green-50 text-green-600 ring-1 ring-green-100 dark:bg-green-900/20 dark:ring-green-900/50"
                                                            : "bg-orange-50 text-orange-600 ring-1 ring-orange-100 dark:bg-orange-900/20 dark:ring-orange-900/50"
                                                            }`}>
                                                            {order.paymentStatus === "paid" ? <CheckCircle size={12} /> : <Clock size={12} />}
                                                            {order.paymentStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-gray-400 hover:text-primary-600 transition-colors inline-flex items-center gap-1 text-sm font-medium">
                                                            View
                                                            <ExternalLink size={14} />
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}
