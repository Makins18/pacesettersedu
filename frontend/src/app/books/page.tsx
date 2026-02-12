"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, ShoppingBag, Video, Download, X } from "lucide-react";
import { useMonnify } from "@/hooks/useMonnify";
import api from "@/lib/api";

import { useState, useEffect } from "react";

export default function BooksPage() {
    const { initializePayment } = useMonnify();
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string, downloadUrl?: string }>({ type: null, msg: '' });

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                // Implementing a cache-burst/revalidate strategy for the public catalog
                const res = await api.get("/api/books", {
                    headers: { 'Cache-Control': 'max-age=60' }
                });
                setBooks(res.data);
            } catch (err) {
                console.error("Failed to fetch books", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const handleCheckout = (book: any) => {
        setStatus({ type: null, msg: '' });
        console.log(`>>> Starting checkout for book: ${book.title}`);

        initializePayment({
            amount: book.price,
            customerName: "Guest User",
            customerEmail: "customer@example.com",
            reference: `BOOK-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
            onSuccess: async (response) => {
                console.log(">>> Monnify Payment Success Response:", response);
                setStatus({ type: 'success', msg: 'Processing your order... please wait.' });

                try {
                    const transRef = response.transactionReference || response.paymentReference;
                    console.log(">>> Sending Reference to Backend:", transRef);

                    const verifyRes = await api.post("/api/monnify/verify", {
                        transactionReference: transRef,
                        cartItems: [{
                            id: book.id,
                            title: book.title,
                            price: book.price,
                            type: 'book',
                            quantity: 1
                        }]
                    });

                    if (verifyRes.data.success) {
                        const orderId = verifyRes.data.order.id;
                        setStatus({
                            type: 'success',
                            msg: 'Payment successful! Order recorded.',
                            downloadUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/invoice/${orderId}`
                        });
                    } else {
                        throw new Error(verifyRes.data.message || "Verification failed");
                    }
                } catch (err: any) {
                    console.error("✗ Order Verification Failed:", err.response?.data || err.message);
                    const errMsg = err.response?.data?.message || "Payment verified by Monnify, but order recording failed. Support notified.";
                    setStatus({ type: 'error', msg: errMsg });
                }
            },
            onClose: (data) => console.log(">>> Monnify Checkout Closed:", data)
        });
    };

    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen py-20 px-4">
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
                            {status.type === 'success' ? <Star size={20} fill="white" /> : <ShoppingBag size={20} />}
                            {status.msg}
                        </div>

                        {status.downloadUrl && (
                            <motion.a
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                href={status.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-white text-green-700 px-4 py-2 rounded-lg text-sm shadow-md hover:bg-gray-100 transition"
                            >
                                <Download size={16} />
                                Download Proof of Purchase
                            </motion.a>
                        )}

                        <button onClick={() => setStatus({ type: null, msg: '' })} className="absolute top-2 right-2 opacity-50 hover:opacity-100 text-xs">Close</button>
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

            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        Pacesetters <span className="text-primary-600">Edu Services</span>
                    </motion.h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Premium educational materials designed to bridge the gap in Phonics, Diction, and Digital Literacy.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                            <p className="text-gray-500">Loading catalog...</p>
                        </div>
                    ) : books.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">No books available yet.</div>
                    ) : books.map((book, idx) => (
                        <motion.div
                            key={book.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-lg shadow-gray-200/40 dark:shadow-none group"
                        >
                            <div className="relative h-64 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                {book.imageUrl ? (
                                    <img
                                        src={book.imageUrl}
                                        alt={book.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-700" />
                                )}

                                {/* Overlay Icons for Multimedia */}
                                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 transition-transform group-hover:-translate-x-1">
                                    {book.videoUrl && (
                                        <button
                                            onClick={() => setSelectedVideo(book.videoUrl)}
                                            className="bg-white/90 dark:bg-gray-800/90 p-2.5 rounded-xl shadow-lg hover:scale-110 transition active:scale-95 text-primary-600"
                                            title="Watch Preview"
                                        >
                                            <Video size={20} />
                                        </button>
                                    )}
                                    {book.fileUrl && (
                                        <a
                                            href={book.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white/90 dark:bg-gray-800/90 p-2.5 rounded-xl shadow-lg hover:scale-110 transition active:scale-95 text-blue-600"
                                            title="Download Sample"
                                        >
                                            <Download size={20} />
                                        </a>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/5 transition-colors" />
                            </div>

                            <div className="p-6">
                                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                                    {book.category}
                                </span>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 mb-2 group-hover:text-primary-600 transition-colors">
                                    {book.title}
                                </h3>

                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center text-yellow-500">
                                        <Star size={14} fill="currentColor" />
                                        <span className="ml-1 text-sm font-bold text-gray-800 dark:text-gray-200">4.9</span>
                                    </div>
                                    <span className="text-xs text-gray-500">(15+ sales)</span>
                                </div>

                                <div className="flex items-center justify-between mt-6">
                                    <div>
                                        <span className="text-2xl font-black text-gray-900 dark:text-white">₦{book.price?.toLocaleString()}</span>
                                    </div>
                                    <button
                                        onClick={() => handleCheckout(book)}
                                        className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 transition shadow-md shadow-primary-500/20 active:scale-95"
                                    >
                                        <ShoppingCart size={16} />
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
