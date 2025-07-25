'use client';

import {
  BadgeCheck,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import NoProfile from '@/public/no-photo.svg';
import Image from 'next/image';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/core/types';
import { EventContext } from '@/core/context/EventContext';
import { useAuth } from '@/core/context/authContext';

export function NavUser({ user }: { user: User | null }) {
  const { isMobile } = useSidebar();
  const { logout } = useAuth();
  const router = useRouter();
  const { eventInstance } = useContext(EventContext);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {user ? (
                  user?.photoURL ? (
                    <AvatarImage src={user?.photoURL} />
                  ) : (
                    <Image
                      alt="profile-image"
                      src={user?.photoURL ?? NoProfile}
                      width={32}
                      height={32}
                    />
                  )
                ) : (
                  <Image alt="profile-image" src={NoProfile} />
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.displayName}
                </span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            onCloseAutoFocus={(e) => e.preventDefault()}
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user ? (
                    user?.photoURL ? (
                      <AvatarImage src={user?.photoURL} />
                    ) : (
                      <Image
                        alt="profile-image"
                        src={user?.photoURL ?? NoProfile}
                        width={32}
                        height={32}
                      />
                    )
                  ) : (
                    <Image alt="profile-image" src={NoProfile} />
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.displayName}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            {eventInstance?.eventPlan !== 'ultimate' && (
              <DropdownMenuSeparator />
            )}
            <DropdownMenuGroup>
              {eventInstance?.eventPlan === 'basic' && (
                <DropdownMenuItem
                  className="hover:!bg-sidebar-accent cursor-pointer"
                  onClick={() => {
                    router.push(
                      `/dashboard/${eventInstance.eventId}/choose-plan`
                    );
                  }}
                >
                  <Sparkles />
                  Upgradeaza la Premium
                </DropdownMenuItem>
              )}
              {eventInstance?.eventPlan === 'premium' && (
                <DropdownMenuItem
                  className="hover:!bg-sidebar-accent cursor-pointer"
                  onClick={() => {
                    router.push(
                      `/dashboard/${eventInstance.eventId}/choose-plan`
                    );
                  }}
                >
                  <Sparkles />
                  Upgradeaza la Ultimate
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="hover:!bg-sidebar-accent cursor-pointer"
                onClick={() => {
                  router.push('/dashboard/account');
                }}
              >
                <BadgeCheck />
                Cont
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:!bg-sidebar-accent cursor-pointer"
                onClick={() => {
                  router.push(`/dashboard/invoices`);
                }}
              >
                <CreditCard />
                Facturare
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:!bg-sidebar-accent cursor-pointer"
              onClick={() => logout()}
            >
              <LogOut />
              Iesi din cont
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
