import { doc, writeBatch } from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';

/**
 * Assigns a table to a list of guests by updating their records in the database.
 *
 * @param tableId - The ID of the table to assign to the guests. Can be a string, null, or undefined.
 * @param guests - An array of guest objects, each containing a `value` (guest ID) and a `label` (guest name).
 * @returns A promise that resolves when the batch update operation is complete.
 * @throws Will throw an error if the batch update operation fails.
 */
export const assignTableToGuests = async (
  tableId: string | null | undefined,
  guests: { value: string; label: string }[]
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    guests.forEach((guest) => {
      const guestRef = doc(db, 'guest_registry', guest.value);
      batch.update(guestRef, { tableId: tableId });
    });

    await batch.commit();
  } catch (error) {
    console.error('Error updating guests', error);
    throw error;
  }
};
