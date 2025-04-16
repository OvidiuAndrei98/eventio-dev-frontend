import { doc, updateDoc } from 'firebase/firestore'
import db from '../../lib/firebase/fireStore'
import { eventTableOrganization } from '@/core/types'

export const deleteTableById = async (tableId?: string): Promise<void> => {
  //   try {
  //     if (!tableId) {
  //       throw new Error('Missing table id')
  //     }
  //     const tableRef = doc(db, 'events', eventId)
  //     await updateDoc(eventRef, {
  //       eventTableOrganization: eventTableOrganization,
  //     })
  //   } catch (error) {
  //     console.error('Error updating event ' + eventId + ' table org:', error)
  //     throw error
  //   }
}
