'use client'

import React from 'react'
import UploadAvatar from '../components/avatarUploader/UploadAvatar'
import { useAuth } from '@/core/AuthenticationBoundary'

const AccountPage: React.FC = () => {
  const user = useAuth().userDetails
  return (
    <div className="events-container h-full p-4 bg-[#F6F6F6]">
      <div className="min-h-[128px] relative flex flex-col items-center justify-center bg-white rounded-md shadow-sm p-4">
        <>
          <UploadAvatar />
          <h1 className="text-xl font-semibold">{user?.displayName}</h1>
          <div className="flex flex-row items-center gap-1">
            <span className="text-semibold text-sm text-slate-500">
              {user?.email}
            </span>
          </div>
        </>
      </div>
    </div>
  )
}

export default AccountPage
