import Icon from '../ui/Icon';
import type { Product } from '../../lib/products';

export default function CarChargerHowTo({ product }: { product: Product }) {
  const { howToUse } = product;

  return (
    <section className="relative overflow-hidden bg-[#F1F3F5] py-14 md:py-20">
      <div className="container-wide relative">
        <h2 dir="rtl" className="mb-10 text-center font-heading text-2xl font-extrabold text-[#111827] sm:text-3xl md:text-4xl">
          {howToUse.title}
        </h2>

        {howToUse.image && (
          <div className="relative mb-10 overflow-hidden rounded-[2rem] border border-[#E5E7EB] shadow-2xl">
            <img src={howToUse.image} alt={howToUse.imageLabel ?? howToUse.title} className="block h-auto w-full" />
          </div>
        )}

        <div dir="rtl" className="grid gap-5 md:grid-cols-3 md:gap-6">
          {howToUse.steps.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-6 text-right transition-colors hover:border-[#1663D6]/35"
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#1663D6] text-lg font-extrabold text-white shadow-lg shadow-[#1663D6]/30">
                {i + 1}
              </span>
              <h3 className="mb-2 font-heading text-lg font-extrabold text-[#111827]">{step.title}</h3>
              <p className="text-sm leading-relaxed text-[#4B5563]">{step.body}</p>
            </div>
          ))}
        </div>

        {/* Delivery mini-steps */}
        <div dir="rtl" className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: 'cart' as const, title: 'اطلب ف دقيقة', text: 'اختار العرض وعمّر معلوماتك' },
            { icon: 'whatsapp' as const, title: 'تأكيد سريع', text: 'كنأكدو معاك بالهاتف أو واتساب' },
            { icon: 'truck' as const, title: 'توصيل + دفع', text: 'تخلّص فقط عند استلام الطرد' },
          ].map((s) => (
            <div key={s.title} className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1663D6]">
                <Icon name={s.icon} size={20} />
              </span>
              <div>
                <p className="font-heading font-extrabold text-[#111827]">{s.title}</p>
                <p className="text-xs text-[#6B7280]">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
