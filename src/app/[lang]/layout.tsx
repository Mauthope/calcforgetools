import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'pt' }];
}

export default async function LangLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer lang={lang as 'en' | 'pt'} />
    </>
  );
}
