import { useEffect, useMemo, useState } from 'react';
import Icon, { type IconName } from './ui/Icon';

const messages: { icon: IconName; text: string }[] = [
  { icon: 'truck', text: 'توصيل مجاني هاد الأسبوع لكل مدن المغرب' },
  { icon: 'wallet', text: 'الدفع عند الاستلام — تخلّص ملي توصلك السلعة' },
  { icon: 'refresh', text: 'استرجاع مجاني خلال 30 يوم' },
  { icon: 'shield', text: 'ضمان الجودة على كل المنتجات' },
];

interface AnnouncementBarProps {
  variant?: 'marquee' | 'tick';
  /** Tick variant only — ms between vertical slides */
  intervalMs?: number;
}

export default function AnnouncementBar({
  variant = 'marquee',
  intervalMs = 3000,
}: AnnouncementBarProps) {
  const [activeIndex, setActiveIndex] = useState(messages.length);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const tickSlides = useMemo(
    () => [messages[0], messages[3], messages[2], messages[1], messages[0]],
    []
  );

  useEffect(() => {
    if (variant !== 'tick') return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current > 0 ? current - 1 : 0));
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [variant, intervalMs]);

  const handleTickTransitionEnd = () => {
    if (activeIndex !== 0) return;

    setTransitionEnabled(false);
    setActiveIndex(messages.length);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setTransitionEnabled(true));
    });
  };

  if (variant === 'tick') {
    return (
      <div className="announcement-bar announcement-bar--tick" role="region" aria-label="عروض المتجر">
        <div
          className={`announcement-bar__track ${
            transitionEnabled ? '' : 'announcement-bar__track--instant'
          }`}
          style={{ transform: `translate3d(0, calc(-1 * ${activeIndex} * var(--tick-height)), 0)` }}
          onTransitionEnd={handleTickTransitionEnd}
          aria-live="polite"
        >
          {tickSlides.map((message, index) => (
            <p key={`${message.text}-${index}`} className="announcement-bar__slide">
              <Icon name={message.icon} size={15} className="text-accent shrink-0" />
              <span>{message.text}</span>
            </p>
          ))}
        </div>
      </div>
    );
  }

  const loop = [...messages, ...messages];

  return (
    <div className="announcement-bar" role="region" aria-label="عروض المتجر" dir="ltr">
      <div className="announcement-bar__marquee flex overflow-hidden">
        <div className="flex shrink-0 items-center gap-10 whitespace-nowrap py-2 animate-marquee">
          {loop.map((m, i) => (
            <span key={i} className="inline-flex items-center gap-2 font-medium">
              <Icon name={m.icon} size={15} className="text-accent" />
              {m.text}
            </span>
          ))}
        </div>
        <div
          className="flex shrink-0 items-center gap-10 whitespace-nowrap py-2 animate-marquee"
          aria-hidden="true"
        >
          {loop.map((m, i) => (
            <span key={`b-${i}`} className="inline-flex items-center gap-2 font-medium">
              <Icon name={m.icon} size={15} className="text-accent" />
              {m.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
