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
        <section className="py-24 bg-white" id="pricing">
            <div className="max-w-[1240px] mx-auto px-6 md:px-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#2E5A7D] mb-4 font-dm">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-inter">
                        Choose the plan that best fits your needs. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: plan.delay, duration: 0.5 }}
                            className="relative"
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                                    <Badge className="bg-[#2E5A7D] hover:bg-[#1A3A5A] text-white px-4 py-1">
                                        Most Popular
                                    </Badge>
                                </div>
                            )}
                            <Card className={`h-full flex flex-col ${plan.popular ? 'border-2 border-[#2E5A7D] shadow-xl scale-105' : 'border border-slate-200 shadow-md'} bg-white transition-all hover:shadow-lg`}>
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-gray-900 font-dm">{plan.name}</CardTitle>
                                    <div className="mt-4 mb-2">
                                        <span className="text-4xl font-bold text-[#2E5A7D] font-dm">{plan.price}</span>
                                    </div>
                                    <CardDescription className="text-gray-500 font-inter">
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center text-sm text-gray-700 font-inter">
                                                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className={`w-full font-dm ${plan.popular ? 'bg-[#2E5A7D] hover:bg-[#1A3A5A]' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
                                    >
                                        {plan.cta}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
