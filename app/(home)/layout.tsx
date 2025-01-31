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
              token: { colorPrimary: '#F3E438' },
              components: {
                Button: {
                  colorPrimary: '#F3E438',
                  colorPrimaryBorderHover: '#F3E438',
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
