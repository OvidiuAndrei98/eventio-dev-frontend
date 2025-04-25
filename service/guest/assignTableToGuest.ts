import { doc, writeBatch } from 'firebase/firestore'
import db from '../../lib/firebase/fireStore'

export const assignTableToGuests = async (
  tableId: string | null | undefined,
  guests: { value: string; label: string }[]
): Promise<void> => {
  try {
    const batch = writeBatch(db)
    guests.forEach((guest) => {
      const guestRef = doc(db, 'guest_registry', guest.value)
      batch.update(guestRef, { tableId: tableId })
    })

    await batch.commit()
  } catch (error) {
    console.error('Error updating guests', error)
    throw error
  }
}
