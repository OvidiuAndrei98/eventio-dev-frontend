import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { PlanEventInstance } from '@/core/types';

export const queryPlanEventsByUser = async (
  userId: string
): Promise<PlanEventInstance[]> => {
  try {
    let events: DocumentData = [];
    const q = query(
      collection(db, 'tablePlanEvents'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      events.push(doc.data());
    });

    return events as PlanEventInstance[];
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    throw error;
  }
};
