// ============================================
// SalaryPrep — Admin Dashboard (Server Component)
// ============================================
// Displays real data from the research database and leads file.
// Protected by a simple URL token. NOT production-grade auth.

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { parseResearchFile } from '../../lib/markdown-parser';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

const ADMIN_TOKEN = 'salaryprep-admin-2026';

// ── Helpers ──────────────────────────────────────────────

function formatCompanyName(slug) {
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
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatRoleName(slug) {
  return slug
    .replace(/\.md$/, '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ── Data Collection Functions ────────────────────────────

function getResearchStats() {
  const researchDir = path.join(process.cwd(), 'research');

  let companyDirs = [];
  try {
    companyDirs = fs.readdirSync(researchDir).filter((entry) => {
      const fullPath = path.join(researchDir, entry);
      return fs.statSync(fullPath).isDirectory();
    });
  } catch {
    return { totalCompanies: 0, totalFiles: 0, companies: [], filesPerCompany: {} };
  }

  let totalFiles = 0;
  const filesPerCompany = {};
  const companies = [];

  for (const dir of companyDirs) {
    const companyPath = path.join(researchDir, dir);
    const mdFiles = fs.readdirSync(companyPath).filter((f) => f.endsWith('.md'));
    totalFiles += mdFiles.length;
    filesPerCompany[dir] = mdFiles.length;
    companies.push({
      id: dir,
      name: formatCompanyName(dir),
      roleCount: mdFiles.length,
      roles: mdFiles.map((f) => f.replace('.md', '')),
    });
  }

  // Sort by company name
  companies.sort((a, b) => a.name.localeCompare(b.name));

  return {
    totalCompanies: companyDirs.length,
    totalFiles,
    companies,
    filesPerCompany,
  };
}

function getDataCompleteness(companies) {
  const researchDir = path.join(process.cwd(), 'research');

  // Grab a random sample of 20 companies
  const shuffled = [...companies].sort(() => Math.random() - 0.5);
  const sample = shuffled.slice(0, 20);

  let totalFilesChecked = 0;
  let hasSalaryTable = 0;
  let hasDnaSummary = 0;
  let hasLevelMapping = 0;
  let hasSources = 0;
  let totalCompleteness = 0;

  for (const company of sample) {
    const companyPath = path.join(researchDir, company.id);
    const mdFiles = fs.readdirSync(companyPath).filter((f) => f.endsWith('.md'));

    for (const file of mdFiles) {
      try {
        const content = fs.readFileSync(path.join(companyPath, file), 'utf-8');
        const parsed = parseResearchFile(content);
        if (!parsed) continue;

        totalFilesChecked++;
        if (parsed.salaryTable) hasSalaryTable++;
        if (parsed.dnaSummary) hasDnaSummary++;
        if (parsed.levelMapping) hasLevelMapping++;
        if (parsed.sources) hasSources++;
        totalCompleteness += parsed.dataCompleteness.percentage;
      } catch {
        // Skip files that can't be read
      }
    }
  }

  const avgCompleteness = totalFilesChecked > 0
    ? Math.round(totalCompleteness / totalFilesChecked)
    : 0;

  return {
    sampleSize: sample.length,
    totalFilesChecked,
    hasSalaryTable,
    hasDnaSummary,
    hasLevelMapping,
    hasSources,
    avgCompleteness,
    sampledCompanies: sample.map((c) => c.name),
  };
}

function getLeadsData() {
  const leadsPath = path.join(process.cwd(), 'data', 'leads.json');

  let leads = [];
  try {
    const raw = fs.readFileSync(leadsPath, 'utf-8');
    leads = JSON.parse(raw);
    if (!Array.isArray(leads)) leads = [];
  } catch {
    return {
      totalLeads: 0,
      bySource: {},
      recentLeads: [],
      topCompanies: [],
    };
  }

  // Count by source
  const bySource = {};
  for (const lead of leads) {
    const source = lead.source || 'unknown';
    bySource[source] = (bySource[source] || 0) + 1;
  }

  // Recent 20 leads (sorted by most recent)
  const sorted = [...leads].sort((a, b) => {
    const dateA = new Date(a.capturedAt || a.timestamp || 0);
    const dateB = new Date(b.capturedAt || b.timestamp || 0);
    return dateB - dateA;
  });
  const recentLeads = sorted.slice(0, 20);

  // Report downloads by company (top 10)
  const companyDownloads = {};
  for (const lead of leads) {
    if (lead.companyId) {
      const name = formatCompanyName(lead.companyId);
      companyDownloads[name] = (companyDownloads[name] || 0) + 1;
    }
  }
  const topCompanies = Object.entries(companyDownloads)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return {
    totalLeads: leads.length,
    bySource,
    recentLeads,
    topCompanies,
  };
}

function getDataFreshness(companies) {
  const researchDir = path.join(process.cwd(), 'research');

  let totalWithFrontmatter = 0;
  let totalChecked = 0;
  const lastUpdatedDates = [];

  // Check a sample of files for frontmatter
  const sample = companies.slice(0, 10);
  for (const company of sample) {
    const companyPath = path.join(researchDir, company.id);
    const mdFiles = fs.readdirSync(companyPath).filter((f) => f.endsWith('.md'));

    for (const file of mdFiles.slice(0, 3)) {
      totalChecked++;
      try {
        const content = fs.readFileSync(path.join(companyPath, file), 'utf-8');
        const { data } = matter(content);
        if (data && Object.keys(data).length > 0) {
          totalWithFrontmatter++;
          if (data.last_updated) {
            lastUpdatedDates.push(data.last_updated);
          }
        }
      } catch {
        // Skip
      }
    }
  }

  return {
    totalChecked,
    totalWithFrontmatter,
    hasFrontmatter: totalWithFrontmatter > 0,
    lastUpdatedDates,
  };
}

// ── Mask email for privacy ────────────────────────────────

function maskEmail(email) {
  if (!email || typeof email !== 'string') return '(no email)';
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const maskedLocal = local.length > 2
    ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
    : '**';
  return `${maskedLocal}@${domain}`;
}

// ── Page Component ───────────────────────────────────────

export default async function AdminDashboard({ searchParams }) {
  const params = await searchParams;
  const token = params?.token;

  // ── Access Control ──
  if (token !== ADMIN_TOKEN) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-ink mb-4">Access Denied</h1>
          <p className="text-muted text-sm">
            A valid admin token is required to view this page.
          </p>
        </div>
      </div>
    );
  }

  // ── Gather Data ──
  const researchStats = getResearchStats();
  const completenessData = getDataCompleteness(researchStats.companies);
  const leadsData = getLeadsData();
  const freshnessData = getDataFreshness(researchStats.companies);

  // Files per company distribution
  const fileCounts = Object.values(researchStats.filesPerCompany);
  const minFiles = fileCounts.length > 0 ? Math.min(...fileCounts) : 0;
  const maxFiles = fileCounts.length > 0 ? Math.max(...fileCounts) : 0;
  const avgFiles = fileCounts.length > 0
    ? Math.round((fileCounts.reduce((a, b) => a + b, 0) / fileCounts.length) * 10) / 10
    : 0;

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-paper pt-24 pb-16 px-6">
        <div className="max-w-[1100px] mx-auto">

          {/* Header */}
          <div className="mb-10">
            <h1 className="font-serif text-4xl text-ink mb-2">Admin Dashboard</h1>
            <p className="text-muted text-sm">
              SalaryPrep internal data overview. All figures read directly from the research database and leads file.
            </p>
          </div>

          {/* ── Section 1: Research Database Stats ── */}
          <section className="mb-10">
            <h2 className="font-serif text-2xl text-ink mb-5">Research Database Stats</h2>

            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard label="Total Companies" value={researchStats.totalCompanies} />
              <StatCard label="Total Research Files" value={researchStats.totalFiles.toLocaleString()} />
              <StatCard label="Avg Files / Company" value={avgFiles} />
              <StatCard label="File Range" value={`${minFiles} – ${maxFiles}`} />
            </div>

            {/* Companies Table */}
            <div className="bg-white rounded-xl border border-border p-6 overflow-hidden">
              <h3 className="font-serif text-lg text-ink mb-4">
                All Companies ({researchStats.companies.length})
              </h3>
              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white">
                    <tr className="text-left text-muted border-b border-border">
                      <th className="pb-2 pr-4">Company</th>
                      <th className="pb-2 pr-4">Slug</th>
                      <th className="pb-2 text-right">Roles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {researchStats.companies.map((company) => (
                      <tr key={company.id} className="border-b border-border/50 hover:bg-accent-light/20">
                        <td className="py-2 pr-4 font-medium text-ink">{company.name}</td>
                        <td className="py-2 pr-4 text-muted font-mono text-xs">{company.id}</td>
                        <td className="py-2 text-right text-ink">{company.roleCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ── Section 2: Data Completeness ── */}
          <section className="mb-10">
            <h2 className="font-serif text-2xl text-ink mb-5">Data Completeness</h2>
            <p className="text-muted text-sm mb-4">
              Sampled {completenessData.sampleSize} random companies ({completenessData.totalFilesChecked} files total)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <StatCard
                label="Avg Completeness"
                value={`${completenessData.avgCompleteness}%`}
                accent
              />
              <StatCard
                label="Has Salary Table"
                value={`${completenessData.hasSalaryTable} / ${completenessData.totalFilesChecked}`}
              />
              <StatCard
                label="Has DNA Summary"
                value={`${completenessData.hasDnaSummary} / ${completenessData.totalFilesChecked}`}
              />
              <StatCard
                label="Has Level Mapping"
                value={`${completenessData.hasLevelMapping} / ${completenessData.totalFilesChecked}`}
              />
              <StatCard
                label="Has Sources"
                value={`${completenessData.hasSources} / ${completenessData.totalFilesChecked}`}
              />
            </div>

            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-serif text-lg text-ink mb-3">Sampled Companies</h3>
              <div className="flex flex-wrap gap-2">
                {completenessData.sampledCompanies.map((name) => (
                  <span
                    key={name}
                    className="inline-block bg-accent-light text-accent text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* ── Section 3: Leads & Downloads ── */}
          <section className="mb-10">
            <h2 className="font-serif text-2xl text-ink mb-5">Leads &amp; Downloads</h2>

            {leadsData.totalLeads === 0 ? (
              <div className="bg-white rounded-xl border border-border p-8 text-center">
                <p className="text-muted text-sm">
                  No leads data found. The file <code className="bg-accent-light px-2 py-0.5 rounded text-xs">data/leads.json</code> is empty or missing.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <StatCard label="Total Leads" value={leadsData.totalLeads.toLocaleString()} accent />
                  <StatCard
                    label="Sources"
                    value={Object.keys(leadsData.bySource).length}
                  />
                  <StatCard
                    label="Companies Downloaded"
                    value={leadsData.topCompanies.length}
                  />
                </div>

                {/* Leads by Source */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-xl border border-border p-6">
                    <h3 className="font-serif text-lg text-ink mb-4">Leads by Source</h3>
                    <div className="space-y-3">
                      {Object.entries(leadsData.bySource)
                        .sort((a, b) => b[1] - a[1])
                        .map(([source, count]) => (
                          <div key={source} className="flex items-center justify-between">
                            <span className="text-sm text-ink font-medium capitalize">{source}</span>
                            <div className="flex items-center gap-3">
                              <div className="w-32 h-2 bg-accent-light rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-accent rounded-full"
                                  style={{
                                    width: `${Math.round((count / leadsData.totalLeads) * 100)}%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm text-muted w-12 text-right">{count}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Top Companies Downloaded */}
                  <div className="bg-white rounded-xl border border-border p-6">
                    <h3 className="font-serif text-lg text-ink mb-4">Top Report Downloads</h3>
                    {leadsData.topCompanies.length === 0 ? (
                      <p className="text-muted text-sm">No company-specific downloads yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {leadsData.topCompanies.map(([company, count], i) => (
                          <div key={company} className="flex items-center justify-between">
                            <span className="text-sm text-ink">
                              <span className="text-muted mr-2">{i + 1}.</span>
                              {company}
                            </span>
                            <span className="text-sm font-medium text-accent">{count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Leads */}
                <div className="bg-white rounded-xl border border-border p-6">
                  <h3 className="font-serif text-lg text-ink mb-4">Recent Leads (Last 20)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted border-b border-border">
                          <th className="pb-2 pr-4">Email</th>
                          <th className="pb-2 pr-4">Source</th>
                          <th className="pb-2 pr-4">Company</th>
                          <th className="pb-2 text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leadsData.recentLeads.map((lead, i) => (
                          <tr key={i} className="border-b border-border/50">
                            <td className="py-2 pr-4 font-mono text-xs">{maskEmail(lead.email)}</td>
                            <td className="py-2 pr-4 capitalize">{lead.source || '—'}</td>
                            <td className="py-2 pr-4">
                              {lead.companyId ? formatCompanyName(lead.companyId) : '—'}
                            </td>
                            <td className="py-2 text-right text-muted text-xs">
                              {lead.capturedAt || lead.timestamp
                                ? new Date(lead.capturedAt || lead.timestamp).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })
                                : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* ── Section 4: Data Freshness ── */}
          <section className="mb-10">
            <h2 className="font-serif text-2xl text-ink mb-5">Data Freshness</h2>

            <div className="bg-white rounded-xl border border-border p-6">
              {freshnessData.hasFrontmatter ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <StatCard
                      label="Files Checked"
                      value={freshnessData.totalChecked}
                    />
                    <StatCard
                      label="With Frontmatter"
                      value={freshnessData.totalWithFrontmatter}
                    />
                    <StatCard
                      label="Has last_updated"
                      value={freshnessData.lastUpdatedDates.length}
                    />
                  </div>
                  {freshnessData.lastUpdatedDates.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-serif text-lg text-ink mb-2">Recent Update Dates</h3>
                      <div className="flex flex-wrap gap-2">
                        {freshnessData.lastUpdatedDates.slice(0, 20).map((date, i) => (
                          <span
                            key={i}
                            className="inline-block bg-blue-light text-blue text-xs font-medium px-3 py-1 rounded-full"
                          >
                            {String(date)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted text-sm mb-2">Frontmatter migration pending</p>
                  <p className="text-muted text-xs">
                    Checked {freshnessData.totalChecked} files — none contain YAML frontmatter yet.
                    Once frontmatter is added (via migration script), this section will show last_updated statistics.
                  </p>
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}

// ── StatCard Sub-component ───────────────────────────────

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <p className="text-muted text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${accent ? 'text-accent' : 'text-ink'}`}>
        {value}
      </p>
    </div>
  );
}
