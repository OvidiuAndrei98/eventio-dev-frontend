import * as React from 'react';
import {
  Command,
  LayoutTemplate,
  LucideCheckCircle,
  LucideHouse,
  PieChart,
  ReceiptText,
  Settings2,
  TrendingUp,
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
import { ControlOutlined } from '@ant-design/icons';

export interface MenuItem {
  title: string;
  url: string;
  icon?: React.ReactNode;
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
        icon: <ControlOutlined />,
        onClick: onClickNav,
      },
      {
        title: 'Raspunsuri',
        url: `/dashboard/${eventInstance?.eventId}/response`,
        icon: <LucideCheckCircle />,
        onClick: onClickNav,
      },
      {
        title: 'Statistici',
        url: `/dashboard/${eventInstance?.eventId}/statistics`,
        icon: <TrendingUp />,
        onClick: onClickNav,
      },
      {
        title: 'Plan locatie',
        url: `/dashboard/${eventInstance?.eventId}/tables`,
        icon: <LucideHouse />,
        onClick: onClickNav,
      },
      {
        title: 'Editare invitație',
        url: `/dashboard/${eventInstance?.eventId}/${eventInstance?.templateId}/edit`,
        icon: <LayoutTemplate />,
        onClick: onClickNav,
      },
      {
        title: 'Setari invitatie',
        url: `/dashboard/${eventInstance?.eventId}/${eventInstance?.templateId}/settings`,
        icon: <Settings2 />,
        onClick: onClickNav,
      },
    ],
    projects: [
      {
        title: 'Plati si facturi',
        url: '#',
        icon: <ReceiptText />,
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
                {eventInstance?.eventPlan &&
                  eventInstance?.eventPlan !== 'basic' && (
                    <Badge
                      variant="default"
                      className="text-[#B46ACB] bg-[#F8E5FD] rounded-md text-xs font-medium"
                    >
                      {eventInstance?.eventPlan}
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
