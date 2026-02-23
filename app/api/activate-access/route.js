import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAccessToken } from '../../../lib/access-token';

export async function POST(req) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 403 });
    }

    const token = createAccessToken();
    const response = NextResponse.json({ success: true });

    response.cookies.set('nu_access', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Activate access error:', err);
    return NextResponse.json({ error: 'Failed to activate access' }, { status: 500 });
  }
}
