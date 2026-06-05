import Icon, { type IconName } from './ui/Icon';

export interface TrustStripItem {
  icon: IconName;
  title: string;
  subtitle: string;
}

interface TrustBadgesStripProps {
  items: TrustStripItem[];
  variant?: 'section' | 'header';
  className?: string;
}

export default function TrustBadgesStrip({
  items,
  variant = 'section',
  className = '',
}: TrustBadgesStripProps) {
  const isHeader = variant === 'header';

  return (
    <section
      className={
        isHeader
          ? `header-trust-strip bg-white border-b border-ink/[0.06] py-2.5 md:py-3 ${className}`
          : `bg-white border-t border-ink/[0.06] py-8 md:py-10 ${className}`
      }
      aria-label="ضمانات الشراء"
    >
      <div className="container-wide">
        <div className="trust-badge-scroll">
          <div className="trust-badge-scroll__track">
            {items.map((item) => (
              <article
                key={item.title}
                className={`trust-badge-card ${isHeader ? 'trust-badge-card--header' : ''}`}
              >
                <span className="trust-badge-card__icon">
                  <Icon name={item.icon} size={isHeader ? 18 : 22} />
                </span>
                <div className="min-w-0 leading-tight">
                  <p
                    className={`font-heading font-bold text-ink ${
                      isHeader ? 'text-xs sm:text-sm' : 'text-sm md:text-base'
                    }`}
                  >
                    {item.title}
                  </p>
                  <p
                    className={`text-ink/55 mt-0.5 ${
                      isHeader ? 'text-[0.65rem] sm:text-xs hidden sm:block' : 'text-xs md:text-sm'
                    }`}
                  >
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
