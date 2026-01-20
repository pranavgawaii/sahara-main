import React from 'react';
import { Plus, Twitter, Linkedin, Instagram, Mail, Github } from 'lucide-react';

export const UnifiedFooter = () => {
    return (
        <footer className="bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white pt-20 pb-10 border-t border-slate-200 dark:border-white/10 transition-colors duration-300">
            <div className="max-w-[1240px] mx-auto px-6 md:px-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="md:col-span-4">
                        <div className="flex items-center gap-3 mb-6">
                            <img src="/sahara.png" alt="Sahara Logo" className="h-10 w-10 object-cover rounded-xl mix-blend-multiply dark:mix-blend-normal" />
                            <span className="text-2xl font-bold font-dm">Sahara</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 font-inter leading-relaxed mb-6">
                            Building a resilient future for students through accessible, anonymous, and professional mental health support. Your mind matters.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center hover:bg-blue-50 dark:hover:bg-[#2E5A7D] text-slate-700 dark:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center hover:bg-blue-50 dark:hover:bg-[#2E5A7D] text-slate-700 dark:text-white transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center hover:bg-blue-50 dark:hover:bg-[#2E5A7D] text-slate-700 dark:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center hover:bg-blue-50 dark:hover:bg-[#2E5A7D] text-slate-700 dark:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links Column */}
                    <div className="md:col-span-2 md:col-start-6">
                        <h4 className="text-lg font-bold font-dm mb-6 text-slate-900 dark:text-white">Platform</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors font-inter">Features</a></li>
                            <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors font-inter">Pricing</a></li>
                            <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors font-inter">For Universities</a></li>
                            <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors font-inter">Counselors</a></li>
                        </ul>
                    </div>

                    {/* Links Column */}
                    <div className="md:col-span-2">
                        <h4 className="text-lg font-bold font-dm mb-6 text-slate-900 dark:text-white">Resources</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors font-inter">Blog</a></li>
                            <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors font-inter">Crisis Support</a></li>
                            <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors font-inter">Community</a></li>
                            <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors font-inter">Mobile App</a></li>
                        </ul>
                    </div>

                    {/* Links Column */}
                    <div className="md:col-span-2">
                        <h4 className="text-lg font-bold font-dm mb-6 text-slate-900 dark:text-white">Company</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors font-inter">About Us</a></li>
                            <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors font-inter">Careers</a></li>
                            <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors font-inter">Privacy Policy</a></li>
                            <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors font-inter">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm font-inter">
                        © {new Date().getFullYear()} Sahara Mental Health. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm text-slate-500">
                        <a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
