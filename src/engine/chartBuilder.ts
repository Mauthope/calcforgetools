import { executeCalculation } from './calculatorEngine';

export function buildChartData(calcId: string, inputs: Record<string, any>, results: Record<string, any>, lang: string = 'en') {
  switch (calcId) {
    case 'compound_interest':
      return buildCompoundInterestChart(inputs, lang);
    case 'loan':
      return buildLoanAmortizationChart(inputs, results, lang);
    case 'interest':
    case 'roi':
    case 'debt_payoff':
      // Simplified comparison chart
      return {
        type: 'bar',
        labels: lang === 'en' ? ['Start', 'End'] : ['Início', 'Fim'],
        datasets: [
          {
            label: lang === 'en' ? 'Amount' : 'Valor',
            data: [inputs.principal || inputs.amountInvested || inputs.balance || 0, results.finalAmount || results.totalPaid || results.netProfit || 0],
            backgroundColor: 'rgba(0, 122, 255, 0.8)', // Apple Blue
            borderRadius: 8,
          }
        ]
      };
    default:
      return null;
  }
}

function buildCompoundInterestChart(inputs: Record<string, any>, lang: string) {
  const p = parseFloat(inputs.initialInvestment) || 0;
  const r = (parseFloat(inputs.interestRate) || 0) / 100;
  const t = parseFloat(inputs.years) || 10;
  const n = parseFloat(inputs.compoundFrequency) || 12;
  const pmt = parseFloat(inputs.monthlyContribution) || 0;

  const labels = [];
  const principalData = [];
  const contributionData = [];
  const interestData = [];

  let currentPrincipal = p;
  let currentContributions = 0;
  let totalInterest = 0;
  let totalBalance = p;

  const effectiveMonthlyRate = Math.pow(1 + r / n, n / 12) - 1;

  // Yearly plot
  for (let year = 0; year <= t; year++) {
    labels.push(lang === 'en' ? `Year ${year}` : `Ano ${year}`);
    
    if (year === 0) {
      principalData.push(p);
      contributionData.push(0);
      interestData.push(0);
      continue;
    }

    for (let month = 1; month <= 12; month++) {
       currentContributions += pmt;
       totalBalance += pmt;
       
       const mInterest = totalBalance * effectiveMonthlyRate;
       totalInterest += mInterest;
       totalBalance += mInterest;
    }

    principalData.push(p); // Initial principal stays constant visually
    contributionData.push(currentContributions);
    interestData.push(totalInterest);
  }

  return {
    type: 'bar',
    labels,
    datasets: [
      {
        label: lang === 'en' ? 'Initial Principal' : 'Capital Inicial',
        data: principalData,
        backgroundColor: 'rgba(142, 142, 147, 0.2)', // Very subtle gray
        borderColor: 'rgba(142, 142, 147, 0.6)',
        borderWidth: 1,
      },
      {
        label: lang === 'en' ? 'Contributions' : 'Aportes',
        data: contributionData,
        backgroundColor: 'rgba(52, 199, 89, 0.7)', // Apple Green for savings
        borderRadius: 4,
      },
      {
        label: lang === 'en' ? 'Total Interest' : 'Juros Compostos (Ganhos)',
        data: interestData,
        backgroundColor: 'rgba(0, 122, 255, 0.9)', // Apple Blue for growth
        borderRadius: 4,
      }
    ]
  };
}

function buildLoanAmortizationChart(inputs: Record<string, any>, results: Record<string, any>, lang: string) {
  const p = parseFloat(inputs.loanAmount) || 0;
  const r = (parseFloat(inputs.interestRate) || 0) / 100 / 12;
  const t = parseFloat(inputs.loanTermYears) || 0;
  const n = t * 12;
  const extraPayment = parseFloat(inputs.extraPayment) || 0;
  const amType = inputs.amortizationType || 'price';

  const monthsToPayoff = results.monthsSaved ? (n - results.monthsSaved) : n;

  const labels = [];
  const principalData = [];
  const interestData = [];
  
  let balance = p;
  let yearlyPrincipal = 0;
  let yearlyInterest = 0;

  for (let month = 1; month <= monthsToPayoff; month++) {
    let interest = balance * r;
    let principal = 0;

    if (amType === 'sac') {
       principal = p / n;
    } else {
       const baseM = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) || (p / n);
       principal = baseM - interest;
    }

    let totalPaymentThisMonth = principal + extraPayment;
    if (totalPaymentThisMonth > balance) {
       principal = balance;
       totalPaymentThisMonth = balance;
    }

    balance -= totalPaymentThisMonth;
    
    yearlyPrincipal += (principal + extraPayment);
    yearlyInterest += interest;

    if (month % 12 === 0 || month === monthsToPayoff) {
      labels.push(lang === 'en' ? `Year ${Math.ceil(month/12)}` : `Ano ${Math.ceil(month/12)}`);
      principalData.push(yearlyPrincipal);
      interestData.push(yearlyInterest);
    }
  }

  return {
    type: 'line', // Changed to Line for a smooth Apple trajectory
    labels,
    datasets: [
      {
        label: lang === 'en' ? 'Principal Paid' : 'Principal Pago',
        data: principalData,
        borderColor: 'rgba(0, 122, 255, 1)', // Apple Blue
        backgroundColor: 'rgba(0, 122, 255, 0.15)', // Semi-transparent fill
        fill: true,
        tension: 0.4,
      },
      {
        label: lang === 'en' ? 'Interest Paid' : 'Juros Pagos (Custo)',
        data: interestData,
        borderColor: 'rgba(255, 59, 48, 1)', // Apple Red
        backgroundColor: 'rgba(255, 59, 48, 0.05)', // Very light red fill
        fill: true,
        tension: 0.4,
      }
    ]
  };
}
