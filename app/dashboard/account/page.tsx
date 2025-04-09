'use client'

import React, { useContext } from 'react'
import { AppSidebar } from '../components/nav/app-sidebar'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import UploadAvatar from '../components/avatarUploader/UploadAvatar'
import { UserContext } from '../layout'
import { handleSideMenuNavigation } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const AccountPage: React.FC = () => {
  const user = useContext(UserContext)
  const router = useRouter()
  return (
    <>
      <AppSidebar
        onClickNav={(info) => handleSideMenuNavigation(info, router)}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />
          </div>
          <h1 className="text-sm font-normal">Setari cont</h1>
        </header>
        <div className="events-container h-full p-4 bg-[#F6F6F6]">
          <div className="flex flex-col items-center justify-center bg-white rounded-md shadow-sm p-4">
            <UploadAvatar />
            <h1 className="text-xl font-semibold">{user?.displayName}</h1>
            <div className="flex flex-row items-center gap-1">
              <span className="text-semibold text-sm text-slate-500">
                {user?.email}
              </span>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}

export default AccountPage
