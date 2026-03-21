import './globals.css';
import type { Metadata } from 'next';

// We put the lang-specific Layout inside [lang]/layout.tsx
// This root just provides the bare HTML skeleton

export const metadata: Metadata = {
  title: 'CalcForgeTools',
  description: 'A modern platform for calculations and tools.',
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* Placeholder for Google AdSense - Replace client=ca-pub-XXXXXXXXXXXXXXXX with your real ID */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0000000000000000" crossOrigin="anonymous"></script>
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
