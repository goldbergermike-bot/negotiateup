/**
 * A/B Testing Library for SalaryPrep
 *
 * Assigns visitors to experiment variants using a hash of a random cookie value.
 * Stores assignments in a cookie so they persist across visits.
 * Fires GA4 events for variant impressions.
 */

const AB_COOKIE_NAME = 'sp_ab_uid';
const AB_ASSIGNMENTS_COOKIE = 'sp_ab_assignments';

// ---- Experiment Definitions ----
export const EXPERIMENTS = {
  pricing_v1: {
    name: 'pricing_v1',
    variants: ['A', 'B'], // A = control ($39), B = $49 with "Save 50%" messaging
    weights: [0.5, 0.5],  // 50/50 split
  },
};

// ---- Cookie Helpers ----
function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, days = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

// ---- Hash Function (simple djb2) ----
function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash);
}

// ---- Generate or Retrieve User ID ----
function getUserId() {
  let uid = getCookie(AB_COOKIE_NAME);
  if (!uid) {
    uid = Math.random().toString(36).substring(2) + Date.now().toString(36);
    setCookie(AB_COOKIE_NAME, uid);
  }
  return uid;
}

// ---- Get Stored Assignments ----
function getStoredAssignments() {
  const raw = getCookie(AB_ASSIGNMENTS_COOKIE);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveAssignments(assignments) {
  setCookie(AB_ASSIGNMENTS_COOKIE, JSON.stringify(assignments));
}

// ---- Core: Get Variant for an Experiment ----
/**
 * Returns the variant assignment for a given experiment.
 * Consistently assigns the same variant to the same user.
 * Fires a GA4 event on first assignment.
 *
 * @param {string} experimentName — key from EXPERIMENTS
 * @returns {string} variant letter (e.g., 'A' or 'B')
 */
export function getVariant(experimentName) {
  const experiment = EXPERIMENTS[experimentName];
  if (!experiment) {
    console.warn(`[AB] Unknown experiment: ${experimentName}`);
    return 'A'; // default to control
  }

  // Check if already assigned
  const assignments = getStoredAssignments();
  if (assignments[experimentName]) {
    return assignments[experimentName];
  }

  // Assign based on hash of userId + experiment name
  const uid = getUserId();
  const hash = hashString(uid + ':' + experimentName);
  const normalized = (hash % 10000) / 10000; // 0.0000–0.9999

  let cumulative = 0;
  let assignedVariant = experiment.variants[experiment.variants.length - 1];
  for (let i = 0; i < experiment.variants.length; i++) {
    cumulative += experiment.weights[i];
    if (normalized < cumulative) {
      assignedVariant = experiment.variants[i];
      break;
    }
  }

  // Store assignment
  assignments[experimentName] = assignedVariant;
  saveAssignments(assignments);

  // Fire GA4 event for assignment
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'ab_assignment', {
      experiment: experimentName,
      variant: assignedVariant,
    });
  }

  return assignedVariant;
}

/**
 * Fire an A/B impression event (call this when the variant is rendered).
 *
 * @param {string} experimentName
 * @param {string} variant
 */
export function fireImpression(experimentName, variant) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'ab_impression', {
      experiment: experimentName,
      variant: variant,
    });
  }
}
