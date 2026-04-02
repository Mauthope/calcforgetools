'use client';

import { useState, useEffect } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';

export default function ShareWidget({ title }: { title: string }) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <>
      {/* Desktop Floating Sidebar */}
      <div className="fixed left-4 xl:left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3 p-3 apple-card bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-[var(--color-border)] rounded-2xl shadow-lg opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
        <div className="text-xs font-semibold text-center text-[var(--color-text-secondary)] mb-1">Share</div>
        
        <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" title="Share on X (Twitter)" className="p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-[var(--color-text-secondary)] hover:text-[#1DA1F2]">
          <Twitter size={20} />
        </a>
        
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" title="Share on Facebook" className="p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-[var(--color-text-secondary)] hover:text-[#4267B2]">
          <Facebook size={20} />
        </a>
        
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" title="Share on LinkedIn" className="p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-[var(--color-text-secondary)] hover:text-[#0A66C2]">
          <Linkedin size={20} />
        </a>
        
        <a href={`https://api.whatsapp.com/send?text=${encodedTitle}%20-%20${encodedUrl}`} target="_blank" rel="noopener noreferrer" title="Share on WhatsApp" className="p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-[var(--color-text-secondary)] hover:text-[#25D366]">
          <Share2 size={20} />
        </a>
        
        <div className="h-px w-full bg-[var(--color-border)] my-1" />
        
        <button onClick={handleCopy} title="Copy Link" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-[var(--color-text-secondary)]">
          {copied ? <Check size={20} className="text-green-500" /> : <LinkIcon size={20} />}
        </button>
      </div>

      {/* Mobile Inline Banner (Renders where placed in layout) */}
      <div className="flex lg:hidden flex-row gap-3 p-4 mt-12 justify-center items-center apple-card bg-slate-50/50 dark:bg-slate-900/50 border border-[var(--color-border)] rounded-2xl shadow-sm">
        <span className="text-sm font-semibold text-[var(--color-text-secondary)] mr-2 flex-shrink-0">Compartilhar:</span>
        
        <div className="flex flex-row gap-2 overflow-x-auto">
          <a href={`https://api.whatsapp.com/send?text=${encodedTitle}%20-%20${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white dark:bg-slate-800 rounded-full shadow-sm text-[#25D366] border border-[var(--color-border)] hover:scale-105 transition-transform">
            <Share2 size={18} />
          </a>
          <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white dark:bg-slate-800 rounded-full shadow-sm text-[#1DA1F2] border border-[var(--color-border)] hover:scale-105 transition-transform">
            <Twitter size={18} />
          </a>
           <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white dark:bg-slate-800 rounded-full shadow-sm text-[#0A66C2] border border-[var(--color-border)] hover:scale-105 transition-transform">
            <Linkedin size={18} />
          </a>
          <button onClick={handleCopy} className="p-2.5 bg-white dark:bg-slate-800 rounded-full shadow-sm text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:scale-105 transition-transform">
             {copied ? <Check size={18} className="text-green-500" /> : <LinkIcon size={18} />}
          </button>
        </div>
      </div>
    </>
  );
}
