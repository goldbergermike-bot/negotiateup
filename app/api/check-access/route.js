import { NextResponse } from 'next/server';
import { verifyAccessToken } from '../../../lib/access-token';

export async function GET(req) {
  const token = req.cookies.get('nu_access')?.value;
  const hasAccess = verifyAccessToken(token);
  return NextResponse.json({ hasAccess });
}
