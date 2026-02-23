// ============================================
// SalaryPrep — Rate Limiting Middleware
// ============================================
// In-memory sliding window rate limiter for API routes.
// Limits per IP to prevent abuse of expensive AI generation and Stripe session creation.

import { NextResponse } from 'next/server';

// In-memory store: Map<ip, { count, resetTime }>
// Note: Resets on deployment/restart. For multi-instance, use Upstash Redis.
const rateLimitStore = new Map();

// Config per route pattern
const RATE_LIMITS = {
  '/api/generate-playbook': { windowMs: 60_000, maxRequests: 3 },  // 3 per minute (expensive AI call)
  '/api/create-checkout':   { windowMs: 60_000, maxRequests: 10 }, // 10 per minute
  '/api/capture-email':     { windowMs: 60_000, maxRequests: 10 }, // 10 per minute
  '/api/webhook':           { windowMs: 60_000, maxRequests: 50 }, // Stripe webhooks — generous
};

const DEFAULT_LIMIT = { windowMs: 60_000, maxRequests: 30 };

// Clean up stale entries every 5 minutes to prevent memory leak
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 300_000;

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

function getRateLimit(pathname) {
  for (const [route, config] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(route)) return config;
  }
  return DEFAULT_LIMIT;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only rate-limit API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  cleanup();

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  const { windowMs, maxRequests } = getRateLimit(pathname);
  const key = `${ip}:${pathname}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return NextResponse.next();
  }

  if (entry.count >= maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(entry.resetTime),
        },
      }
    );
  }

  entry.count++;
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
