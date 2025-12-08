"use client";

import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-gray-50">
            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-indigo-200/30 via-purple-200/20 to-pink-200/30 blur-3xl animate-pulse"></div>
                <div className="absolute top-[40%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-blue-200/20 via-cyan-200/10 to-teal-200/20 blur-3xl animate-pulse [animation-delay:2s]"></div>
            </div>

            <NavBar />

            <main className="flex-grow relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                        >
                            Get in Touch
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-xl text-gray-600 max-w-2xl mx-auto font-medium"
                        >
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:col-span-1 space-y-8"
                        >
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/60">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                    Contact Information
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Email</h4>
                                            <p className="text-gray-600">support@filestorage.com</p>
                                            <p className="text-gray-600">sales@filestorage.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Phone</h4>
                                            <p className="text-gray-600">+1 (555) 123-4567</p>
                                            <p className="text-gray-600">Mon-Fri 9am-6pm EST</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-pink-100 rounded-xl text-pink-600">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Office</h4>
                                            <p className="text-gray-600">
                                                123 Storage Blvd, Suite 400<br />
                                                San Francisco, CA 94107
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
