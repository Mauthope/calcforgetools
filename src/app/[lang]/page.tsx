import { getCalculators } from '@/lib/content';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { CalculatorCard } from '@/components/calculator/CalculatorCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { InteractiveBackground } from '@/components/ui/motion/InteractiveBackground';
import { ArrowRight, Calculator } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'pt' }];
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const calculators = await getCalculators(lang);
  
  // Show first 4 as featured
  const featuredCalculators = calculators.slice(0, 4);

  const heroContent = {
    en: {
      title: "Precision Tools for Financial Growth",
      subtitle: "CalcForgeTools provides Apple-inspired, fast, and completely free calculators to help you make standard financial and business decisions with clarity.",
      cta: "Explore Calculators"
    },
    pt: {
      title: "Ferramentas Precisas para o seu Crescimento",
      subtitle: "A CalcForgeTools fornece calculadoras rápidas e totalmente gratuitas para ajudar você a tomar decisões financeiras e empresariais com clareza.",
      cta: "Explorar Calculadoras"
    }
  }[lang as 'en' | 'pt'] || { title: '', subtitle: '', cta: '' };

  const sectionTitles = {
    en: { featured: "Featured Calculators", featuredSub: "Our most popular mathematical tools" },
    pt: { featured: "Calculadoras em Destaque", featuredSub: "Nossas ferramentas matemáticas mais populares" }
  }[lang as 'en' | 'pt'];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <InteractiveBackground />
        <Container className="text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium mb-6">
            <Calculator size={16} />
            {lang === 'en' ? 'V1.0 Now Available' : 'V1.0 Disponível'}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--color-text-primary)] mb-6 drop-shadow-sm">
            {heroContent.title}
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
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

      {/* Featured Calculators Grid */}
      <Section className="bg-[#F5F5F7]">
        <Container>
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">{sectionTitles.featured}</h2>
            <p className="text-[var(--color-text-secondary)]">{sectionTitles.featuredSub}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCalculators.map((calc: any) => (
              <CalculatorCard
                key={calc.calculator_id}
                title={calc.title}
                description={calc.meta_description}
                href={`/${lang}/calculators/${calc.slug}`}
                category="Finance"
              />
            ))}
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
    </div>
  );
}
