'use client'

import { ConfigProvider } from 'antd'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { Suspense, useEffect, useState } from 'react'
import Loading from './loading'
import HomeNavBar from './components/navigation/HomeNavBar'
import MobileNav from './components/navigation/MobileNav'

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const [windowSize, setWindowSize] = useState<number>(0)

  useEffect(() => {
    if (typeof window != 'undefined') {
      window.addEventListener('resize', () => {
        setWindowSize(window.innerWidth)
      })
    }
  }, [])

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

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
            <Suspense fallback={<Loading />}>
              <>
                {windowSize > 780 ? <HomeNavBar /> : <MobileNav />}
                {children}
              </>
            </Suspense>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}

export default HomeLayout
