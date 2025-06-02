import { doc, updateDoc } from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { EventQuestions } from '@/core/types';

export const updateEventAditionalQuestions = async (
  eventAditionalQuestions: EventQuestions[],
  eventId?: string
): Promise<void> => {
  try {
    if (!eventId) {
      throw new Error('Missing event id');
    }
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      eventAditionalQuestions: eventAditionalQuestions,
    });
  } catch (error) {
    console.error(
      'Error updating event adiotional questions for:' + eventId,
      error
    );
    throw error;
  }
};
