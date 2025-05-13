import { setDoc, doc } from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { Guest } from '@/core/types';
import { queryEventById } from '../event/queryEventById';

/**
 * Adds a guest to an event by saving the guest information in the database.
 *
 * @param eventId - The unique identifier of the event to which the guest is being added.
 * @param userId - The unique identifier of the user performing the operation.
 * @param guest - The guest object containing the details of the guest to be added.
 *
 * @throws Will throw an error if the event is not found or if there is an issue saving the guest information.
 *
 * @returns A promise that resolves when the guest is successfully added to the event.
 */
export const addGuestToEvent = async (
  eventId: string,
  userId: string,
  guest: Guest
): Promise<void> => {
  try {
    const foundEvent = await queryEventById(eventId, userId);

    if (!foundEvent) {
      throw new Error(`Event not found, user can't be added`);
    }
    await setDoc(doc(db, 'guest_registry/' + guest.guestId), guest);
  } catch (error) {
    console.error('Error creating the guest', error);
    throw error;
  }
};
