import { t } from '@/i18n/translations';

interface FeaturedInProps { lang: string; }

const USA_NEWS_URL = 'https://usanews.com/newsroom/ancestro.ai-expands-clean-energy-infrastructure-across-latin-america';
const TRUSTPILOT_URL = 'https://www.trustpilot.com/review/ancestro.ai';
const GOOGLE_REVIEWS_URL = 'https://share.google/JTJBNLlqm8J73iW0Y';

function Stars({ filled, total = 5, color, size = 20 }: { filled: number; total?: number; color: string; size?: number }) {
  return (
    <div className="stars" aria-label={`${filled} out of ${total} stars`}>
      {Array.from({ length: total }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
          <path
            d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.5l7.1-.6L12 2z"
            fill={i < filled ? color : 'rgba(255,255,255,0.16)'}
          />
        </svg>
      ))}
    </div>
  );
}

function VerifiedBadge({ tone, label }: { tone: 'green' | 'amber'; label: string }) {
  const color = tone === 'green' ? '#00B67A' : '#f8b03b';
  return (
    <span className="verified-badge" style={{ color, borderColor: `${color}40` }}>
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
      </svg>
      {label}
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FeaturedIn({ lang }: FeaturedInProps) {
  return (
    <>
      <section className="featured-section" aria-labelledby="featured-heading">
        <div className="featured-header">
          <span className="featured-eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            {t(lang, 'featured.eyebrow')}
          </span>
          <h2 id="featured-heading" className="featured-title">
            {t(lang, 'featured.title')}
          </h2>
          <p className="featured-dek">{t(lang, 'featured.dek')}</p>
        </div>

        <div className="featured-grid">
          {/* PRESS CARD — USA NEWS */}
          <a
            href={USA_NEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="featured-card featured-press"
          >
            <div className="press-header">
              <span className="press-kicker">
                <span className="kicker-dot" aria-hidden="true" />
                {t(lang, 'featured.press.kicker')}
              </span>
              <span className="press-date">{t(lang, 'featured.press.date')}</span>
            </div>

            <div className="press-wordmark-block">
              <div className="press-wordmark">USA NEWS</div>
              <div className="press-rule" aria-hidden="true" />
            </div>

            <h3 className="press-headline">{t(lang, 'featured.press.headline')}</h3>

            <p className="press-callout">{t(lang, 'featured.press.callout')}</p>

            <span className="card-footer-link">
              {t(lang, 'featured.press.cta')}
              <ArrowIcon />
            </span>
          </a>

          {/* TRUSTPILOT CARD */}
          <a
            href={TRUSTPILOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="featured-card featured-rating"
          >
            <div className="rating-header">
              <span className="brand-mark trustpilot-mark">
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.5l7.1-.6L12 2z" fill="#00B67A" />
                </svg>
                Trustpilot
              </span>
              <VerifiedBadge tone="green" label={t(lang, 'featured.verified')} />
            </div>

            <div className="rating-block">
              <div className="rating-number-row">
                <span className="rating-score">4.0</span>
                <span className="rating-out">/ 5.0</span>
              </div>
              <Stars filled={4} color="#00B67A" size={22} />
              <span className="rating-meta">{t(lang, 'featured.trustpilot.label')}</span>
            </div>

            <span className="card-footer-link">
              {t(lang, 'featured.trustpilot.cta')}
              <ArrowIcon />
            </span>
          </a>

          {/* GOOGLE CARD */}
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="featured-card featured-rating"
          >
            <div className="rating-header">
              <span className="brand-mark google-mark">
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.5v2.9h3.9c2.3-2.1 3.5-5.2 3.5-8.6z" />
                  <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-2.9c-1.1.7-2.5 1.1-4 1.1-3.1 0-5.7-2.1-6.7-4.9H1.4v3C3.4 21.3 7.4 24 12 24z" />
                  <path fill="#FBBC05" d="M5.3 14.4c-.2-.7-.4-1.4-.4-2.4s.1-1.7.4-2.4V6.6H1.4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.4l3.9-3z" />
                  <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8L20 3c-2.1-2-4.8-3-7.9-3C7.4 0 3.4 2.7 1.4 6.6l3.9 3C6.3 6.9 8.9 4.8 12 4.8z" />
                </svg>
                Google Reviews
              </span>
              <VerifiedBadge tone="amber" label={t(lang, 'featured.verified')} />
            </div>

            <div className="rating-block">
              <div className="rating-number-row">
                <span className="rating-score">5.0</span>
                <span className="rating-out">/ 5.0</span>
              </div>
              <Stars filled={5} color="#FBBC05" size={22} />
              <span className="rating-meta">{t(lang, 'featured.google.label')}</span>
            </div>

            <span className="card-footer-link">
              {t(lang, 'featured.google.cta')}
              <ArrowIcon />
            </span>
          </a>
        </div>
      </section>

      <style>{`
        .featured-section{position:relative;max-width:1400px;margin:0 auto;padding:64px var(--spacing-2xl) 48px}
        .featured-header{display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;margin-bottom:32px;max-width:640px;margin-left:auto;margin-right:auto}
        .featured-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#f8b03b}
        .eyebrow-dot{width:5px;height:5px;border-radius:50%;background:#f8b03b;box-shadow:0 0 10px rgba(248,176,59,0.7)}
        .featured-title{font-size:clamp(22px,2.4vw,32px);font-weight:600;color:#fff;margin:0;line-height:1.15;letter-spacing:-0.02em}
        .featured-dek{font-size:13px;color:var(--color-gray);margin:0;max-width:480px;line-height:1.55}

        .featured-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:14px}
        .featured-card{position:relative;display:flex;flex-direction:column;gap:14px;min-height:230px;padding:22px;background:linear-gradient(180deg,rgba(26,26,26,0.6) 0%,rgba(16,16,16,0.6) 100%);border:1px solid var(--color-white-10);border-radius:14px;text-decoration:none;color:#fff;transition:transform var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast);overflow:hidden}
        .featured-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1.5px;background:linear-gradient(90deg,transparent 0%,#f8b03b 50%,transparent 100%);opacity:0;transition:opacity var(--transition-fast)}
        .featured-card:hover{transform:translateY(-2px);border-color:rgba(255,255,255,0.18);box-shadow:0 16px 40px -16px rgba(248,176,59,0.18)}
        .featured-card:hover::before{opacity:1}

        /* PRESS CARD */
        .featured-press{justify-content:space-between}
        .press-header{display:flex;align-items:center;justify-content:space-between;gap:10px}
        .press-kicker{display:inline-flex;align-items:center;gap:6px;font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#f8b03b}
        .kicker-dot{width:4px;height:4px;border-radius:50%;background:#f8b03b}
        .press-date{font-size:10px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.4)}
        .press-wordmark-block{display:flex;flex-direction:column;gap:8px}
        .press-wordmark{font-family:Georgia,'Times New Roman',serif;font-size:clamp(22px,2.2vw,30px);font-weight:700;letter-spacing:2.5px;color:#fff;line-height:0.95}
        .press-rule{height:1px;background:linear-gradient(90deg,#f8b03b 0%,rgba(248,176,59,0.2) 60%,transparent 100%);width:60px}
        .press-headline{font-family:Georgia,'Times New Roman',serif;font-size:clamp(14px,1.15vw,16px);font-weight:500;color:#fff;margin:0;line-height:1.35;letter-spacing:-0.01em}
        .press-callout{font-size:12px;font-weight:400;color:var(--color-gray);margin:0;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}

        /* RATING CARDS */
        .featured-rating{justify-content:space-between}
        .rating-header{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
        .brand-mark{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:#fff;letter-spacing:-0.01em}
        .verified-badge{display:inline-flex;align-items:center;gap:4px;font-size:9px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;padding:3px 7px;border:1px solid;border-radius:999px;background:rgba(255,255,255,0.02)}
        .verified-badge svg{width:10px;height:10px}
        .rating-block{display:flex;flex-direction:column;gap:8px}
        .rating-number-row{display:flex;align-items:baseline;gap:5px}
        .rating-score{font-family:Georgia,'Times New Roman',serif;font-size:clamp(36px,3.8vw,48px);font-weight:600;color:#fff;line-height:0.95;letter-spacing:-0.03em}
        .rating-out{font-size:13px;font-weight:500;color:rgba(255,255,255,0.4);letter-spacing:-0.01em}
        .stars{display:inline-flex;gap:2px}
        .rating-meta{font-size:11px;font-weight:500;color:var(--color-gray);letter-spacing:0.2px;line-height:1.4}

        /* CARD FOOTER LINK */
        .card-footer-link{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:rgba(255,255,255,0.85);letter-spacing:0.2px;transition:color var(--transition-fast),gap var(--transition-fast)}
        .card-footer-link svg{width:12px;height:12px}
        .featured-card:hover .card-footer-link{color:#f8b03b;gap:7px}

        @media(max-width:1100px){
          .featured-grid{grid-template-columns:1fr 1fr;gap:12px}
          .featured-press{grid-column:1/-1;min-height:200px}
          .featured-card{min-height:200px}
        }
        @media(max-width:768px){
          .featured-section{padding:48px var(--spacing-md) 36px}
          .featured-header{margin-bottom:28px}
          .featured-grid{grid-template-columns:1fr}
          .featured-press{grid-column:auto;min-height:auto}
          .featured-card{min-height:auto;padding:20px;gap:12px}
        }
        @media(max-width:480px){
          .featured-section{padding:32px 14px 24px}
          .featured-card{padding:18px;gap:10px}
          .press-wordmark{font-size:22px;letter-spacing:2px}
          .rating-score{font-size:38px}
        }
      `}</style>
    </>
  );
}
