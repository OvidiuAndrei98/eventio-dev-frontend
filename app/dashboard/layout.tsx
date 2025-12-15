'use client';
import '@/styles/globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { EventProvider } from './(event)/[eventId]/components/providers/EventProvider';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <EventProvider>
        {children}
        <SpeedInsights />
      </EventProvider>
    </>
  );
};

export default AppLayout;
