import CarChargerPage from '../../components/car-charger/CarChargerPage';
import type { GetServerSideProps } from 'next';
import { getProduct } from '../../lib/products';

const AB_COOKIE = 'ab_price_car_charger';

type OfferQuantity = 1 | 2 | 3;

const VARIANT_A_PRICES: Record<OfferQuantity, number> = {
  1: 159,
  2: 249,
  3: 329,
};

const VARIANT_B_PRICES: Record<OfferQuantity, number> = {
  1: 149,
  2: 229,
  3: 299,
};

function applyVariantPricing(variant: 'a' | 'b') {
  const product = getProduct('car-charger');
  const prices = variant === 'a' ? VARIANT_A_PRICES : VARIANT_B_PRICES;

  return {
    ...product,
    offers: product.offers.map((offer) => ({
      ...offer,
      price: prices[offer.quantity as OfferQuantity],
    })),
  };
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const existing = req.cookies[AB_COOKIE];
  const variant = existing === 'a' || existing === 'b' ? existing : Math.random() < 0.5 ? 'a' : 'b';

  res.setHeader('Set-Cookie', `${AB_COOKIE}=${variant}; Path=/; Max-Age=2592000; SameSite=Lax`);

  return {
    props: {
      product: applyVariantPricing(variant),
    },
  };
};

export default function CarCharger({ product }: { product: ReturnType<typeof getProduct> }) {
  return <CarChargerPage product={product} />;
}
