import { getProduct, type Product, type ProductOffer } from '../products';

type OfferQuantity = 1 | 2 | 3;

const CAR_CHARGER_B_PRICES: Record<OfferQuantity, number> = {
  1: 149,
  2: 229,
  3: 299,
};

const CAR_CHARGER_A_PRICES: Record<OfferQuantity, number> = {
  1: 159,
  2: 249,
  3: 329,
};

function withOfferPrices(product: Product, prices: Record<OfferQuantity, number>): Product {
  const offers: ProductOffer[] = product.offers.map((offer) => ({
    ...offer,
    price: prices[offer.quantity],
  }));

  return {
    ...product,
    offers,
  };
}

export function getCarChargerProductVariant(variant: 'a' | 'b'): Product {
  const product = getProduct('car-charger');
  if (variant === 'a') return withOfferPrices(product, CAR_CHARGER_A_PRICES);
  return withOfferPrices(product, CAR_CHARGER_B_PRICES);
}
