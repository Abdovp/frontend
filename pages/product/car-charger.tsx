import CarChargerPage from '../../components/car-charger/CarChargerPage';
import type { GetServerSideProps } from 'next';
import { getProduct } from '../../lib/products';

export const getServerSideProps: GetServerSideProps = async () => {
  const product = getProduct('car-charger');
  return {
    props: { product },
  };
};

export default function CarCharger({ product }: { product: ReturnType<typeof getProduct> }) {
  return <CarChargerPage product={product} />;
}
