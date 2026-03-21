"use client";

import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export interface GuideItem {
  title: string;
  href: string;
  description: string;
}

interface RelatedGuidesProps {
  items: GuideItem[];
}

export function RelatedGuides({ items }: RelatedGuidesProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full mt-10">
      <h2 className="text-2xl font-bold mb-6 tracking-tight text-[var(--color-text-primary)]">
        {/* We use a heuristic: if the first link is /pt/, title is Portuguese */}
        {items[0].href.includes('/pt/') ? 'Guias Relacionados' : 'Related Guides'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((guide, idx) => (
          <Link key={idx} href={guide.href} className="group outline-none">
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-2xl h-full flex flex-col hover:border-[var(--color-primary)] hover:shadow-lg hover:shadow-[var(--color-primary)]/10 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4 mb-3">
                <div className="bg-blue-50 text-[var(--color-primary)] p-2.5 rounded-xl group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors leading-tight flex-1">
                  {guide.title}
                </h3>
              </div>
              <p className="text-[var(--color-text-secondary)] text-sm mb-4 leading-relaxed flex-1 ml-14">
                {guide.description}
              </p>
              <div className="flex items-center text-[var(--color-primary)] text-sm font-semibold mt-auto ml-14">
                {items[0].href.includes('/pt/') ? 'Ler artigo' : 'Read guide'}
                <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
