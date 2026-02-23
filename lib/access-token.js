// ============================================
// NegotiateUp — Access Token Utility
// HMAC-signed tokens for gating research content
// ============================================

import crypto from 'crypto';

const SECRET = process.env.STRIPE_SECRET_KEY || 'dev-fallback-secret';

export function createAccessToken() {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac('sha256', SECRET).update(timestamp).digest('hex');
  return `${timestamp}.${hmac}`;
}

export function verifyAccessToken(token) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestamp, hmac] = parts;
  const expected = crypto.createHmac('sha256', SECRET).update(timestamp).digest('hex');

  // Constant-time comparison to prevent timing attacks
  if (hmac.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected));
}
