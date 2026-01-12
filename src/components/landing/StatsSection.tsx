import React from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, Globe, Award } from 'lucide-react';

const stats = [
    {
        label: "Active Students",
        value: "10,000+",
        icon: Users,
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        label: "Partner Universities",
        value: "50+",
        icon: Building2,
        color: "text-purple-600",
        bg: "bg-purple-50"
    },
    {
        label: "Support Sessions",
        value: "25k+",
        icon: Globe,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    {
        label: "Student Satisfaction",
        value: "4.9/5",
        icon: Award,
        color: "text-orange-600",
        bg: "bg-orange-50"
    }
];

export const StatsSection = () => {
    return (
        <section className="py-20 bg-white border-y border-slate-100">
            <div className="max-w-[1240px] mx-auto px-6 md:px-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}>
                                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 font-dm mb-2">
                                {stat.value}
                            </h3>
                            <p className="text-gray-500 font-medium font-inter">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
