'use client'
import '@/styles/globals.css'
import '@/app/dashboard/(overview)/mock.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'
import { notFound, usePathname, useRouter } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { createContext, use, useEffect, useState } from 'react'
import { firebaseAuth } from '@/lib/firebase/firebaseConfig'
import { EventInstance, User } from '@/core/types'
import { queryEventById } from '@/service/event/queryEventById'
import { LoadingIndicator } from '@/lib/icons'
import { AppSidebar } from './components/nav/app-sidebar'
import { queryUserById } from '@/service/user/queryUserById'
import { UserInfo } from 'firebase/auth'
import { UserContext } from '../../(overview)/components/layoutWithSuspense/LayoutWithSuspense'

export const EventContext = createContext<EventInstance | null>(null)

const routeTitleMapper = {
  dashboard: 'Panou de control',
  response: 'Raspunsuri',
  statistics: 'Statistici',
}

type routeType = 'dashboard' | 'response' | 'statistics'

const DashboardEventLayout = ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ eventId: string }>
}) => {
  const [routeElements, setRouteElements] = useState<routeType[]>([])
  const pathName = usePathname()
  const router = useRouter()
  const [loggedInUser, setLoggedInUser] = useState<User>({} as User)
  const { eventId } = use(params)
  const [queryEventLoading, setQueryEventLoading] = useState(true)
  const [eventInstance, setEventInstance] = useState<EventInstance | null>(null)

  useEffect(() => {
    const pathsList = pathName
      .substring(1)
      .split('/')
      .filter((path) => {
        return path !== '' && path !== eventId
      })
    setRouteElements(pathsList as routeType[])
  }, [pathName, eventId])

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

  useEffect(() => {
    if (!loggedInUser.userId) {
      return
    }
    queryEventById(eventId, loggedInUser.userId)
      .then((event) => {
        setEventInstance(event)
        setQueryEventLoading(false)
      })
      .catch(() => {
        notFound()
      })
  }, [loggedInUser, eventId])

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

  const handleSideMenuNavigation = (info: { title: string; url: string }) => {
    router.push(info.url)
  }

  if (!eventInstance?.eventId && !queryEventLoading) {
    return notFound()
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
            {queryEventLoading ? (
              <LoadingIndicator />
            ) : (
              <UserContext.Provider value={loggedInUser}>
                <EventContext.Provider value={eventInstance}>
                  <SidebarProvider>
                    <AppSidebar
                      onClickNav={handleSideMenuNavigation}
                      className="event-sidebar-provider"
                    />
                    <SidebarInset>
                      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                          <SidebarTrigger className="-ml-1" />
                          <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                          />
                          <Breadcrumb>
                            <BreadcrumbList>
                              {routeElements.map((route, index) => {
                                if (index == routeElements.length - 1) {
                                  return (
                                    <BreadcrumbItem key={index}>
                                      <BreadcrumbPage>
                                        {routeTitleMapper[route]}
                                      </BreadcrumbPage>
                                    </BreadcrumbItem>
                                  )
                                } else {
                                  return (
                                    <>
                                      <BreadcrumbItem
                                        className="hidden md:block"
                                        key={index}
                                      >
                                        <BreadcrumbLink
                                          href={`/dashboard/${eventId}`}
                                        >
                                          {routeTitleMapper[route]}
                                        </BreadcrumbLink>
                                      </BreadcrumbItem>
                                      <BreadcrumbSeparator className="hidden md:block" />
                                    </>
                                  )
                                }
                              })}
                            </BreadcrumbList>
                          </Breadcrumb>
                        </div>
                      </header>
                      {children}
                    </SidebarInset>
                  </SidebarProvider>
                </EventContext.Provider>
              </UserContext.Provider>
            )}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}

export default DashboardEventLayout
