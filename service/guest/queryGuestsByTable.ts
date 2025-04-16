import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from 'firebase/firestore'
import db from '../../lib/firebase/fireStore'
import { Guest } from '@/core/types'

export const queryGuestsByTable = async (
  eventId: string,
  tableId: string
): Promise<Guest[]> => {
  try {
    const guests: DocumentData[] = []
    const q = query(
      collection(db, 'guest_registry'),
      where('eventId', '==', eventId),
      where('confirmation', '==', 'confirmed'),
      where('tableId', '==', tableId)
    )
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      guests.push(doc.data())
    })

    return guests as Guest[]
  } catch (error) {
    console.error('Error fetching guests for table:', error)
    throw error
  }
}
