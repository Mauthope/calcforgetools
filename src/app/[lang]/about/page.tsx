import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  return (
    <>
      <section className="bg-[var(--color-surface)] py-12 md:py-20 border-b border-[var(--color-border)]">
        <Container>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {lang === 'en' ? 'About CalcForgeTools' : 'Sobre o CalcForgeTools'}
          </h1>
        </Container>
      </section>

      <Section className="bg-[#F5F5F7] min-h-[50vh]">
        <Container className="max-w-4xl">
          <div className="apple-card p-8 md:p-12 prose prose-lg prose-blue">
            {lang === 'en' ? (
              <>
                <h2>Our Mission</h2>
                <p>We believe that financial mathematics shouldn't be hidden behind complex jargon or confusing interfaces. CalcForgeTools was created to provide premium, highly-accurate, and beautiful calculator tools accessible to everyone.</p>
                
                <h2>Why Us?</h2>
                <ul>
                  <li><strong>Speed:</strong> Instant client-side calculations.</li>
                  <li><strong>Clarity:</strong> Apple-inspired design principles that focus entirely on readability and ease of use.</li>
                  <li><strong>Privacy:</strong> We don't save your inputs. Your financial data stays in your browser.</li>
                </ul>

                <h2>Contact</h2>
                <p>For support, suggestions, or business inquiries, reach out to us at <strong>hello@calcforgetools.com</strong>.</p>
              </>
            ) : (
              <>
                <h2>Nossa Missão</h2>
                <p>Acreditamos que a matemática financeira não deve ficar escondida atrás de jargões complexos ou interfaces confusas. O CalcForgeTools foi criado para fornecer ferramentas premium, altamente precisas e bonitas, acessíveis a todos.</p>
                
                <h2>Por que Nós?</h2>
                <ul>
                  <li><strong>Velocidade:</strong> Cálculos instantâneos e rápidos.</li>
                  <li><strong>Clareza:</strong> Design baseado em princípios de usabilidade, focado em facilidade de uso.</li>
                  <li><strong>Privacidade:</strong> Seus dados financeiros não saem do seu navegador.</li>
                </ul>

                <h2>Contato</h2>
                <p>Para suporte, sugestões ou parcerias de negócios, entre em contato através de <strong>hello@calcforgetools.com</strong>.</p>
              </>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
