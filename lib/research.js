// ============================================
// SalaryPrep — Research Data Parser
// Reads 323 company folders from /research
// ============================================

import fs from 'fs';
import path from 'path';

const RESEARCH_DIR = path.join(process.cwd(), 'research');

// Parse a role markdown file into structured data
function parseRoleMarkdown(content, companySlug, roleSlug) {
  const lines = content.split('\n');

  // Extract title from H3 (### Title | Company)
  const titleLine = lines.find(l => l.startsWith('### '));
  const title = titleLine ? titleLine.replace('### ', '').trim() : formatRoleName(roleSlug);

  // Extract the role name (before the |)
  const roleName = titleLine ? titleLine.replace('### ', '').split('|')[0].trim() : formatRoleName(roleSlug);

  // Extract Negotiation DNA summary (bold line after title)
  const dnaLine = lines.find(l => l.startsWith('**Negotiation DNA:**'));
  const dnaSummary = dnaLine ? dnaLine.replace('**Negotiation DNA:**', '').trim() : '';

  // Extract salary table
  const salaryTable = extractSalaryTable(lines);

  // Extract Negotiation DNA body text (paragraph after "**Negotiation DNA**" heading)
  const dnaBody = extractSection(lines, '**Negotiation DNA**');

  // Extract Level Mapping
  const levelLine = lines.find(l => l.startsWith('**Level Mapping:**'));
  const levelMapping = levelLine ? levelLine.replace('**Level Mapping:**', '').trim() : '';

  // Extract Global Levers (numbered list)
  const levers = extractLevers(lines);

  // Extract Negotiate Up Strategy (blockquote)
  const strategy = extractStrategy(lines);

  return {
    companySlug,
    roleSlug,
    title,
    roleName,
    dnaSummary,
    salaryTable,
    dnaBody,
    levelMapping,
    levers,
    strategy,
  };
}

function extractSalaryTable(lines) {
  const rows = [];
  let inTable = false;

  for (const line of lines) {
    if (line.startsWith('| Region') || line.startsWith('| ---')) {
      inTable = true;
      continue;
    }
    if (inTable && line.startsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length >= 4) {
        rows.push({
          region: cells[0],
          base: cells[1],
          stock: cells[2],
          bonus: cells[3],
          totalComp: cells[4] || '',
        });
      }
    } else if (inTable && !line.startsWith('|')) {
      break;
    }
  }
  return rows;
}

function extractSection(lines, heading) {
  let capture = false;
  let text = [];

  for (let i = 0; i < lines.length; i++) {
    // Match standalone heading (not the inline DNA summary)
    if (lines[i].trim() === heading) {
      capture = true;
      continue;
    }
    if (capture) {
      // Stop at next heading or section
      if (lines[i].startsWith('**') && lines[i].endsWith('**') && lines[i] !== heading) break;
      if (lines[i].startsWith('### ')) break;
      if (lines[i].startsWith('> ')) break;
      if (text.length > 0 && lines[i].startsWith('1. ')) break;
      if (lines[i].trim()) text.push(lines[i].trim());
    }
  }
  return text.join('\n\n');
}

function extractLevers(lines) {
  const levers = [];
  let inLevers = false;

  for (const line of lines) {
    if (line.trim() === '**Global Levers**') {
      inLevers = true;
      continue;
    }
    if (inLevers) {
      const match = line.match(/^\d+\.\s+\*\*(.+?)\*\*\s*[:：]\s*"(.+)"$/);
      if (match) {
        levers.push({ name: match[1], script: match[2] });
      } else if (line.startsWith('>') || (line.startsWith('**') && line !== '**Global Levers**')) {
        break;
      }
    }
  }
  return levers;
}

function extractStrategy(lines) {
  const strategyLines = [];
  let inStrategy = false;

  for (const line of lines) {
    if (line.startsWith('> **Negotiate Up Strategy:**')) {
      inStrategy = true;
      strategyLines.push(line.replace('> **Negotiate Up Strategy:**', '').trim().replace(/^"/, ''));
      continue;
    }
    if (inStrategy) {
      if (line.startsWith('>')) {
        strategyLines.push(line.replace(/^>\s?/, ''));
      } else {
        break;
      }
    }
  }
  return strategyLines.join(' ').replace(/"$/, '').trim();
}

function formatRoleName(slug) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bMl\b/g, 'ML')
    .replace(/\bSwe\b/g, 'SWE')
    .replace(/\bDevops\b/g, 'DevOps')
    .replace(/\bSre\b/g, 'SRE');
}

function formatCompanyName(slug) {
  // Handle common special cases
  const specialNames = {
    'google': 'Google', 'amazon': 'Amazon', 'meta': 'Meta', 'apple': 'Apple',
    'microsoft': 'Microsoft', 'nvidia': 'NVIDIA', 'netflix': 'Netflix',
    'salesforce': 'Salesforce', 'stripe': 'Stripe', 'airbnb': 'Airbnb',
    'uber': 'Uber', 'lyft': 'Lyft', 'spotify': 'Spotify', 'adobe': 'Adobe',
    'coinbase': 'Coinbase', 'snowflake': 'Snowflake', 'databricks': 'Databricks',
    'palantir': 'Palantir', 'shopify': 'Shopify', 'twilio': 'Twilio',
    'crowdstrike': 'CrowdStrike', 'datadog': 'Datadog', 'mongodb': 'MongoDB',
    'hubspot': 'HubSpot', 'pagerduty': 'PagerDuty', 'hashicorp': 'HashiCorp',
    'github': 'GitHub', 'gitlab': 'GitLab', 'atlassian': 'Atlassian',
    'ibm': 'IBM', 'sap': 'SAP', 'asml': 'ASML', 'amd': 'AMD', 'arm': 'Arm',
    'tsmc': 'TSMC', 'jpmorgan': 'JPMorgan', 'goldman-sachs': 'Goldman Sachs',
    'morgan-stanley': 'Morgan Stanley', 'blackrock': 'BlackRock',
    'mckinsey': 'McKinsey', 'bcg': 'BCG', 'bain': 'Bain',
    'deloitte': 'Deloitte', 'pwc': 'PwC', 'ey': 'EY', 'kpmg': 'KPMG',
    'openai': 'OpenAI', 'anthropic': 'Anthropic', 'deepmind': 'DeepMind',
    'bytedance': 'ByteDance', 'tiktok': 'TikTok',
  };

  if (specialNames[slug]) return specialNames[slug];

  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bIo\b/g, 'IO');
}

