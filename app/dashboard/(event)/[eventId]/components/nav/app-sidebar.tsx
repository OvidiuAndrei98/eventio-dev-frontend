import * as React from 'react';
import {
  BookOpen,
  Bot,
  Command,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react';

import { NavMain } from '@/app/dashboard/(event)/[eventId]/components/nav/nav-main';
import { NavProjects } from '@/app/dashboard/(event)/[eventId]/components/nav/nav-projects';
import { NavUser } from '@/app/dashboard/(event)/[eventId]/components/nav/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/core/AuthenticationBoundary';
import { useEventContext } from '@/core/context/EventContext';

export interface MenuItem {
  title: string;
  url: string;
  icon?: JSX.Element;
  onClick?: (info: { title: string; url: string }) => void;
  subMenu?: MenuItem[];
}

export type MenuData = Record<string, MenuItem[]>;

export function AppSidebar({
  onClickNav,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  onClickNav: (info: { title: string; url: string }) => void;
}) {
  const user = useAuth().userDetails;
  const { eventInstance } = useEventContext();

  const data: MenuData = {
    navMain: [
      {
        title: 'Panou de control',
        url: `/dashboard/${eventInstance?.eventId}`,
        icon: <SquareTerminal />,
        onClick: onClickNav,
      },
      {
        title: 'Raspunsuri',
        url: `/dashboard/${eventInstance?.eventId}/response`,
        icon: <Bot />,
        onClick: onClickNav,
      },
      {
        title: 'Statistici',
        url: `/dashboard/${eventInstance?.eventId}/statistics`,
        icon: <BookOpen />,
        onClick: onClickNav,
      },
      {
        title: 'Organizare',
        url: `/dashboard/${eventInstance?.eventId}/tables`,
        icon: <Settings2 />,
        onClick: onClickNav,
      },
      {
        title: 'Editare template',
        url: `/dashboard/${eventInstance?.eventId}/${eventInstance?.templateId}/edit`,
        icon: <Settings2 />,
        onClick: onClickNav,
      },
      {
        title: 'Editare invitatie',
        url: `/dashboard/${eventInstance?.eventId}/tables`,
        icon: <Settings2 />,
        onClick: onClickNav,
      },
    ],
    projects: [
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
  };
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
              <div className="flex flex-row items-center gap-2">
                <span className="truncate font-semibold">Eventio</span>
                {user.accountStatus && user.accountStatus !== 'basic' && (
                  <Badge
                    variant="default"
                    className="text-[#B46ACB] bg-[#F8E5FD] rounded-md text-xs font-medium"
                  >
                    {user.accountStatus}
                  </Badge>
                )}
              </div>
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
  );
}
