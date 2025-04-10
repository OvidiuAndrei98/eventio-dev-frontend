'use client'

import React, { useContext } from 'react'
import UploadAvatar from '../components/avatarUploader/UploadAvatar'
import { UserContext } from '../components/layoutWithSuspense/LayoutWithSuspense'

const AccountPage: React.FC = () => {
  const user = useContext(UserContext)
  return (
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
  )
}

export default AccountPage
