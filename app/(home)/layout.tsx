'use client';

import { ConfigProvider, FloatButton } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { useEffect, useState } from 'react';
import HomeNavBar from './components/navigation/HomeNavBar';
import MobileNav from './components/navigation/MobileNav';
import { Metadata } from 'next';

export const metadata: Metadata = {
  generator: 'Next.js',
  applicationName: 'Planyvite - Planifică Evenimente Fără Stres',
  referrer: 'origin-when-cross-origin',
  publisher: 'planyvite.ro',
  title: 'Planyvite',
  description: `Economisește timp, reduce risipa și impresionează-ți oaspeții cu
            invitații digitale personalizate. Urmărește RSVP-urile în timp real
            și concentrează-te pe ceea ce contează cu adevărat: evenimentul tău.`,
};

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const [windowSize, setWindowSize] = useState<number>(0);

  useEffect(() => {
    if (typeof window != 'undefined') {
      // Set initial value of window witth
      setWindowSize(window.innerWidth);

      window.addEventListener('resize', () => {
        setWindowSize(window.innerWidth);
      });
    }
  }, []);

  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
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
            {!windowSize ? (
              <div className="loader"></div>
            ) : (
              <>
                {windowSize > 1024 ? <HomeNavBar /> : <MobileNav />}
                {children}
              </>
            )}

            <FloatButton.BackTop />
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
};

export default HomeLayout;
