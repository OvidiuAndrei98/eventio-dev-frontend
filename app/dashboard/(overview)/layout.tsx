'use client'

import '@/styles/globals.css'

import LayoutWithSuspense from './components/layoutWithSuspense/LayoutWithSuspense'
import { Suspense } from 'react'
import { LoadingIndicator } from '@/lib/icons'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <body>
        <Suspense fallback={<LoadingIndicator />}>
          <LayoutWithSuspense>{children}</LayoutWithSuspense>
        </Suspense>
      </body>
    </html>
  )
}

export default DashboardLayout
