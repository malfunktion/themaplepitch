import type { Metadata, Viewport } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://themaplepitch.ca'),
  title: {
    default: 'The Maple Pitch — Canadian Soccer Intelligence',
    template: '%s // The Maple Pitch',
  },
  description: 'Canadian soccer intelligence covering professional, provincial and national pathways, with news, statistics, scouting and tactical analysis.',
  applicationName: 'The Maple Pitch',
  keywords: ['Canadian soccer', 'CPL', 'Northern Super League', 'Canada Soccer', 'soccer analytics', 'Canadian players abroad'],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'The Maple Pitch',
    title: 'The Maple Pitch — Canadian Soccer Intelligence',
    description: 'Matches. Players. Tactics. Pathways.',
    url: 'https://themaplepitch.ca',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Maple Pitch — Canadian Soccer Intelligence',
    description: 'Matches. Players. Tactics. Pathways.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: '#ffffff',
};

const themeInitScript = `
  (function() {
    try {
      var stored = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (stored === 'dark' || (!stored && prefersDark)) document.documentElement.classList.add('dark');
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head><script dangerouslySetInnerHTML={{ __html: themeInitScript }} /></head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'The Maple Pitch', url: 'https://themaplepitch.ca', description: 'Canadian soccer intelligence covering professional, provincial and national pathways.' }) }} />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-crimson focus:px-3 focus:py-2 focus:text-xs focus:font-bold focus:text-white">Skip to content</a>
        <Header />
        <main id="main-content" className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
