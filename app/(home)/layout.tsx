'use client'

import { ConfigProvider } from 'antd'
import HomeNavBar from './components/navigation/HomeNavBar'
import MobileNav from './components/navigation/MobileNav'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { useEffect, useState } from 'react'

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const [windowSize, setWindowSize] = useState<number>(0)

  useEffect(() => {
    if (typeof window != 'undefined') {
      window.addEventListener('resize', () => {
        setWindowSize(window.innerWidth)
      })
    }
  }, [])

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
            {windowSize > 780 ? <HomeNavBar /> : <MobileNav />}

            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}

export default HomeLayout
