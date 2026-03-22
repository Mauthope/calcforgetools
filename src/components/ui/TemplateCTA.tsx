"use client";

import React from 'react';
import { PrimaryButton } from './PrimaryButton';
import { Download, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';

interface TemplateCTAProps {
  title: string;
  description: string;
  price?: string;
  formats: string[];
  checkoutUrl: string;
}

export function TemplateCTA({ title, description, price, checkoutUrl }: TemplateCTAProps) {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-apple)] bg-[var(--color-surface)] shadow-sm border border-[var(--color-border)] group w-full mt-4 transition-all hover:shadow-md hover:border-[var(--color-primary)]">
      {/* Autonomous Spotlight Effect */}
      <motion.div 
        className="pointer-events-none absolute w-[800px] h-[800px] -top-[400px] -left-[400px] z-0"
        animate={{
          x: [0, 400, 100, 600, 0],
          y: [0, 150, 50, 250, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
          repeatType: "mirror"
        }}
        style={{
          background: `radial-gradient(circle, rgba(0,122,255,0.15) 0%, rgba(0,122,255,0.05) 50%, transparent 70%)`
        }}
      />
      
      <div className="relative z-10 p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-5">
        
        {/* Content */}
        <div className="flex-1 text-left w-full">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-8 rounded-lg bg-blue-50 text-[var(--color-primary)] flex items-center justify-center shrink-0">
               <FileSpreadsheet className="w-4 h-4" />
             </div>
             <span className="text-[10px] sm:text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest leading-none">
               Premium Offline Template
             </span>
           </div>
           
           {/* SEO Fix: Changed from h3 to p to respect document outline, retaining visual hierarchy */}
           <p className="text-lg md:text-xl font-bold text-[var(--color-text-primary)] leading-tight mb-2 tracking-tight transition-colors group-hover:text-[var(--color-primary)]">
             {title}
           </p>
           
           <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed md:line-clamp-2 pr-0 md:pr-4">
             {description}
           </p>
        </div>
        
        {/* CTA Button */}
        <div className="shrink-0 w-full md:w-auto">
          <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
            <PrimaryButton className="w-full bg-[#007AFF] hover:bg-[#007AFF]/90 text-white shadow-lg shadow-blue-500/20 py-3 md:py-3.5 px-6 border-none ring-0 text-sm md:text-base font-semibold transition-transform hover:scale-[1.02]">
              <Download className="w-4 h-4 mr-2" />
              {price ? `Download (${price})` : 'Download'}
            </PrimaryButton>
          </a>
        </div>
        
      </div>
    </div>
  );
}
