import db from '@/lib/firebase/fireStore';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';

export const planUpgradeCheckout = async (
  userId: string,
  priceId: string,
  eventId: string,
  plan: string
) => {
  // Reference to the user's checkout_sessions subcollection
  const checkoutSessionsRef = collection(
    db,
    'customers',
    userId,
    'checkout_sessions'
  );

  // Add a new checkout session document
  const docRef = await addDoc(checkoutSessionsRef, {
    mode: 'payment',
    price: priceId, // One-time price created in Stripe
    success_url: window.location.origin,
    cancel_url: window.location.origin,
    customer_update: {
      name: 'auto',
      address: 'auto',
    },
    // consent_collection: {
    //   terms_of_service: 'required',
    // },
    metadata: {
      eventId: eventId,
      newPlan: plan,
    },
    collect_billing_address: 'required',
    payment_intent_data: {
      metadata: {
        eventId: eventId,
        newPlan: plan,
      },
    },
    allow_promotion_codes: true,
    locale: 'ro',
    billing_address_collection: 'required',
  });

  // Listen for changes on the newly created checkout session document
  const sessionDocRef = docRef; // docRef is already a DocumentReference
  const unsubscribe = onSnapshot(sessionDocRef, (snap) => {
    const data = snap.data();
    const error = data?.error;
    const url = data?.url;
    if (error) {
      console.error(`An error occured: ${error.message}`);
    }
    if (url) {
      window.location.assign(url);
    }
  });

  // Optionally return unsubscribe if you want to stop listening later
  return unsubscribe;
};
