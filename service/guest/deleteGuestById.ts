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
    await deleteDoc(doc(db, 'guest_registry', guestId));
    if (!attending) {
      // If the guest is not attending, update the event stats for refusals
      await updateEventStatsForGuest(
        eventId,
        guestSubmissionsDate,
        -1, // responses
        0, // confirmations
        -1 // refusals
      );
    } else {
      await updateEventStatsForGuest(
        eventId,
        guestSubmissionsDate,
        -1, // responses
        -1, // confirmations
        0 // refusals
      );
    }
  } catch (error) {
    console.log('Error on deleting guest', error);
    throw error;
  }
};
