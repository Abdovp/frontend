import AlternatingSection from '../ui/AlternatingSection';
import ImagePlaceholder from '../ui/ImagePlaceholder';
import SectionHeading from '../ui/SectionHeading';
import Icon from '../ui/Icon';

const steps = [
  { n: '1', title: 'اطلب من الموقع', desc: 'اختار العرض المناسب وعمّر معلوماتك ف أقل من دقيقة.' },
  { n: '2', title: 'تأكيد بالهاتف', desc: 'فريق مغربي كيتصل بيك للتأكيد — هادشي كيرفع نسبة التسليم.' },
  { n: '3', title: 'توصيل + دفع عند الاستلام', desc: 'تستلم الطرد وتخلّص عند الباب. بلا دفع مسبق.' },
];

export default function DeliveryConfirmationSection() {
  return (
    <AlternatingSection
      imageSide="right"
      bg="cream"
      image={<ImagePlaceholder label="توصيل لباب الدار" sublabel="صورة قريباً" aspect="hero" />}
    >
      <SectionHeading
        eyebrow="طلب وتوصيل"
        title="طلب واضح، تأكيد سريع، وتسليم مضمون"
        subtitle="كنأكدو كل طلب باش التوصيل ينجح من أول مرة — خاصة مع الدفع عند الاستلام."
      />
      <div className="space-y-3">
        {steps.map((s) => (
          <div key={s.n} className="flex gap-4 card-flat p-4 items-start">
            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-brand text-white font-heading font-extrabold flex items-center justify-center">
              {s.n}
            </span>
            <div>
              <p className="font-heading font-bold text-ink">{s.title}</p>
              <p className="text-sm text-ink/60 mt-1 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 flex items-center gap-2 text-sm text-ink/55">
        <Icon name="phone" size={16} className="text-brand" />
        نصيحة: جاوب على مكالمة التأكيد باش ما يتأخرش الطرد.
      </p>
    </AlternatingSection>
  );
}
