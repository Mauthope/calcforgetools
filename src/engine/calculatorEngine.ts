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
      const amType = inputs.amortizationType || 'price'; // Active selection

      // Generic Simulator function
      const simulateAmortization = (type: 'price' | 'sac') => {
        let balance = p;
        let totalInterest = 0;
        let monthsToPayoff = 0;
        let firstPayment = 0;
        let originalTotalInterest = 0;

        // Base run (no extra)
        let origBal = p;
        for (let m = 1; m <= n; m++) {
          if (origBal <= 0) break;
          let interest = origBal * r;
          originalTotalInterest += interest;
          let princ = 0;
          if (type === 'sac') {
            princ = p / n;
          } else {
            const baseM = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) || (p / n);
            princ = baseM - interest;
          }
          origBal -= princ;
        }

        // Action run (with extra)
        balance = p;
        for (let m = 1; m <= n; m++) {
          if (balance <= 0) break;
          monthsToPayoff++;
          let interest = balance * r;
          totalInterest += interest;

          let princ = 0;
          let requiredM = 0;
          if (type === 'sac') {
            princ = p / n;
            requiredM = princ + interest;
          } else {
            requiredM = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) || (p / n);
            princ = requiredM - interest;
          }

          if (m === 1) firstPayment = requiredM;
          
          let totalMThisMonth = princ + extraPayment;
          if (totalMThisMonth > balance) {
            totalMThisMonth = balance;
          }
          balance -= totalMThisMonth;
        }

        return { totalInterest, monthsToPayoff, firstPayment, originalTotalInterest };
      };

      const priceSim = simulateAmortization('price');
      const sacSim = simulateAmortization('sac');

      // Bind to active selected type
      const activeSim = amType === 'sac' ? sacSim : priceSim;

      result.monthlyBasePayment = activeSim.firstPayment;
      if (extraPayment > 0) {
        result.totalMonthlyPayment = activeSim.firstPayment + extraPayment;
        result.interestSaved = activeSim.originalTotalInterest - activeSim.totalInterest;
        result.monthsSaved = n - activeSim.monthsToPayoff;
      }
      
      result.totalPayment = p + activeSim.totalInterest;
      result.totalInterest = activeSim.totalInterest;

      // Inject background dual metrics for Smart Insights
      result.priceTotalInterest = priceSim.totalInterest;
      result.sacTotalInterest = sacSim.totalInterest;
      result.priceMonthsToPayoff = priceSim.monthsToPayoff;
      result.sacMonthsToPayoff = sacSim.monthsToPayoff;

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

    case 'percentage': {
      const type = inputs.calcType || 'x_of_y';
      const x = parseFloat(inputs.valueX) || 0;
      const y = parseFloat(inputs.valueY) || 0;

      if (type === 'x_of_y') {
        const resultVal = (x / 100) * y;
        result.calculationResult = resultVal;
        result.finalAmount = y + resultVal; // Contextual addition
        result.discountAmount = y - resultVal; // Contextual subtraction
      } else if (type === 'x_is_what_percent_of_y') {
        const resultVal = y !== 0 ? (x / y) * 100 : 0;
        result.percentageResult = resultVal;
      } else if (type === 'percentage_change') {
        const diff = y - x;
        const resultVal = x !== 0 ? (diff / Math.abs(x)) * 100 : 0;
        result.percentageChange = resultVal;
        result.absoluteDifference = diff;
      }
      break;
    }

    case 'clt_salary': {
      const gross = parseFloat(inputs.grossSalary) || 0;
      const deps = parseFloat(inputs.dependents) || 0;
      const otherDed = parseFloat(inputs.otherDeductions) || 0;

      // 2026 Progressive INSS (Portaria MPS 2026, fonte: gov.br)
      let inss = 0;
      const inssBands = [
        { limit: 1621.00, rate: 0.075 },
        { limit: 2902.84, rate: 0.09 },
        { limit: 4354.27, rate: 0.12 },
        { limit: 8475.55, rate: 0.14 }
      ];
      let remaining = gross;
      let prevLimit = 0;
      for (const band of inssBands) {
        const taxable = Math.min(remaining, band.limit - prevLimit);
        if (taxable <= 0) break;
        inss += taxable * band.rate;
        remaining -= taxable;
        prevLimit = band.limit;
      }
      if (gross > 8475.55) inss = 988.09; // INSS ceiling 2026

      // IRRF 2026 — Lei nº 15.270/2025 (fonte: gov.br)
      // Step 1: traditional IRRF calculation
      const depDeduction = deps * 189.59;
      const irrfBase = gross - inss - depDeduction - otherDed;

      let irrfTraditional = 0;
      if (irrfBase > 4664.68) {
        irrfTraditional = irrfBase * 0.275 - 908.73;
      } else if (irrfBase > 3751.05) {
        irrfTraditional = irrfBase * 0.225 - 692.78;
      } else if (irrfBase > 2826.65) {
        irrfTraditional = irrfBase * 0.15 - 394.16;
      } else if (irrfBase > 2428.80) {
        irrfTraditional = irrfBase * 0.075 - 182.16;
      }
      if (irrfTraditional < 0) irrfTraditional = 0;

      // Step 2: new 2026 exemption/reduction mechanism
      let irrf = irrfTraditional;
      if (gross <= 5000.00) {
        // Full exemption for gross up to R$ 5.000
        irrf = 0;
      } else if (gross <= 7350.00) {
        // Descending reduction: R$ 978.62 - (0.133145 × gross)
        const reduction = 978.62 - (0.133145 * gross);
        irrf = Math.max(irrfTraditional - Math.max(reduction, 0), 0);
      }
      // Above R$ 7.350: no additional reduction, traditional table applies

      const fgts = gross * 0.08;
      const totalDeductions = inss + irrf + otherDed;
      const net = gross - totalDeductions;

      result.inssDeduction = inss;
      result.irrfDeduction = irrf;
      result.totalDeductions = totalDeductions;
      result.netSalary = net;
      result.fgtsDeposit = fgts;
      break;
    }

    case 'labor_termination': {
      const salary = parseFloat(inputs.monthlySalary) || 0;
      const startStr = inputs.startDate || '';
      const endStr = inputs.endDate || '';
      const termType = inputs.terminationType || 'sem_justa_causa';

      const start = startStr ? new Date(startStr) : new Date();
      const end = endStr ? new Date(endStr) : new Date();

      // Months worked in the current vacation period (proportional vacation)
      const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      const vacMonths = totalMonths % 12 || 1; // months since last vacation cycle
      const propVacation = (salary / 12) * vacMonths;
      const vacBonus = propVacation / 3; // 1/3 constitucional

      // Proportional 13th salary (months in current year)
      const monthsThisYear = end.getMonth() + 1; // Jan=0+1=1
      const prop13th = (salary / 12) * monthsThisYear;

      // FGTS balance estimate (8% per month of entire period)
      const fgtsBalance = salary * 0.08 * totalMonths;

      // 40% FGTS penalty (only sem_justa_causa)
      const fgtsPenalty = termType === 'sem_justa_causa' ? fgtsBalance * 0.40 : 0;

      // Notice period (30 days + 3 days per year worked, capped at 90 extra days)
      const yearsWorked = Math.floor(totalMonths / 12);
      const noticeDays = termType === 'justa_causa' ? 0 : Math.min(30 + (yearsWorked * 3), 120);
      const noticePay = termType === 'pedido_demissao' ? 0 : (salary / 30) * noticeDays;

      let total = propVacation + vacBonus + prop13th;
      if (termType === 'sem_justa_causa') {
        total += fgtsBalance + fgtsPenalty + noticePay;
      } else if (termType === 'pedido_demissao') {
        total += fgtsBalance;
      }
      // justa_causa: no FGTS, no penalty, no notice

      result.proportionalVacation = propVacation;
      result.vacationBonus = vacBonus;
      result.proportional13th = prop13th;
      result.fgtsBalance = fgtsBalance;
      result.fgtsPenalty = fgtsPenalty;
      result.noticePeriod = noticePay;
      result.totalRescission = total;
      break;
    }

    case 'overtime': {
      const salary = parseFloat(inputs.monthlySalary) || 0;
      const weeklyHours = parseFloat(inputs.weeklyHours) || 44;
      const overtimeHours50 = parseFloat(inputs.overtimeHours50) || 0;
      const overtimeHours100 = parseFloat(inputs.overtimeHours100) || 0;
      const nightHours = parseFloat(inputs.nightShiftHours) || 0;

      // CLT: monthly hours = weekly hours × 5 (weeks/month)
      const monthlyHours = (weeklyHours / 6) * 30;
      const hourlyRate = salary / monthlyHours;

      // Overtime 50% (weekday) and 100% (Sunday/holiday)
      const overtime50Value = overtimeHours50 * hourlyRate * 1.5;
      const overtime100Value = overtimeHours100 * hourlyRate * 2.0;

      // Night shift bonus: 20% adicional noturno (22h-5h)
      const nightBonus = nightHours * hourlyRate * 0.2;

      const totalOvertime = overtime50Value + overtime100Value + nightBonus;
      const totalSalary = salary + totalOvertime;

      result.hourlyRate = hourlyRate;
      result.overtime50Value = overtime50Value;
      result.overtime100Value = overtime100Value;
      result.nightShiftBonus = nightBonus;
      result.totalOvertime = totalOvertime;
      result.totalSalaryWithOvertime = totalSalary;
      break;
    }

    case 'vacation_13th': {
      const salary = parseFloat(inputs.monthlySalary) || 0;
      const monthsWorked = parseFloat(inputs.monthsWorked) || 12;
      const vacationType = inputs.vacationType || 'full';
      const sellDays = parseFloat(inputs.sellDays) || 0;

      // Vacation calculation
      let vacationDays = 30;
      if (vacationType === 'full') {
        vacationDays = 30;
      } else {
        vacationDays = Math.floor((monthsWorked / 12) * 30);
      }

      // Abono pecuniário (sell up to 1/3 of vacation = 10 days max)
      const maxSellDays = Math.floor(vacationDays / 3);
      const actualSellDays = Math.min(sellDays, maxSellDays);
      const enjoyedDays = vacationDays - actualSellDays;

      const dailyRate = salary / 30;
      const vacationPay = dailyRate * vacationDays;
      const vacationBonus = vacationPay / 3; // 1/3 constitucional
      const sellValue = dailyRate * actualSellDays + (dailyRate * actualSellDays) / 3;

      // 13th salary (proportional)
      const thirteenthPay = (salary / 12) * monthsWorked;

      const totalVacation = vacationPay + vacationBonus + sellValue;
      const grandTotal = totalVacation + thirteenthPay;

      result.vacationPay = vacationPay;
      result.vacationBonus = vacationBonus;
      result.sellValue = sellValue;
      result.enjoyedDays = enjoyedDays;
      result.thirteenthPay = thirteenthPay;
      result.totalVacationPackage = totalVacation;
      result.grandTotal = grandTotal;
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
