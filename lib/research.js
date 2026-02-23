import fs from 'fs';
import path from 'path';

const RESEARCH_DIR = path.join(process.cwd(), 'research');

/**
 * Returns all company slugs (directory names) from /research/
 * Excludes hidden directories like .claude
 */
export function getAllCompanies() {
  return fs.readdirSync(RESEARCH_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
    .map(d => d.name)
    .sort();
}

/**
 * Returns all role slugs for a given company
 * e.g. getRolesForCompany('google') => ['data-engineer', 'data-scientist', ...]
 */
export function getRolesForCompany(company) {
  const companyDir = path.join(RESEARCH_DIR, company);
  if (!fs.existsSync(companyDir)) return [];
  return fs.readdirSync(companyDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''))
    .sort();
}

/**
 * Reads and returns the raw markdown content for a company/role.
 * Returns null if file does not exist (no hallucination — only real files).
 */
export function getResearchContent(company, role) {
  const filePath = path.join(RESEARCH_DIR, company, `${role}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Extracts metadata from the markdown content.
 * Parses:
 *   Line 1: "### Software Engineer (L3-L4) | Google Global Negotiation Guide"
 *   DNA line: "**Negotiation DNA:** Elite hiring bar + ..."
 *
 * Returns { roleTitle, companyName, negotiationDna }
 */
export function extractMetadata(markdown) {
  if (!markdown) return { roleTitle: '', companyName: '', negotiationDna: '' };

  const lines = markdown.split('\n');

  // Line 1: "### Role Title | Company Global Negotiation Guide"
  const titleLine = (lines[0] || '').replace(/^###\s*/, '').trim();
  const pipeIndex = titleLine.indexOf('|');
  let roleTitle = '';
  let companyName = '';

  if (pipeIndex !== -1) {
    roleTitle = titleLine.slice(0, pipeIndex).trim();
    companyName = titleLine.slice(pipeIndex + 1).replace('Global Negotiation Guide', '').trim();
  } else {
    roleTitle = titleLine;
  }

  // Find the "**Negotiation DNA:**" summary line (usually line 3)
  const dnaLine = lines.find(l => l.startsWith('**Negotiation DNA:**'));
  let negotiationDna = '';
  if (dnaLine) {
    negotiationDna = dnaLine
      .replace('**Negotiation DNA:**', '')
      .replace(/\*\*/g, '')  // strip any remaining bold markers
      .trim();
  }

  return { roleTitle, companyName, negotiationDna };
}

/**
 * Converts kebab-case slug to Title Case.
 * Handles common acronyms (AI, ML, AWS, etc.)
 * Used as a fallback — prefer extractMetadata() for display names.
 */
export function slugToTitle(slug) {
  const acronyms = new Set([
    'ai', 'ml', 'aws', 'gcp', 'api', 'os', 'ipo', 'io',
    'ui', 'ux', 'cto', 'ceo', 'cfo', 'hr', 'qa', 'devops',
    'xdr', 'vrp', 'rsu', 'llm', 'nft', 'b2b', 'b2c',
  ]);
  return slug
    .split('-')
    .map(word => acronyms.has(word) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Returns ALL company+role pairs for generateStaticParams.
 * Called once at build time to enumerate every page.
 */
export function getAllCompanyRolePairs() {
  const companies = getAllCompanies();
  const pairs = [];
  for (const company of companies) {
    const roles = getRolesForCompany(company);
    for (const role of roles) {
      pairs.push({ company, role });
    }
  }
  return pairs;
}

// ============================================
// D2: Fuzzy Matching for Playbook Generation
// ============================================

// Common suffixes to strip from user-entered company names
const COMPANY_SUFFIXES = [
  'global tech', 'technologies', 'technology', 'corporation',
  'holdings', 'incorporated', 'limited', 'company',
  'group', 'labs', 'tech', 'corp', 'inc', 'llc', 'ltd', 'co',
];

/**
 * Matches free-text company name to a research directory slug.
 * e.g. "Google" → "google", "Google LLC" → "google",
 *      "Warner Bros Discovery" → "warner-bros-discovery"
 * Returns null if no match found (graceful degradation).
 */
export function findCompanySlug(companyName) {
  if (!companyName || typeof companyName !== 'string') return null;

  // Normalize: lowercase, trim
  let normalized = companyName.trim().toLowerCase();

  // Strip common suffixes (longest first to avoid partial matches)
  for (const suffix of COMPANY_SUFFIXES) {
    if (normalized.endsWith(` ${suffix}`)) {
      normalized = normalized.slice(0, -(suffix.length + 1)).trim();
    }
  }

  // Convert to slug: non-alphanumeric → hyphens, collapse, strip edges
  const slug = normalized
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!slug) return null;

  const companies = getAllCompanies();

  // 1. Exact match
  if (companies.includes(slug)) return slug;

  // 2. Slug prefix/contains matching
  //    e.g. "meta" matches "meta", "warner-bros" matches "warner-bros-discovery"
  for (const company of companies) {
    if (company.startsWith(slug + '-')) return company;
    if (slug.startsWith(company + '-')) return company;
  }

  // 2b. Hyphen-stripped matching for merged names
  //     e.g. "jp-morgan" → "jpmorgan" matches "jpmorgan-chase" → "jpmorganchase"
  const slugFlat = slug.replace(/-/g, '');
  for (const company of companies) {
    const companyFlat = company.replace(/-/g, '');
    if (companyFlat.startsWith(slugFlat) || slugFlat.startsWith(companyFlat)) return company;
  }

  // 3. Token overlap: split both into words, find best overlap
  const slugTokens = slug.split('-');
  let bestMatch = null;
  let bestScore = 0;

  for (const company of companies) {
    const companyTokens = company.split('-');
    const matches = slugTokens.filter(t => companyTokens.includes(t)).length;
    const score = matches / Math.max(slugTokens.length, companyTokens.length);
    if (matches >= 1 && score > bestScore) {
      bestScore = score;
      bestMatch = company;
    }
  }

  // Require at least 50% token overlap to avoid false positives
  if (bestMatch && bestScore >= 0.5) return bestMatch;

  return null;
}

/**
 * Matches a free-text job title to the closest available role file for a company.
 * e.g. "Software Engineer" + google → "software-engineer"
 *      "Senior SWE" + google → "senior-software-engineer"
 * Returns null if no confident match (graceful degradation).
 */
export function findBestRoleMatch(companySlug, jobTitle) {
  if (!companySlug || !jobTitle || typeof jobTitle !== 'string') return null;

  const roles = getRolesForCompany(companySlug);
  if (roles.length === 0) return null;

  // Normalize job title to slug format
  const normalized = jobTitle.trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!normalized) return null;

  // 1. Exact match
  if (roles.includes(normalized)) return normalized;

  // 2. Expand common abbreviations before matching
  const expansions = {
    'swe': 'software-engineer',
    'sde': 'software-engineer',
    'pm': 'product-manager',
    'tpm': 'technical-program-manager',
    'em': 'engineering-manager',
    'ds': 'data-scientist',
    'de': 'data-engineer',
    'ml': 'ml-ai-engineer',
    'devops': 'devops-engineer',
    'seceng': 'security-engineer',
  };

  const expanded = expansions[normalized];
  if (expanded && roles.includes(expanded)) return expanded;

  // 3. Token-based scoring
  const inputTokens = normalized.split('-');
  let bestMatch = null;
  let bestScore = 0;
  let bestMatchLength = Infinity;

  for (const role of roles) {
    const roleTokens = role.split('-');
    const matches = inputTokens.filter(t => roleTokens.includes(t)).length;

    if (matches === 0) continue;

    // Score: proportion of input tokens matched, weighted by role specificity
    // Prefer exact-length matches over partial matches of longer roles
    const score = matches / inputTokens.length;

    if (score > bestScore || (score === bestScore && roleTokens.length < bestMatchLength)) {
      bestScore = score;
      bestMatch = role;
      bestMatchLength = roleTokens.length;
    }
  }

  // Require at least 50% of input tokens to match
  if (bestMatch && bestScore >= 0.5) return bestMatch;

  return null;
}
