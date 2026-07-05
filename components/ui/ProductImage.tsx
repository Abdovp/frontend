import Image from 'next/image';
import ImagePlaceholder from './ImagePlaceholder';

/* Tiny 8×8 warm-gray SVG used as the blur placeholder while images load.
   Next.js stretches + blurs it automatically via placeholder="blur". */
const BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNlZWVlZWMiLz48L3N2Zz4=';

interface ProductImageProps {
  src?: string;
  alt: string;
  fallbackLabel: string;
  fallbackSublabel?: string;
  aspect?: 'square' | 'hero' | 'wide' | 'portrait' | 'phone';
  /** cover = fill square; contain = full image visible */
  fit?: 'cover' | 'contain' | 'contain-mobile-cover-desktop';
  /** When fit is cover, anchors crop (top helps trim bad edges at bottom) */
  objectPosition?: 'center' | 'top' | 'bottom';
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

const aspectClass = {
  square: 'aspect-square',
  hero: 'aspect-[4/5] md:aspect-[4/3] lg:aspect-[16/11]',
  portrait: 'aspect-[4/5]',
  phone: 'aspect-[9/16]',
  wide: 'aspect-[21/9]',
};

export default function ProductImage({
  src,
  alt,
  fallbackLabel,
  fallbackSublabel,
  aspect = 'square',
  fit = 'cover',
  objectPosition = 'center',
  className = '',
  imageClassName = '',
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

  const objectPosClass =
    objectPosition === 'top'
      ? 'object-top'
      : objectPosition === 'bottom'
        ? 'object-bottom'
        : 'object-center';
  const lgObjectPosClass =
    objectPosition === 'top'
      ? 'lg:object-top'
      : objectPosition === 'bottom'
        ? 'lg:object-bottom'
        : 'lg:object-center';

  const fitClass =
    fit === 'contain'
      ? 'object-contain object-center p-4 sm:p-5'
      : fit === 'contain-mobile-cover-desktop'
        ? `object-contain object-center lg:object-cover ${lgObjectPosClass}`
        : `object-cover ${objectPosClass}`;

  const isGif = src.toLowerCase().endsWith('.gif');

  return (
    <div
      className={`relative overflow-hidden ${aspectClass[aspect]} ${className}`.trim()}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        unoptimized={isGif}
        placeholder={isGif ? 'empty' : 'blur'}
        blurDataURL={isGif ? undefined : BLUR_PLACEHOLDER}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        className={`${fitClass} ${imageClassName}`.trim()}
      />
    </div>
  );
}
