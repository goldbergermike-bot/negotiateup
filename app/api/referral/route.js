import { NextResponse } from 'next/server';
import { generateCode, saveReferral, lookupCode } from '../../../lib/referral';

/**
 * POST /api/referral — Create a new referral code for an email
 * Body: { email }
 * Returns: { code, url }
 */
export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const code = generateCode();
    const entry = saveReferral(email.trim(), code);
    const url = `https://salaryprep.com/?ref=${entry.code}`;

    return NextResponse.json({ code: entry.code, url });
  } catch (error) {
    console.error('Referral creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create referral code. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/referral?code=XXXXXX — Look up a referral code
 * Returns: { valid: true, discount: 20 } or { valid: false }
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { valid: false, error: 'No referral code provided.' },
        { status: 400 }
      );
    }

    const result = lookupCode(code.trim());

    if (!result) {
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({
      valid: result.valid,
      discount: result.discount,
    });
  } catch (error) {
    console.error('Referral lookup error:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to look up referral code.' },
      { status: 500 }
    );
  }
}
