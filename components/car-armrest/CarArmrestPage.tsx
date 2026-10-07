import Head from 'next/head';
import { useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import WhatsAppFloat from '../ui/WhatsAppFloat';
import { trackViewContent } from '../../lib/analytics/track';
import CarChargerHero from '../car-charger/CarChargerHero';
import CarChargerHowTo from '../car-charger/CarChargerHowTo';
import CarChargerSolution from '../car-charger/CarChargerSolution';
import CarChargerReviews from '../car-charger/CarChargerReviews';
import CarChargerFAQ from '../car-charger/CarChargerFAQ';
import CarChargerFinalCTA from '../car-charger/CarChargerFinalCTA';
import type { Product } from '../../lib/products';

export default function CarArmrestPage({ product }: { product: Product }) {
  useEffect(() => {
    trackViewContent({
      productId: product.id,
      name: product.nameAr,
      price: product.offers[0]?.price ?? 0,
    });
  }, [product.id, product.nameAr, product.offers]);

  return (
    <>
      <Head>
        <title>{`${product.nameAr} | بويا شوب`}</title>
        <meta name="description" content={product.metaDescription} />
        <meta property="og:title" content={`${product.nameAr} | بويا شوب`} />
        <meta property="og:description" content={product.metaDescription} />
        <meta name="theme-color" content="#F7F7F5" />
      </Head>

      <div className="car-charger-page relative bg-[#F7F7F5] text-[#111827]">
        <Header />
        <main>
          <CarChargerHero product={product} />
          <CarChargerHowTo product={product} />
          <CarChargerSolution product={product} />
          <CarChargerReviews product={product} />
          <CarChargerFAQ product={product} />
          <CarChargerFinalCTA product={product} />
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  );
}
