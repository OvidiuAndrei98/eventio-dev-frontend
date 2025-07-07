import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { doc, getDoc } from 'firebase/firestore';
import db from '@/lib/firebase/fireStore';

// Inițializează Stripe AICI, pe server, unde cheia este disponibilă
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Funcția GET a rutei tale API
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');
  const userId = searchParams.get('user_id');

  if (!sessionId || !userId) {
    return NextResponse.json(
      { error: 'ID-urile sunt obligatorii.' },
      { status: 400 }
    );
  }

  try {
    const customerId = userId;
    const sessionDocId = sessionId;

    const sessionRef = doc(
      db,
      'customers',
      customerId,
      'checkout_sessions',
      sessionDocId
    );

    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
      return NextResponse.json(
        { error: 'Sesiunea nu a fost găsită în Firestore.' },
        { status: 404 }
      );
    }

    const data = sessionSnap.data();
    const stripeSessionId = data?.sessionId ?? null;

    if (!stripeSessionId) {
      return NextResponse.json(
        { error: 'sessionId lipsă în documentul Firestore.' },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(stripeSessionId);

    const customerEmail = session.customer_details?.email ?? null;

    return NextResponse.json({ email: customerEmail });
  } catch (error) {
    console.error('Eroare în API Route:', error.message);
    return NextResponse.json(
      { error: 'Eroare internă de server.' },
      { status: 500 }
    );
  }
}
