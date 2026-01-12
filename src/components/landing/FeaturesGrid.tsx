import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Shield, Brain, Clock, Users, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const features = [
    {
        title: "Anonymous & Secure",
        description: "Your privacy is our priority. All sessions are encrypted and completely anonymous.",
        icon: Shield,
        color: "bg-blue-100 text-blue-600",
        size: "col-span-12 md:col-span-4"
    },
    {
        title: "AI-Powered Counseling",
        description: "Get instant support 24/7 from our advanced AI mental health companion.",
        icon: Brain,
        color: "bg-purple-100 text-purple-600",
        size: "col-span-12 md:col-span-8"
    },
    {
        title: "Real-time Chat",
        description: "Connect immediately with resources or counselors when you need them most.",
        icon: MessageCircle,
        color: "bg-green-100 text-green-600",
        size: "col-span-12 md:col-span-6"
    },
    {
        title: "Global Community",
        description: "Join thousands of students supporting each other in a safe environment.",
        icon: Users,
        color: "bg-orange-100 text-orange-600",
        size: "col-span-12 md:col-span-6"
    }
];

export const FeaturesGrid = () => {
    return (
        <section className="py-24 px-6 md:px-20 max-w-[1240px] mx-auto bg-slate-50">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-[#2E5A7D] mb-4 font-dm">
                    Why Students Choose Sahara
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto font-inter">
                    A complete ecosystem designed for your mental well-being, combining technology with human empathy.
                </p>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        className={`${feature.size} h-full`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                        <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white overflow-hidden group">
                            <CardContent className="p-8 flex flex-col items-start h-full">
                                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 font-dm">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed font-inter">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
