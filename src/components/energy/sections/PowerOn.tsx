import { CDN_URL } from '@/lib/cdn';

const BG_URL = `${CDN_URL}/energy-home/power-on-bg.webp`;

export default function PowerOn({ lang }: { lang: string }) {
  const texts: Record<string, { title: string; desc: string }> = {
    es: {
      title: 'Del Contrato a Encender el Sistema',
      desc: 'Con medio millón de instalaciones solares hasta la fecha, Ancestro se encarga de todos los detalles por ti, desde el pedido hasta el encendido. Programa una consulta virtual con Ancestro para saber más.',
    },
    en: {
      title: 'Getting to Power On',
      desc: 'With half a million solar installations to date, Ancestro takes care of all the details for you, from order to power on. Schedule a virtual consultation with Ancestro to learn more.',
    },
    pt: {
      title: 'Do Contrato ao Sistema Ligado',
      desc: 'Com meio milhão de instalações solares até hoje, a Ancestro cuida de todos os detalhes para você, do pedido à ativação. Agende uma consulta virtual com a Ancestro para saber mais.',
    },
    zh: {
      title: '从合同到系统启动',
      desc: 'Ancestro 迄今已完成 50 万次太阳能安装，为您处理从订购到启动的所有细节。安排与 Ancestro 的虚拟咨询以了解更多信息。',
    },
    ar: {
      title: 'من العقد إلى تشغيل النظام',
      desc: 'مع نصف مليون تركيب للطاقة الشمسية حتى الآن، تتولى Ancestro جميع التفاصيل نيابة عنك، من الطلب إلى التشغيل. حدد موعد استشارة افتراضية مع Ancestro لمعرفة المزيد.',
    },
  };

  const t = texts[lang] || texts.es;

  return (
    <section className="eh-power-section">
      <div className="eh-power-bg-wrap">
        <img src={BG_URL} alt="" className="eh-power-bgimg" />
        <div className="eh-power-grad" />
      </div>
      <div className="eh-power-text">
        <h2>{t.title}</h2>
        <p>{t.desc}</p>
      </div>
    </section>
  );
}
