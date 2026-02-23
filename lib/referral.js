/**
 * Referral Program Utilities for SalaryPrep
 *
 * Manages referral codes, storage, and conversion tracking.
 * Data is stored in /data/referrals.json.
 */

import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'referrals.json');

// ---- Ensure Data File Exists ----
function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
  }
}

// ---- Read All Referrals ----
function readReferrals() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// ---- Write All Referrals ----
function writeReferrals(referrals) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(referrals, null, 2), 'utf-8');
}

/**
 * Generate a 6-character random alphanumeric code.
 * @returns {string} e.g. "X7K2M9"
 */
export function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No ambiguous chars (0/O, 1/I/L)
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Save a new referral entry for an email.
 * If the email already has a code, returns the existing one.
 *
 * @param {string} email — referrer's email
 * @param {string} code — 6-char referral code
 * @returns {{ email: string, code: string, createdAt: string }}
 */
export function saveReferral(email, code) {
  const referrals = readReferrals();

  // Check if email already has a code
  const existing = referrals.find(
    (r) => r.email.toLowerCase() === email.toLowerCase()
  );
  if (existing) {
    return existing;
  }

  // Check for code collision (extremely unlikely but handle it)
  const codeExists = referrals.find((r) => r.code === code);
  if (codeExists) {
    // Regenerate
    code = generateCode();
  }

  const entry = {
    email: email.toLowerCase(),
    code,
    createdAt: new Date().toISOString(),
    conversions: [],
    credits: 0,
  };

  referrals.push(entry);
  writeReferrals(referrals);
  return entry;
}

/**
 * Look up a referral by code.
 *
 * @param {string} code — 6-char referral code
 * @returns {{ valid: boolean, discount: number, referrerEmail?: string } | null}
 */
export function lookupCode(code) {
  if (!code) return null;

  const referrals = readReferrals();
  const entry = referrals.find(
    (r) => r.code.toUpperCase() === code.toUpperCase()
  );

  if (!entry) return null;

  return {
    valid: true,
    discount: 20, // 20% off for referred customers
    referrerEmail: entry.email,
  };
}

/**
 * Record a conversion when a referred customer makes a purchase.
 *
 * @param {string} code — the referral code used
 * @param {string} buyerEmail — the buyer's email
 * @returns {boolean} success
 */
export function recordConversion(code, buyerEmail) {
  if (!code || !buyerEmail) return false;

  const referrals = readReferrals();
  const entry = referrals.find(
    (r) => r.code.toUpperCase() === code.toUpperCase()
  );

  if (!entry) return false;

  // Check if this buyer already converted (prevent double credit)
  const alreadyConverted = entry.conversions.some(
    (c) => c.buyerEmail.toLowerCase() === buyerEmail.toLowerCase()
  );
  if (alreadyConverted) return false;

  entry.conversions.push({
    buyerEmail: buyerEmail.toLowerCase(),
    convertedAt: new Date().toISOString(),
  });
  entry.credits = (entry.credits || 0) + 5; // $5 credit per referral

  writeReferrals(referrals);
  return true;
}
