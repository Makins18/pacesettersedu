import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

export default function ContactPage() {
    return (
        <div className='py-10'>
            <Container>
                <SectionTitle title="Contact Us" subtitle="Get in touch with us for enquiries and registrations." />

                <div className="max-w-2xl mx-auto border rounded-xl p-8 bg-white shadow-sm">
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 p-3 rounded-full text-blue-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Email</h4>
                                <p className="text-gray-600">pacesetterspdieweb@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 p-3 rounded-full text-blue-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Phone</h4>
                                <p className="text-gray-600">
                                    <a href="https://wa.me/2347066882674" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        Chat with us (0706 688 2674)
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 p-3 rounded-full text-blue-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Location</h4>
                                <p className="text-gray-600">Orelope House, 1 Adurayemi bus stop, Alagbado, Lagos, Nigeria</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
                            <div className="flex gap-4">
                                <ContactSocialLink icon="Facebook" href="https://web.facebook.com/pacesetterseduservices/" color="text-blue-600 bg-blue-50" />
                                <ContactSocialLink icon="Instagram" href="https://www.instagram.com/pacesettersphonics_diction/" color="text-pink-600 bg-pink-50" />
                                <ContactSocialLink icon="YouTube" href="https://www.youtube.com/@pacesettersphonicsanddictiontv" color="text-red-600 bg-red-50" />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

function ContactSocialLink({ icon, href, color }: { icon: string; href: string; color: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 active:scale-95 ${color}`}
        >
            {icon}
        </a>
    );
}
