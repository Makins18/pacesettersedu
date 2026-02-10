"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import DarkModeToggle from "../ui/DarkModeToggle";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "About", href: "/about" },
        { name: "CEO", href: "/ceo" },
        { name: "Services", href: "/services" },
        { name: "Books", href: "/books" },
        { name: "Events", href: "/events" },
        { name: "Reviews", href: "/reviews" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled
                ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm py-2"
                : "bg-white dark:bg-gray-900 py-4"
                }`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-primary-500 group-hover:scale-105 transition-transform">
                        <Image
                            src="/logo.jpg?v=4"
                            alt="PPDI Logo"
                            width={48}
                            height={48}
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-900 dark:text-white leading-tight">Pacesetters</h1>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wider">EDU SERVICES</p>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pl-4 border-l border-gray-200 dark:border-gray-700">
                        <DarkModeToggle />
                    </div>
                </nav>

                <div className="md:hidden flex items-center gap-4">
                    <DarkModeToggle />
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-gray-700 dark:text-gray-300"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
                    >
                        <nav className="flex flex-col p-4 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
