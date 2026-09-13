import Icon from '../ui/Icon';
import ProductImage from '../ui/ProductImage';
import type { Product } from '../../lib/products';

const SPECS = [
  { icon: 'zap' as const, label: 'القوة الإجمالية', value: '120 واط (Max)' },
  { icon: 'cpu' as const, label: 'منفذ PD', value: '3A — شحن فائق السرعة' },
  { icon: 'cable' as const, label: 'منفذ USB', value: '2.4A' },
  { icon: 'rotate' as const, label: 'طول الكابلات', value: '80 سم قابل للسحب' },
  { icon: 'battery' as const, label: 'مراقبة الفولطاج', value: 'شاشة LED رقمية حية' },
  { icon: 'settings' as const, label: 'زاوية الرأس', value: 'دوران 180 درجة' },
  { icon: 'shield' as const, label: 'الحماية', value: '6 طبقات أمان ذكية' },
  { icon: 'check-circle' as const, label: 'التوافق', value: '12V–24V كل السيارات' },
];

export default function CarChargerSolution({ product }: { product: Product }) {
  const { logic } = product;
  const imageSrc = logic.image ?? product.image;

  return (
    <section className="relative overflow-hidden bg-[#05070d] py-14 md:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="container-wide relative">
        <div className="layout-ltr grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-1">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-2xl">
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
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3.5 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-widest2 text-cyan-300">
                <Icon name="spark" size={13} />
                {logic.eyebrow}
              </p>
            )}
            <h2 className="mb-4 font-heading text-2xl font-extrabold leading-snug text-balance text-white sm:text-3xl md:text-4xl">
              {logic.title}
            </h2>
            <p className="mb-5 text-base leading-relaxed text-white/65 md:text-lg">{logic.body}</p>

            {logic.bullets && (
              <ul className="space-y-3">
                {logic.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-3 font-bold text-white/90">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300">
                      <Icon name="check" size={14} />
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Tech specs table */}
        <div className="mt-14 md:mt-20">
          <h3 dir="rtl" className="mb-6 text-center font-heading text-xl font-extrabold text-white md:text-2xl">
            المواصفات التقنية الكاملة
          </h3>
          <div dir="rtl" className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {SPECS.map((spec) => (
              <div
                key={spec.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center transition-colors hover:border-cyan-400/30"
              >
                <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/15 to-orange-400/10 text-cyan-300">
                  <Icon name={spec.icon} size={19} />
                </span>
                <p className="text-[0.7rem] font-semibold text-white/45">{spec.label}</p>
                <p className="mt-0.5 text-sm font-extrabold text-white">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
