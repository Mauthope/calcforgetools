/**
 * Dynamic Content Engine
 * Parses raw JSON strings from content files and injects dynamic algorithms
 * mapped against the current temporal state (e.g., Year, calculated cumulative inflation).
 * This ensures NextJS Static Generation creates purely hardcoded HTML on build.
 */

export function processDynamicMacros(jsonString: string): string {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const prevYear = currentYear - 1;

  // --- Seasonal Algorithm: Easter Egg Inflation ---
  // Baseline established in 2023 at R$ 50.00 average for a standard 250g commercial egg.
  // Assumes a compounded gourmetization + generalized cocoa inflation rate of ~9.5% annually.
  const easterBaseYear = 2023;
  const easterBasePrice = 50.00;
  const easterAnnualInflation = 0.095;

  const compoundYears = Math.max(0, currentYear - easterBaseYear);
  const currentEasterPrice = easterBasePrice * Math.pow(1 + easterAnnualInflation, compoundYears);

  // Formatting helpers
  const formattedEasterPrice = currentEasterPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formattedRate = (easterAnnualInflation * 100).toFixed(1) + '%';

  // --- Macro Replacement ---
  let parsed = jsonString;
  
  parsed = parsed.replace(/\{\{CURRENT_YEAR\}\}/g, currentYear.toString());
  parsed = parsed.replace(/\{\{NEXT_YEAR\}\}/g, nextYear.toString());
  parsed = parsed.replace(/\{\{PREV_YEAR\}\}/g, prevYear.toString());
  
  parsed = parsed.replace(/\{\{EASTER_EGG_PRICE\}\}/g, formattedEasterPrice);
  parsed = parsed.replace(/\{\{EASTER_EGG_RATE\}\}/g, formattedRate);
  parsed = parsed.replace(/\{\{COMPOUND_YEARS\}\}/g, compoundYears.toString());

  return parsed;
}
