// ============================================
// NegotiateUp — Admin Stats API
// ============================================

import { NextResponse } from 'next/server';
import { getStats } from '../../../lib/analytics';

export async function GET(req) {
  // Simple auth via query param — replace with proper auth in production
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  if (key !== (process.env.ADMIN_KEY || 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stats = await getStats();
  return NextResponse.json(stats);
}
