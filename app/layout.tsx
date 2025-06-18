import { ConfigProvider } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import { Metadata } from 'next';

export const metadata: Metadata = {
  generator: 'Next.js',
  applicationName: 'Planyvite - Planifică Evenimente Fără Stres',
  referrer: 'origin-when-cross-origin',
  publisher: 'planyvite.ro',
  openGraph: {
    siteName: 'Planyvite - Planifică Evenimente Fără Stres',
    title: 'Planyvite',
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
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
};

export default HomeLayout;
