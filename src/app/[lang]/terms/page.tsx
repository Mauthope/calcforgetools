import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  return (
    <>
      <section className="bg-[var(--color-surface)] py-12 md:py-20 border-b border-[var(--color-border)]">
        <Container>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {lang === 'en' ? 'Terms of Service' : 'Termos de Serviço'}
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)]">
            {lang === 'en' ? 'Last updated: March 2026' : 'Última atualização: Março de 2026'}
          </p>
        </Container>
      </section>

      <Section className="bg-[#F5F5F7] min-h-[50vh]">
        <Container className="max-w-4xl">
          <div className="apple-card p-8 md:p-12 prose prose-lg prose-blue">
            {lang === 'en' ? (
              <>
                <h2>1. Acceptance of Terms</h2>
                <p>By accessing and using CalcForgeTools, you accept and agree to be bound by the terms and provision of this agreement.</p>
                
                <h2>2. Not Financial Advice</h2>
                <p>All calculations, results, and explanatory content provided on CalcForgeTools are for educational and informational purposes only. They do not constitute formal financial, legal, or professional advice. Always consult with a licensed financial advisor before making significant financial decisions.</p>

                <h2>3. Accuracy of Calculations</h2>
                <p>While we strive for 100% mathematical accuracy using standard industry formulas, we do not guarantee the completeness or absolute correctness of any result. Variables in real life (such as exact daily compounding times, leap years, or specific bank policies) may cause slight deviations from our estimates.</p>
              </>
            ) : (
              <>
                <h2>1. Aceitação dos Termos</h2>
                <p>Ao acessar e usar o CalcForgeTools, você aceita e concorda em ficar vinculado aos termos e disposições deste acordo.</p>
                
                <h2>2. Não é Recomendação Financeira</h2>
                <p>Todos os cálculos, resultados e conteúdos explicativos fornecidos no CalcForgeTools são apenas para fins educacionais e informativos. Eles não constituem aconselhamento financeiro ou profissional. Consulte sempre um consultor financeiro licenciado antes de tomar decisões financeiras.</p>

                <h2>3. Precisão dos Cálculos</h2>
                <p>Embora nos esforcemos para obter precisão matemática usando fórmulas padrão, não garantimos a exatidão absoluta de qualquer resultado. Variáveis na vida real (como políticas específicas de bancos) podem causar pequenos desvios de nossas estimativas.</p>
              </>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
