import { AuthenticationBoundary } from '@/core/AuthenticationBoundary'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'
import React from 'react'
import '@/styles/globals.css'
import { Toaster } from 'sonner'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
          </ConfigProvider>
        </AntdRegistry>
        <Toaster />
      </body>
    </html>
  )
}
