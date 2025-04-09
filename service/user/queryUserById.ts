import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from 'firebase/firestore'
import db from '../../lib/firebase/fireStore'
import { User } from '@/core/types'

export const queryUserById = async (userId: string): Promise<User> => {
  try {
    let user: DocumentData = {}
    const q = query(collection(db, 'users'), where('userId', '==', userId))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      user = doc.data()
    })

    return user as User
  } catch (error) {
    console.error('Error fetching user by ID:', error)
    throw error
  }
}
