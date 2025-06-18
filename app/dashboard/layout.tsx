'use client';
import '@/styles/globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { AuthenticationBoundary } from '@/core/AuthenticationBoundary';
import { Toaster } from 'sonner';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthenticationBoundary>
        {children}
        <SpeedInsights />
      </AuthenticationBoundary>

      <Toaster />
    </>
  );
};

export default AppLayout;
