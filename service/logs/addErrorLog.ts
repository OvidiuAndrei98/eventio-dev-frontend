import db from '@/lib/firebase/fireStore';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Logs a website visit in Firestore under logs/visits collection
export async function addErrorLog(
  userId: string,
  additionalData?: Record<string, string>
) {
  const logData = {
    userId,
    timestamp: serverTimestamp(),
    ...additionalData,
  };

  // logs/errors is a subcollection under logs
  const errorsCollection = collection(db, 'logs', 'errors', 'entries');
  await addDoc(errorsCollection, logData);
}