// Classify company into industry based on slug
function classifyIndustry(slug) {
  const tech = ['google', 'amazon', 'meta', 'apple', 'microsoft', 'nvidia', 'netflix', 'salesforce', 'adobe', 'spotify', 'uber', 'lyft', 'airbnb', 'doordash', 'pinterest', 'snap', 'twitter', 'reddit', 'discord', 'slack', 'zoom', 'dropbox', 'box', 'notion', 'figma', 'canva', 'stripe', 'shopify', 'twilio', 'datadog', 'crowdstrike', 'snowflake', 'databricks', 'mongodb', 'confluent', 'elastic', 'hashicorp', 'cloudflare', 'fastly', 'akamai', 'pagerduty', 'splunk', 'hubspot', 'zendesk', 'atlassian', 'github', 'gitlab', 'oracle', 'ibm', 'sap', 'vmware', 'cisco', 'intel', 'amd', 'arm', 'qualcomm', 'broadcom', 'asml', 'tsmc', 'samsung', 'bytedance', 'tiktok', 'roblox', 'unity', 'epic', 'activision-blizzard', 'robinhood', 'coinbase', 'ripple', 'openai', 'anthropic', 'deepmind', 'cohere', 'mistral', 'perplexity', 'huggingface', 'stability', 'tesla', 'rivian', 'spacex', 'palantir', 'anduril', 'instacart', 'toast', 'block', 'square', 'plaid', 'marqeta'];
  const finance = ['goldman-sachs', 'morgan-stanley', 'jpmorgan', 'blackrock', 'blackstone', 'citadel', 'citadel-securities', 'two-sigma', 'de-shaw', 'jane-street', 'bridgewater', 'kkr', 'carlyle', 'apollo', 'bank-of-america', 'citigroup', 'barclays', 'ubs', 'credit-suisse', 'deutsche-bank', 'hsbc', 'wells-fargo', 'charles-schwab', 'fidelity', 'vanguard', 'capital-one', 'american-express', 'visa', 'mastercard', 'paypal', 'sofi', 'chime', 'klarna', 'revolut', 'wise', 'affirm', 'brex'];
  const consulting = ['mckinsey', 'bcg', 'bain', 'deloitte', 'pwc', 'ey', 'kpmg', 'accenture', 'booz-allen', 'oliver-wyman'];
  const healthcare = ['unitedhealth', 'johnson-johnson', 'pfizer', 'abbvie', 'merck', 'eli-lilly', 'amgen', 'gilead', 'regeneron', 'moderna', 'cerner', 'epic-health', 'veeva'];

  if (tech.some(t => slug.includes(t))) return 'Technology';
  if (finance.some(f => slug.includes(f))) return 'Finance';
  if (consulting.some(c => slug.includes(c))) return 'Consulting';
  if (healthcare.some(h => slug.includes(h))) return 'Healthcare';
  return 'Technology'; // default
}

// Get all company slugs from research directory
export function getResearchCompanies() {
  if (!fs.existsSync(RESEARCH_DIR)) return [];

  return fs.readdirSync(RESEARCH_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();
}

// Get all roles for a company
export function getCompanyRoles(companySlug) {
  const companyDir = path.join(RESEARCH_DIR, companySlug);
  if (!fs.existsSync(companyDir)) return [];

  return fs.readdirSync(companyDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''))
    .sort();
}

// Get parsed role data
export function getRoleData(companySlug, roleSlug) {
  const filePath = path.join(RESEARCH_DIR, companySlug, `${roleSlug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, 'utf-8');
  return parseRoleMarkdown(content, companySlug, roleSlug);
}

// Get raw markdown for a role
export function getRoleMarkdown(companySlug, roleSlug) {
  const filePath = path.join(RESEARCH_DIR, companySlug, `${roleSlug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf-8');
}

// Build a company summary from its research folder
export function getResearchCompanySummary(companySlug) {
  const roles = getCompanyRoles(companySlug);
  if (roles.length === 0) return null;

  // Read first role to get a sense of comp ranges
  const firstRole = getRoleData(companySlug, roles[0]);
  const companyName = formatCompanyName(companySlug);

  return {
    slug: companySlug,
    name: companyName,
    industry: classifyIndustry(companySlug),
    roleCount: roles.length,
    roles: roles.map(r => ({
      slug: r,
      name: formatRoleName(r),
    })),
  };
}

// Get all research companies with summaries
export function getAllResearchCompanies() {
  return getResearchCompanies().map(slug => getResearchCompanySummary(slug)).filter(Boolean);
}

// Generate all [company, role] pairs for static params
export function getAllCompanyRolePairs() {
  const pairs = [];
  const companies = getResearchCompanies();

  for (const companySlug of companies) {
    const roles = getCompanyRoles(companySlug);
    for (const roleSlug of roles) {
      pairs.push({ company: companySlug, role: roleSlug });
    }
  }
  return pairs;
}
