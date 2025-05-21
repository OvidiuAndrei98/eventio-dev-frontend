'use client';
import '@/styles/globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { AuthenticationBoundary } from '@/core/AuthenticationBoundary';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { Toaster } from 'sonner';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth', overflow: 'hidden' }}>
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
            <AuthenticationBoundary>
              {children}
              <SpeedInsights />
            </AuthenticationBoundary>
          </ConfigProvider>
        </AntdRegistry>
        <Toaster />
      </body>
    </html>
  );
};

export default AppLayout;
