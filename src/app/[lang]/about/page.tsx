import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ShieldCheck, Target, Zap, Github, Linkedin, Cpu } from 'lucide-react';
import Link from 'next/link';

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  return (
    <>
      <section className="bg-[var(--color-surface)] py-16 md:py-24 border-b border-[var(--color-border)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <Container>
           <div className="max-w-3xl mx-auto text-center">
             <div className="inline-block px-3 py-1 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] mb-6">
                {lang === 'en' ? 'Transparency & Trust' : 'Transparência e Confiança'}
             </div>
             <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-[var(--color-text-primary)]">
               {lang === 'en' ? 'About CalcForgeTools' : 'Sobre o CalcForgeTools'}
             </h1>
             <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed">
               {lang === 'en' 
                 ? 'Engineered precision for everyday financial and labor decisions. We build algorithms you can trust.' 
                 : 'Precisão de engenharia para decisões financeiras e trabalhistas do dia a dia. Construímos algoritmos nos quais você pode confiar.'}
             </p>
          </div>
        </Container>
      </section>

      <Section className="bg-[#F5F5F7] min-h-[50vh] py-16">
        <Container className="max-w-4xl space-y-16">
          
          {/* Mission */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[var(--color-border)]">
            <h2 className="text-3xl font-bold mb-6 text-[var(--color-text-primary)] flex items-center gap-3">
              <Target className="text-[var(--color-primary)]" />
              {lang === 'en' ? 'Our Mission' : 'Nossa Missão'}
            </h2>
            <div className="prose prose-lg text-[var(--color-text-secondary)]">
              {lang === 'en' ? (
                <p>We believe that financial mathematics shouldn't be hidden behind complex jargon or confusing interfaces. CalcForgeTools was created to provide premium, highly-accurate, and beautiful calculator tools natively in your browser. No paywalls, no hidden data harvesting, just pure mathematical transparency.</p>
              ) : (
                <p>Acreditamos que a matemática financeira não deve ficar escondida atrás de jargões complexos ou interfaces mal planejadas. O CalcForgeTools foi fundado para fornecer ferramentas de cálculo abertas, rápidas e de alta precisão, rodando diretamente no seu navegador. Sem taxas ocultas, sem coleta de dados pessoais, apenas transparência algorítmica.</p>
              )}
            </div>
          </div>

          {/* E-E-A-T Founder Profile */}
          <div className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-3xl shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
              <Cpu className="text-blue-400" />
              {lang === 'en' ? 'Meet the Engineer' : 'Conheça o Engenheiro'}
            </h2>
            
            <div className="grid md:grid-cols-[1fr_2fr] gap-10 items-center">
              <div className="flex flex-col items-center md:items-start space-y-4">
                <div className="w-32 h-32 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center shadow-inner overflow-hidden relative">
                   <span className="text-4xl font-bold text-slate-500">MG</span>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white">Mauricio Grigol</h3>
                  <span className="text-blue-400 font-medium tracking-wide text-sm block mt-1 uppercase">
                    {lang === 'en' ? 'Lead Engineer & Founder' : 'Engenheiro & Fundador'}
                  </span>
                </div>
                <div className="flex gap-4 pt-2">
                  <Link href="https://github.com/Mauthope" target="_blank" className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-2 rounded-full border border-slate-700">
                    <Github size={20} />
                  </Link>
                  <Link href="#" className="text-slate-400 hover:text-[#0A66C2] transition-colors bg-slate-800 p-2 rounded-full border border-slate-700">
                    <Linkedin size={20} />
                  </Link>
                </div>
              </div>

              <div className="prose prose-lg prose-invert text-slate-300">
                {lang === 'en' ? (
                  <>
                    <p>
                      <strong>CalcForgeTools</strong> is actively developed and maintained by Mauricio Grigol. With a formal background in Engineering, Mauricio brings a deep, rigorous focus to logic, systems logic, and mathematical precision. 
                    </p>
                    <p>
                      Unlike generic financial blogs, every calculation engine on this platform is constructed with analytical engineering principles. The formulas mirror the exact actuarial tables used by the Brazilian Central Bank and the strict guidelines established by standard Labor Laws (CLT). Mathematics doesn't lie, and engineering algorithms ensure absolute fidelity in every penny calculated.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      O <strong>CalcForgeTools</strong> é desenvolvido e mantido arquiteturalmente por Mauricio Grigol. Com formação especializada em Engenharia, Mauricio construiu a plataforma fundamentada nos pilares de precisão matemática, lógica de sistemas e processos analíticos escaláveis.
                    </p>
                    <p>
                      Diferente de portais financeiros genéricos, os motores de cálculo deste site são modelados com rigorosos princípios de modelagem e engenharia reversa das fórmulas oficiais do Banco Central (Sistemas de Amortização) e da Consolidação das Leis do Trabalho (CLT). A engenharia traz a garantia de que não há margem para erros ou achismos: o algoritmo reflete e processa a lei fria de forma exata e cristalina.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-border)] transform transition-transform hover:-translate-y-1">
              <Zap className="w-10 h-10 text-[var(--color-primary)] mb-6" />
              <h3 className="text-xl font-bold mb-3">{lang === 'en' ? 'Local Compute Engine' : 'Processamento Local'}</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {lang === 'en' 
                  ? 'We utilize advanced WebAssembly and pure functional TypeScript to execute heavy financial iterations instantly within your device CPU. No API delays.' 
                  : 'Utilizamos TypeScript funcional para executar pesadas iterações financeiras instantaneamente na CPU do seu dispositivo. Zero atrasos de rede.'}
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-border)] transform transition-transform hover:-translate-y-1">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mb-6" />
              <h3 className="text-xl font-bold mb-3">{lang === 'en' ? 'Data Sanctity' : 'Segurança e Isolamento'}</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {lang === 'en' 
                  ? 'Your financial inputs are never routed through our servers. We possess zero databases containing your salaries, debts, or corporate pricing logic.' 
                  : 'Seus dados inseridos (salários, dívidas e orçamentos) jamais transitam pelos nossos servidores. Não possuímos banco de dados colhendo suas informações.'}
              </p>
            </div>
          </div>

          <div className="text-center pt-8">
            <p className="text-[var(--color-text-secondary)]">
              {lang === 'en' ? 'For technical support or institutional partnerships, contact us at' : 'Para suporte técnico arquitetural ou parcerias comerciais, contate-nos em'} <br/>
              <a href="mailto:hello@calcforgetools.com" className="font-bold text-[var(--color-primary)] hover:underline mt-2 inline-block">hello@calcforgetools.com</a>
            </p>
          </div>

        </Container>
      </Section>
    </>
  );
}
