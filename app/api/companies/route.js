// ============================================
// SalaryPrep — Company List API
// ============================================
// Returns the list of companies we have verified research data for.
// Used by the autocomplete on form pages.

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let _cachedCompanies = null;
let _companiesCacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCompanies() {
  const now = Date.now();
  if (_cachedCompanies && (now - _companiesCacheTime) < CACHE_TTL_MS) {
    return _cachedCompanies;
  }

  const researchDir = path.join(process.cwd(), 'research');
  const entries = fs.readdirSync(researchDir).filter((entry) => {
    const fullPath = path.join(researchDir, entry);
    return fs.statSync(fullPath).isDirectory();
  });

  // Convert directory names to display names: "jpmorgan-chase" → "JPMorgan Chase"
  _cachedCompanies = entries.map((dir) => ({
    id: dir,
    name: formatCompanyName(dir),
  }));
  _companiesCacheTime = now;

  return _cachedCompanies;
}

function formatCompanyName(slug) {
  // Special cases for well-known names
  const special = {
    'amd': 'AMD',
    'att': 'AT&T',
    'bcg': 'BCG',
    'boku': 'Boku',
    'cme-group': 'CME Group',
    'dbt-labs': 'dbt Labs',
    'de-shaw': 'D.E. Shaw',
    'f5': 'F5',
    'fis': 'FIS',
    'hsbc': 'HSBC',
    'jpmorgan-chase': 'JPMorgan Chase',
    'kkr': 'KKR',
    'kpmg': 'KPMG',
    'ncr-voyix': 'NCR Voyix',
    'openai': 'OpenAI',
    'pwc': 'PwC',
    'sofi': 'SoFi',
    'tsmc': 'TSMC',
    'ubs': 'UBS',
    'xai': 'xAI',
    't-mobile': 'T-Mobile',
    'bill-com': 'Bill.com',
    'monday-com': 'Monday.com',
    'remote-com': 'Remote.com',
    'c3-ai': 'C3.ai',
    'fly-io': 'Fly.io',
    'weights-and-biases': 'Weights & Biases',
    'walmart-global-tech': 'Walmart Global Tech',
    'warner-bros-discovery': 'Warner Bros. Discovery',
    'american-express': 'American Express',
    'bank-of-america': 'Bank of America',
    'capital-one': 'Capital One',
    'goldman-sachs': 'Goldman Sachs',
    'morgan-stanley': 'Morgan Stanley',
    'charles-schwab': 'Charles Schwab',
    'wells-fargo': 'Wells Fargo',
    'palo-alto-networks': 'Palo Alto Networks',
    'jane-street': 'Jane Street',
    'two-sigma': 'Two Sigma',
    'citadel-securities': 'Citadel Securities',
    'interactive-brokers': 'Interactive Brokers',
    'ally-financial': 'Ally Financial',
    'deutsche-bank': 'Deutsche Bank',
    'bridgewater-associates': 'Bridgewater Associates',
    'renaissance-technologies': 'Renaissance Technologies',
    'northrop-grumman': 'Northrop Grumman',
    'activision-blizzard': 'Activision Blizzard',
    'electronic-arts': 'Electronic Arts',
    'epic-games': 'Epic Games',
    'epic-systems': 'Epic Systems',
    'take-two-interactive': 'Take-Two Interactive',
    'riot-games': 'Riot Games',
    'scale-ai': 'Scale AI',
    'stability-ai': 'Stability AI',
    'together-ai': 'Together AI',
    'character-ai': 'Character AI',
    'mistral-ai': 'Mistral AI',
    'adept-ai': 'Adept AI',
    'inflection-ai': 'Inflection AI',
    'harvey-ai': 'Harvey AI',
    'hugging-face': 'Hugging Face',
    'aurora-innovation': 'Aurora Innovation',
    'andreessen-horowitz': 'Andreessen Horowitz',
    'new-relic': 'New Relic',
    'pager-duty': 'PagerDuty',
    'check-point': 'Check Point',
    'splunk-cisco': 'Splunk (Cisco)',
    'mercado-libre': 'Mercado Libre',
    'intercontinental-exchange': 'Intercontinental Exchange',
    'unitedhealth-group': 'UnitedHealth Group',
    'global-payments': 'Global Payments',
    'lucid-motors': 'Lucid Motors',
    'match-group': 'Match Group',
    'pure-storage': 'Pure Storage',
    'western-union': 'Western Union',
    'l3harris': 'L3Harris',
    'point72': 'Point72',
    'millennium-management': 'Millennium Management',
    'block': 'Block (Square)',
    'digitalocean': 'DigitalOcean',
    'doordash': 'DoorDash',
    'hashicorp': 'HashiCorp',
    'hashicorp-terraform': 'HashiCorp Terraform',
    'crowdstrike': 'CrowdStrike',
    'cloudflare-workers': 'Cloudflare Workers',
    'sentinelone': 'SentinelOne',
    'cockroach-labs': 'Cockroach Labs',
    'grafana-labs': 'Grafana Labs',
    'arista': 'Arista Networks',
    'launchdarkly': 'LaunchDarkly',
    'snowflake-ai': 'Snowflake AI',
    'databricks-unity': 'Databricks Unity',
    'elastic-security': 'Elastic Security',
    'fidelity-digital-assets': 'Fidelity Digital Assets',
    'huggingface-enterprise': 'Hugging Face Enterprise',
    'brex-ai': 'Brex AI',
    'plaid-identity': 'Plaid Identity',
  };

  if (special[slug]) return special[slug];

  // Default: capitalize each word
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function GET() {
  const companies = getCompanies();
  return NextResponse.json(companies);
}
