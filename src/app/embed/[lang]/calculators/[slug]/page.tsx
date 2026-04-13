import { getCalculatorBySlug, getCalculators } from '@/lib/content';
import { getAlternateSlug } from '@/lib/slugMaps';
import { CalculatorClientWrapper } from '@/components/calculator/CalculatorClientWrapper';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateStaticParams() {
  const enCalculators = await getCalculators('en');
  const ptCalculators = await getCalculators('pt');
  
  const paths: { lang: string, slug: string }[] = [];
  
  enCalculators.forEach(c => paths.push({ lang: 'en', slug: c.slug }));
  ptCalculators.forEach(c => paths.push({ lang: 'pt', slug: c.slug }));
  
  return paths;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const data = await getCalculatorBySlug(lang, slug);
  
  if (!data) return {};

  const altSlug = getAlternateSlug(slug, lang as 'en' | 'pt');

  return {
    title: `${data.meta_title} (Embed)`,
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

export default async function CalculatorEmbedPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
  const { lang, slug } = await params;
  const data = await getCalculatorBySlug(lang, slug);

  if (!data) return notFound();

  // O backlink do Embed 
  const backlinkUrl = `https://calcforgetools.com/${lang}/calculators/${slug}`;

  // JSON-LD is not strictly required for iframe embeds, but good to keep it lightweight if necessary. 
  // We'll omit it to keep the embed clean.

  return (
    <div className="bg-[#F5F5F7] min-h-screen py-4 px-2 w-full flex flex-col">
      {/* Container Isolado da Calculadora */}
      <div className="w-full max-w-[1200px] mx-auto flex-grow flex flex-col pt-2">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4 text-center text-[var(--color-text-primary)]">
          {data.hero.title}
        </h2>
        <CalculatorClientWrapper 
          config={data} 
          lang={lang as 'en' | 'pt'}
        />
        
        {/* Rodapé do Frame Embedado (Oculto minimalista com backlink) */}
        <div className="mt-8 mb-4 text-center">
            <a 
              href={backlinkUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 text-[13px] text-gray-500 hover:text-[var(--color-primary)] font-medium transition-colors"
            >
              <svg className="w-5 h-5 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21V19M8.298 18.232L9.712 16.818M5 12H7M8.298 5.76798L9.712 7.182M12 3V5M15.702 5.76798L14.288 7.182M19 12H17M15.702 18.232L14.288 16.818" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 9V15L10 12L14 9Z" fill="currentColor"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Powered by <span className="font-bold text-gray-700">CalcForgeTools</span></span>
            </a>
        </div>
      </div>
    </div>
  );
}
