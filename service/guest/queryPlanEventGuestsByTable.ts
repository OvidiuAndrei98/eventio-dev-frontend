import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { Guest } from '@/core/types';

export const queryPlanEventGuestsByTable = async (
  eventId: string,
  tableId: string
): Promise<Guest[]> => {
  try {
    const guests: DocumentData[] = [];

    const guestsCollectionRef = collection(
      db,
      'tablePlanEvents',
      eventId,
      'guests'
    );

    const q = query(
      guestsCollectionRef,
      where('isAttending', '==', true),
      where('tableId', '==', tableId)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      guests.push(doc.data());
    });

    return guests as Guest[];
  } catch (error) {
    console.error('Error fetching guests for table:', error);
    throw error;
  }
};

// TOODO: De verificat daca mai este nevoie de request pe paginile care il folosesc
