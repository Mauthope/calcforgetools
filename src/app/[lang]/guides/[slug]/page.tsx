import { getGuideBySlug, getGuides } from '@/lib/content';
import { getAlternateSlug } from '@/lib/slugMaps';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateStaticParams() {
  const enGuides = await getGuides('en');
  const ptGuides = await getGuides('pt');
  
  const paths: { lang: string, slug: string }[] = [];
  
  enGuides.forEach(g => paths.push({ lang: 'en', slug: g.slug }));
  ptGuides.forEach(g => paths.push({ lang: 'pt', slug: g.slug }));
  
  return paths;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const data = await getGuideBySlug(lang, slug);
  
  if (!data) return {};

  const altSlug = getAlternateSlug(slug, lang as 'en' | 'pt');

  return {
    title: data.meta_title,
    description: data.meta_description,
    alternates: {
      canonical: `/${lang}/guides/${slug}`,
      languages: {
        'en': `/en/guides/${lang === 'en' ? slug : altSlug}`,
        'pt': `/pt/guides/${lang === 'pt' ? slug : altSlug}`
      }
    }
  };
}

export default async function GuidePage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
  const { lang, slug } = await params;
  const data = await getGuideBySlug(lang, slug);

  if (!data) return notFound();

  const baseUrl = 'https://calcforgetools.com';

  // JSON-LD: Article (enhanced)
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.hero.title,
    description: data.meta_description,
    url: `${baseUrl}/${lang}/guides/${slug}`,
    datePublished: '2026-03-01',
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: lang === 'pt' ? 'pt-BR' : 'en-US',
    author: { '@type': 'Organization', name: 'CalcForgeTools', url: baseUrl },
    publisher: {
      '@type': 'Organization',
      name: 'CalcForgeTools',
      url: baseUrl
    }
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/${lang}` },
      { '@type': 'ListItem', position: 2, name: lang === 'en' ? 'Guides' : 'Guias', item: `${baseUrl}/${lang}/guides` },
      { '@type': 'ListItem', position: 3, name: data.hero.title, item: `${baseUrl}/${lang}/guides/${slug}` }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      
      {/* Hero */}
      <section className="bg-[var(--color-surface)] py-16 md:py-24 border-b border-[var(--color-border)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <Container>
          <div className="max-w-3xl mx-auto text-center">
             <div className="inline-block px-3 py-1 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] mb-6">
                {lang === 'en' ? 'Financial Deep Dive' : 'Artigo Financeiro'}
             </div>
             <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-[var(--color-text-primary)]">{data.hero.title}</h1>
             <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed">
               {data.hero.subtitle}
             </p>
          </div>
        </Container>
      </section>

      {/* Content */}
      <Section className="bg-[#F5F5F7]">
        <Container className="max-w-3xl">
          <div className="apple-card p-8 md:p-12 prose prose-lg prose-blue max-w-none">
            {data.content.map((block: any, idx: number) => {
              switch (block.type) {
                case 'heading':
                  return <h2 key={idx} className="text-3xl font-bold mt-12 mb-6 tracking-tight text-[var(--color-text-primary)]">{block.text}</h2>;
                case 'paragraph':
                  return <p key={idx} className="text-[var(--color-text-secondary)] leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: block.text }}></p>;
                case 'quote':
                  return (
                    <blockquote key={idx} className="border-l-4 border-[var(--color-primary)] pl-6 py-2 my-8 italic text-xl text-[var(--color-text-primary)] bg-[var(--color-primary)]/5 rounded-r-lg">
                      "{block.text}"
                      {block.author && <footer className="text-sm font-medium text-[var(--color-text-secondary)] mt-4 not-italic">— {block.author}</footer>}
                    </blockquote>
                  );
                case 'list':
                  return (
                    <ul key={idx} className="list-disc pl-6 mb-8 text-[var(--color-text-secondary)] space-y-3">
                      {block.items.map((item: string, i: number) => (
                        <li key={i} className="pl-2" dangerouslySetInnerHTML={{ __html: item }}></li>
                      ))}
                    </ul>
                  );
                case 'table':
                  if (!block.headers || !block.rows) return null;
                  return (
                    <div key={idx} className="overflow-x-auto mb-8 rounded-xl border border-[var(--color-border)] shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-[var(--color-border)]">
                            {block.headers.map((h: string, i: number) => (
                              <th key={i} className="py-3 px-4 font-bold text-sm text-[var(--color-text-primary)]">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                          {block.rows.map((row: string[], i: number) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                              {row.map((cell: string, j: number) => (
                                <td key={j} className="py-3 px-4 text-sm text-[var(--color-text-secondary)]" dangerouslySetInnerHTML={{ __html: cell }}></td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>

          {/* Related */}
          <div className="mt-16">
            {data.related_tools && <RelatedTools items={data.related_tools} title={lang === 'en' ? 'Put it into practice' : 'Coloque na prática'} lang={lang} />}
          </div>
        </Container>
      </Section>
    </>
  );
}
