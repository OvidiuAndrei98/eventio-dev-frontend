import { User } from 'firebase/auth'
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage'

export const uploadProfilePicture = (url: string, user: User) => {
  const storage = getStorage()
  const avatarStgRef = ref(storage, 'userAvatar')
  uploadString(avatarStgRef, url, 'data_url').then((snapshot) => {
    console.log('Uploaded a data_url string!')
    console.log(snapshot)
  })

  getDownloadURL(avatarStgRef).then((downloadURL) => {
    console.log('File available at', downloadURL)
  })
}
