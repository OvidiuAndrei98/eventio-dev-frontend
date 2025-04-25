'use client'

import LayoutWithSuspense from './components/layoutWithSuspense/LayoutWithSuspense'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <LayoutWithSuspense>{children}</LayoutWithSuspense>
}

export default DashboardLayout
