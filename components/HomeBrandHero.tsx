import Link from 'next/link';
import ImagePlaceholder from './ui/ImagePlaceholder';
import Icon from './ui/Icon';
import { STORE_PROOF } from '../lib/products';

const heroPoints = [
  { icon: 'wallet', text: 'دفع عند الاستلام' },
  { icon: 'truck', text: 'توصيل 24–48 ساعة' },
  { icon: 'refresh', text: 'استرجاع 30 يوم' },
] as const;

export default function HomeBrandHero() {
  return (
    <section className="relative overflow-hidden bg-brand text-white">
      <div className="absolute inset-0 hero-grid-bg opacity-60" />
      <div
        className="absolute -top-24 -start-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-32 -end-16 w-[28rem] h-[28rem] rounded-full bg-brand-light/40 blur-3xl"
        aria-hidden
      />

      <div className="relative container-wide section-padding">
        <div className="layout-ltr grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div dir="rtl" className="text-right order-2 lg:order-1 animate-fade-up">
            <span className="pill-soft bg-white/10 text-white border-white/15 mb-6">
              <Icon name="badge" size={16} className="text-accent" />
              متجر مغربي متخصص ف إكسسوارات السيارات
            </span>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.1] mb-5 text-balance">
              إكسسوارات سيارات تستحق طوموبيلك —
              <span className="text-accent"> مختارة بعناية، مضمونة بثقة.</span>
            </h1>

            <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-xl">
              ماشي متجر كيبيع أي شي. بويا شوب كيختار ليك منتجات السيارات اللي خدامة فعلاً —
              جودة مفحوصة، أسعار واضحة، ودعم مغربي بالدارجة قبل وبعد الطلب.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-9">
              <Link href="/collections" className="btn-gold">
                تسوّق الكتالوج
                <Icon name="arrow-left" size={18} />
              </Link>
              <Link
                href="/product/pack"
                className="inline-flex items-center justify-center gap-2 font-bold py-4 px-7 rounded-full border border-white/25 text-white hover:bg-white/10 transition"
              >
                المنتج الأكثر مبيعاً
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {heroPoints.map((p) => (
                <span key={p.text} className="inline-flex items-center gap-2 text-sm text-white/85 font-medium">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-accent">
                    <Icon name={p.icon} size={16} />
                  </span>
                  {p.text}
                </span>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 animate-fade-up">
            <div className="relative">
              <ImagePlaceholder
                label="بويا شوب — إكسسوارات السيارات"
                sublabel="صورة الواجهة قريباً"
                aspect="hero"
                className="!border-white/15 !bg-white/[0.06] shadow-lift [&_p]:!text-white/90"
              />
              <div className="absolute -bottom-5 -start-5 bg-white text-ink rounded-2xl shadow-lift px-5 py-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-accent/15 text-accent">
                  <Icon name="star" size={22} />
                </span>
                <div className="leading-tight">
                  <p className="font-heading font-extrabold text-lg">{STORE_PROOF.rating} / 5</p>
                  <p className="text-xs text-ink/55">{STORE_PROOF.reviews} تقييم موثّق</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
