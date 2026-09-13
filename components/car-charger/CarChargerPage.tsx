import Head from 'next/head';
import { useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import WhatsAppFloat from '../ui/WhatsAppFloat';
import { trackViewContent } from '../../lib/analytics/track';
import CarChargerHero from './CarChargerHero';
import CarChargerPain from './CarChargerPain';
import CarChargerSolution from './CarChargerSolution';
import CarChargerHowTo from './CarChargerHowTo';
import CarChargerReviews from './CarChargerReviews';
import CarChargerFAQ from './CarChargerFAQ';
import CarChargerFinalCTA from './CarChargerFinalCTA';
import type { Product } from '../../lib/products';

export default function CarChargerPage({ product }: { product: Product }) {
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
        <meta name="theme-color" content="#05070d" />
      </Head>
      <div className="car-charger-page relative bg-[#05070d]">
        <Header />
        <main>
          <CarChargerHero product={product} />
          <CarChargerPain product={product} />
          <CarChargerSolution product={product} />
          <CarChargerHowTo product={product} />
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
