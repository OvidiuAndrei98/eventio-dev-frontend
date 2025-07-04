'use client';
import '@/styles/globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from 'sonner';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <SpeedInsights />

      <Toaster />
    </>
  );
};

export default AppLayout;
