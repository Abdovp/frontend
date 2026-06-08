import Icon from './ui/Icon';
import { STORE_TRUST_BADGES } from '../lib/products';

type Props = {
  className?: string;
};

export default function StoreTrustBand({ className = '' }: Props) {
  return (
    <section
      className={`store-trust-band bg-trust-surface rounded-2xl shadow-soft p-6 sm:p-8 md:p-10 ${className}`}
      aria-label="ضمانات المتجر"
      dir="rtl"
    >
      <div className="overflow-x-auto hide-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
        <ul className="flex md:grid md:grid-cols-4 gap-8 sm:gap-6 w-max md:w-full items-center justify-between">
          {STORE_TRUST_BADGES.map((item) => (
            <li 
              key={item.title} 
              className="flex items-center gap-4 w-[240px] md:w-auto min-w-0 group cursor-default"
            >
              <span className="flex items-center justify-center shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 text-accent transition-all duration-300 group-hover:scale-105 group-hover:bg-white/10" aria-hidden>
                <Icon name={item.icon} size={26} className="opacity-90" />
              </span>
              <span>
                <span className="block font-heading font-extrabold text-base sm:text-lg text-white leading-snug mb-1">{item.title}</span>
                <span className="block text-sm text-white/60 font-medium">{item.subtitle}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
