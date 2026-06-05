import Icon from './ui/Icon';
import { STORE_TRUST_ITEMS } from '../lib/store-trust';

type Props = {
  variant?: 'light' | 'dark';
};

export default function StoreTrustRow({ variant = 'light' }: Props) {
  const isLight = variant === 'light';

  return (
    <div
      className={
        isLight
          ? 'store-trust-row store-trust-row--light border-b border-ink/[0.06] bg-white'
          : 'store-trust-row store-trust-row--dark border-b border-white/10'
      }
      aria-label="ضمانات المتجر"
    >
      <div className="container-wide store-trust-row__grid">
        {STORE_TRUST_ITEMS.map((item) => (
          <div key={item.text} className="store-trust-row__item">
            <span
              className={
                isLight
                  ? 'store-trust-row__icon store-trust-row__icon--light'
                  : 'store-trust-row__icon store-trust-row__icon--dark'
              }
            >
              <Icon name={item.icon} size={18} />
            </span>
            <span
              className={
                isLight
                  ? 'text-xs sm:text-sm font-semibold text-ink'
                  : 'text-sm font-semibold text-white/85'
              }
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
