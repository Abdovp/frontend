import Icon from './ui/Icon';
import { STORE_TRUST_ITEMS } from '../lib/store-trust';

export default function StoreTrustRow() {
  return (
    <section
      className="store-trust-row bg-white border-t border-ink/[0.06]"
      aria-label="ضمانات المتجر"
      dir="rtl"
    >
      <div className="container-wide">
        <ul className="store-trust-row__grid">
          {STORE_TRUST_ITEMS.map((item) => (
            <li key={item.text} className="store-trust-row__item">
              <span className="store-trust-row__icon" aria-hidden>
                <Icon name={item.icon} size={22} />
              </span>
              <span className="store-trust-row__label">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
