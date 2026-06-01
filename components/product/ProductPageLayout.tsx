import Head from 'next/head';
import Header from '../Header';
import Footer from '../Footer';
import AnnouncementBar from '../AnnouncementBar';
import ProductOffers from './ProductOffers';
import ProductAlternatingBlocks from './ProductAlternatingBlocks';
import ProductReviews from './ProductReviews';
import ProductFAQ from './ProductFAQ';
import type { Product } from '../../lib/products';

export default function ProductPageLayout({ product }: { product: Product }) {
  return (
    <>
      <Head>
        <title>{`${product.nameAr} | بويا شوب`}</title>
        <meta name="description" content={product.metaDescription} />
        <meta property="og:title" content={`${product.nameAr} | بويا شوب`} />
        <meta property="og:description" content={product.metaDescription} />
      </Head>
      <Header showAnnouncement={false} />
      <div className="product-moving-header">
        <AnnouncementBar variant="tick" />
      </div>
      <main className="pb-24">
        <div id="offers">
          <ProductOffers product={product} />
        </div>

        <ProductAlternatingBlocks product={product} />
        <ProductReviews product={product} />
        <ProductFAQ product={product} />
      </main>
      <Footer />
    </>
  );
}
