'use client';

import { useState } from 'react';
import { Copy, Check, Code } from 'lucide-react';

interface EmbedSnippetGeneratorProps {
  lang: 'en' | 'pt';
  slug: string;
  calculatorTitle: string;
}

export function EmbedSnippetGenerator({ lang, slug, calculatorTitle }: EmbedSnippetGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const embedUrl = `https://calcforgetools.com/embed/${lang}/calculators/${slug}`;
  const backlinkUrl = `https://calcforgetools.com/${lang}/calculators/${slug}`;
  
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="800" frameborder="0" style="border:0; border-radius:12px; overflow:hidden;" allowfullscreen></iframe>
<div style="text-align: right; margin-top: 8px; font-family: sans-serif; font-size: 12px; color: #6b7280;">
  Calculadora original: <a href="${backlinkUrl}" target="_blank" rel="noopener" style="color: #2563eb; text-decoration: none; font-weight: 600;">${calculatorTitle} por CalcForgeTools</a>
</div>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 w-full mt-10">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2 mb-2">
            <Code className="text-[var(--color-primary)] w-6 h-6" />
            {lang === 'pt' ? 'Incorpore esta Calculadora no seu Site' : 'Embed this Calculator on your Website'}
          </h3>
          <p className="text-[var(--color-text-secondary)] text-[15px] max-w-2xl">
            {lang === 'pt' 
              ? 'Ajude sua audiência. Copie o iframe abaixo e exiba esta ferramenta completa e gratuita diretamente no seu portal ou blog.' 
              : 'Help your audience. Copy the iframe below to display this full free tool directly on your portal or blog.'}
          </p>
        </div>
      </div>

      <div className="relative group">
        <pre className="bg-gray-50 dark:bg-slate-900 border border-[var(--color-border)] rounded-xl p-4 md:p-5 overflow-x-auto text-[13px] md:text-[14px] text-gray-800 dark:text-gray-200 font-mono">
          <code>{iframeCode}</code>
        </pre>
        
        <button
          onClick={copyToClipboard}
          className="absolute top-4 right-4 bg-white dark:bg-slate-800 border border-[var(--color-border)] hover:bg-gray-50 dark:hover:bg-slate-700 text-[var(--color-text-primary)] p-2 rounded-lg shadow-sm transition-all flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
          aria-label={lang === 'pt' ? 'Copiar código' : 'Copy code'}
        >
          {copied ? (
            <span className="flex items-center gap-2 text-green-600 font-medium px-2">
              <Check className="w-4 h-4" /> 
              {lang === 'pt' ? 'Copiado!' : 'Copied!'}
            </span>
          ) : (
             <span className="flex items-center gap-2 px-2 text-[14px] font-medium">
              <Copy className="w-4 h-4" /> 
               {lang === 'pt' ? 'Copiar Código' : 'Copy Code'}
             </span>
          )}
        </button>
      </div>
    </div>
  );
}
