import * as React from 'react'
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react'

import { NavMain } from '@/app/dashboard/[eventId]/components/nav/nav-main'
import { NavProjects } from '@/app/dashboard/[eventId]/components/nav/nav-projects'
import { NavUser } from '@/app/dashboard/[eventId]/components/nav/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/ui/sidebar'
import { firebaseAuth } from '@/lib/firebase/firebaseConfig'

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
  const user = firebaseAuth.currentUser

  const data: MenuData = {
    navMain: [
      {
        title: 'Panou de control',
        url: '/dashboard',
        icon: <SquareTerminal />,
        onClick: onClickNav,
      },
      {
        title: 'Raspunsuri',
        url: '/dashboard/response',
        icon: <Bot />,
        onClick: onClickNav,
      },
      {
        title: 'Statistici',
        url: '/dashboard/statistics',
        icon: <BookOpen />,
        onClick: onClickNav,
      },
      {
        title: 'Organizare',
        url: '#',
        icon: <Settings2 />,
        onClick: onClickNav,
      },
    ],
    projects: [
      {
        title: 'Invitatii',
        url: '#',
        icon: <Frame />,
      },
      {
        title: 'Plati si facturi',
        url: '#',
        icon: <PieChart />,
      },
      {
        title: 'Actiuni rapide',
        url: '#',
        icon: <PieChart />,
        subMenu: [
          {
            title: 'Planificator excel',
            url: '#',
            icon: <PieChart />,
          },
          {
            title: 'Todo list',
            url: '#',
            icon: <PieChart />,
          },
        ],
      },
    ],
  }
  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      {...props}
      className="event-sidebar"
      id="event-sidebar"
    >
      <SidebarHeader>
        <SidebarMenuButton size="lg" asChild>
          <a href="/dashboard">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Command className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Eventio</span>
              <span className="truncate text-xs">dashboard</span>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
