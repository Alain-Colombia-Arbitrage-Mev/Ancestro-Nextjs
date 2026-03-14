import Image from 'next/image';

interface InfoSectionProps {
  title: string;
  subtitle: string;
  ctaVariant?: 'primary' | 'secondary';
  ctaText: string;
  imageUrl: string;
}

export default function InfoSection({ title, subtitle, ctaVariant = 'secondary', ctaText, imageUrl }: InfoSectionProps) {
  return (
    <>
      <div className="info-section">
        <div className="info-content">
          <div className="info-text">
            <h3 className="info-title">{title}</h3>
            <p className="info-subtitle">{subtitle}</p>
          </div>
          <div className="info-cta">
            <a href="#" className={`cta ${ctaVariant}`}>{ctaText}</a>
          </div>
        </div>
        <div className="info-image">
          <Image src={imageUrl} alt="" fill sizes="(max-width: 1024px) 180px, 289px" style={{ objectFit: 'cover' }} />
        </div>
      </div>

      <style>{`
        .info-section{display:flex;align-items:center;gap:30px;padding:30px;background-color:rgba(0,0,0,0.1);backdrop-filter:blur(15px);-webkit-backdrop-filter:blur(15px);border:1px solid var(--color-white-20);border-radius:10px;width:100%}
        .info-content{display:flex;flex-direction:column;gap:30px;flex:1;min-width:0}
        .info-text{display:flex;flex-direction:column;gap:20px}
        .info-title{font-size:clamp(24px,2.5vw,34px);font-weight:600;text-transform:capitalize;color:var(--color-white)}
        .info-subtitle{font-size:clamp(16px,1.5vw,20px);font-weight:400;color:var(--color-gray)}
        .info-cta{display:flex;align-items:center}
        .info-image{width:clamp(200px,25vw,289px);height:clamp(230px,28vw,329px);border-radius:10px;overflow:hidden;flex-shrink:0;position:relative}
        .info-image img{object-fit:cover}
        @media(max-width:1024px){.info-section{padding:20px;gap:20px}.info-image{width:180px;height:220px}}
        @media(max-width:600px){.info-section{flex-direction:column;padding:20px}.info-image{width:100%;height:200px}}
      `}</style>
    </>
  );
}
