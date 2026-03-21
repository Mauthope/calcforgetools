"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface SmartInsightProps {
  text: string | React.ReactNode;
}

export function SmartInsight({ text }: SmartInsightProps) {
  // We parse bold tags dynamically if a string is passed
  const formatText = (content: string | React.ReactNode) => {
    if (typeof content !== 'string') return content;
    
    // Split by ** and render strong tags
    const parts = content.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => 
      i % 2 === 1 ? <strong key={i} className="text-[var(--color-primary)] font-bold">{part}</strong> : part
    );
  };

  return (
    <AnimatePresence>
      {text && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
          className="w-full mt-4"
        >
          <div className="relative overflow-hidden apple-card bg-gradient-to-r from-[var(--color-surface)] to-[#F5F5F7] border border-[var(--color-primary)]/20 p-5 md:p-6 shadow-[0_8px_30px_rgb(0,122,255,0.06)] group">
            
            {/* Ambient Animated Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--color-primary)]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
            
            <div className="relative z-10 flex items-start gap-4">
              <div className="shrink-0 pt-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] ring-4 ring-white">
                  <Lightbulb size={20} className="animate-pulse" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold tracking-tight text-[var(--color-text-primary)] mb-1 uppercase opacity-80">
                  Smart Insight
                </h4>
                <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm md:text-base">
                  {formatText(text)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
