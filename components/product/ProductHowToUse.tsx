import Icon from '../ui/Icon';
import ProductImage from '../ui/ProductImage';
import type { Product } from '../../lib/products';

function HowToUseSteps({
  steps,
  layout,
}: {
  steps: Product['howToUse']['steps'];
  layout: 'row' | 'column';
}) {
  return (
    <ol
      dir="rtl"
      className={
        layout === 'row'
          ? 'flex flex-col md:flex-row gap-6 relative'
          : 'flex flex-col gap-5 relative'
      }
    >
      {steps.map((step, i) => (
        <li
          key={step.title}
          className={`relative bg-cream rounded-2xl text-right flex flex-col gap-4 ${
            layout === 'row' ? 'p-7 flex-1' : 'p-6 flex-row items-start gap-4'
          }`}
        >
          {layout === 'row' && i < steps.length - 1 ? (
            <span
              className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-6 h-6 rounded-full bg-white border border-ink/10 text-ink/30 shadow-soft"
              aria-hidden
            >
              <Icon name="arrow-left" size={14} />
            </span>
          ) : null}
          <span
            className={`flex items-center justify-center rounded-full bg-brand text-white font-heading font-extrabold shrink-0 shadow-brand ${
              layout === 'row' ? 'w-12 h-12 text-xl' : 'w-11 h-11 text-lg'
            }`}
          >
            {i + 1}
          </span>
          <div>
            <h3 className="font-heading font-bold text-ink text-lg mb-1.5">{step.title}</h3>
            <p className="text-ink leading-relaxed text-sm">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function ProductHowToUse({ product }: { product: Product }) {
  const { howToUse } = product;
  const hasImage = !!(howToUse.image || howToUse.imageLabel);

  return (
    <section className="section-padding bg-white" aria-labelledby="how-to-use-heading">
      <div className={`container-wide ${hasImage ? 'max-w-5xl' : 'max-w-4xl'}`}>
        {hasImage ? (
          <div className="layout-ltr grid lg:grid-cols-2 gap-10 lg:gap-16 items-start lg:items-stretch">
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
              <HowToUseSteps steps={howToUse.steps} layout="column" />
            </div>

            <div className="order-1 lg:order-2 w-full max-w-sm mx-auto lg:max-w-none lg:h-full lg:min-h-0">
              <ProductImage
                src={howToUse.image}
                alt={howToUse.imageLabel ?? howToUse.title}
                fallbackLabel={howToUse.imageLabel ?? 'طريقة الاستعمال'}
                fallbackSublabel="الصورة قريباً"
                aspect="square"
                fit="contain"
                objectPosition="center"
                className="rounded-2xl shadow-card bg-white lg:aspect-auto lg:h-full group"
              imageClassName="group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>
        ) : (
          <>
            <div dir="rtl" className="text-center mb-12">
              <p className="eyebrow mb-3 justify-center">
                <Icon name="spark" size={14} />
                طريقة الاستعمال
              </p>
              <h2
                id="how-to-use-heading"
                className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink"
              >
                {howToUse.title}
              </h2>
            </div>
            <HowToUseSteps steps={howToUse.steps} layout="row" />
          </>
        )}

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
