import { setDoc, doc } from 'firebase/firestore'
import db from '../../lib/firebase/fireStore'
import { User } from '@/core/types'
import { queryUserById } from './queryUserById'

export const addUser = async (user: User): Promise<void> => {
  try {
    const foundUser = await queryUserById(user.userId)
    if (!foundUser?.userId) {
      await setDoc(doc(db, 'users/' + user.userId), user)
    }
  } catch (error) {
    console.error('Error adding the user:', error)
    throw error
  }
}
