'use client'

import '@/styles/globals.css'
import '../../mock.css'
import { ConfigProvider } from 'antd'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { createContext, useEffect, useState } from 'react'
import { firebaseAuth } from '@/lib/firebase/firebaseConfig'
import { AuthenticationBoundary } from '@/core/AuthenticationBoundary'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { queryUserById } from '@/service/user/queryUserById'
import { User, UserAuthContext } from '@/core/types'
import { UserInfo } from 'firebase/auth'
import { Separator } from '@/components/ui/separator'
import { AppSidebar } from '../../components/nav/app-sidebar'
import { handleSideMenuNavigation } from '@/lib/utils'
import { useRouter } from 'next/navigation'

// De mutat in authentication boundary
export const UserContext = createContext<UserAuthContext>({
  userLoading: true,
} as UserAuthContext)

const LayoutWithSuspense = ({ children }: { children: React.ReactNode }) => {
  const [loggedInUser, setLoggedInUser] = useState<User>({} as User)
  const [userLoading, setUserLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(function (user) {
      if (user) {
        setUserLoading(true)
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
      setUserLoading(false)
    } catch (error) {
      setUserLoading(false)
      console.error('Error fetching user by ID:', error)
    }
  }

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
        <AuthenticationBoundary>
          <UserContext.Provider
            value={{ user: loggedInUser, userLoading: userLoading }}
          >
            <SidebarProvider>
              <AppSidebar
                onClickNav={(info) => handleSideMenuNavigation(info, router)}
              />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                  <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                      orientation="vertical"
                      className="mr-2 data-[orientation=vertical]:h-4"
                    />
                  </div>
                </header>
                {children}
              </SidebarInset>
            </SidebarProvider>
          </UserContext.Provider>
        </AuthenticationBoundary>
      </ConfigProvider>
    </AntdRegistry>
  )
}

export default LayoutWithSuspense
