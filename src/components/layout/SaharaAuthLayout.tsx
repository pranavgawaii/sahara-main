import React from 'react';
import { ModeToggle } from "@/components/mode-toggle";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SaharaAuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Particles configuration (same as LandingPage)
    const particles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${15 + Math.random() * 15}s`
    }));

    const navigate = useNavigate();

    return (
        <div className="min-h-screen relative bg-[#F5F1E8] dark:bg-black font-dm overflow-hidden transition-colors duration-500">

            {/* GLOBAL BACKGROUND FRAME */}
            <div
                className="fixed top-[15px] left-[15px] right-[15px] bottom-[15px] rounded-[30px] z-0 overflow-hidden shadow-[0_0_0_15px_white] dark:shadow-[0_0_0_15px_black] bg-gradient-to-b from-[#7FA4C8] to-[#9EC2DC] dark:from-[#0F172A] dark:to-[#020617] transition-all duration-500"
            >
                {/* Floating Particles */}
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="absolute w-[3px] h-[3px] bg-white rounded-full opacity-35 dark:opacity-20 animate-float-particle"
                        style={{
                            left: p.left,
                            top: p.top,
                            animationDelay: p.delay,
                            animationDuration: p.duration,
                            animationTimingFunction: 'ease-in-out'
                        }}
                    ></div>
                ))}

                {/* Navigation Controls */}
                <div className="absolute top-6 left-8 z-50">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium bg-black/10 dark:bg-white/5 px-4 py-2 rounded-full backdrop-blur-md"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back to Home</span>
                    </button>
                </div>

                <div className="absolute top-6 right-8 z-50">
                    <ModeToggle />
                </div>

                {/* Content Container (Centered) */}
                <div className="absolute inset-0 overflow-y-auto flex items-center justify-center p-4">
                    {children}
                </div>

            </div>
        </div>
    );
};

export default SaharaAuthLayout;
