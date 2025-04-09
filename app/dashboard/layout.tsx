'use client'

import '../../styles/globals.css'
import './mock.css'
import { ConfigProvider } from 'antd'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { createContext, useEffect, useState } from 'react'
import { firebaseAuth } from '@/lib/firebase/firebaseConfig'
import { AuthenticationBoundary } from '@/core/AuthenticationBoundary'
import { SidebarProvider } from '@/components/ui/sidebar'
import { queryUserById } from '@/service/user/queryUserById'
import { User } from '@/core/types'
import { UserInfo } from 'firebase/auth'

export const UserContext = createContext<User>({} as User)

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [loggedInUser, setLoggedInUser] = useState<User>({} as User)

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(function (user) {
      if (user) {
        getLoggedInUserData(user.uid, user)
      } else {
        // No user is signed in.
        // This always redirects back to the login screen.
      }
    })
  }, [])

  const getLoggedInUserData = async (
    userId: string,
    authedUserInfo: UserInfo
  ) => {
    try {
      const user = await queryUserById(userId)
      user.photoURL = authedUserInfo?.photoURL
      user.displayName = authedUserInfo?.displayName
      setLoggedInUser(user)
    } catch (error) {
      console.error('Error fetching user by ID:', error)
    }
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
