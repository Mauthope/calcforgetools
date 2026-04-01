/**
 * Shared cross-language slug maps for hreflang and language toggle.
 * Single source of truth used by: Navbar, calculator pages, guide pages, category pages, sitemap.
 */

export const ptToEnSlugMap: Record<string, string> = {
  // Financial Calculators
  'calculadora-de-financiamento-da-minha-casa': 'home-mortgage-calculator',
  'calculadora-de-quitacao-de-divida': 'debt-payoff-calculator',
  'calculadora-de-juros-compostos': 'compound-interest-calculator',
  'calculadora-de-porcentagem': 'percentage-calculator',
  'calculadora-de-juros-simples': 'simple-interest-calculator',
  'calculadora-de-roi': 'roi-calculator',
  'simulador-cet': 'cet-simulator',
  'simulador-sacre-sam': 'amortization-comparison-calculator',
  // Labor Calculators (No EN equivalents yet based on Option 2)
  // Financial Guides
  'como-funcionam-os-juros-compostos': 'how-compound-interest-works',
  'como-calcular-porcentagens': 'how-to-calculate-percentages',
  'juros-simples-vs-compostos': 'simple-vs-compound-interest',
  'metodos-quitacao-dividas': 'debt-payoff-methods',
  'financiamento-taxa-fixa-vs-variavel': 'fixed-vs-variable-mortgage',
  'como-calcular-roi': 'how-to-calculate-roi',
  'o-que-e-cet-custo-efetivo-total': 'what-is-cet-effective-total-cost',
  'sacre-sam-vs-sac-price': 'sacre-sam-vs-sac-price',
  // Labor Guides (No EN equivalents yet based on Option 2)
  // Categories
  'financeira': 'financial',
  'matematica': 'mathematical',
  'trabalhista': 'labor',
};

// Build reverse map automatically
export const enToPtSlugMap: Record<string, string> = Object.fromEntries(
  Object.entries(ptToEnSlugMap).map(([pt, en]) => [en, pt])
);

/**
 * Given a slug in one language, return the corresponding slug in the other language.
 * Falls back to the same slug if no mapping exists.
 */
export function getAlternateSlug(slug: string, fromLang: 'en' | 'pt'): string {
  if (fromLang === 'pt') {
    return ptToEnSlugMap[slug] || slug;
  }
  return enToPtSlugMap[slug] || slug;
}
