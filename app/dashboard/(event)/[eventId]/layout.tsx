import '@/styles/globals.css';
import '@/app/dashboard/(overview)/mock.css';

import { use } from 'react';
import { Toaster } from 'sonner';
import React from 'react';
import { EventProvider } from './components/providers/EventProvider';
import InvitationShell from './components/eventShell/EventShell';

const DashboardEventLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}) => {
  const { eventId } = use(params);

  return (
    <>
      <EventProvider>
        <InvitationShell eventId={eventId}>{children}</InvitationShell>
      </EventProvider>
      <Toaster />
    </>
  );
};

export default DashboardEventLayout;
