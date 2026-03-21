import { getGuides } from '@/lib/content';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'pt' }];
}

export default async function GuidesIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const guides = await getGuides(lang);
  
  const content = {
    en: {
      title: "Financial Guides & Articles",
      subtitle: "Master your money with our in-depth SEO-optimized mathematical breakdowns."
    },
    pt: {
      title: "Guias e Artigos Financeiros",
      subtitle: "Domine seu dinheiro com nossas análises matemáticas e guias de otimização financeira."
    }
  }[lang as 'en' | 'pt'] || { title: '', subtitle: '' };

  return (
    <div>
      <section className="bg-[var(--color-surface)] py-12 md:py-20 border-b border-[var(--color-border)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[var(--color-text-primary)]">{content.title}</h1>
          <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed">{content.subtitle}</p>
        </Container>
      </section>

      <Section className="bg-[#F5F5F7] min-h-[50vh]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide: any, idx: number) => (
              <Link key={idx} href={`/${lang}/guides/${guide.slug}`} className="group outline-none flex">
                <div className="bg-white border border-[var(--color-border)] p-6 rounded-2xl w-full flex flex-col hover:border-[var(--color-primary)] shadow-sm hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-blue-50 text-[var(--color-primary)] p-3 rounded-xl group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors shrink-0">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                      {guide.hero?.title || guide.meta_title}
                    </h3>
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-sm mb-6 leading-relaxed flex-1">
                    {guide.meta_description}
                  </p>
                  <div className="flex items-center text-[var(--color-primary)] text-sm font-semibold mt-auto pt-4 border-t border-[var(--color-border)] opacity-80 group-hover:opacity-100">
                    {lang === 'pt' ? 'Ler artigo completo' : 'Read full article'}
                    <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
