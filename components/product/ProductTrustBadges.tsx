import type { GuaranteeItem } from '../../lib/products';
import Icon from '../ui/Icon';

interface ProductTrustBadgesProps {
  items: GuaranteeItem[];
}

export default function ProductTrustBadges({ items }: ProductTrustBadgesProps) {
  return (
    <section className="bg-white border-t border-ink/[0.06] py-10 md:py-12" aria-label="ضمانات الشراء">
      <div className="container-wide">
        <div className="trust-badge-scroll">
          <div className="trust-badge-scroll__track">
            {items.map((item) => (
              <article key={item.title} className="trust-badge-card">
                <span className="trust-badge-card__icon">
                  <Icon name={item.icon} size={22} />
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="font-heading font-bold text-ink text-sm md:text-base">{item.title}</p>
                  <p className="text-xs md:text-sm text-ink/55 mt-0.5">{item.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
