import { setDoc, doc } from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';
import { PlanEventInstance } from '@/core/types';
import { queryUserById } from '../user/queryUserById';

export const createPlanEvent = async (
  event: PlanEventInstance,
  userId: string
): Promise<void> => {
  try {
    const foundUser = await queryUserById(userId);

    if (!foundUser) {
      throw new Error(
        'Event cannot be created because the user does not exist'
      );
    }
    await setDoc(doc(db, 'tablePlanEvents/' + event.eventId), event);
  } catch (error) {
    console.error('Error creating the event', error);
    throw error;
  }
};
