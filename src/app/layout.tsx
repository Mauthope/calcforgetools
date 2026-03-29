import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// We put the lang-specific Layout inside [lang]/layout.tsx
// This root just provides the bare HTML skeleton

export const metadata: Metadata = {
  metadataBase: new URL('https://calcforgetools.com'),
  title: 'CalcForgeTools',
  description: 'A modern platform for calculations and tools.',
  verification: {
    other: {
      'msvalidate.01': '261B22DCAAB82559D9C4611FD9A01587',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className={inter.variable}>
      <head>
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "w1ir1cs31s");
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'CalcForgeTools',
              url: 'https://calcforgetools.com',
              logo: 'https://calcforgetools.com/icon.svg',
              founder: {
                '@type': 'Person',
                name: 'Mauricio Grigol'
              }
            })
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
