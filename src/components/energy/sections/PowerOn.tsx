import { t } from '@/i18n/translations';
import { CDN_URL } from '@/lib/cdn';

const BG_URL = `${CDN_URL}/energy-home/power-on-bg.webp`;

export default function PowerOn({ lang }: { lang: string }) {
  return (
    <section
      className="eh-power-section"
      style={{ backgroundImage: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.85) 100%), url(${BG_URL})` }}
    >
      <div className="eh-power-text">
        <h2>{t(lang, 'energyHome.powerOn.title')}</h2>
        <p>{t(lang, 'energyHome.powerOn.desc')}</p>
      </div>
    </section>
  );
}
