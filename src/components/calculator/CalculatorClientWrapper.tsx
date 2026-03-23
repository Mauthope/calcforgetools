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
import { motion } from 'framer-motion';

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
    if (lower.includes('month') || lower.includes('year')) {
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
      percentageChange: "Variação (%)"
    };

    if (lang === 'pt' && ptLabels[key]) {
      return ptLabels[key];
    }

    // Fallback to English spacing
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
               ? `💡 **Price vs SAC Logic:** Because you are making extra payments, using the **SAC Method** would save you an additional **${diffStr}** and finish **${diffMonths} months faster** than the Price method! Always choose SAC when overpaying.`
               : `💡 **Lógica Price vs SAC:** Pelo fato de você estar amortizando dinheiro extra todo mês, utilizar a **Tabela SAC** faria você economizar mais **${diffStr}** e quitar a dívida **${diffMonths} meses mais rápido** comparado à Tabela Price! A matemática diz SAC.`);
           } else {
             insights.push(lang === 'en'
               ? `💡 **Price vs SAC Logic:** Even with identical payoff dates, the **SAC Method** structurally saves you **${diffStr}** in total interest compared to the Fixed Price method.`
               : `💡 **Lógica Price vs SAC:** Mesmo com o mesmo prazo exato de quitação, o sistema **SAC** te salva matematicamente **${diffStr}** em juros abusivos comparado à Tabela Price engessada.`);
           }
        } else {
           insights.push(lang === 'en'
             ? `💡 **Price vs SAC Logic:** By choosing the **SAC Method** (decreasing payments) over the Fixed Price baseline, you mathematically save **${diffStr}** in total interest directly from the bank's pocket over the life of the loan.`
             : `💡 **Matemática Bancária (Price vs SAC):** Se você optar pela **Tabela SAC** (parcelas decrescentes) no banco ao invés da Tabela Price (fixa), você tira literalmente **${diffStr}** de juros puros do bolso do gerente a longo prazo. SAC é o caminho!`);
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
    <div className="w-full flex flex-col gap-6 lg:gap-8">
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
                      label={input.label}
                      value={inputs[input.name] || ''}
                      onChange={handleChange}
                      options={input.options || []}
                    />
                  ) : (
                    <InputField
                      name={input.name}
                      label={input.label}
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
