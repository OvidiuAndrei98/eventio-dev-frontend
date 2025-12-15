import { deleteDoc, doc } from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { updateEventStatsForGuest } from '../event/updateEventStatsForGuest';

export const deleteGuestById = async (
  guestId: string,
  eventId: string,
  guestSubmissionsDate: number,
  attending: boolean
): Promise<void> => {
  try {
    const guestRef = doc(db, 'events', eventId, 'guests', guestId);

    await deleteDoc(guestRef);

    if (!attending) {
      await updateEventStatsForGuest(eventId, guestSubmissionsDate, -1, 0, -1);
    } else {
      await updateEventStatsForGuest(eventId, guestSubmissionsDate, -1, -1, 0);
    }
  } catch (error) {
    console.log('Error on deleting guest', error);
    throw error;
  }
};
