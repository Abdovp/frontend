import Icon, { type IconName } from './ui/Icon';

export interface TrustStripItem {
  icon: IconName;
  title: string;
  subtitle: string;
}

interface TrustBadgesStripProps {
  items: TrustStripItem[];
  className?: string;
}

export default function TrustBadgesStrip({ items, className = '' }: TrustBadgesStripProps) {
  return (
    <section
      className={`bg-white border-t border-ink/[0.06] py-8 md:py-10 ${className}`}
      aria-label="ضمانات الشراء"
    >
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
