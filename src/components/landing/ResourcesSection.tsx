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
        <section className="py-24 bg-blue-50/50 dark:bg-[#050505] relative overflow-hidden transition-colors duration-300">
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
                        className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white font-dm mb-6 leading-tight"
                    >
                        Resources for Every Step
                    </motion.h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 font-inter leading-relaxed">
                        Curated tools and content to support your journey towards better mental health.
                    </p>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {resources.map((resource, index) => (
                        <motion.div
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                            className="bg-white dark:bg-[#111] rounded-2xl p-8 hover:bg-white/90 dark:hover:bg-[#161616] hover:shadow-[0_12px_40px_rgba(46,90,125,0.1)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-300 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 group flex flex-col items-start h-full"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-blue-50 dark:bg-white/5 border border-blue-100 dark:border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                <resource.icon className={`w-6 h-6 ${resource.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-dm group-hover:text-[#2E5A7D] dark:group-hover:text-[#6B9AC4] transition-colors">
                                {resource.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                                {resource.desc}
                            </p>
                            <Button variant="link" className={`p-0 h-auto font-semibold ${resource.color} hover:no-underline group-hover:translate-x-1 transition-transform mt-auto`}>
                                Learn more →
                            </Button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
