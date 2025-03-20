'use client'
import '../../styles/globals.css'
import './mock.css'

import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'
import { usePathname, useRouter } from 'next/navigation'

import { AppSidebar } from '@/app/dashboard/components/nav/app-sidebar'
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
import { useEffect, useState } from 'react'
import { AuthenticationBoundary } from '@/core/AuthenticationBoundary'

const routeTitleMapper = {
  dashboard: 'Panou de control',
  response: 'Raspunsuri',
  statistics: 'Statistici',
}

type routeType = 'dashboard' | 'response' | 'statistics'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [routeElements, setRouteElements] = useState<routeType[]>([])
  const pathName = usePathname()

  const router = useRouter()

  useEffect(() => {
    const pathsList = pathName.substring(1).split('/')
    setRouteElements(pathsList as routeType[])
  }, [pathName])

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
              <SidebarProvider>
                <AppSidebar onClickNav={handleSideMenuNavigation} />
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
                                    <BreadcrumbLink href="/dashboard">
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
            </AuthenticationBoundary>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}

export default DashboardLayout
