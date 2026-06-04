import Image from 'next/image';
import { products, type ProductId } from '../../lib/products';
import Icon from './Icon';

type Props = {
  productId: ProductId;
  size?: 'sm' | 'md';
};

const sizeClass = {
  sm: 'w-12 h-14',
  md: 'w-16 h-20',
};

export default function CartProductThumb({ productId, size = 'md' }: Props) {
  const product = products[productId];

  if (product.image) {
    const [w, h] = size === 'sm' ? [48, 56] : [64, 80];
    return (
      <div className={`cart-item-thumb cart-item-thumb--photo overflow-hidden ${sizeClass[size]}`}>
        <Image
          src={product.image}
          alt={product.nameAr}
          width={w}
          height={h}
          className="h-full w-full object-cover object-center"
        />
      </div>
    );
  }

  return (
    <div className={`cart-item-thumb cart-item-thumb--icon ${sizeClass[size]}`}>
      <Icon name={product.icon} size={size === 'sm' ? 22 : 26} />
    </div>
  );
}
