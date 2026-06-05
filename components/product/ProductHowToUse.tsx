import Icon from '../ui/Icon';
import type { Product } from '../../lib/products';

export default function ProductHowToUse({ product }: { product: Product }) {
  const { howItWorks } = product;

  return (
    <section className="section-padding bg-white" dir="rtl" aria-labelledby="how-to-use-heading">
      <div className="container-wide max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="eyebrow mb-3">
            <Icon name="spark" size={14} />
            {howItWorks.eyebrow ?? 'طريقة الاستعمال'}
          </p>
          <h2
            id="how-to-use-heading"
            className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink mb-3"
          >
            {howItWorks.title}
          </h2>
          <p className="text-ink/60 max-w-xl mx-auto">{howItWorks.body}</p>
        </div>

        {/* Steps */}
        {howItWorks.bullets && (
          <ol className="flex flex-col md:flex-row gap-6 md:gap-4">
            {howItWorks.bullets.map((step, i) => (
              <li
                key={step}
                className="relative flex-1 bg-cream rounded-2xl p-7 flex flex-col gap-4"
              >
                {/* Number badge */}
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-brand text-white font-heading font-extrabold text-xl shrink-0">
                  {i + 1}
                </span>
                {/* Arrow connector — desktop only */}
                {i < (howItWorks.bullets?.length ?? 0) - 1 && (
                  <span
                    className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-6 h-6 rounded-full bg-white border border-ink/10 text-ink/30"
                    aria-hidden
                  >
                    <Icon name="arrow-left" size={14} />
                  </span>
                )}
                <p className="font-bold text-ink leading-snug">{step}</p>
              </li>
            ))}
          </ol>
        )}

        {/* COD reassurance */}
        <div className="mt-10 flex items-center justify-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl py-4 px-6">
          <Icon name="lock" size={20} className="text-emerald-700 shrink-0" />
          <p className="font-bold text-emerald-800 text-sm sm:text-base">
            الدفع عند الاستلام — ما كتخلّص والو حتى توصلك السلعة
          </p>
        </div>
      </div>
    </section>
  );
}
