import { t } from '@/i18n/translations';

export default function FinalCta({ lang }: { lang: string }) {
  return (
    <section className="eh-final">
      <div className="eh-final-inner">
        <h2 className="eh-final-title">{t(lang, 'energyHome.finalCta.title')}</h2>
        <p className="eh-final-desc">{t(lang, 'energyHome.finalCta.desc')}</p>
        <a href={`/${lang}/join`} className="eh-final-cta">{t(lang, 'energyHome.finalCta.cta')}</a>
      </div>
    </section>
  );
}
