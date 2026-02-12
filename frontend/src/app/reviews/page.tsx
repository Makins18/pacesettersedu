import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { Quote, Star } from "lucide-react";

const reviews = [
    {
        name: "Abiodun Owolabi",
        role: "School Administrator",
        content: "The level of professionalism and the impact on our students' speech has been nothing short of transformative. A true partner in excellence.",
        stars: 3
    },
    {
        name: "Mrs. Adeyemi",
        role: "Parent",
        content: "I've seen a massive boost in my children's reading and speaking confidence. The PDIE series is truly well-researched.",
        stars: 4
    },
    {
        name: "Olawale Johnson",
        role: "Corporate Professional",
        content: "The digital literacy training gave me the edge I needed in my career. Practical, clear, and highly valuable.",
        stars: 5
    },
    {
        name: "Sister Mary",
        role: "Educational Consultant",
        content: "Foundational phonics has never been this accessible. The Pacesetters team are experts in their field.",
        stars: 5
    }
];

export default function ReviewsPage() {
    return (
        <div className="py-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
            <Container>
                <div className="text-center mb-16">
                    <SectionTitle title="Client Success Stories" subtitle="Join thousands of satisfied students and institutions worldwide." />
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {reviews.map((review, index) => (
                        <div key={index} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none hover:-translate-y-1 transition-all">
                            <div className="flex gap-1 mb-6">
                                {[...Array(review.stars)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <Quote className="text-primary-100 dark:text-primary-900/20 mb-4" size={40} />
                            <p className="text-gray-700 dark:text-gray-300 text-lg italic mb-8 leading-relaxed">
                                "{review.content}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center font-bold text-primary-600">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white leading-none mb-1">{review.name}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
