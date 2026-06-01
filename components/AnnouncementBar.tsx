import { useEffect, useState } from 'react';
import Icon, { type IconName } from './ui/Icon';

const messages: { icon: IconName; text: string }[] = [
  { icon: 'truck', text: 'توصيل مجاني هاد الأسبوع لكل مدن المغرب' },
  { icon: 'wallet', text: 'الدفع عند الاستلام — تخلّص ملي توصلك السلعة' },
  { icon: 'refresh', text: 'استرجاع مجاني خلال 30 يوم' },
  { icon: 'shield', text: 'ضمان الجودة على كل المنتجات' },
];

interface AnnouncementBarProps {
  variant?: 'marquee' | 'tick';
}

export default function AnnouncementBar({ variant = 'marquee' }: AnnouncementBarProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (variant !== 'tick' || activeIndex >= messages.length - 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => Math.min(current + 1, messages.length - 1));
    }, 2000);

    return () => window.clearInterval(timer);
  }, [variant, activeIndex]);

  if (variant === 'tick') {
    return (
      <div className="announcement-bar announcement-bar--tick" role="region" aria-label="عروض المتجر">
        <div
          className="announcement-bar__track"
          style={{ transform: `translateY(calc(-1 * ${activeIndex} * var(--tick-height)))` }}
          aria-live="polite"
        >
          {messages.map((message) => (
            <p key={message.text} className="announcement-bar__slide">
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
    <div className="announcement-bar" role="region" aria-label="عروض المتجر">
      <div className="flex overflow-hidden">
        <div className="flex shrink-0 items-center gap-10 whitespace-nowrap py-2 animate-marquee">
          {loop.map((m, i) => (
            <span key={i} className="inline-flex items-center gap-2 font-medium">
              <Icon name={m.icon} size={15} className="text-accent" />
              {m.text}
            </span>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-10 whitespace-nowrap py-2 animate-marquee" aria-hidden="true">
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
