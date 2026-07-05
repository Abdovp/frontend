import { ReactNode } from 'react';

interface AlternatingSectionProps {
  image: ReactNode;
  children: ReactNode;
  /** Physical screen: image on left, text on right */
  imageSide: 'left' | 'right';
  className?: string;
  bg?: 'white' | 'gray' | 'cream' | 'brand';
}

export default function AlternatingSection({
  image,
  children,
  imageSide,
  className = '',
  bg = 'white',
}: AlternatingSectionProps) {
  const bgClass =
    bg === 'gray'
      ? 'bg-cream'
      : bg === 'cream'
        ? 'bg-cream'
        : bg === 'brand'
          ? 'bg-brand text-white'
          : 'bg-white';

  const textBlock = (
    <div dir="rtl" className="text-right">
      {children}
    </div>
  );
  const imageBlock = <div>{image}</div>;

  return (
    <section className={`section-padding ${bgClass} ${className}`}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="layout-ltr grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {imageSide === 'left' ? (
            <>
              {imageBlock}
              {textBlock}
            </>
          ) : (
            <>
              {textBlock}
              {imageBlock}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
