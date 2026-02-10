import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

export default function CEOPage() {
    return (
        <div className="py-10">
            <Container>
                <SectionTitle title="Meet the CEO" />

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-left">
                    <div className="w-full md:w-1/3 relative h-[450px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 group">
                        <img
                            src="/ceo.png"
                            alt="CEO of Pacesetters"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                            <p className="text-white font-bold">Haleemah Tijani Balogun</p>
                        </div>
                    </div>

                    <div className="w-full md:w-2/3">
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-2 leading-tight">Haleemah Tijani Balogun</h3>
                        <p className="text-xl text-primary-600 font-bold mb-8 flex items-center gap-2">
                            Founder & Managing Director
                        </p>

                        <div className="prose max-w-none text-gray-700 dark:text-gray-300 space-y-6 text-lg leading-relaxed font-medium">
                            <p className="first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-primary-600">
                                Welcome to Pacesetters Phonics and Diction Institute. We are dedicated to redefining communication excellence. Our mission is to bridge the gap in oral communication and digital literacy, empowering students with the confidence to speak and lead in a globalized world.
                            </p>
                            <p>
                                With years of research and passion for educational excellence, I established this institute to provide practical, result-oriented training in Phonics, Diction, and Elocution. We don't just teach; we transform voices and build legacies.
                            </p>
                            <div className="bg-primary-50 dark:bg-primary-900/10 p-6 rounded-2xl border-l-4 border-primary-600 italic">
                                "Our goal is to ensure every child and professional finds their voice and uses it to conquer the world."
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
