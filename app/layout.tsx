import { ConfigProvider } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@/lib/firebase/firebaseConfig'; // Ensure Firebase is initialized
import { Metadata } from 'next';
import { AuthenticationBoundary } from '@/core/AuthenticationBoundary';
import '@/styles/globals.css';
import { TikTokPixel } from '@/lib/tik-tok/TikTokPixel';
import { Toaster } from 'sonner';
import Script from 'next/script';
import CookieBanner from '@/components/cookieBanner/CookieBanner';

const GA_MEASUREMENT_ID = 'G-QNNWC4054G';

export const metadata: Metadata = {
  generator: 'Next.js',
  applicationName: 'Planyvite - Planifică Evenimente Fără Stres',
  referrer: 'origin-when-cross-origin',
  publisher: 'planyvite.ro',
  openGraph: {
    siteName: 'Planyvite - Planifică Evenimente Fără Stres',
    title: 'Planyvite - Invitații Digitale Personalizate Nunta | Botez',
  },
  title: {
    absolute: 'Invitații Digitale Personalizate și Creative | Planyvite',
  },
  description: `Economisește timp, reduce risipa și impresionează-ți oaspeții cu
            invitații digitale personalizate. Urmărește RSVP-urile în timp real
            și concentrează-te pe ceea ce contează cu adevărat: evenimentul tău.`,
};

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="en"
      style={{ scrollBehavior: 'smooth', backgroundColor: 'white' }}
    >
      <head>
        <TikTokPixel />
      </head>
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: { colorPrimary: '#b46acb' },
              components: {
                Button: {
                  colorPrimary: '#b46acb',
                  colorPrimaryBorderHover: '#b46acb',
                  colorTextLightSolid: 'white',
                },
              },
            }}
          >
            <AuthenticationBoundary>{children}</AuthenticationBoundary>
            <CookieBanner />
          </ConfigProvider>
        </AntdRegistry>
        <Toaster />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive" // Îl încarcă după ce pagina devine interactivă (bun pentru performanță)
        />
        <Script id="google-analytics-init" strategy="afterInteractive">
          {`
            // 1. Inițializarea Data Layer
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // 2. CONSENT MODE (Starea Inițială - DENIED)
            // Se asigură că nu sunt setate cookie-uri de analiză/ad-uri fără consimțământ
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'wait_for_update': 500 // Așteaptă 500ms pentru un update de consimțământ
            });

            // 3. Configurația Principală (G-QNNWC4054G)
            // Aceasta trimite pings anonime (fără cookie-uri) chiar și în starea 'denied'
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
};

export default HomeLayout;
