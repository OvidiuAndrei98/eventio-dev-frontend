import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
  limit,
} from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { Guest } from '@/core/types';
import { max } from 'lodash';

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
  eventId: string,
  maxGuests: number,
  plan: string
): Promise<Guest[]> => {
  try {
    if (plan !== 'ultimate') {
      // 1. Query pentru invitații deja așezați la orice masă (tableId != null)
      const assignedQuery = query(
        collection(db, 'guest_registry'),
        where('eventId', '==', eventId),
        where('tableId', '!=', null)
      );
      const assignedSnapshot = await getDocs(assignedQuery);
      const assignedCount = assignedSnapshot.size;

      // 2. Dacă am atins limita, returnez array gol
      if (assignedCount >= maxGuests) {
        return [];
      }
    }

    const guests: DocumentData[] = [];
    const q = query(
      collection(db, 'guest_registry'),
      where('eventId', '==', eventId),
      where('isAttending', '==', true),
      where('tableId', '==', null),
      limit(maxGuests)
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
