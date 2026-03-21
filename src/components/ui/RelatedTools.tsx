import React from 'react';
import Link from 'next/link';
import { Card } from './Card';
import { ArrowRight } from 'lucide-react';

export interface RelatedItem {
  title: string;
  href: string;
  description?: string;
}

interface RelatedToolsProps {
  items: RelatedItem[];
  title?: string;
  lang?: string;
}

export function RelatedTools({ items, title = "Related Tools & Guides", lang = "en" }: RelatedToolsProps) {
  if(!items || items.length === 0) return null;

  return (
    <div className="w-full mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-[var(--color-text-primary)] tracking-tight">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <Link href={item.href} key={i}>
            <div className="group border border-[var(--color-border)] bg-[var(--color-surface)] rounded-[var(--radius-apple)] p-5 transition-all duration-200 hover:border-[var(--color-primary)] hover:shadow-sm cursor-pointer h-full flex flex-col justify-between">
              <div>
                <h3 className="font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-1.5">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-[var(--color-text-secondary)] mt-2 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="mt-4 flex items-center text-sm font-medium text-[var(--color-primary)] w-max">
                {lang === 'pt' ? 'Conhecer' : 'View'} <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
