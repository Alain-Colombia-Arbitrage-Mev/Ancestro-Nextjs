import Link from 'next/link';
import Image from 'next/image';
import { t } from '@/i18n/translations';
import { CDN_URL } from '@/lib/cdn';

interface FooterProps {
  lang: string;
  backgroundImage?: string;
}

const FOOTER_BG = `${CDN_URL}/images/footer-bg.webp`;

export default function Footer({ lang, backgroundImage }: FooterProps) {
  const bg = backgroundImage || FOOTER_BG;
  const productLinks = [
    { label: t(lang, 'shop.solar.title'), href: '#solar' },
    { label: t(lang, 'shop.battery.title'), href: '#battery' },
    { label: t(lang, 'shop.charging.title'), href: '#charging' },
    { label: t(lang, 'shop.vehicles.title'), href: '#vehicles' },
  ];

  const companyLinks = [
    { label: t(lang, 'footer.distributor'), href: '#distributor' },
    { label: t(lang, 'footer.installer'), href: '#installer' },
    { label: t(lang, 'footer.investor'), href: '#investor' },
    { label: t(lang, 'footer.host'), href: '#host' },
  ];

  const supportLinks = [
    { label: t(lang, 'footer.help'), href: '#help' },
    { label: t(lang, 'footer.contact'), href: '#contact' },
    { label: t(lang, 'footer.faq'), href: '#faq' },
  ];

  const socialLinks = [
    { label: 'Twitter', icon: 'X' },
    { label: 'LinkedIn', icon: 'in' },
    { label: 'Instagram', icon: 'IG' },
  ];

  return (
    <>
      <section className="footer-section">
        <div className="footer-bg">
          <Image src={bg} alt="" fill sizes="100vw" quality={60} loading="lazy" />
          <div className="footer-overlay"></div>
        </div>

        <footer className="footer">
          <div className="footer-container">
            <div className="footer-top">
              <div className="footer-brand">
                <Link href={`/${lang}`} className="footer-logo">
                  <img src={`${CDN_URL}/logo.svg`} alt="Ancestro" className="footer-logo-img" />
                </Link>
                <p className="footer-tagline">{t(lang, 'footer.tagline')}</p>
                <div className="social-links">
                  {socialLinks.map((social) => (
                    <a key={social.label} href="#" className="social-link" aria-label={social.label}>
                      <span>{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="footer-links">
                <div className="footer-column">
                  <h4 className="footer-heading">{t(lang, 'footer.products')}</h4>
                  <ul className="footer-list">
                    {productLinks.map((link) => (
                      <li key={link.label}><a href={link.href} className="footer-link">{link.label}</a></li>
                    ))}
                  </ul>
                </div>
                <div className="footer-column">
                  <h4 className="footer-heading">{t(lang, 'footer.partners')}</h4>
                  <ul className="footer-list">
                    {companyLinks.map((link) => (
                      <li key={link.label}><a href={link.href} className="footer-link">{link.label}</a></li>
                    ))}
                  </ul>
                </div>
                <div className="footer-column">
                  <h4 className="footer-heading">{t(lang, 'footer.support')}</h4>
                  <ul className="footer-list">
                    {supportLinks.map((link) => (
                      <li key={link.label}><a href={link.href} className="footer-link">{link.label}</a></li>
                    ))}
                  </ul>
                </div>
                <div className="footer-column">
                  <h4 className="footer-heading">{t(lang, 'footer.findCharger')}</h4>
                  <p className="footer-description">{t(lang, 'footer.chargerDesc')}</p>
                  <a href="#" className="cta-button">
                    <span>{t(lang, 'footer.openMap')}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <p className="copyright">&copy; 2026 Ancestro. {t(lang, 'footer.rights')}</p>
              <div className="legal-links">
                <a href="#" className="legal-link">{t(lang, 'footer.terms')}</a>
                <a href="#" className="legal-link">{t(lang, 'footer.privacy')}</a>
              </div>
            </div>
          </div>
        </footer>
      </section>

      <style>{`
        .footer-section{position:relative;width:100%;min-height:600px;margin-top:100px}
        .footer-bg{position:absolute;inset:0;pointer-events:none;z-index:0}
        .footer-bg img{object-fit:cover;object-position:center}
        .footer-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.95) 0%,rgba(0,0,0,0.7) 30%,rgba(0,0,0,0.5) 60%,rgba(0,0,0,0.8) 100%)}
        .footer{position:relative;z-index:1;width:100%}
        .footer-container{max-width:1400px;margin:0 auto;padding:80px 50px 40px;display:flex;flex-direction:column;gap:60px}
        .footer-top{display:grid;grid-template-columns:1fr 2fr;gap:80px}
        .footer-brand{display:flex;flex-direction:column;gap:24px}
        .footer-logo{text-decoration:none;display:inline-block;transition:opacity 0.2s ease}
        .footer-logo:hover{opacity:0.9}
        .footer-logo-img{height:60px;width:auto;object-fit:contain}
        .footer-tagline{font-size:16px;line-height:1.6;color:rgba(255,255,255,0.7);max-width:300px}
        .social-links{display:flex;gap:12px;margin-top:8px}
        .social-link{width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:10px;color:#fff;font-size:14px;font-weight:600;text-decoration:none;transition:all 0.3s ease}
        .social-link:hover{background:rgba(248,176,59,0.2);border-color:rgba(248,176,59,0.4);color:#f8b03b;transform:translateY(-2px)}
        .footer-links{display:grid;grid-template-columns:repeat(4,1fr);gap:40px}
        .footer-column{display:flex;flex-direction:column;gap:20px}
        .footer-heading{font-size:14px;font-weight:600;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.05em}
        .footer-list{display:flex;flex-direction:column;gap:12px;list-style:none;padding:0;margin:0}
        .footer-link{font-size:15px;font-weight:400;color:rgba(255,255,255,0.85);text-decoration:none;transition:all 0.2s ease}
        .footer-link:hover{color:#f8b03b;transform:translateX(4px)}
        .footer-description{font-size:14px;color:rgba(255,255,255,0.6);line-height:1.5}
        .footer-section .cta-button{display:inline-flex;align-items:center;gap:8px;padding:12px 20px;background:#f8b03b;color:#000;font-size:14px;font-weight:600;text-decoration:none;border-radius:12px;transition:all 0.3s ease;width:fit-content}
        .footer-section .cta-button:hover{background:#ffbe4d;transform:translateY(-2px);box-shadow:0 8px 24px rgba(248,176,59,0.3)}
        .footer-section .cta-button svg{transition:transform 0.3s ease}
        .footer-section .cta-button:hover svg{transform:translateX(4px)}
        .footer-bottom{display:flex;justify-content:space-between;align-items:center;padding-top:40px;border-top:1px solid rgba(255,255,255,0.1)}
        .copyright{font-size:14px;color:rgba(255,255,255,0.5)}
        .legal-links{display:flex;gap:32px}
        .legal-link{font-size:14px;color:rgba(255,255,255,0.5);text-decoration:none;transition:color 0.2s ease}
        .legal-link:hover{color:#fff}
        @media(max-width:1200px){.footer-top{grid-template-columns:1fr;gap:50px}.footer-links{grid-template-columns:repeat(2,1fr);gap:40px}.footer-brand{max-width:400px}}
        @media(max-width:768px){.footer-section{margin-top:60px;min-height:auto}.footer-container{padding:60px 24px 30px;gap:40px}.footer-links{grid-template-columns:1fr 1fr;gap:30px}.footer-tagline{font-size:14px}.footer-bottom{flex-direction:column;gap:20px;text-align:center}.legal-links{gap:20px}}
        @media(max-width:480px){.footer-links{grid-template-columns:1fr;gap:30px}.footer-container{padding:50px 20px 24px}.social-links{justify-content:flex-start}}
      `}</style>
    </>
  );
}
