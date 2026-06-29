interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'start' | 'center';
  light?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'start',
  light = false,
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto items-center' : 'text-start items-start';
  const titleColor = light ? 'text-white' : 'text-ink';
  const subColor = light ? 'text-white/70' : 'text-ink';

  return (
    <div className={`flex flex-col max-w-2xl mb-10 ${alignClass}`}>
      {eyebrow && (
        <span className={`${light ? 'eyebrow-light' : 'eyebrow'} mb-5`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`font-heading text-3xl md:text-4xl lg:text-[2.85rem] font-extrabold leading-[1.12] text-balance ${titleColor}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg leading-relaxed font-medium ${subColor}`}>{subtitle}</p>
      )}
    </div>
  );
}
