import db from '@/lib/firebase/fireStore';
import { firebaseAuth } from '@/lib/firebase/firebaseConfig';
import {
  signInAnonymously,
  onAuthStateChanged,
  User as FirebaseAuthUser,
} from 'firebase/auth';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';

// O funcție helper pentru a obține utilizatorul Firebase curent, așteptând încărcarea persistenței.
// Aceasta este crucială pentru a evita currentUser === null la prima încărcare/navigare.
const getFirebaseUser = (): Promise<FirebaseAuthUser | null> => {
  return new Promise((resolve) => {
    // onAuthStateChanged se va declanșa imediat dacă utilizatorul este deja încărcat/persistant,
    // sau după ce a terminat de verificat persistența.
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      unsubscribe(); // Ne dezabonăm imediat după prima emitere, deoarece vrem doar starea inițială confirmată.
      resolve(user);
    });
  });
};

export const plannerCheckout = async (priceId: string) => {
  let userId: string | null = null;

  const user = await getFirebaseUser();

  if (user) {
    userId = user.uid;
  } else {
    try {
      const userCredential = await signInAnonymously(firebaseAuth);
      userId = userCredential.user.uid;
      localStorage.setItem('tempFirebaseUid', userId);
    } catch (anonError) {
      console.error(
        'plannerCheckout: Eroare la autentificarea anonimă:',
        anonError
      );
      alert(
        'A apărut o eroare la crearea sesiunii anonime. Te rugăm să încerci din nou.'
      );
      return;
    }
  }

  if (!userId) {
    console.error(
      'plannerCheckout: ID-ul utilizatorului este încă null după toate încercările. Nu se poate continua.'
    );
    alert(
      'Nu s-a putut obține un ID de utilizator. Te rugăm să încerci din nou.'
    );
    return;
  }

  try {
    // Referința la subcolecția checkout_sessions a utilizatorului
    const checkoutSessionsRef = collection(
      db,
      'customers',
      userId,
      'checkout_sessions'
    );

    const docRef = await addDoc(checkoutSessionsRef, {
      mode: 'payment',
      price: priceId,
      success_url:
        window.location.origin +
        `/planner/checkout/%${userId}/order-confirmation`,
      cancel_url: window.location.origin,
      customer_update: {
        name: 'auto',
        address: 'auto',
      },
      metadata: {
        userId: userId,
        purchaseType: 'planner',
      },
      client_reference_id: 'planner',
      collect_billing_address: 'required',
      payment_intent_data: {
        metadata: {
          userId: userId,
          purchaseType: 'planner',
        },
      },
      allow_promotion_codes: true,
      locale: 'ro',
      billing_address_collection: 'required',
    });

    const sessionDocRef = docRef;
    const unsubscribe = onSnapshot(sessionDocRef, (snap) => {
      const data = snap.data();
      const error = data?.error;
      const url = data?.url;
      if (error) {
        console.error(`A apărut o eroare: ${error.message}`);
        alert(`A apărut o eroare la procesarea plății: ${error.message}`);
      }
      if (url) {
        window.location.assign(url);
      }
    });

    return unsubscribe;
  } catch (error) {
    console.error('Eroare generală la procesul de cumpărare:', error);
    alert(
      'A apărut o eroare la procesul de cumpărare. Te rugăm să încerci din nou.'
    );
  }
};
