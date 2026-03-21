import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  return (
    <>
      <section className="bg-[var(--color-surface)] py-12 md:py-20 border-b border-[var(--color-border)]">
        <Container>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {lang === 'en' ? 'Privacy Policy' : 'Política de Privacidade'}
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
                <h2>1. Information We Collect</h2>
                <p>We believe in data minimization. When you use CalcForgeTools, we do not require any personal registration to use the calculators. The data entered into calculators is processed in your browser and is not stored on our servers.</p>
                
                <h2>2. Cookies and Tracking</h2>
                <p>We use standard analytics tools to understand how users interact with our site. We also use third-party advertising partners (like Google AdSense) that may use cookies to serve ads based on your prior visits to this website or other websites.</p>

                <h2>3. Google AdSense</h2>
                <p>As a requirement of the Google AdSense program, we inform you that Google uses cookies to serve ads. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our sites and/or other sites on the internet. Users may opt out of personalized advertising by visiting Google's <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer">Ads Settings</a>.</p>
              </>
            ) : (
              <>
                <h2>1. Informações que Coletamos</h2>
                <p>Acreditamos na minimização de dados. Ao usar o CalcForgeTools, não exigimos nenhum registro pessoal. Os dados inseridos nas calculadoras são processados no seu navegador e não são armazenados em nossos servidores.</p>
                
                <h2>2. Cookies e Rastreamento</h2>
                <p>Usamos ferramentas de análise padrão para entender como os usuários interagem com nosso site. Também usamos parceiros de publicidade terceirizados (como Google AdSense) que podem usar cookies para veicular anúncios com base em suas visitas anteriores a este site ou outros.</p>

                <h2>3. Google AdSense</h2>
                <p>Como exigência do programa Google AdSense, informamos que o Google usa cookies para veicular anúncios. O uso de cookies de publicidade pelo Google permite que ele e seus parceiros veiculem anúncios com base na sua visita aos nossos sites e/ou outros sites. Os usuários podem desativar a publicidade personalizada visitando as <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer">Configurações de Anúncios do Google</a>.</p>
              </>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
