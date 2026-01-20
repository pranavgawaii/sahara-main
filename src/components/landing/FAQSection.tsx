import React from 'react';
import { motion } from 'framer-motion';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
    {
        question: "Is my data really anonymous?",
        answer: "Yes, absolutely. We use industry-leading End-to-End Encryption for all chats. We do not store personally identifiable information linked to your health records."
    },
    {
        question: "How do I access counseling services?",
        answer: "Once you sign up, you can browse counselor profiles, view their specializations, and book appointments directly through your dashboard. We offer chat, voice, and video options."
    },
    {
        question: "Is Sahara free for students?",
        answer: "The Basic plan is completely free for all verified students. This includes access to our resource library, community forums, and AI companion. Premium features are available for a small subscription."
    },
    {
        question: "Is this a replacement for real therapy?",
        answer: "Sahara is designed as a first line of support and a daily wellness companion. While helpful, it does not replace clinical therapy. We facilitate connections to professionals when deeper care is needed."
    },
    {
        question: "Who are the counselors?",
        answer: "Our human counselors are licensed professionals and supervised senior psychology students from Top Universities. All are rigorously vetted and trained in crisis management."
    }
];

export const FAQSection = () => {
    return (
        <section className="py-24 bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
            <div className="max-w-[800px] mx-auto px-6 md:px-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-dm">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 font-inter">
                        Everything you need to know about Sahara.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                        >
                            <AccordionItem value={`item-${index}`} className="border-b-slate-200 dark:border-b-white/10">
                                <AccordionTrigger className="text-lg font-medium text-slate-900 dark:text-white font-dm hover:text-[#2E5A7D] dark:hover:text-[#6B9AC4] text-left transition-colors">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 font-inter leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};
