import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Menu, Plus, MessageCircle, ChevronDown, Check, Quote, Shield, Linkedin, Twitter, Instagram, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';

export const LandingPage = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    // Safety check for i18n
    const [selectedLanguage, setSelectedLanguage] = useState(i18n?.language || 'en');
    const [isScrolled, setIsScrolled] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Floating Particles - Optimized with useMemo to prevent infinite re-renders
    const particles = React.useMemo(() => {
        return Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            delay: `${Math.random() * 5}s`,
            duration: `${6 + Math.random() * 8}s`,
            size: `${2 + Math.random() * 3}px`,
            opacity: 0.2 + Math.random() * 0.3,
            blur: Math.random() > 0.5
        }));
    }, []);

    // Simplified variants to avoid type errors
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <div className="min-h-screen font-inter relative overflow-x-hidden bg-slate-50">

            {/* GLOBAL BACKGROUND GRADIENT - FRAME EFFECT */}
            <div
                className="fixed top-[15px] left-[15px] right-[15px] bottom-[15px] rounded-[30px] z-[0] overflow-hidden shadow-[0_0_0_15px_white]"
                style={{
                    background: 'linear-gradient(180deg, #6B9AC4 0%, #7FA8CB 50%, #A3C4DC 100%)',
                }}
            >
                {/* Gradient Orbs */}
                <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-white opacity-[0.06] blur-[60px] animate-float-slow"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] rounded-full bg-[#A8D5BA] opacity-[0.08] blur-[80px] animate-float-slow" style={{ animationDelay: '2s' }}></div>

                {/* Floating Particles */}
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="absolute bg-white rounded-full animate-float-particle"
                        style={{
                            width: p.size,
                            height: p.size,
                            left: p.left,
                            top: p.top,
                            opacity: p.opacity,
                            animationDelay: p.delay,
                            animationDuration: p.duration,
                            filter: p.blur ? 'blur(0.5px)' : 'none',
                        }}
                    ></div>
                ))}

                {/* Corner Borders */}

            </div>

            {/* NAVIGATION BAR */}
            <div className={`fixed top-0 w-full z-50 flex justify-center transition-all duration-700 delay-0 ease-out ${isScrolled ? 'pt-2' : 'pt-[33px]'}`}>
                <nav className={`w-full max-w-[1240px] h-[72px] mx-6 md:mx-[60px] flex items-center justify-between rounded-[16px] px-[60px] transition-all duration-300 bg-white/25 backdrop-blur-[20px] border border-white/30 shadow-[0_8px_32px_rgba(31,38,135,0.15)]`}>

                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="w-[32px] h-[32px] rounded-full bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-transform duration-300 group-hover:scale-105">
                            <Plus className="w-[16px] h-[16px] text-[#6B9AC4]" strokeWidth={3.5} />
                        </div>
                        <span className="text-[22px] font-dm font-semibold text-white tracking-tight drop-shadow-sm">Sahara</span>
                    </div>

                    {/* Links */}
                    <div className="hidden lg:flex items-center gap-10 text-[15px] font-medium text-white/90">
                        {['Resources', 'Features', 'Pricing', 'Our Counselors'].map((item) => (
                            <a key={item} href="#" className="hover:text-white transition-all duration-300 relative group py-2 px-4 hover:bg-white/15 rounded-lg">
                                {item}
                                <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center shadow-[0_0_8px_rgba(255,255,255,0.5)]"></span>
                            </a>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="hidden md:flex text-[15px] font-semibold hover:bg-white/15 px-6 rounded-[10px] text-white hover:text-white transition-all">
                            Login
                        </Button>
                        <Button className="rounded-[24px] bg-white text-[#2E5A7D] hover:bg-white px-8 h-[48px] text-[15px] font-bold shadow-[0_4px_16px_rgba(255,255,255,0.3)] hover:shadow-[0_8px_24px_rgba(255,255,255,0.4)] hover:-translate-y-[2px] hover:scale-[1.02] transition-all duration-300 border-none">
                            Sign up
                        </Button>
                        <Button variant="ghost" size="icon" className="lg:hidden text-white">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </div>
                </nav>
            </div>

            {/* HERO SECTION */}
            <section className="pt-[180px] pb-[120px] px-[100px] max-w-[1240px] mx-auto min-h-[calc(100vh-80px)] flex flex-col items-center text-center relative z-10">

                <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-[820px] mx-auto z-20">
                    <h1 className="text-white text-[44px] md:text-[72px] font-dm font-bold leading-[1.1] tracking-[-0.02em] mb-[32px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
                        Students, not struggles
                    </h1>

                    <div className="space-y-[14px] text-white/95 text-[20px] font-normal max-w-[780px] mx-auto leading-[1.7]">
                        <p className="drop-shadow-sm">Get instant support from <span className="font-bold text-white px-1.5 py-0.5 rounded bg-gradient-to-r from-white/10 to-transparent shadow-[0_0_12px_rgba(255,255,255,0.3)]">AI counselors</span> that understand you.</p>
                        <p className="drop-shadow-sm">Access <span className="font-bold text-white shadow-[0_0_12px_rgba(255,255,255,0.3)]">unlimited</span>, <span className="font-bold text-white shadow-[0_0_12px_rgba(255,255,255,0.3)]">professional-grade</span> mental health resources.</p>
                        <p className="drop-shadow-sm">Save time, reduce stress with <span className="font-bold text-white shadow-[0_0_12px_rgba(255,255,255,0.3)]">24/7 confidential</span> support.</p>
                    </div>

                    {/* Portal Buttons */}
                    <div className="mt-[72px] animate-fade-in-up delay-600">
                        <div className="flex flex-col items-center mb-[28px]">
                            <p className="text-[12px] uppercase text-white/80 tracking-[0.2em] font-inter font-semibold mb-[12px]">CHOOSE YOUR PORTAL</p>
                            <div className="w-[60px] h-[2px] bg-white/30"></div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-[24px]">
                            {/* Student Portal */}
                            <div
                                onClick={() => navigate('/auth/sign-in?role=student')}
                                className="group w-full md:w-[240px] h-[58px] rounded-[29px] bg-gradient-to-br from-white to-[#F8F9FA] shadow-[0_8px_24px_rgba(255,255,255,0.35)] hover:shadow-[0_12px_32px_rgba(255,255,255,0.45)] flex items-center justify-between px-7 cursor-pointer transform hover:-translate-y-[3px] hover:scale-[1.03] transition-all duration-400 ease-out-back"
                            >
                                <span className="text-[#2E5A7D] text-[17px] font-bold group-hover:pl-1 transition-all">Student Portal</span>
                                <ArrowRight className="w-[16px] h-[16px] text-[#2E5A7D] transform group-hover:translate-x-1 transition-transform duration-300" strokeWidth={2.5} />
                            </div>

                            {/* Counselor Portal */}
                            <div
                                onClick={() => navigate('/counselor/login')}
                                className="group w-full md:w-[240px] h-[58px] rounded-[29px] bg-white/10 backdrop-blur-[10px] border-[2.5px] border-white/80 hover:border-white hover:bg-white/25 flex items-center justify-center cursor-pointer transform hover:-translate-y-[3px] shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(255,255,255,0.2)] transition-all duration-300"
                            >
                                <span className="text-white text-[17px] font-semibold whitespace-nowrap">Counselor Portal</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-[40px] left-1/2 transform -translate-x-1/2 animate-bounce-slow opacity-80">
                    <ChevronDown className="w-8 h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" strokeWidth={1.5} />
                </div>
            </section>

            {/* FEATURES SECTION (Modular) */}
            <div className="relative z-10 bg-slate-50">
                <FeaturesGrid />
            </div>
        </div>
    );
};

export default LandingPage;
