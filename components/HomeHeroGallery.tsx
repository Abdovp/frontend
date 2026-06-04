import Image from 'next/image';
import { useEffect, useState } from 'react';

const slides = [
  {
    src: '/images/home-hero-1.png',
    alt: 'سائق مغربي مرتاح ف طوموبيلو — بويا شوب',
  },
  {
    src: '/images/home-hero-2.png',
    alt: 'سائق سعيد ف طوموبيلو — بويا شوب',
  },
] as const;

export default function HomeHeroGallery() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative aspect-[4/5] md:aspect-[4/3] lg:aspect-[16/11] overflow-hidden rounded-3xl border border-white/15 shadow-lift">
      {slides.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={index === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover object-center transition-opacity duration-700 ease-in-out ${
            index === active ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`صورة ${index + 1}`}
            onClick={() => setActive(index)}
            className={`h-2 rounded-full transition-all ${
              index === active ? 'w-6 bg-accent' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
