import { getCalculatorsByCategory, getGuides } from '@/lib/content';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { CalculatorCard } from '@/components/calculator/CalculatorCard';
import { FAQ } from '@/components/ui/FAQ';
import { BookOpen, ArrowRight, DollarSign, Percent, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const CATEGORIES: Record<string, {
  en: { title: string; subtitle: string; description: string };
  pt: { title: string; subtitle: string; description: string };
  icon: string;
}> = {
  financial: {
    en: { 
      title: 'Financial Calculators', 
      subtitle: 'Master your money with bank-grade precision tools for investments, loans, and debt.', 
      description: 'CalcForgeTools Financial Calculators help you simulate compound interest, mortgage amortizations, ROI projections, and debt payoff strategies using industry-standard formulas.' 
    },
    pt: { 
      title: 'Calculadoras Financeiras', 
      subtitle: 'Domine seu dinheiro com ferramentas de precisão bancária para investimentos, financiamentos e dívidas.', 
      description: 'As Calculadoras Financeiras da CalcForgeTools simulam juros compostos, amortizações de financiamento, projeções de ROI e estratégias de quitação de dívidas usando fórmulas padrão da indústria.' 
    },
    icon: 'dollar'
  },
  mathematical: {
    en: { 
      title: 'Mathematical Calculators', 
      subtitle: 'Quick and precise tools for percentages, proportions, and everyday math.', 
      description: 'CalcForgeTools Mathematical Calculators provide instant solutions for percentage calculations, discounts, markups, and proportional analysis.' 
    },
    pt: { 
      title: 'Calculadoras Matemáticas', 
      subtitle: 'Ferramentas rápidas e precisas para porcentagens, proporções e matemática do dia a dia.', 
      description: 'As Calculadoras Matemáticas da CalcForgeTools fornecem soluções instantâneas para cálculos de porcentagem, descontos, aumentos e análise proporcional.' 
    },
    icon: 'percent'
  },
  labor: {
    en: { 
      title: 'Labor & Payroll Calculators', 
      subtitle: 'Calculate wages, overtime, benefits, and employment costs with precision.', 
      description: 'CalcForgeTools Labor Calculators help employers and employees calculate salaries, overtime pay, vacation accruals, and employment costs.' 
    },
    pt: { 
      title: 'Calculadoras Trabalhistas', 
      subtitle: 'Calcule salários, horas extras, benefícios e custos trabalhistas com precisão.', 
      description: 'As Calculadoras Trabalhistas da CalcForgeTools ajudam empregadores e empregados a calcular salários, horas extras, férias e custos trabalhistas.' 
    },
    icon: 'briefcase'
  }
};

const SLUG_MAP: Record<string, string> = {
  'financeira': 'financial',
  'matematica': 'mathematical',
  'trabalhista': 'labor',
  'financial': 'financial',
  'mathematical': 'mathematical',
  'labor': 'labor'
};

const REVERSE_SLUG: Record<string, Record<string, string>> = {
  en: { financial: 'financial', mathematical: 'mathematical', labor: 'labor' },
  pt: { financial: 'financeira', mathematical: 'matematica', labor: 'trabalhista' }
};

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of ['en', 'pt']) {
    for (const cat of Object.keys(REVERSE_SLUG[lang])) {
      params.push({ lang, slug: REVERSE_SLUG[lang][cat] });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const categoryKey = SLUG_MAP[slug];
  if (!categoryKey || !CATEGORIES[categoryKey]) return {};
  const cat = CATEGORIES[categoryKey][lang as 'en' | 'pt'];
  return {
    title: cat.title + ' | CalcForgeTools',
    description: cat.description
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const categoryKey = SLUG_MAP[slug];
  
  if (!categoryKey || !CATEGORIES[categoryKey]) {
    notFound();
  }

  const catContent = CATEGORIES[categoryKey][lang as 'en' | 'pt'];
  const calculators = await getCalculatorsByCategory(lang, categoryKey);
  const guides = await getGuides(lang);

  // Filter related guides (simple heuristic)
  const relatedGuides = guides.slice(0, 3);

  // Other categories for cross-linking
  const otherCategories = Object.entries(CATEGORIES)
    .filter(([key]) => key !== categoryKey)
    .map(([key, val]) => ({
      key,
      slug: REVERSE_SLUG[lang][key],
      ...val[lang as 'en' | 'pt']
    }));

  const faqItems = categoryKey === 'financial' ? [
    {
      question: lang === 'en' ? 'Are financial calculations really accurate?' : 'Os cálculos financeiros são realmente precisos?',
      answer: lang === 'en' ? 'Yes. Our calculators mirror the exact formulas used by major banks for compound interest, amortization tables (SAC/Price), and ROI analysis.' : 'Sim. Nossas calculadoras utilizam as mesmas fórmulas exatas usadas pelos grandes bancos para juros compostos, tabelas de amortização (SAC/Price) e análise de ROI.'
    },
    {
      question: lang === 'en' ? 'Do I need to create an account?' : 'Preciso criar uma conta?',
      answer: lang === 'en' ? 'No. All calculators are 100% free and work instantly in your browser without registration.' : 'Não. Todas as calculadoras são 100% gratuitas e funcionam instantaneamente no seu navegador sem cadastro.'
    },
    {
      question: lang === 'en' ? 'Can I compare SAC vs Price mortgage systems?' : 'Eu consigo comparar o sistema SAC e Price?',
      answer: lang === 'en' ? 'Absolutely. Our Home Mortgage Calculator automatically generates both amortization schedules side-by-side with full interest savings analysis.' : 'Claro! Nossa Calculadora de Financiamento gera automaticamente ambas as tabelas de amortização lado a lado com análise completa de economia em juros.'
    }
  ] : categoryKey === 'mathematical' ? [
    {
      question: lang === 'en' ? 'What types of percentage calculations are supported?' : 'Quais tipos de cálculos de porcentagem são suportados?',
      answer: lang === 'en' ? 'We support 3 modes: calculating X% of a value (discounts/markups), finding the percentage one number is of another, and calculating the percentage change between two values.' : 'Suportamos 3 modos: calcular X% de um valor (descontos/aumentos), descobrir qual porcentagem um número representa de outro, e calcular a variação percentual entre dois valores.'
    },
    {
      question: lang === 'en' ? 'Is this useful for business pricing?' : 'Isso é útil para precificação de negócios?',
      answer: lang === 'en' ? 'Yes. E-commerce managers, retailers, and freelancers use our percentage calculator daily for margin analysis, discount setting, and markup calculations.' : 'Sim. Gerentes de e-commerce, varejistas e freelancers usam nossa calculadora de porcentagem diariamente para análise de margens, definição de descontos e cálculos de markup.'
    }
  ] : [
    {
      question: lang === 'en' ? 'When will labor calculators be available?' : 'Quando as calculadoras trabalhistas estarão disponíveis?',
      answer: lang === 'en' ? 'We are actively developing payroll, overtime, and benefits calculators. They will be available soon.' : 'Estamos desenvolvendo ativamente calculadoras de folha de pagamento, horas extras e benefícios. Estarão disponíveis em breve.'
    }
  ];

  const iconMap: Record<string, React.ReactNode> = {
    dollar: <DollarSign className="w-8 h-8" />,
    percent: <Percent className="w-8 h-8" />,
    briefcase: <Briefcase className="w-8 h-8" />
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--color-surface)] py-12 md:py-20 border-b border-[var(--color-border)]">
        <Container>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
              {iconMap[CATEGORIES[categoryKey].icon]}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{catContent.title}</h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl">{catContent.subtitle}</p>
        </Container>
      </section>

      {/* Calculators Grid */}
      <Section className="bg-[#F5F5F7]">
        <Container>
          {calculators.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {calculators.map((calc: any) => (
                <CalculatorCard
                  key={calc.calculator_id}
                  title={calc.title}
                  description={calc.meta_description}
                  href={`/${lang}/calculators/${calc.slug}`}
                  category={catContent.title}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
                {iconMap[CATEGORIES[categoryKey].icon]}
              </div>
              <h2 className="text-2xl font-bold mb-3 text-[var(--color-text-primary)]">
                {lang === 'en' ? 'Coming Soon' : 'Em Breve'}
              </h2>
              <p className="text-[var(--color-text-secondary)] max-w-md mx-auto">
                {lang === 'en' 
                  ? 'We are actively developing calculators for this category. Check back soon!'
                  : 'Estamos desenvolvendo calculadoras para esta categoria. Volte em breve!'}
              </p>
            </div>
          )}
        </Container>
      </Section>

      {/* Related Guides */}
      {relatedGuides.length > 0 && (
        <Section className="bg-white border-b border-[var(--color-border)]">
          <Container>
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              {lang === 'en' ? 'Related Guides' : 'Guias Relacionados'}
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8">
              {lang === 'en' ? 'Deepen your knowledge with our expert articles.' : 'Aprofunde seu conhecimento com nossos artigos especializados.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedGuides.map((guide: any) => (
                <Link key={guide.slug} href={`/${lang}/guides/${guide.slug}`} className="group block h-full">
                  <div className="bg-[#F5F5F7] rounded-[var(--radius-apple)] p-6 border border-[var(--color-border)] shadow-sm hover:shadow-lg transition-all h-full flex flex-col">
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

      {/* Cross-Category Internal Links */}
      <Section className="bg-[#F5F5F7] border-b border-[var(--color-border)]">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            {lang === 'en' ? 'Explore Other Categories' : 'Explore Outras Categorias'}
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8">
            {lang === 'en' ? 'Discover more precision tools across different disciplines.' : 'Descubra mais ferramentas de precisão em diferentes áreas.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherCategories.map((cat) => (
              <Link key={cat.key} href={`/${lang}/calculators/category/${cat.slug}`} className="group block">
                <div className="bg-white rounded-2xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-lg transition-all flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                    {iconMap[CATEGORIES[cat.key].icon]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{cat.title}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] line-clamp-1">{cat.subtitle}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-white">
        <Container className="max-w-3xl">
          <FAQ items={faqItems} title={lang === 'en' ? 'Frequently Asked Questions' : 'Dúvidas Frequentes'} />
        </Container>
      </section>
    </div>
  );
}
