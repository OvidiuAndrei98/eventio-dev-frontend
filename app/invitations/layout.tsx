import { AuthenticationBoundary } from '@/core/AuthenticationBoundary';
import React from 'react';
import '@/styles/globals.css';
import { Toaster } from 'sonner';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthenticationBoundary>{children}</AuthenticationBoundary>
      <Toaster />
    </>
  );
}
