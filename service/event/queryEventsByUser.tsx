import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from 'firebase/firestore'
import db from '../../lib/firebase/fireStore'
import { EventInstance } from '@/core/types'

export const queryEventsByUser = async (
  userId: string
): Promise<EventInstance[]> => {
  try {
    let events: DocumentData = []
    const q = query(collection(db, 'events'), where('userId', '==', userId))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      events.push(doc.data())
    })

    return events as EventInstance[]
  } catch (error) {
    console.error('Error fetching event by ID:', error)
    throw error
  }
}
