"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminGuard from "@/components/AdminGuard";
import { Plus, Edit2, Trash2, Search, Book, Loader2, Upload, Video, FileText } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";

export default function AdminBooks() {
    const [books, setBooks] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<any>(null);
    const [newBook, setNewBook] = useState({
        title: "", price: "", stock: "", category: "Early Years",
        imageUrl: "", videoUrl: "", fileUrl: "", description: ""
    });
    const [uploading, setUploading] = useState(false);

    const fetchBooks = async () => {
        try {
            const res = await api.get("/api/books");
            setBooks(res.data);
        } catch (err) {
            console.error("Fetch books failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
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
            setNewBook({ ...newBook, [field]: res.data.url });
        } catch (err) {
            alert("Upload failed. Ensure Cloudinary credentials are set in .env");
        } finally {
            setUploading(false);
        }
    };

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingBook
                ? `/api/books/${editingBook.id}`
                : `/api/books`;

            const method = editingBook ? 'put' : 'post';

            await api[method](url, newBook);
            setIsAddModalOpen(false);
            setEditingBook(null);
            setNewBook({
                title: "", price: "", stock: "", category: "Early Years",
                imageUrl: "", videoUrl: "", fileUrl: "", description: ""
            });
            fetchBooks();
        } catch (err) {
            alert("Action failed. Try again.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this book?")) return;
        try {
            await api.delete(`/api/books/${id}`);
            fetchBooks();
        } catch (err) {
            alert("Delete failed. Are you logged in as Admin?");
        }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminGuard>
            <div className="flex bg-gray-50 dark:bg-gray-950 min-h-screen">
                <AdminSidebar />
                <main className="flex-1 md:ml-64 p-4 md:p-8 pt-24 md:pt-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Books Management</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Add, edit, or remove books from the store.</p>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-500/20 active:scale-95"
                            >
                                <Plus size={20} />
                                Add New Book
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                            <StatCard icon={<Book className="text-blue-600" />} label="Total Books" value={books.length.toString()} />
                            <StatCard icon={<Search className="text-purple-600" />} label="In Stock" value="185" />
                            <StatCard icon={<Edit2 className="text-green-600" />} label="Categories" value="4" />
                        </div>

                        {/* Table Area */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by title..."
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-800/50">
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Book Title</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={5} className="py-10 text-center">
                                                    <Loader2 className="animate-spin inline-block mr-2" />
                                                    Loading books...
                                                </td>
                                            </tr>
                                        ) : filteredBooks.map((book) => (
                                            <motion.tr
                                                key={book._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{book.title}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wide">
                                                        {book.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">₦{book.price?.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{book.stock} pcs</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingBook(book);
                                                                setNewBook(book);
                                                                setIsAddModalOpen(true);
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(book._id)}
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

                {/* Add Book Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl p-8"
                        >
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                                {editingBook ? 'Edit Book' : 'Add New Book'}
                            </h2>
                            <form onSubmit={handleAddBook} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                                    <input
                                        required
                                        className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                        value={newBook.title}
                                        onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                    <textarea
                                        className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                        value={newBook.description}
                                        onChange={e => setNewBook({ ...newBook, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₦)</label>
                                        <input
                                            type="number" required
                                            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                            value={newBook.price}
                                            onChange={e => setNewBook({ ...newBook, price: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock</label>
                                        <input
                                            type="number" required
                                            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                            value={newBook.stock}
                                            onChange={e => setNewBook({ ...newBook, stock: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                    <select
                                        className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                        value={newBook.category}
                                        onChange={e => setNewBook({ ...newBook, category: e.target.value })}
                                    >
                                        <option>Early Years BK1</option>
                                        <option>Early Years BK2</option>
                                        <option>Early Years BK3</option>
                                        <option>Early Years BK4</option>
                                        <option>Primary 1</option>
                                        <option>Primary 2</option>
                                        <option>Primary 3</option>
                                        <option>Primary 4</option>
                                        <option>Primary 5</option>
                                        <option>Primary 6</option>
                                        <option>JSS 1</option>
                                        <option>JSS 2</option>
                                        <option>JSS 3</option>
                                        <option>SSS 1</option>
                                        <option>SSS 2</option>
                                        <option>SSS 3</option>
                                        <option>Professional</option>
                                        <option>Digital Literacy</option>
                                    </select>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase">Multimedia & Resources</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="relative">
                                            <label className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-primary-500 transition">
                                                <Upload size={18} className="text-gray-400" />
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    {newBook.imageUrl ? 'Image Uploaded ✓' : 'Add Cover Image'}
                                                </span>
                                                <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'imageUrl')} />
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <label className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-primary-500 transition">
                                                <Video size={18} className="text-gray-400" />
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    {newBook.videoUrl ? 'Video Uploaded ✓' : 'Add Sample Video'}
                                                </span>
                                                <input type="file" className="hidden" accept="video/*" onChange={e => handleFileUpload(e, 'videoUrl')} />
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <label className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-primary-500 transition">
                                                <FileText size={18} className="text-gray-400" />
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    {newBook.fileUrl ? 'Module Uploaded ✓' : 'Add Book Module (PDF)'}
                                                </span>
                                                <input type="file" className="hidden" accept=".pdf" onChange={e => handleFileUpload(e, 'fileUrl')} />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8 pt-4 border-t border-gray-100 italic">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddModalOpen(false);
                                            setEditingBook(null);
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
                                        {uploading ? 'Processing...' : (editingBook ? 'Update Book' : 'Save Book')}
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

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
    );
}
