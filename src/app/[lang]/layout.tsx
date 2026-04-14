import { locales } from '@/i18n/config';
import ChatWidget from '@/components/ChatWidget';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  return (
    <>
      {children}
      <ChatWidget lang={lang} />
    </>
  );
}
