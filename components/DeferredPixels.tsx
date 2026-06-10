import Script from 'next/script';
import { hasAnyPixel, PIXEL_IDS } from '../lib/analytics/pixels';

export default function DeferredPixels() {
  if (!hasAnyPixel()) return null;

  return (
    <>
      {PIXEL_IDS.facebook && (
        <>
          <Script id="fb-pixel-base" strategy="lazyOnload">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');`}
          </Script>
          <Script id="fb-pixel-init" strategy="lazyOnload">
            {`window.fbq && window.fbq('init', '${PIXEL_IDS.facebook}');`}
          </Script>
        </>
      )}

      {PIXEL_IDS.snapchat && (
        <Script id="snapchat-pixel" strategy="lazyOnload">
          {`(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})(window,document,'https://sc-static.net/scevent.min.js');window.snaptr && window.snaptr('init','${PIXEL_IDS.snapchat}');`}
        </Script>
      )}
    </>
  );
}
