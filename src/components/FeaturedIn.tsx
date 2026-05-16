import { t } from '@/i18n/translations';

interface FeaturedInProps { lang: string; }

const USA_NEWS_URL = 'https://usanews.com/newsroom/ancestro.ai-expands-clean-energy-infrastructure-across-latin-america';
const TRUSTPILOT_URL = 'https://www.trustpilot.com/review/ancestro.ai';
const GOOGLE_REVIEWS_URL = 'https://share.google/JTJBNLlqm8J73iW0Y';

function Stars({ filled, total = 5 }: { filled: number; total?: number }) {
  return (
    <div className="stars" aria-label={`${filled} out of ${total} stars`}>
      {Array.from({ length: total }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.5l7.1-.6L12 2z"
            fill={i < filled ? '#00B67A' : 'rgba(255,255,255,0.18)'}
          />
        </svg>
      ))}
    </div>
  );
}

export default function FeaturedIn({ lang }: FeaturedInProps) {
  return (
    <>
      <section className="featured-section" aria-labelledby="featured-heading">
        <div className="featured-header">
          <span className="featured-eyebrow">{t(lang, 'featured.eyebrow')}</span>
          <h2 id="featured-heading" className="featured-title">{t(lang, 'featured.title')}</h2>
        </div>

        <div className="featured-grid">
          <a
            href={USA_NEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="featured-card featured-press"
          >
            <div className="card-top">
              <span className="card-tag">{t(lang, 'featured.press.tag')}</span>
              <span className="card-arrow" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <div className="press-logo">USA NEWS</div>
            <h3 className="card-headline">{t(lang, 'featured.press.headline')}</h3>
            <p className="card-meta">{t(lang, 'featured.press.cta')}</p>
          </a>

          <a
            href={TRUSTPILOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="featured-card featured-trustpilot"
          >
            <div className="card-top">
              <span className="brand-mark trustpilot-mark">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.5l7.1-.6L12 2z" fill="#00B67A" />
                </svg>
                Trustpilot
              </span>
              <span className="card-arrow" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <div className="rating-block">
              <div className="rating-score">4.0</div>
              <Stars filled={4} />
            </div>
            <p className="card-meta">{t(lang, 'featured.trustpilot.label')}</p>
          </a>

          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="featured-card featured-google"
          >
            <div className="card-top">
              <span className="brand-mark google-mark">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.5v2.9h3.9c2.3-2.1 3.5-5.2 3.5-8.6z" />
                  <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-2.9c-1.1.7-2.5 1.1-4 1.1-3.1 0-5.7-2.1-6.7-4.9H1.4v3C3.4 21.3 7.4 24 12 24z" />
                  <path fill="#FBBC05" d="M5.3 14.4c-.2-.7-.4-1.4-.4-2.4s.1-1.7.4-2.4V6.6H1.4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.4l3.9-3z" />
                  <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8L20 3c-2.1-2-4.8-3-7.9-3C7.4 0 3.4 2.7 1.4 6.6l3.9 3C6.3 6.9 8.9 4.8 12 4.8z" />
                </svg>
                Google
              </span>
              <span className="card-arrow" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <div className="rating-block">
              <div className="rating-score">5.0</div>
              <div className="stars" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.5l7.1-.6L12 2z" fill="#FBBC05" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="card-meta">{t(lang, 'featured.google.label')}</p>
          </a>
        </div>
      </section>

      <style>{`
        .featured-section{position:relative;max-width:1797px;margin:0 auto;padding:80px var(--spacing-2xl) 60px}
        .featured-header{display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;margin-bottom:40px}
        .featured-eyebrow{font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--color-primary)}
        .featured-title{font-size:clamp(28px,3vw,44px);font-weight:600;color:#fff;margin:0;line-height:1.15}
        .featured-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:20px}
        .featured-card{position:relative;display:flex;flex-direction:column;justify-content:space-between;gap:24px;min-height:220px;padding:28px;background-color:rgba(20,20,20,0.5);border:1px solid var(--color-white-10);border-radius:14px;text-decoration:none;color:#fff;transition:transform var(--transition-fast),border-color var(--transition-fast),background-color var(--transition-fast);overflow:hidden}
        .featured-card:hover{transform:translateY(-3px);border-color:var(--color-white-20);background-color:rgba(28,28,28,0.7)}
        .card-top{display:flex;align-items:center;justify-content:space-between;gap:12px}
        .card-tag{font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--color-gray);padding:6px 10px;border:1px solid var(--color-white-10);border-radius:999px}
        .card-arrow{display:inline-flex;color:var(--color-gray);transition:color var(--transition-fast),transform var(--transition-fast)}
        .featured-card:hover .card-arrow{color:var(--color-primary);transform:translate(2px,-2px)}
        .brand-mark{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:#fff}
        .trustpilot-mark{color:#00B67A}
        .google-mark{color:#fff}
        .press-logo{font-family:Georgia,'Times New Roman',serif;font-size:clamp(28px,3vw,38px);font-weight:700;letter-spacing:2px;color:#fff;line-height:1}
        .card-headline{font-size:clamp(15px,1.2vw,17px);font-weight:500;color:#fff;margin:0;line-height:1.35;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
        .card-meta{font-size:13px;font-weight:400;color:var(--color-gray);margin:0}
        .rating-block{display:flex;flex-direction:column;gap:8px}
        .rating-score{font-size:clamp(36px,4vw,48px);font-weight:700;color:#fff;line-height:1}
        .stars{display:inline-flex;gap:2px}
        @media(max-width:1100px){.featured-grid{grid-template-columns:1fr 1fr;gap:16px}.featured-press{grid-column:1/-1}}
        @media(max-width:768px){.featured-section{padding:50px var(--spacing-md) 40px}.featured-grid{grid-template-columns:1fr}.featured-press{grid-column:auto}.featured-card{min-height:180px;padding:24px}}
        @media(max-width:480px){.featured-section{padding:32px 12px}.featured-card{padding:20px;min-height:160px;gap:18px}.press-logo{font-size:26px}}
      `}</style>
    </>
  );
}
