import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const VALID_TYPES = ['offer', 'raise'];

export async function POST(req) {
  try {
    const body = await req.json();
    const { type } = body;

    // ---- INPUT VALIDATION ----
    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid playbook type. Must be "offer" or "raise".' },
        { status: 400 }
      );
    }

    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment service is not configured.' },
        { status: 503 }
      );
    }

    const priceId = type === 'offer'
      ? process.env.STRIPE_PRICE_OFFER
      : process.env.STRIPE_PRICE_RAISE;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Pricing is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      allow_promotion_codes: true, // Enables promo codes like FIRST30
      line_items: [{ price: priceId, quantity: 1 }],
      // After payment, redirect to the upload form
      success_url: `${process.env.NEXT_PUBLIC_URL}/${type === 'offer' ? 'new-offer' : 'raise'}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/#pricing`,
      metadata: {
        playbook_type: type,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err.type || err.message);
    return NextResponse.json(
      { error: 'Unable to create checkout session. Please try again.' },
      { status: 500 }
    );
  }
}
