import '../styles/globals.css';
import type { AppProps } from 'next/app';
import AnalyticsListener from '../components/AnalyticsListener';
import CartDrawer from '../components/CartDrawer';
import DeferredPixels from '../components/DeferredPixels';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DeferredPixels />
      <AnalyticsListener />
      <Component {...pageProps} />
      <CartDrawer />
    </>
  );
}
