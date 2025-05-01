import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import db from '../../lib/firebase/fireStore';

export const deleteGuestsByEventId = async (eventId: string): Promise<void> => {
  try {
    const collectionRef = collection(db, 'guest_registry');

    const q = query(collectionRef, where('eventId', '==', eventId));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log(
        'No documents found for the specified eventId. Nothing to delete.'
      );
      return;
    }

    const batch = writeBatch(db);

    snapshot.docs.forEach((documentSnapshot) => {
      batch.delete(documentSnapshot.ref);
    });

    await batch.commit();
  } catch (error) {
    console.log('Error on data deletion', error);
    throw error;
  }
};
