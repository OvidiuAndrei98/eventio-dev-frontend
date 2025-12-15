import { Guest } from '@/core/types';
import { queryEventById } from '../event/queryEventById';
import { doc, setDoc } from 'firebase/firestore';
import db from '@/lib/firebase/fireStore';
import { updateEventStatsForGuest } from '../event/updateEventStatsForGuest';

export const addGuestToEvent = async (
  eventId: string,
  userId: string,
  guest: Guest
) => {
  try {
    const foundEvent = await queryEventById(eventId, userId);

    if (!foundEvent) {
      throw new Error(`Event not found, guest can't be added`);
    }

    const guestRef = doc(db, 'events', eventId, 'guests', guest.guestId);
    await setDoc(guestRef, guest);

    const deltaResponses = 1;
    let deltaConfirmations = 0;
    let deltaRefusals = 0;

    if (guest.isAttending === true) {
      deltaConfirmations = 1;
    } else if (guest.isAttending === false) {
      deltaRefusals = 1;
    }

    // Actualizăm statisticile evenimentului folosind deltele calculate
    await updateEventStatsForGuest(
      eventId,
      guest.date,
      deltaResponses,
      deltaConfirmations,
      deltaRefusals
    );
  } catch (error) {
    console.error('Error adding the guest:', error);
    throw error;
  }
};
