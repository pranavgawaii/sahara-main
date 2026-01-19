import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const plans = [
    {
        name: "Student Basic",
        price: "Free",
        description: "Essential mental health support for every student.",
        features: [
            "Anonymous Chat",
            "Resource Library",
            "Self-Assessment Tools",
            "Community Forums"
        ],
        cta: "Get Started",
        popular: false,
        delay: 0.1
    },
    {
        name: "Student Premium",
        price: "₹199/mo",
        description: "Advanced tools for personalized growth.",
        features: [
            "Everything in Basic",
            "Priority Counselor Access",
            "Video Sessions (2/mo)",
            "Progress Analytics",
            "Exclusive Workshops"
        ],
        cta: "Start Free Trial",
        popular: true,
        delay: 0.2
    },
    {
        name: "Institution",
        price: "Custom",
        description: "Complete solution for universities and colleges.",
        features: [
            "Full Student Coverage",
            "Admin Dashboard",
            "Crisis Management Tools",
            "White-label Option",
            "API Access"
        ],
        cta: "Contact Sales",
        popular: false,
        delay: 0.3
    }
];

export const PricingSection = () => {
    return (
        <section className="py-24 bg-[#0a0a0a]" id="pricing">
            <div className="max-w-[1240px] mx-auto px-6 md:px-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-dm">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto font-inter">
                        Choose the plan that best fits your needs. No hidden fees.
                    </p>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.15
                            }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 40 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                            }}
                            className="relative"
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                                    <Badge className="bg-[#2E5A7D] hover:bg-[#1A3A5A] text-white px-4 py-1 shadow-lg border-none">
                                        Most Popular
                                    </Badge>
                                </div>
                            )}
                            <Card className={`h-full flex flex-col ${plan.popular ? 'border-2 border-[#2E5A7D] shadow-2xl scale-105 z-10' : 'border border-white/10 shadow-md hover:shadow-xl'} bg-[#111] transition-all duration-300 hover:-translate-y-1`}>
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-white font-dm">{plan.name}</CardTitle>
                                    <div className="mt-4 mb-2">
                                        <span className="text-4xl font-bold text-white font-dm">{plan.price}</span>
                                    </div>
                                    <CardDescription className="text-slate-400 font-inter">
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center text-sm text-slate-300 font-inter">
                                                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className={`w-full font-dm py-6 text-md shadow-md transition-transform active:scale-95 ${plan.popular ? 'bg-[#2E5A7D] hover:bg-[#1A3A5A] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                    >
                                        {plan.cta}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
