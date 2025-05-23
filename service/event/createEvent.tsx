import { setDoc, doc } from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { EventInstance, Template } from '@/core/types';
import { queryUserById } from '../user/queryUserById';

export const createEvent = async (
  event: EventInstance,
  userId: string,
  template: Template
): Promise<void> => {
  try {
    const foundUser = await queryUserById(userId);

    if (!foundUser) {
      throw new Error(
        'Event cannot be created because the user does not exist'
      );
    }
    await setDoc(doc(db, 'events/' + event.eventId), event);
    await setDoc(doc(db, 'templates/' + event.templateId), {
      ...template,
      templateId: event.templateId,
      eventId: event.eventId,
      userId: userId,
    });
  } catch (error) {
    console.error('Error creating the event', error);
    throw error;
  }
};
