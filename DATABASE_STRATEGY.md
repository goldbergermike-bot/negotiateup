# SalaryPrep Database Strategy

A comprehensive plan for evolving the SalaryPrep research database from its current unstructured markdown state into a robust, scalable, and trustworthy data layer that powers accurate salary negotiation playbooks.

---

## Table of Contents

1. [Current State Assessment](#1-current-state-assessment)
2. [Data Freshness & Update Plan](#2-data-freshness--update-plan)
3. [Data Integrity & Accuracy Guardrails](#3-data-integrity--accuracy-guardrails)
4. [Structured Data Migration](#4-structured-data-migration)
5. [Scalability](#5-scalability)
6. [Anti-Hallucination Guardrails](#6-anti-hallucination-guardrails)

---

## 1. Current State Assessment

### What We Have

The SalaryPrep research database consists of **4,470 markdown files** across **319 company directories** within `/research/`. Each company directory contains:

- **13 standard role files** corresponding to the canonical role set:
  `software-engineer`, `senior-software-engineer`, `staff-software-engineer`, `engineering-manager`, `product-manager`, `product-designer`, `data-scientist`, `data-engineer`, `ml-ai-engineer`, `devops-engineer`, `security-engineer`, `solutions-architect`, `technical-program-manager`

- **1 specialty role file** unique to each company (e.g., `starship-flight-software-engineer.md` for SpaceX, `copilot-ai-platform-engineer.md` for Microsoft, `gemini-ai-platform-engineer.md` for Google, `constitutional-ai-research-engineer.md` for Anthropic). There are **320 unique specialty roles** across the database (one company may have been added after the initial batch, or one company has two specialties).

### How Each File Is Structured

Each markdown file follows a consistent (but unstructured) format:

```
### [Role Title] | [Company] Global Negotiation Guide

**Negotiation DNA:** [One-line summary of comp philosophy, culture, and key levers]

| Region | Base Salary | Stock (RSU/4yr) | Bonus | Total Comp |
|--------|-------------|-----------------|-------|------------|
| [Region 1] | $XXK-$XXXK | $XXK-$XXXK | XX% | $XXXK-$XXXK |
| [Region 2] | ... | ... | ... | ... |
| [up to 6 regions] | ... | ... | ... | ... |

**Negotiation DNA** [Detailed prose section]

**Level Mapping:** [Cross-company level equivalencies]

**[Strategy-specific sections]** [Negotiation scripts, levers, culture analysis]

> **Negotiate Up Strategy:** [Specific counter-offer script]

**Evidence & Sources**
- [Source 1 with date range]
- [Source 2 with date range]
```

### How the Data Is Accessed at Runtime

The matching pipeline is implemented in `lib/research-matcher.js`:

1. **Company matching** (`matchCompany()`): Normalizes user input (lowercase, strip suffixes like Inc/Corp/LLC), checks against a curated `COMPANY_ALIASES` map (~135 aliases), then attempts slug-based exact match, then single-result partial substring match. Returns a confidence level: `exact`, `alias`, `slug`, or `partial`. Returns `null` if ambiguous or no match.

2. **Role matching** (`matchRole()`): Pattern-matches user-provided job titles against an ordered list of keyword sets (13 standard roles). More specific patterns are checked first (e.g., "staff software" before generic "software engineer"). Returns the role file slug or `null`.

3. **Specialty role matching** (`matchCompanySpecificRole()`): If standard role matching fails, scans the company directory for non-standard filenames and checks if 60%+ of the filename's significant words appear in the user's job title (minimum 2 word matches).

4. **Research loading** (`loadResearchFile()`): Reads the markdown file from disk synchronously via `fs.readFileSync`.

5. **Full lookup** (`lookupResearch()`): Chains company match -> role match (standard, then specialty) -> file load. Returns the file content, company directory, confidence level, and match type -- or `null`.

The matched research content is injected directly into the Claude AI prompt in `lib/prompts.js` via `buildResearchBlock()`, which wraps it in `--- BEGIN VERIFIED DATA ---` / `--- END VERIFIED DATA ---` markers with strict accuracy rules.

### What Is Good

- **Comprehensive coverage:** 319 companies with 14 roles each is a strong foundation for the tech salary negotiation market.
- **Consistent file format:** Every file follows the same general template, making future parsing feasible.
- **Rich content:** Each file contains salary tables (6 regions), negotiation DNA analysis, level mappings, specific scripts with dollar amounts, and source citations.
- **Anti-hallucination prompt design:** `lib/prompts.js` already has a two-tier system -- strict verified-data rules when research exists, explicit "estimate" labeling when it does not.
- **High-confidence matching:** The matcher returns `null` rather than guessing, which is the right default. Ambiguous partial matches are rejected.
- **Alias coverage:** The alias map handles common variations (AWS -> Amazon, Facebook -> Meta, etc.).
- **Specialty roles add differentiation:** Having company-specific roles (Starship Flight Software Engineer, Apple Intelligence Engineer) is a genuine competitive advantage over generic salary data providers.

### What Is Missing or Problematic

| Gap | Impact | Severity |
|-----|--------|----------|
| No `last_updated` field on any record | Cannot identify stale data, cannot show users when data was last verified | **Critical** |
| No `data_source` field per record | Cannot trace individual figures back to specific sources (Levels.fyi, Glassdoor, H1B data, Blind) | **High** |
| No `confidence_level` field | Cannot distinguish between well-sourced data (Google, Meta) and thin-data companies | **High** |
| All data is unstructured markdown | Cannot programmatically query salary ranges, cannot run data completeness checks, cannot power the free report feature | **Critical** |
| Company directory cache never invalidates | `_companyDirs` and `_cachedCompanies` are loaded once at startup and cached forever in module scope. Adding a new company requires a server restart. Same problem in `app/api/companies/route.js`. | **Medium** |
| No validation that files match the expected schema | A malformed file (missing salary table, wrong region count, missing sections) is served as-is to the AI | **Medium** |
| No structured metadata per company | No way to store HQ location, industry, public/private status, employee count, or fiscal year timing -- all of which are useful for negotiation context | **Medium** |
| Evidence section uses informal citations | Source strings like "Levels.fyi Google L3-L4 SWE compensation data, all regions (2024-2026)" are not machine-parseable and cannot be auto-verified | **Low** |
| The `matchRole()` function has pattern overlap risk | For example, "pm" matches `product-manager` but a user saying "PM at Stripe" might mean Program Manager. The pattern for `sa ` (solutions architect) includes a trailing space, which is fragile. | **Low** |
| No mechanism for users to flag inaccurate data | If a user receives a playbook with outdated salary data, there is no feedback loop | **Medium** |
| Specialty role matching threshold is arbitrary | The 60% keyword match with minimum 2 words is a heuristic that could produce false positives for roles with common words | **Low** |

---

## 2. Data Freshness & Update Plan

### Guiding Principle

Salary data has a shelf life. Tech compensation shifts meaningfully within 6-12 months due to market conditions, layoffs, hiring surges, equity repricing, and inflation adjustments. SalaryPrep's credibility depends on users trusting that the numbers in their playbook reflect current reality.

### Proposed Update Cadence

| Data Category | Update Frequency | Rationale |
|---------------|-----------------|-----------|
| **Salary ranges** (base, stock, bonus, total comp) | **Quarterly** | Compensation benchmarks shift with market conditions. Quarterly updates align with Levels.fyi and Glassdoor refresh cycles. |
| **Negotiation strategy prose** (scripts, levers, tactics) | **Semi-annually** | Company negotiation culture changes slower than comp numbers, but reorgs, policy changes (e.g., return-to-office mandates), and leadership turnover can shift tactics. |
| **Level mappings** | **Semi-annually** | Cross-company level equivalencies are relatively stable but do shift (e.g., Amazon's recent level restructuring). |
| **Company metadata** (HQ, industry, public/private, employee count) | **Annually** | Slow-changing facts. Update when a company IPOs, is acquired, or has a major restructuring. |
| **Evidence sources** | **Quarterly** (alongside salary ranges) | Sources must be re-verified each time salary data is refreshed. Dead links and outdated citations erode trust. |
| **Company alias map** (`COMPANY_ALIASES` in `research-matcher.js`) | **As needed** (when adding companies or when user matching failures are logged) | Reactive -- add aliases as gaps are discovered through matching logs. |
| **Specialty roles** | **Annually** | These change when companies launch major new product lines or rebrand divisions. |

### Required New Fields

Add the following metadata to every research file (implementation details in Section 4):

```yaml
last_updated: "2025-06-15"          # ISO date of last data verification
data_sources:                        # Machine-readable source list
  - name: "Levels.fyi"
    url: "https://www.levels.fyi/companies/google/salaries/software-engineer"
    date_accessed: "2025-06-10"
  - name: "Glassdoor"
    date_accessed: "2025-06-12"
  - name: "H1B Salary Database"
    date_accessed: "2025-06-08"
  - name: "Blind Verified Threads"
    date_accessed: "2025-06-14"
data_quality: "high"                 # high | medium | low (see Section 3)
salary_data_quarter: "2025-Q2"       # Which quarter this salary data represents
next_review_due: "2025-09-15"        # When this file should next be reviewed
```

### Staleness Detection and Flagging

Implement a staleness check that runs at two levels:

**1. Build-time / CI check (recommended: add to `npm run build` or a pre-deploy script):**

```javascript
// scripts/check-data-freshness.js
// For each research file:
//   - Parse last_updated from frontmatter
//   - If salary data is > 120 days old, flag as STALE
//   - If salary data is > 240 days old, flag as EXPIRED
//   - If next_review_due is in the past, flag as REVIEW_OVERDUE
// Output: summary report + exit code 1 if any EXPIRED files exist
```

**2. Runtime flagging in the AI prompt:**

When research data is injected into the prompt, include a staleness indicator:

```javascript
// In lib/prompts.js buildResearchBlock():
const daysSinceUpdate = Math.floor(
  (Date.now() - new Date(research.metadata.last_updated)) / (1000 * 60 * 60 * 24)
);
let freshnessNote = '';
if (daysSinceUpdate > 180) {
  freshnessNote = `\n**DATA FRESHNESS WARNING:** This data was last verified ${daysSinceUpdate} days ago. Some figures may have shifted. Label any salary ranges as "verified as of ${research.metadata.salary_data_quarter}" and recommend the user verify current ranges with their recruiter.\n`;
} else if (daysSinceUpdate > 90) {
  freshnessNote = `\n**Note:** Data last verified ${daysSinceUpdate} days ago (${research.metadata.salary_data_quarter}). Figures are current but approaching review cycle.\n`;
}
```

**3. PDF footer disclaimer (already partially exists, needs enhancement):**

Every generated PDF should include a footer line:

> "Salary data verified as of [quarter]. Market conditions change -- verify current ranges with your recruiter."

### Quarterly Update Process

1. **Week 1:** Pull fresh data from Levels.fyi, Glassdoor, H1B Salary Database, and Blind for the top 50 companies (by user request volume, once tracking is in place).
2. **Week 2:** Update salary tables, adjust negotiation strategy if market conditions have shifted (e.g., hiring freeze, mass layoffs, new equity programs).
3. **Week 3:** Update remaining 269 companies in batches of 50-70, prioritized by user traffic.
4. **Week 4:** Run validation scripts (Section 3), update `last_updated` and `salary_data_quarter` fields, deploy.

---

## 3. Data Integrity & Accuracy Guardrails

### Core Principle

**Every data point shown to a paying customer must be traceable to the research database. No exceptions.**

### Proposed Validation Layer

Build a validation script (`scripts/validate-research.js`) that checks every file against a defined schema. Run it in CI and before every deploy.

#### Schema Validation Rules

```javascript
const VALIDATION_RULES = {
  // Structure checks
  hasTitle: (content) => /^###\s+.+\|.+Global Negotiation Guide/m.test(content),
  hasNegotiationDNA: (content) => /\*\*Negotiation DNA:\*\*/.test(content),
  hasSalaryTable: (content) => /\|\s*Region\s*\|/.test(content),
  hasLevelMapping: (content) => /\*\*Level Mapping:\*\*/.test(content),
  hasEvidenceSources: (content) => /\*\*Evidence & Sources\*\*/.test(content),
  hasNegotiateUpStrategy: (content) => /Negotiate Up Strategy/.test(content),

  // Data quality checks
  salaryRangesArePlausible: (content) => {
    // Extract all dollar amounts, verify they fall within $30K-$1.5M range
    const amounts = content.match(/\$(\d{1,3}(?:,\d{3})*K?)/g);
    if (!amounts) return false;
    return amounts.every((amt) => {
      const num = parseInt(amt.replace(/[$K,]/g, '')) * (amt.includes('K') ? 1000 : 1);
      return num >= 30000 && num <= 1500000;
    });
  },

  minimumRegionCount: (content) => {
    // Must have at least 3 regions in salary table
    const tableRows = content.match(/^\|(?![-\s|]*$)(?!\s*Region).+\|$/gm);
    return tableRows && tableRows.length >= 3;
  },

  sourcesHaveDates: (content) => {
    // Evidence section should reference recent years
    const evidenceSection = content.split('**Evidence & Sources**')[1];
    if (!evidenceSection) return false;
    return /202[4-9]/.test(evidenceSection);
  },

  // Salary range ordering (low < high in each column)
  salaryRangesOrdered: (content) => {
    const rangePattern = /\$(\d+)K[–-]\$(\d+)K/g;
    let match;
    while ((match = rangePattern.exec(content)) !== null) {
      if (parseInt(match[1]) >= parseInt(match[2])) return false;
    }
    return true;
  },
};
```

#### Validation Output Format

```
VALIDATION REPORT - 2025-06-15
===============================
Files checked: 4,470
Passed: 4,412 (98.7%)
Warnings: 43 (0.96%)
Failures: 15 (0.34%)

FAILURES:
  research/acme-corp/data-engineer.md
    - FAIL: hasSalaryTable (no salary table found)
    - FAIL: minimumRegionCount (only 1 region)

WARNINGS:
  research/startup-xyz/software-engineer.md
    - WARN: sourcesHaveDates (no 2025+ sources found -- data may be stale)
```

### Confidence Level Classification

Add a `data_quality` field to each file's metadata, classified as follows:

| Level | Criteria | Example Companies |
|-------|----------|-------------------|
| **high** | 4+ independent sources, Levels.fyi verified data available, H1B salary disclosures match, 50+ data points per role | Google, Meta, Amazon, Apple, Microsoft, Netflix, Stripe, Coinbase |
| **medium** | 2-3 sources, some verified data, ranges cross-checked but fewer data points (10-50 per role) | Anduril, Scale AI, DoorDash, Affirm, Plaid |
| **low** | 1-2 sources, limited public data, ranges extrapolated from adjacent companies or general market data | Smaller private companies, non-tech-HQ companies, newly added companies |

**How confidence level affects the playbook:**

```javascript
// In lib/prompts.js buildResearchBlock():
if (research.metadata.data_quality === 'low') {
  accuracyRules += `\n**DATA CONFIDENCE NOTE:** Our data for this company/role is based on limited sources. ` +
    `Present salary ranges with the qualifier "Based on limited available data" and recommend ` +
    `the user cross-reference with Levels.fyi and Glassdoor for this specific company.\n`;
}
```

### Handling Edge Cases

#### Misspellings

The current `normalizeCompany()` function handles casing and suffix stripping but has no typo tolerance. Recommended approach:

```javascript
// Add to matchCompany() as step 4.5 (before giving up):
// Levenshtein distance check -- only for short edit distances (1-2 characters)
// Example: "gogle" -> "google", "amzon" -> "amazon"
// IMPORTANT: Only return these with confidence: 'fuzzy' and require
// the AI prompt to confirm with the user: "Did you mean Google?"

function levenshteinMatch(slug, dirs, maxDistance = 2) {
  const candidates = dirs.filter((dir) => levenshtein(slug, dir) <= maxDistance);
  // Only return if exactly ONE candidate within distance
  if (candidates.length === 1) {
    return { directory: candidates[0], confidence: 'fuzzy' };
  }
  return null;
}
```

**Key constraint:** Fuzzy matches must NEVER silently substitute. If a fuzzy match is used, the playbook must include a confirmation: "We matched your company to [X]. If this is incorrect, please contact support."

#### Role Variations

Common edge cases and how to handle them:

| User Input | Current Behavior | Recommended Fix |
|------------|-----------------|-----------------|
| "PM" | Matches `product-manager` | Add disambiguation: check if company context suggests Program Manager vs Product Manager. For now, acceptable default. |
| "SRE" | Matches `devops-engineer` | Correct -- SRE maps to DevOps/Infra in our taxonomy. Consider adding a note in the playbook: "Mapped to DevOps/Infrastructure Engineer category." |
| "Full Stack Developer" | Matches `software-engineer` | Correct. No change needed. |
| "VP of Engineering" | Returns `null` | Correct behavior -- we do not have VP-level data. The no-match fallback in `prompts.js` handles this with general market data. |
| "iOS Engineer" | Matches `software-engineer` (via "developer" pattern) | Consider adding platform-specific notes if the research file mentions mobile/iOS specifically. |
| "Principal Engineer" | Matches `staff-software-engineer` | Acceptable approximation. Add note: "Mapped to Staff/Principal level." |

#### Missing Data

When `lookupResearch()` returns `null`, the current system falls back to general market data with explicit "estimated" labels. This is the correct behavior. Additional improvements:

1. **Log all misses:** Track which company/role combinations users search for that produce no match. This becomes the priority list for new research files.

2. **Partial match handling:** If company matches but role does not, return company-level context (company name, industry, general comp philosophy) even without role-specific salary data. This is better than a full fallback to generic data.

```javascript
// Proposed addition to lookupResearch():
if (companyMatch && !roleFile) {
  // Try to load ANY file from this company for general context
  const availableRoles = listCompanyRoles(companyMatch.directory);
  if (availableRoles.length > 0) {
    return {
      content: null,
      company: companyMatch.directory,
      companyConfidence: companyMatch.confidence,
      role: null,
      matchType: 'company-only',
      availableRoles: availableRoles,
    };
  }
}
```

3. **Suggest nearest role:** When a user's title does not match, but the company has research, show: "We don't have specific data for [user's title] at [company], but we have data for these related roles: [list]. The playbook will use general market data for your specific title."

---

## 4. Structured Data Migration

### The Problem

All 4,470 research files are pure unstructured markdown. This makes it impossible to:

- Programmatically query salary ranges (e.g., "What is the median base for Senior SWE at Google in NYC?")
- Run automated data completeness or consistency checks
- Power a free report feature that surfaces specific data points without AI generation
- Build comparison features (e.g., "Compare Google vs Meta SWE comp")
- Detect and flag outlier data points
- Generate aggregate statistics for marketing ("Our database covers $X-$Y salary range across N companies")

### Recommended Approach: YAML Frontmatter + Markdown Body

Migrate each file to a **YAML frontmatter + markdown body** format. This preserves the existing markdown content (which is injected into AI prompts as-is) while adding a structured, machine-parseable metadata header.

#### Target Format

```yaml
---
# SalaryPrep Research File Schema v1.0
company: google
company_display: Google
role: software-engineer
role_display: Software Engineer (L3-L4)
role_type: standard                    # standard | specialty
industry: technology
hq_location: Mountain View, CA
public_or_private: public
ticker: GOOGL
employee_count_range: "150000-200000"

# Data provenance
last_updated: "2025-06-15"
salary_data_quarter: "2025-Q2"
data_quality: high                     # high | medium | low
next_review_due: "2025-09-15"
author: "research-team"                # who wrote/verified this file

# Structured salary data (mirrors the markdown table but machine-readable)
compensation:
  - region: "Bay Area (HQ)"
    base_low: 152000
    base_high: 215000
    stock_low: 110000
    stock_high: 260000
    stock_type: "RSU"
    stock_vest_years: 4
    bonus_pct: 15
    total_comp_low: 195000
    total_comp_high: 340000
    currency: "USD"
  - region: "New York City"
    base_low: 148000
    base_high: 210000
    stock_low: 105000
    stock_high: 250000
    stock_type: "RSU"
    stock_vest_years: 4
    bonus_pct: 15
    total_comp_low: 190000
    total_comp_high: 330000
    currency: "USD"
  - region: "Seattle / Kirkland"
    base_low: 145000
    base_high: 205000
    stock_low: 100000
    stock_high: 240000
    stock_type: "RSU"
    stock_vest_years: 4
    bonus_pct: 15
    total_comp_low: 185000
    total_comp_high: 320000
    currency: "USD"
  - region: "London"
    base_low: 75000
    base_high: 135000
    stock_low: 60000
    stock_high: 160000
    stock_type: "RSU"
    stock_vest_years: 4
    bonus_pct: 15
    total_comp_low: 110000
    total_comp_high: 215000
    currency: "GBP"
  - region: "Zurich"
    base_low: 120000
    base_high: 190000
    stock_low: 90000
    stock_high: 210000
    stock_type: "RSU"
    stock_vest_years: 4
    bonus_pct: 15
    total_comp_low: 160000
    total_comp_high: 280000
    currency: "CHF"
  - region: "Bangalore"
    base_low: 2000000
    base_high: 3800000
    stock_low: 1500000
    stock_high: 4000000
    stock_type: "RSU"
    stock_vest_years: 4
    bonus_pct: 15
    total_comp_low: 3000000
    total_comp_high: 5800000
    currency: "INR"

# Level mapping (structured)
level_mapping:
  internal: "L3-L4"
  meta: "E3-E4"
  microsoft: "L59-L62"
  amazon: "SDE I - SDE II"
  apple: "ICT2-ICT3"

# Negotiation metadata
negotiation_dna_summary: "Elite hiring bar + Competitive base + substantial RSU grants even at junior levels + 15% target bonus | Google SWE is the most coveted engineering credential globally | CAREER LAUNCHPAD PREMIUM"

# Data sources (machine-readable)
data_sources:
  - name: "Levels.fyi"
    url: "https://www.levels.fyi/companies/google/salaries/software-engineer"
    date_accessed: "2025-06-10"
  - name: "Glassdoor"
    date_accessed: "2025-06-12"
  - name: "H1B Salary Database"
    date_accessed: "2025-06-08"
  - name: "Blind Verified Threads"
    date_accessed: "2025-06-14"
---

[... existing markdown body unchanged ...]
```

### Migration Script

Build a one-time migration script (`scripts/migrate-to-frontmatter.js`) that:

1. **Parses each existing markdown file** to extract:
   - Title line (company + role)
   - Negotiation DNA summary
   - Salary table rows (regex parse the markdown table)
   - Level mapping line
   - Evidence sources section
2. **Generates YAML frontmatter** from the extracted data
3. **Prepends the frontmatter** to the existing markdown body (preserving all prose content)
4. **Validates** the output file against the schema
5. **Writes** the migrated file back

```javascript
// Pseudocode for the salary table parser:
function parseSalaryTable(markdown) {
  const tableRegex = /\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/gm;
  const rows = [];
  let match;
  while ((match = tableRegex.exec(markdown)) !== null) {
    const [, region, base, stock, bonus, total] = match.map(s => s.trim());
    if (region === 'Region' || region.startsWith('-')) continue; // Skip header/separator
    rows.push({
      region,
      ...parseRange(base),   // { base_low, base_high, currency }
      ...parseRange(stock),  // { stock_low, stock_high }
      bonus: parseBonus(bonus),
      ...parseRange(total),  // { total_comp_low, total_comp_high }
    });
  }
  return rows;
}
```

**Estimated effort:** The migration script should take 1-2 days to build and test. Running it across all 4,470 files should take under 5 minutes. Manual spot-checking of 50 files across different companies/roles should take another half day.

### Updating the Research Matcher

After migration, update `lib/research-matcher.js` to:

1. **Parse frontmatter** when loading files (use the `gray-matter` npm package)
2. **Return structured metadata** alongside the markdown content
3. **Expose structured salary data** for programmatic queries

```javascript
import matter from 'gray-matter';

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
```

### What This Enables

| Capability | Before Migration | After Migration |
|-----------|-----------------|-----------------|
| Query "base salary range for Senior SWE at Stripe in NYC" | Impossible without AI parsing | Direct lookup: `metadata.compensation.find(r => r.region.includes('New York'))` |
| Free report feature (show limited data before paywall) | Not feasible | Surface `compensation[0]` (HQ region) and `negotiation_dna_summary` for free; full playbook behind paywall |
| Data completeness dashboard | Manual file inspection | `SELECT * FROM files WHERE compensation.length < 3 OR data_quality = 'low'` |
| Company comparison pages | Would require AI generation | Direct comparison of structured `compensation` arrays |
| Stale data detection | Impossible | `WHERE last_updated < DATE_SUB(NOW(), INTERVAL 120 DAY)` |
| Automated data refresh validation | Impossible | Compare old vs new `compensation` values, flag changes > 20% for manual review |
| SEO landing pages per company | Would need manual creation | Auto-generate from structured data: "/salaries/google/software-engineer" |

### Alternative Considered: Separate metadata.json Per Company

An alternative is to maintain a `metadata.json` file in each company directory alongside the markdown files:

```
research/google/
  metadata.json           # Company-level metadata + all role salary data
  software-engineer.md    # Prose content only (no salary table needed in markdown)
  senior-software-engineer.md
  ...
```

**Pros:** Clean separation of data and prose. JSON is more natural for programmatic access. No need for a frontmatter parser.

**Cons:** Two files to keep in sync per role. The salary table in the markdown is useful for the AI prompt (it reads naturally). Risk of data divergence between JSON and markdown.

**Recommendation:** Use YAML frontmatter. It keeps data and prose co-located in a single file, which eliminates sync issues and makes the migration simpler. The `gray-matter` library is mature and widely used in the Next.js ecosystem.

---

## 5. Scalability

### Adding New Companies

#### Current Process (Manual)

1. Create a new directory under `/research/` (e.g., `research/new-company/`)
2. Create 14 markdown files (13 standard roles + 1 specialty role)
3. Optionally add an alias to `COMPANY_ALIASES` in `research-matcher.js`
4. Optionally add display name to `special` map in `app/api/companies/route.js`
5. Restart the server (because `_companyDirs` and `_cachedCompanies` are cached in module scope)

#### Problems

- Step 2 is labor-intensive (14 files per company, each requiring research)
- Step 5 is fragile (forgetting to restart means the company is invisible)
- No validation that the new files match the expected schema
- No way to batch-add companies efficiently

#### Proposed Improvements

**1. Company Template Generator Script**

```bash
# scripts/add-company.js
# Usage: node scripts/add-company.js --name "Acme Corp" --slug "acme-corp" \
#        --industry "technology" --hq "San Francisco, CA" --public --ticker "ACME"
#
# Creates:
#   research/acme-corp/
#     software-engineer.md          (template with frontmatter, empty salary table)
#     senior-software-engineer.md
#     staff-software-engineer.md
#     ... (all 13 standard roles)
#     [specialty-role].md           (prompted to define the specialty role name)
#
# Also:
#   - Adds alias entries to research-matcher.js if common aliases are provided
#   - Adds display name to companies route if needed
#   - Validates all generated files against schema
```

**2. Batch Update Script for Salary Data**

```bash
# scripts/update-salaries.js
# Usage: node scripts/update-salaries.js --company google --quarter 2025-Q3
#
# For each role file in the company directory:
#   - Reads existing frontmatter
#   - Prompts for updated salary ranges (or accepts a CSV/JSON input file)
#   - Updates the YAML frontmatter compensation block
#   - Updates the markdown salary table to match
#   - Sets last_updated, salary_data_quarter, next_review_due
#   - Runs validation
```

**3. Cache Invalidation Fix**

Replace the current module-level caching with a time-based or filesystem-watching cache:

```javascript
// Option A: Time-based cache (simple, recommended for Vercel)
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
```

Apply the same TTL pattern to `_cachedCompanies` in `app/api/companies/route.js`.

**4. Admin Dashboard (Future)**

If the business scales beyond one operator maintaining the database, build a simple admin interface:

- **Company browser:** List all companies, show data completeness per company (how many of the 14 roles are filled, data quality levels, last updated dates)
- **Staleness dashboard:** Sort all files by `last_updated`, highlight files overdue for review
- **Add company wizard:** Web form version of the `add-company.js` script
- **Bulk editor:** Update salary ranges for a company's roles via a spreadsheet-like interface
- **Matching audit log:** Show recent company/role matching attempts, highlight failures for alias improvement

This is a Phase 2 investment. For Phase 1, the CLI scripts are sufficient.

### Adding New Standard Roles

If the canonical role set needs to expand (e.g., adding `frontend-engineer` or `ios-engineer` as distinct from `software-engineer`):

1. Add the new role to the `standardRoles` array in `matchCompanySpecificRole()` in `research-matcher.js`
2. Add pattern mappings to `ROLE_MAPPINGS` in `research-matcher.js`
3. Create a template file and generate it across all 319 company directories using a batch script
4. Prioritize populating data for high-traffic companies first; the rest can use a "placeholder" template that triggers the general-market fallback

### Data Refresh Cycle Automation

For the quarterly refresh cycle at scale:

```
QUARTER START (e.g., Q3 2025)
  |
  +-- Week 1: Automated scrape of Levels.fyi / Glassdoor API (if available)
  |            or manual data collection for top 50 companies
  |
  +-- Week 2: Run comparison script:
  |            scripts/compare-salary-data.js --old Q2 --new Q3
  |            Flags: changes > 20% (needs manual review)
  |                   changes > 10% (auto-update with logging)
  |                   changes < 5% (auto-update, no flag)
  |
  +-- Week 3: Human review of flagged changes
  |            Update negotiation prose for companies with major shifts
  |
  +-- Week 4: Run validation suite
  |            Update all last_updated / salary_data_quarter fields
  |            Deploy
  |
  +-- Post-deploy: Monitor playbook generation logs for any issues
```

---

## 6. Anti-Hallucination Guardrails

### Why This Matters

SalaryPrep charges $39 for a playbook. Users are making real career decisions -- counter-offering $20K-$100K+ based on our data. A hallucinated salary range that is too high causes them to lose the offer. A range that is too low causes them to leave money on the table. Either outcome destroys trust and generates refund requests.

The current system in `lib/prompts.js` already has strong anti-hallucination rules (the `buildResearchBlock()` function). This section codifies those rules and proposes additional layers.

### Hard Rules (Non-Negotiable)

These rules must be enforced at every layer of the system:

#### Rule 1: If Not in Database, Do Not Present as Verified

```
IF lookupResearch() returns null:
  - AI prompt MUST use the "no verified data" accuracy rules
  - ALL salary figures MUST be labeled "Estimated based on general market data"
  - The playbook MUST include a disclaimer: "This playbook uses general market
    intelligence. Company-specific verified data was not available."
  - The PDF MUST NOT use the phrase "Verified Compensation Data" anywhere

IF lookupResearch() returns data:
  - ALL salary ranges in the playbook MUST come from the research file
  - The AI MUST NOT substitute its own estimates for fields covered in the data
  - Figures MUST be quoted exactly (no rounding "$152K-$215K" to "$150K-$220K")
```

**Enforcement:** This is currently handled by the two-branch logic in `buildResearchBlock()`. No change needed to the logic, but add automated tests (see below).

#### Rule 2: Company Matching Must Be Exact After Normalization

```
matchCompany("Google")        -> { directory: "google", confidence: "exact" }    OK
matchCompany("Gogle")         -> null                                            OK (typo)
matchCompany("Facebook")      -> { directory: "meta", confidence: "alias" }      OK
matchCompany("Some Startup")  -> null                                            OK (not in DB)
```

**The matcher must NEVER return a match it is not confident about.** The current implementation already follows this principle. The partial match (step 4 in `matchCompany()`) only fires when exactly one directory contains or is contained in the slug. This is acceptable.

**Enhancement:** If a fuzzy match is added (Section 3), it must return `confidence: 'fuzzy'` and the AI prompt must include a confirmation line in the playbook output.

#### Rule 3: Role Matching With Explicit Confirmation

When the role matching involves pattern heuristics (which it always does), the playbook should confirm the mapping:

```javascript
// Add to the research section of the prompt:
if (research.matchType === 'standard-role') {
  researchSection += `\n**Role Classification:** User's title "${userTitle}" was matched to our ` +
    `"${research.role}" research category. If this classification feels incorrect, ` +
    `the user should contact support for a revised playbook.\n`;
}
if (research.matchType === 'company-specific-role') {
  researchSection += `\n**Specialty Role Match:** User's title "${userTitle}" was matched to ` +
    `our specialty research file "${research.role}" for ${research.company}. ` +
    `This is a company-specific role with tailored compensation data.\n`;
}
```

#### Rule 4: Every Salary Figure Traceable to a Database Field

After the structured data migration (Section 4), implement a traceability check:

```javascript
// In the prompt, instruct the AI to cite the source for every number:
// "When presenting salary ranges, always include the region and source:
//  'According to our verified data for [Role] at [Company] in [Region],
//   base salary ranges from $XK to $YK (SalaryPrep Research DB, Q2 2025)'"
```

**Post-migration enforcement:** Build a post-generation validation step that:

1. Extracts all dollar amounts from the AI-generated playbook text
2. Cross-references them against the structured `compensation` array in the frontmatter
3. Flags any dollar amount that does not appear in the database (potential hallucination)
4. Logs the flagged amounts for manual review

```javascript
// scripts/audit-playbook-output.js (or inline in generate-playbook route)
function auditSalaryFigures(playbookText, researchMetadata) {
  if (!researchMetadata?.compensation) return { pass: true, flags: [] };

  const knownAmounts = new Set();
  for (const region of researchMetadata.compensation) {
    knownAmounts.add(region.base_low);
    knownAmounts.add(region.base_high);
    knownAmounts.add(region.stock_low);
    knownAmounts.add(region.stock_high);
    knownAmounts.add(region.total_comp_low);
    knownAmounts.add(region.total_comp_high);
  }

  // Extract dollar amounts from playbook text
  const mentioned = playbookText.match(/\$(\d{1,3}(?:,\d{3})*)/g) || [];
  const flags = [];
  for (const amt of mentioned) {
    const num = parseInt(amt.replace(/[$,]/g, ''));
    // Allow +-5% tolerance for rounding
    const isKnown = [...knownAmounts].some(
      (known) => Math.abs(num - known) / known < 0.05
    );
    if (!isKnown && num > 10000) { // Ignore small numbers (percentages, etc.)
      flags.push({ amount: amt, status: 'unverified' });
    }
  }

  return {
    pass: flags.length === 0,
    flags,
  };
}
```

#### Rule 5: Data Completeness Indicator

Every playbook should include a "Data Confidence" indicator, visible to the user:

| Indicator | Criteria | Display in Playbook |
|-----------|----------|-------------------|
| **Full Coverage** | Company matched + role matched + data_quality is "high" + last_updated within 120 days | "This playbook is powered by verified compensation data for [Role] at [Company], last updated [date]." |
| **Partial Coverage** | Company matched + role matched + (data_quality is "medium" or "low" OR data is >120 days old) | "This playbook uses compensation data for [Role] at [Company] (last verified [date]). Some figures may have shifted since our last update." |
| **Company Only** | Company matched but role did not match | "We have verified data for [Company] but not for your specific role. Salary ranges are estimated based on comparable roles at this company." |
| **General Market** | Neither company nor role matched | "This playbook uses general market intelligence. For company-specific verified data, check if your company is in our coverage list." |

Render this indicator:
- In the AI prompt (so the AI knows what tier of data it is working with)
- In the PDF, at the top of Section 2 (Market Salary Analysis)
- In the PDF footer on every page

#### Rule 6: PDF Footer Disclaimer

Every generated PDF must include a standard disclaimer in the footer of every content page. Update `lib/pdf-generator.js`:

```javascript
// In the footer loop, add below the page number line:
doc.fontSize(7).fillColor('#999999').font('Helvetica')
  .text(
    'Compensation data sourced from SalaryPrep Research Database. Figures are estimates based on available market data and should be verified with your recruiter. SalaryPrep is not liable for negotiation outcomes.',
    60,
    doc.page.height - 28,
    { width: doc.page.width - 120, align: 'center' }
  );
```

### Automated Testing for Anti-Hallucination

Build test cases that validate the guardrail system:

```javascript
// tests/anti-hallucination.test.js

// Test 1: When no research match, prompt must contain "Estimated" language
test('no-match prompt uses estimate language', () => {
  const prompt = getOfferPrompt(mockData, null);
  expect(prompt).toContain('Estimated based on general market data');
  expect(prompt).not.toContain('VERIFIED COMPANY INTELLIGENCE');
});

// Test 2: When research match exists, prompt must contain verified data block
test('match prompt uses verified data block', () => {
  const prompt = getOfferPrompt(mockData, mockResearch);
  expect(prompt).toContain('VERIFIED COMPANY INTELLIGENCE DATABASE');
  expect(prompt).toContain('--- BEGIN VERIFIED DATA ---');
  expect(prompt).toContain('Use it as your PRIMARY source');
});

// Test 3: Company matcher returns null for unknown companies
test('unknown company returns null', () => {
  expect(matchCompany('Totally Made Up Company')).toBeNull();
});

// Test 4: Company matcher never returns partial match when ambiguous
test('ambiguous partial match returns null', () => {
  // "ai" could match "adept-ai", "scale-ai", "stability-ai", etc.
  expect(matchCompany('ai')).toBeNull();
});

// Test 5: Role matcher returns null for unrecognized titles
test('unrecognized role returns null', () => {
  expect(matchRole('Chief Happiness Officer')).toBeNull();
});

// Test 6: Salary figures in research file are plausible
test('all research files have plausible salary ranges', () => {
  const dirs = fs.readdirSync(RESEARCH_DIR);
  for (const dir of dirs) {
    const files = fs.readdirSync(path.join(RESEARCH_DIR, dir));
    for (const file of files) {
      const content = fs.readFileSync(path.join(RESEARCH_DIR, dir, file), 'utf-8');
      const ranges = content.match(/\$(\d+)K/g);
      if (ranges) {
        for (const r of ranges) {
          const val = parseInt(r.replace(/[$K]/g, ''));
          expect(val).toBeGreaterThan(20);
          expect(val).toBeLessThan(2000);
        }
      }
    }
  }
});
```

### Summary of All Anti-Hallucination Layers

```
Layer 1: MATCHING (research-matcher.js)
  - Returns null when uncertain
  - Never guesses
  - Confidence levels on every match

Layer 2: PROMPT ENGINEERING (prompts.js)
  - Two-tier rules: verified vs. estimated
  - Explicit instructions to quote figures exactly
  - "Do NOT invent data points"
  - Role classification confirmation

Layer 3: DATA QUALITY METADATA (frontmatter)
  - data_quality: high/medium/low
  - last_updated with staleness detection
  - machine-readable sources for audit trail

Layer 4: POST-GENERATION AUDIT (future)
  - Cross-reference AI output against structured data
  - Flag unverified dollar amounts
  - Log for manual review

Layer 5: USER-FACING TRANSPARENCY (PDF)
  - Data confidence indicator in report
  - Source attribution ("Verified as of Q2 2025")
  - Footer disclaimer on every page

Layer 6: AUTOMATED TESTING (CI)
  - Schema validation for all research files
  - Anti-hallucination prompt tests
  - Salary plausibility checks
  - Matching edge case tests
```

---

## Implementation Priority

| Phase | Work Item | Effort | Impact |
|-------|-----------|--------|--------|
| **Phase 1 (Week 1-2)** | Build validation script (`scripts/validate-research.js`) | 2 days | Catches existing data issues |
| **Phase 1 (Week 1-2)** | Fix cache invalidation (TTL-based) in `research-matcher.js` and `companies/route.js` | 1 hour | Eliminates restart requirement |
| **Phase 1 (Week 1-2)** | Add PDF footer disclaimer to `pdf-generator.js` | 1 hour | Immediate trust/liability improvement |
| **Phase 2 (Week 3-4)** | Build migration script + migrate all files to YAML frontmatter | 3 days | Unlocks structured queries |
| **Phase 2 (Week 3-4)** | Update `research-matcher.js` to parse frontmatter (add `gray-matter`) | 1 day | Exposes metadata at runtime |
| **Phase 2 (Week 3-4)** | Add staleness detection to `prompts.js` | 2 hours | Users see data age |
| **Phase 2 (Week 3-4)** | Add data confidence indicator to prompt + PDF | 1 day | Transparency for users |
| **Phase 3 (Week 5-6)** | Build `add-company.js` and `update-salaries.js` scripts | 2 days | Scalable data management |
| **Phase 3 (Week 5-6)** | Build anti-hallucination test suite | 2 days | CI-enforced guardrails |
| **Phase 3 (Week 5-6)** | Implement post-generation salary audit | 1 day | Catches AI hallucination |
| **Phase 4 (Month 2+)** | First quarterly data refresh cycle | 1 week | Fresh data |
| **Phase 4 (Month 2+)** | Free report feature powered by structured data | 3-5 days | New revenue funnel |
| **Phase 4 (Month 2+)** | Company comparison pages (SEO) | 3-5 days | Organic traffic growth |
| **Future** | Admin dashboard | 2-3 weeks | Scales beyond single operator |
| **Future** | User data accuracy feedback loop | 1 week | Continuous data improvement |

---

## Appendix: File Counts and Coverage

| Metric | Value |
|--------|-------|
| Company directories | 319 |
| Total markdown files | 4,470 |
| Standard roles per company | 13 |
| Specialty roles (total) | ~320 |
| Files per company | 14 (13 standard + 1 specialty) |
| Regions per salary table | Up to 6 |
| Currencies covered | USD, GBP, CHF, INR, EUR, CAD (varies by company) |
| Sources cited per file | 3-5 (Levels.fyi, Glassdoor, H1B, Blind, company-specific) |
| Source date range | 2024-2026 |
| Company alias mappings | ~135 |
| Role pattern mappings | ~50 patterns across 13 roles |
