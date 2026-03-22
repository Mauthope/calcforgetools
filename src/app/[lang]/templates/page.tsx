import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { LayoutDashboard, ExternalLink, Download, Eye } from 'lucide-react';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'pt' }];
}

export default async function TemplatesIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  const content = {
    en: {
      title: "Premium Dashboards",
      subtitle: "Professional grade analytics modules to download and use completely offline.",
      soon: "More modules coming soon."
    },
    pt: {
      title: "Dashboards Premium",
      subtitle: "Módulos analíticos de nível profissional para baixar e controlar sua vida financeira offline.",
      soon: "Mais módulos em breve."
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

      <Section className="bg-[#F5F5F7] min-h-[50vh]">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Product 1: Financing Dashboard */}
            <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden flex flex-col hover:shadow-lg transition-all group">
              {/* Image / Icon Preview Area */}
              <div className="bg-slate-100 h-56 w-full border-b border-[var(--color-border)] flex items-center justify-center relative overflow-hidden">
                 <LayoutDashboard className="w-16 h-16 text-slate-300 transition-transform duration-500 group-hover:scale-110" />
                 
                 {/* Hover Overlay */}
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a href="https://mauthope.github.io/premium_template/" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-white text-black font-semibold rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                       <ExternalLink className="w-4 h-4" />
                       {lang === 'en' ? 'Live Preview' : 'Ver Prévia'}
                    </a>
                 </div>
              </div>

              {/* Product Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] leading-tight">
                    {lang === 'en' ? 'Financing Control Dashboard' : 'Dashboard Controle de Financiamento'}
                  </h3>
                  <span className="bg-emerald-50 text-emerald-600 text-[11px] px-2.5 py-1 rounded-md font-bold shrink-0 border border-emerald-100 uppercase tracking-wide">
                    {lang === 'en' ? '$ 14.90' : 'R$ 47,90'}
                  </span>
                </div>
                <p className="text-[var(--color-text-secondary)] text-sm mb-8 flex-1 leading-relaxed">
                   {lang === 'en' 
                     ? 'Take absolute control of your vehicle or real estate financing. Compare amortization systems, project early payoffs, and simulate interest savings visually.'
                     : 'Assuma o controle total do seu financiamento de veículo ou imóvel. Compare sistemas de amortização, projete quitações antecipadas e descubra como economizar milhares em juros.'
                   }
                </p>
                <div className="flex flex-col gap-3">
                  <a href="https://mauthope.github.io/premium_template/" target="_blank" rel="noopener noreferrer" className="w-full">
                    <button className="w-full py-3 rounded-xl border-2 border-[var(--color-border)] bg-transparent hover:bg-slate-50 font-bold text-[var(--color-text-primary)] transition-colors flex justify-center items-center gap-2">
                      <Eye className="w-4 h-4" />
                      {lang === 'en' ? 'Live Interactive Preview' : 'Prévia Interativa Online'}
                    </button>
                  </a>
                  <a href="https://pay.hotmart.com/C105023977W" target="_blank" rel="noopener noreferrer" className="w-full">
                    <button className="w-full py-3 rounded-xl bg-[#007AFF] hover:bg-[#007AFF]/90 text-white font-bold shadow-md shadow-blue-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2">
                      <Download className="w-4 h-4" />
                      {lang === 'en' ? 'Download Dashboard' : 'Baixar Dashboard Completo'}
                    </button>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </Section>
    </div>
  );
}
