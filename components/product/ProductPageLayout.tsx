import Head from 'next/head';
import { useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import WhatsAppFloat from '../ui/WhatsAppFloat';
import { trackViewContent } from '../../lib/analytics/track';
import ProductOffers from './ProductOffers';
import ProductPainSection from './ProductPainSection';
import ProductAlternatingBlocks from './ProductAlternatingBlocks';
import ProductHowToUse from './ProductHowToUse';
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


  return (
    <>
      <Head>
        <title>{`${product.nameAr} | بويا شوب`}</title>
        <meta name="description" content={product.metaDescription} />
        <meta property="og:title" content={`${product.nameAr} | بويا شوب`} />
        <meta property="og:description" content={product.metaDescription} />
      </Head>
      <div className="product-page">
        <Header />
        <main>
          {/* 1 — Hero: image + headline + offer cards + CTA */}
          <div id="offers">
            <ProductOffers product={product} />
          </div>

          {/* 2 — Pain: the problem agitation */}
          <ProductPainSection product={product} />

          {/* 3 — Logic/Solution: product image + solution copy */}
          <ProductAlternatingBlocks product={product} />

          {/* 4 — How to use: step-by-step guide */}
          <ProductHowToUse product={product} />

          {/* 5 — Delivery process: طلب → upsell → تأكيد → توصيل */}
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
