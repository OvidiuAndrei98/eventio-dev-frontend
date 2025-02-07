'use client'

import { ConfigProvider, FloatButton } from 'antd'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { useEffect, useState } from 'react'
import HomeNavBar from './components/navigation/HomeNavBar'
import MobileNav from './components/navigation/MobileNav'

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const [windowSize, setWindowSize] = useState<number>(0)

  useEffect(() => {
    if (typeof window != 'undefined') {
      // Set initial value of window witth
      setWindowSize(window.innerWidth)

      window.addEventListener('resize', () => {
        setWindowSize(window.innerWidth)
      })
    }
  }, [])

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
            {windowSize > 780 ? <HomeNavBar /> : <MobileNav />}
            {children}
            <FloatButton.BackTop />
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}

export default HomeLayout
