import Link from 'next/link';
import Icon, { Stars } from './ui/Icon';
import { STORE_PROOF } from '../lib/products';

const testimonials = [
  {
    name: 'حسن المرابط',
    city: 'الدار البيضاء',
    text: 'بويا شوب كيبان متخصص فعلاً ف السيارات. التوصيل سريع والتأكيد بالواتساب محترف — حسّيت براحة البال.',
  },
  {
    name: 'إيمان بنشقرون',
    city: 'طنجة',
    text: 'خدمة زوينة ومنتجات كتبان جادة. ما بقيتش نخمّم بزاف فالشراء أونلاين للطوموبيل.',
  },
  {
    name: 'عمر السعدي',
    city: 'مكناس',
    text: 'الضمان 30 يوم والدفع عند الاستلام هو اللي خلاني نثق ونعاود نطلب مرة أخرى.',
  },
  {
    name: 'ليلى الزاكي',
    city: 'أكادير',
    text: 'كنت كنقلب على متجر كيفهم السائق المغربي. بويا شوب قريب لينا فاللغة وفالخدمة.',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <span className="eyebrow mb-4 justify-center">
            <span className="w-6 h-px bg-current opacity-60" />
            آراء الزبناء
          </span>
          <h2 className="font-heading text-3xl md:text-[2.6rem] font-extrabold text-ink leading-tight">
            +{STORE_PROOF.customers.replace('+', '')} سائق مغربي وثقو ف بويا شوب
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4 text-ink/60">
            <Stars value={4.9} size={18} />
            <span className="font-semibold text-ink">{STORE_PROOF.rating}</span>
            <span>·</span>
            <span>{STORE_PROOF.reviews} تقييم موثّق</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card-elevated p-6 flex flex-col">
              <Icon name="quote" size={28} className="text-accent mb-3" />
              <p className="text-ink leading-relaxed mb-5 flex-1">{t.text}</p>
              <div className="flex items-center justify-between border-t border-ink/[0.07] pt-4">
                <div>
                  <p className="font-bold text-ink">{t.name}</p>
                  <p className="text-sm text-ink/50">{t.city}</p>
                </div>
                <Stars value={5} size={13} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
