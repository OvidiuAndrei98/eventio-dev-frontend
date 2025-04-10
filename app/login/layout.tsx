import { ConfigProvider } from 'antd'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import '../../styles/globals.css'

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
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
  )
}

export default LoginLayout
