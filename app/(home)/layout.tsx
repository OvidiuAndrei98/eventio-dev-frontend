import { ConfigProvider } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import { Metadata } from 'next';
import LayoutContent from './components/layoutContent/LayoutContent';

export const metadata: Metadata = {
  generator: 'Next.js',
  applicationName: 'Planyvite - Planifică Evenimente Fără Stres',
  referrer: 'origin-when-cross-origin',
  publisher: 'planyvite.ro',
  title: { absolute: 'Planyvite - Planifică Evenimente Fără Stres' },
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
            <LayoutContent>{children}</LayoutContent>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
};

export default HomeLayout;
