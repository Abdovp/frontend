import Image from 'next/image';

const BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiMxRTNBNjMiLz48L3N2Zz4=';

export default function HomeHeroGallery() {
  return (
    <div className="relative aspect-[4/5] md:aspect-[4/3] lg:aspect-[16/11] overflow-hidden rounded-3xl border border-white/15 shadow-lift">
      <Image
        src="/images/home-hero-1.webp"
        alt="سائق مغربي مرتاح ف طوموبيلو — بويا شوب"
        fill
        priority
        placeholder="blur"
        blurDataURL={BLUR_PLACEHOLDER}
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover object-center"
      />
    </div>
  );
}
