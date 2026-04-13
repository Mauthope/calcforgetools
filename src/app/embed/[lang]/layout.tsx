export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'pt' }];
}

export default async function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 bg-transparent w-full h-full min-h-screen">
      {children}
    </main>
  );
}
