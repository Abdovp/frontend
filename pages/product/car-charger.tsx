import CarChargerPage from '../../components/car-charger/CarChargerPage';
import type { GetServerSideProps } from 'next';
import { getProduct } from '../../lib/products';

const AB_COOKIE = 'ab_price_car_charger';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const existing = req.cookies[AB_COOKIE];
  const variant = existing === 'a' || existing === 'b' ? existing : Math.random() < 0.5 ? 'a' : 'b';

  res.setHeader('Set-Cookie', `${AB_COOKIE}=${variant}; Path=/; Max-Age=2592000; SameSite=Lax`);

  return {
    props: {
      variant,
    },
  };
};

export default function CarCharger() {
  return <CarChargerPage product={getProduct('car-charger')} />;
}
