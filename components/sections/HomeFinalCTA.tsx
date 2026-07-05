import Link from 'next/link';
import Icon, { type IconName } from '../ui/Icon';
import TrustBadgesStrip from '../TrustBadgesStrip';
import { SHARED_GUARANTEES } from '../../lib/products';

const points: { icon: IconName; text: string }[] = [
  { icon: 'truck', text: 'توصيل 24–48 ساعة' },
  { icon: 'wallet', text: 'دفع عند الاستلام' },
  { icon: 'refresh', text: 'استرجاع 30 يوم' },
];

export default function HomeFinalCTA() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand text-white py-16 md:py-20 text-center">
        <div className="absolute inset-0 hero-grid-bg opacity-70" />
        <div className="absolute -top-24 -end-24 w-80 h-80 rounded-full bg-accent/12 blur-[80px]" aria-hidden />
        <div className="absolute -bottom-24 -start-24 w-80 h-80 rounded-full bg-brand-light/40 blur-[80px]" aria-hidden />
        <div className="container-wide relative">
          <h2 className="font-heading text-3xl md:text-5xl font-extrabold mb-4 text-balance">
            بويا شوب — شريكك ف عالم السيارات
          </h2>
          <p className="text-white/75 max-w-2xl mx-auto mb-10 text-lg">
            اختار المنتج اللي يلائم طوموبيلك، واطلب بكل ثقة. الجودة مضمونة، والمخاطرة علينا حنا.
          </p>
          <Link href="/collections" className="btn-gold">
            ادخل للكتالوج
            <Icon name="arrow-left" size={18} />
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 mt-10">
            {points.map((p) => (
              <span key={p.text} className="inline-flex items-center gap-2 text-sm text-white/85 font-medium">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/20 text-accent border border-accent/25">
                  <Icon name={p.icon} size={14} />
                </span>
                {p.text}
              </span>
            ))}
          </div>
        </div>
      </section>
      <TrustBadgesStrip items={SHARED_GUARANTEES} />
    </>
  );
}
