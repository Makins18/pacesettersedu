"use client";

import { motion } from "framer-motion";

export default function Skeleton({ className }: { className?: string }) {
    return (
        <motion.div
            animate={{
                opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className={`bg-gray-200 dark:bg-gray-800 rounded-md ${className}`}
        />
    );
}

export function BookSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
            <Skeleton className="h-48 w-full mb-6" />
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-6" />
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-10 w-1/4" />
            </div>
        </div>
    );
}
