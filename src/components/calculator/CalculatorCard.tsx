import React from 'react';
import Link from 'next/link';
import { Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CalculatorCardProps {
  title: string;
  description: string;
  href: string;
  category: string;
  className?: string;
}

export function CalculatorCard({ title, description, href, category, className }: CalculatorCardProps) {
  return (
    <Link href={href} className={cn("block group", className)}>
      <div className="apple-card p-6 h-full flex flex-col border border-transparent group-hover:border-[var(--color-border)] cursor-pointer">
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] bg-opacity-10 text-[var(--color-primary)] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
          <Calculator className="w-6 h-6 stroke-[1.5]" />
        </div>
        
        <div className="mb-2">
          <span className="text-xs font-semibold tracking-wider text-[var(--color-text-secondary)] uppercase">
            {category}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2 tracking-tight line-clamp-2">
          {title}
        </h3>
        
        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed mb-6 flex-grow">
          {description}
        </p>

        <div className="font-medium text-[var(--color-primary)] text-sm mt-auto inline-flex items-center group-hover:underline">
          Open Calculator 
          <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      </div>
    </Link>
  );
}
