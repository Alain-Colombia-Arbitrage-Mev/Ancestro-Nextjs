import { t } from '@/i18n/translations';
import { CDN_URL } from '@/lib/cdn';

export default function GridDown({ lang }: { lang: string }) {
  const bgUrl = `${CDN_URL}/energy-home/grid-down-bg.webp`;

  return (
    <section
      className="eh-grid"
      style={{ backgroundImage: `linear-gradient(180deg, transparent 0%, #000 95%), url(${bgUrl})` }}
    >
      <div className="eh-grid-inner">
        <h2 className="eh-grid-title">{t(lang, 'energyHome.gridDown.title')}</h2>
        <p className="eh-grid-desc">{t(lang, 'energyHome.gridDown.desc')}</p>
      </div>
    </section>
  );
}
