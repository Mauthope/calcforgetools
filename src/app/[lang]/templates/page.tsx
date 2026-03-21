import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'pt' }];
}

export default async function TemplatesIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  const content = {
    en: {
      title: "Premium Excel Templates",
      subtitle: "Professional grade spreadsheets to download and use completely offline.",
      soon: "Premium library coming soon."
    },
    pt: {
      title: "Planilhas Premium Excel",
      subtitle: "Planilhas de nível profissional para baixar e usar totalmente offline.",
      soon: "Biblioteca premium em breve."
    }
  }[lang as 'en' | 'pt'] || { title: '', subtitle: '', soon: '' };

  return (
    <div>
      <section className="bg-[var(--color-surface)] py-12 md:py-20 border-b border-[var(--color-border)]">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{content.title}</h1>
          <p className="text-xl text-[var(--color-text-secondary)]">{content.subtitle}</p>
        </Container>
      </section>

      <Section className="bg-[#F5F5F7] min-h-[50vh] flex items-center justify-center">
        <Container className="text-center">
            <div className="apple-card inline-block p-12">
               <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">{content.soon}</h2>
               <p className="text-[var(--color-text-secondary)]">We are finalizing high-quality downloadable models.</p>
            </div>
        </Container>
      </Section>
    </div>
  );
}
