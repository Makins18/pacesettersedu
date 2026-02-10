import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, BookOpen, Calendar, ShoppingCart, Home, LogOut, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const links = [
        { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Books", href: "/admin/books", icon: <BookOpen size={20} /> },
        { name: "Events", href: "/admin/events", icon: <Calendar size={20} /> },
        { name: "Orders", href: "/admin/orders", icon: <ShoppingCart size={20} /> },
    ];

    const NavLink = ({ link }: { link: any }) => (
        <Link
            href={link.href}
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-6 py-3.5 transition-all ${pathname === link.href
                ? "bg-primary-800 text-white border-r-4 border-white"
                : "text-primary-100 hover:bg-primary-800/50 hover:text-white"
                }`}
        >
            {link.icon}
            <span className="font-medium">{link.name}</span>
        </Link>
    );

    return (
        <>
            {/* Mobile Toggle */}
            <div className="md:hidden fixed top-4 left-4 z-[60]">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 bg-primary-900 text-white rounded-lg shadow-lg"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[50] md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`w-64 bg-primary-900 text-white h-screen fixed top-0 left-0 pt-8 overflow-y-auto z-[55] transition-transform duration-300 border-r border-primary-800 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                }`}>
                <div className="px-6 mb-10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 overflow-hidden rounded-full border border-primary-400 group-hover:scale-105 transition-transform bg-white p-0.5">
                            <img
                                src="/logo.jpg?v=4"
                                alt="Logo"
                                className="w-full h-full object-contain rounded-full"
                            />
                        </div>
                        <div>
                            <h2 className="font-bold text-white text-sm tracking-tight leading-tight">Pacesetters</h2>
                            <p className="text-[9px] text-primary-300 font-bold tracking-widest uppercase">Admin Portal</p>
                        </div>
                    </Link>
                </div>
                <nav className="flex flex-col">
                    {links.map((link) => (
                        <NavLink key={link.name} link={link} />
                    ))}
                    <div className="mt-10 pt-6 border-t border-primary-800/50">
                        <Link href="/" className="flex items-center gap-3 px-6 py-3.5 text-primary-300 hover:text-white transition-all">
                            <Home size={20} />
                            <span>Back to Site</span>
                        </Link>
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                window.location.href = "/admin/login";
                            }}
                            className="w-full flex items-center gap-3 px-6 py-3.5 text-red-300 hover:text-red-100 transition-all text-left"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </nav>
            </aside>
        </>
    );
}
