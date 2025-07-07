'use client';
import '@/styles/globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <SpeedInsights />
    </>
  );
};

export default AppLayout;
