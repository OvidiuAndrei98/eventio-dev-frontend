import * as React from 'react'
import { Bot, Command, SquareTerminal } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { Badge } from '@/components/ui/badge'
import { UserContext } from '../layoutWithSuspense/LayoutWithSuspense'

export interface MenuItem {
  title: string
  url: string
  icon?: JSX.Element
  onClick?: (info: { title: string; url: string }) => void
  subMenu?: MenuItem[]
}

export type MenuData = Record<string, MenuItem[]>

export function AppSidebar({
  onClickNav,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  onClickNav: (info: { title: string; url: string }) => void
}) {
  const user = React.useContext(UserContext)

  const data: MenuData = {
    navMain: [
      {
        title: 'Invitațiile mele',
        url: '/dashboard',
        icon: <SquareTerminal />,
        onClick: onClickNav,
      },
      {
        title: 'Plăți și facturi',
        url: '/dashboard/billing',
        icon: <Bot />,
        onClick: onClickNav,
      },
    ],
  }
  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      {...props}
      className="account-sidebar"
      id="account-sidebar"
    >
      <SidebarHeader>
        <SidebarMenuButton size="lg" asChild>
          <a href="/dashboard">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Command className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <div className="flex flex-row items-center gap-2">
                <span className="truncate font-semibold">Eventio</span>
                <Badge
                  variant="default"
                  className="text-[#B46ACB] bg-[#F8E5FD] rounded-md text-xs font-medium"
                >
                  {user.accountStatus}
                </Badge>
              </div>
              <span className="truncate text-xs">Contul meu</span>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
