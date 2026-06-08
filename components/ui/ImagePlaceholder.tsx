import Icon from './Icon';

interface ImagePlaceholderProps {
  label: string;
  sublabel?: string;
  aspect?: 'square' | 'hero' | 'wide' | 'portrait' | 'phone';
  className?: string;
}

const aspectClass = {
  square: 'aspect-square',
  hero: 'aspect-[4/5] md:aspect-[4/3] lg:aspect-[16/11]',
  portrait: 'aspect-[4/5]',
  phone: 'aspect-[9/16]',
  wide: 'aspect-[21/9]',
};

export default function ImagePlaceholder({
  label,
  sublabel = 'الصورة قريباً',
  aspect = 'hero',
  className = '',
}: ImagePlaceholderProps) {
  return (
    <div
      className={`image-placeholder relative ${aspectClass[aspect]} ${className}`.trim()}
      aria-label={label}
    >
      <div className="absolute inset-0 hero-grid-bg opacity-[0.5]" />
      <div className="relative text-center px-6">
        <span className="mx-auto mb-3 flex items-center justify-center w-14 h-14 rounded-2xl bg-brand/[0.07] text-brand">
          <Icon name="spark" size={26} className="text-accent" />
        </span>
        <p className="font-heading font-bold text-ink/75">{label}</p>
        <p className="text-sm text-ink/40 mt-1">{sublabel}</p>
      </div>
    </div>
  );
}
