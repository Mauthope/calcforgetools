import React from 'react';
import Link from 'next/link';
import { Container } from '../ui/Container';

interface FooterProps {
  lang: 'en' | 'pt';
}

export function Footer({ lang }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  const sections = {
    en: [
      {
        title: "Calculators",
        links: [
          { label: "All Calculators", href: "/en/calculators" },
          { label: "Compound Interest", href: "/en/calculators/compound-interest-calculator" },
          { label: "Debt Payoff", href: "/en/calculators/debt-payoff-calculator" },
        ]
      },
      {
        title: "Resources",
        links: [
          { label: "Knowledge Guides", href: "/en/guides" },
          { label: "Premium Dashboards", href: "/en/templates" },
        ]
      },
      {
        title: "Company",
        links: [
          { label: "About CalcForgeTools", href: "/en/about" },
          { label: "Terms of Service", href: "/en/terms" },
          { label: "Privacy Policy", href: "/en/privacy" },
        ]
      }
    ],
    pt: [
      {
        title: "Calculadoras",
        links: [
          { label: "Todas as Calculadoras", href: "/pt/calculators" },
          { label: "Juros Compostos", href: "/pt/calculators/calculadora-de-juros-compostos" },
          { label: "Quitação de Dívida", href: "/pt/calculators/calculadora-de-quitacao-de-divida" },
        ]
      },
      {
        title: "Recursos",
        links: [
          { label: "Guias de Conhecimento", href: "/pt/guides" },
          { label: "Dashboards Premium", href: "/pt/templates" },
        ]
      },
      {
        title: "Empresa",
        links: [
          { label: "Sobre o CalcForgeTools", href: "/pt/about" },
          { label: "Termos de Serviço", href: "/pt/terms" },
          { label: "Política de Privacidade", href: "/pt/privacy" },
        ]
      }
    ]
  };

  const footerData = sections[lang] || sections.en;

  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] pt-16 pb-8 mt-auto">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1 flex flex-col">
            <Link href={`/${lang}`} className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-[var(--color-primary)] flex items-center justify-center text-white relative overflow-hidden">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 absolute bottom-[3px] left-[3px]" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                  <polyline points="16 7 22 7 22 13"></polyline>
                </svg>
              </div>
              CalcForgeTools
            </Link>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-xs mt-2">
              {lang === 'en' 
                ? "A modern, reliable platform for financial and business calculations."
                : "Uma plataforma moderna e confiável para cálculos financeiros e empresariais."}
            </p>
          </div>
          
          {footerData.map((section, idx) => (
            <div key={idx} className="flex flex-col">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] tracking-wide mb-4">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-3 text-sm">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-text-secondary)]">
            &copy; {currentYear} CalcForgeTools. {lang === 'en' ? 'All rights reserved.' : 'Todos os direitos reservados.'}
          </p>
        </div>
      </Container>
    </footer>
  );
}
