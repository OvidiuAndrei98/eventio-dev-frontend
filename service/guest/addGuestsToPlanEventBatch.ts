import { collection, doc, writeBatch } from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { Guest } from '@/core/types';
import { queryPlanEventById } from '../event/queryPlanEventById';

export const addGuestsToPlanEventBatch = async (
  eventId: string,
  userId: string,
  guests: Guest[]
): Promise<void> => {
  try {
    const foundEvent = await queryPlanEventById(eventId, userId);

    if (!foundEvent.eventId) {
      throw new Error(`Event not found, guest batch can't be added.`);
    }

    const batch = writeBatch(db);
    const eventDocRef = doc(collection(db, 'tablePlanEvents'), eventId);
    const guestsCollectionRef = collection(eventDocRef, 'guests');

    guests.forEach((guest) => {
      const customGuestRef = doc(guestsCollectionRef, guest.guestId);
      batch.set(customGuestRef, {
        ...guest,
      });
    });

    await batch.commit();
  } catch (error) {
    console.error('Error adding guest batch to event', error);
    throw error;
  }
};
