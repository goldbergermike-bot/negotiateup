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
