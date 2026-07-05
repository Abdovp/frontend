import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import AnalyticsListener from '../components/AnalyticsListener';
import CartDrawer from '../components/CartDrawer';
import DeferredPixels from '../components/DeferredPixels';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute ? <DeferredPixels /> : null}
      {!isAdminRoute ? <AnalyticsListener /> : null}
      <Component {...pageProps} />
      {!isAdminRoute ? <CartDrawer /> : null}
    </>
  );
}
