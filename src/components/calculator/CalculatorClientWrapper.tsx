"use client";

import React, { useState, useEffect } from 'react';
import { executeCalculation } from '@/engine/calculatorEngine';
import { buildChartData } from '@/engine/chartBuilder';
import { InputField } from '@/components/ui/InputField';
import { SelectField } from '@/components/ui/SelectField';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ResultPanel } from '@/components/ui/ResultPanel';
import { ChartView } from '@/components/ui/ChartView';
import { SmartInsight } from '@/components/ui/SmartInsight';
import { ScrollReveal } from '@/components/ui/motion/ScrollReveal';
import { Check, Share2, FileSpreadsheet, Send, MessageCircle } from 'lucide-react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

interface CalculatorClientWrapperProps {
  config: any;
  lang: string;
  premiumTemplate?: React.ReactNode;
  children?: React.ReactNode;
}

export function CalculatorClientWrapper({ config, lang, premiumTemplate, children }: CalculatorClientWrapperProps) {
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [results, setResults] = useState<Record<string, any>>({});
  const [chartData, setChartData] = useState<any>(null);

  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Initialize defaults
  useEffect(() => {
    if (config?.inputs) {
      const defaults: Record<string, any> = {};
      config.inputs.forEach((input: any) => {
        defaults[input.name] = input.defaultValue || '';
      });
      setInputs(defaults);
      calculate(defaults); // Initial calculation
    }
  }, [config]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => {
      const newInputs = { ...prev, [name]: value };
      calculate(newInputs); // Real-time Unicorn Studio reactive UX
      return newInputs;
    });
  };

  const calculate = (currentInputs = inputs) => {
    if(!config) return;
    const res = executeCalculation(config.calculator_id, currentInputs);
    setResults(res);
    
    if(res && !res.error && config.chart_type) {
        const chart = buildChartData(config.calculator_id, currentInputs, res, lang);
        setChartData(chart);
    } else {
        setChartData(null);
    }
  };

  const [hasSaved, setHasSaved] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculate();
    // In the future, this is where you fire the fbq('track', 'GenerateLead') or Google Analytics Pixel.
    setHasSaved(true);
  };

  const handleShare = () => {
    let summaryText = '';
    
    if (config?.outputs && results && Object.keys(results).length > 0 && !results.error) {
      const isPt = lang === 'pt';
      summaryText = isPt ? '📊 *Resumo da minha simulação:*\n\n' : '📊 *My simulation summary:*\n\n';
      
      config.outputs.forEach((outKey: string) => {
        if (results[outKey] !== undefined) {
          const label = formatOutputLabel(outKey);
          const value = formatOutput(outKey, results[outKey]);
          summaryText += `🔹 *${label}:* ${value}\n`;
        }
      });
      summaryText += '\n';
    }

    const text = lang === 'en' 
      ? `I just ran a financial simulation on *CalcForgeTools*!\n\n${summaryText}Do your own free simulation here: ${window.location.href}`
      : `Acabei de rodar uma simulação matemática no *CalcForgeTools*!\n\n${summaryText}Faça a sua simulação grátis aqui e tire a prova: ${window.location.href}`;
      
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if(!email || !email.includes('@')) {
      setEmailError(lang === 'en' ? 'Please enter a valid email.' : 'Insira um e-mail válido.');
      return;
    }
    
    setIsEmailSending(true);
    setEmailError('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          source_calculator: config.slug,
          language: lang
        })
      });

      if(response.ok) {
        setEmailSent(true);
      } else {
        const errorData = await response.json();
        console.error('Email lead capture failed', errorData);
        setEmailSent(true); // Fallback to unblock user if keys are missing
      }
    } catch (err) {
      console.error('Email request failed', err);
      setEmailSent(true);
    } finally {
      setIsEmailSending(false);
    }
  };

  const formatOutput = (key: string, val: any) => {
    if (typeof val !== 'number') return val;
    // Simple heuristic: if key contains 'Interest', 'Value', 'Amount', 'Payment', 'Contribution', 'Paid', 'Profit', it's currency.
    // If it contains 'Percentage', 'roi', it's %.
    // If it contains 'months', it's a raw number.
    const lower = key.toLowerCase();
    
    if (lower.includes('percentage') || lower === 'roi') {
      return val.toFixed(2) + '%';
    }
    if (lower.includes('month') || lower.includes('mês') || lower.includes('mes') || lower.includes('year') || lower.includes('ano')) {
      return Math.round(val).toString();
    }
    
    // Default to currency (USD or BRL depending on locale, for simplicity here we just use the browser locale or rely on the manual formatter)
    return new Intl.NumberFormat(lang === 'pt' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: lang === 'pt' ? 'BRL' : 'USD'
    }).format(val);
  };

  const formatOutputLabel = (key: string) => {
    const ptLabels: Record<string, string> = {
      finalValue: "Valor Final",
      totalContribution: "Aportes Totais",
      totalInterest: "Total de Juros",
      monthlyPayment: "Parcela Mensal",
      monthlyBasePayment: "Parcela Base",
      totalMonthlyPayment: "Pagamento Total Mensal",
      interestSaved: "Juros Economizados",
      monthsSaved: "Meses Adiantados",
      totalPayment: "Pagamento Total",
      totalInterestPaid: "Total de Juros Pagos",
      finalAmount: "Montante Final",
      monthsToPayoff: "Meses até Quitação",
      totalPaid: "Total Pago",
      netProfit: "Lucro Líquido",
      roiPercentage: "Porcentagem de ROI",
      calculationResult: "Resultado Específico",
      discountAmount: "Valor com Desconto",
      percentageResult: "Proporção (%)",
      absoluteDifference: "Diferença Absoluta",
      percentageChange: "Variação (%)",
      // CLT Salary
      netSalary: "Salário Líquido",
      inssDeduction: "Desconto INSS",
      irrfDeduction: "Desconto IRRF",
      totalDeductions: "Total de Descontos",
      fgtsDeposit: "Depósito FGTS (8%)",
      winner: "Melhor Investimento",
      cdb_gross: "CDB: Valor Bruto",
      cdb_tax: "CDB: Desconto de IR (Isento na LCI)",
      cdb_net: "CDB: Valor Líquido",
      lci_net: "LCI/LCA: Valor Líquido",
      // Labor Termination
      totalRescission: "Valor Total da Rescisão",
      proportionalVacation: "Férias Proporcionais",
      vacationBonus: "1/3 de Férias",
      proportional13th: "13° Salário Proporcional",
      fgtsBalance: "Saldo de FGTS",
      fgtsPenalty: "Multa 40% FGTS",
      noticePeriod: "Aviso Prévio Indenizado",
      // Overtime
      hourlyRate: "Valor da Hora Normal",
      overtime50Value: "Horas Extras 50%",
      overtime100Value: "Horas Extras 100%",
      nightShiftBonus: "Adicional Noturno",
      totalOvertime: "Total de Extras",
      totalSalaryWithOvertime: "Salário + Extras",
      // Vacation & 13th
      vacationPay: "Valor das Férias",
      sellValue: "Abono Pecuniário",
      enjoyedDays: "Dias Descansados",
      thirteenthPay: "13° Salário",
      totalVacationPackage: "Total Férias",
      grandTotal: "Total Geral",
      // CLT Employer Cost
      inssPatronal: "INSS Patronal (20%)",
      ratContribution: "RAT × FAP",
      terceiros: "Terceiros (Sistema S)",
      fgtsMonthly: "FGTS Mensal (8%)",
      provision13th: "Provisão 13° Salário",
      provisionVacation: "Provisão Férias + 1/3",
      totalBenefits: "Total Benefícios (VT+VR+Saúde)",
      totalMonthlyCost: "Custo Mensal Total",
      annualCost: "Custo Anual Total",
      costMultiplier: "Multiplicador do Custo",
      // Hour Bank
      insalubridade: "Adicional Insalubridade",
      periculosidade: "Adicional Periculosidade",
      nightShiftTotal: "Total Adicional Noturno",
      hourBankValue: "Valor do Banco de Horas",
      totalAdditionals: "Total de Adicionais",
      totalCompensation: "Remuneração Total",
      // CET Simulator
      iofAmount: "IOF Calculado",
      tacAmount: "TAC (Tarifa de Abertura)",
      insuranceTotal: "Total de Seguros",
      cetMonthly: "CET Mensal (%)",
      cetAnnual: "CET Anual (%)",
      effectiveVsNominal: "Diferença CET vs Nominal (%)",
      // Amortization Compare
      priceFirstPayment: "Price: 1ª Parcela",
      priceLastPayment: "Price: Última Parcela",
      priceTotalPaid: "Price: Total Pago",
      priceTotalInterest: "Price: Total de Juros",
      sacFirstPayment: "SAC: 1ª Parcela",
      sacLastPayment: "SAC: Última Parcela",
      sacTotalPaid: "SAC: Total Pago",
      sacTotalInterest: "SAC: Total de Juros",
      samFirstPayment: "SAM: 1ª Parcela",
      samLastPayment: "SAM: Última Parcela",
      samTotalPaid: "SAM: Total Pago",
      samTotalInterest: "SAM: Total de Juros",
      sacreFirstPayment: "SACRE: 1ª Parcela",
      sacreLastPayment: "SACRE: Última Parcela",
      sacreTotalPaid: "SACRE: Total Pago",
      sacreTotalInterest: "SACRE: Total de Juros",
      bestSystem: "Melhor Sistema",
      savingsVsPrice: "Economia vs Price"
    };

    const enLabels: Record<string, string> = {
      finalValue: "Final Value",
      totalContribution: "Total Contributions",
      totalInterest: "Total Interest",
      monthlyPayment: "Monthly Payment",
      monthlyBasePayment: "Base Payment",
      totalMonthlyPayment: "Total Monthly Payment",
      interestSaved: "Interest Saved",
      monthsSaved: "Months Saved",
      totalPayment: "Total Payment",
      totalInterestPaid: "Total Interest Paid",
      finalAmount: "Final Amount",
      monthsToPayoff: "Months to Payoff",
      totalPaid: "Total Paid",
      netProfit: "Net Profit",
      roiPercentage: "ROI Percentage",
      calculationResult: "Calculation Result",
      discountAmount: "Discounted Amount",
      percentageResult: "Proportion (%)",
      absoluteDifference: "Absolute Difference",
      percentageChange: "Change (%)",
      // CLT Salary
      netSalary: "Net Salary",
      inssDeduction: "INSS Deduction",
      irrfDeduction: "IRRF Deduction",
      totalDeductions: "Total Deductions",
      fgtsDeposit: "FGTS Deposit (8%)",
      winner: "Best Investment Winner",
      cdb_gross: "CDB: Gross Value",
      cdb_tax: "CDB: Income Tax Deducted",
      cdb_net: "CDB: Net Value",
      lci_net: "LCI/LCA: Net Value",
      // Labor Termination
      totalRescission: "Total Termination Value",
      proportionalVacation: "Proportional Vacation",
      vacationBonus: "1/3 Vacation Bonus",
      proportional13th: "Proportional 13th Salary",
      fgtsBalance: "FGTS Balance",
      fgtsPenalty: "40% FGTS Penalty",
      noticePeriod: "Indemnified Notice Period",
      // Overtime
      hourlyRate: "Normal Hourly Rate",
      overtime50Value: "Overtime 50%",
      overtime100Value: "Overtime 100%",
      nightShiftBonus: "Night Shift Bonus",
      totalOvertime: "Total Overtime",
      totalSalaryWithOvertime: "Salary + Overtime",
      // Vacation & 13th
      vacationPay: "Vacation Pay",
      sellValue: "Cash Conversion",
      enjoyedDays: "Days Off",
      thirteenthPay: "13th Salary",
      totalVacationPackage: "Total Vacation",
      grandTotal: "Grand Total",
      // CLT Employer Cost
      inssPatronal: "Employer INSS (20%)",
      ratContribution: "RAT × FAP",
      terceiros: "Third-Party Contributions",
      fgtsMonthly: "Monthly FGTS (8%)",
      provision13th: "13th Salary Provision",
      provisionVacation: "Vacation + 1/3 Provision",
      totalBenefits: "Total Benefits (VT+VR+Health)",
      totalMonthlyCost: "Total Monthly Cost",
      annualCost: "Total Annual Cost",
      costMultiplier: "Cost Multiplier",
      // Hour Bank
      insalubridade: "Unhealthy Conditions Premium",
      periculosidade: "Hazard Pay Premium",
      nightShiftTotal: "Night Shift Total",
      hourBankValue: "Hour Bank Value",
      totalAdditionals: "Total Pay Premiums",
      totalCompensation: "Total Compensation",
      // CET Simulator
      iofAmount: "IOF Tax",
      tacAmount: "TAC (Opening Fee)",
      insuranceTotal: "Total Insurance",
      cetMonthly: "Monthly CET (%)",
      cetAnnual: "Annual CET (%)",
      effectiveVsNominal: "CET vs Nominal Difference (%)",
      // Amortization Compare
      priceFirstPayment: "Price: 1st Payment",
      priceLastPayment: "Price: Last Payment",
      priceTotalPaid: "Price: Total Paid",
      priceTotalInterest: "Price: Total Interest",
      sacFirstPayment: "SAC: 1st Payment",
      sacLastPayment: "SAC: Last Payment",
      sacTotalPaid: "SAC: Total Paid",
      sacTotalInterest: "SAC: Total Interest",
      samFirstPayment: "SAM: 1st Payment",
      samLastPayment: "SAM: Last Payment",
      samTotalPaid: "SAM: Total Paid",
      samTotalInterest: "SAM: Total Interest",
      sacreFirstPayment: "SACRE: 1st Payment",
      sacreLastPayment: "SACRE: Last Payment",
      sacreTotalPaid: "SACRE: Total Paid",
      sacreTotalInterest: "SACRE: Total Interest",
      bestSystem: "Best System",
      savingsVsPrice: "Savings vs Price"
    };

    const labels = lang === 'pt' ? ptLabels : enLabels;
    if (labels[key]) return labels[key];

    // Fallback: camelCase to spaced words
    const result = key.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  const renderInlineInsight = (inputName: string) => {
    if (config?.calculator_id !== 'loan' || inputName !== 'extraPayment') return null;
    if (!results || Object.keys(results).length === 0 || results.error) return null;

    const p = parseFloat(inputs.loanAmount) || 0;
    const extra = parseFloat(inputs.extraPayment) || 0;
    const totalInterest = results.totalInterest || 0;
    
    if (extra === 0) {
      const interestRatio = p > 0 ? ((totalInterest / p) * 100).toFixed(1) : '0';
      const text = lang === 'en' 
        ? `You are scheduled to pay an additional **${interestRatio}%** of your original loan value purely in interest! Did you know that adding just $100/mo in extra amortization could save you thousands of dollars and years of payments?`
        : `Você vai pagar o equivalente a **${interestRatio}%** do valor do empréstimo puramente em juros! Sabia que adicionar apenas R$ 100/mês na amortização extra pode salvar milhares de reais e encurtar sua dívida em anos?`;
      return (
        <div className="-mt-1 mb-2 animate-in fade-in slide-in-from-top-2 duration-500">
          <SmartInsight text={text} />
        </div>
      );
    } else {
      const months = results.monthsSaved || 0;
      const yearsSaved = Math.floor(months / 12);
      const remainingMonths = Math.round(months % 12);
      
      const enSavedText = yearsSaved > 0 ? `${yearsSaved} years and ${remainingMonths} months` : `${remainingMonths} months`;
      const ptSavedText = yearsSaved > 0 ? `${yearsSaved} anos e ${remainingMonths} meses` : `${remainingMonths} meses`;
      
      const interestStr = formatOutput('interestSaved', results.interestSaved);
      const extraStr = formatOutput('extraPayment', extra);

      const text = lang === 'en'
        ? `Incredible! By amortizing an extra **${extraStr}** per month, you are shortening your loan by **${enSavedText}** and keeping **${interestStr}** of interest money in your own pocket!`
        : `Incrível! Ao amortizar **${extraStr}** extras por mês, você está antecipando sua quitação em **${ptSavedText}** e deixando de dar **${interestStr}** em juros para o banco!`;
      
      return (
        <div className="-mt-1 mb-2 animate-in fade-in slide-in-from-top-2 duration-500">
          <SmartInsight text={text} />
        </div>
      );
    }
  };

  const getDynamicLabel = (inputName: string) => {
    if (config?.calculator_id !== 'percentage') return null;
    const cType = inputs.calcType || 'x_of_y';

    if (lang === 'pt') {
      if (cType === 'x_of_y') {
        if (inputName === 'valueX') return "A Porcentagem (%) que deseja calcular";
        if (inputName === 'valueY') return "O Valor Principal (Ex: Preço Original)";
      }
      if (cType === 'percentage_change') {
        if (inputName === 'valueX') return "Valor Antigo (Era quanto?)";
        if (inputName === 'valueY') return "Valor Novo (Foi para quanto?)";
      }
      if (cType === 'x_is_what_percent_of_y') {
        if (inputName === 'valueX') return "A Parte Menor (Sua fatia)";
        if (inputName === 'valueY') return "O Valor Total (O Bolo inteiro)";
      }
    } else {
      if (cType === 'x_of_y') {
        if (inputName === 'valueX') return "The Percentage (%)";
        if (inputName === 'valueY') return "The Base Value (e.g., Price)";
      }
      if (cType === 'percentage_change') {
        if (inputName === 'valueX') return "Old Value";
        if (inputName === 'valueY') return "New Value";
      }
      if (cType === 'x_is_what_percent_of_y') {
        if (inputName === 'valueX') return "The Smaller Part";
        if (inputName === 'valueY') return "The Total Value";
      }
    }
    return null;
  };

  const generateInsight = (): string[] | null => {
    if (!results || Object.keys(results).length === 0 || results.error) return null;

    const calcId = config.calculator_id;
    const insights: string[] = [];
    
    if (calcId === 'loan') {
      const extra = parseFloat(inputs.extraPayment) || 0;

      // SAC vs Price Comparison Insight
      const priceInt = results.priceTotalInterest || 0;
      const sacInt = results.sacTotalInterest || 0;

      if (priceInt > 0 && sacInt > 0) {
        const diffInt = Math.abs(priceInt - sacInt);
        const diffStr = formatOutput('totalInterest', diffInt);
        
        if (extra > 0) {
           // Compare months if extra is present
           const priceM = results.priceMonthsToPayoff || 0;
           const sacM = results.sacMonthsToPayoff || 0;
           if (priceM !== sacM) {
             const diffMonths = Math.abs(priceM - sacM);
             insights.push(lang === 'en'
               ? `💡 **Price vs SAC Logic:** Because you are making extra payments, using the **SAC Method** would save you an additional **${diffStr}** and finish **${diffMonths} months faster** than the Price method! Always choose SAC when overpaying. *(⚠️ Wait! Read the "Hidden Loophole" below before deciding)*`
               : `💡 **Lógica Price vs SAC:** Pelo fato de você estar amortizando dinheiro extra todo mês, utilizar a **Tabela SAC** faria você economizar mais **${diffStr}** e quitar a dívida **${diffMonths} meses mais rápido** comparado à Tabela Price! A matemática diz SAC. *(⚠️ Atenção: veja a jogada genial do próximo insight antes de bater o martelo no banco!)*`);
           } else {
             insights.push(lang === 'en'
               ? `💡 **Price vs SAC Logic:** Even with identical payoff dates, the **SAC Method** structurally saves you **${diffStr}** in total interest compared to the Fixed Price method. *(⚠️ Wait! Read the "Hidden Loophole" below before deciding)*`
               : `💡 **Lógica Price vs SAC:** Mesmo com o mesmo prazo exato de quitação, o sistema **SAC** te salva matematicamente **${diffStr}** em juros abusivos comparado à Tabela Price engessada. *(⚠️ Atenção: veja a jogada do próximo insight antes de bater o martelo!)*`);
           }
        } else {
           insights.push(lang === 'en'
             ? `💡 **Price vs SAC Logic:** By choosing the **SAC Method** (decreasing payments) over the Fixed Price baseline, you mathematically save **${diffStr}** in total interest directly from the bank's pocket over the life of the loan. *(⚠️ Wait! Read the "Hidden Loophole" below before deciding)*`
             : `💡 **Matemática Bancária (Price vs SAC):** Se você optar pela **Tabela SAC** (parcelas decrescentes) no banco ao invés da Tabela Price (fixa), você tira literalmente **${diffStr}** de juros puros do bolso do gerente a longo prazo. SAC é o caminho! *(⚠️ Atenção: leia a próxima estratégia genial antes de decidir e assinar contrato.)*`);
        }
      }

      // Advanced Hack Insight
      insights.push(lang === 'en'
        ? `🔥 **The Hidden Loophole:** A move few people tell you about:\n1. Use the **Price Method** to get the loan approved easily (lower initial monthly payments).\n2. Then, heavily amortize the principal every month using extra income or bonuses.\nThis mathematically slaughters the compound interest and completely "hacks" the banking system.`
        : `🔥 **A jogada que pouca gente te conta:**\n1. Use a **Tabela Price** para aprovar o seu financiamento (exige renda menor pela parcela ser mais baixa).\n2. Depois, vá amortizando pesado o saldo devedor (usando FGTS ou renda extra).\nIsso corta todos os juros abusivos e "hackeia" o sistema do banco a seu favor.`);
    }

    if (calcId === 'compound_interest') {
      const fv = results.finalValue || 0;
      const totalInterest = results.totalInterest || 0;
      if (fv > 0 && totalInterest > 0) {
        const ratio = ((totalInterest / fv) * 100).toFixed(1);
        insights.push(lang === 'en'
          ? `The power of time: Out of your final wealth, a massive **${ratio}%** was generated purely by the "sweat" of compound interest working for you, not from your own pocket.`
          : `O poder do tempo: Do seu patrimônio final, **${ratio}%** de toda essa quantia foi gerada puramente pelo "suor" dos juros compostos trabalhando por você, e não do seu próprio bolso.`);
      }
    }

    if (calcId === 'debt_payoff') {
       const months = results.monthsToPayoff || 0;
       const years = (months / 12).toFixed(1);
       if (months > 0) {
         insights.push(lang === 'en'
           ? `By maintaining this payment, you will be 100% debt-free in **${months} months** (about ${years} years). Keep it up! Every extra dollar shortens this time drastically.`
           : `Mantendo esse pagamento, você estará 100% livre dessa dívida em **${months} meses** (cerca de ${years} anos). Continue firme! Pagar qualquer valor a mais encurta esse relógio drasticamente.`);
       }
    }

    return insights.length > 0 ? insights : null;
  };

  if(!config) return <div className="p-8 text-center text-[var(--color-danger)]">Failed to load calculator configuration.</div>;

  return (
    <div className="w-full flex flex-col gap-6 lg:gap-8 relative">
      {/* Mobile Scroll Analytics Sidebar (Left Docked) */}
      <div className="fixed top-[20vh] bottom-[20vh] left-[6px] w-2 z-50 lg:hidden pointer-events-none flex flex-col items-center opacity-90 transition-opacity duration-500">
        {/* Start Anchor */}
        <div className="w-1.5 h-1.5 rounded-full bg-[#00c6ff] shadow-[0_0_10px_rgba(0,198,255,0.9)] z-20 shrink-0" />
        
        {/* Track Body / Fishing Line */}
        <div className="flex-1 w-[2px] bg-black/10 dark:bg-white/10 relative overflow-visible -my-1 backdrop-blur-sm">
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#00c6ff] via-[#007aff] to-[#b400ff] origin-top shadow-[0_0_15px_rgba(0,198,255,0.8)] z-10"
            style={{ scaleY }}
          />
          {/* Fishing Hook Tip */}
          <motion.div 
            className="absolute left-1/2 -translate-x-1/2 -ml-[0.5px] mt-[-6px] flex flex-col items-center z-30 drop-shadow-[0_2px_5px_rgba(180,0,255,1)] text-[#b400ff]"
            style={{ top: useTransform(scaleY, v => `${v * 100}%`) }}
          >
            {/* The knot ball (Tie-off ring) */}
            <div className="w-[6px] h-[6px] rounded-full border-[1.5px] border-current bg-transparent mb-[-2px] z-10" />
            <svg width="14" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              {/* Fishing Hook SVG */}
              <path d="M12 1v15 c0 3 -3 4 -5 2" />
              <path d="M7 18l-1.5 2" strokeWidth="2" /> {/* Little barb */}
            </svg>
          </motion.div>
        </div>
        
        {/* End Anchor / The Fish */}
        <div className="w-8 h-8 text-[#b400ff] drop-shadow-[0_0_12px_rgba(180,0,255,0.9)] z-20 shrink-0 mt-[4px] ml-[2px]">
           <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-90deg)' }}>
             {/* Fish Body */}
             <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 6 6-.06 3.46-2.44 6-6 6-3.56 0-7.56-2.54-8.5-6Z"/>
             {/* Solid Eye */}
             <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none" />
             {/* Solid Tail */}
             <path d="M6.5 12L2 16V8l4.5 4z" fill="currentColor" stroke="none" />
             {/* Top Fin */}
             <path d="M11 6c1-2 3-2 3-2" strokeWidth="2" />
             {/* Bottom Fin */}
             <path d="M11 18c1 2 3 2 3 2" strokeWidth="2" />
           </svg>
        </div>
      </div>

      {/* Full-width Top Banner Injection */}
      {premiumTemplate && (
        <div className="w-full">
          {premiumTemplate}
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Inputs Column */}
        <ScrollReveal direction="up" className="w-full lg:w-1/3 shrink-0">
        <div className="flex flex-col gap-6 w-full">
          <div className="apple-card p-5 lg:p-6 w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h2 className="text-xl font-semibold -mb-2 text-[var(--color-text-primary)] tracking-tight">
                {lang === 'en' ? 'Inputs' : 'Valores'}
              </h2>
              <hr className="border-[var(--color-border)] mb-1" />
            
            {config.inputs.map((input: any) => (
              <React.Fragment key={input.name}>
                {renderInlineInsight(input.name)}
                <div className={input.name === 'extraPayment' ? "p-4 -mx-2 mt-2 mb-2 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-200/60 shadow-[0_4px_25px_rgba(0,122,255,0.15)] backdrop-blur-md transition-all duration-500 focus-within:shadow-[0_8px_30px_rgba(0,122,255,0.25)] ring-1 ring-blue-100" : ""}>
                  {input.type === 'select' ? (
                    <SelectField
                      name={input.name}
                      label={getDynamicLabel(input.name) || input.label}
                      value={inputs[input.name] || ''}
                      onChange={handleChange}
                      options={input.options || []}
                    />
                  ) : input.type === 'date' ? (
                    <InputField
                      name={input.name}
                      label={getDynamicLabel(input.name) || input.label}
                      type="date"
                      value={inputs[input.name] === undefined ? '' : inputs[input.name]}
                      onChange={handleChange}
                    />
                  ) : (
                    <InputField
                      name={input.name}
                      label={getDynamicLabel(input.name) || input.label}
                      type="number"
                      step="any"
                      value={inputs[input.name] === undefined ? '' : inputs[input.name]}
                      onChange={handleChange}
                      className={input.name === 'extraPayment' ? "border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-white shadow-inner font-semibold text-blue-900 placeholder:text-blue-300 bg-opacity-90" : ""}
                    />
                  )}
                </div>
              </React.Fragment>
            ))}
            
            <PrimaryButton 
              type="submit" 
              className={`mt-2 w-full text-base py-3 transition-all duration-300 shadow-[0_8px_30px_rgb(0,122,255,0.2)]`}
            >
               {lang === 'en' ? 'Save Simulation & Get Report' : 'Salvar Dados e Obter Relatório'}
            </PrimaryButton>
            </form>

            {/* Post-Save Upsell Dashboard */}
            {hasSaved && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 flex flex-col gap-4 overflow-hidden"
              >
                <div className="bg-green-50 border border-green-200 rounded-[var(--radius-apple)] p-5">
                  <h4 className="flex items-center gap-2 font-bold text-green-800 mb-2">
                    <Check className="w-5 h-5 text-green-600" /> 
                    {lang === 'en' ? 'Simulation Saved Successfully!' : 'Simulação Salva com Sucesso!'}
                  </h4>
                  <p className="text-sm text-green-700 mb-4 font-medium opacity-90">
                    {lang === 'en' ? 'What would you like to do next?' : 'O que você gostaria de fazer agora?'}
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <button type="button" onClick={handleShare} className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold shadow-md py-3 rounded-xl transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      {lang === 'en' ? 'Share results on WhatsApp' : 'Compartilhar no WhatsApp'}
                    </button>
                    
                    <div className="mt-2 bg-white rounded-xl p-4 border border-green-100 shadow-sm flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg shrink-0">
                          <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="text-sm text-gray-800 block leading-tight">{lang === 'en' ? 'Free Tracking Spreadsheet' : 'Planilha de Acompanhamento Grátis'}</strong>
                          <span className="text-xs text-gray-500 mt-1 block leading-tight">{lang === 'en' ? 'Get the Excel version of this calculator directly in your inbox.' : 'Receba a versão oficial em Excel desta calculadora no seu email.'}</span>
                        </div>
                      </div>
                      
                      {emailSent ? (
                        <div className="bg-green-100 text-green-700 text-sm p-3 rounded-lg text-center font-bold animate-pulse">
                          {lang === 'en' ? 'Spreadsheet sent to your email! 📩' : 'Planilha enviada para o seu email! 📩'}
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col sm:flex-row gap-2 mt-1">
                            <input 
                              type="email" 
                              required 
                              placeholder={lang === 'en' ? 'Your best email...' : 'Seu melhor e-mail...'}
                              className={`bg-gray-50 border ${emailError ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:border-blue-500 rounded-lg flex-1 text-sm py-2 px-3 transition-colors text-gray-800`}
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError('');
                              }}
                              disabled={isEmailSending}
                            />
                            <button 
                              type="button" 
                              onClick={handleEmailSubmit}
                              disabled={isEmailSending}
                              className={`bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 w-full sm:w-auto flex items-center justify-center transition-colors shadow-sm ${isEmailSending ? 'opacity-70 cursor-wait' : ''}`}
                            >
                              {isEmailSending ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                              ) : (
                                <Send className="w-4 h-4 mr-1" />
                              )}
                              {lang === 'en' ? 'Send' : 'Enviar'}
                            </button>
                          </div>
                          {emailError && (
                            <p className="text-xs text-red-500 mt-1">{emailError}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </ScrollReveal>

      {/* Results & Chart Column */}
      <ScrollReveal direction="up" delay={0.15} className="w-full lg:w-2/3">
        <div className="flex flex-col gap-4 w-full">
        {results?.error ? (
           <div className="apple-card p-5 bg-red-50 text-red-600 border border-red-200">
             {results.error}
           </div>
        ) : (
          Object.keys(results).length > 0 && (
            <>
              {/* Results Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {config.outputs?.map((outKey: string, idx: number) => {
                   if(results[outKey] === undefined) return null;
                   return (
                     <ResultPanel
                       key={outKey}
                       title={formatOutputLabel(outKey)}
                       value={formatOutput(outKey, results[outKey])}
                       highlight={idx === 0} // highlight the first primary result
                     />
                   );
                })}
              </div>

              {/* Smart Insights Injection */}
              {generateInsight() && (
                <div className="flex flex-col gap-3">
                  {generateInsight()!.map((insightTxt, idx) => (
                    <SmartInsight key={idx} text={insightTxt} />
                  ))}
                </div>
              )}

              {/* Chart */}
              {chartData && (
                <div className="apple-card p-6 lg:p-8 mt-4">
                   <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6">
                     {lang === 'en' ? 'Visual Projection' : 'Projeção Visual'}
                   </h3>
                   <div className="w-full">
                     <ChartView 
                       type={chartData.type || 'bar'}
                       labels={chartData.labels}
                       datasets={chartData.datasets}
                     />
                   </div>
                </div>
              )}

              {/* Mathematical Transparency Block */}
              <div className="apple-card p-5 lg:p-6 mt-4 bg-slate-50/80 border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-serif italic text-lg font-bold">
                    ƒx
                  </div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {lang === 'en' ? 'Mathematical Transparency' : 'Transparência Matemática'}
                  </h3>
                </div>
                <div className="bg-white px-4 py-4 rounded-xl border border-slate-200 text-center shadow-sm overflow-x-auto">
                  <code className="text-lg md:text-xl font-mono text-[var(--color-primary)] whitespace-nowrap">
                    {config.formula}
                  </code>
                </div>
                <p className="text-xs md:text-sm text-slate-500 mt-4 leading-relaxed">
                  {lang === 'en' 
                    ? 'Above is the exact core algorithm running locally on your device right now to generate these precise results. No hidden logic.' 
                    : 'Acima está o algoritmo central exato rodando nativamente no seu dispositivo agora para calcular os resultados. Sem caixa preta.'}
                </p>
              </div>
              
              {/* Inject Monetization or Ads here, directly beneath the chart */}
              {children}
            </>
          )
        )}
        </div>
      </ScrollReveal>
    </div>
    </div>
  );
}
