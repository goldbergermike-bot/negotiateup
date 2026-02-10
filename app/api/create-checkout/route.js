import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { type } = await req.json(); // 'offer' or 'raise'

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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
