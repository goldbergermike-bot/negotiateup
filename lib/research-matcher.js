// ============================================
// SalaryPrep — Research Database Matcher
// ============================================
// Matches user-provided company names and job titles
// to the verified research database in /research/.
//
// DESIGN PRINCIPLES:
// 1. Only return matches when confidence is HIGH — no guessing
// 2. Normalize inputs aggressively (casing, suffixes, aliases)
// 3. Prefer exact/near-exact matches over fuzzy guesses
// 4. Return null when uncertain — the AI prompt handles the fallback

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const RESEARCH_DIR = path.join(process.cwd(), 'research');

// ---- COMPANY MATCHING ----

// Common aliases → directory name mappings
const COMPANY_ALIASES = {
  // Big Tech
  'aws': 'amazon',
  'amazon web services': 'amazon',
  'google cloud': 'google',
  'alphabet': 'google',
  'deepmind': 'google',
  'youtube': 'google',
  'facebook': 'meta',
  'instagram': 'meta',
  'whatsapp': 'meta',
  'reality labs': 'meta',
  'msft': 'microsoft',
  'azure': 'microsoft',
  'linkedin': 'microsoft',
  'github': 'github',

  // Fintech / Finance
  'jpmorgan': 'jpmorgan-chase',
  'jp morgan': 'jpmorgan-chase',
  'jp morgan chase': 'jpmorgan-chase',
  'chase': 'jpmorgan-chase',
  'goldman': 'goldman-sachs',
  'gs': 'goldman-sachs',
  'morgan stanley': 'morgan-stanley',
  'bofa': 'bank-of-america',
  'bank of america': 'bank-of-america',
  'amex': 'american-express',
  'american express': 'american-express',
  'cap one': 'capital-one',
  'capital one': 'capital-one',
  'charles schwab': 'charles-schwab',
  'wells fargo': 'wells-fargo',
  'interactive brokers': 'interactive-brokers',
  'jane street': 'jane-street',
  'two sigma': 'two-sigma',
  'de shaw': 'de-shaw',
  'd.e. shaw': 'de-shaw',
  'citadel': 'citadel-securities',

  // Big companies with common shorthand
  'unitedhealth': 'unitedhealth-group',
  'uhg': 'unitedhealth-group',
  'united health': 'unitedhealth-group',
  'walmart': 'walmart-global-tech',
  'walmart labs': 'walmart-global-tech',
  'walmart tech': 'walmart-global-tech',
  'wmt': 'walmart-global-tech',
  'palo alto': 'palo-alto-networks',
  'palo alto networks': 'palo-alto-networks',
  'pan': 'palo-alto-networks',
  'warner bros': 'warner-bros-discovery',
  'wbd': 'warner-bros-discovery',
  'warner bros discovery': 'warner-bros-discovery',
  'ally': 'ally-financial',
  'ally bank': 'ally-financial',

  // AI companies
  'open ai': 'openai',
  'open-ai': 'openai',
  'scale': 'scale-ai',
  'stability': 'stability-ai',
  'character': 'character-ai',
  'together': 'together-ai',
  'cohere ai': 'cohere',
  'harvey': 'harvey-ai',
  'mistral': 'mistral-ai',
  'adept': 'adept-ai',
  'inflection': 'inflection-ai',
  'weights & biases': 'weights-and-biases',
  'weights and biases': 'weights-and-biases',
  'wandb': 'weights-and-biases',
  'hugging face': 'hugging-face',
  'huggingface': 'hugging-face',
  'sambanova': 'sambanova',
  'x.ai': 'xai',
  'x ai': 'xai',

  // Marketplace / Delivery
  'doordash': 'doordash',
  'door dash': 'doordash',

  // Telecom
  'at&t': 'att',
  'at & t': 'att',
  't mobile': 't-mobile',
  'tmobile': 't-mobile',

  // Misc common aliases
  'activision': 'activision-blizzard',
  'blizzard': 'activision-blizzard',
  'activision blizzard': 'activision-blizzard',
  'take two': 'take-two-interactive',
  'take-two': 'take-two-interactive',
  'epic': 'epic-games',
  'electronic arts': 'electronic-arts',
  'ea': 'electronic-arts',
  'monday.com': 'monday-com',
  'monday': 'monday-com',
  'bill.com': 'bill-com',
  'remote.com': 'remote-com',
  'aurora': 'aurora-innovation',
  'andreessen': 'andreessen-horowitz',
  'a16z': 'andreessen-horowitz',
  'bridgewater': 'bridgewater-associates',
  'renaissance': 'renaissance-technologies',
  'rentec': 'renaissance-technologies',
  'northrop': 'northrop-grumman',
  'northrop grumman': 'northrop-grumman',
  'check point': 'check-point',
  'checkpoint': 'check-point',
  'splunk': 'splunk-cisco',
  'mercado libre': 'mercado-libre',
  'mercadolibre': 'mercado-libre',
};

