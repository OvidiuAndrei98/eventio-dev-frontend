'use client'

import '../../styles/globals.css'
import './mock.css'
import { ConfigProvider } from 'antd'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { createContext, useEffect, useState } from 'react'
import { firebaseAuth } from '@/lib/firebase/firebaseConfig'
import { AuthenticationBoundary } from '@/core/AuthenticationBoundary'
import { SidebarProvider } from '@/components/ui/sidebar'

import router from 'next/router'

export const UserContext = createContext(firebaseAuth.currentUser)

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const authedUser = firebaseAuth.currentUser
  const [loggedInUser, setLoggedInUser] = useState(authedUser)

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(function (user) {
      if (user) {
        setLoggedInUser(user)
      } else {
        // No user is signed in.
        // This always redirects back to the login screen.
      }
    })
  }, [])

  const handleSideMenuNavigation = (info: { title: string; url: string }) => {
    router.push(info.url)
  }

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
            <AuthenticationBoundary>
              <UserContext.Provider value={loggedInUser}>
                <SidebarProvider>{children}</SidebarProvider>
              </UserContext.Provider>
            </AuthenticationBoundary>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}

export default DashboardLayout
