"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
    const [mounted, setMounted] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setMounted(true);
        const theme = localStorage.getItem("theme");
        if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDark(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDark(true);
        }
    };

    if (!mounted) return null;

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Dark Mode"
        >
            {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
                <Moon className="w-5 h-5 text-gray-600" />
            )}
        </button>
    );
}
