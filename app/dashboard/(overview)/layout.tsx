'use client'

import LayoutWithSuspense from './components/layoutWithSuspense/LayoutWithSuspense'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <body>
        <LayoutWithSuspense>{children}</LayoutWithSuspense>
      </body>
    </html>
  )
}

export default DashboardLayout
