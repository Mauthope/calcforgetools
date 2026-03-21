"use client";

import React, { useRef, useState } from 'react';
import { PrimaryButton } from './PrimaryButton';
import { Download, FileSpreadsheet } from 'lucide-react';

interface TemplateCTAProps {
  title: string;
  description: string;
  price?: string;
  formats: string[];
  checkoutUrl: string;
}

export function TemplateCTA({ title, description, price, checkoutUrl }: TemplateCTAProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div 
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden rounded-[var(--radius-apple)] bg-[var(--color-surface)] shadow-sm border border-[var(--color-border)] group w-full mt-4 transition-all hover:shadow-md hover:border-[var(--color-primary)]"
    >
      {/* Spotlight Hover Effect */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0,122,255,0.15) 0%, rgba(0,122,255,0.05) 50%, transparent 80%)`
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
           
           <h3 className="text-lg md:text-xl font-bold text-[var(--color-text-primary)] leading-tight mb-2 tracking-tight transition-colors group-hover:text-[var(--color-primary)]">
             {title}
           </h3>
           
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
