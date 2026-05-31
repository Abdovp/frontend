import ProductPageLayout from '../../components/product/ProductPageLayout';
import { getProduct } from '../../lib/products';

export default function MagneticHolderPage() {
  return <ProductPageLayout product={getProduct('magnetic-holder')} />;
}
