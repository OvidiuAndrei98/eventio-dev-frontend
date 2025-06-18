'use client';

import { AuthenticationBoundary } from '@/core/AuthenticationBoundary';

export default function LoginPage() {
  return (
    <div className="bg-slate-100 flex h-full overflow-hidden h-svh flex-col items-center justify-center p-6 md:p-10 dark:bg-slate-800">
      <div className="w-full max-w-sm md:max-w-3xl flex items-center justify-center">
        <AuthenticationBoundary></AuthenticationBoundary>
      </div>
    </div>
  );
}
