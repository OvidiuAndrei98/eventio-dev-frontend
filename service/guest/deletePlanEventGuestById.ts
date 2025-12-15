import { deleteDoc, doc } from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';

export const deletePlanEventGuestById = async (
  guestId: string,
  eventId: string
): Promise<void> => {
  try {
    const guestRef = doc(db, 'tablePlanEvents', eventId, 'guests', guestId);

    await deleteDoc(guestRef);
  } catch (error) {
    console.log('Error on deleting guest', error);
    throw error;
  }
};
