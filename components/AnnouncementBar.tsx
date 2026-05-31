import Icon from './ui/Icon';

const messages = [
  { icon: 'truck', text: 'توصيل مجاني هاد الأسبوع لكل مدن المغرب' },
  { icon: 'wallet', text: 'الدفع عند الاستلام — تخلّص ملي توصلك السلعة' },
  { icon: 'refresh', text: 'استرجاع مجاني خلال 30 يوم' },
  { icon: 'shield', text: 'ضمان الجودة على كل المنتجات' },
] as const;

export default function AnnouncementBar() {
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
