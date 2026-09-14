import Head from 'next/head';
import CarChargerPage from '../../components/car-charger/CarChargerPage';
import { getCarChargerProductVariant } from '../../lib/experiments/pricing';

export default function CarChargerVariantB() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <CarChargerPage product={getCarChargerProductVariant('b')} />
    </>
  );
}
