import { executeCalculation } from './calculatorEngine';

export function buildChartData(calcId: string, inputs: Record<string, any>, results: Record<string, any>, lang: string = 'en') {
  switch (calcId) {
    case 'compound_interest':
      return buildCompoundInterestChart(inputs, lang);
    case 'loan':
      return buildLoanAmortizationChart(inputs, results, lang);
    case 'rent_vs_buy': {
      if (!results.rentVsBuyTimeline) return null;
      const tl = results.rentVsBuyTimeline;
      const cross = results.crossoverYear || 0;
      return {
        type: 'line',
        labels: tl.map((r: any) => `${lang === 'en' ? 'Year' : 'Ano'} ${r.year}`),
        datasets: [
          {
            label: lang === 'en' ? 'Buyer Equity (Home Value − Mortgage)' : 'Patrimônio do Comprador (Imóvel − Dívida)',
            data: tl.map((r: any) => r.buyEquity),
            borderColor: 'rgba(52, 199, 89, 1)',
            backgroundColor: 'rgba(52, 199, 89, 0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2.5,
          },
          {
            label: lang === 'en' ? 'Renter Wealth (Investments)' : 'Patrimônio do Inquilino (Investimentos)',
            data: tl.map((r: any) => r.rentWealth),
            borderColor: 'rgba(0, 122, 255, 1)',
            backgroundColor: 'rgba(0, 122, 255, 0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2.5,
          }
        ],
        crossoverYear: cross,
      };
    }
    case 'cdb_lci':
      return {
        type: 'bar',
        labels: lang === 'en' ? ['CDB (Net Return)', 'LCI/LCA (Net Return)'] : ['CDB (Retorno Líquido)', 'LCI/LCA (Retorno Líquido)'],
        datasets: [{
          label: lang === 'en' ? 'Final Net Value' : 'Valor Líquido Final',
          data: [results.cdb_net || 0, results.lci_net || 0],
          backgroundColor: [
            'rgba(0, 122, 255, 0.8)', // Apple Blue
            'rgba(52, 199, 89, 0.8)'  // Apple Green
          ],
          borderRadius: 8,
        }]
      };
    case 'percentage':
      return buildPercentageChart(inputs, results, lang);
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
    case 'clt_salary':
      return {
        type: 'doughnut',
        labels: lang === 'en' 
          ? ['Net Salary', 'INSS', 'IRRF', 'Other Deductions'] 
          : ['Salário Líquido', 'INSS', 'IRRF', 'Outras Deduções'],
        datasets: [{
          data: [
            results.netSalary || 0,
            results.inssDeduction || 0,
            results.irrfDeduction || 0,
            parseFloat(inputs.otherDeductions) || 0
          ],
          backgroundColor: [
            'rgba(52, 199, 89, 0.9)',
            'rgba(255, 149, 0, 0.8)',
            'rgba(255, 59, 48, 0.8)',
            'rgba(142, 142, 147, 0.5)'
          ],
          borderWidth: 0,
        }]
      };
    case 'labor_termination':
      return {
        type: 'bar',
        labels: lang === 'en'
          ? ['Vacation', '1/3 Bonus', '13th Salary', 'FGTS', 'FGTS Penalty', 'Notice']
          : ['Férias Prop.', '1/3 Férias', '13° Prop.', 'FGTS', 'Multa FGTS', 'Aviso Prévio'],
        datasets: [{
          label: lang === 'en' ? 'Breakdown' : 'Detalhamento',
          data: [
            results.proportionalVacation || 0,
            results.vacationBonus || 0,
            results.proportional13th || 0,
            results.fgtsBalance || 0,
            results.fgtsPenalty || 0,
            results.noticePeriod || 0
          ],
          backgroundColor: [
            'rgba(0, 122, 255, 0.8)',
            'rgba(88, 86, 214, 0.8)',
            'rgba(52, 199, 89, 0.8)',
            'rgba(255, 149, 0, 0.8)',
            'rgba(255, 59, 48, 0.8)',
            'rgba(175, 82, 222, 0.8)'
          ],
          borderRadius: 8,
        }]
      };
    case 'overtime':
      return {
        type: 'bar',
        labels: lang === 'en'
          ? ['Overtime 50%', 'Overtime 100%', 'Night Shift Bonus', 'Base Salary']
          : ['HE 50%', 'HE 100%', 'Adicional Noturno', 'Salário Base'],
        datasets: [{
          label: lang === 'en' ? 'Breakdown' : 'Detalhamento',
          data: [
            results.overtime50Value || 0,
            results.overtime100Value || 0,
            results.nightShiftBonus || 0,
            parseFloat(inputs.monthlySalary) || 0
          ],
          backgroundColor: [
            'rgba(255, 149, 0, 0.8)',
            'rgba(255, 59, 48, 0.8)',
            'rgba(88, 86, 214, 0.8)',
            'rgba(52, 199, 89, 0.8)'
          ],
          borderRadius: 8,
        }]
      };
    case 'vacation_13th':
      return {
        type: 'bar',
        labels: lang === 'en'
          ? ['Vacation Pay', '1/3 Bonus', 'Sell Days', '13th Salary']
          : ['Férias', '1/3 Férias', 'Abono Pecuniário', '13° Salário'],
        datasets: [{
          label: lang === 'en' ? 'Breakdown' : 'Detalhamento',
          data: [
            results.vacationPay || 0,
            results.vacationBonus || 0,
            results.sellValue || 0,
            results.thirteenthPay || 0
          ],
          backgroundColor: [
            'rgba(0, 122, 255, 0.8)',
            'rgba(88, 86, 214, 0.8)',
            'rgba(175, 82, 222, 0.8)',
            'rgba(52, 199, 89, 0.8)'
          ],
          borderRadius: 8,
        }]
      };
    case 'auto_loan_br':
      if (!results.amortization_schedule) return null;
      return {
        type: 'line',
        labels: results.amortization_schedule.map((row: any) => `${lang === 'en' ? 'Mo' : 'Mês'} ${row.month}`),
        datasets: [
          {
            label: lang === 'en' ? 'Bank Debt' : 'Dívida c/ Banco (Saldo Devedor)',
            data: results.amortization_schedule.map((row: any) => row.devedor),
            borderColor: 'rgba(255, 59, 48, 1)', // Red
            backgroundColor: 'rgba(255, 59, 48, 0.1)',
            fill: true,
            tension: 0.4,
          },
          {
            label: lang === 'en' ? 'FIPE Vehicle Value' : 'Valor FIPE do Carro',
            data: results.amortization_schedule.map((row: any) => row.fipe),
            borderColor: 'rgba(175, 82, 222, 1)', // Purple
            backgroundColor: 'rgba(175, 82, 222, 0.1)',
            fill: true,
            tension: 0.4,
          }
        ]
      };
    case 'clt_employer_cost':
      return {
        type: 'doughnut',
        labels: lang === 'en'
          ? ['INSS Employer', 'RAT/FAP', 'Third Party', 'FGTS', '13th Provision', 'Vacation Provision', 'Benefits']
          : ['INSS Patronal', 'RAT/FAP', 'Terceiros', 'FGTS', 'Provisão 13°', 'Provisão Férias', 'Benefícios'],
        datasets: [{
          data: [
            results.inssPatronal || 0, results.ratContribution || 0, results.terceiros || 0,
            results.fgtsMonthly || 0, results.provision13th || 0, results.provisionVacation || 0,
            results.totalBenefits || 0
          ],
          backgroundColor: [
            'rgba(255, 59, 48, 0.8)', 'rgba(255, 149, 0, 0.8)', 'rgba(255, 204, 0, 0.8)',
            'rgba(52, 199, 89, 0.8)', 'rgba(0, 122, 255, 0.8)', 'rgba(88, 86, 214, 0.8)',
            'rgba(175, 82, 222, 0.8)'
          ],
        }]
      };
    case 'hour_bank':
      return {
        type: 'bar',
        labels: lang === 'en'
          ? ['Base Salary', 'Unhealthy', 'Hazard', 'Night Shift', 'Hour Bank']
          : ['Salário Base', 'Insalubridade', 'Periculosidade', 'Noturno', 'Banco de Horas'],
        datasets: [{
          label: lang === 'en' ? 'Components' : 'Componentes',
          data: [
            parseFloat(inputs.baseSalary) || 0, results.insalubridade || 0,
            results.periculosidade || 0, results.nightShiftTotal || 0, results.hourBankValue || 0
          ],
          backgroundColor: [
            'rgba(52, 199, 89, 0.8)', 'rgba(255, 149, 0, 0.8)', 'rgba(255, 59, 48, 0.8)',
            'rgba(88, 86, 214, 0.8)', 'rgba(0, 122, 255, 0.8)'
          ],
          borderRadius: 8,
        }]
      };
    case 'cet_simulator':
      return {
        type: 'bar',
        labels: lang === 'en'
          ? ['Nominal Rate', 'CET (True Cost)', 'Difference']
          : ['Taxa Nominal', 'CET (Custo Real)', 'Diferença'],
        datasets: [{
          label: lang === 'en' ? 'Annual %' : '% Anual',
          data: [
            (Math.pow(1 + (parseFloat(inputs.monthlyRate) || 0) / 100, 12) - 1) * 100,
            results.cetAnnual || 0, results.effectiveVsNominal || 0
          ],
          backgroundColor: ['rgba(52, 199, 89, 0.8)', 'rgba(255, 59, 48, 0.8)', 'rgba(255, 149, 0, 0.8)'],
          borderRadius: 8,
        }]
      };
    case 'amortization_compare':
      return {
        type: 'bar',
        labels: ['Price', 'SAC', 'SAM', 'SACRE'],
        datasets: [{
          label: lang === 'en' ? 'Total Interest' : 'Total de Juros',
          data: [
            results.priceTotalInterest || 0, results.sacTotalInterest || 0,
            results.samTotalInterest || 0, results.sacreTotalInterest || 0
          ],
          backgroundColor: [
            'rgba(255, 59, 48, 0.8)', 'rgba(52, 199, 89, 0.8)',
            'rgba(0, 122, 255, 0.8)', 'rgba(88, 86, 214, 0.8)'
          ],
          borderRadius: 8,
        }]
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

function buildPercentageChart(inputs: Record<string, any>, results: Record<string, any>, lang: string) {
  const type = inputs.calcType || 'x_of_y';
  const x = parseFloat(inputs.valueX) || 0;
  const y = parseFloat(inputs.valueY) || 0;
  
  if (type === 'percentage_change') {
    return {
      type: 'bar',
      labels: lang === 'en' ? ['Original Value', 'New Value'] : ['Valor Original', 'Novo Valor'],
      datasets: [
        {
          label: lang === 'en' ? 'Evolution' : 'Evolução',
          data: [x, y],
          backgroundColor: y >= x ? 'rgba(52, 199, 89, 0.8)' : 'rgba(255, 59, 48, 0.8)',
          borderRadius: 8,
        }
      ]
    };
  }

  // Treat 'x_of_y' and 'x_is_what_percent_of_y' as Part-to-Whole Doughnut charts
  const part = type === 'x_of_y' ? results.calculationResult : x;
  const whole = type === 'x_of_y' ? y : y;
  
  // If part is larger than whole, cap semantic representation so the chart doesn't break
  const remainder = whole >= part ? whole - part : 0;

  return {
    type: 'doughnut',
    labels: lang === 'en' ? ['Target Share', 'Remaining Base'] : ['Fatia Alvo', 'Restante da Base'],
    datasets: [
      {
        data: [part, remainder],
        backgroundColor: [
          'rgba(0, 122, 255, 0.9)', // Apple Blue
          'rgba(142, 142, 147, 0.2)' // Subtle Gray
        ],
        borderWidth: 0,
      }
    ]
  };
}
