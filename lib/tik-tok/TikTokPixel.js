'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

// Funcție ajutătoare pentru a urmări vizualizarea unei pagini
const trackPageView = () => {
  if (window.ttq) {
    window.ttq.page();
  }
};

export const TikTokPixelEvents = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Urmărește vizualizarea paginii la fiecare schimbare de URL
    trackPageView();
  }, [pathname, searchParams]);

  return null;
};

export const TikTokPixel = () => {
  const pixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

  if (!pixelId) {
    console.warn('TikTok Pixel ID is not set.');
    return null;
  }

  return (
    <>
      {/* Script-ul de bază TikTok, încărcat o singură dată */}
      <Script id="tiktok-pixel-base" strategy="afterInteractive">
        {`
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e].TikTokAnalyticsObject=t;var o=d.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            
            ttq.load('${pixelId}');
            // Prima vizualizare de pagină este apelată automat de codul de mai sus la încărcare
          }(window, document, 'ttq');
        `}
      </Script>
      {/* Componenta care ascultă schimbările de URL */}
      <Suspense fallback={null}>
        <TikTokPixelEvents />
      </Suspense>
    </>
  );
};
