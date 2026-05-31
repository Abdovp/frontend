import { STORE_PROOF, WARRANTY_DAYS } from '../../lib/products';
import Icon, { type IconName } from '../ui/Icon';

const stats: { icon: IconName; value: string; label: string }[] = [
  { icon: 'badge', value: STORE_PROOF.customers, label: 'زبون راضي' },
  { icon: 'star', value: STORE_PROOF.rating, label: 'متوسط التقييم' },
  { icon: 'truck', value: STORE_PROOF.delivery, label: 'سرعة التوصيل' },
  { icon: 'shield', value: `${WARRANTY_DAYS} يوم`, label: 'ضمان الاسترجاع' },
];

export default function ProofBar() {
  return (
    <section className="bg-white border-b border-ink/[0.06]">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-x-reverse divide-ink/[0.07]">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center justify-center gap-3 py-7 px-4">
              <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-brand/[0.06] text-brand shrink-0">
                <Icon name={s.icon} size={22} />
              </span>
              <div className="leading-tight">
                <p className="font-heading text-xl md:text-2xl font-extrabold text-ink">{s.value}</p>
                <p className="text-xs md:text-sm text-ink/55">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
