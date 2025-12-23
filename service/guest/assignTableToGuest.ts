import { doc, writeBatch } from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';

/**
 * Assigns a table to a list of guests by updating their records in the database,
 * using the event-specific guests subcollection.
 *
 * @param eventId - The ID of the event to which the guests belong. (NOU)
 * @param tableId - The ID of the table to assign to the guests. Can be a string, null, or undefined.
 * @param guests - An array of guest objects, each containing a `value` (guest ID) and a `label` (guest name).
 * @returns A promise that resolves when the batch update operation is complete.
 * @throws Will throw an error if the batch update operation fails.
 */
export const assignTableToGuests = async (
  eventId: string, // <-- ADĂUGAT
  tableId: string | null | undefined,
  tableNumber: number | null | undefined,
  guests: { value: string; label: string }[]
): Promise<void> => {
  try {
    const batch = writeBatch(db);

    if (!eventId) {
      throw new Error('Event ID is required to assign tables to guests.');
    }

    guests.forEach((guest) => {
      const guestRef = doc(db, 'events', eventId, 'guests', guest.value);

      batch.update(guestRef, {
        tableId: tableId || null,
        tableNumber: tableNumber || null,
      });
    });

    await batch.commit();
  } catch (error) {
    console.error('Error updating table assignment for guests', error);
    throw error;
  }
};
