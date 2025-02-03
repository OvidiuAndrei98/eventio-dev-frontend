import { ConfigProvider } from 'antd'
import HomeNavBar from './components/navigation/HomeNavBar'
import { AntdRegistry } from '@ant-design/nextjs-registry'

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
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
                  colorTextLightSolid: 'black',
                },
              },
            }}
          >
            <HomeNavBar />
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}

export default HomeLayout
