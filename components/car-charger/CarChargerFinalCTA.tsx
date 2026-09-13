import Icon from '../ui/Icon';
import { CURRENCY, getFirstOffer, WARRANTY_DAYS, type Product } from '../../lib/products';

const GUARANTEES = [
  { icon: 'wallet' as const, title: 'الدفع عند الاستلام', subtitle: 'تخلّص ملي توصلك السلعة' },
  { icon: 'truck' as const, title: 'توصيل 24–48 ساعة', subtitle: 'لكل مدن المغرب' },
  { icon: 'refresh' as const, title: `ضمان ${WARRANTY_DAYS} يوم`, subtitle: 'فلوسك راجعة بلا أسئلة' },
  { icon: 'whatsapp' as const, title: 'دعم بالدارجة', subtitle: 'فريق مغربي قبل وبعد الطلب' },
];

export default function CarChargerFinalCTA({ product }: { product: Product }) {
  const offer = getFirstOffer(product);

  return (
    <section className="relative overflow-hidden bg-[#05070d] py-14 md:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="absolute -bottom-24 left-1/2 h-80 w-[520px] -translate-x-1/2 rounded-full bg-orange-500/15 blur-[120px]" />
      </div>

      <div className="container-wide relative">
        <div dir="rtl" className="mb-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          {GUARANTEES.map((g) => (
            <div
              key={g.title}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-cyan-300">
                <Icon name={g.icon} size={20} />
              </span>
              <div className="min-w-0">
                <p className="truncate font-heading text-sm font-extrabold text-white">{g.title}</p>
                <p className="truncate text-xs text-white/45">{g.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          dir="rtl"
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-orange-500/15 via-white/[0.03] to-cyan-400/10 p-8 text-center md:p-14"
        >
          <h2 className="mb-3 font-heading text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
            جاهز تخلّص من الخيوط المشابكة نهائياً؟
          </h2>
          <p className="mx-auto mb-7 max-w-xl text-base text-white/65 md:text-lg">
            شاحن 120W ذكي، كابلات قابلة للسحب، وشاشة مراقبة رقمية — كل هذا بـ {offer.price} {CURRENCY} فقط مع دفع عند الاستلام.
          </p>
          <a
            href="#cc-pricing"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-l from-orange-500 to-red-600 px-8 py-4 text-base font-extrabold text-white shadow-[0_15px_45px_-10px_rgba(249,115,22,0.6)] transition-transform hover:scale-[1.03] animate-cta-pulse"
          >
            <Icon name="lock" size={20} />
            اطلب الآن — {offer.price} {CURRENCY}
          </a>
        </div>
      </div>
    </section>
  );
}
