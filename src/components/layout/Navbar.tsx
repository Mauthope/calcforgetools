"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Container } from '../ui/Container';
import { Menu, X, Calculator, BookOpen, LayoutTemplate } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Derive current language from URL
  const currentLang = pathname.startsWith('/pt') ? 'pt' : 'en';

  // Maps to handle slug changes between languages
  const ptToEnMap: Record<string, string> = {
    'calculadora-de-financiamento-da-minha-casa': 'home-mortgage-calculator',
    'calculadora-de-quitacao-de-divida': 'debt-payoff-calculator',
    'calculadora-de-juros-compostos': 'compound-interest-calculator',
    'calculadora-de-porcentagem': 'percentage-calculator',
    // Guides
    'como-funcionam-os-juros-compostos': 'how-compound-interest-works',
    'como-calcular-porcentagens': 'how-to-calculate-percentages',
    // Categories
    'financeira': 'financial',
    'matematica': 'mathematical',
    'trabalhista': 'labor',
    // Labor Calculators
    'calculadora-salario-liquido-clt': 'clt-net-salary-calculator',
    'calculadora-rescisao-trabalhista': 'labor-termination-calculator',
    // Labor Guides
    'como-calcular-salario-liquido': 'how-to-calculate-net-salary',
    'como-calcular-rescisao-trabalhista': 'how-to-calculate-labor-termination'
  };

  const enToPtMap: Record<string, string> = {
    'home-mortgage-calculator': 'calculadora-de-financiamento-da-minha-casa',
    'debt-payoff-calculator': 'calculadora-de-quitacao-de-divida',
    'compound-interest-calculator': 'calculadora-de-juros-compostos',
    'percentage-calculator': 'calculadora-de-porcentagem',
    // Guides
    'how-compound-interest-works': 'como-funcionam-os-juros-compostos',
    'how-to-calculate-percentages': 'como-calcular-porcentagens',
    // Categories
    'financial': 'financeira',
    'mathematical': 'matematica',
    'labor': 'trabalhista',
    // Labor Calculators
    'clt-net-salary-calculator': 'calculadora-salario-liquido-clt',
    'labor-termination-calculator': 'calculadora-rescisao-trabalhista',
    // Labor Guides
    'how-to-calculate-net-salary': 'como-calcular-salario-liquido',
    'how-to-calculate-labor-termination': 'como-calcular-rescisao-trabalhista'
  };

  const toggleLang = () => {
    const newLang = currentLang === 'en' ? 'pt' : 'en';
    
    // Check if we are inside a specific calculator/guide to translate the slug
    const parts = pathname.split('/').filter(Boolean);
    let newPath = `/${newLang}`;
    
    if (parts.length > 1) {
       // Root section /en/calculators -> /pt/calculators
       newPath += `/${parts[1]}`; 
       
       if (parts.length > 2) {
          const currentSlug = parts[parts.length - 1];
          const newSlug = currentLang === 'en' ? (enToPtMap[currentSlug] || currentSlug) : (ptToEnMap[currentSlug] || currentSlug);
          
          // Rebuild middle segments (e.g., "category")
          for (let i = 2; i < parts.length - 1; i++) {
            newPath += `/${parts[i]}`;
          }
          newPath += `/${newSlug}`;
       }
    }
    
    router.push(newPath);
  };

  const navLinks = [
    { label: currentLang === 'en' ? 'Calculators' : 'Calculadoras', href: `/${currentLang}/calculators`, icon: Calculator },
    { label: currentLang === 'en' ? 'Guides' : 'Guias', href: `/${currentLang}/guides`, icon: BookOpen },
    { label: currentLang === 'en' ? 'Templates' : 'Templates', href: `/${currentLang}/templates`, icon: LayoutTemplate },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-[var(--color-border)] supports-[backdrop-filter]:bg-white/60">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href={`/${currentLang}`} className="text-xl font-bold tracking-tight text-[var(--color-primary)] flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white relative overflow-hidden">
                {/* Upward growth line styling */}
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 absolute bottom-1 left-1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                  <polyline points="16 7 22 7 22 13"></polyline>
                </svg>
              </div>
              CalcForgeTools
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full p-1 items-center gap-1 text-sm font-medium">
               <button 
                 onClick={() => currentLang !== 'en' && toggleLang()}
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[var(--color-text-primary)] transition-all ${currentLang === 'en' ? 'bg-[#F5F5F7] shadow-sm' : 'opacity-60 hover:opacity-100'}`}
                 title="Switch to English"
               >
                 <span className="text-base leading-none">🇺🇸</span> EN
               </button>
               <button 
                 onClick={() => currentLang !== 'pt' && toggleLang()}
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[var(--color-text-primary)] transition-all ${currentLang === 'pt' ? 'bg-[#F5F5F7] shadow-sm' : 'opacity-60 hover:opacity-100'}`}
                 title="Mudar para Português"
               >
                 <span className="text-base leading-none">🇧🇷</span> PT
               </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <div className="flex bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full p-1 items-center gap-1">
               <button 
                 onClick={() => currentLang !== 'en' && toggleLang()}
                 className={`p-1.5 rounded-full transition-all ${currentLang === 'en' ? 'bg-[#F5F5F7] shadow-sm' : 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0'}`}
               >
                 <span className="text-lg leading-none">🇺🇸</span>
               </button>
               <button 
                 onClick={() => currentLang !== 'pt' && toggleLang()}
                 className={`p-1.5 rounded-full transition-all ${currentLang === 'pt' ? 'bg-[#F5F5F7] shadow-sm' : 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0'}`}
               >
                 <span className="text-lg leading-none">🇧🇷</span>
               </button>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[var(--color-text-primary)] p-2 rounded-md hover:bg-[#F5F5F7] focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 pt-2 pb-6 flex flex-col gap-4 shadow-lg absolute w-full">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F5F5F7] text-[var(--color-text-primary)] font-medium transition-colors"
            >
              <link.icon size={20} className="text-[var(--color-primary)]" />
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
