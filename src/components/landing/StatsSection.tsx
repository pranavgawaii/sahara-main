import React from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, Globe, Award } from 'lucide-react';

const stats = [
    {
        label: "Active Students",
        value: "10,000+",
        icon: Users,
        color: "text-[#6B9AC4]",
        bg: "bg-blue-50"
    },
    {
        label: "Partner Universities",
        value: "50+",
        icon: Building2,
        color: "text-[#6B9AC4]",
        bg: "bg-blue-50"
    },
    {
        label: "Support Sessions",
        value: "25k+",
        icon: Globe,
        color: "text-[#6B9AC4]",
        bg: "bg-blue-50"
    },
    {
        label: "Student Satisfaction",
        value: "4.9/5",
        icon: Award,
        color: "text-[#6B9AC4]",
        bg: "bg-blue-50"
    }
];

export const StatsSection = () => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-[1240px] mx-auto px-6 md:px-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-b border-slate-100 pb-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="mb-4 transform transition-transform duration-500 group-hover:-translate-y-1">
                                <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-4xl md:text-5xl font-bold text-[#2E5A7D] font-dm mb-3 tracking-tight">
                                {stat.value}
                            </h3>
                            <p className="text-slate-500 font-medium font-inter text-sm uppercase tracking-wider">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
