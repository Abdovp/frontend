import Image from 'next/image';
import { products, type ProductId } from '../../lib/products';
import Icon from './Icon';

type Props = {
  productId: ProductId;
  size?: 'sm' | 'md';
};

const sizeClass = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
};

const imageSizes = {
  sm: '48px',
  md: '64px',
};

export default function CartProductThumb({ productId, size = 'md' }: Props) {
  const product = products[productId];

  if (product.image) {
    return (
      <div
        className={`cart-item-thumb cart-item-thumb--photo relative ${sizeClass[size]}`}
      >
        <Image
          src={product.image}
          alt={product.nameAr}
          fill
          sizes={imageSizes[size]}
          className="object-contain object-center p-0.5"
        />
      </div>
    );
  }

  return (
    <div className={`cart-item-thumb cart-item-thumb--icon ${sizeClass[size]}`}>
      <Icon name={product.icon} size={size === 'sm' ? 20 : 24} />
    </div>
  );
}
