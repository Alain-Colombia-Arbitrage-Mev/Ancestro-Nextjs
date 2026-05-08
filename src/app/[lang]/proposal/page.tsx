import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProposalGenerator from '@/components/ProposalGenerator';
import { t } from '@/i18n/translations';

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: t(lang, 'proposal.meta.title'),
    description: t(lang, 'proposal.meta.desc'),
  };
}

export default async function ProposalPage({ params }: Props) {
  const { lang } = await params;
  return (
    <>
      <Navbar lang={lang} />
      <ProposalGenerator lang={lang} />
      <Footer lang={lang} />
    </>
  );
}
