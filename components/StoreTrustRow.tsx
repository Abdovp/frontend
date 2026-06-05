import Icon from './ui/Icon';
import { STORE_TRUST_ITEMS } from '../lib/store-trust';

export default function StoreTrustRow() {
  return (
    <div
      className="store-trust-row border-t border-ink/[0.06] bg-white"
      aria-label="ضمانات المتجر"
    >
      <div className="container-wide store-trust-row__grid">
        {STORE_TRUST_ITEMS.map((item) => (
          <div key={item.text} className="store-trust-row__item">
            <span className="store-trust-row__icon">
              <Icon name={item.icon} size={20} />
            </span>
            <span className="text-xs sm:text-sm font-semibold text-ink">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
