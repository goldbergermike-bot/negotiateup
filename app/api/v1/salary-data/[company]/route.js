// ============================================
// SalaryPrep — Partner API: Salary Data (Dynamic Route)
// ============================================
// GET /api/v1/salary-data/google
// GET /api/v1/salary-data/google?role=software-engineer
//
// Alias for /api/v1/salary-data?company=google&role=software-engineer
// Returns ONLY data parsed from markdown research files.

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseResearchFile } from '../../../../../lib/markdown-parser';

// ── Rate Limiter ─────────────────────────────────────────

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 100;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS * 2) {
      rateLimitMap.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW_MS * 5);

// ── Helpers ──────────────────────────────────────────────

function formatCompanyName(slug) {
  const special = {
    'amd': 'AMD', 'att': 'AT&T', 'bcg': 'BCG', 'hsbc': 'HSBC',
    'jpmorgan-chase': 'JPMorgan Chase', 'openai': 'OpenAI', 'pwc': 'PwC',
    'tsmc': 'TSMC', 'ubs': 'UBS', 'xai': 'xAI', 't-mobile': 'T-Mobile',
    'bill-com': 'Bill.com', 'monday-com': 'Monday.com', 'c3-ai': 'C3.ai',
    'fly-io': 'Fly.io', 'de-shaw': 'D.E. Shaw', 'dbt-labs': 'dbt Labs',
    'weights-and-biases': 'Weights & Biases', 'american-express': 'American Express',
    'bank-of-america': 'Bank of America', 'capital-one': 'Capital One',
    'goldman-sachs': 'Goldman Sachs', 'morgan-stanley': 'Morgan Stanley',
    'wells-fargo': 'Wells Fargo', 'palo-alto-networks': 'Palo Alto Networks',
    'jane-street': 'Jane Street', 'two-sigma': 'Two Sigma',
    'citadel-securities': 'Citadel Securities', 'scale-ai': 'Scale AI',
    'hugging-face': 'Hugging Face', 'epic-games': 'Epic Games',
    'riot-games': 'Riot Games', 'doordash': 'DoorDash',
    'crowdstrike': 'CrowdStrike', 'digitalocean': 'DigitalOcean',
    'hashicorp': 'HashiCorp', 'block': 'Block (Square)',
    'walmart-global-tech': 'Walmart Global Tech',
    'warner-bros-discovery': 'Warner Bros. Discovery',
    'charles-schwab': 'Charles Schwab', 'deutsche-bank': 'Deutsche Bank',
    'bridgewater-associates': 'Bridgewater Associates',
    'northrop-grumman': 'Northrop Grumman',
    'activision-blizzard': 'Activision Blizzard',
    'electronic-arts': 'Electronic Arts',
    'take-two-interactive': 'Take-Two Interactive',
    'stability-ai': 'Stability AI', 'together-ai': 'Together AI',
    'character-ai': 'Character AI', 'mistral-ai': 'Mistral AI',
    'adept-ai': 'Adept AI', 'inflection-ai': 'Inflection AI',
    'harvey-ai': 'Harvey AI', 'aurora-innovation': 'Aurora Innovation',
    'andreessen-horowitz': 'Andreessen Horowitz',
    'new-relic': 'New Relic', 'pager-duty': 'PagerDuty',
    'check-point': 'Check Point', 'splunk-cisco': 'Splunk (Cisco)',
    'mercado-libre': 'Mercado Libre',
    'intercontinental-exchange': 'Intercontinental Exchange',
    'unitedhealth-group': 'UnitedHealth Group',
    'global-payments': 'Global Payments', 'lucid-motors': 'Lucid Motors',
    'match-group': 'Match Group', 'pure-storage': 'Pure Storage',
    'western-union': 'Western Union', 'l3harris': 'L3Harris',
    'point72': 'Point72', 'millennium-management': 'Millennium Management',
    'sentinelone': 'SentinelOne', 'cockroach-labs': 'Cockroach Labs',
    'grafana-labs': 'Grafana Labs', 'arista': 'Arista Networks',
    'launchdarkly': 'LaunchDarkly', 'sofi': 'SoFi', 'kkr': 'KKR',
    'kpmg': 'KPMG', 'boku': 'Boku', 'cme-group': 'CME Group',
    'f5': 'F5', 'fis': 'FIS', 'ncr-voyix': 'NCR Voyix',
    'remote-com': 'Remote.com', 'epic-systems': 'Epic Systems',
    'renaissance-technologies': 'Renaissance Technologies',
    'interactive-brokers': 'Interactive Brokers',
    'ally-financial': 'Ally Financial',
    'snowflake-ai': 'Snowflake AI', 'databricks-unity': 'Databricks Unity',
    'elastic-security': 'Elastic Security',
    'fidelity-digital-assets': 'Fidelity Digital Assets',
    'huggingface-enterprise': 'Hugging Face Enterprise',
    'brex-ai': 'Brex AI', 'plaid-identity': 'Plaid Identity',
    'cloudflare-workers': 'Cloudflare Workers',
    'hashicorp-terraform': 'HashiCorp Terraform',
  };
  if (special[slug]) return special[slug];
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function formatRoleName(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function isValidSlug(str) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(str);
}

// ── GET Handler ──────────────────────────────────────────

export async function GET(request, { params }) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Maximum 100 requests per minute.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  const { company } = await params;
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');

  // Validate company param (path traversal protection)
  if (!company || !isValidSlug(company)) {
    return NextResponse.json(
      { error: 'Invalid company parameter. Use the company slug (e.g., "google", "jpmorgan-chase").' },
      { status: 400 }
    );
  }

  const researchDir = path.join(process.cwd(), 'research');
  const companyDir = path.join(researchDir, company);

  // Check company exists
  if (!fs.existsSync(companyDir) || !fs.statSync(companyDir).isDirectory()) {
    return NextResponse.json(
      { error: `Company "${company}" not found in research database.` },
      { status: 404 }
    );
  }

  // If no role specified, return list of available roles
  if (!role) {
    const files = fs.readdirSync(companyDir).filter((f) => f.endsWith('.md'));
    const roles = files.map((f) => {
      const slug = f.replace('.md', '');
      return {
        id: slug,
        name: formatRoleName(slug),
      };
    });

    return NextResponse.json({
      company,
      companyDisplay: formatCompanyName(company),
      roles,
      disclaimer: 'Data sourced from SalaryPrep research database. Figures represent reported ranges, not estimates or predictions.',
      generatedAt: new Date().toISOString(),
    });
  }

  // Validate role param
  if (!isValidSlug(role)) {
    return NextResponse.json(
      { error: 'Invalid role parameter. Use the role slug (e.g., "software-engineer", "product-manager").' },
      { status: 400 }
    );
  }

  const filePath = path.join(companyDir, `${role}.md`);
  if (!fs.existsSync(filePath)) {
    const files = fs.readdirSync(companyDir).filter((f) => f.endsWith('.md'));
    const available = files.map((f) => f.replace('.md', ''));

    return NextResponse.json(
      {
        error: `Role "${role}" not found for company "${company}".`,
        availableRoles: available,
      },
      { status: 404 }
    );
  }

  // Parse the markdown file
  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = parseResearchFile(content);

  if (!parsed) {
    return NextResponse.json(
      { error: 'Failed to parse research file. The file may be malformed.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    company,
    companyDisplay: formatCompanyName(company),
    role,
    roleDisplay: formatRoleName(role),
    data: {
      title: parsed.title || null,
      dnaSummary: parsed.dnaSummary || null,
      dnaBody: parsed.dnaBody || null,
      salaryTable: parsed.salaryTable || null,
      levelMapping: parsed.levelMapping || null,
      sources: parsed.sources || null,
      dataCompleteness: parsed.dataCompleteness,
    },
    disclaimer: 'Data sourced from SalaryPrep research database. Figures represent reported ranges, not estimates or predictions.',
    generatedAt: new Date().toISOString(),
  });
}
