import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

export const viewport: Viewport = {
  themeColor: '#f8b03b',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: { default: 'Ancestro', template: '%s | Ancestro' },
  description: "Join LATAM's fastest growing solar + battery subscription network. $0 upfront, day-one savings, available in 18 countries.",
  metadataBase: new URL('https://ancestro.ai'),
  icons: { icon: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/favicon.png`, apple: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/favicon.png` },
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
    <html lang="es" className={inter.variable}>
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
