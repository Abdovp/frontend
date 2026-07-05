import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { trackPageView } from '../lib/analytics/track';

export default function AnalyticsListener() {
  const router = useRouter();
  const lastPath = useRef<string>('');

  useEffect(() => {
    const sendPageView = (url: string) => {
      if (lastPath.current === url) return;
      lastPath.current = url;
      trackPageView(url);
    };

    lastPath.current = router.asPath;
    sendPageView(router.asPath);
    router.events.on('routeChangeComplete', sendPageView);
    return () => router.events.off('routeChangeComplete', sendPageView);
  }, [router]);

  return null;
}
