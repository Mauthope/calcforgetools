"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  className?: string;
}

export function FAQ({ items, title = "Frequently Asked Questions", className }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if(!items || items.length === 0) return null;

  return (
    <div className={cn("w-full", className)}>
      <h2 className="text-2xl font-semibold mb-6 text-[var(--color-text-primary)] tracking-tight">{title}</h2>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div 
            key={i} 
            className="border border-[var(--color-border)] rounded-[var(--radius-apple)] bg-[var(--color-surface)] overflow-hidden transition-shadow duration-200 hover:shadow-md"
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] bg-transparent hover:bg-gray-50/50 transition-colors"
              aria-expanded={openIndex === i}
            >
              <span className="font-semibold text-lg text-[var(--color-text-primary)] pr-4">{item.question}</span>
              <motion.div
                animate={{ rotate: openIndex === i ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronDown className="w-5 h-5 text-[var(--color-text-secondary)] shrink-0" />
              </motion.div>
            </button>
            
            <AnimatePresence initial={false}>
              {openIndex === i && (
                <motion.div
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0 }
                  }}
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                  className="px-6 text-[var(--color-text-secondary)] leading-relaxed"
                >
                  <div className="pb-6 pt-1">{item.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
