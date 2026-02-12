"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, ShoppingBag, Video, Download, X, Plus, Minus, Trash2 } from "lucide-react";
import { useMonnify } from "@/hooks/useMonnify";
import api from "@/lib/api";

import { useState, useEffect } from "react";

interface CartItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
    type: 'book';
}

export default function BooksPage() {
    const { initializePayment } = useMonnify();
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string, downloadUrl?: string }>({ type: null, msg: '' });

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await api.get("/api/books");
                setBooks(res.data);
                // Initialize default quantities to 1
                const initialQtys: { [key: string]: number } = {};
                res.data.forEach((b: any) => initialQtys[b.id] = 1);
                setQuantities(initialQtys);
            } catch (err) {
                console.error("Failed to fetch books", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const updateQty = (bookId: string, val: number) => {
        setQuantities(prev => ({
            ...prev,
            [bookId]: Math.max(1, (prev[bookId] || 1) + val)
        }));
    };

    const addToCart = (book: any) => {
        const qty = quantities[book.id] || 1;
        setCart(prev => {
            const existing = prev.find(item => item.id === book.id);
            if (existing) {
                return prev.map(item => item.id === book.id ? { ...item, quantity: item.quantity + qty } : item);
            }
            return [...prev, { id: book.id, title: book.title, price: book.price, quantity: qty, type: 'book' }];
        });
        setStatus({ type: 'success', msg: `Added ${qty} copies of "${book.title}" to cart!` });
        setTimeout(() => setStatus({ type: null, msg: '' }), 2000);
    };

    const removeFromCart = (bookId: string) => {
        setCart(prev => prev.filter(item => item.id !== bookId));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        if (cart.length === 0) return;

        setStatus({ type: null, msg: '' });
        setIsCartOpen(false);

        initializePayment({
            amount: cartTotal,
            customerName: "Guest User",
            customerEmail: "customer@example.com",
            reference: `BULK-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
            onSuccess: async (response) => {
                setStatus({ type: 'success', msg: 'Processing your order... please wait.' });

                try {
                    const transRef = response.transactionReference || response.paymentReference;
                    const verifyRes = await api.post("/api/monnify/verify", {
                        transactionReference: transRef,
                        cartItems: cart
                    });

                    if (verifyRes.data.success) {
                        const orderId = verifyRes.data.order.id;
                        setStatus({
                            type: 'success',
                            msg: 'Payment successful! Order recorded.',
                            downloadUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/invoice/${orderId}`
                        });
                        setCart([]); // Clear cart after success
                    } else {
                        throw new Error(verifyRes.data.message || "Verification failed");
                    }
                } catch (err: any) {
                    console.error("✗ Order Verification Failed:", err.response?.data || err.message);
                    setStatus({ type: 'error', msg: "Payment verified, but order recording failed. Support notified." });
                }
            }
        });
    };

    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen py-20 px-4 relative">
            {/* Status Notifications */}
            <AnimatePresence>
                {status.type && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl font-bold flex flex-col items-center gap-3 min-w-[300px] ${status.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                    >
                        <div className="flex items-center gap-3">
                            {status.type === 'success' ? <ShoppingCart size={20} fill="white" /> : <ShoppingBag size={20} />}
                            {status.msg}
                        </div>
                        {status.downloadUrl && (
                            <a href={status.downloadUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white text-green-700 px-4 py-2 rounded-lg text-sm shadow-md hover:bg-gray-100 transition">
                                <Download size={16} /> Download Proof
                            </a>
                        )}
                    </motion.div>
                )}

                {/* Video Modal */}
                {selectedVideo && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                            <video src={selectedVideo} controls autoPlay className="w-full h-full" />
                            <button onClick={() => setSelectedVideo(null)} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white">
                                <X size={24} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Shopping Cart Sidebar/Modal */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110]" />
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-[120] flex flex-col p-6">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                                    <ShoppingCart className="text-primary-600" />
                                    Your Cart
                                </h2>
                                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                {cart.length === 0 ? (
                                    <div className="text-center py-20 text-gray-500">
                                        <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                                        Your cart is empty
                                    </div>
                                ) : cart.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                                            <p className="text-xs text-primary-600 font-bold">₦{item.price.toLocaleString()} x {item.quantity}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-600">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 border-t dark:border-gray-800 pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">Grand Total</span>
                                    <span className="text-3xl font-black text-gray-900 dark:text-white">₦{cartTotal.toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={cart.length === 0}
                                    className="w-full bg-primary-600 text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition disabled:opacity-50 active:scale-[0.98]"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Floating Cart Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCartOpen(true)}
                className="fixed bottom-10 right-10 z-[90] bg-primary-600 text-white p-5 rounded-full shadow-2xl shadow-primary-600/40 flex items-center justify-center group"
            >
                <ShoppingCart size={28} />
                {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                        {cart.reduce((s, i) => s + i.quantity, 0)}
                    </span>
                )}
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold ml-2">
                    View Cart
                </span>
            </motion.button>

            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Pacesetters <span className="text-primary-600">Edu Services</span>
                    </motion.h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Premium educational materials for schools and educators. Bulk ordering supported.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-3 flex flex-col items-center justify-center py-20 gap-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                            <p className="text-gray-500">Loading catalog...</p>
                        </div>
                    ) : books.length === 0 ? (
                        <div className="col-span-3 text-center py-20 text-gray-500">No books available yet.</div>
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
                                    <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-700" />
                                )}
                                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 transition-transform group-hover:-translate-x-1">
                                    {book.videoUrl && (
                                        <button onClick={() => setSelectedVideo(book.videoUrl)} className="bg-white/90 dark:bg-gray-800/90 p-2.5 rounded-xl shadow-lg hover:scale-110 text-primary-600">
                                            <Video size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">{book.category}</span>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 mb-2 truncate">{book.title}</h3>
                                <div className="text-2xl font-black text-gray-900 dark:text-white mb-6">₦{book.price?.toLocaleString()}</div>

                                {/* Quantity Controls */}
                                <div className="flex items-center border dark:border-gray-800 rounded-xl mb-4 overflow-hidden bg-gray-50/50 dark:bg-gray-800/50">
                                    <button onClick={() => updateQty(book.id, -1)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"><Minus size={16} /></button>
                                    <input
                                        type="number"
                                        value={quantities[book.id] || 1}
                                        onChange={(e) => setQuantities({ ...quantities, [book.id]: Math.max(1, parseInt(e.target.value) || 1) })}
                                        className="w-full text-center bg-transparent font-bold text-gray-900 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <button onClick={() => updateQty(book.id, 1)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"><Plus size={16} /></button>
                                </div>

                                <button
                                    onClick={() => addToCart(book)}
                                    className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-md shadow-primary-500/20 active:scale-95"
                                >
                                    <ShoppingCart size={18} />
                                    Add to Cart
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
