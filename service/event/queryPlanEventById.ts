import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { PlanEventInstance } from '@/core/types';

export const queryPlanEventById = async (
  eventId: string,
  userId: string
): Promise<PlanEventInstance> => {
  try {
    let event: DocumentData = {};
    const q = query(
      collection(db, 'tablePlanEvents'),
      where('eventId', '==', eventId),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      event = doc.data();
    });

    return event as PlanEventInstance;
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    throw error;
  }
};
