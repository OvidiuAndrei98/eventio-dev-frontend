import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { Guest } from '@/core/types';

/**
 * Queries the database to retrieve a list of confirmed guests for a specific event
 * who have not been assigned to a table.
 *
 * @param eventId - The unique identifier of the event for which to fetch guests.
 * @returns A promise that resolves to an array of `Guest` objects representing
 *          the confirmed guests who are not assigned to any table.
 * @throws Will throw an error if there is an issue fetching the data from the database.
 */
export const queryNotAssignedConfirmedGuestsByEventId = async (
  eventId: string
): Promise<Guest[]> => {
  try {
    const guests: DocumentData[] = [];
    const q = query(
      collection(db, 'guest_registry'),
      where('eventId', '==', eventId),
      where('isAttending', '==', true),
      where('tableId', '==', null)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      guests.push(doc.data());
    });

    return guests as Guest[];
  } catch (error) {
    console.error('Error fetching guests for event:', error);
    throw error;
  }
};
