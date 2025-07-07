import { NextResponse } from 'next/server';
import Stripe from 'stripe';

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
    const sessionId = await getSessionIdFromFirestore(customerId, sessionDocId);

    console.log('ID-ul sesiunii Stripe:', sessionId);

    if (!sessionId) {
      return NextResponse.json(
        { error: 'ID-ul sesiunii Stripe lipsește.' },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log('Detalii sesiune Stripe:', session);

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
