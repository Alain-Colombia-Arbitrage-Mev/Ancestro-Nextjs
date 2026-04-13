import { t } from '@/i18n/translations';

const cards = [
  'energyBiz.switching.card1',
  'energyBiz.switching.card2',
  'energyBiz.switching.card3',
  'energyBiz.switching.card4',
];

export default function SwitchingSimple({ lang }: { lang: string }) {
  return (
    <section className="eb-switching">
      <div className="eb-switching-inner">
        <h2 className="eb-switching-title">{t(lang, 'energyBiz.switching.title')}</h2>
        <p className="eb-switching-sub">{t(lang, 'energyBiz.switching.sub')}</p>
        <div className="eb-switching-grid">
          {cards.map((key, i) => (
            <div key={i} className="eb-switching-card">
              <span className="eb-switching-icon" aria-hidden="true">&#9889;</span>
              <span className="eb-switching-text">{t(lang, key)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
