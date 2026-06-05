import Icon from '../ui/Icon';
import ProductImage from '../ui/ProductImage';
import type { Product } from '../../lib/products';

export default function ProductHowToUse({ product }: { product: Product }) {
  const { howToUse } = product;
  const isGif = howToUse.image?.toLowerCase().endsWith('.gif');

  return (
    <section className="section-padding bg-white" aria-labelledby="how-to-use-heading">
      <div className="container-wide max-w-5xl">
        <div className="layout-ltr grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Copy + steps — desktop left */}
          <div dir="rtl" className="text-right order-2 lg:order-1">
            <p className="eyebrow mb-3">
              <Icon name="spark" size={14} />
              طريقة الاستعمال
            </p>
            <h2
              id="how-to-use-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink mb-8 lg:mb-10"
            >
              {howToUse.title}
            </h2>

            <ol className="flex flex-col gap-5 relative">
              {howToUse.steps.map((step, i) => (
                <li key={step.title} className="relative bg-cream rounded-2xl p-6 flex gap-4">
                  <span className="flex items-center justify-center w-11 h-11 rounded-full bg-brand text-white font-heading font-extrabold text-lg shrink-0 shadow-brand">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-ink text-lg mb-1.5">{step.title}</h3>
                    <p className="text-ink/65 leading-relaxed text-sm">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Image — desktop right */}
          {howToUse.image || howToUse.imageLabel ? (
            <div className="order-1 lg:order-2 w-full max-w-sm mx-auto lg:max-w-none lg:sticky lg:top-28">
              <ProductImage
                src={howToUse.image}
                alt={howToUse.imageLabel ?? howToUse.title}
                fallbackLabel={howToUse.imageLabel ?? 'طريقة الاستعمال'}
                fallbackSublabel="الصورة قريباً"
                aspect={isGif ? 'phone' : 'square'}
                fit="cover"
                objectPosition="center"
                className="rounded-2xl shadow-card"
              />
            </div>
          ) : null}
        </div>

        {/* COD note */}
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
