import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, FileText, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const resources = [
    {
        icon: BookOpen,
        title: "Self-Help Guides",
        desc: "Expert-curated articles on managing stress, anxiety, and exam pressure.",
        color: "text-blue-500",
        bg: "bg-blue-50"
    },
    {
        icon: Video,
        title: "Video Library",
        desc: "Watch workshops and mindfulness sessions led by mental health professionals.",
        color: "text-indigo-500",
        bg: "bg-indigo-50"
    },
    {
        icon: FileText,
        title: "Assessment Tools",
        desc: "Quick, private screening tools to help you understand your mental well-being.",
        color: "text-purple-500",
        bg: "bg-purple-50"
    },
    {
        icon: Phone,
        title: "Crisis Helplines",
        desc: "Direct access to 24/7 emergency contacts and suicide prevention lifelines.",
        color: "text-rose-500",
        bg: "bg-rose-50"
    }
];

export const ResourcesSection = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-[1240px] mx-auto px-6 md:px-20 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-[#6B9AC4] font-semibold tracking-wider uppercase text-sm mb-4 block"
                    >
                        Knowledge is Power
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-[#2E5A7D] font-dm mb-6 leading-tight"
                    >
                        Resources for Every Step
                    </motion.h2>
                    <p className="text-lg text-slate-500 font-inter leading-relaxed">
                        Curated tools and content to support your journey towards better mental health.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {resources.map((resource, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-slate-50 rounded-2xl p-8 hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 border border-transparent hover:border-slate-100 group"
                        >
                            <div className={`w-12 h-12 rounded-xl ${resource.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <resource.icon className={`w-6 h-6 ${resource.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3 font-dm">
                                {resource.title}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                {resource.desc}
                            </p>
                            <Button variant="link" className={`p-0 h-auto font-semibold ${resource.color} hover:no-underline group-hover:translate-x-1 transition-transform`}>
                                Learn more →
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
