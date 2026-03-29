import { getCalculatorBySlug, getCalculators } from '@/lib/content';
import { getAlternateSlug } from '@/lib/slugMaps';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { FAQ } from '@/components/ui/FAQ';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { RelatedGuides } from '@/components/ui/RelatedGuides';
import { TemplateCTA } from '@/components/ui/TemplateCTA';
import { AdUnit } from '@/components/ads/AdUnit';
import { CalculatorClientWrapper } from '@/components/calculator/CalculatorClientWrapper';
import { SourcesBlock } from '@/components/calculator/SourcesBlock';
import { ScrollReveal } from '@/components/ui/motion/ScrollReveal';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Generate static routes
export async function generateStaticParams() {
  const enCalculators = await getCalculators('en');
  const ptCalculators = await getCalculators('pt');
  
  const paths: { lang: string, slug: string }[] = [];
  
  enCalculators.forEach(c => paths.push({ lang: 'en', slug: c.slug }));
  ptCalculators.forEach(c => paths.push({ lang: 'pt', slug: c.slug }));
  
  return paths;
}

// Generate SEO Metadata with correct cross-language hreflang
export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const data = await getCalculatorBySlug(lang, slug);
  
  if (!data) return {};

  const altSlug = getAlternateSlug(slug, lang as 'en' | 'pt');

  return {
    title: data.meta_title,
    description: data.meta_description,
    alternates: {
      canonical: `/${lang}/calculators/${slug}`,
      languages: {
        'en': `/en/calculators/${lang === 'en' ? slug : altSlug}`,
        'pt': `/pt/calculators/${lang === 'pt' ? slug : altSlug}`
      }
    }
  };
}

export default async function CalculatorPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
  const { lang, slug } = await params;
  const data = await getCalculatorBySlug(lang, slug);

  if (!data) return notFound();

  const baseUrl = 'https://calcforgetools.com';

  // JSON-LD: BreadcrumbList
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/${lang}` },
      { '@type': 'ListItem', position: 2, name: lang === 'en' ? 'Calculators' : 'Calculadoras', item: `${baseUrl}/${lang}/calculators` },
      { '@type': 'ListItem', position: 3, name: data.title, item: `${baseUrl}/${lang}/calculators/${slug}` }
    ]
  };

  // JSON-LD: WebApplication
  const webAppLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: data.title,
    description: data.meta_description,
    url: `${baseUrl}/${lang}/calculators/${slug}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@type': 'Organization', name: 'CalcForgeTools', url: baseUrl }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }} />
      
      {/* Hero */}
      <section className="bg-[var(--color-surface)] py-8 md:py-12 border-b border-[var(--color-border)] overflow-hidden">
        <Container>
          <div className="max-w-3xl">
             <ScrollReveal direction="up" delay={0.1}>
               <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">{data.hero.title}</h1>
             </ScrollReveal>
             <ScrollReveal direction="up" delay={0.2}>
               <p className="text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed">
                 {data.hero.subtitle}
               </p>
             </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Main App Section */}
      <div className="bg-[#F5F5F7] pt-6 md:pt-10 pb-0">
        <Container>
          {/* Client Interactive Area */}
          <CalculatorClientWrapper 
            config={data} 
            lang={lang as 'en' | 'pt'}
            premiumTemplate={
              (data.calculator_id === 'loan' || data.calculator_id === 'debt_payoff' || data.calculator_id === 'compound_interest') ? (
                <TemplateCTA 
                  title={lang === 'en' 
                    ? (data.calculator_id === 'compound_interest' ? "FIRE Movement Investment Dashboard" : "Ultimate Debt Payoff Dashboard")
                    : (data.calculator_id === 'compound_interest' ? "Dashboard Otimização Investimentos (FIRE)" : "Dashboard Completo Quitação Dívida")
                  }
                  description={lang === 'en' 
                    ? (data.calculator_id === 'compound_interest' ? "Map your path to financial independence offline with our premium dashboard." : "Take offline control of your debt with our premium automated dashboard.")
                    : (data.calculator_id === 'compound_interest' ? "Mapeie seu caminho para a independência financeira com nosso dashboard premium." : "Tome o controle da sua dívida offline com nosso dashboard avançado.")
                  }
                  price={lang === 'en' ? "$ 14.90" : "R$ 47,90"}
                  formats={["Excel (.xlsx)", "Google Sheets"]}
                  checkoutUrl="https://pay.hotmart.com/C105023977W"
                  lang={lang}
                />
              ) : undefined
            }
          >
            {/* AdSense Placement Below Chart */}
            <div className="mt-4 w-full">
              <AdUnit adSlot="1234567890" />
            </div>
          </CalculatorClientWrapper>

        </Container>
      </div>

      {/* Content SEO Section */}
      <Section className="bg-[#F5F5F7] py-8 md:py-12 border-b border-[var(--color-border)]">
        <Container className="max-w-4xl space-y-12">
          
          {/* Formula & Explanation */}
          <div className="apple-card p-6 md:p-8 bg-blue-50/30 border-blue-100">
            <h2 className="text-2xl font-bold mb-4 tracking-tight">
              {lang === 'en' ? 'The Math Behind It' : 'A Matemática por Trás'}
            </h2>
            <div className="bg-white px-5 py-4 rounded-xl border border-[var(--color-border)] text-center mb-6 shadow-sm overflow-x-auto">
              <code className="text-xl md:text-2xl font-mono text-[var(--color-primary)]">
                {data.formula}
              </code>
            </div>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              {data.formula_explanation}
            </p>
            <h3 className="text-lg font-semibold mt-6 mb-2">
              {lang === 'en' ? 'Example' : 'Exemplo'}
            </h3>
            <p className="text-[var(--color-text-secondary)] border-l-4 border-[var(--color-primary)] pl-4 italic">
              {data.example}
            </p>
          </div>

          {/* Sources and Validity Block (E-E-A-T) */}
          <SourcesBlock sources={data.reference_sources} lang={lang as 'en' | 'pt'} />

          {/* FAQ */}
          {data.faq && <FAQ items={data.faq} />}

          {/* Related Tools */}
          {data.related_tools && (
            <RelatedTools 
              items={data.related_tools} 
              title={lang === 'en' ? 'Related Tools' : 'Ferramentas Relacionadas'} 
              lang={lang} 
            />
          )}

          {/* SEO Related Guides */}
          {data.related_guides && <RelatedGuides items={data.related_guides} />}

        </Container>
      </Section>
    </>
  );
}
