import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/urbanist/400.css';
import '@fontsource/urbanist/500.css';
import '@fontsource/urbanist/600.css';
import '@fontsource/urbanist/700.css';
import '@fontsource/urbanist/800.css';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { CDN_URL } from '@/lib/cdn';

export const viewport: Viewport = {
  themeColor: '#f8b03b',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: { default: 'Ancestro', template: '%s | Ancestro' },
  description: "Join LATAM's fastest growing solar + battery subscription network. $0 upfront, day-one savings, available in 18 countries.",
  metadataBase: new URL('https://ancestro.ai'),
  icons: { icon: `${CDN_URL}/favicon.png`, apple: `${CDN_URL}/favicon.png` },
  openGraph: {
    siteName: 'Ancestro',
    locale: 'es_LA',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', site: '@ancestro', creator: '@ancestro' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://assets.ancestro.ai" />
        <link rel="preconnect" href="https://assets.ancestro.ai" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
