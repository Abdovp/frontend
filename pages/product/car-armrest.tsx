import CarArmrestPage from '../../components/car-armrest/CarArmrestPage';
import type { GetServerSideProps } from 'next';
import { getProduct } from '../../lib/products';

export const getServerSideProps: GetServerSideProps = async () => {
  const product = getProduct('car-armrest');
  return {
    props: { product },
  };
};

export default function CarArmrest({ product }: { product: ReturnType<typeof getProduct> }) {
  return <CarArmrestPage product={product} />;
}
