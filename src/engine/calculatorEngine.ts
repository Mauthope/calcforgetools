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

    case 'auto_loan': {
      const vehiclePrice = parseFloat(inputs.vehiclePrice) || 0;
      const tradeIn = parseFloat(inputs.tradeInValue) || 0;
      const downPayment = parseFloat(inputs.downPayment) || 0;
      const dealerFees = parseFloat(inputs.dealerFees) || 0;
      const stateTaxRate = (parseFloat(inputs.stateTax) || 0) / 100;
      const apr = (parseFloat(inputs.apr) || 0) / 100;
      const termMonths = parseInt(inputs.loanTerm, 10) || 60;

      // Tax is typicaly calculated on the difference between the new car and trade-in
      const taxableAmount = Math.max(0, vehiclePrice - tradeIn);
      const taxAmount = taxableAmount * stateTaxRate;

      // Out the door is the total cost footprint
      const outTheDoorCost = vehiclePrice + dealerFees + taxAmount;

      // Total Finance Principal = Out The Door - Down Payment - Trade In
      const principal = Math.max(0, outTheDoorCost - downPayment - tradeIn);

      let pmt = 0;
      let totalInterest = 0;
      
      if (principal > 0 && termMonths > 0) {
        if (apr > 0) {
           const monthlyRate = apr / 12;
           pmt = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
           totalInterest = (pmt * termMonths) - principal;
        } else {
           pmt = principal / termMonths;
        }
      }

      result.outTheDoor = outTheDoorCost;
      result.taxPaid = taxAmount;
      result.principalFinanced = principal;
      result.monthlyPayment = pmt;
      result.totalInterest = totalInterest;
      result.totalCostOfVehicle = outTheDoorCost + totalInterest;

      break;
    }

    case 'auto_loan_br': {
      const valorVeiculo = parseFloat(inputs.valorVeiculo) || 0;
      const entrada = parseFloat(inputs.entrada) || 0;
      const taxasExtras = parseFloat(inputs.taxasExtras) || 0; // TAC, IOF, Seguros embutidos
      const taxaJurosMensal = (parseFloat(inputs.taxaJurosMensal) || 0) / 100;
      const prazoMeses = parseInt(inputs.prazoMeses, 10) || 48;

      const principal = Math.max(0, valorVeiculo - entrada + taxasExtras);

      let pmt = 0;
      let totalInterest = 0;

      if (principal > 0 && prazoMeses > 0) {
        if (taxaJurosMensal > 0) {
          pmt = principal * (taxaJurosMensal * Math.pow(1 + taxaJurosMensal, prazoMeses)) / (Math.pow(1 + taxaJurosMensal, prazoMeses) - 1);
          totalInterest = (pmt * prazoMeses) - principal;
        } else {
          pmt = principal / prazoMeses;
        }
      }

      // Loop de Insight: Break-even de Depreciação (FIPE vs Saldo Devedor)
      let currentDevedor = principal;
      let currentFipe = valorVeiculo;
      let breakEvenMonth = 0; // 0 means already positive or not calculated
      let foundBreakEven = false;
      
      const anoVeiculo = parseInt(inputs.anoVeiculo, 10) || new Date().getFullYear();
      const anoAtual = new Date().getFullYear();
      const idadeInicialAnos = Math.max(0, anoAtual - anoVeiculo);

      const schedule = [];
      schedule.push({
        month: 0,
        devedor: currentDevedor,
        fipe: currentFipe
      });

      // Se já no dia zero a entrada foi maciça, ele já está com "Equity" positiva.
      if (currentFipe > currentDevedor) {
         foundBreakEven = true;
         breakEvenMonth = 1; 
      }

      for (let m = 1; m <= prazoMeses; m++) {
        let jurosMes = currentDevedor * taxaJurosMensal;
        let amortizacaoMes = pmt - jurosMes;
        currentDevedor = Math.max(0, currentDevedor - amortizacaoMes);
        
        let idadeEmMeses = (idadeInicialAnos * 12) + m;

        // Carro 0KM perde 15% no primeiro ano (m <= 12 e idadeInicial == 0). 
        // Semi-novos perdem em média 10% a.a constantes (ou + suave após os 3 anos). Aqui usaremos 10% geométrico longo prazo.
        if (idadeInicialAnos === 0 && idadeEmMeses <= 12) {
          currentFipe *= Math.pow(1 - 0.15, 1/12);
        } else {
          currentFipe *= Math.pow(1 - 0.10, 1/12);
        }

        if (!foundBreakEven && currentFipe >= currentDevedor) {
          breakEvenMonth = m;
          foundBreakEven = true;
        }

        schedule.push({
          month: m,
          devedor: currentDevedor,
          fipe: currentFipe
        });
      }

      // Se passou o loop todo e o saldo devedor NUNCA ficou menor que o carro, termina na última parcela
      if (!foundBreakEven) {
        breakEvenMonth = prazoMeses;
      }

      result.parcelaMensal = pmt;
      result.jurosTotais = totalInterest;
      result.custoEfetivoVeiculo = entrada + (pmt * prazoMeses);
      result.valorFipeFinal = currentFipe;
      result.mesIdealParaTroca = breakEvenMonth;
      result.amortization_schedule = schedule;

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

    case 'rent_vs_buy_br': {
      const propVal = parseFloat(inputs.propertyValue) || 0;
      const downCash = parseFloat(inputs.downPayment) || 0;
      const fgts = parseFloat(inputs.fgtsBalance) || 0;
      const itbiPct = (parseFloat(inputs.itbiPercent) || 0) / 100;
      const amortSys = inputs.amortizationSystem || 'SAC';
      const loanRateAnnual = (parseFloat(inputs.loanRate) || 0) / 100;
      const mipDfiAnnual = (parseFloat(inputs.mipDfiInsurance) || 0) / 100;
      const termYears = parseInt(inputs.loanTermYears) || 30;
      const monthlyRent0 = parseFloat(inputs.monthlyRent) || 0;
      const rentIncr = (parseFloat(inputs.rentIncrease) || 0) / 100;
      const propAppr = (parseFloat(inputs.propertyAppreciation) || 0) / 100;
      const invReturn = (parseFloat(inputs.investmentReturn) || 0) / 100;
      const maintPct = (parseFloat(inputs.maintenancePct) || 0) / 100;
      const horizon = parseInt(inputs.horizonYears) || 20;
      const extraYearlyAmortization = parseFloat(inputs.extraYearlyAmortization) || 0;

      const fgtsReturn = 0.04; // 3% + TR approx
      const itbiCost = propVal * itbiPct;
      
      // Total loan amount after down payments
      const totalDown = downCash + fgts;
      // Cash buy override: if total Down >= propVal, loan is 0.
      const loanPrincipal = Math.max(0, propVal - totalDown);

      const monthlyRate = loanRateAnnual / 12;
      const mipDfiMonthly = mipDfiAnnual / 12;
      const totalPayments = termYears * 12;

      // Price table fixed monthly payment (calc once)
      let priceMonthlyPayment = 0;
      if (amortSys === 'PRICE' && loanPrincipal > 0 && monthlyRate > 0 && totalPayments > 0) {
        priceMonthlyPayment = loanPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))
          / (Math.pow(1 + monthlyRate, totalPayments) - 1);
      }

      const sacAmortization = totalPayments > 0 ? loanPrincipal / totalPayments : 0;

      // Simulation timeline
      const timeline: { year: number; buyEquity: number; rentWealth: number; stackAmortization: number; stackInterest: number; stackMaintenance: number; stackItbi: number }[] = [];
      
      // --- BUY STATE ---
      let balance = loanPrincipal;
      let currentPropVal = propVal;
      let totalAmortizationPaid = totalDown;
      let totalInterestPaid = 0;
      let totalMaintenancePaid = 0;
      let buyerCashInvested = 0; // Surplus cash from decreasing SAC payments

      // --- RENT STATE ---
      // Renter only has access to the cash they didn't spend on down payment + ITBI
      let renterCashInvested = downCash + itbiCost;
      // Renter's FGTS stays in the fund
      let renterFgtsVal = fgts; 
      let currentRent = monthlyRent0;
      let totalRentCost = 0;

      let crossoverYear = 0;
      let buyerAhead = false;
      let payoffYear: number | string = "Não quitou";

      if (loanPrincipal <= 0) {
        payoffYear = "À Vista";
      }

      for (let y = 1; y <= horizon; y++) {
        // 12 months passing
        let yearPayments = 0;
        let yearInterest = 0;
        let yearAmortization = 0;
        let yearInsurance = 0;

        for (let m = 0; m < 12; m++) {
          if (balance > 0) {
            const interest = balance * monthlyRate;
            const insurance = balance * mipDfiMonthly;
            let principal = 0;
            
            if (amortSys === 'SAC') {
              principal = sacAmortization;
            } else {
              principal = priceMonthlyPayment - interest;
            }

            // Cap principal to remaining balance
            if (principal > balance) principal = balance;

            balance -= principal;
            yearPayments += (principal + interest + insurance);
            yearInterest += interest;
            yearAmortization += principal;
            yearInsurance += insurance;
          }
        }

        // Apply yearly extra amortization if balance > 0
        if (balance > 0 && extraYearlyAmortization > 0) {
          let extraAmort = extraYearlyAmortization;
          if (extraAmort > balance) extraAmort = balance;
          balance -= extraAmort;
          yearAmortization += extraAmort;
          yearPayments += extraAmort;
        }

        if (balance <= 0 && payoffYear === "Não quitou") {
          payoffYear = y;
        }

        let maintenance = currentPropVal * maintPct;
        if (y % 10 === 0) maintenance += currentPropVal * 0.02; // Choque decenal de reforma
        
        currentPropVal *= (1 + propAppr);

        // RENT 12 months
        let yearRent = currentRent * 12;

        let pvAmortization = yearAmortization;
        let pvInterest = yearInterest + yearInsurance;
        let pvMaintenance = maintenance;
        let pvRent = yearRent;

        if (inputs.discountInflation === 'yes') {
          const cvDeflator = Math.pow(1 + rentIncr, y);
          pvAmortization /= cvDeflator;
          pvInterest /= cvDeflator;
          pvMaintenance /= cvDeflator;
          pvRent /= cvDeflator;
        }

        totalAmortizationPaid += pvAmortization;
        totalInterestPaid += pvInterest; // combining insurance into "interest/fees" cost
        totalMaintenancePaid += pvMaintenance;
        totalRentCost += pvRent;

        // Symmetric Capacity Model: both start with identical monthly financial strength
        const buyerYearlyCost = yearPayments + maintenance;
        const renterYearlyCost = yearRent;
        const yearlyCapacity = Math.max(buyerYearlyCost, renterYearlyCost);
        
        const buyerSavings = yearlyCapacity - buyerYearlyCost;
        const renterSavings = yearlyCapacity - renterYearlyCost;

        // Yield Net of IR (15% on profits)
        const yieldRate = invReturn * 0.85;

        renterCashInvested = renterCashInvested + (renterCashInvested * yieldRate) + renterSavings;
        buyerCashInvested = buyerCashInvested + (buyerCashInvested * yieldRate) + buyerSavings;
        
        renterFgtsVal *= (1 + fgtsReturn);
        
        currentRent *= (1 + rentIncr);

        // 6% Broker fee applied to property value to find liquid equity on exit
        let buyEquity = (currentPropVal * 0.94) - balance + buyerCashInvested;
        let rentWealth = renterCashInvested + renterFgtsVal;

        if (inputs.discountInflation === 'yes') {
          // Deflate values back to year 0 purchasing power using the rentIncr (IPCA/IGPM proxy)
          const deflator = Math.pow(1 + rentIncr, y);
          buyEquity = buyEquity / deflator;
          rentWealth = rentWealth / deflator;
        }

        timeline.push({ 
          year: y, 
          buyEquity: Math.round(buyEquity), 
          rentWealth: Math.round(rentWealth),
          stackAmortization: Math.round(totalAmortizationPaid),
          stackInterest: Math.round(totalInterestPaid),
          stackMaintenance: Math.round(totalMaintenancePaid),
          stackItbi: Math.round(itbiCost)
        });

        if (!buyerAhead && buyEquity > rentWealth) {
          crossoverYear = y;
          buyerAhead = true;
        }
      }

      result.totalCostBuy = Math.round(totalAmortizationPaid + totalInterestPaid + totalMaintenancePaid + itbiCost);
      result.totalCostRent = Math.round(totalRentCost);
      result.crossoverYear = crossoverYear;
      result.payoffYear = payoffYear;
      
      const finalEntry = timeline[timeline.length - 1];
      result.buyEquity = finalEntry.buyEquity;
      result.rentWealth = finalEntry.rentWealth;

      let finalPropVal = currentPropVal * 0.94;
      let finalInvTotal = buyerCashInvested;

      if (inputs.discountInflation === 'yes') {
         const deflator = Math.pow(1 + rentIncr, horizon);
         finalPropVal /= deflator;
         finalInvTotal /= deflator;
      }

      result.buyerPropertyFinalValue = Math.round(finalPropVal);
      result.buyerInvestmentsFinalValue = Math.round(finalInvTotal);
      
      // Winner is strictly decided by final horizon wealth
      result.bestOption = finalEntry.buyEquity > finalEntry.rentWealth ? 'buy' : 'rent';
      result.rentVsBuyTimeline = timeline;
      break;
    }

    case 'rule_of_three': {
      const type = inputs.calcType || 'simples_direta';
      const targetVar = inputs.targetVariable || 'b2';
      
      const a1 = parseFloat(inputs.a1) || 0;
      const b1 = parseFloat(inputs.b1) || 0;
      const a2 = parseFloat(inputs.a2) || 0;
      const b2 = parseFloat(inputs.b2) || 0;

      const fmt = (n: number) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(n);

      let x = 0;
      let expression = '';
      let verification = '';
      
      if (type === 'simples_direta') {
        // Direta: A1 / B1 = A2 / B2  => Cross multiply: A1 * B2 = A2 * B1
        if (targetVar === 'a1') { x = b1 !== 0 ? (a2 * b1) / b2 : 0; expression = `(${fmt(a2)} × ${fmt(b1)}) ÷ ${fmt(b2)}`; verification = `${fmt(x)} ÷ ${fmt(b1)} = ${fmt(a2)} ÷ ${fmt(b2)}`; }
        if (targetVar === 'b1') { x = a2 !== 0 ? (a1 * b2) / a2 : 0; expression = `(${fmt(a1)} × ${fmt(b2)}) ÷ ${fmt(a2)}`; verification = `${fmt(a1)} ÷ ${fmt(x)} = ${fmt(a2)} ÷ ${fmt(b2)}`; }
        if (targetVar === 'a2') { x = b2 !== 0 ? (a1 * b2) / b1 : 0; expression = `(${fmt(a1)} × ${fmt(b2)}) ÷ ${fmt(b1)}`; verification = `${fmt(a1)} ÷ ${fmt(b1)} = ${fmt(x)} ÷ ${fmt(b2)}`; }
        if (targetVar === 'b2') { x = a1 !== 0 ? (a2 * b1) / a1 : 0; expression = `(${fmt(a2)} × ${fmt(b1)}) ÷ ${fmt(a1)}`; verification = `${fmt(a1)} ÷ ${fmt(b1)} = ${fmt(a2)} ÷ ${fmt(x)}`; }
        
        result.resultX = x;
        result.chalk_steps = [
          {
            label: 'Multiplicar cruzado em proporção direta (A₁ × B₂ = A₂ × B₁)',
            expression: `Isolando X: X = ${expression}`,
            result: fmt(x),
            highlight: true,
          },
          {
            label: 'Verificação da Razão',
            expression: verification,
            result: '✔ Válido',
          }
        ];
      } else if (type === 'simples_inversa') {
        // Inversa: A1 * B1 = A2 * B2 (Produto da linha é constante)
        if (targetVar === 'a1') { x = b1 !== 0 ? (a2 * b2) / b1 : 0; expression = `(${fmt(a2)} × ${fmt(b2)}) ÷ ${fmt(b1)}`; verification = `${fmt(x)} × ${fmt(b1)} = ${fmt(a2)} × ${fmt(b2)}`; }
        if (targetVar === 'b1') { x = a1 !== 0 ? (a2 * b2) / a1 : 0; expression = `(${fmt(a2)} × ${fmt(b2)}) ÷ ${fmt(a1)}`; verification = `${fmt(a1)} × ${fmt(x)} = ${fmt(a2)} × ${fmt(b2)}`; }
        if (targetVar === 'a2') { x = b2 !== 0 ? (a1 * b1) / b2 : 0; expression = `(${fmt(a1)} × ${fmt(b1)}) ÷ ${fmt(b2)}`; verification = `${fmt(a1)} × ${fmt(b1)} = ${fmt(x)} × ${fmt(b2)}`; }
        if (targetVar === 'b2') { x = a2 !== 0 ? (a1 * b1) / a2 : 0; expression = `(${fmt(a1)} × ${fmt(b1)}) ÷ ${fmt(a2)}`; verification = `${fmt(a1)} × ${fmt(b1)} = ${fmt(a2)} × ${fmt(x)}`; }
        
        result.resultX = x;
        result.chalk_steps = [
          {
            label: 'Multiplicar de lado em grandezas inversas (A₁ × B₁ = A₂ × B₂)',
            expression: `Isolando X: X = ${expression}`,
            result: fmt(x),
            highlight: true,
          },
          {
            label: 'Verificação do Produto',
            expression: verification,
            result: '✔ Válido',
          }
        ];
      }
      break;
    }

    case 'percentage': {

      const type = inputs.calcType || 'x_of_y';
      const x = parseFloat(inputs.valueX) || 0;
      const y = parseFloat(inputs.valueY) || 0;

      const fmt = (n: number) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(n);
      const fmtPct = (n: number) => n.toFixed(2) + '%';

      if (type === 'x_of_y') {
        // X% of Y
        const resultVal = (x / 100) * y;
        result.calculationResult = resultVal;           // X% de Y
        result.finalAmount = y + resultVal;             // Y + aumento
        result.discountAmount = y - resultVal;          // Y - desconto
        result.chalk_steps = [
          {
            label: 'Converter a porcentagem',
            expression: `${fmt(x)}% ÷ 100`,
            result: fmt(x / 100),
          },
          {
            label: `Multiplicar pelo valor base`,
            expression: `${fmt(x / 100)} × ${fmt(y)}`,
            result: fmt(resultVal),
          },
          {
            label: `→ ${fmt(x)}% de ${fmt(y)} vale`,
            expression: `(${fmt(x)} ÷ 100) × ${fmt(y)}`,
            result: fmt(resultVal),
            highlight: true,
          },
          {
            label: 'Se for DESCONTO — valor final',
            expression: `${fmt(y)} - ${fmt(resultVal)}`,
            result: fmt(y - resultVal),
          },
          {
            label: 'Se for AUMENTO — valor final',
            expression: `${fmt(y)} + ${fmt(resultVal)}`,
            result: fmt(y + resultVal),
          },
        ];
      } else if (type === 'x_is_what_percent_of_y') {
        // X is what % of Y
        const resultVal = y !== 0 ? (x / y) * 100 : 0;
        result.percentageResult = resultVal;
        result.chalk_steps = [
          {
            label: 'Dividir a parte pelo total',
            expression: `${fmt(x)} ÷ ${fmt(y)}`,
            result: fmt(y !== 0 ? x / y : 0),
          },
          {
            label: 'Multiplicar por 100 para obter %',
            expression: `(${fmt(x)} ÷ ${fmt(y)}) × 100`,
            result: fmtPct(resultVal),
            highlight: true,
          },
          {
            label: 'Interpretação',
            expression: `${fmt(x)} é <strong>${fmtPct(resultVal)}</strong> de ${fmt(y)}`,
            result: '✔',
          },
        ];
      } else if (type === 'percentage_change') {
        // % change from X to Y
        const diff = y - x;
        const resultVal = x !== 0 ? (diff / Math.abs(x)) * 100 : 0;
        result.percentageChange = resultVal;
        result.absoluteDifference = diff;
        const direction = diff >= 0 ? '↑ AUMENTO' : '↓ QUEDA';
        result.chalk_steps = [
          {
            label: 'Calcular a diferença absoluta',
            expression: `${fmt(y)} - ${fmt(x)}`,
            result: (diff >= 0 ? '+' : '') + fmt(diff),
          },
          {
            label: 'Dividir pelo valor inicial',
            expression: `${fmt(diff)} ÷ ${fmt(Math.abs(x))}`,
            result: fmt(x !== 0 ? diff / Math.abs(x) : 0),
          },
          {
            label: 'Multiplicar por 100 para obter %',
            expression: `(${fmt(diff)} ÷ ${fmt(Math.abs(x))}) × 100`,
            result: (resultVal >= 0 ? '+' : '') + fmtPct(resultVal),
            highlight: true,
          },
          {
            label: `Resultado: ${direction}`,
            expression: `De ${fmt(x)} para ${fmt(y)}`,
            result: (resultVal >= 0 ? '+' : '') + fmtPct(resultVal),
          },
        ];
      }
      break;
    }
    
    case 'cdb_lci': {
      const p = parseFloat(inputs.principal) || 0;
      const cdiAnual = (parseFloat(inputs.cdi_rate) || 0) / 100;
      const cdbMult = (parseFloat(inputs.cdb_percent) || 0) / 100;
      const lciMult = (parseFloat(inputs.lci_percent) || 0) / 100;
      const days = parseInt(inputs.days) || 1;

      // Converter CDI Anual para taxa diária equivalente (base 252 dias úteis Brasil)
      // ((1 + taxa_anual)^(1/252)) - 1
      const dailyCdi = Math.pow(1 + cdiAnual, 1 / 252) - 1;
      
      // Converter dias corridos para dias úteis (aproximação mercado: dias / 365 * 252)
      const businessDays = Math.floor(days * (252 / 365));

      const rateCDB = dailyCdi * cdbMult;
      const rateLCI = dailyCdi * lciMult;

      const cdbGross = p * Math.pow(1 + rateCDB, businessDays);
      const lciGross = p * Math.pow(1 + rateLCI, businessDays);

      const cdbProfit = cdbGross - p;
      let irRate = 0;
      if (days <= 180) irRate = 0.225;
      else if (days <= 360) irRate = 0.20;
      else if (days <= 720) irRate = 0.175;
      else irRate = 0.15;

      const cdbTax = cdbProfit * irRate;
      const cdbNet = cdbGross - cdbTax;
      const lciNet = lciGross; // LCI is exempt from IR Tax

      result.cdb_gross = cdbGross;
      result.cdb_tax = cdbTax;
      result.cdb_net = cdbNet;
      result.lci_net = lciNet;
      
      const diff = cdbNet - lciNet;
      // Identify winner based on Net value
      if (diff > 0.01) {
        result.winner = 'CDB';
      } else if (diff < -0.01) {
        result.winner = 'LCI/LCA';
      } else {
        result.winner = 'Equivalente / Empate';
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

      let total = 0;
      let displayFgts = 0;
      let displayPenalty = 0;
      let displayNotice = 0;
      let displayVacation = propVacation;
      let displayVacBonus = vacBonus;
      let display13th = prop13th;

      if (termType === 'sem_justa_causa') {
        // All benefits: vacation, 13th, FGTS withdrawable + 40% penalty + notice
        displayFgts = fgtsBalance;
        displayPenalty = fgtsPenalty;
        displayNotice = noticePay;
        total = propVacation + vacBonus + prop13th + fgtsBalance + fgtsPenalty + noticePay;
      } else if (termType === 'pedido_demissao') {
        // Vacation + 13th only. FGTS stays LOCKED (cannot withdraw).
        // No penalty, no notice pay (worker may owe notice period).
        total = propVacation + vacBonus + prop13th;
      } else {
        // justa_causa: only accrued/vested vacation (if any). No proportional vacation, no 13th, no FGTS.
        displayVacation = 0;
        displayVacBonus = 0;
        display13th = 0;
        total = 0; // Only salary balance (saldo de salário) which is handled separately
      }

      result.proportionalVacation = displayVacation;
      result.vacationBonus = displayVacBonus;
      result.proportional13th = display13th;
      result.fgtsBalance = displayFgts;
      result.fgtsPenalty = displayPenalty;
      result.noticePeriod = displayNotice;
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

    case 'clt_employer_cost': {
      const salary = parseFloat(inputs.grossSalary) || 0;
      const vt = parseFloat(inputs.valeTransporte) || 0;
      const vr = parseFloat(inputs.valeRefeicao) || 0;
      const healthPlan = parseFloat(inputs.planoSaude) || 0;
      const ratPct = parseFloat(inputs.ratPercent) || 2;
      const fap = parseFloat(inputs.fap) || 1.0;

      const inssPatronal = salary * 0.20;
      const rat = salary * (ratPct / 100) * fap;
      const terceiros = salary * 0.058;
      const fgtsMonthly = salary * 0.08;
      const provision13th = salary / 12; // 8.33%
      const provisionVacation = (salary / 12) * (4/3); // 11.11% (1/12 + 1/3 of 1/12)
      const fgts13th = provision13th * 0.08;
      const fgtsVacation = provisionVacation * 0.08;
      const totalBenefits = vt + vr + healthPlan;
      const totalEncargos = inssPatronal + rat + terceiros + fgtsMonthly + provision13th + provisionVacation + fgts13th + fgtsVacation;
      const totalMonthlyCost = salary + totalEncargos + totalBenefits;
      const annualCost = totalMonthlyCost * 12;
      const costMultiplier = totalMonthlyCost / salary;

      result.inssPatronal = inssPatronal;
      result.ratContribution = rat;
      result.terceiros = terceiros;
      result.fgtsMonthly = fgtsMonthly;
      result.provision13th = provision13th;
      result.provisionVacation = provisionVacation;
      result.totalBenefits = totalBenefits;
      result.totalMonthlyCost = totalMonthlyCost;
      result.annualCost = annualCost;
      result.costMultiplier = costMultiplier;
      break;
    }

    case 'hour_bank': {
      const salary = parseFloat(inputs.baseSalary) || 0;
      const journey = parseFloat(inputs.monthlyHours) || 220;
      const bankHours = parseFloat(inputs.bankHours) || 0;
      const insalPct = parseFloat(inputs.insalubridade) || 0;
      const pericPct = parseFloat(inputs.periculosidade) || 0;
      const nightHours = parseFloat(inputs.nightHours) || 0;
      const minWage = 1621.00; // 2026

      const hourlyRate = salary / journey;
      const insalubridade = minWage * (insalPct / 100);
      const periculosidade = salary * (pericPct / 100);
      const nightShiftTotal = hourlyRate * 0.20 * nightHours;
      const hourBankValue = bankHours * hourlyRate;
      const totalAdditionals = insalubridade + periculosidade + nightShiftTotal;
      const totalCompensation = salary + totalAdditionals;

      result.hourlyRate = hourlyRate;
      result.insalubridade = insalubridade;
      result.periculosidade = periculosidade;
      result.nightShiftTotal = nightShiftTotal;
      result.hourBankValue = hourBankValue;
      result.totalAdditionals = totalAdditionals;
      result.totalCompensation = totalCompensation;
      break;
    }

    case 'cet_simulator': {
      const principal = parseFloat(inputs.loanAmount) || 0;
      const monthlyRate = (parseFloat(inputs.monthlyRate) || 0) / 100;
      const term = parseInt(inputs.termMonths) || 12;
      const tac = parseFloat(inputs.tac) || 0;
      const iofPct = (parseFloat(inputs.iofPercent) || 0) / 100;
      const monthlyInsurance = parseFloat(inputs.monthlyInsurance) || 0;
      const otherFees = parseFloat(inputs.otherFees) || 0;

      // Price payment on principal
      const pmt = monthlyRate > 0
        ? principal * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1)
        : principal / term;
      const iofAmount = principal * iofPct;
      const insuranceTotal = monthlyInsurance * term;
      const totalPaid = (pmt * term) + insuranceTotal;
      const totalInterest = totalPaid - principal;

      // CET via Newton-Raphson IRR
      const netDisbursed = principal - tac - iofAmount - otherFees;
      const monthlyPaymentFull = pmt + monthlyInsurance;
      let cetM = monthlyRate > 0 ? monthlyRate * 1.2 : 0.01; // initial guess
      for (let iter = 0; iter < 100; iter++) {
        let npv = -netDisbursed;
        let dnpv = 0;
        for (let m = 1; m <= term; m++) {
          const disc = Math.pow(1 + cetM, m);
          npv += monthlyPaymentFull / disc;
          dnpv -= m * monthlyPaymentFull / (disc * (1 + cetM));
        }
        if (Math.abs(dnpv) < 1e-12) break;
        const step = npv / dnpv;
        cetM -= step;
        if (Math.abs(step) < 1e-10) break;
      }
      const cetAnnual = Math.pow(1 + cetM, 12) - 1;
      const nominalAnnual = Math.pow(1 + monthlyRate, 12) - 1;
      const effectiveVsNominal = cetAnnual - nominalAnnual;

      result.monthlyPayment = pmt;
      result.totalPaid = totalPaid;
      result.totalInterest = totalInterest;
      result.iofAmount = iofAmount;
      result.tacAmount = tac;
      result.insuranceTotal = insuranceTotal;
      result.cetMonthly = cetM * 100;
      result.cetAnnual = cetAnnual * 100;
      result.effectiveVsNominal = effectiveVsNominal * 100;
      break;
    }

    case 'amortization_compare': {
      const pv = parseFloat(inputs.loanAmount) || 0;
      const i = (parseFloat(inputs.monthlyRate) || 0) / 100;
      const n = parseInt(inputs.termMonths) || 360;

      // --- PRICE ---
      const pricePmt = i > 0 ? pv * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1) : pv / n;
      const priceTotalPaid = pricePmt * n;
      const priceTotalInterest = priceTotalPaid - pv;

      // --- SAC ---
      const sacAmort = pv / n;
      let sacBalance = pv;
      const sacFirst = sacAmort + sacBalance * i;
      let sacTotalPaid = 0;
      for (let m = 0; m < n; m++) {
        sacTotalPaid += sacAmort + sacBalance * i;
        sacBalance -= sacAmort;
      }
      const sacLast = sacAmort + (sacAmort + sacAmort * i); // approximate
      const sacTotalInterest = sacTotalPaid - pv;

      // --- SAM (média aritmética Price + SAC por período) ---
      sacBalance = pv;
      let samTotalPaid = 0;
      let samFirst = 0;
      let samLast = 0;
      for (let m = 0; m < n; m++) {
        const sacPmt = sacAmort + sacBalance * i;
        const samPmt = (pricePmt + sacPmt) / 2;
        if (m === 0) samFirst = samPmt;
        if (m === n - 1) samLast = samPmt;
        samTotalPaid += samPmt;
        sacBalance -= sacAmort;
      }
      const samTotalInterest = samTotalPaid - pv;

      // --- SACRE (recalculates every 12 months) ---
      let sacreBalance = pv;
      let sacreTotalPaid = 0;
      let sacreFirst = 0;
      let sacreLast = 0;
      let sacreCurrentPmt = 0;
      let remainingPeriods = n;
      for (let m = 0; m < n; m++) {
        if (m % 12 === 0) {
          // Recalculate: new fixed payment based on remaining balance and periods
          const rem = remainingPeriods;
          sacreCurrentPmt = i > 0
            ? sacreBalance * (i * Math.pow(1 + i, rem)) / (Math.pow(1 + i, rem) - 1)
            : sacreBalance / rem;
        }
        const interest = sacreBalance * i;
        const amort = sacreCurrentPmt - interest;
        sacreBalance = Math.max(sacreBalance - amort, 0);
        sacreTotalPaid += sacreCurrentPmt;
        remainingPeriods--;
        if (m === 0) sacreFirst = sacreCurrentPmt;
        if (m === n - 1) sacreLast = sacreCurrentPmt;
      }
      const sacreTotalInterest = sacreTotalPaid - pv;

      // Find best system
      const systems = [
        { name: 'Price', total: priceTotalInterest },
        { name: 'SAC', total: sacTotalInterest },
        { name: 'SAM', total: samTotalInterest },
        { name: 'SACRE', total: sacreTotalInterest }
      ];
      const best = systems.reduce((a, b) => a.total < b.total ? a : b);
      const savingsVsPrice = priceTotalInterest - best.total;

      result.priceFirstPayment = pricePmt;
      result.priceLastPayment = pricePmt;
      result.priceTotalPaid = priceTotalPaid;
      result.priceTotalInterest = priceTotalInterest;
      result.sacFirstPayment = sacFirst;
      result.sacLastPayment = sacAmort + sacAmort * i;
      result.sacTotalPaid = sacTotalPaid;
      result.sacTotalInterest = sacTotalInterest;
      result.samFirstPayment = samFirst;
      result.samLastPayment = samLast;
      result.samTotalPaid = samTotalPaid;
      result.samTotalInterest = samTotalInterest;
      result.sacreFirstPayment = sacreFirst;
      result.sacreLastPayment = sacreLast;
      result.sacreTotalPaid = sacreTotalPaid;
      result.sacreTotalInterest = sacreTotalInterest;
      result.bestSystem = best.name;
      result.savingsVsPrice = savingsVsPrice;
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
