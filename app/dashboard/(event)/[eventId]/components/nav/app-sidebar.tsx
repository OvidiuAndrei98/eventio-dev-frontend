import * as React from 'react';
import {
  LayoutTemplate,
  LucideCheckCircle,
  LucideHouse,
  ReceiptText,
  Settings2,
  TrendingUp,
} from 'lucide-react';
import PlanyviteLogoSmall from '@/public/planyvite_logo_sm.svg';
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
import Image from 'next/image';

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
        url: '/dashboard/invoices',
        icon: <ReceiptText />,
        onClick: onClickNav,
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
            <div className="flex aspect-square size-8 items-center justify-center bg-[#FAFAFA] rounded-lg text-sidebar-primary-foreground">
              <Image
                src={PlanyviteLogoSmall}
                alt="logo"
                width={24}
                height={24}
              />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <div className="flex flex-row items-center gap-2">
                <span className="truncate font-semibold">Planyvite</span>
                {eventInstance?.eventPlan === 'premium' && (
                  <Badge
                    variant="default"
                    className="text-[#1E88E5] bg-[#E3F2FD] rounded-md text-xs font-medium"
                  >
                    {eventInstance?.eventPlan.charAt(0).toUpperCase() +
                      eventInstance?.eventPlan.slice(1)}
                  </Badge>
                )}
                {eventInstance?.eventPlan === 'ultimate' && (
                  <Badge
                    variant="default"
                    className="text-[#B46ACB] bg-[#F8E5FD] rounded-md text-xs font-medium"
                  >
                    {eventInstance?.eventPlan.charAt(0).toUpperCase() +
                      eventInstance?.eventPlan.slice(1)}
                  </Badge>
                )}
                {eventInstance?.eventPlan === 'basic' && (
                  <Badge
                    variant="default"
                    className="text-[grey] bg-[#F5F8FA] rounded-md text-xs font-medium"
                  >
                    {eventInstance?.eventPlan.charAt(0).toUpperCase() +
                      eventInstance?.eventPlan.slice(1)}
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
