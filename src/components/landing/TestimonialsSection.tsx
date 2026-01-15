import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
    {
        content: "I used to feel overwhelmed by exam pressure. The AI counselor helped me ground myself at 3 AM when no one else was awake. It felt like someone was finally listening.",
        author: "Priya S.",
        role: "Computer Science Student",
        avatar: "P"
    },
    {
        content: "As a campus counselor, I can't reach everyone. Sahara acts as a crucial first line of support, allowing us to focus on students who need intensive care.",
        author: "Dr. Anjali G.",
        role: "Senior Campus Counselor",
        avatar: "A"
    },
    {
        content: "The meditation tools and anonymous chat are a game-changer. I don't feel judged anymore, and I've learned so many ways to manage my daily stress.",
        author: "Rahul M.",
        role: "Architecture Student",
        avatar: "R"
    }
];

export const TestimonialsSection = () => {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-400 blur-[100px]" />
            </div>

            <div className="max-w-[1240px] mx-auto px-6 md:px-20 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#2E5A7D] mb-4 font-dm">
                        Trusted by Students & Faculty
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-inter">
                        Real stories from our community about how Sahara is making a difference.
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
                                staggerChildren: 0.2
                            }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                            }}
                        >
                            <Card className="h-full border-none shadow-md hover:shadow-2xl transition-all duration-300 bg-white hover:-translate-y-2 group">
                                <CardContent className="p-8 flex flex-col h-full">
                                    <Quote className="w-10 h-10 text-blue-100 mb-6 fill-current group-hover:text-blue-200 transition-colors" />
                                    <p className="text-gray-700 italic font-inter mb-6 leading-relaxed flex-grow">
                                        "{testimonial.content}"
                                    </p>
                                    <div className="flex items-center gap-4 mt-auto">
                                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                                                {testimonial.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-bold text-gray-900 font-dm">{testimonial.author}</h4>
                                            <p className="text-sm text-gray-500 font-inter">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
