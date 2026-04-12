import { t } from '@/i18n/translations';

const cards = [
  'energyHome.switching.card1',
  'energyHome.switching.card2',
  'energyHome.switching.card3',
  'energyHome.switching.card4',
];

export default function SwitchAncestro({ lang }: { lang: string }) {
  return (
    <section className="eh-switch">
      <div className="eh-switch-inner">
        <h2 className="eh-switch-title">{t(lang, 'energyHome.switching.title')}</h2>
        <div className="eh-switch-grid">
          {cards.map((key, i) => (
            <div key={i} className="eh-switch-card">
              <span className="eh-switch-text">{t(lang, key)}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .eh-switch{position:relative;z-index:10;margin-top:-200px;padding:0 40px 0}
        .eh-switch-inner{max-width:1280px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:40px}
        .eh-switch-title{font-size:34px;font-weight:600;color:#fff;text-align:center;margin:0}
        .eh-switch-grid{display:flex;gap:24px;width:100%}
        .eh-switch-card{flex:1;padding:20px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:12px;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);display:flex;align-items:center;justify-content:center;text-align:center;min-height:100px;transition:all .3s ease;cursor:pointer}
        .eh-switch-card:hover{border-color:rgba(248,176,59,.4);transform:translateY(-2px);background:rgba(255,255,255,.08)}
        .eh-switch-text{font-size:24px;font-weight:500;color:#fff;white-space:pre-line;line-height:1.4}
        @media(max-width:1024px){
          .eh-switch{margin-top:-160px;padding:0 40px}
          .eh-switch-grid{flex-wrap:wrap;gap:20px}
          .eh-switch-card{flex:1 1 calc(50% - 10px);min-width:200px}
          .eh-switch-title{font-size:28px}
          .eh-switch-text{font-size:20px}
        }
        @media(max-width:768px){
          .eh-switch{margin-top:-120px;padding:0 40px}
          .eh-switch-title{font-size:24px}
          .eh-switch-text{font-size:18px}
        }
        @media(max-width:480px){
          .eh-switch{margin-top:-100px;padding:0 24px}
          .eh-switch-grid{flex-direction:column;gap:16px}
          .eh-switch-card{min-width:0}
          .eh-switch-title{font-size:24px}
          .eh-switch-text{font-size:18px}
        }
      `}</style>
    </section>
  );
}
