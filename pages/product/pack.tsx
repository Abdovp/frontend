import ProductPageLayout from '../../components/product/ProductPageLayout';
import { getProduct } from '../../lib/products';

export default function CoolingPackPage() {
  return <ProductPageLayout product={getProduct('cooling-pack')} />;
}
