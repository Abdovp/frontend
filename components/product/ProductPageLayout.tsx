import Head from 'next/head';
import { useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import AnnouncementBar from '../AnnouncementBar';
import { trackViewContent } from '../../lib/analytics/track';
import ProductOffers from './ProductOffers';
import ProductAlternatingBlocks from './ProductAlternatingBlocks';
import ProductReviews from './ProductReviews';
import ProductFAQ from './ProductFAQ';
import ProductTrustBadges from './ProductTrustBadges';
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
      <Header showAnnouncement={false} />
      <div className="product-moving-header">
        <AnnouncementBar variant="marquee" />
      </div>
      <main>
        <div id="offers">
          <ProductOffers product={product} />
        </div>

        <ProductAlternatingBlocks product={product} />
        <ProductReviews product={product} />
        <ProductFAQ product={product} />
        <ProductTrustBadges badges={product.trustBadges} />
      </main>
      <Footer showTrustRow={false} />
      </div>
    </>
  );
}
