import Icon, { type IconName } from './ui/Icon';

export interface TrustStripItem {
  icon: IconName;
  title: string;
  subtitle: string;
}

interface TrustBadgesStripProps {
  items: TrustStripItem[];
  /** section = full-width band; embedded = below product CTA */
  variant?: 'section' | 'embedded';
  className?: string;
}

export default function TrustBadgesStrip({
  items,
  variant = 'section',
  className = '',
}: TrustBadgesStripProps) {
  const isEmbedded = variant === 'embedded';

  return (
    <section
      className={
        isEmbedded
          ? `bg-white rounded-2xl border border-ink/[0.08] py-5 md:py-6 shadow-soft ${className}`
          : `bg-trust-surface border-t border-white/10 py-8 md:py-10 ${className}`
      }
      aria-label="ضمانات الشراء"
    >
      <div className="container-wide">
        <div className="trust-badge-scroll">
          <div className="trust-badge-scroll__track">
            {items.map((item) => (
              <article
                key={item.title}
                className={`trust-badge-card ${isEmbedded ? '' : 'trust-badge-card--on-dark'}`}
              >
                <span className="trust-badge-card__icon">
                  <Icon name={item.icon} size={22} />
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="trust-badge-card__title font-heading font-bold text-ink text-sm md:text-base">
                    {item.title}
                  </p>
                  <p className="trust-badge-card__subtitle text-xs md:text-sm text-ink/55 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
