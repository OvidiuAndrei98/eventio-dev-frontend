import * as React from 'react';
import { Mails, ReceiptText } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import PlanyviteLogoSmall from '@/public/planyvite_logo_sm.svg';
import Image from 'next/image';
import { useAuth } from '@/core/context/authContext';

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

  const data: MenuData = {
    navMain: [
      {
        title: 'Invitațiile mele',
        url: '/dashboard',
        icon: <Mails />,
        onClick: onClickNav,
      },
      {
        title: 'Plăți și facturi',
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
      className="account-sidebar"
      id="account-sidebar"
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
  );
}
