import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { Mic, Monitor, PenTool, Layout, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ServicesPage() {
    return (
        <div className="py-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
            <Container>
                <div className="text-center mb-16">
                    <SectionTitle
                        title="Our Specialized Services"
                        subtitle="Industry-leading training programs designed for schools, professionals, and organizations."
                    />
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
                    <ServiceCard
                        icon={<Mic className="text-primary-600" size={32} />}
                        title="English, Phonics and Diction"
                        desc="Master the art of spoken English with our comprehensive phonics and diction training. Tailored for pupils, students, and professionals seeking clarity and confidence."
                        features={["Elocution Mastery", "Classroom Diction", "Spoken English Proficiency"]}
                    />
                    <ServiceCard
                        icon={<Monitor className="text-blue-600" size={32} />}
                        title="Digital Literacy Training"
                        desc="Equip yourself with essential computer skills for the modern world. We cover foundational knowledge to advanced productivity tools."
                        features={["Computer Fundamentals", "Internet Safety", "Productivity Software"]}
                    />
                    <ServiceCard
                        icon={<PenTool className="text-purple-600" size={32} />}
                        title="Graphics Design"
                        desc="Unlock your creativity with hands-on graphics design training. Learn to create stunning visuals for branding, social media, and educational materials."
                        features={["Visual Branding", "Design Principles", "Software Mastery"]}
                    />
                    <ServiceCard
                        icon={<Layout className="text-emerald-600" size={32} />}
                        title="Computer Operations"
                        desc="Professional training in day-to-day computer operations. Ideal for administrative staff and students preparing for the digital workforce."
                        features={["System Management", "Data Processing", "Technical Support"]}
                    />
                </div>
            </Container>
        </div>
    );
}

function ServiceCard({ icon, title, desc, features }: { icon: React.ReactNode; title: string; desc: string; features: string[] }) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none hover:border-primary-500/50 transition-all group">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {desc}
            </p>
            <ul className="space-y-3">
                {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        {f}
                    </li>
                ))}
            </ul>
        </div>
    );
}
