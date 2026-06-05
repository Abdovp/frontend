import Icon from '../ui/Icon';
import { WARRANTY_DAYS } from '../../lib/products';

const guarantees = [
  {
    icon: 'wallet' as const,
    title: 'الدفع عند الاستلام',
    body: 'كتخلّص غير ملي توصلك السلعة.',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    iconBg: 'bg-emerald-100',
  },
  {
    icon: 'refresh' as const,
    title: `ضمان ${WARRANTY_DAYS} يوم`,
    body: 'ما عجبكش؟ كنرجعو ليك الفلوس.',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100',
  },
  {
    icon: 'truck' as const,
    title: 'توصيل 24–48 ساعة',
    body: 'لكل مدن المغرب. التوصيل مجاني.',
    color: 'text-brand',
    bg: 'bg-brand/[0.04] border-brand/15',
    iconBg: 'bg-brand/10',
  },
  {
    icon: 'whatsapp' as const,
    title: 'دعم بالدارجة',
    body: 'فريق مغربي ف الواتساب قبل و من بعد الطلب.',
    color: 'text-[#25D366]',
    bg: 'bg-[#25D366]/[0.04] border-[#25D366]/20',
    iconBg: 'bg-[#25D366]/10',
  },
];

export default function ProductGuarantees() {
  return (
    <section className="section-padding bg-white" dir="rtl" aria-labelledby="guarantees-heading">
      <div className="container-wide">
        <div className="text-center mb-12">
          <p className="eyebrow mb-3">
            <Icon name="shield" size={14} />
            ضماناتنا
          </p>
          <h2 id="guarantees-heading" className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink mb-3">
            اطلب بكل ثقة
          </h2>
          <p className="text-ink/60 max-w-lg mx-auto">
            ضمانات واضحة — بلا مفاجآت
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {guarantees.map((g) => (
            <div key={g.title} className={`rounded-2xl border p-7 flex flex-col gap-4 ${g.bg}`}>
              <span className={`flex items-center justify-center w-12 h-12 rounded-xl ${g.iconBg} ${g.color} shrink-0`}>
                <Icon name={g.icon} size={24} />
              </span>
              <div>
                <h3 className={`font-heading font-bold text-base mb-1.5 ${g.color}`}>{g.title}</h3>
                <p className="text-ink/70 text-sm leading-relaxed">{g.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
