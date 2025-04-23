import { doc, updateDoc, getDoc } from 'firebase/firestore'
import db from '../../lib/firebase/fireStore'
import { EventInstance } from '@/core/types'

export const updateTableNameById = async (
  name: string,
  tableId: string,
  eventId: string
): Promise<EventInstance> => {
  try {
    if (!eventId) {
      throw new Error('Missing event id')
    }
    const eventRef = doc(db, 'events', eventId)
    const event = (await getDoc(eventRef)).data() as EventInstance
    const tableIndex = event.eventTableOrganization.elements.findIndex(
      (el) => el.elementId === tableId
    )
    if (tableIndex !== -1) {
      event.eventTableOrganization.elements[tableIndex].name = name
    } else {
      console.error('Table with id:' + tableId + ' not found')
    }
    await updateDoc(eventRef, {
      eventTableOrganization: event.eventTableOrganization,
    })

    return event
  } catch (error) {
    console.error('Error updating talbe with id: ' + tableId, error)
    throw error
  }
}
