import { ConfigProvider } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@/lib/firebase/firebaseConfig'; // Ensure Firebase is initialized
import { Metadata, Viewport } from 'next';
import { AuthenticationBoundary } from '@/core/AuthenticationBoundary';
import '@/styles/globals.css';
// import { TikTokPixel } from '@/lib/tik-tok/TikTokPixel';
import { Toaster } from 'sonner';
import Script from 'next/script';
import CookieBanner from '@/components/cookieBanner/CookieBanner';

export const metadata: Metadata = {
  generator: 'Next.js',
  applicationName: 'Planyvite - Planifică Evenimente Fără Stres',
  referrer: 'origin-when-cross-origin',
  publisher: 'planyvite.ro',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
  },
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-content',
};

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="en"
      translate="no"
      style={{ scrollBehavior: 'smooth', backgroundColor: 'white' }}
    >
      <head>
        {/* <TikTokPixel /> */}
        <Script id="google-tag-manager-head" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-P7XC8N68');
          `}
        </Script>
      </head>
      <body className="notranslate" translate="no">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=GTM-P7XC8N68`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
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
      </body>
    </html>
  );
};

export default HomeLayout;
