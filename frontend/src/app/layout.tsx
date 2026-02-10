"use client";

import "./globals.css";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith("/admin");

    return (
        <html lang="en" className="scroll-smooth">
            <body className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 selection:bg-primary-500 selection:text-white">
                {!isAdminPage && <Header />}
                <main className={`flex-1 overflow-hidden ${!isAdminPage ? "pt-20" : ""}`}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
                {!isAdminPage && <Footer />}
            </body>
        </html>
    );
}
