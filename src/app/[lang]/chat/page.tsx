import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatPanel from '@/components/ChatPanel';

interface PageProps { params: Promise<{ lang: string }> }

export default async function ChatPage({ params }: PageProps) {
  const { lang } = await params;

  return (
    <div className="page-wrapper">
      <Navbar lang={lang} />
      <main id="main-content" role="main">
        <ChatPanel lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
