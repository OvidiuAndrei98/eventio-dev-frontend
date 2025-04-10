import { GetProp, Upload, UploadProps } from 'antd'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import NoProfile from '@/public/no-photo.svg'
import { firebaseAuth } from '@/lib/firebase/firebaseConfig'
import { uploadProfilePicture } from '@/service/user/uploadProfilePicture'
import { UserContext } from '../layoutWithSuspense/LayoutWithSuspense'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  //   if (!isJpgOrPng) {
  //     message.error('You can only upload JPG/PNG file!');
  //   }
  const isLt2M = file.size / 1024 / 1024 < 2
  //   if (!isLt2M) {
  //     message.error('Image must smaller than 2MB!');
  //   }
  return isJpgOrPng && isLt2M
}

const UploadAvatar: React.FC = () => {
  const user = useContext(UserContext).user
  // const [form] = Form.useForm()
  // const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null | undefined>(
    user?.photoURL
  )

  useEffect(() => {
    if (user?.photoURL) {
      setImageUrl(user.photoURL)
    }
  }, [user?.photoURL])

  const handleChange: UploadProps['onChange'] = async (info) => {
    if (info.file.status === 'uploading') {
      // setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, async (url) => {
        if (firebaseAuth.currentUser) {
          await uploadProfilePicture(url, firebaseAuth.currentUser)
          //   await updateProfile(firebaseAuth.currentUser, {
          //     photoURL: url,
          //   })
        }
        // setLoading(false)
        setImageUrl(url)
      })
    }
  }

  return (
    <Upload
      name="avatar"
      listType="picture-circle"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="avatar"
          className="rounded-full"
          width={100}
          height={100}
        />
      ) : (
        <Image
          alt="avatar"
          src={NoProfile}
          width={100}
          height={100}
          className="rounded-full"
        />
      )}
    </Upload>
  )
}

export default UploadAvatar