/**
 * Normalize a company name for matching:
 * - lowercase
 * - strip suffixes (Inc, Corp, LLC, Ltd, etc.)
 * - trim whitespace
 * - collapse multiple spaces
 */
function normalizeCompany(name) {
  return name
    .toLowerCase()
    .replace(/[,.]|(\b(inc|corp|corporation|llc|ltd|limited|co|company|group|technologies|technology|systems|labs|laboratory|laboratories)\b)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Convert a normalized name to a directory-style slug
 * e.g., "palo alto networks" → "palo-alto-networks"
 */
function slugify(name) {
  return name
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Cached list of company directory names.
 * TTL-based cache: refreshes every 5 minutes so new companies
 * are picked up without a server restart.
 */
let _companyDirs = null;
let _companyDirsCacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCompanyDirs() {
  const now = Date.now();
  if (_companyDirs && (now - _companyDirsCacheTime) < CACHE_TTL_MS) {
    return _companyDirs;
  }
  try {
    _companyDirs = fs.readdirSync(RESEARCH_DIR).filter((entry) => {
      const fullPath = path.join(RESEARCH_DIR, entry);
      return fs.statSync(fullPath).isDirectory();
    });
    _companyDirsCacheTime = now;
  } catch {
    _companyDirs = [];
  }
  return _companyDirs;
}

/**
 * Match a user-provided company name to a research directory.
 *
 * Returns { directory, confidence } or null if no confident match.
 * confidence: 'exact' | 'alias' | 'slug' | 'partial'
 *
 * We ONLY return 'partial' matches when the input is a clear substring
 * of exactly one directory. If ambiguous, we return null.
 */
export function matchCompany(userCompany) {
  if (!userCompany || typeof userCompany !== 'string') return null;

  const normalized = normalizeCompany(userCompany);
  if (!normalized) return null;

  const dirs = getCompanyDirs();

  // 1. Check aliases first (highest priority — curated mappings)
  if (COMPANY_ALIASES[normalized]) {
    const dir = COMPANY_ALIASES[normalized];
    if (dirs.includes(dir)) {
      return { directory: dir, confidence: 'alias' };
    }
  }

  // 2. Exact directory name match
  const slug = slugify(normalized);
  if (dirs.includes(slug)) {
    return { directory: slug, confidence: 'exact' };
  }

  // 3. Check if normalized name matches after slugifying all dirs
  //    (handles minor differences like extra hyphens)
  for (const dir of dirs) {
    if (dir === slug) {
      return { directory: dir, confidence: 'exact' };
    }
  }

  // 4. Partial match — only if input is contained in exactly ONE directory
  //    or exactly ONE directory is contained in input
  const inputContainedIn = dirs.filter((dir) => dir.includes(slug) || slug.includes(dir));

  if (inputContainedIn.length === 1) {
    return { directory: inputContainedIn[0], confidence: 'partial' };
  }

  // 5. No confident match — return null rather than guess
  return null;
}

// ---- ROLE MATCHING ----

// Maps common job title keywords → research file base names (without .md)
const ROLE_MAPPINGS = [
  // Order matters — more specific patterns first
  { patterns: ['staff software', 'staff swe', 'staff eng', 'staff developer', 'principal engineer', 'principal software'], file: 'staff-software-engineer' },
  { patterns: ['senior software', 'senior swe', 'senior eng', 'sr software', 'sr. software', 'sr swe', 'sr. swe', 'sde iii', 'sde3', 'senior developer', 'senior full stack', 'senior fullstack', 'senior backend', 'senior frontend', 'software engineer iii'], file: 'senior-software-engineer' },
  { patterns: ['engineering manager', 'eng manager', 'software engineering manager', 'development manager', 'engineering lead'], file: 'engineering-manager' },
  { patterns: ['technical program manager', 'tpm', 'tech program manager'], file: 'technical-program-manager' },
  { patterns: ['product manager', 'pm', 'product lead'], file: 'product-manager' },
  { patterns: ['product designer', 'ux designer', 'ui designer', 'design lead', 'ux/ui', 'ui/ux'], file: 'product-designer' },
  { patterns: ['ml engineer', 'machine learning engineer', 'ai engineer', 'ml/ai', 'ai/ml', 'ml ai', 'ai ml', 'applied scientist'], file: 'ml-ai-engineer' },
  { patterns: ['data scientist', 'data science', 'research scientist'], file: 'data-scientist' },
  { patterns: ['data engineer', 'data platform', 'analytics engineer', 'data infrastructure'], file: 'data-engineer' },
  { patterns: ['devops', 'dev ops', 'site reliability', 'sre', 'platform engineer', 'infrastructure engineer', 'cloud engineer'], file: 'devops-engineer' },
  { patterns: ['security engineer', 'appsec', 'application security', 'infosec', 'information security', 'cybersecurity', 'cyber security'], file: 'security-engineer' },
  { patterns: ['solutions architect', 'solution architect', 'sa ', 'technical architect', 'enterprise architect'], file: 'solutions-architect' },
  // Generic software engineer — LAST so it doesn't override more specific matches
  { patterns: ['software engineer', 'software developer', 'sde', 'swe', 'developer', 'full stack', 'fullstack', 'backend engineer', 'frontend engineer', 'web developer', 'software eng'], file: 'software-engineer' },
];

/**
 * Match a user-provided job title to a research file name.
 *
 * Returns the filename (without .md) or null if no match.
 * Uses keyword matching against known patterns.
 */
export function matchRole(userTitle) {
  if (!userTitle || typeof userTitle !== 'string') return null;

  const normalized = userTitle.toLowerCase().trim();
  if (!normalized) return null;

  for (const mapping of ROLE_MAPPINGS) {
    for (const pattern of mapping.patterns) {
      if (normalized.includes(pattern)) {
        return mapping.file;
      }
    }
  }

  return null;
}

// ---- RESEARCH LOADER ----

/**
 * Load a research file for a given company directory and role file name.
 *
 * Returns { metadata, content, raw } where:
 *   - metadata: parsed YAML frontmatter as an object
 *   - content: the markdown body (without frontmatter)
 *   - raw: the full file contents including frontmatter
 * Returns null if the file is not found or cannot be read.
 */
export function loadResearchFile(companyDir, roleFile) {
  if (!companyDir || !roleFile) return null;

  const filePath = path.join(RESEARCH_DIR, companyDir, `${roleFile}.md`);

  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data: metadata, content } = matter(raw);
    return { metadata, content, raw };
  } catch {
    return null;
  }
}

/**
 * List all available role files for a given company directory.
 * Useful for finding company-specific specialty roles.
 */
export function listCompanyRoles(companyDir) {
  if (!companyDir) return [];

  const dirPath = path.join(RESEARCH_DIR, companyDir);

  try {
    if (!fs.existsSync(dirPath)) return [];
    return fs.readdirSync(dirPath)
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace('.md', ''));
  } catch {
    return [];
  }
}

