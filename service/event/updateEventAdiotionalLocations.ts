import { doc, updateDoc } from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { EventLocation } from '@/core/types';

export const updateEventAdiotionalLocations = async (
  locations: EventLocation[],
  eventId?: string
): Promise<void> => {
  try {
    if (!eventId) {
      throw new Error('Missing event id');
    }
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      adiotionalLocations: locations,
    });
  } catch (error) {
    console.error(
      'Error updating event adiotional locations for:' + eventId,
      error
    );
    throw error;
  }
};
