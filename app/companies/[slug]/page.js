import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { parseResearchFile } from '../../../lib/markdown-parser';
import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';

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

/**
 * Convert a filename like "senior-software-engineer.md" to a readable role name
 * e.g., "Senior Software Engineer"
 */
function formatRoleName(filename) {
  return filename
    .replace(/\.md$/, '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Extract a salary range summary from a salary table.
 * Uses the first row's totalComp if available.
 * Returns a string like "$195K-$340K" or null.
 */
function getSalaryRangeSummary(salaryTable) {
  if (!salaryTable || salaryTable.length === 0) return null;
  const first = salaryTable[0];
  return first.totalComp || null;
}

export default async function CompanyDetailPage({ params }) {
  const { slug } = await params;

  // Validate slug: alphanumeric and hyphens only (prevent path traversal)
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    notFound();
  }

  const companyDir = path.join(process.cwd(), 'research', slug);

  // Check if company directory exists
  if (!fs.existsSync(companyDir)) {
    notFound();
  }

  const companyName = formatCompanyName(slug);

  // Read and parse all .md files in this company directory
  const mdFiles = fs.readdirSync(companyDir).filter((f) => f.endsWith('.md'));

  if (mdFiles.length === 0) {
    notFound();
  }

  const roles = mdFiles.map((filename) => {
    const filePath = path.join(companyDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = parseResearchFile(content);
    return {
      filename,
      roleName: formatRoleName(filename),
      slug: filename.replace(/\.md$/, ''),
      ...parsed,
    };
  });

  // Get the Negotiation DNA summary from the first role that has one
  const dnaRole = roles.find((r) => r.dnaSummary);
  const dnaSummary = dnaRole ? dnaRole.dnaSummary : null;
  const dnaBody = dnaRole ? dnaRole.dnaBody : null;

  // Collect all unique sources across all roles
  const allSources = new Set();
  roles.forEach((role) => {
    if (role.sources) {
      role.sources.forEach((s) => allSources.add(s));
    }
  });
  const sources = Array.from(allSources);

  // First 3 roles with full salary tables
  const featuredRoles = roles.filter((r) => r.salaryTable).slice(0, 3);

  return (
    <main>
      <Nav />
      <div className="pt-32 pb-20 px-6 max-w-[1100px] mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted">
          <Link href="/companies" className="hover:text-ink transition-colors">
            Companies
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{companyName}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">
            {companyName} Salary Data &amp; Negotiation Guide
          </h1>
          <p className="text-muted text-lg">
            Verified compensation data for {roles.length} role{roles.length !== 1 ? 's' : ''} at {companyName}.
          </p>
        </div>

        {/* Negotiation DNA Summary */}
        {dnaSummary && (
          <section className="mb-12 bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-xl mb-3 text-ink">Negotiation DNA</h2>
            <p className="text-muted leading-relaxed">{dnaSummary}</p>
            {dnaBody && (
              <p className="text-muted leading-relaxed mt-4 text-sm">{dnaBody}</p>
            )}
          </section>
        )}

        {/* All Roles Grid */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl mb-6">
            Available Roles ({roles.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {roles.map((role) => {
              const rangeSummary = getSalaryRangeSummary(role.salaryTable);
              return (
                <div
                  key={role.slug}
                  className="bg-white rounded-xl p-5 border border-border"
                >
                  <h3 className="font-serif text-base text-ink mb-1">
                    {role.title
                      ? role.title.split('|')[0].trim()
                      : role.roleName}
                  </h3>
                  {rangeSummary ? (
                    <p className="text-sm text-muted">
                      Total comp: <span className="text-ink font-medium">{rangeSummary}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-muted italic">
                      Salary data not yet available for this role
                    </p>
                  )}
                  {role.levelMapping && (
                    <p className="text-xs text-muted mt-2 leading-relaxed">
                      {role.levelMapping}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Featured Salary Tables (first 3 roles) */}
        {featuredRoles.length > 0 && (
          <section className="mb-16">
            <h2 className="font-serif text-2xl mb-6">
              Detailed Compensation Tables
            </h2>
            <div className="space-y-10">
              {featuredRoles.map((role) => (
                <div
                  key={role.slug}
                  className="bg-white rounded-2xl p-6 md:p-8 border border-border"
                >
                  <h3 className="font-serif text-xl mb-4 text-ink">
                    {role.title
                      ? role.title.split('|')[0].trim()
                      : role.roleName}
                  </h3>
                  {role.salaryTable ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 pr-4 text-muted font-medium">Region</th>
                            <th className="text-left py-3 pr-4 text-muted font-medium">Base Salary</th>
                            <th className="text-left py-3 pr-4 text-muted font-medium">Stock (RSU/4yr)</th>
                            <th className="text-left py-3 pr-4 text-muted font-medium">Bonus</th>
                            <th className="text-left py-3 text-muted font-medium">Total Comp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {role.salaryTable.map((row, i) => (
                            <tr
                              key={i}
                              className={i < role.salaryTable.length - 1 ? 'border-b border-border/50' : ''}
                            >
                              <td className="py-3 pr-4 font-medium text-ink">{row.region || 'N/A'}</td>
                              <td className="py-3 pr-4 text-ink">{row.base || 'N/A'}</td>
                              <td className="py-3 pr-4 text-ink">{row.stock || 'N/A'}</td>
                              <td className="py-3 pr-4 text-ink">{row.bonus || 'N/A'}</td>
                              <td className="py-3 font-semibold text-accent">{row.totalComp || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted italic">
                      Salary data not yet available for this role
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Data Sources */}
        {sources.length > 0 && (
          <section className="mb-16">
            <h2 className="font-serif text-2xl mb-4">Evidence &amp; Sources</h2>
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-border">
              <ul className="space-y-2">
                {sources.map((source, i) => (
                  <li key={i} className="text-sm text-muted flex items-start gap-2">
                    <span className="text-accent mt-0.5 shrink-0">&bull;</span>
                    <span>{source}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* CTAs */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <Link
            href="/#pricing"
            className="bg-ink rounded-2xl p-8 text-center block hover:-translate-y-0.5 transition-all"
          >
            <h3 className="font-serif text-xl text-white mb-2">
              Get your personalized negotiation playbook
            </h3>
            <p className="text-white/60 text-sm mb-4">
              Exact counter-offer scripts, strategy, and a day-by-day plan for {companyName}.
            </p>
            <span className="inline-block bg-white text-ink px-6 py-2.5 rounded-xl font-semibold text-sm">
              Get My Playbook &mdash; $39 &rarr;
            </span>
          </Link>
          <Link
            href="/report"
            className="bg-white rounded-2xl p-8 text-center border border-border block hover:border-accent/40 hover:-translate-y-0.5 hover:shadow-md transition-all"
          >
            <h3 className="font-serif text-xl text-ink mb-2">
              Download free salary report
            </h3>
            <p className="text-muted text-sm mb-4">
              Get a free overview of market salary data for your role and experience level.
            </p>
            <span className="inline-block bg-accent text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
              Get Free Report &rarr;
            </span>
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted text-center leading-relaxed">
          All data sourced from verified databases. Figures represent reported ranges, not estimates.
        </p>
      </div>
      <Footer />
    </main>
  );
}
