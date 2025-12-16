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

    const expiryDateObject = calculateExpiryDate('basic');

    await setDoc(doc(db, 'events/' + event.eventId), {
      ...event,
      createdAt: new Date(),
      expiresAt: expiryDateObject,
    });
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

export const calculateExpiryDate = (
  userPlan: 'basic' | 'premium' | 'ultimate'
): Date => {
  let expiryDate = new Date();
  const today = new Date();

  if (userPlan === 'basic') {
    expiryDate.setTime(today.getTime() + 72 * 60 * 60 * 1000);
  } else if (userPlan === 'premium') {
    expiryDate.setMonth(today.getMonth() + 8);
  } else if (userPlan === 'ultimate') {
    expiryDate.setMonth(today.getMonth() + 12);
  } else {
    expiryDate.setTime(today.getTime() + 72 * 60 * 60 * 1000);
  }

  return expiryDate;
};
