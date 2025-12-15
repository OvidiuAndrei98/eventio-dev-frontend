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

/**
 * Queries the database to retrieve a list of confirmed guests for a specific event
 * who have not been assigned to a table, using the event's dedicated subcollection.
 *
 * @param eventId - The unique identifier of the event for which to fetch guests.
 * @param maxGuests - The maximum number of guests allowed by the plan.
 * @param plan - The plan type (e.g., 'ultimate').
 * @returns A promise that resolves to an array of `Guest` objects representing
 *          the confirmed guests who are not assigned to any table.
 * @throws Will throw an error if there is an issue fetching the data from the database.
 */
export const queryNotAssignedConfirmedGuestsByEventId = async (
  eventId: string,
  maxGuests: number,
  plan: string
): Promise<Guest[]> => {
  try {
    // Referința la sub-colecția evenimentului
    const guestsCollectionRef = collection(db, 'events', eventId, 'guests');

    if (plan !== 'ultimate') {
      const assignedQuery = query(
        guestsCollectionRef, // Colecție locală
        where('tableId', '!=', null)
      );
      const assignedSnapshot = await getDocs(assignedQuery);
      const assignedCount = assignedSnapshot.size;

      // 2. Dacă am atins limita, returnez array gol
      if (assignedCount >= maxGuests) {
        return [];
      }
    }

    // Interogare 2: Preia invitații Neașezați și Confirmați
    const guests: DocumentData[] = [];
    const q = query(
      guestsCollectionRef, // Colecție locală
      where('isAttending', '==', true),
      where('tableId', '==', null), // Căutăm explicit pe cei nealocați
      limit(maxGuests) // Aplicăm limita
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
