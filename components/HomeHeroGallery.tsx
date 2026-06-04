import Image from 'next/image';

export default function HomeHeroGallery() {
  return (
    <div className="relative aspect-[4/5] md:aspect-[4/3] lg:aspect-[16/11] overflow-hidden rounded-3xl border border-white/15 shadow-lift">
      <Image
        src="/images/home-hero-1.png"
        alt="سائق مغربي مرتاح ف طوموبيلو — بويا شوب"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover object-center"
      />
    </div>
  );
}
