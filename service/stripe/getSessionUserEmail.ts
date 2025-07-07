import { doc, getDoc } from 'firebase/firestore';
import db from '@/lib/firebase/fireStore';
import Stripe from 'stripe';

/**
 * Retrieves the sessionId from a checkout_sessions subcollection
 * under the customers collection for a given customerId and sessionDocId.
 *
 * @param customerId - The Firestore document ID in the customers collection.
 * @param sessionDocId - The document ID in the checkout_sessions subcollection.
 * @returns The session_id string or null if not found.
 */
async function getSessionIdFromFirestore(
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-06-30.basil',
});

/**
 * Retrieves the customer email from Stripe using Firestore session data.
 *
 * @param customerId - The Firestore document ID in the customers collection.
 * @param sessionDocId - The document ID in the checkout_sessions subcollection.
 * @returns The customer email string or null if not found.
 */
export async function getSessionUserEmail(
  customerId: string,
  sessionDocId: string
): Promise<string | null> {
  const sessionId = await getSessionIdFromFirestore(customerId, sessionDocId);
  if (!sessionId) {
    return null;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.customer_details?.email ?? null;
  } catch (error) {
    return null;
  }
}
