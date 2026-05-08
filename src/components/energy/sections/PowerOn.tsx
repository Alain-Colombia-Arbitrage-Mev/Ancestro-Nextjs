import { t } from '@/i18n/translations';
import { bgUrl } from '../cdn';

const BG_URL = bgUrl('power-on-bg.webp');

export default function PowerOn({ lang }: { lang: string }) {
  return (
    <section
      className="eh-power-section"
      style={{ backgroundImage: `url(${BG_URL})` }}
    >
      <div className="eh-power-gradient" aria-hidden />
      <div className="eh-power-inner">
        <h2 className="eh-power-title">{t(lang, 'energyHome.powerOn.title')}</h2>
        <p className="eh-power-desc">{t(lang, 'energyHome.powerOn.desc')}</p>
      </div>
    </section>
  );
}
