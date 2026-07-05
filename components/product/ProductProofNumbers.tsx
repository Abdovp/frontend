import Icon from '../ui/Icon';
import { STORE_PROOF } from '../../lib/products';

const stats = [
  { icon: 'users' as const, value: STORE_PROOF.customers, label: 'عميل راضي' },
  { icon: 'star' as const, value: `${STORE_PROOF.rating}/5`, label: `${STORE_PROOF.reviews} تقييم` },
  { icon: 'truck' as const, value: STORE_PROOF.delivery, label: 'توصيل لكل المغرب' },
  { icon: 'refresh' as const, value: STORE_PROOF.warranty, label: 'ضمان كامل الاسترجاع' },
];

export default function ProductProofNumbers() {
  return (
    <section className="bg-ink text-white py-5" dir="rtl" aria-label="أرقام المتجر">
      <div className="container-wide">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-4 md:divide-x md:divide-x-reverse md:divide-white/10">
          {stats.map((s) => (
            <li key={s.label} className="flex flex-col sm:flex-row items-center sm:justify-center gap-2 sm:gap-3 text-center sm:text-right">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-accent shrink-0">
                <Icon name={s.icon} size={20} />
              </span>
              <div className="leading-tight">
                <p className="font-heading font-extrabold text-lg text-white">{s.value}</p>
                <p className="text-xs text-white/55 mt-0.5">{s.label}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
