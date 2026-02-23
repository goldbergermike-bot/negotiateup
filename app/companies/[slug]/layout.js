import fs from 'fs';
import path from 'path';

// ============================================
// Company name formatting (duplicated from api/companies/route.js
// to avoid cross-boundary import issues in Next.js App Router)
// ============================================
const SPECIAL_NAMES = {
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

function formatCompanyName(slug) {
  if (SPECIAL_NAMES[slug]) return SPECIAL_NAMES[slug];
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  // Validate slug: alphanumeric and hyphens only
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return { title: 'Company Not Found | SalaryPrep' };
  }

  const companyDir = path.join(process.cwd(), 'research', slug);

  // Check if company directory exists
  if (!fs.existsSync(companyDir)) {
    return { title: 'Company Not Found | SalaryPrep' };
  }

  const companyName = formatCompanyName(slug);
  const files = fs.readdirSync(companyDir).filter((f) => f.endsWith('.md'));
  const roleCount = files.length;

  return {
    title: `${companyName} Salary Data & Negotiation Guide | SalaryPrep`,
    description: `Verified salary data for ${roleCount} roles at ${companyName}. Base salary, stock, bonus by region.`,
    openGraph: {
      title: `${companyName} Salary Data & Negotiation Guide | SalaryPrep`,
      description: `Verified salary data for ${roleCount} roles at ${companyName}. Base salary, stock, bonus by region.`,
      url: `https://www.salaryprep.com/companies/${slug}`,
    },
    alternates: {
      canonical: `https://www.salaryprep.com/companies/${slug}`,
    },
  };
}

export default function CompanyDetailLayout({ children }) {
  return children;
}
