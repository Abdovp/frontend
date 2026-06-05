import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomeBrandHero from '../components/HomeBrandHero';
import ProofBar from '../components/sections/ProofBar';
import PainPromiseSection from '../components/sections/PainPromiseSection';
import HomeCatalogSection from '../components/sections/HomeCatalogSection';
import FeaturedProducts from '../components/FeaturedProducts';
import AuthoritySection from '../components/sections/AuthoritySection';
import DeliveryConfirmationSection from '../components/sections/DeliveryConfirmationSection';
import TestimonialsSection from '../components/TestimonialsSection';
import HomeFinalCTA from '../components/sections/HomeFinalCTA';

export default function Home() {
  return (
    <>
      <Head>
        <title>بويا شوب | متجر منتجات السيارات — Boya Shop</title>
        <meta
          name="description"
          content="بويا شوب: متجر DTC مغربي متخصص في منتجات السيارات. كتالوج متنامٍ، دفع عند الاستلام، ضمان 30 يوم، توصيل سريع."
        />
      </Head>
      <Header />
      <main>
        <HomeBrandHero />
        <ProofBar />
        <PainPromiseSection />
        <HomeCatalogSection />
        <FeaturedProducts />
        <AuthoritySection />
        <DeliveryConfirmationSection />
        <TestimonialsSection />
        <HomeFinalCTA />
      </main>
      <Footer showTrustCards={false} />
    </>
  );
}
