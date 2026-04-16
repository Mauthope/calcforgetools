"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowRightLeft, MoveDown, MoveUp } from 'lucide-react';

interface GamifiedRuleOfThreeProps {
  inputs: Record<string, any>;
  onChange: (e: any) => void;
  lang?: string;
}

export function GamifiedRuleOfThree({ inputs, onChange, lang = 'pt' }: GamifiedRuleOfThreeProps) {
  const type = inputs.calcType || 'simples_direta';
  
  // The selected unknown variable: 'a1', 'b1', 'a2', or 'b2'
  const targetVariable = inputs.targetVariable || 'b2';

  const setTarget = (val: string) => {
    onChange({ target: { name: 'targetVariable', value: val } });
  };

  const setType = (val: string) => {
    onChange({ target: { name: 'calcType', value: val } });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  const renderSlot = (name: string, label: string) => {
    const isTarget = targetVariable === name;
    
    return (
      <div 
        className={cn(
          "relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 w-full md:w-32",
          isTarget 
            ? "border-emerald-400/60 bg-emerald-400/10 shadow-[0_0_20px_rgba(52,211,153,0.15)]" 
            : "border-white/10 hover:border-white/25 bg-black/40 cursor-pointer"
        )}
        onClick={() => !isTarget && setTarget(name)}
      >
        <span className="text-[10px] uppercase tracking-widest text-white/40 mb-2 font-mono">{label}</span>
        {isTarget ? (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-bold font-mono text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.6)] h-12 flex items-center justify-center"
          >
            X
          </motion.div>
        ) : (
          <input
            type="number"
            name={name}
            value={inputs[name] ?? ''}
            onChange={handleInputChange}
            placeholder="0"
            onClick={(e) => e.stopPropagation()}
            className="bg-transparent border-b border-white/20 focus:border-emerald-400/50 outline-none w-full text-center text-2xl font-bold font-mono text-white placeholder-white/20 h-12"
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Chalkboard Container */}
      <div 
        className="rounded-3xl overflow-hidden shadow-2xl relative"
        style={{
          background: 'linear-gradient(160deg, #152e22 0%, #0c1c14 50%, #112217 100%)',
          border: '4px solid #2d5a3d',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Top Header/Tray */}
        <div className="px-6 py-4 flex items-center gap-4 bg-black/20 border-b-2 border-[#2d5a3d]">
           <div className="flex gap-2">
             <div className="w-3 h-3 rounded-full bg-red-400/80" />
             <div className="w-3 h-3 rounded-full bg-amber-400/80" />
             <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
           </div>
           <div className="text-white/60 font-mono text-xs uppercase tracking-[0.2em]">
             {lang === 'pt' ? 'Quadro Interativo' : 'Interactive Board'}
           </div>
           
           {/* Mode Toggles */}
           <div className="ml-auto flex bg-black/40 rounded-xl p-1 border border-white/5 relative z-10">
             <button
                type="button"
                onClick={() => setType('simples_direta')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all",
                  type === 'simples_direta' ? "bg-emerald-500/20 text-emerald-300 shadow-sm" : "text-white/40 hover:text-white/70"
                )}
             >
                {lang === 'pt' ? 'Direta' : 'Direct'}
             </button>
             <button
                type="button"
                onClick={() => setType('simples_inversa')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all",
                  type === 'simples_inversa' ? "bg-amber-500/20 text-amber-300 shadow-sm" : "text-white/40 hover:text-white/70"
                )}
             >
                {lang === 'pt' ? 'Inversa' : 'Inverse'}
             </button>
           </div>
        </div>

        {/* Board Content */}
        <div className="p-8 md:p-12 relative flex flex-col items-center">
          
          <div className="w-full max-w-lg mb-8 text-center text-white/50 font-mono text-sm">
             {lang === 'pt' 
               ? 'Clique na caixa que você deseja descobrir (A incógnita X) e preencha os demais valores.'
               : 'Click on the box you want to find (The unknown X) and fill in the other values.'}
          </div>

          <div className="flex flex-col gap-6 md:gap-12 w-full max-w-md items-center relative z-10">
            {/* Top Row: A1 -> B1 */}
            <div className="flex items-center gap-4 md:gap-8 w-full justify-between">
               {renderSlot('a1', 'Valor 1')}
               
               <div className="flex flex-col items-center text-white/30">
                  {type === 'simples_direta' ? (
                    <ArrowRight className="w-8 h-8 opacity-50" />
                  ) : (
                    <ArrowRightLeft className="w-8 h-8 opacity-50 text-amber-400" />
                  )}
               </div>

               {renderSlot('b1', 'Correspondente')}
            </div>

            {/* Middle connecting lines (visual only) */}
            <div className="flex items-center gap-4 md:gap-8 w-full justify-between px-16 absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none opacity-20">
               <MoveDown className="w-6 h-6 ml-4" />
               <MoveDown className="w-6 h-6 mr-4" />
            </div>

            {/* Bottom Row: A2 -> B2 */}
            <div className="flex items-center gap-4 md:gap-8 w-full justify-between">
               {renderSlot('a2', 'Novo Valor 1')}
               
               <div className="flex flex-col items-center text-white/30">
                  {type === 'simples_direta' ? (
                    <ArrowRight className="w-8 h-8 opacity-50" />
                  ) : (
                    <ArrowRightLeft className="w-8 h-8 opacity-50 text-amber-400" />
                  )}
               </div>

               {renderSlot('b2', 'Novo Correspond')}
            </div>
          </div>
          
          <div className="mt-12 h-px w-full max-w-lg opacity-20 bg-[repeating-linear-gradient(90deg,#fff_0px,#fff_8px,transparent_8px,transparent_14px)]" />
        </div>
      </div>
    </div>
  );
}
