import Head from 'next/head';
import Link from 'next/link';
import Header from '../Header';
import Footer from '../Footer';
import ProductOffers from './ProductOffers';
import ProductAlternatingBlocks from './ProductAlternatingBlocks';
import ProductReviews from './ProductReviews';
import ProductFAQ from './ProductFAQ';
import Icon from '../ui/Icon';
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
      <Header />
      <main className="pb-24">
        <nav className="bg-white border-b border-ink/[0.06]" aria-label="مسار التصفح">
          <div className="container-wide flex items-center gap-2 py-3 text-sm text-ink/55">
            <Link href="/" className="hover:text-brand transition">الرئيسية</Link>
            <Icon name="arrow-left" size={14} className="text-ink/30" />
            <Link href="/collections" className="hover:text-brand transition">المنتجات</Link>
            <Icon name="arrow-left" size={14} className="text-ink/30" />
            <span className="text-ink font-semibold truncate">{product.nameAr}</span>
          </div>
        </nav>

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
