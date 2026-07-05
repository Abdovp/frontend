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
    <section className="bg-white border-b border-ink/[0.06] border-t-[3px] border-t-accent">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-x-reverse divide-ink/[0.07]">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-center gap-3.5 py-7 px-4 transition-colors duration-200 hover:bg-brand/[0.015]"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-brand text-white shrink-0 shadow-brand">
                <Icon name={s.icon} size={22} className="text-accent" />
              </span>
              <div className="leading-tight">
                <p className="font-heading text-xl md:text-2xl font-extrabold text-brand">{s.value}</p>
                <p className="text-xs md:text-sm text-ink/55 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
