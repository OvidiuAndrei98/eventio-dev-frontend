import { doc, updateDoc } from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';

export const updateEventActiveStatus = async (
  eventStatus: boolean,
  eventId?: string
): Promise<void> => {
  try {
    if (!eventId) {
      throw new Error('Missing event id');
    }
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      eventActive: eventStatus,
    });
  } catch (error) {
    console.error('Error updating event status for:' + eventId, error);
    throw error;
  }
};
