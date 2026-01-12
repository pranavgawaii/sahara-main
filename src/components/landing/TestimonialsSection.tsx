import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
    {
        content: "Sahara has been a lifesaver. The anonymous chat feature helped me open up about my anxiety without fear of judgment.",
        author: "Computer Science Student",
        role: "Year 3",
        avatar: "S"
    },
    {
        content: "As a counselor, this platform allows me to reach students who wouldn't normally walk into my office. It's revolutionizing campus support.",
        author: "Dr. Anjali Gupta",
        role: "Senior Counselor",
        avatar: "A"
    },
    {
        content: "The mental health resources are curated perfectly. I use the meditation tools every day before exams.",
        author: "Priya Patel",
        role: "Year 2 Student",
        avatar: "P"
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                        >
                            <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white">
                                <CardContent className="p-8 flex flex-col h-full">
                                    <Quote className="w-10 h-10 text-blue-100 mb-6 fill-current" />
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
                </div>
            </div>
        </section>
    );
};
