import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Database, FileJson, Server, Code } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    title: lang === 'en' ? 'Open Datasets API - CalcForgeTools' : 'API Pública de Dados - CalcForgeTools',
    description: lang === 'en' 
      ? 'Access our official and updated financial and labor datasets via public API, optimized for AI agents and developers.'
      : 'Acesse nossas bases de dados governamentais e financeiras oficiais via API pública otimizada para desenvolvedores e agentes de Inteligência Artificial.'
  }
}

export default async function DatasetsHub({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  // Google Dataset Search Schema
  const datasetLd = {
    '@context': 'https://schema.org/',
    '@type': 'Dataset',
    name: 'Brazil Labor & Financial Constants (2026)',
    description: 'Official calculation constants array for independent developers and AI Agents. Contains progressive INSS tables (2026), updated IRRF tax slabs (2026), Minimum Wage estimates, and CLT employer cost ratios.',
    url: 'https://calcforgetools.com/en/datasets',
    sameAs: 'https://calcforgetools.com/pt/datasets',
    keywords: [
      'Brazil Labor Constants',
      'INSS table 2026',
      'IRRF slabs 2026',
      'Minimum Wage Brazil',
      'Tax Data API'
    ],
    creator: {
      '@type': 'Organization',
      url: 'https://calcforgetools.com/',
      name: 'CalcForgeTools'
    },
    includedInDataCatalog: {
      '@type': 'DataCatalog',
      name: 'calcforgetools.com'
    },
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: 'https://calcforgetools.com/api/v1/datasets/brazil-labor-2026'
      }
    ],
    version: '2026.1.0',
    temporalCoverage: '2026-01-01/2026-12-31',
    spatialCoverage: 'Brazil',
    license: 'https://creativecommons.org/licenses/by/4.0/'
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }}
      />
      
      {/* Hero */}
      <section className="bg-[var(--color-surface)] py-16 md:py-24 border-b border-[var(--color-border)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <Container>
           <div className="max-w-3xl mx-auto text-center">
             <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-sm font-bold text-indigo-700 mb-6">
                <div className="flex items-center gap-2">
                  <Database size={16} />
                  {lang === 'en' ? 'Open Data Hub v1' : 'Hub de Dados Abertos v1'}
                </div>
             </div>
             <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-[var(--color-text-primary)]">
               {lang === 'en' ? 'Public Datasets & API' : 'Datasets & API Pública'}
             </h1>
             <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed">
               {lang === 'en' 
                 ? 'Integrate official Brazilian calculation constants directly into your apps and AI autonomous agents globally via reliable JSON endpoints.' 
                 : 'Integre constantes trabalhistas e financeiras oficiais diretamente nos seus sistemas ou agentes de IA via JSON estático de alta velocidade.'}
             </p>
          </div>
        </Container>
      </section>

      {/* Datasets List */}
      <Section className="bg-[#F5F5F7] min-h-[50vh] py-16">
        <Container className="max-w-4xl space-y-8">
          
          <div className="apple-card p-6 md:p-8 bg-white border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Brazil Labor & Financial 2026</h2>
                <p className="text-[var(--color-text-secondary)] mb-4 lg:pr-8">
                  {lang === 'en' 
                    ? 'A unified JSON packet containing the exact INSS Progressive bands (2026), updated IRRF tax slabs (2026), and CLT cost indicators we use to power CalcForgeTools engines.'
                    : 'Pacote JSON unificado contendo tabelas progressivas do INSS (2026), faixas atualizadas no novo teto do IRRF (2026) e matrizes de custo patronais CLT usadas em nossos próprios motores matemáticos.'}
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md ring-1 ring-green-200/50">Status: Stable</span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md">Vers: 2026.1.0</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md flex items-center gap-1"><Server size={12}/> AI-Optimized</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 min-w-[200px] shrink-0">
                <a 
                  href="/api/v1/datasets/brazil-labor-2026" 
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-xl transition-transform hover:scale-105 shadow-md"
                >
                  <FileJson size={18} />
                  {lang === 'en' ? 'Get Request' : 'Acessar Endpoint'}
                </a>
              </div>
            </div>
            
            <hr className="my-6 border-slate-100" />
            
            <div className="bg-slate-900 rounded-xl p-4 overflow-hidden relative border border-slate-800">
              <div className="absolute top-0 right-0 p-3 text-slate-500">
                <Code size={20} />
              </div>
              <h3 className="text-slate-400 font-mono text-sm mb-3 uppercase tracking-wider">Example Payload (Sample)</h3>
              <pre className="text-emerald-400 font-mono text-sm overflow-x-auto">
{`{
  "metadata": {
    "id": "br-labor-financial-2026",
    "version": "2026.1.0"
  },
  "data": {
    "minimumWage": { "value": 1621.00, "currency": "BRL" },
    "inss": {
       "ceilingSalary": 8475.55,
       "bands": [ { "upTo": 1621.0, "rate": 0.075 }, ... ]
    }
  }
}`}
              </pre>
            </div>
          </div>

        </Container>
      </Section>
    </>
  );
}
