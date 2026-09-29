import Icon from '../ui/Icon';
import ProductImage from '../ui/ProductImage';
import type { Product } from '../../lib/products';

export default function CarChargerSolution({ product }: { product: Product }) {
  const { logic } = product;
  const imageSrc = logic.image ?? product.image;

  return (
    <section className="relative overflow-hidden bg-[#FFFFFF] py-14 md:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#1663D6]/12 blur-[120px]" />
      </div>

      <div className="container-wide relative">
        <div className="layout-ltr grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-1">
            <div className="relative overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-[#EAF2FF] shadow-2xl">
              <ProductImage
                src={imageSrc}
                alt={product.nameAr}
                fallbackLabel={logic.imageLabel}
                fallbackSublabel="الحل"
                aspect="square"
                fit="cover"
              />
            </div>
          </div>

          <div dir="rtl" className="order-2 text-right">
            {logic.eyebrow && (
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#1663D6]/25 bg-[#EAF2FF] px-3.5 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-widest2 text-[#1663D6]">
                <Icon name="spark" size={13} />
                {logic.eyebrow}
              </p>
            )}
            <h2 className="mb-4 font-heading text-2xl font-extrabold leading-snug text-balance text-[#111827] sm:text-3xl md:text-4xl">
              {logic.title}
            </h2>
            <p className="mb-5 text-base leading-relaxed text-[#4B5563] md:text-lg">{logic.body}</p>

            {logic.bullets && (
              <ul className="space-y-3">
                {logic.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-3 font-bold text-[#111827]">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-[#1663D6]">
                      <Icon name="check" size={14} />
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
