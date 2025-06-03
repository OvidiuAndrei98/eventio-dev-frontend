import '@/styles/globals.css';
import '@/app/dashboard/(overview)/mock.css';

import { Toaster } from 'sonner';
import React from 'react';
import { EventProvider } from './components/providers/EventProvider';
import InvitationShell from './components/eventShell/EventShell';
import { useParams } from 'next/navigation';

const DashboardEventLayout = ({ children }: { children: React.ReactNode }) => {
  const { eventId } = useParams<{
    eventId: string;
  }>();

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
