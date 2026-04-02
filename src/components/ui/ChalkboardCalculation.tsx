'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ChalkboardStep {
  label: string;
  expression: string;
  result: string;
  highlight?: boolean;
}

interface ChalkboardCalculationProps {
  steps: ChalkboardStep[];
  title: string;
  lang?: string;
}

function AnimatedNumber({ value }: { value: string }) {
  const [display, setDisplay] = useState('...');

  useEffect(() => {
    const timer = setTimeout(() => setDisplay(value), 80);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <span className="transition-all duration-300">
      {display}
    </span>
  );
}

export function ChalkboardCalculation({ steps, title, lang = 'pt' }: ChalkboardCalculationProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-xl"
      style={{
        background: 'linear-gradient(160deg, #1a3a2a 0%, #0f2619 50%, #162b1e 100%)',
        border: '3px solid #2d5a3d',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Blackboard header — chalk tray */}
      <div
        className="px-5 py-3 flex items-center gap-3"
        style={{ background: 'rgba(0,0,0,0.25)', borderBottom: '2px solid #2d5a3d' }}
      >
        {/* Chalk dots */}
        <div className="flex gap-1.5">
          {['#ff5f57','#ffbd2e','#28c940'].map((c, i) => (
            <div key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <p className="text-white/60 text-xs font-mono tracking-wider ml-1">
          {lang === 'pt' ? '📐 Lousa de Cálculo' : '📐 Calculation Board'}
        </p>
        <div className="ml-auto text-white/40 text-xs font-mono">{title}</div>
      </div>

      {/* Board area */}
      <div className="p-6 md:p-8 space-y-5 font-mono">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={cn(
              'group flex flex-col gap-1.5 p-4 rounded-xl transition-all duration-300',
              step.highlight
                ? 'bg-white/10 border border-white/20 shadow-inner'
                : 'border border-transparent hover:border-white/10 hover:bg-white/5'
            )}
          >
            {/* Step label */}
            <span
              className="text-xs uppercase tracking-widest"
              style={{ color: '#7dd3a8', textShadow: '0 0 8px rgba(125,211,168,0.4)' }}
            >
              {lang === 'pt' ? `Passo ${idx + 1}` : `Step ${idx + 1}`} — {step.label}
            </span>

            {/* Expression */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span
                className="text-lg md:text-xl font-bold tracking-wide"
                style={{
                  color: '#e8f5e9',
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                  letterSpacing: '0.03em',
                }}
                dangerouslySetInnerHTML={{ __html: step.expression }}
              />
              <span className="text-white/30 text-lg">=</span>
              <span
                className={cn(
                  'text-lg md:text-2xl font-bold px-3 py-0.5 rounded-lg',
                  step.highlight
                    ? 'bg-emerald-400/20 text-emerald-300'
                    : 'text-yellow-200'
                )}
                style={step.highlight
                  ? { textShadow: '0 0 16px rgba(52,211,153,0.6)', boxShadow: '0 0 12px rgba(52,211,153,0.15)' }
                  : { textShadow: '0 0 10px rgba(253,230,138,0.4)' }
                }
              >
                <AnimatedNumber value={step.result} />
              </span>
            </div>
          </div>
        ))}

        {/* Chalk line at bottom */}
        <div
          className="mt-4 h-px w-full opacity-20"
          style={{ background: 'repeating-linear-gradient(90deg, #fff 0px, #fff 8px, transparent 8px, transparent 14px)' }}
        />
        <p className="text-white/25 text-xs text-center tracking-widest font-mono">
          {lang === 'pt' ? 'CalcForgeTools — Transparência Matemática' : 'CalcForgeTools — Math Transparency'}
        </p>
      </div>
    </div>
  );
}
