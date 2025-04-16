import { doc, updateDoc } from 'firebase/firestore'
import db from '../../lib/firebase/fireStore'
import { eventTableOrganization } from '@/core/types'

export const updateEventTableOrganization = async (
  eventTableOrganization: eventTableOrganization,
  eventId?: string
): Promise<void> => {
  try {
    if (!eventId) {
      throw new Error('Missing event id')
    }
    const eventRef = doc(db, 'events', eventId)
    await updateDoc(eventRef, {
      eventTableOrganization: eventTableOrganization,
    })
  } catch (error) {
    console.error('Error updating event ' + eventId + ' table org:', error)
    throw error
  }
}
