// Simple safe mathematical expression evaluator
// Note: In a production app with arbitrary user inputs, a robust parser like math.js is better.
// Here we support the specific operators needed for financial calculators.

export function evaluateFormula(formula: string, variables: Record<string, number>): number {
  let expr = formula;
  
  // Replace variables with their values
  for (const [key, value] of Object.entries(variables)) {
    // Replace whole words matching the key
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    expr = expr.replace(regex, value.toString());
  }

  // Replace ^ with ** for JavaScript exponentiation
  expr = expr.replace(/\^/g, '**');

  try {
    // Avoid eval() directly; new Function is a bit safer as it runs in local scope
    // We only allow math expressions here from our own JSON configs
    const fn = new Function('return (' + expr + ');');
    const result = fn();
    
    if (isNaN(result) || !isFinite(result)) return 0;
    return result;
  } catch (error) {
    console.error("Formula evaluation error:", formula, expr, error);
    return 0;
  }
}
