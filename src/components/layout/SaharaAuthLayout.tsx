import React from 'react';

const SaharaAuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Particles configuration (same as LandingPage)
    const particles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${15 + Math.random() * 15}s`
    }));

    return (
        <div className="min-h-screen relative bg-[#F5F1E8] font-dm overflow-hidden">

            {/* GLOBAL BACKGROUND FRAME */}
            <div
                className="fixed top-[15px] left-[15px] right-[15px] bottom-[15px] rounded-[30px] z-0 overflow-hidden shadow-[0_0_0_15px_white]"
                style={{ background: 'linear-gradient(180deg, #7FA4C8 0%, #9EC2DC 100%)' }}
            >
                {/* Floating Particles */}
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="absolute w-[3px] h-[3px] bg-white rounded-full opacity-35 animate-float-particle"
                        style={{
                            left: p.left,
                            top: p.top,
                            animationDelay: p.delay,
                            animationDuration: p.duration,
                            animationTimingFunction: 'ease-in-out'
                        }}
                    ></div>
                ))}

                {/* Content Container (Centered) */}
                <div className="absolute inset-0 overflow-y-auto flex items-center justify-center p-4">
                    {children}
                </div>

            </div>
        </div>
    );
};

export default SaharaAuthLayout;