/**
 * Try to find the best matching research file for a company-specific role.
 * First checks standard role mappings, then scans company-specific files
 * for a keyword match.
 */
function matchCompanySpecificRole(companyDir, userTitle) {
  if (!companyDir || !userTitle) return null;

  const normalized = userTitle.toLowerCase().trim();
  const companyRoles = listCompanyRoles(companyDir);

  // Check if any company-specific file name matches keywords from the title
  for (const role of companyRoles) {
    // Skip standard roles (already handled by matchRole)
    const standardRoles = [
      'software-engineer', 'senior-software-engineer', 'staff-software-engineer',
      'data-engineer', 'data-scientist', 'devops-engineer', 'engineering-manager',
      'ml-ai-engineer', 'product-designer', 'product-manager', 'security-engineer',
      'solutions-architect', 'technical-program-manager',
    ];
    if (standardRoles.includes(role)) continue;

    // Convert role filename to keywords: "aws-ai-platform-engineer" → ["aws", "ai", "platform", "engineer"]
    const roleWords = role.split('-');
    // Check if the user title contains most of the significant role words
    const significantWords = roleWords.filter((w) => w.length > 2 && w !== 'engineer' && w !== 'platform');
    if (significantWords.length === 0) continue;

    const matchCount = significantWords.filter((w) => normalized.includes(w)).length;
    if (matchCount >= significantWords.length * 0.6 && matchCount >= 2) {
      return role;
    }
  }

  return null;
}

// ---- MAIN ENTRY POINT ----

/**
 * Look up research data for a user's company + job title.
 *
 * Returns:
 *   { content, metadata, raw, company, role, matchType } on success
 *   null if no confident match
 *
 * - content: markdown body (without frontmatter)
 * - metadata: parsed YAML frontmatter object (compensation, data_quality, etc.)
 * - raw: full file contents including frontmatter
 * - matchType: 'exact' | 'alias' | 'standard-role' | 'company-specific-role'
 */
export function lookupResearch(companyName, jobTitle) {
  // Step 1: Match company
  const companyMatch = matchCompany(companyName);
  if (!companyMatch) return null;

  // Step 2: Match role — try standard mapping first, then company-specific
  let roleFile = matchRole(jobTitle);
  let matchType = roleFile ? 'standard-role' : null;

  if (!roleFile) {
    roleFile = matchCompanySpecificRole(companyMatch.directory, jobTitle);
    matchType = roleFile ? 'company-specific-role' : null;
  }

  if (!roleFile) return null;

  // Step 3: Load the file (now returns { metadata, content, raw })
  const result = loadResearchFile(companyMatch.directory, roleFile);
  if (!result) return null;

  return {
    content: result.content,
    metadata: result.metadata,
    raw: result.raw,
    company: companyMatch.directory,
    companyConfidence: companyMatch.confidence,
    role: roleFile,
    matchType,
  };
}
