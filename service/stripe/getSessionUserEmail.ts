import { doc, getDoc } from 'firebase/firestore';
import db from '@/lib/firebase/fireStore';

/**
 * Retrieves the sessionId from a checkout_sessions subcollection
 * under the customers collection for a given customerId and sessionDocId.
 *
 * @param customerId - The Firestore document ID in the customers collection.
 * @param sessionDocId - The document ID in the checkout_sessions subcollection.
 * @returns The session_id string or null if not found.
 */
export async function getSessionIdFromFirestore(
  customerId: string,
  sessionDocId: string
): Promise<string | null> {
  const sessionRef = doc(
    db,
    'customers',
    customerId,
    'checkout_sessions',
    sessionDocId
  );

  const sessionSnap = await getDoc(sessionRef);

  if (!sessionSnap.exists()) {
    return null;
  }

  const data = sessionSnap.data();
  return data?.sessionId ?? null;
}
