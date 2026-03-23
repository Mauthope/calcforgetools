import { evaluateFormula } from './formulaParser';

export interface CalculatorInput {
  name: string;
  label: string;
  type: 'number' | 'percentage' | 'currency' | 'select';
  options?: { label: string; value: string | number }[]; // for 'select' type
  defaultValue?: number | string;
}

export interface CalculatorConfig {
  calculator_id: string;
  title: string;
  inputs: CalculatorInput[];
  formula: string; // Used for display and sometimes simple logic
  outputs: string[];
  chart_type?: string;
}

// For complex financial calculations we map calculator IDs to precise TS logic.
// This is more robust than string parsing for things like amortization schedules.
export function executeCalculation(calcId: string, inputs: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  switch (calcId) {
    case 'compound_interest': {
      const p = parseFloat(inputs.initialInvestment) || 0;
      const r = (parseFloat(inputs.interestRate) || 0) / 100;
      const t = parseFloat(inputs.years) || 1;
      const n = parseFloat(inputs.compoundFrequency) || 12; // default monthly
      const pmt = parseFloat(inputs.monthlyContribution) || 0;

      // Iterative precise accrual
      const effectiveMonthlyRate = Math.pow(1 + r / n, n / 12) - 1;
      let balance = p;
      let totalContributed = p;
      let totalInterest = 0;

      for (let month = 1; month <= t * 12; month++) {
        balance += pmt;
        totalContributed += pmt;
        const interestThisMonth = balance * effectiveMonthlyRate;
        totalInterest += interestThisMonth;
        balance += interestThisMonth;
      }

      result.finalValue = balance;
      result.totalContribution = totalContributed;
      result.totalInterest = totalInterest;
      break;
    }
    
    case 'loan': {
      const p = parseFloat(inputs.loanAmount) || 0;
      const r = (parseFloat(inputs.interestRate) || 0) / 100 / 12; // monthly rate
      const n = (parseFloat(inputs.loanTermYears) || 0) * 12; // total months
      const extraPayment = parseFloat(inputs.extraPayment) || 0;
      const amType = inputs.amortizationType || 'price'; // 'price' or 'sac'

      let balance = p;
      let totalInterest = 0;
      let monthsToPayoff = 0;
      let firstPayment = 0;
      let originalTotalInterest = 0;

      // Base calculation without extra payment
      let originalBalance = p;
      for (let month = 1; month <= n; month++) {
        if (originalBalance <= 0) break;
        let interest = originalBalance * r;
        originalTotalInterest += interest;
        let principalPayment = 0;
        
        if (amType === 'sac') {
          principalPayment = p / n;
        } else {
          // Price
          const baseM = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) || (p / n);
          principalPayment = baseM - interest;
        }
        originalBalance -= principalPayment;
      }

      // Actual calculation WITH extra payment
      balance = p;
      for (let month = 1; month <= n; month++) {
        if (balance <= 0) break;
        monthsToPayoff++;
        
        let interest = balance * r;
        totalInterest += interest;
        
        let principalPayment = 0;
        let requiredPayment = 0;

        if (amType === 'sac') {
          principalPayment = p / n;
          requiredPayment = principalPayment + interest;
        } else {
          // Price
          requiredPayment = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) || (p / n);
          principalPayment = requiredPayment - interest;
        }

        if (month === 1) firstPayment = requiredPayment;

        let totalPaymentThisMonth = principalPayment + extraPayment;
        
        // If final month and overpaying
        if (totalPaymentThisMonth > balance) {
           totalPaymentThisMonth = balance;
        }
        
        balance -= totalPaymentThisMonth;
      }

      const totalPayment = p + totalInterest;

      result.monthlyBasePayment = firstPayment; // For SAC, this is the highest payment. For Price, it's the constant payment.
      if (extraPayment > 0) {
        result.totalMonthlyPayment = firstPayment + extraPayment; // First month
        result.interestSaved = originalTotalInterest - totalInterest;
        result.monthsSaved = n - monthsToPayoff;
      }
      result.totalPayment = totalPayment;
      result.totalInterest = totalInterest;
      break;
    }
    
    case 'interest': {
      // Simple Interest
      const p = parseFloat(inputs.principal) || 0;
      const r = (parseFloat(inputs.rate) || 0) / 100;
      const t = parseFloat(inputs.time) || 1;

      const interest = p * r * t;
      const total = p + interest;

      result.totalInterest = interest;
      result.finalAmount = total;
      break;
    }

    case 'debt_payoff': {
      const balance = parseFloat(inputs.balance) || 0;
      const r = (parseFloat(inputs.interestRate) || 0) / 100 / 12;
      const pmt = parseFloat(inputs.monthlyPayment) || 0;

      // Calculate months to payoff
      // Formula: N = -log(1 - (r * balance / pmt)) / log(1 + r)
      let months = 0;
      let totalInterest = 0;
      
      if (pmt > balance * r) {
        months = -Math.log(1 - (r * balance) / pmt) / Math.log(1 + r);
        months = Math.ceil(months);
        totalInterest = (months * pmt) - balance;
      } else {
        result.error = "Monthly payment is too low to cover interest.";
      }

      result.monthsToPayoff = months;
      result.totalInterestPaid = totalInterest;
      result.totalPaid = balance + totalInterest;
      break;
    }

    case 'roi': {
      const investment = parseFloat(inputs.amountInvested) || 0;
      const returns = parseFloat(inputs.amountReturned) || 0;

      const netProfit = returns - investment;
      const roi = investment > 0 ? (netProfit / investment) * 100 : 0;

      result.netProfit = netProfit;
      result.roiPercentage = roi;
      break;
    }

    default:
      // Fallback: attempts to use eval string if no strict implementation is found
      break;
  }

  return result;
}

export function formatCurrency(value: number, currencyCode: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value);
}
