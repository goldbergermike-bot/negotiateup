import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { type } = await req.json();

    if (type !== 'offer' && type !== 'raise') {
      return NextResponse.json({ error: 'Invalid playbook type.' }, { status: 400 });
    }

    const priceId = type === 'offer'
      ? process.env.STRIPE_PRICE_OFFER
      : process.env.STRIPE_PRICE_RAISE;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
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
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Unable to create checkout session. Please try again.' }, { status: 500 });
  }
}
