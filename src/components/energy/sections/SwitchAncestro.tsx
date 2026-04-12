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
    </section>
  );
}
