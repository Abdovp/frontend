import Head from 'next/head';
import { useCallback, useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import AnnouncementBar from '../AnnouncementBar';
import WhatsAppFloat from '../ui/WhatsAppFloat';
import { trackViewContent } from '../../lib/analytics/track';
import ProductOffers from './ProductOffers';
import ProductProofNumbers from './ProductProofNumbers';
import ProductPainSection from './ProductPainSection';
import ProductAlternatingBlocks from './ProductAlternatingBlocks';
import ProductMidCTA from './ProductMidCTA';
import ProductDeliverySteps from './ProductDeliverySteps';
import ProductReviews from './ProductReviews';
import ProductGuarantees from './ProductGuarantees';
import ProductFAQ from './ProductFAQ';
import type { Product } from '../../lib/products';

export default function ProductPageLayout({ product }: { product: Product }) {
  useEffect(() => {
    trackViewContent({
      productId: product.id,
      name: product.nameAr,
      price: product.offers[0]?.price ?? 0,
    });
  }, [product.id, product.nameAr, product.offers]);

  const scrollToOffers = useCallback(() => {
    document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <Head>
        <title>{`${product.nameAr} | بويا شوب`}</title>
        <meta name="description" content={product.metaDescription} />
        <meta property="og:title" content={`${product.nameAr} | بويا شوب`} />
        <meta property="og:description" content={product.metaDescription} />
      </Head>
      <div className="product-page">
        <Header showAnnouncement={false} />
        <AnnouncementBar variant="tick" intervalMs={1500} />
        <main>
          {/* 1 — Hero: image + headline + offer cards + CTA */}
          <div id="offers">
            <ProductOffers product={product} />
          </div>

          {/* 2 — Social proof numbers bar */}
          <ProductProofNumbers />

          {/* 3 — Pain: the problem agitation */}
          <ProductPainSection product={product} />

          {/* 4 — Logic/Solution: product image + solution copy */}
          <ProductAlternatingBlocks product={product} />

          {/* 5 — Mid-page CTA (second conversion point) */}
          <ProductMidCTA product={product} onCTA={scrollToOffers} />

          {/* 6 — Delivery process: طلب → تأكيد → توصيل */}
          <ProductDeliverySteps />

          {/* 7 — Reviews: 6 verified Moroccan customers */}
          <ProductReviews product={product} />

          {/* 8 — Guarantees: COD, 30-day return, delivery, WhatsApp */}
          <ProductGuarantees />

          {/* 9 — FAQ + final CTA banner */}
          <ProductFAQ product={product} />
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  );
}
