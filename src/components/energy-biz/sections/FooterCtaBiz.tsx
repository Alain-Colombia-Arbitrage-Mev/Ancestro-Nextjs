import { t } from '@/i18n/translations';

export default function FooterCtaBiz({ lang }: { lang: string }) {
  return (
    <section className="eb-cta">
      <div className="eb-cta-inner">
        <h2 className="eb-cta-title">{t(lang, 'energyBiz.cta.title')}</h2>
        <p className="eb-cta-desc">{t(lang, 'energyBiz.cta.desc')}</p>
        <a href={`/${lang}/join`} className="eb-cta-button" style={{textDecoration:'none'}}>{t(lang, 'energyBiz.cta.button')}</a>
      </div>
    </section>
  );
}
