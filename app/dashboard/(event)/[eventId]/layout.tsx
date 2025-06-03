import '@/styles/globals.css';
import '@/app/dashboard/(overview)/mock.css';

import { Toaster } from 'sonner';
import React from 'react';
import { EventProvider } from './components/providers/EventProvider';
import InvitationShell from './components/eventShell/EventShell';

const DashboardEventLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <EventProvider>
        <InvitationShell>{children}</InvitationShell>
      </EventProvider>
      <Toaster />
    </>
  );
};

export default DashboardEventLayout;
