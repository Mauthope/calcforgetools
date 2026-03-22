"use client";

import React from 'react';
import { PrimaryButton } from './PrimaryButton';
import { Download, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface TemplateCTAProps {
  title: string;
  description: string;
  price?: string;
  formats: string[];
  checkoutUrl: string;
  lang: string;
}

export function TemplateCTA({ title, description, price, checkoutUrl, lang }: TemplateCTAProps) {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-apple)] bg-[#0B101E] shadow-sm border border-[var(--color-border)] group w-full mt-4 transition-all hover:shadow-lg hover:border-blue-500/50">
      {/* Autonomous Aurora Spotlight Effect - High Contrast */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Intense Cyan Orb */}
        <motion.div 
          className="absolute w-[600px] h-[600px] -top-[300px] -left-[200px] blur-[40px]"
          animate={{
            x: [0, 300, 100, 400, 0],
            y: [0, 100, 50, 150, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
          style={{ background: `radial-gradient(circle, rgba(0,198,255,0.9) 0%, rgba(0,122,255,0.4) 40%, transparent 70%)` }}
        />
        {/* Neon Emerald Orb */}
        <motion.div 
          className="absolute w-[500px] h-[500px] top-[10%] right-[-100px] blur-[40px]"
          animate={{
            x: [0, -200, 50, -100, 0],
            y: [0, 50, 20, 100, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
          style={{ background: `radial-gradient(circle, rgba(0,255,150,0.85) 0%, rgba(46,204,113,0.3) 50%, transparent 70%)` }}
        />
        {/* Deep Neon Purple Orb */}
        <motion.div 
          className="absolute w-[700px] h-[700px] -bottom-[350px] left-[20%] blur-[50px]"
          animate={{
            x: [0, 200, -100, 150, 0],
            y: [0, -100, -50, -150, 0]
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
          style={{ background: `radial-gradient(circle, rgba(180,0,255,0.8) 0%, rgba(138,43,226,0.3) 50%, transparent 70%)` }}
        />
      </div>
      
      <div className="relative z-10 p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-5">
        
        {/* Content */}
        <div className="flex-1 text-left w-full">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-white flex items-center justify-center shrink-0 shadow-lg">
               <LayoutDashboard className="w-4 h-4" />
             </div>
             <span className="text-[10px] sm:text-xs font-bold text-blue-300 uppercase tracking-widest leading-none drop-shadow-md">
               Premium Dashboard
             </span>
           </div>
           
           {/* SEO Fix: Changed from h3 to p to respect document outline, retaining visual hierarchy */}
           <p className="text-lg md:text-xl font-bold text-white leading-tight mb-2 tracking-tight transition-colors group-hover:text-cyan-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
             {title}
           </p>
           
           <p className="text-sm text-slate-300 leading-relaxed md:line-clamp-2 pr-0 md:pr-4 font-medium drop-shadow-sm">
             {description}
           </p>
        </div>
        
        {/* CTA Button */}
        <div className="shrink-0 w-full md:w-auto flex flex-col items-center md:items-end">
          <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
            <PrimaryButton className="w-full bg-[#007AFF] hover:bg-[#007AFF]/90 text-white shadow-[0_0_15px_rgba(0,122,255,0.4)] hover:shadow-[0_0_25px_rgba(0,122,255,0.6)] py-3 md:py-3.5 px-6 border-none ring-0 text-sm md:text-base font-bold transition-transform hover:scale-[1.03]">
              <Download className="w-4 h-4 mr-2" />
              {lang === 'pt' ? 'Baixar Agora' : 'Download Now'} {price ? `(${price})` : ''}
            </PrimaryButton>
          </a>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-400 drop-shadow-md tracking-wide">
            <ShieldCheck className="w-4 h-4" />
            {lang === 'pt' ? 'Garantia de 7 Dias (Devolução Total)' : '7-Day Money-Back Guarantee'}
          </div>
        </div>
        
      </div>
    </div>
  );
}
