import { Guest } from '@/core/types';
import { queryEventById } from '../event/queryEventById';
import { doc, setDoc } from 'firebase/firestore';
import db from '@/lib/firebase/fireStore';

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

    await setDoc(doc(db, 'guest_registry/' + guest.guestId), guest);
  } catch (error) {
    console.error('Error adding the guest:', error);
    throw error;
  }
};
