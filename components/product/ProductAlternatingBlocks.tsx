import AlternatingSection from '../ui/AlternatingSection';
import SectionHeading from '../ui/SectionHeading';
import ProductImage from '../ui/ProductImage';
import Icon from '../ui/Icon';
import type { Product } from '../../lib/products';

export default function ProductAlternatingBlocks({ product }: { product: Product }) {
  const { logic } = product;
  const imageSrc = logic.image ?? product.image;

  return (
    <AlternatingSection
      imageSide="left"
      bg="cream"
      image={
        <ProductImage
          src={imageSrc}
          alt={product.nameAr}
          fallbackLabel={logic.imageLabel}
          fallbackSublabel="الحل"
          aspect="square"
          fit="cover"
          objectPosition={logic.image ? 'center' : product.id === 'cooling-pack' ? 'top' : 'center'}
          className="rounded-2xl shadow-card bg-white group"
          imageClassName="group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      }
    >
      <>
        <SectionHeading eyebrow={logic.eyebrow} title={logic.title} subtitle={logic.body} />
        {logic.bullets && (
          <ul className="space-y-3 mt-2">
            {logic.bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 text-ink font-bold">
                <span className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 bg-brand/[0.08] text-brand">
                  <Icon name="check" size={14} />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </>
    </AlternatingSection>
  );
}
