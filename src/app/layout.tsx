import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

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
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className={inter.variable}>
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}

