import { ConfigProvider } from 'antd'
import { AntdRegistry } from '@ant-design/nextjs-registry'

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
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
  )
}

export default LoginLayout
