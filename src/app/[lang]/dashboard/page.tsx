import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardPanel from '@/components/auth/DashboardPanel';

interface PageProps { params: Promise<{ lang: string }> }

export default async function DashboardPage({ params }: PageProps) {
  const { lang } = await params;
  return (
    <div className="page-wrapper">
      <Navbar lang={lang} />
      <DashboardPanel lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}
