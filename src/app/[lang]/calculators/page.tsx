import { getCalculators } from '@/lib/content';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { CalculatorCard } from '@/components/calculator/CalculatorCard';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'pt' }];
}

export default async function CalculatorsIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const calculators = await getCalculators(lang);
  
  const content = {
    en: {
      title: "All Calculators",
      subtitle: "Explore our complete suite of carefully designed mathematical tools."
    },
    pt: {
      title: "Todas as Calculadoras",
      subtitle: "Explore nossa suíte completa de ferramentas matemáticas cuidadosamente projetadas."
    }
  }[lang as 'en' | 'pt'] || { title: '', subtitle: '' };

  return (
    <div>
      <section className="bg-[var(--color-surface)] py-12 md:py-20 border-b border-[var(--color-border)]">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{content.title}</h1>
          <p className="text-xl text-[var(--color-text-secondary)]">{content.subtitle}</p>
        </Container>
      </section>

      <Section className="bg-[#F5F5F7] min-h-[50vh]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.map((calc: any) => (
              <CalculatorCard
                key={calc.calculator_id}
                title={calc.title}
                description={calc.meta_description}
                href={`/${lang}/calculators/${calc.slug}`}
                category="Finance / Business"
              />
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
