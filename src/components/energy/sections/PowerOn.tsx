import { t } from '@/i18n/translations';
import { CDN_URL } from '@/lib/cdn';

export default function PowerOn({ lang }: { lang: string }) {
  const bgUrl = `${CDN_URL}/energy-home/power-on-bg.webp`;

  return (
    <section
      className="eh-power"
      style={{ backgroundImage: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.85) 100%), url(${bgUrl})` }}
    >
      <div className="eh-power-inner">
        <h2 className="eh-power-title">{t(lang, 'energyHome.powerOn.title')}</h2>
        <p className="eh-power-desc">{t(lang, 'energyHome.powerOn.desc')}</p>
      </div>
    </section>
  );
}
