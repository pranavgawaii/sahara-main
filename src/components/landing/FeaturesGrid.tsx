import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Heart, Radio, Lock, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
    {
        icon: Shield,
        title: "Anonymous & Secure",
        desc: "Your identity is protected with military-grade encryption. Speak freely without fear.",
        color: "text-blue-500",
        bg: "bg-blue-50"
    },
    {
        icon: Clock,
        title: "24/7 Availability",
        desc: "Access support whenever you need it. Crisis don't wait for business hours.",
        color: "text-purple-500",
        bg: "bg-purple-50"
    },
    {
        icon: Heart,
        title: "Empathetic AI",
        desc: "Our AI counselors are trained to listen, understand, and support you securely.",
        color: "text-rose-500",
        bg: "bg-rose-50"
    },
    {
        icon: Radio,
        title: "Daily Check-ins",
        desc: "Track your mood and progress with simple, non-intrusive daily interactions.",
        color: "text-amber-500",
        bg: "bg-amber-50"
    },
    {
        icon: Lock,
        title: "Private Journaling",
        desc: "A safe space to write down your thoughts. Encrypted and for your eyes only.",
        color: "text-emerald-500",
        bg: "bg-emerald-50"
    },
    {
        icon: Zap,
        title: "Instant Matching",
        desc: "Connect with professional human counselors instantly when you need extra support.",
        color: "text-cyan-500",
        bg: "bg-cyan-50"
    }
];

export const FeaturesGrid = () => {
    return (
        <section className="py-32 bg-slate-50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-blue-50/50 rounded-full blur-[120px] mix-blend-multiply"></div>
                <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[100px] mix-blend-multiply"></div>
            </div>

            <div className="max-w-[1240px] mx-auto px-6 md:px-20 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-[#6B9AC4] font-semibold tracking-wider uppercase text-sm mb-4 block"
                    >
                        Why Students Choose Sahara
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-[#2E5A7D] font-dm mb-6 leading-tight"
                    >
                        Professional Care,<br />Redefined for Students.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-500 font-inter leading-relaxed"
                    >
                        We combine advanced AI technology with human empathy to provide a comprehensive mental health ecosystem that is accessible, private, and effective.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <Card className="p-8 h-full border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(46,90,125,0.1)] transition-all duration-500 hover:-translate-y-2 rounded-[24px] bg-white group cursor-default relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.bg} rounded-bl-[100px] -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-110 duration-700`}></div>

                                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 text-[#2E5A7D] group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 mb-3 font-dm group-hover:text-[#2E5A7D] transition-colors relative z-10">
                                    {feature.title}
                                </h3>

                                <p className="text-slate-500 leading-relaxed text-sm font-inter relative z-10">
                                    {feature.desc}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
