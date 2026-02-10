import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { History, Target, Eye, Award } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="py-20 bg-white dark:bg-gray-950 min-h-screen">
            <Container>
                <div className="max-w-4xl mx-auto">
                    <SectionTitle title="Our Story & Vision" subtitle="Setting the pace in educational excellence since 2016." />

                    <div className="grid md:grid-cols-2 gap-12 mt-16 mb-20 items-center">
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">A Legacy of Excellence</h3>
                            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                                <p>
                                    <strong>Pacesetters Phonics and Diction Institute</strong> is a premier educational center
                                    dedicated to the mastery of spoken English. Established in February 2016, we have
                                    consistently set the standard for excellence in oral communication training.
                                </p>
                                <p>
                                    From our base in Alagbado, Lagos, we reach a global audience through our virtual and
                                    physical training programs. We specialize in Diction, Elocution, Phonics for early years,
                                    and Digital Literacy.
                                </p>
                            </div>
                        </div>
                        <div className="bg-primary-50 dark:bg-primary-900/10 p-8 rounded-3xl border border-primary-100 dark:border-primary-800/50">
                            <History className="text-primary-600 mb-4" size={32} />
                            <h4 className="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">Since 2016</h4>
                            <p className="text-sm text-primary-700 dark:text-primary-300">Over 8 years of dedicated service to educational growth and vocal proficiency.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <InfoCard
                            icon={<Target className="text-red-500" />}
                            title="Our Mission"
                            desc="To empower individuals with the confidence and competence to communicate effectively in any setting."
                        />
                        <InfoCard
                            icon={<Eye className="text-blue-500" />}
                            title="Our Vision"
                            desc="To be the leading global voice in phonics and diction training, bridging communication gaps across borders."
                        />
                        <InfoCard
                            icon={<Award className="text-yellow-500" />}
                            title="Our Quality"
                            desc="We maintain rigorous standards in our curriculum, ensuring every student achieves measurable progress."
                        />
                    </div>
                </div>
            </Container>
        </div>
    );
}

function InfoCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="p-8 border border-gray-100 dark:border-gray-800 rounded-3xl bg-gray-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 transition-all">
            <div className="mb-4">{icon}</div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
        </div>
    );
}
