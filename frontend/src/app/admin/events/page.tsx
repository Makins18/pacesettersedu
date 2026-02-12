"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminGuard from "@/components/AdminGuard";
import { Plus, Edit2, Trash2, Calendar, MapPin, Tag, Loader2, Upload, Video, FileText } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";

export default function AdminEvents() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [newEvent, setNewEvent] = useState({
        title: "", date: "", location: "", price: "", slots: "50",
        category: "Masterclass", description: "", imageUrl: "", videoUrl: ""
    });
    const [uploading, setUploading] = useState(false);

    const fetchEvents = async () => {
        try {
            const res = await api.get("/api/events");
            setEvents(res.data);
        } catch (err) {
            console.error("Fetch events failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await api.post("/api/upload", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setNewEvent({ ...newEvent, [field]: res.data.url });
        } catch (err) {
            alert("Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingEvent
                ? `/api/events/${editingEvent.id}`
                : `/api/events`;

            const method = editingEvent ? 'put' : 'post';

            await api[method](url, newEvent);
            setIsAddModalOpen(false);
            setEditingEvent(null);
            setNewEvent({
                title: "", date: "", location: "", price: "", slots: "50",
                category: "Masterclass", description: "", imageUrl: "", videoUrl: ""
            });
            fetchEvents();
        } catch (err) {
            alert("Failed to save event.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            await api.delete(`/api/events/${id}`);
            fetchEvents();
        } catch (err) {
            alert("Delete failed. Administrative rights required.");
        }
    };

    return (
        <AdminGuard>
            <div className="flex bg-gray-50 dark:bg-gray-950 min-h-screen">
                <AdminSidebar />
                <main className="flex-1 md:ml-64 p-4 md:p-8 pt-24 md:pt-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Events & Trainings</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Manage masterclasses and professional workshops.</p>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-500/20 active:scale-95"
                            >
                                <Plus size={20} />
                                Schedule New Event
                            </button>
                        </div>

                        {/* Table Area */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-800/50">
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event Details</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Location</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pricing</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={5} className="py-10 text-center text-gray-500">
                                                    <Loader2 className="animate-spin inline-block mr-2" />
                                                    Loading events...
                                                </td>
                                            </tr>
                                        ) : events.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-10 text-center text-gray-500">No events found.</td>
                                            </tr>
                                        ) : events.map((event) => (
                                            <motion.tr
                                                key={event.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <h4 className="font-bold text-gray-900 dark:text-white">{event.title}</h4>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar size={14} className="text-primary-500" />
                                                            {new Date(event.date).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin size={14} className="text-primary-500" />
                                                            {event.location}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">
                                                        <Tag size={16} className="text-primary-600" />
                                                        ₦{event.price?.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${event.slots > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                                                        {event.slots > 0 ? "Open" : "Full"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingEvent(event);
                                                                setNewEvent({
                                                                    ...event,
                                                                    date: event.date ? new Date(event.date).toISOString().split('T')[0] : ""
                                                                });
                                                                setIsAddModalOpen(true);
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(event.id)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Add Event Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl p-8"
                        >
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                                {editingEvent ? 'Edit Event' : 'Schedule Event'}
                            </h2>
                            <form onSubmit={handleAddEvent} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Event Title</label>
                                    <input
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                        value={newEvent.title}
                                        onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                    <textarea
                                        className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                        value={newEvent.description}
                                        onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                                        <input
                                            type="date" required
                                            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                            value={newEvent.date}
                                            onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₦)</label>
                                        <input
                                            type="number" required
                                            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                            value={newEvent.price}
                                            onChange={e => setNewEvent({ ...newEvent, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                                        <input
                                            placeholder="Lagos / Hybrid"
                                            required
                                            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                            value={newEvent.location}
                                            onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                        <select
                                            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                            value={newEvent.category}
                                            onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}
                                        >
                                            <option>Masterclass</option>
                                            <option>Workshop</option>
                                            <option>Training</option>
                                            <option>Seminar</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase">Multimedia</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-primary-500 transition">
                                            <Upload size={20} className="text-gray-400 mb-1" />
                                            <span className="text-[10px] font-bold text-gray-500 uppercase">
                                                {newEvent.imageUrl ? 'Cover ✓' : 'Add Cover'}
                                            </span>
                                            <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'imageUrl')} />
                                        </label>
                                        <label className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-primary-500 transition">
                                            <Video size={20} className="text-gray-400 mb-1" />
                                            <span className="text-[10px] font-bold text-gray-500 uppercase">
                                                {newEvent.videoUrl ? 'Teaser ✓' : 'Add Teaser'}
                                            </span>
                                            <input type="file" className="hidden" accept="video/*" onChange={e => handleFileUpload(e, 'videoUrl')} />
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddModalOpen(false);
                                            setEditingEvent(null);
                                        }}
                                        className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-lg font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="flex-1 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 disabled:opacity-50"
                                    >
                                        {uploading ? 'Uploading...' : (editingEvent ? 'Update Event' : 'Save Event')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </AdminGuard>
    );
}
