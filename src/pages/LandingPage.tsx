import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsSection } from '@/components/landing/StatsSection';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { UnifiedFooter } from '@/components/landing/UnifiedFooter';

// Navbar Component
const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={`fixed top-0 w-full z-50 flex justify-center transition-all duration-500 ${isScrolled ? 'pt-4' : 'pt-[30px]'}`}>
            <nav
                className={`w-full max-w-[1240px] h-[72px] mx-6 md:mx-[60px] flex items-center justify-between rounded-full px-[32px] md:px-[60px] transition-all duration-500
                ${isScrolled
                        ? 'bg-white/90 backdrop-blur-md border border-slate-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
                        : 'bg-transparent border-transparent shadow-none'}
                `}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                    <img
                        src="/sahara.png"
                        alt="Sahara Logo"
                        className="h-10 w-10 object-cover rounded-xl mix-blend-multiply"
                    />
                    <span className={`text-[26px] font-dm font-bold tracking-tight drop-shadow-sm transition-colors duration-300 ${isScrolled ? 'text-[#2E5A7D]' : 'text-white'}`}>
                        Sahara
                    </span>
                </div>

                {/* Links */}
                <div className="hidden lg:flex items-center gap-10 text-[16px] font-semibold tracking-wide">
                    {[
                        { name: 'Resources', id: 'resources' },
                        { name: 'Features', id: 'features' },
                        { name: 'Pricing', id: 'pricing' },
                        { name: 'Our Counselors', id: 'testimonials' }
                    ].map((item) => (
                        <a
                            key={item.name}
                            onClick={() => scrollToSection(item.id)}
                            className={`cursor-pointer transition-all duration-300 relative group py-2 ${isScrolled ? 'text-slate-600 hover:text-[#2E5A7D]' : 'text-white hover:text-white/80'}`}
                        >
                            {item.name}
                            <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center ${isScrolled ? 'bg-[#2E5A7D]' : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]'}`}></span>
                        </a>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-6">
                    <span
                        className={`hidden lg:block text-[15px] font-bold cursor-pointer transition-colors tracking-wide ${isScrolled ? 'text-slate-600 hover:text-[#2E5A7D]' : 'text-white hover:text-white/80'}`}
                        onClick={() => navigate('/auth/sign-in')}
                    >
                        Login
                    </span>
                    <Button
                        className={`hidden md:flex text-[15px] font-bold rounded-full px-8 h-[46px] shadow-lg transition-all duration-300 border-none transform hover:-translate-y-0.5
                        ${isScrolled
                                ? 'bg-[#2E5A7D] hover:bg-[#1A3A5A] text-white shadow-[0_4px_14px_rgba(46,90,125,0.3)]'
                                : 'bg-white hover:bg-white/90 text-[#2E5A7D] shadow-[0_4px_14px_rgba(0,0,0,0.1)]'}
                        `}
                        onClick={() => navigate('/auth/sign-in')}
                    >
                        Sign up
                    </Button>
                    <Button variant="ghost" size="icon" className={`lg:hidden ${isScrolled ? 'text-slate-700' : 'text-white hover:bg-white/20'}`}>
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>
            </nav>
        </div>
    );
};

// Hero Section Component (Preserved)
const HeroSection = () => {
    const navigate = useNavigate();
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const particles = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${6 + Math.random() * 8}s`,
        size: `${2 + Math.random() * 3}px`,
        opacity: Math.random() * 0.5 + 0.3,
        blur: Math.random() > 0.5
    })), []);

    return (
        <div className="mx-3 md:mx-5 mt-3 md:mt-5 mb-0 rounded-[32px] md:rounded-[48px] bg-gradient-to-br from-[#8FB8E6] via-[#6B9AC4] to-[#4A789C] relative overflow-hidden min-h-[calc(100vh-40px)] flex flex-col items-center shadow-[0_4px_40px_rgba(107,154,196,0.3)]">

            {/* AMBIENT BACKGROUND */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-20%] w-[800px] h-[800px] rounded-full bg-white/10 blur-[100px] animate-pulse-slow mix-blend-overlay"></div>
                <div className="absolute bottom-[-10%] right-[-20%] w-[600px] h-[600px] rounded-full bg-[#f0f9ff]/10 blur-[100px] animate-pulse-slower mix-blend-overlay"></div>

                {/* Particles */}
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="absolute rounded-full bg-white/80 animate-float"
                        style={{
                            left: p.left,
                            top: p.top,
                            width: p.size,
                            height: p.size,
                            opacity: p.opacity,
                            animationDelay: p.delay,
                            animationDuration: p.duration,
                            filter: p.blur ? 'blur(0.5px)' : 'none',
                        }}
                    ></div>
                ))}
            </div>

            {/* HERO CONTENT */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-grow w-full px-6 pt-[160px] pb-[100px] text-center max-w-[1200px]">
                <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-[900px] mx-auto">
                    <h1 className="text-white text-[48px] md:text-[72px] font-dm font-bold leading-[1.1] tracking-[-0.02em] mb-[32px] drop-shadow-lg">
                        Mental Wellness for the <br className="hidden md:block" />Modern Student
                    </h1>

                    <div className="space-y-5 text-white/95 text-[20px] md:text-[24px] font-medium max-w-[800px] mx-auto leading-relaxed">
                        <p className="drop-shadow-sm">
                            Instant, anonymous support from <span className="font-bold text-white bg-white/15 px-3 py-1 rounded-xl border border-white/20 backdrop-blur-md shadow-sm">AI Counselors</span>.
                        </p>
                        <p className="drop-shadow-sm text-white/90 text-[18px] md:text-[20px] font-normal mt-2">
                            Unlimited access to <span className="font-semibold text-white border-b border-white/40 pb-0.5 hover:border-white transition-colors">Professional Resources</span>, available <span className="font-bold text-white">24/7</span>.
                        </p>
                    </div>

                    {/* Portal Buttons */}
                    <div className="mt-[80px] animate-fade-in-up delay-300">
                        <div className="flex flex-col items-center mb-[32px]">
                            <p className="text-[12px] uppercase text-white/70 tracking-[0.25em] font-inter font-bold mb-[16px]">CHOOSE YOUR PORTAL</p>
                            <div className="w-[40px] h-[3px] bg-white/20 rounded-full"></div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-[24px]">
                            {/* Student Portal */}
                            <div
                                onClick={() => navigate('/auth/sign-in?role=student')}
                                className="group w-full md:w-[260px] h-[64px] rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.4)] flex items-center justify-between px-8 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-white/50"
                            >
                                <span className="text-[#2E5A7D] text-[18px] font-bold">Student Portal</span>
                                <ArrowRight className="w-[20px] h-[20px] text-[#2E5A7D] transform group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                            </div>

                            {/* Counselor Portal */}
                            <div
                                onClick={() => navigate('/counselor/login')}
                                className="group w-full md:w-[260px] h-[64px] rounded-full bg-white/10 backdrop-blur-md border-[2px] border-white/30 hover:bg-white/20 hover:border-white/60 flex items-center justify-center cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <span className="text-white text-[17px] font-bold">Counselor Portal</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bouncing Arrow */}
                <div className="absolute bottom-10 animate-bounce-slow opacity-60">
                    <div className="w-6 h-6 border-b-2 border-r-2 border-white transform rotate-45"></div>
                </div>
            </div>
        </div>
    );
};

import { ResourcesSection } from '@/components/landing/ResourcesSection';

// ... (existing imports)

// ... (Navbar component remains the same, but ensure links order matches)

export const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white font-inter selection:bg-[#6B9AC4]/30 selection:text-[#2E5A7D]">
            <Navbar />
            <HeroSection />
            <div className="relative z-10">
                <StatsSection /> {/* Stats usually go right after Hero as Trust Signals */}

                <div id="resources"><ResourcesSection /></div>
                <div id="features"><FeaturesGrid /></div>
                <div id="pricing"><PricingSection /></div>
                <div id="testimonials"><TestimonialsSection /></div>

                <div id="faq"><FAQSection /></div>
                <UnifiedFooter />
            </div>
        </div>
    );
};

export default LandingPage;
