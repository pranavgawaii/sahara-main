import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumHero } from '@/components/ui/hero';
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
                        ? 'bg-black/80 backdrop-blur-md border border-white/10 shadow-lg'
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
                    <span className={`text-[26px] font-dm font-bold tracking-tight drop-shadow-sm transition-colors duration-300 text-white`}>
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
                            className={`cursor-pointer transition-all duration-300 relative group py-2 text-white hover:text-white/80`}
                        >
                            {item.name}
                            <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center ${isScrolled ? 'bg-[#2E5A7D]' : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]'}`}></span>
                        </a>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-6">
                    <span
                        className={`hidden lg:block text-[15px] font-bold cursor-pointer transition-colors tracking-wide text-white hover:text-white/80`}
                        onClick={() => navigate('/auth/sign-in')}
                    >
                        Login
                    </span>
                    <Button
                        className={`hidden md:flex text-[15px] font-bold rounded-full px-8 h-[46px] shadow-lg transition-all duration-300 border-none transform hover:-translate-y-0.5
                        ${isScrolled
                                ? 'bg-white text-black hover:bg-white/90 shadow-[0_4px_14px_rgba(255,255,255,0.1)]'
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



import { ResourcesSection } from '@/components/landing/ResourcesSection';

// ... (existing imports)

// ... (Navbar component remains the same, but ensure links order matches)

export const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white font-inter selection:bg-[#6B9AC4]/30 selection:text-[#2E5A7D]">
            <Navbar />
            <PremiumHero />
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
