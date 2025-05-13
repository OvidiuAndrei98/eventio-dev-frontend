import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { EventInstance } from '@/core/types';

export const queryEventById = async (
  eventId: string,
  userId: string
): Promise<EventInstance> => {
  try {
    let event: DocumentData = {};
    const q = query(
      collection(db, 'events'),
      where('eventId', '==', eventId),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      event = doc.data();
    });

    return event as EventInstance;
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    throw error;
  }
};
