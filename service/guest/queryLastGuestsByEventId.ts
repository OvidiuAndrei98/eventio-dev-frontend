import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  DocumentData,
} from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { Guest } from '@/core/types';

/**
 * Queries the list of guests associated with a specific event ID from the 'guest_registry' collection in the database.
 *
 * @param eventId - The unique identifier of the event for which to fetch the guests.
 * @param queryLimit - The limit of rows returned
 * @returns A promise that resolves to an array of `Guest` objects.
 * @throws Will throw an error if there is an issue fetching the guests from the database.
 */
export const queryLastGuestsByEventId = async (
  eventId: string,
  queryLimit: number
): Promise<Guest[]> => {
  try {
    const guests: DocumentData[] = [];
    const q = query(
      collection(db, 'guest_registry'),
      where('eventId', '==', eventId),
      orderBy('date', 'desc'),
      limit(queryLimit)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      guests.push(doc.data());
    });

    return guests as Guest[];
  } catch (error) {
    console.error('Error fetching guests for this event:', error);
    throw error;
  }
};
