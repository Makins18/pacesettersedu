"use client";
import { CheckCircle, Clock, ExternalLink, Filter, Search, Loader2, Plus, X, Book, Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminGuard from "@/components/AdminGuard";

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [books, setBooks] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [manualOrder, setManualOrder] = useState({
        userEmail: "",
        items: [] as any[]
    });

    const filteredOrders = orders.filter(o =>
        o.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ordersRes, booksRes, eventsRes] = await Promise.all([
                api.get("/api/monnify/orders"),
                api.get("/api/books"),
                api.get("/api/events")
            ]);
            setOrders(ordersRes.data);
            setBooks(booksRes.data);
            setEvents(eventsRes.data);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (manualOrder.items.length === 0) return alert("Select at least one item.");

        setSubmitting(true);
        try {
            const total = manualOrder.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
            await api.post("/api/monnify/manual", {
                ...manualOrder,
                totalAmount: total
            });
            setIsManualModalOpen(false);
            setManualOrder({ userEmail: "", items: [] });
            fetchData();
        } catch (err) {
            alert("Failed to create manual order.");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleItem = (item: any, type: 'book' | 'event') => {
        const exists = manualOrder.items.find((i: any) => i.id === item.id && i.type === type);
        if (exists) {
            setManualOrder({
                ...manualOrder,
                items: manualOrder.items.filter((i: any) => !(i.id === item.id && i.type === type))
            });
        } else {
            setManualOrder({
                ...manualOrder,
                items: [...manualOrder.items, { ...item, type, quantity: 1 }]
            });
        }
    };

    return (
        <AdminGuard>
            <div className="flex bg-gray-50 dark:bg-gray-950 min-h-screen">
                <AdminSidebar />
                <main className="flex-1 md:ml-64 p-4 md:p-8 pt-24 md:pt-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders & Transactions</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Track all sales and event registrations.</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsManualModalOpen(true)}
                                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-500/20"
                                >
                                    <Plus size={18} />
                                    Create Manual Order
                                </button>
                                <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
                                    <Filter size={18} />
                                    Filter
                                </button>
                            </div>
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

                <AnimatePresence>
                    {isManualModalOpen && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl p-8"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Manual Order</h2>
                                    <button onClick={() => setIsManualModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                                </div>

                                <form onSubmit={handleManualSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Customer Email</label>
                                        <input
                                            type="email" required
                                            placeholder="customer@example.com"
                                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                            value={manualOrder.userEmail}
                                            onChange={e => setManualOrder({ ...manualOrder, userEmail: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="block text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                                <Book size={14} /> Select Books
                                            </label>
                                            <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-100 dark:border-gray-800 rounded-xl p-3">
                                                {books.map(book => (
                                                    <label key={book.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!manualOrder.items.find(i => i.id === book.id && i.type === 'book')}
                                                            onChange={() => toggleItem(book, 'book')}
                                                            className="rounded text-primary-600 focus:ring-primary-500"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{book.title}</p>
                                                            <p className="text-[10px] text-gray-500">₦{book.price?.toLocaleString()}</p>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                                <CalendarIcon size={14} /> Select Events
                                            </label>
                                            <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-100 dark:border-gray-800 rounded-xl p-3">
                                                {events.map(event => (
                                                    <label key={event.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!manualOrder.items.find(i => i.id === event.id && i.type === 'event')}
                                                            onChange={() => toggleItem(event, 'event')}
                                                            className="rounded text-primary-600 focus:ring-primary-500"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{event.title}</p>
                                                            <p className="text-[10px] text-gray-500">₦{event.price?.toLocaleString()}</p>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl flex justify-between items-center">
                                        <span className="text-sm font-bold text-primary-800 dark:text-primary-300">Total Calculation</span>
                                        <span className="text-xl font-black text-primary-900 dark:text-primary-100">
                                            ₦{manualOrder.items.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsManualModalOpen(false)}
                                            className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:scale-105 transition disabled:opacity-50"
                                        >
                                            {submitting ? 'Creating...' : 'Create Order & Send PDF'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </AdminGuard>
    );
}
