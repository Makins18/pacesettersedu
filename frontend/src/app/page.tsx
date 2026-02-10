"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Mic, Monitor, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen font-sans selection:bg-primary-500 selection:text-white">
            {/* Hero Section */}
            <section className="relative px-4 pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100 via-transparent to-transparent dark:from-primary-900/20 opacity-70"></div>
                </div>

                <div className="container mx-auto relative z-10 text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-primary-700 uppercase bg-primary-50 rounded-full dark:bg-primary-900/30 dark:text-primary-300 border border-primary-100 dark:border-primary-800">
                            Pacesetters Edu Services
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-8 leading-[1.1]">
                            Master the Art of <br />
                            <span className="text-primary-600 dark:text-primary-400">Communication</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of students enhancing their Eloquence, Phonics, and Digital Literacy skills with Pacesetters Edu Services. Your journey to excellence starts here.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/services" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all hover:scale-105 shadow-lg shadow-primary-500/20">
                                Explore Courses
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700">
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Floating Features Section (The "Bosses") */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Pacesetters?</h2>
                        <p className="text-gray-600 dark:text-gray-400">Discover our core pillars of excellence.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FloatingCard
                            icon={<Mic className="w-8 h-8 text-primary-600" />}
                            title="Phonics & Diction"
                            desc="Achieve flawless pronunciation and public speaking confidence through our specialized modules."
                            delay={0.1}
                        />
                        <FloatingCard
                            icon={<Monitor className="w-8 h-8 text-purple-600" />}
                            title="Digital Literacy"
                            desc="Master computer operations, graphics design, and essential digital skills for the modern world."
                            delay={0.2}
                        />
                        <FloatingCard
                            icon={<BookOpen className="w-8 h-8 text-green-600" />}
                            title="Educational Resources"
                            desc="Access our curated library of books and learning materials tailored for all age groups."
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* Stats / Trust Section */}
            <section className="py-20 border-t border-gray-100 dark:border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <StatItem number="500+" label="Students Trained" />
                        <StatItem number="50+" label="Expert Instructors" />
                        <StatItem number="100%" label="Satisfaction Rate" />
                        <StatItem number="24/7" label="Online Support" />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FloatingCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{
                y: -12,
                rotateX: 2,
                rotateY: 2,
                scale: 1.02,
                transition: { duration: 0.2 }
            }}
            className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 cursor-pointer perspective-1000"
        >
            <div className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {desc}
            </p>
        </motion.div>
    );
}

function StatItem({ number, label }: { number: string; label: string }) {
    return (
        <div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{number}</div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</div>
        </div>
    );
}
