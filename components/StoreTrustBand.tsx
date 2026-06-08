import Icon from './ui/Icon';
import { STORE_TRUST_BAND } from '../lib/products';

type Props = {
  className?: string;
};

export default function StoreTrustBand({ className = '' }: Props) {
  return (
    <section
      className={`store-trust-band bg-trust-surface border border-white/10 rounded-2xl shadow-soft ${className}`}
      aria-label="ضمانات المتجر"
      dir="rtl"
    >
      <ul className="store-trust-band__grid">
        {STORE_TRUST_BAND.map((item) => (
          <li key={item.text} className="store-trust-band__item">
            <span className="store-trust-band__icon" aria-hidden>
              <Icon name={item.icon} size={20} />
            </span>
            <span>
              <span className="store-trust-band__label">{item.text}</span>
              <span className="block text-xs text-white/55 font-medium mt-0.5">{item.sub}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
