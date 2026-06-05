import Icon from '../ui/Icon';
import { WARRANTY_DAYS } from '../../lib/products';

const guarantees = [
  {
    icon: 'wallet' as const,
    title: 'الدفع عند الاستلام',
    body: 'ما كتخلّص والو قبل. تعاين السلعة بيدك، وإلا ما عجبتكش ترجعها ف الحين.',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    iconBg: 'bg-emerald-100',
  },
  {
    icon: 'refresh' as const,
    title: `ضمان ${WARRANTY_DAYS} يوم كامل`,
    body: 'أي مشكل ف أي سبب خلال 30 يوم — كنرجعو ليك فلوسك كاملين بلا أسئلة وبلا تعقيد.',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100',
  },
  {
    icon: 'truck' as const,
    title: 'توصيل 24–48 ساعة',
    body: 'كنوصلو لكل مدن المغرب — من كازا لأكادير، من طنجة لوجدة. التوصيل مجاني.',
    color: 'text-brand',
    bg: 'bg-brand/[0.04] border-brand/15',
    iconBg: 'bg-brand/10',
  },
  {
    icon: 'whatsapp' as const,
    title: 'دعم بالدارجة',
    body: 'فريق مغربي كيجاوب ف الواتساب قبل وبعد الطلب — ما غاديش تبقى لوحدك مع أي سؤال.',
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
            اطلب بكل ثقة — محمي من كل الجهات
          </h2>
          <p className="text-ink/60 max-w-lg mx-auto">
            بويا شوب بنا ثقة آلاف الزبناء المغاربة على هاد الضمانات
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
