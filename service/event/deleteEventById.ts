import { doc, deleteDoc } from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { EventInstance } from '@/core/types';
import { deleteEventData } from './deleteEventData';

export const deleteEventById = async (event: EventInstance): Promise<void> => {
  try {
    if (event.templateId) {
      await deleteDoc(doc(db, 'templates', event.templateId));
    }
    await deleteDoc(doc(db, 'events', event.eventId));
    await deleteEventData(event.eventId, event.userId);
  } catch (error) {
    console.error('Error deleting the event', error);
    throw error;
  }
};
