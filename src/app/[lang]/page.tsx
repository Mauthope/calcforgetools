import { getGuides } from '@/lib/content';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { FAQ } from '@/components/ui/FAQ';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { InteractiveBackground } from '@/components/ui/motion/InteractiveBackground';
import { ArrowRight, Calculator, BookOpen, ShieldCheck, Zap, LineChart } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'pt' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<string, string> = {
    en: 'CalcForgeTools — Free Financial, Math & Labor Calculators',
    pt: 'CalcForgeTools — Calculadoras Financeiras, Matemáticas e Trabalhistas Grátis'
  };
  const descriptions: Record<string, string> = {
    en: 'Free, fast, premium calculators for compound interest, mortgages, ROI, percentages, CLT salary, overtime, vacation, and termination. No signup required.',
    pt: 'Calculadoras gratuitas, rápidas e precisas para juros compostos, financiamento, ROI, porcentagem, salário CLT, horas extras, férias e rescisão. Sem cadastro.'
  };

  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'en': '/en',
        'pt': '/pt',
        'x-default': '/en'
      }
    }
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const guides = await getGuides(lang);
  const featuredGuides = guides.slice(0, 3);

  const heroContent = {
    en: {
      title: "Precision Tools for Financial Growth",
      subtitle: "CalcForgeTools provides fast, premium, and completely free calculators to help you make standard financial and business decisions with confidence.",
      cta: "Explore Calculators"
    },
    pt: {
      title: "Ferramentas Precisas para o seu Crescimento",
      subtitle: "A CalcForgeTools fornece calculadoras rápidas e totalmente gratuitas para ajudar você a tomar decisões financeiras e empresariais com confiança.",
      cta: "Explorar Calculadoras"
    }
  }[lang as 'en' | 'pt'] || { title: '', subtitle: '', cta: '' };

  const sectionTitles = {
    en: { featured: "Featured Calculators", featuredSub: "Our most popular mathematical tools" },
    pt: { featured: "Calculadoras em Destaque", featuredSub: "Nossas ferramentas matemáticas mais populares" }
  }[lang as 'en' | 'pt'];

  const featuresContent = {
    en: {
      title: "Why Trust Our Algorithms?",
      subtitle: "Engineered for precision. Designed for absolute clarity.",
      items: [
        { title: "Bank-Level Precision", desc: "Industry-standard formulas ensuring every decimal is devastatingly accurate.", icon: <LineChart className="w-6 h-6 text-[var(--color-primary)]" /> },
        { title: "Zero Data Harvesting", desc: "Your financial inputs never leave your device. 100% private, client-side math.", icon: <ShieldCheck className="w-6 h-6 text-[var(--color-primary)]" /> },
        { title: "Lightning Fast", desc: "No loading screens, no paywalls, no sign-ups. Get your answers instantly.", icon: <Zap className="w-6 h-6 text-[var(--color-primary)]" /> }
      ]
    },
    pt: {
      title: "Por que Confiar em Nossos Algoritmos?",
      subtitle: "Projetados para precisão. Desenhados para clareza absoluta.",
      items: [
        { title: "Precisão Bancária", desc: "Fórmulas padrão da indústria garantem que cada centavo seja calculado com exatidão.", icon: <LineChart className="w-6 h-6 text-[var(--color-primary)]" /> },
        { title: "Zero Rastreamento", desc: "Seus dados financeiros nunca saem da sua tela. Matemática local 100% privada.", icon: <ShieldCheck className="w-6 h-6 text-[var(--color-primary)]" /> },
        { title: "Ultra Rápido", desc: "Sem telas de carregamento, sem paywalls, sem cadastros. Respostas imediatas.", icon: <Zap className="w-6 h-6 text-[var(--color-primary)]" /> }
      ]
    }
  }[lang as 'en' | 'pt']!;

  const guidesContent = {
    en: { title: "Financial Intelligence", subtitle: "Master the mechanics of wealth, interest, and debt." },
    pt: { title: "Inteligência Financeira", subtitle: "Domine as engrenagens da riqueza, juros e dívidas." }
  }[lang as 'en' | 'pt']!;

  const faqContent = {
    en: {
      title: "Frequently Asked Questions",
      items: [
        { question: "Is CalcForgeTools really completely free?", answer: "Yes. All our calculators and financial guides are 100% free to use without any limitations." },
        { question: "Do you store my financial data?", answer: "No. All calculations are performed directly in your browser. We never harvest or store your personal financial numbers." },
        { question: "How accurate are the mathematical models?", answer: "Our calculators use industry-standard formulas verified by financial professionals, mirroring the exact algorithms used by banks for compounding and amortizations." },
      ]
    },
    pt: {
      title: "Dúvidas Frequentes",
      items: [
        { question: "O CalcForgeTools é realmente gratuito?", answer: "Sim. Todas as nossas calculadoras e guias financeiros são 100% gratuitos para usar sem limitações." },
        { question: "Vocês salvam meus dados financeiros?", answer: "Não. Todos os cálculos são feitos instantaneamente no seu navegador pela CPU do seu dispositivo. Nós não armazenamos seus números financeiros." },
        { question: "Quão precisas são as calculadoras?", answer: "Nossas ferramentas utilizam fórmulas padrão da indústria aplicadas em economia, refletindo os mesmos algoritmos de alta precisão usados por grandes bancos globais." },
      ]
    }
  }[lang as 'en' | 'pt']!;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <InteractiveBackground />
        <Container className="text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6 shadow-lg">
            <Calculator size={16} />
            {lang === 'en' ? 'V1.0 Now Available' : 'V1.0 Disponível'}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
            {heroContent.title}
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
            {heroContent.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={`/${lang}/calculators`}>
              <PrimaryButton className="text-lg px-8 py-4 shadow-xl shadow-[var(--color-primary)]/20 hover:shadow-2xl hover:shadow-[var(--color-primary)]/30 transition-shadow">
                {heroContent.cta} <ArrowRight size={20} />
              </PrimaryButton>
            </Link>
          </div>
        </Container>
      </section>

      {/* Calculator Categories */}
      <Section className="bg-[#F5F5F7]">
        <Container>
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">{sectionTitles.featured}</h2>
            <p className="text-[var(--color-text-secondary)]">{sectionTitles.featuredSub}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Financial */}
            <Link href={`/${lang}/calculators/category/${lang === 'pt' ? 'financeira' : 'financial'}`} className="group block h-full">
              <div className="apple-card p-6 h-full flex flex-col border border-transparent group-hover:border-[var(--color-primary)]/30 group-hover:shadow-lg transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full" />
                <div className="text-[var(--color-primary)] mb-5 inline-block group-hover:scale-110 transition-transform duration-300">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Calculator className="w-6 h-6 stroke-[1.5]" />
                  </div>
                </div>
                <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase mb-2">8 {lang === 'en' ? 'Tools' : 'Ferramentas'}</span>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2 tracking-tight">
                  {lang === 'en' ? 'Financial Calculators' : 'Calculadoras Financeiras'}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed mb-6 flex-grow">
                  {lang === 'en' ? 'Compound interest, mortgage amortization (SAC/Price), ROI projections, and debt payoff strategies.' : 'Juros compostos, amortização de financiamento (SAC/Price), projeções de ROI e estratégias de quitação de dívidas.'}
                </p>
                <div className="font-medium text-[var(--color-primary)] text-sm mt-auto inline-flex items-center group-hover:underline">
                  {lang === 'en' ? 'Explore Category' : 'Explorar Categoria'}
                  <ArrowRight className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Mathematical */}
            <Link href={`/${lang}/calculators/category/${lang === 'pt' ? 'matematica' : 'mathematical'}`} className="group block h-full">
              <div className="apple-card p-6 h-full flex flex-col border border-transparent group-hover:border-[var(--color-primary)]/30 group-hover:shadow-lg transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-500/5 to-transparent rounded-bl-full" />
                <div className="text-violet-500 mb-5 inline-block group-hover:scale-110 transition-transform duration-300">
                  <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
                    <LineChart className="w-6 h-6 stroke-[1.5]" />
                  </div>
                </div>
                <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase mb-2">1 {lang === 'en' ? 'Tool' : 'Ferramenta'}</span>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2 tracking-tight">
                  {lang === 'en' ? 'Mathematical Calculators' : 'Calculadoras Matemáticas'}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed mb-6 flex-grow">
                  {lang === 'en' ? 'Percentage calculations, discounts, markups, and proportional analysis for everyday decisions.' : 'Cálculos de porcentagem, descontos, aumentos e análise proporcional para decisões do dia a dia.'}
                </p>
                <div className="font-medium text-violet-500 text-sm mt-auto inline-flex items-center group-hover:underline">
                  {lang === 'en' ? 'Explore Category' : 'Explorar Categoria'}
                  <ArrowRight className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Labor */}
            {lang === 'pt' && (
              <Link href={`/${lang}/calculators/category/trabalhista`} className="group block h-full">
                <div className="apple-card p-6 h-full flex flex-col border border-transparent group-hover:border-amber-500/30 group-hover:shadow-lg transition-all cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-full" />
                  <div className="text-amber-500 mb-5 inline-block group-hover:scale-110 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
                    </div>
                  </div>
                  <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase mb-2">6 Ferramentas</span>
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2 tracking-tight">
                    Calculadoras Trabalhistas
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed mb-6 flex-grow">
                    Salários líquidos, horas extras, rescisão, banco de horas e custo total para empresas.
                  </p>
                  <div className="font-medium text-amber-500 text-sm mt-auto inline-flex items-center group-hover:underline">
                    Explorar Categoria
                    <ArrowRight className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )}
          </div>
          
          <div className="mt-12 text-center">
             <Link href={`/${lang}/calculators`}>
              <button className="apple-button bg-transparent border-2 border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)] hover:bg-transparent shadow-sm">
                {lang === 'en' ? 'View all calculators' : 'Ver todas as calculadoras'}
              </button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Features Value Proposition */}
      <section className="py-16 md:py-24 bg-white border-b border-[var(--color-border)]">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{featuresContent.title}</h2>
            <p className="text-lg text-[var(--color-text-secondary)]">{featuresContent.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuresContent.items.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Guides Section */}
      {featuredGuides && featuredGuides.length > 0 && (
        <Section className="bg-[#F5F5F7] border-b border-[var(--color-border)]">
          <Container>
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">{guidesContent.title}</h2>
                <p className="text-[var(--color-text-secondary)]">{guidesContent.subtitle}</p>
              </div>
              <Link href={`/${lang}/guides`}>
                <button className="apple-button bg-transparent border-2 border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)] hover:bg-transparent shadow-sm whitespace-nowrap">
                  {lang === 'en' ? 'View all guides' : 'Ler todos os guias'}
                </button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredGuides.map((guide: any) => (
                <Link key={guide.slug} href={`/${lang}/guides/${guide.slug}`} className="group block h-full">
                  <div className="bg-white rounded-[var(--radius-apple)] p-6 border border-[var(--color-border)] shadow-sm hover:shadow-lg transition-all h-full flex flex-col">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[var(--color-primary)] flex items-center justify-center mb-4">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                      {guide.hero?.title || guide.meta_title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed">
                      {guide.meta_description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Global FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <Container className="max-w-3xl">
          <FAQ items={faqContent.items} title={faqContent.title} />
        </Container>
      </section>
    </div>
  );
}
