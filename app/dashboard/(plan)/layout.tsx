'use client';
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
import { useAuth } from '@/core/context/authContext';
import { useEventContext } from '@/core/context/EventContext';
import { EventInstance } from '@/core/types';
import { queryPlanEventById } from '@/service/event/queryPlanEventById';
import '@/styles/globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { notFound, useParams, usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { AppSidebar } from './nav/app-sidebar';
import { handleSideMenuNavigation } from '@/lib/utils';

const routeTitleMapper: { [key: string]: string } = {
  plan: 'Plan salon',
  guests: 'Invitati',
};

const PlanLayout = ({ children }: { children: React.ReactNode }) => {
  const { planId } = useParams<{ planId: string }>();
  const [routeElements, setRouteElements] = useState<string[]>([]);

  const router = useRouter();
  const pathName = usePathname();

  const { firebaseUser } = useAuth();

  const { eventInstance, setEventInstance, setQueryEventLoading } =
    useEventContext();

  useEffect(() => {
    if (!pathName) {
      setRouteElements([]);
      return;
    }
    const pathsList = pathName
      .substring(1)
      .split('/')
      .filter((path) => path !== '');

    const knownRoutes = pathsList.filter(
      (path): path is string =>
        typeof path === 'string' && routeTitleMapper.hasOwnProperty(path)
    );
    setRouteElements(knownRoutes);
  }, [pathName]);

  useEffect(() => {
    if (eventInstance?.eventId === planId) {
      setQueryEventLoading(false);
      return;
    }

    if (!firebaseUser?.uid) {
      router.push('/login?callbackUrl=muie' + pathName);
      return;
    }

    setQueryEventLoading(true);

    queryPlanEventById(planId, firebaseUser.uid)
      .then((event) => {
        if (!event || !event.eventId) {
          setQueryEventLoading(false);
          notFound();
        } else {
          setEventInstance(event as EventInstance);
        }
      })
      .catch((error) => {
        console.error('Error fetching event:', error);
        setQueryEventLoading(false);
        notFound();
      });
  }, [
    planId,
    firebaseUser?.uid,
    eventInstance?.eventId,
    setEventInstance,
    setQueryEventLoading,
    router,
    pathName,
  ]);

  return (
    <>
      <SidebarProvider>
        <AppSidebar
          onClickNav={(info) => handleSideMenuNavigation(info, router)}
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
                    const isLast = index === routeElements.length - 1;
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
                            <BreadcrumbLink href={`/dashboard/plan/${planId}`}>
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
      <SpeedInsights />
    </>
  );
};

export default PlanLayout;
