import '@/styles/globals.css';
import '@/app/dashboard/(overview)/mock.css';

import React from 'react';
import InvitationShell from './components/eventShell/EventShell';

const DashboardEventLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <InvitationShell>{children}</InvitationShell>
    </>
  );
};

export default DashboardEventLayout;
