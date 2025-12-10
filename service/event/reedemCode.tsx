import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
  updateDoc,
  DocumentReference,
} from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';

export const reedemCodeService = async (
  code: string,
  userId: string,
  eventId: string
): Promise<boolean> => {
  try {
    let dbCode: DocumentData = {};
    const q = query(collection(db, 'coupons'), where('couponCode', '==', code));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      dbCode = doc.data();
    });

    if (!dbCode.couponCode) {
      throw new Error('Codul de reducere nu este valid.');
    }

    if (dbCode.redemptions >= dbCode.maxRedemptions) {
      throw new Error('Codul de reducere a atins numărul maxim de utilizări.');
    }

    let eventToUpdate: DocumentReference | null = null;
    const eventQuery = query(
      collection(db, 'events'),
      where('eventId', '==', eventId),
      where('userId', '==', userId)
    );

    const eventQuerySnapshot = await getDocs(eventQuery);
    eventQuerySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      eventToUpdate = doc.ref;
    });

    if (eventToUpdate) {
      await updateDoc(eventToUpdate, {
        eventPlan: 'premium',
      });
      // also update the redemptions count
      const couponQuery = query(
        collection(db, 'coupons'),
        where('couponCode', '==', code)
      );

      const couponQuerySnapshot = await getDocs(couponQuery);
      couponQuerySnapshot.forEach(async (doc) => {
        const couponRef = doc.ref;
        const currentRedemptions = doc.data().redemptions || 0;
        await updateDoc(couponRef, {
          redemptions: currentRedemptions + 1,
        });
      });
    }

    return true;
  } catch (error) {
    throw error;
  }
};
