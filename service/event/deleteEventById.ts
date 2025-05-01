import { doc, deleteDoc } from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { deleteGuestsByEventId } from '../guest/deleteGuestsByEventId';
import { EventInstance } from '@/core/types';

export const deleteEventById = async (event: EventInstance): Promise<void> => {
  try {
    await deleteGuestsByEventId(event.eventId);
    if (event.templateId) {
      await deleteDoc(doc(db, 'templates', event.templateId));
    }
    await deleteDoc(doc(db, 'events', event.eventId));
  } catch (error) {
    console.error('Error creating the event', error);
    throw error;
  }
};
