import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
    {
        question: "Is my data really anonymous?",
        answer: "Yes, absolutely. We use end-to-end encryption for all chats and do not store personally identifiable information linked to your mental health records. You can even use an alias."
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
        question: "Who are the counselors?",
        answer: "Our counselors are licensed professionals and senior psychology students who generally volunteer or work with partner institutions. All are vetted and trained in crisis management."
    }
];

export const FAQSection = () => {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-[800px] mx-auto px-6 md:px-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#2E5A7D] mb-4 font-dm">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600 font-inter">
                        Everything you need to know about Sahara.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-b-slate-200">
                            <AccordionTrigger className="text-lg font-medium text-gray-900 font-dm hover:text-[#2E5A7D] text-left">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 font-inter leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};
