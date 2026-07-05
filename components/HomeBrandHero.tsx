import Link from 'next/link';
import Icon from './ui/Icon';
import HomeHeroGallery from './HomeHeroGallery';
import { STORE_PROOF } from '../lib/products';

const heroPoints = [
  { icon: 'wallet', text: 'دفع عند الاستلام' },
  { icon: 'truck', text: 'توصيل 24–48 ساعة' },
  { icon: 'refresh', text: 'ضمان 30 يوم' },
] as const;

export default function HomeBrandHero() {
  return (
    <section className="relative overflow-hidden bg-brand text-white">
      {/* Dot grid texture */}
      <div className="absolute inset-0 hero-grid-bg opacity-70" />

      {/* Decorative blurs — stronger and more dramatic */}
      <div
        className="absolute -top-32 -start-32 w-[28rem] h-[28rem] rounded-full bg-accent/15 blur-[80px]"
        aria-hidden
      />
      <div
        className="absolute -bottom-40 -end-20 w-[36rem] h-[36rem] rounded-full bg-brand-light/50 blur-[100px]"
        aria-hidden
      />
      {/* Central subtle glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[24rem] rounded-full bg-brand-light/20 blur-[120px]"
        aria-hidden
      />

      {/* Bottom gradient fade to connect smoothly with next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-brand/40 to-transparent"
        aria-hidden
      />

      <div className="relative container-wide section-padding">
        <div className="layout-ltr grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Text column */}
          <div dir="rtl" className="text-right order-2 lg:order-1 animate-fade-up">
            <span className="eyebrow-light mb-6">
              <Icon name="badge" size={14} className="text-accent" />
              متجر مغربي متخصص ف إكسسوارات السيارات
            </span>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] mb-5 text-balance">
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
                className="inline-flex items-center justify-center gap-2 font-bold py-4 px-7 rounded-full border-2 border-white/25 text-white transition-all duration-200 hover:bg-white/10 hover:border-white/45 active:scale-[0.97]"
              >
                المنتج الأكثر مبيعاً
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {heroPoints.map((p) => (
                <span key={p.text} className="inline-flex items-center gap-2 text-sm text-white/85 font-medium">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent border border-accent/25">
                    <Icon name={p.icon} size={15} />
                  </span>
                  {p.text}
                </span>
              ))}
            </div>
          </div>

          {/* Image column */}
          <div className="order-1 lg:order-2 animate-fade-up">
            <div className="relative">
              <HomeHeroGallery />

              {/* Floating rating card — stronger with gold accent */}
              <div className="absolute -bottom-5 -start-5 bg-white text-ink rounded-2xl shadow-lift px-5 py-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-ink shadow-gold">
                  <Icon name="star" size={22} />
                </span>
                <div className="leading-tight">
                  <p className="font-heading font-extrabold text-xl text-brand">{STORE_PROOF.rating} / 5</p>
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
