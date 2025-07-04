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

  // 1. Asigură-te că persistența este setată. Aceasta trebuie apelată o singură dată la inițializarea Firebase.
  // E bine să o ai aici ca o asigurare, deși ideal e să fie la un nivel mai înalt (de ex. în firebaseConfig sau la root).
  console.log('plannerCheckout: Persistența Firebase setată.');

  // 2. Obține utilizatorul Firebase, AȘTEPTÂND ca persistența să fie încărcată.
  // Această linie este cheia pentru a evita problema cu `currentUser` fiind `null` inițial.
  console.log(
    'plannerCheckout: Așteptând ca utilizatorul Firebase să fie gata...'
  );
  const user = await getFirebaseUser(); // Așteaptă aici!
  console.log(
    'plannerCheckout: Utilizatorul Firebase este gata. UID:',
    user?.uid || 'null'
  );

  if (user) {
    // Utilizator găsit (anonim sau autentificat).
    userId = user.uid;
    console.log(
      `plannerCheckout: Utilizator Firebase existent (UID: ${userId}).`
    );
  } else {
    // Nu există niciun utilizator după verificarea persistenței. Semnează anonim.
    console.log(
      'plannerCheckout: Niciun utilizator Firebase găsit, încearcă autentificarea anonimă.'
    );
    try {
      const userCredential = await signInAnonymously(firebaseAuth);
      userId = userCredential.user.uid;
      localStorage.setItem('tempFirebaseUid', userId); // Poți păstra acest lucru dacă ai nevoie de UID imediat.
      console.log(
        `plannerCheckout: Autentificat anonim cu succes. UID: ${userId}.`
      );
    } catch (anonError) {
      console.error(
        'plannerCheckout: Eroare la autentificarea anonimă:',
        anonError
      );
      alert(
        'A apărut o eroare la crearea sesiunii anonime. Te rugăm să încerci din nou.'
      );
      return; // Ieși dacă autentificarea anonimă eșuează
    }
  }

  if (!userId) {
    console.error(
      'plannerCheckout: ID-ul utilizatorului este încă null după toate încercările. Nu se poate continua.'
    );
    alert(
      'Nu s-a putut obține un ID de utilizator. Te rugăm să încerci din nou.'
    );
    return; // Nu se poate continua fără un userId
  }

  try {
    // Referința la subcolecția checkout_sessions a utilizatorului
    const checkoutSessionsRef = collection(
      db,
      'customers',
      userId, // Folosește userId-ul obținut
      'checkout_sessions'
    );

    // Adaugă un nou document pentru sesiunea de checkout
    const docRef = await addDoc(checkoutSessionsRef, {
      mode: 'payment',
      price: priceId, // Prețul unic creat în Stripe
      success_url: window.location.origin,
      cancel_url: window.location.origin,
      customer_update: {
        name: 'auto',
        address: 'auto',
      },
      metadata: {
        userId: userId,
      },
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

    // Ascultă modificările pe documentul sesiunii de checkout nou create
    const sessionDocRef = docRef; // docRef este deja o DocumentReference
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

    // Opțional, returnează unsubscribe dacă vrei să oprești ascultarea mai târziu
    return unsubscribe;
  } catch (error) {
    console.error('Eroare generală la procesul de cumpărare:', error);
    alert(
      'A apărut o eroare la procesul de cumpărare. Te rugăm să încerci din nou.'
    );
  }
};
