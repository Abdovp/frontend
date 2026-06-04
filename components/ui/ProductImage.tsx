import Image from 'next/image';
import ImagePlaceholder from './ImagePlaceholder';

interface ProductImageProps {
  src?: string;
  alt: string;
  fallbackLabel: string;
  fallbackSublabel?: string;
  aspect?: 'square' | 'hero' | 'wide' | 'portrait';
  className?: string;
  priority?: boolean;
}

const aspectClass = {
  square: 'aspect-square',
  hero: 'aspect-[4/5] md:aspect-[4/3] lg:aspect-[16/11]',
  portrait: 'aspect-[4/5]',
  wide: 'aspect-[21/9]',
};

export default function ProductImage({
  src,
  alt,
  fallbackLabel,
  fallbackSublabel,
  aspect = 'square',
  className = '',
  priority = false,
}: ProductImageProps) {
  if (!src) {
    return (
      <ImagePlaceholder
        label={fallbackLabel}
        sublabel={fallbackSublabel}
        aspect={aspect}
        className={className}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectClass[aspect]} ${className}`.trim()}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        className="object-cover object-center"
      />
    </div>
  );
}
