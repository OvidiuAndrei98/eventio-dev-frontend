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
import { EventInstance } from '@/core/types'
import { queryEventById } from '@/service/event/queryEventById'
import { LoadingIndicator } from '@/lib/icons'
import { AppSidebar } from './components/nav/app-sidebar'

import { useAuth } from '@/core/AuthenticationBoundary'
import { Toaster } from 'sonner'
import React from 'react'

export const EventContext = createContext<{
  eventInstance: EventInstance | null
  setEventInstance: (event: EventInstance) => void
}>({
  eventInstance: null,
  setEventInstance: () => {
    /* not impl */
  },
})

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
  const { eventId } = use(params)
  const [queryEventLoading, setQueryEventLoading] = useState(true)
  const [eventInstance, setEventInstance] = useState<EventInstance | null>(null)
  const authContext = useAuth()

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
    if (!authContext.userDetails.userId) {
      return
    }
    queryEventById(eventId, authContext.userDetails.userId)
      .then((event) => {
        setEventInstance(event)
        setQueryEventLoading(false)
      })
      .catch(() => {
        notFound()
      })
  }, [authContext.userDetails.userId, eventId])

  const handleSideMenuNavigation = (info: { title: string; url: string }) => {
    router.push(info.url)
  }

  if (!eventInstance?.eventId && !queryEventLoading) {
    return notFound()
  }

  return (
    <>
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
            <EventContext.Provider value={{ eventInstance, setEventInstance }}>
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
                                <React.Fragment key={index}>
                                  <BreadcrumbItem
                                    key={index}
                                    className="hidden md:block"
                                  >
                                    <BreadcrumbLink
                                      href={`/dashboard/${eventId}`}
                                    >
                                      {routeTitleMapper[route]}
                                    </BreadcrumbLink>
                                  </BreadcrumbItem>
                                  <BreadcrumbSeparator className="hidden md:block" />
                                </React.Fragment>
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
          )}
        </ConfigProvider>
      </AntdRegistry>
      <Toaster />
    </>
  )
}

export default DashboardEventLayout
