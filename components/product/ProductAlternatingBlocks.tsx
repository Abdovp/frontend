import AlternatingSection from '../ui/AlternatingSection';
import ImagePlaceholder from '../ui/ImagePlaceholder';
import SectionHeading from '../ui/SectionHeading';
import Icon from '../ui/Icon';
import type { Product } from '../../lib/products';

function SectionContent({
  section,
  tone = 'check',
}: {
  section: Product['pain'];
  tone?: 'check' | 'cross';
}) {
  return (
    <>
      <SectionHeading eyebrow={section.eyebrow} title={section.title} subtitle={section.body} />
      {section.bullets && (
        <ul className="space-y-3">
          {section.bullets.map((b) => (
            <li key={b} className="flex items-center gap-3 text-ink/80 font-medium">
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 ${
                  tone === 'cross' ? 'bg-red-50 text-red-500' : 'bg-brand/[0.08] text-brand'
                }`}
              >
                <Icon name={tone === 'cross' ? 'close' : 'check'} size={14} />
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

interface ProductAlternatingBlocksProps {
  product: Product;
}

export default function ProductAlternatingBlocks({ product }: ProductAlternatingBlocksProps) {
  return (
    <>
      <AlternatingSection
        imageSide="left"
        bg="white"
        image={<ImagePlaceholder label={product.pain.imageLabel} aspect="hero" />}
      >
        <SectionContent section={product.pain} tone="cross" />
      </AlternatingSection>

      <AlternatingSection
        imageSide="right"
        bg="cream"
        image={<ImagePlaceholder label={product.logic.imageLabel} aspect="hero" />}
      >
        <SectionContent section={product.logic} />
      </AlternatingSection>

      <AlternatingSection
        imageSide="left"
        bg="white"
        image={<ImagePlaceholder label={product.proof.imageLabel} aspect="hero" />}
      >
        <SectionContent section={product.proof} />
      </AlternatingSection>

      <AlternatingSection
        imageSide="right"
        bg="cream"
        image={<ImagePlaceholder label={product.howItWorks.imageLabel} aspect="hero" />}
      >
        <SectionContent section={product.howItWorks} />
      </AlternatingSection>
    </>
  );
}
