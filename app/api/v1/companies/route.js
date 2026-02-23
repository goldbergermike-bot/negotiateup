// ============================================
// SalaryPrep — Partner API: Company List
// ============================================
// GET /api/v1/companies
//
// Returns list of all companies with display names.
// Lightweight endpoint — no rate limit.

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// ── Cache ────────────────────────────────────────────────

let _cachedCompanies = null;
let _cacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

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

// ── GET Handler ──────────────────────────────────────────

export async function GET() {
  const now = Date.now();

  if (_cachedCompanies && (now - _cacheTime) < CACHE_TTL_MS) {
    return NextResponse.json(_cachedCompanies);
  }

  const researchDir = path.join(process.cwd(), 'research');

  let dirs = [];
  try {
    dirs = fs.readdirSync(researchDir).filter((entry) => {
      const fullPath = path.join(researchDir, entry);
      return fs.statSync(fullPath).isDirectory();
    });
  } catch {
    return NextResponse.json({ error: 'Failed to read research database.' }, { status: 500 });
  }

  const companies = dirs.map((dir) => {
    const companyPath = path.join(researchDir, dir);
    const roleFiles = fs.readdirSync(companyPath).filter((f) => f.endsWith('.md'));

    return {
      id: dir,
      name: formatCompanyName(dir),
      roleCount: roleFiles.length,
    };
  });

  companies.sort((a, b) => a.name.localeCompare(b.name));

  const response = {
    total: companies.length,
    companies,
    generatedAt: new Date().toISOString(),
  };

  _cachedCompanies = response;
  _cacheTime = now;

  return NextResponse.json(response);
}
