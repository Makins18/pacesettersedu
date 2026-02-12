"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube, Mail, Phone, MessageCircle } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-primary-900 text-white mt-auto">
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <h3 className="text-xl font-bold mb-4">Pacesetters Edu Services</h3>
                        <p className="text-primary-100 text-sm leading-relaxed mb-6">
                            Empowering individuals with the art of eloquent communication and digital literacy. Join the league of Pacesetters today.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Facebook size={18} />} href="https://web.facebook.com/pacesetterseduservices/" />
                            <SocialIcon icon={<Instagram size={18} />} href="https://www.instagram.com/pacesettersphonics_diction/" />
                            <SocialIcon icon={<Youtube size={18} />} href="https://www.youtube.com/@pacesettersphonicsanddictiontv" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-6 text-primary-50">Company</h4>
                        <ul className="space-y-3 text-sm text-primary-200">
                            <li><FooterLink href="/about">About Us</FooterLink></li>
                            <li><FooterLink href="/ceo">Meet the CEO</FooterLink></li>
                            <li><FooterLink href="/services">Our Services</FooterLink></li>
                            <li><FooterLink href="/reviews">Testimonials</FooterLink></li>
                            <li><FooterLink href="/contact">Contact</FooterLink></li>
                            <li><FooterLink href="/admin/login" className="opacity-0 hover:opacity-100 transition-opacity text-[10px]">Staff Portal</FooterLink></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold mb-6 text-primary-50">Resources</h4>
                        <ul className="space-y-3 text-sm text-primary-200">
                            <li><FooterLink href="/books">Book Store</FooterLink></li>
                            <li><FooterLink href="/events">Upcoming Events</FooterLink></li>
                            <li><FooterLink href="#">Student Portal</FooterLink></li>
                            <li><FooterLink href="#">FAQs</FooterLink></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold mb-6 text-primary-50">Get in Touch</h4>
                        <ul className="space-y-4 text-sm text-primary-200">
                            <li className="flex items-start gap-3">
                                <Mail size={18} className="mt-0.5 shrink-0" />
                                <span>pacesetterspdieweb@gmail.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone size={18} className="mt-0.5 shrink-0" />
                                <span>0706 688 2674</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MessageCircle size={18} className="mt-0.5 shrink-0" />
                                <a
                                    href="https://wa.me/2347066882674"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white transition-colors underline"
                                >
                                    Chat on WhatsApp
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-primary-800">
                <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-xs text-primary-300">
                    <p>© {new Date().getFullYear()} Pacesetters Edu Services. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
    return (
        <a
            href={href}
            className="w-8 h-8 rounded-full bg-primary-800 flex items-center justify-center hover:bg-white hover:text-primary-900 transition-all duration-300"
        >
            {icon}
        </a>
    );
}

function FooterLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
    return (
        <Link href={href} className={`hover:text-white hover:translate-x-1 transition-all duration-200 inline-block ${className}`}>
            {children}
        </Link>
    );
}
