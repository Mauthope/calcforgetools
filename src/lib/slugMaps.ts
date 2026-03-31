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
  'calculadora-de-cdb-lci': 'cdb-lci-calculator',
  // Labor Calculators
  'calculadora-salario-liquido-clt': 'clt-net-salary-calculator',
  'calculadora-rescisao-trabalhista': 'labor-termination-calculator',
  'calculadora-de-horas-extras': 'overtime-calculator',
  'calculadora-ferias-decimo-terceiro': 'vacation-13th-salary-calculator',
  'calculadora-custo-clt-empresa': 'clt-employer-cost-calculator',
  'calculadora-banco-horas-adicionais': 'hour-bank-calculator',
  // Financial Guides
  'como-funcionam-os-juros-compostos': 'how-compound-interest-works',
  'guia-cdb-vs-lci': 'guide-cdb-vs-lci',
  'como-calcular-porcentagens': 'how-to-calculate-percentages',
  'juros-simples-vs-compostos': 'simple-vs-compound-interest',
  'metodos-quitacao-dividas': 'debt-payoff-methods',
  'financiamento-taxa-fixa-vs-variavel': 'fixed-vs-variable-mortgage',
  'como-calcular-roi': 'how-to-calculate-roi',
  'o-que-e-cet-custo-efetivo-total': 'what-is-cet-effective-total-cost',
  'sacre-sam-vs-sac-price': 'sacre-sam-vs-sac-price',
  // Labor Guides
  'como-calcular-salario-liquido': 'how-to-calculate-net-salary',
  'como-calcular-rescisao-trabalhista': 'how-to-calculate-labor-termination',
  'como-calcular-horas-extras': 'how-to-calculate-overtime',
  'como-calcular-ferias-decimo-terceiro': 'how-to-calculate-vacation-13th-salary',
  'como-calcular-custo-empregado-clt': 'how-to-calculate-clt-employee-cost',
  'banco-de-horas-e-adicionais': 'hour-bank-and-pay-premiums',
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
