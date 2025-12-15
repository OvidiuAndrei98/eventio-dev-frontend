import { doc, deleteDoc } from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';

export const deletePlanEventById = async (eventId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'events', eventId));
  } catch (error) {
    console.error('Error deleting the event', error);
    throw error;
  }
};
