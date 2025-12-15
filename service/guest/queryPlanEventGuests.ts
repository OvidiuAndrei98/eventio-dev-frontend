import {
  collection,
  query,
  orderBy,
  getDocs,
  DocumentData,
} from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { Guest } from '@/core/types';
import { PLANYVITE_EVENT_PLAN_FEATURES } from '@/lib/planyviteEventPlanTiers';

// Define EventPlanKey type based on the keys of PLANYVITE_EVENT_PLAN_FEATURES
type EventPlanKey = keyof typeof PLANYVITE_EVENT_PLAN_FEATURES;

/**
 * Queries the list of guests associated with a specific event ID from the
 * event's dedicated 'guests' subcollection.
 *
 * @param eventId - The unique identifier of the event for which to fetch the guests.
 * @param eventPlan - The plan associated with the event, used to determine the guest limit.
 * @returns A promise that resolves to an array of `Guest` objects.
 * @throws Will throw an error if there is an issue fetching the guests from the database.
 */
export const queryPlanEventGuests = async (
  eventId: string,
  eventPlan: string
): Promise<Guest[]> => {
  try {
    const guests: DocumentData[] = [];

    const guestsCollectionRef = collection(
      db,
      'tablePlanEvents',
      eventId,
      'guests'
    );

    const q = query(guestsCollectionRef, orderBy('date', 'asc'));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      guests.push(doc.data());
    });

    const planKey: EventPlanKey = (
      eventPlan in PLANYVITE_EVENT_PLAN_FEATURES ? eventPlan : 'basic'
    ) as EventPlanKey;
    const limit = PLANYVITE_EVENT_PLAN_FEATURES[planKey].maxGuests;

    return guests.slice(0, limit) as Guest[];
  } catch (error) {
    console.error('Error fetching guests for this event:', error);
    throw error;
  }
};

// TOODO: De verificat daca mai este nevoie de request pe paginile care il folosesc
