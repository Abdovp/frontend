import SectionHeading from '../ui/SectionHeading';
import Icon from '../ui/Icon';

const steps = [
  { n: '1', title: 'اطلب من الموقع', desc: 'اختار العرض المناسب وعمّر معلوماتك ف أقل من دقيقة.' },
  { n: '2', title: 'تأكيد بالهاتف', desc: 'فريق مغربي كيتصل بيك للتأكيد — هادشي كيرفع نسبة التسليم.' },
  { n: '3', title: 'توصيل + دفع عند الاستلام', desc: 'تستلم الطرد وتخلّص عند الباب. بلا دفع مسبق.' },
];

export default function DeliveryConfirmationSection() {
  return (
    <section className="section-padding bg-cream section-texture">
      <div className="container mx-auto max-w-3xl px-4 md:px-8">
        <SectionHeading
          eyebrow="طلب وتوصيل"
          title="طلب واضح، تأكيد سريع، وتسليم مضمون"
          subtitle="كنأكدو كل طلب باش التوصيل ينجح من أول مرة — خاصة مع الدفع عند الاستلام."
        />
        <div className="space-y-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              {/* Connector line between steps */}
              {i < steps.length - 1 && (
                <span className="absolute top-[3.25rem] right-[1.75rem] w-px h-[calc(100%+1rem)] bg-brand/15" aria-hidden />
              )}
              <div className="card-elevated p-5 flex gap-4 items-start">
                <span className="relative z-10 flex-shrink-0 w-14 h-14 rounded-2xl bg-brand text-white font-heading font-extrabold text-xl flex items-center justify-center shadow-brand">
                  {s.n}
                  <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-accent border-2 border-white" />
                </span>
                <div className="pt-1">
                  <p className="font-heading font-bold text-ink text-lg">{s.title}</p>
                  <p className="text-ink/65 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-7 flex items-center gap-2 text-sm text-ink/55">
          <Icon name="phone" size={16} className="text-brand" />
          نصيحة: جاوب على مكالمة التأكيد باش ما يتأخرش الطرد.
        </p>
      </div>
    </section>
  );
}
