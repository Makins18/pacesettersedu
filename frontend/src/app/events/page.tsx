"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight, Tag, Video, X, Download } from "lucide-react";
import { useMonnify } from "@/hooks/useMonnify";
import api from "@/lib/api";

import { useState, useEffect } from "react";

export default function EventsPage() {
    const { initializePayment } = useMonnify();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string, downloadUrl?: string }>({ type: null, msg: '' });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get("/api/events");
                setEvents(res.data);
            } catch (err) {
                console.error("Failed to fetch events", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleRegister = (event: any) => {
        setStatus({ type: null, msg: '' });
        // Initializing payment directly as requested for production
        initializePayment({
            amount: event.price,
            customerName: "Guest Attendee",
            customerEmail: "attendee@example.com",
            reference: `EVT-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
            onSuccess: async (response) => {
                try {
                    const transRef = response.transactionReference || response.paymentReference;
                    console.log(">>> Sending Reference to Backend:", transRef);

                    const verifyRes = await api.post("/api/monnify/verify", {
                        transactionReference: transRef,
                        cartItems: [{
                            id: event.id,
                            title: event.title,
                            price: event.price,
                            type: 'event',
                            quantity: 1
                        }]
                    });

                    if (verifyRes.data.success) {
                        const orderId = verifyRes.data.order.id;
                        setStatus({
                            type: 'success',
                            msg: 'Registration Successful! Your spot is secured.',
                            downloadUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/ticket/${orderId}`
                        });
                    }
                } catch (err) {
                    console.error("Verification failed", err);
                    setStatus({ type: 'error', msg: 'Payment received, but registration failed. Support notified.' });
                }
            },
            onClose: (data) => console.log("Payment Closed", data)
        });
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-20 px-4">
            <AnimatePresence>
                {status.type && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl shadow-2xl font-bold flex flex-col items-center gap-3 min-w-[300px] ${status.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            {status.type === 'success' ? <Calendar size={20} /> : <Tag size={20} />}
                            {status.msg}
                        </div>

                        {status.downloadUrl && (
                            <motion.a
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                href={status.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-white text-primary-700 px-4 py-2 rounded-lg text-sm shadow-md hover:bg-gray-100 transition"
                            >
                                <Download size={16} />
                                Download Event Ticket
                            </motion.a>
                        )}

                        <button onClick={() => setStatus({ type: null, msg: '' })} className="absolute top-2 right-2 opacity-50 hover:opacity-100 text-xs text-white">Close</button>
                    </motion.div>
                )}

                {/* Video Modal */}
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                    >
                        <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20">
                            <video
                                src={selectedVideo}
                                controls
                                autoPlay
                                className="w-full h-full"
                            />
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-colors text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto max-w-5xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
                        >
                            Upcoming <span className="text-primary-600">Events</span>
                        </motion.h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Professional development and training sessions delivered by industry experts.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                            <p className="text-gray-500">Loading events schedule...</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300">
                            No upcoming events planned at the moment.
                        </div>
                    ) : events.map((event, idx) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-900/50 transition-all group"
                        >
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-64 bg-primary-600 flex flex-col justify-center items-center text-white relative overflow-hidden h-48 md:h-auto">
                                    {event.imageUrl ? (
                                        <img
                                            src={event.imageUrl}
                                            alt={event.title}
                                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                            <Calendar size={120} />
                                        </div>
                                    )}

                                    {/* Video Teaser Button directly on image */}
                                    {event.videoUrl && (
                                        <button
                                            onClick={() => setSelectedVideo(event.videoUrl)}
                                            className="absolute md:relative z-20 bg-white/20 hover:bg-white/40 p-4 rounded-full backdrop-blur-md transition-all scale-0 group-hover:scale-100 mb-4 border border-white/30"
                                        >
                                            <Video size={32} />
                                        </button>
                                    )}

                                    <div className="relative z-10 flex flex-col items-center bg-black/20 w-full h-full justify-center">
                                        <span className="text-4xl font-black mb-1 leading-none">
                                            {new Date(event.date).getDate()}
                                        </span>
                                        <span className="uppercase text-sm font-bold tracking-widest">
                                            {new Date(event.date).toLocaleString('default', { month: 'short' })}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 p-8 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-[10px] font-bold uppercase ring-1 ring-primary-100 dark:ring-primary-800">
                                                {event.category || 'Event'}
                                            </span>
                                            <div className="flex items-center text-xs text-green-600 font-bold">
                                                <Users size={14} className="mr-1" />
                                                {event.slots || 50} spots left
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 transition-colors">
                                            {event.title}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-primary-500" />
                                                {new Date(event.date).toDateString()}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-primary-500" />
                                                {event.location}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-2">
                                            <Tag size={20} className="text-primary-600" />
                                            <span className="text-2xl font-black text-gray-900 dark:text-white">₦{event.price?.toLocaleString()}</span>
                                        </div>
                                        <button
                                            onClick={() => handleRegister(event)}
                                            className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-bold hover:scale-105 transition active:scale-95 shadow-lg group"
                                        >
                                            Get Tickets
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
