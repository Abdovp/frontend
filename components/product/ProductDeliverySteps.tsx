import Icon from '../ui/Icon';

const steps = [
  {
    number: '01',
    icon: 'cart' as const,
    title: 'اختار المنتج وعمّر بيانتك',
    body: 'اختار العرض المناسب، دخل اسمك ورقم هاتفك',
  },
  {
    number: '02',
    icon: 'phone' as const,
    title: 'كنتصلو بيك باش نأكدو',
    body: 'فريقنا غيتصل بيك ف أسرع وقت باش يأكد معاك الطلب ويعطيك موعد التوصيل.',
  },
  {
    number: '03',
    icon: 'truck' as const,
    title: 'حتى يوصلك عاد خلص',
    body: 'ليفرور كيوصلك ف 24 إلى 48 ساعة. حتى يوصلك عاد خلص.',
  },
];

export default function ProductDeliverySteps() {
  return (
    <section className="section-padding bg-cream section-texture" dir="rtl" aria-labelledby="delivery-steps-heading">
      <div className="container-wide">
        <div className="text-center mb-12">
          <p className="eyebrow mb-3">
            <Icon name="truck" size={14} />
            كيفاش كيخدم
          </p>
          <h2 id="delivery-steps-heading" className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink mb-3">
            3 خطوات وتوصلك السلعة لبابك
          </h2>
          <p className="text-ink max-w-lg mx-auto">
            بلا دفع مسبق، بلا تعقيد — كنوصلو لكل مدن المغرب
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
          {/* Connecting line on desktop */}
          <div
            className="hidden md:block absolute top-10 right-[calc(33.33%+1rem)] left-[calc(33.33%+1rem)] h-px border-t-2 border-dashed border-brand/25"
            aria-hidden="true"
          />

          {steps.map((step) => (
            <div key={step.number} className="card-elevated p-7 text-center relative">
              <div className="flex items-center justify-center mb-5">
                <span className="absolute top-0 right-6 -translate-y-1/2 font-heading font-extrabold text-6xl text-brand/[0.07] select-none leading-none">
                  {step.number}
                </span>
                <div className="relative z-10 inline-flex">
                  <span className="flex items-center justify-center w-16 h-16 rounded-full bg-brand text-white shadow-brand">
                    <Icon name={step.icon} size={28} />
                  </span>
                  <span className="absolute -top-1.5 -end-1.5 w-4 h-4 rounded-full bg-accent border-2 border-white shadow-gold" />
                </div>
              </div>
              <h3 className="font-heading font-bold text-ink text-lg mb-2">{step.title}</h3>
              <p className="text-ink leading-relaxed text-sm">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl py-4 px-6">
          <Icon name="lock" size={20} className="text-emerald-700 shrink-0" />
          <p className="font-bold text-emerald-800 text-sm sm:text-base">
            الدفع عند الاستلام — ما كتخلّص والو قبل ما تعاين المنتج بيدك
          </p>
        </div>
      </div>
    </section>
  );
}
