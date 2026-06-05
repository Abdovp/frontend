import ProductPageLayout from '../../components/product/ProductPageLayout';
import { getProduct } from '../../lib/products';

export default function CarVacuumPage() {
  return <ProductPageLayout product={getProduct('car-vacuum')} />;
}
