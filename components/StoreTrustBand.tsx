import Icon from './ui/Icon';
import { STORE_TRUST_BAND } from '../lib/products';

type Props = {
  className?: string;
};

export default function StoreTrustBand({ className = '' }: Props) {
  return (
    <section
      className={`store-trust-band bg-trust-surface rounded-none sm:rounded-2xl shadow-soft -mx-4 px-4 py-6 sm:mx-0 sm:px-8 sm:py-8 md:p-10 ${className}`}
      aria-label="ضمانات المتجر"
      dir="rtl"
    >
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-start">
        {STORE_TRUST_BAND.map((item) => (
          <li 
            key={item.text} 
            className="flex items-center gap-3 sm:gap-4 min-w-0 group cursor-default"
          >
            <span className="flex items-center justify-center shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl bg-white/[0.08] border border-white/[0.15] text-accent transition-all duration-300 group-hover:scale-105 group-hover:bg-white/[0.14] group-hover:border-accent/30" aria-hidden>
              <Icon name={item.icon} size={24} className="opacity-90 sm:w-6 sm:h-6 lg:w-[26px] lg:h-[26px]" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-heading font-extrabold text-sm sm:text-base lg:text-lg text-white leading-tight mb-0.5 sm:mb-1">{item.text}</span>
              <span className="block text-xs sm:text-sm text-white/60 font-medium leading-tight">{item.sub}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
