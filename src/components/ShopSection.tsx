import Image from 'next/image';
import { t } from '@/i18n/translations';

interface Product { title: string; description: string; backgroundImage: string; orderHref?: string; learnHref?: string; }
interface ShopSectionProps { lang: string; products: Product[]; }

export default function ShopSection({ lang, products }: ShopSectionProps) {
  return (
    <>
      <section className="shop-section" id="shop">
        <div className="shop-inner">
          {products.map((product, i) => (
            <article key={i} className="product-card">
              <div className="card-inner">
                <div className="product-bg"><Image src={product.backgroundImage} alt={product.title} fill sizes="(max-width: 580px) 100vw, (max-width: 768px) 50vw, 25vw" quality={90} priority={i < 2} /></div>
                <div className="product-shine"></div>
                <div className="product-content">
                  <div className="glass-panel">
                    <div className="product-text">
                      <h3 className="product-title">{product.title}</h3>
                      <p className="product-description">{product.description}</p>
                    </div>
                    <div className="product-actions">
                      <a href={product.orderHref || `/${lang}/join`} className="cta secondary">{t(lang, 'shop.order')}</a>
                      <a href={product.learnHref || `/${lang}/coming-soon`} className="cta primary">{t(lang, 'shop.learn')}</a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <style>{`
        .shop-section{width:100%;max-width:1920px;margin:0 auto}
        .shop-inner{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;width:100%}
        .product-card{width:100%;aspect-ratio:3/4;position:relative;border-radius:20px;border:1px solid rgba(255,255,255,0.1);transition:all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);isolation:isolate;overflow:hidden}
        .product-card:hover{border-color:rgba(248,176,59,0.3);box-shadow:0 20px 60px rgba(0,0,0,0.4),0 0 40px rgba(248,176,59,0.1)}
        .card-inner{position:absolute;inset:0;border-radius:19px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:24px;cursor:pointer}
        .product-bg{position:absolute;inset:0;pointer-events:none;overflow:hidden;transition:transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)}
        .product-bg img{object-fit:cover;transition:all 0.5s ease}
        .product-card:hover .product-bg{transform:scale(1.05)}
        .product-card:hover .product-bg img{filter:brightness(1.1) saturate(1.15)}
        .product-shine{position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.05) 45%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.05) 55%,transparent 60%);transform:translateX(-100%);pointer-events:none;transition:transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94);z-index:1}
        .product-card:hover .product-shine{transform:translateX(100%)}
        .glass-panel{background:rgba(255,255,255,0.08);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.2);border-radius:16px;padding:24px;display:flex;flex-direction:column;gap:20px;transition:all 0.4s cubic-bezier(0.25,0.46,0.45,0.94);box-shadow:0 8px 32px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.2),inset 0 -1px 0 rgba(255,255,255,0.05)}
        .product-card:hover .glass-panel{background:rgba(255,255,255,0.12);border-color:rgba(248,176,59,0.4);box-shadow:0 12px 40px rgba(0,0,0,0.3),0 0 30px rgba(248,176,59,0.15),inset 0 1px 0 rgba(255,255,255,0.25),inset 0 -1px 0 rgba(255,255,255,0.1);transform:translateY(-6px)}
        .product-content{position:relative;z-index:2;max-width:100%}
        .product-text{display:flex;flex-direction:column;gap:10px}
        .product-title{font-size:clamp(20px,2vw,32px);font-weight:700;text-transform:capitalize;color:#fff;transition:all 0.3s ease;text-shadow:0 2px 12px rgba(0,0,0,0.5);letter-spacing:-0.02em;margin:0}
        .product-card:hover .product-title{color:#f8b03b;text-shadow:0 2px 20px rgba(248,176,59,0.5)}
        .product-description{font-size:clamp(12px,1vw,16px);font-weight:400;color:rgba(255,255,255,0.85);line-height:1.5;transition:color 0.3s ease;text-shadow:0 1px 6px rgba(0,0,0,0.4);margin:0}
        .product-card:hover .product-description{color:#fff}
        .product-actions{display:flex;gap:12px;flex-wrap:wrap}
        @media(max-width:1200px){.shop-inner{grid-template-columns:repeat(2,1fr);gap:16px}.product-card{aspect-ratio:4/5;border-radius:16px}.card-inner{border-radius:15px;padding:20px}.glass-panel{padding:20px;gap:16px;border-radius:14px}.product-title{font-size:24px}.product-description{font-size:14px}}
        @media(max-width:768px){.shop-inner{grid-template-columns:repeat(2,1fr);gap:12px}.product-card{aspect-ratio:3/4;border-radius:14px}.card-inner{border-radius:13px;padding:12px}.glass-panel{padding:14px;gap:12px;border-radius:12px}.product-title{font-size:18px}.product-description{font-size:12px;line-height:1.4}.product-actions{gap:8px}.product-actions .cta{padding:8px 12px;font-size:12px;border-radius:10px}}
        @media(max-width:580px){.shop-inner{grid-template-columns:1fr;gap:16px}.product-card{aspect-ratio:16/10;border-radius:16px}.card-inner{border-radius:15px;padding:16px}.glass-panel{padding:16px;gap:12px;border-radius:12px;flex-direction:row;align-items:center;justify-content:space-between}.product-text{gap:6px;flex:1}.product-title{font-size:20px}.product-description{font-size:13px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.product-actions{flex-direction:column;gap:8px;flex-shrink:0}.product-actions .cta{padding:10px 16px;font-size:13px;border-radius:10px;white-space:nowrap}.product-shine{display:none}}
        @media(hover:none){.product-shine{display:none}.product-card:hover .product-bg{transform:none}.product-card:hover .product-bg img{filter:none}.product-card:hover .glass-panel{transform:none;background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.2)}.product-card:hover .product-title{color:#fff}.product-card:hover{border-color:rgba(255,255,255,0.1);box-shadow:none}}
      `}</style>
    </>
  );
}
