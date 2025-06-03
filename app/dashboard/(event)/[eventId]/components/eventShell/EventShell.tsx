'use client';

import React, { useState, useEffect } from 'react';
import { notFound, useParams, usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/core/AuthenticationBoundary';
import { queryEventById } from '@/service/event/queryEventById';
import { LoadingIndicator } from '@/lib/icons';
import { AppSidebar } from '../nav/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { useEventContext } from '@/core/context/EventContext';
import { ConfigProvider } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';

const routeTitleMapper: { [key: string]: string } = {
  dashboard: 'Panou de control',
  response: 'Raspunsuri',
  statistics: 'Statistici',
  tables: 'Organizare',
  edit: 'Editare template',
};

interface EventShellProps {
  eventId: string;
  children: React.ReactNode;
}

export default function EventShell({ children }: EventShellProps) {
  const [routeElements, setRouteElements] = useState<string[]>([]);
  const { eventId } = useParams<{
    eventId: string;
  }>();
  const pathName = usePathname();
  const router = useRouter();
  const authContext = useAuth();

  const {
    eventInstance,
    setEventInstance,
    queryEventLoading,
    setQueryEventLoading,
  } = useEventContext();

  useEffect(() => {
    if (!pathName || !eventId) {
      setRouteElements([]);
      return;
    }
    const pathsList = pathName
      .substring(1)
      .split('/')
      .filter((path) => path !== '' && path !== eventId);

    const knownRoutes = pathsList.filter(
      (path): path is string =>
        typeof path === 'string' && routeTitleMapper.hasOwnProperty(path)
    );
    setRouteElements(knownRoutes);
  }, [pathName, eventId]);

  useEffect(() => {
    if (eventInstance?.eventId === eventId) {
      setQueryEventLoading(false);
      return;
    }

    if (!authContext.userDetails.userId) {
      router.push('/login?callbackUrl=' + pathName);
      return;
    }

    setQueryEventLoading(true);

    queryEventById(eventId, authContext.userDetails.userId)
      .then((event) => {
        if (!event || !event.eventId) {
          notFound();
        } else {
          setEventInstance(event);
          setQueryEventLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching event:', error);

        setQueryEventLoading(false);
        notFound();
      });
  }, [
    authContext.isLoggingIn,
    authContext?.userDetails?.userId,
    eventId,
    eventInstance?.eventId,
    setEventInstance,
    setQueryEventLoading,
  ]);

  const handleSideMenuNavigation = (info: { title: string; url: string }) => {
    router.push(info.url);
  };

  if (queryEventLoading) {
    return <LoadingIndicator />;
  }

  if (!eventInstance?.eventId && !queryEventLoading) {
    notFound();
  }

  return (
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
        <SidebarProvider>
          <AppSidebar
            onClickNav={handleSideMenuNavigation}
            className="event-sidebar-provider"
          />
          <SidebarInset>
            <header className="flex h-[58px] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    {routeElements.map((route, index) => {
                      const isLast = index === routeElements.length - 1;
                      const href = `/dashboard/${eventId}/${route}`;
                      return (
                        <React.Fragment key={route}>
                          <BreadcrumbItem
                            className={!isLast ? 'hidden md:block' : ''}
                          >
                            {isLast ? (
                              <BreadcrumbPage>
                                {routeTitleMapper[route] || route}
                              </BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink href={href}>
                                {routeTitleMapper[route] || route}
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                          {!isLast && (
                            <BreadcrumbSeparator className="hidden md:block" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </ConfigProvider>
    </AntdRegistry>
  );
}
