import db from '@/lib/firebase/fireStore';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Logs a website visit in Firestore under logs/visits collection
export async function addWebVisitLog(
  visitorId: string,
  additionalData?: Record<string, string>
) {
  const logData = {
    visitorId,
    timestamp: serverTimestamp(),
    ...additionalData,
  };

  // logs/visits is a subcollection under logs
  const visitsCollection = collection(db, 'logs', 'visits', 'entries');
  await addDoc(visitsCollection, logData);
}
