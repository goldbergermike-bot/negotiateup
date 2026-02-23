// ============================================
// SalaryPrep — Email Capture API
// ============================================
// Saves subscriber emails to Resend audience for newsletter/drip campaigns.
// Falls back to console logging if Resend audience is not configured yet.

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, source } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    console.log(`Email captured: ${cleanEmail} (source: ${source || 'unknown'})`);

    // Send to Resend audience if configured
    if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data, error } = await resend.contacts.create({
        audienceId: process.env.RESEND_AUDIENCE_ID,
        email: cleanEmail,
        unsubscribed: false,
      });

      if (error) {
        // Duplicate contact is not a real error — Resend returns 409
        if (error.statusCode === 409 || error.message?.includes('already exists')) {
          console.log(`Email ${cleanEmail} already in audience — not an error`);
          return NextResponse.json({ success: true, existing: true });
        }
        console.error('Resend audience error:', error);
        // Still return success to user — we logged the email
      } else {
        console.log(`Email ${cleanEmail} added to Resend audience: ${data?.id}`);
      }
    } else {
      console.warn('RESEND_AUDIENCE_ID not configured — email captured to logs only');
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Email capture error:', error);
    // Return success anyway — don't break UX over a newsletter signup failure
    return NextResponse.json({ success: true });
  }
}
