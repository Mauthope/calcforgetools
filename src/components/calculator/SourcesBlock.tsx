import React from 'react';
import { ShieldCheck, BookOpen, ExternalLink } from 'lucide-react';

interface ReferenceSource {
  name: string;
  url?: string;
  date?: string;
  law_article?: string;
}

interface SourcesBlockProps {
  sources?: ReferenceSource[];
  lang: 'en' | 'pt';
}

export function SourcesBlock({ sources, lang }: SourcesBlockProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-primary)]/5 to-transparent rounded-bl-full pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] m-0 leading-none">
            {lang === 'en' ? 'Official Sources & Validity' : 'Fontes Oficiais e Vigência'}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1 mb-0">
            {lang === 'en' ? 'Calculations verified against current legislation.' : 'Metodologia verificada conforme legislação vigente.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((source, index) => (
          <div key={index} className="flex flex-col p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between">
              <span className="font-medium text-slate-800 flex items-center gap-2">
                <BookOpen size={16} className="text-slate-400" />
                {source.name}
              </span>
              {source.url && (
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer nofollow"
                  className="text-blue-500 hover:text-blue-700 p-1"
                  aria-label={lang === 'en' ? `Visit official domain for ${source.name}` : `Visitar portal oficial de ${source.name}`}
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
            
            {(source.law_article || source.date) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {source.law_article && (
                  <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200">
                    {source.law_article}
                  </span>
                )}
                {source.date && (
                  <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-md border border-emerald-200">
                    {lang === 'en' ? 'Valid for: ' : 'Vigência: '} {source.date}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
