# Free Salary Report — Technical Specification

## Table of Contents

1. [Overview & Business Goal](#1-overview--business-goal)
2. [User Flow](#2-user-flow)
3. [Report Contents](#3-report-contents)
4. [Technical Implementation](#4-technical-implementation)
5. [Anti-Hallucination Rules](#5-anti-hallucination-rules)
6. [Markdown Parsing Strategy](#6-markdown-parsing-strategy)
7. [Frontend Components](#7-frontend-components)
8. [API Contracts](#8-api-contracts)
9. [Rate Limiting & Lead Storage](#9-rate-limiting--lead-storage)
10. [PDF Layout Specification](#10-pdf-layout-specification)
11. [File Manifest](#11-file-manifest)
12. [Open Questions & Future Work](#12-open-questions--future-work)

---

## 1. Overview & Business Goal

### What

A **free**, personalized salary report PDF that any visitor can generate from SalaryPrep's verified research database. The report shows salary ranges, company negotiation DNA, level mappings, and sourcing information for a specific company + role combination. It does **not** include negotiation scripts, objection-handling strategies, or AI-generated content of any kind.

### Why

The report serves as a **lead magnet**. It captures a user's email address and demonstrates the depth of SalaryPrep's data, creating a natural upsell path to the $39 full negotiation playbook. Every report ends with a clear CTA to purchase the playbook.

### Business Metrics

| Metric | Target |
|--------|--------|
| Email capture rate | >60% of visitors who reach the form |
| Report-to-playbook conversion | >5% within 7 days |
| Report generation time | <3 seconds (no AI calls) |
| Cost per report | $0 (no API calls, no AI, purely local data extraction) |

### Key Constraints

- **No AI generation.** Every piece of data in the report must come directly from the parsed markdown files in `/research/`.
- **No database.** The app is stateless. Lead data is stored in a local JSON file (or future database) as a lightweight append-only log.
- **No estimates.** If data is missing, the report says "Data not available" rather than guessing.
- **Company/role selection is constrained.** Users pick from our verified database only; no free-text company or role entry reaches the PDF generator.

---

## 2. User Flow

### Page: `/report`

The report page is a single-page, multi-step form. No page reloads between steps. The URL stays at `/report` throughout.

### Step-by-Step Flow

```
[Step 1: Select Company]
        |
        v
[Step 2: Select Role]
        |
        v
[Step 3: Optional Details]  (current salary, years experience, location)
        |
        v
[Step 4: Report Preview]    (shows what the PDF will contain)
        |
        v
[Step 5: Email Capture]     (required before PDF download)
        |
        v
[Download PDF]
```

### Step 1: Select Company

- Uses the existing `CompanyAutocomplete` component (`/components/CompanyAutocomplete.js`).
- The component fetches from `GET /api/companies`, which reads directory names from `/research/`.
- **No free-text entry.** The user MUST select a company from the autocomplete dropdown. The "Next" button is disabled until `hasMatch` is `true` (an exact match exists in the autocomplete).
- The selected value is the company `id` (directory slug, e.g., `"google"`, `"jpmorgan-chase"`).

### Step 2: Select Role

- A new `RoleSelector` component fetches available roles for the selected company from `GET /api/companies/[companyId]/roles` (new endpoint).
- Roles are displayed as a selectable list of styled buttons/cards (not a dropdown), showing human-readable names (e.g., "Senior Software Engineer" instead of `senior-software-engineer`).
- Typically 13 standard roles + 1 company-specific specialty role per company (14 total).
- The "Next" button is disabled until a role is selected.

### Step 3: Optional Details (Not Used in PDF)

Three optional fields for future personalization and lead enrichment:

| Field | Type | Validation | Purpose |
|-------|------|-----------|---------|
| Current total compensation | Text input, numeric | Optional, no validation | Lead enrichment, future personalization |
| Years of experience | Dropdown: 0-2, 3-5, 6-10, 11-15, 16+ | Optional | Lead enrichment |
| Location / target region | Dropdown of regions from the markdown | Optional | Could highlight relevant row in salary table |

These fields are stored with the lead record but are **not** used to modify the PDF content in v1. The PDF always shows all regions from the markdown.

### Step 4: Report Preview

Before requiring email, show the user a preview of what the report contains:

- Company name + role title
- A blurred/truncated preview of the salary table (first 2 rows visible, rest blurred)
- Section headings that will appear in the PDF: "Salary Ranges by Region", "Company Negotiation Profile", "Level Mapping", "Evidence & Sources"
- Text: "Your free report is ready. Enter your email to download the full PDF."

This preview builds trust and creates a micro-commitment before the email gate.

### Step 5: Email Capture

- Single email input field (required).
- Basic client-side email format validation.
- Submit button: "Get My Free Report"
- On submit:
  1. POST to `/api/generate-report` with `{ companyId, roleId, email, currentComp?, yearsExp?, location? }`
  2. API validates inputs, checks rate limit, parses markdown, generates PDF, stores lead.
  3. Returns the PDF as a binary response (`Content-Type: application/pdf`).
  4. Frontend triggers browser download of the PDF.
  5. Show success state: "Your report has been downloaded! Check your downloads folder."
  6. Below the success state, show the upsell CTA prominently.

### No-Data Fallback Flow

If a user somehow reaches a state where data doesn't exist (edge case -- since company and role are both constrained to DB):

- Show: "We don't have data for [Company] [Role] yet. Enter your email and we'll notify you when it's available."
- Store the email + requested company + role in the lead log with `status: "waitlist"`.
- Do not generate a PDF.

---

## 3. Report Contents

The PDF report contains **only** data extracted from the corresponding markdown file in `/research/[company]/[role].md`. Nothing is estimated, interpolated, or AI-generated.

### 3.1 Cover Page

| Element | Content |
|---------|---------|
| Brand | "SalaryPrep" logo text, top-left |
| Title | "Salary Report" |
| Subtitle | "[Role Display Name] at [Company Display Name]" |
| Date | "Generated [Month Day, Year]" |
| Confidential notice | "FREE REPORT -- Prepared for personal use." |

### 3.2 Section: Company Negotiation Profile

**Source:** The `**Negotiation DNA**` section from the markdown (the paragraph block after the second occurrence of "Negotiation DNA", which is the detailed prose section, NOT the one-line summary).

Extracted content:
- The full prose paragraphs describing the company's negotiation culture, compensation philosophy, and market positioning.
- Truncated to the first 2 paragraphs maximum to keep the free report concise while still showing value. The playbook includes the full content.

PDF rendering:
- Section header: "Company Negotiation Profile"
- Body: The extracted prose, rendered as paragraphs.
- If missing: "Detailed company negotiation profile available in the full playbook."

### 3.3 Section: Salary Ranges by Region

**Source:** The markdown table immediately after the `### [Role] | [Company] Global Negotiation Guide` header line.

The table has this consistent format across all 4,000+ research files:

```
| Region | Base Salary | Stock (RSU/4yr) | Bonus | Total Comp |
|--------|-------------|-----------------|-------|------------|
| Bay Area (HQ) | $190K-$265K | $220K-$520K | 15-20% | $290K-$460K |
| New York City | $185K-$260K | $210K-$500K | 15-20% | $280K-$445K |
...
```

PDF rendering:
- Section header: "Salary Ranges by Region"
- Render as a styled table with alternating row backgrounds.
- Column headers: Region, Base Salary, Stock (RSU/4yr), Bonus, Total Comp.
- Each cell value copied verbatim from the markdown (preserves currency symbols, ranges, and formatting).
- If missing: "Salary range data not available for this role."

### 3.4 Section: Level Mapping

**Source:** The line starting with `**Level Mapping:**` in the markdown.

Example: `**Level Mapping:** Senior SWE (L5) at Google = E5 at Meta, L63 at Microsoft, SDE III at Amazon, ICT4 at Apple, Senior at Netflix, Senior at Stripe`

PDF rendering:
- Section header: "Level Mapping Across Companies"
- Body: The mapping string, potentially reformatted as a small horizontal table or a styled list of equivalences.
- If missing: "Level mapping data not available for this role."

### 3.5 Section: Data Sources

**Source:** The `**Evidence & Sources**` section from the markdown.

Example:
```
**Evidence & Sources**
- Levels.fyi Google L5 SWE compensation data, all regions (2024-2026)
- Glassdoor Google Senior Software Engineer salary reports (2024-2026)
- Blind verified compensation threads, Google L5 across orgs (2024-2025)
```

PDF rendering:
- Section header: "Evidence & Sources"
- Body: Bulleted list of source citations, copied verbatim.
- If missing: "Source citations not available."

### 3.6 Data Completeness Indicator

A visual indicator showing which sections the report includes:

```
Data Completeness
[x] Salary Ranges by Region
[x] Company Negotiation Profile
[x] Level Mapping
[x] Evidence & Sources
```

Each item is checked or unchecked based on whether the corresponding data was successfully parsed from the markdown. This builds trust by being transparent about data availability.

### 3.7 Footer Elements (Every Page)

| Element | Content |
|---------|---------|
| Timestamp | "Data last updated: [file modification date of the .md file]" |
| Disclaimer | "Data sourced from Levels.fyi, Glassdoor, Blind, H1B disclosures, and public filings. Figures represent reported ranges and may not reflect every individual offer." |
| Anti-hallucination statement | "This report contains only verified data from SalaryPrep's research database. No figures have been estimated or AI-generated." |
| Page number | "Page X of Y" |

### 3.8 Final Page: Upsell CTA

A full-page call to action:

```
Want the Full Negotiation Playbook?

Your free report shows the data.
The playbook shows you exactly how to use it.

The $39 Negotiation Playbook includes:
  - Word-for-word negotiation scripts tailored to [Company]
  - Objection handling for every common pushback
  - Company-specific negotiation levers and strategy
  - Step-by-step timeline from offer to signed deal
  - Competing offer framing strategy

Get yours at salaryprep.com

[salaryprep.com]
```

---

## 4. Technical Implementation

### 4.1 New Files to Create

```
app/
  report/
    page.js                          # ReportPage component (multi-step form)
  api/
    companies/
      [companyId]/
        roles/
          route.js                   # GET: returns roles for a company
    generate-report/
      route.js                       # POST: generates and returns PDF

components/
  RoleSelector.js                    # Role selection grid component
  ReportPreview.js                   # Blurred preview before email gate

lib/
  markdown-parser.js                 # Extracts structured data from research .md files
  report-pdf-generator.js            # Generates the free report PDF (separate from playbook PDF)
  lead-store.js                      # Lightweight JSON file lead storage
```

### 4.2 New API: GET /api/companies/[companyId]/roles

**Purpose:** Returns the list of available roles for a given company.

**File:** `app/api/companies/[companyId]/roles/route.js`

**Implementation:**

```javascript
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ROLE_DISPLAY_NAMES = {
  'software-engineer': 'Software Engineer',
  'senior-software-engineer': 'Senior Software Engineer',
  'staff-software-engineer': 'Staff Software Engineer',
  'engineering-manager': 'Engineering Manager',
  'product-manager': 'Product Manager',
  'product-designer': 'Product Designer',
  'data-engineer': 'Data Engineer',
  'data-scientist': 'Data Scientist',
  'ml-ai-engineer': 'ML/AI Engineer',
  'devops-engineer': 'DevOps / SRE Engineer',
  'security-engineer': 'Security Engineer',
  'solutions-architect': 'Solutions Architect',
  'technical-program-manager': 'Technical Program Manager',
};

export async function GET(req, { params }) {
  const { companyId } = params;
  const dirPath = path.join(process.cwd(), 'research', companyId);

  if (!fs.existsSync(dirPath)) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  const files = fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));

  const roles = files.map(slug => ({
    id: slug,
    name: ROLE_DISPLAY_NAMES[slug] || formatRoleName(slug),
    isStandard: slug in ROLE_DISPLAY_NAMES,
  }));

  return NextResponse.json(roles);
}

function formatRoleName(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
```

**Response shape:**
```json
[
  { "id": "software-engineer", "name": "Software Engineer", "isStandard": true },
  { "id": "senior-software-engineer", "name": "Senior Software Engineer", "isStandard": true },
  { "id": "agentic-commerce-platform-engineer", "name": "Agentic Commerce Platform Engineer", "isStandard": false }
]
```

### 4.3 New API: POST /api/generate-report

**Purpose:** Validates inputs, parses the research markdown, generates a PDF, stores the lead, and returns the PDF binary.

**File:** `app/api/generate-report/route.js`

**Request body (JSON):**
```json
{
  "companyId": "google",
  "roleId": "senior-software-engineer",
  "email": "user@example.com",
  "currentComp": "150000",
  "yearsExp": "6-10",
  "location": "Bay Area"
}
```

**Implementation outline:**

```javascript
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseResearchMarkdown } from '../../../lib/markdown-parser';
import { generateReportPDF } from '../../../lib/report-pdf-generator';
import { storeLead, checkRateLimit } from '../../../lib/lead-store';

export async function POST(req) {
  try {
    const { companyId, roleId, email, currentComp, yearsExp, location } = await req.json();

    // 1. Validate required fields
    if (!companyId || !roleId || !email) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // 3. Validate companyId exists as a directory (prevents path traversal)
    const companyDir = path.join(process.cwd(), 'research', companyId);
    if (!fs.existsSync(companyDir) || !fs.statSync(companyDir).isDirectory()) {
      return NextResponse.json({ error: 'Company not found.' }, { status: 404 });
    }

    // 4. Validate roleId exists as a file for this company
    const mdPath = path.join(companyDir, `${roleId}.md`);
    if (!fs.existsSync(mdPath)) {
      // Store as waitlist lead
      await storeLead({ email, companyId, roleId, currentComp, yearsExp, location, status: 'waitlist' });
      return NextResponse.json({ error: 'Data not available for this role.', waitlisted: true }, { status: 404 });
    }

    // 5. Rate limit check: 3 reports per email per day
    const rateLimitOk = await checkRateLimit(email);
    if (!rateLimitOk) {
      return NextResponse.json(
        { error: 'Rate limit reached. You can generate up to 3 reports per day.' },
        { status: 429 }
      );
    }

    // 6. Read and parse the markdown file
    const markdownContent = fs.readFileSync(mdPath, 'utf-8');
    const mdStat = fs.statSync(mdPath);
    const parsedData = parseResearchMarkdown(markdownContent);
    parsedData.lastUpdated = mdStat.mtime;

    // 7. Get display names for company and role
    // (Reuse the formatCompanyName logic from /api/companies/route.js)
    const companyDisplayName = getCompanyDisplayName(companyId);
    const roleDisplayName = getRoleDisplayName(roleId);

    // 8. Generate PDF
    const pdfBuffer = await generateReportPDF({
      companyId,
      companyName: companyDisplayName,
      roleId,
      roleName: roleDisplayName,
      data: parsedData,
    });

    // 9. Store lead
    await storeLead({
      email,
      companyId,
      roleId,
      currentComp: currentComp || null,
      yearsExp: yearsExp || null,
      location: location || null,
      status: 'downloaded',
      timestamp: new Date().toISOString(),
    });

    // 10. Return PDF as binary response
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="SalaryPrep-Report-${companyId}-${roleId}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report. Please try again.' },
      { status: 500 }
    );
  }
}
```

**Response:**
- **200:** Binary PDF body with `Content-Type: application/pdf`
- **400:** `{ "error": "..." }` for validation errors
- **404:** `{ "error": "...", "waitlisted": true }` when data is missing
- **429:** `{ "error": "..." }` for rate limit exceeded
- **500:** `{ "error": "..." }` for unexpected server errors

### 4.4 Security: Input Validation & Path Traversal Prevention

The `companyId` and `roleId` parameters are used to construct file paths. Both MUST be validated:

```javascript
// companyId and roleId must match: lowercase letters, numbers, and hyphens only
const SAFE_SLUG = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

if (!SAFE_SLUG.test(companyId) || !SAFE_SLUG.test(roleId)) {
  return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
}
```

Additionally, verify the resolved path is within the `/research/` directory:

```javascript
const resolvedPath = path.resolve(companyDir, `${roleId}.md`);
const researchRoot = path.resolve(process.cwd(), 'research');
if (!resolvedPath.startsWith(researchRoot)) {
  return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
}
```

---

## 5. Anti-Hallucination Rules

These rules are **non-negotiable**. The free report must contain ONLY verified data. Any violation destroys user trust and the product's value proposition.

### Rule 1: Company Selection is Constrained

- The `CompanyAutocomplete` component only allows selection from the list returned by `GET /api/companies`.
- The "Next" button is disabled until an exact match is confirmed.
- The API endpoint re-validates that the company directory exists before proceeding.
- **No free-text company input reaches the PDF generator.**

### Rule 2: Role Selection is Constrained

- The `RoleSelector` component only shows roles returned by `GET /api/companies/[companyId]/roles`.
- Roles are rendered as selectable cards, not a text input.
- The API endpoint re-validates that the role file exists for the given company.
- **No free-text role input reaches the PDF generator.**

### Rule 3: Every Number Comes from Parsed Markdown

- The `parseResearchMarkdown()` function extracts data using regex patterns against the known markdown format.
- The PDF generator receives a structured `parsedData` object with explicit fields.
- The PDF generator renders ONLY the fields present in `parsedData`.
- **No arithmetic, averaging, interpolation, or estimation is performed on the numbers.**
- Cell values are copied verbatim, including currency symbols, ranges, and formatting.

### Rule 4: Missing Data Shows "Data not available"

- Every section in the PDF generator checks if the corresponding field in `parsedData` is `null` or empty.
- If missing, the section renders: `"[Section name] data not available for this role."` in muted gray text.
- **Never fill in a placeholder, estimate, or default value.**

### Rule 5: PDF Footer on Every Page

Every page of the PDF includes:

> "This report contains only verified data from SalaryPrep's research database. No figures have been estimated or AI-generated."

### Rule 6: No AI Calls

- The `/api/generate-report` endpoint must NEVER call the Anthropic API, OpenAI, or any other AI service.
- The entire pipeline is: read file -> parse with regex -> render PDF.
- This should be enforced by code review and by the absence of any AI SDK import in the report generation files.

---

## 6. Markdown Parsing Strategy

### 6.1 Module: `lib/markdown-parser.js`

This module takes a raw markdown string (the contents of a research `.md` file) and returns a structured object.

### 6.2 Markdown Format (Verified Across All 4,000+ Files)

Every research file follows this structure:

```markdown
### [Role Title] | [Company] Global Negotiation Guide

**Negotiation DNA:** [one-line summary] | [tags] | **[LABEL]**

| Region | Base Salary | Stock (RSU/4yr) | Bonus | Total Comp |
|--------|-------------|-----------------|-------|------------|
| [Region 1] | [Base] | [Stock] | [Bonus] | [Total] |
| [Region 2] | [Base] | [Stock] | [Bonus] | [Total] |
...

**Negotiation DNA**

[Multi-paragraph prose about the company's negotiation culture...]

**Level Mapping:** [Equivalence string]

[Additional sections: Global Levers, Negotiate Up Strategy, etc.]

**Evidence & Sources**
- [Source 1]
- [Source 2]
...
```

### 6.3 Parsing Functions

```javascript
export function parseResearchMarkdown(markdown) {
  return {
    title: extractTitle(markdown),
    dnaSummary: extractDNASummary(markdown),
    salaryTable: extractSalaryTable(markdown),
    negotiationDNA: extractNegotiationDNA(markdown),
    levelMapping: extractLevelMapping(markdown),
    sources: extractSources(markdown),
  };
}
```

#### 6.3.1 extractTitle(markdown)

**Target:** First line `### [Role Title] | [Company] Global Negotiation Guide`

```javascript
function extractTitle(markdown) {
  const match = markdown.match(/^###\s+(.+?)(?:\n|$)/m);
  return match ? match[1].trim() : null;
}
```

**Returns:** `"Senior Software Engineer (L5) | Google Global Negotiation Guide"` or `null`.

#### 6.3.2 extractDNASummary(markdown)

**Target:** The first `**Negotiation DNA:**` line (one-line summary with tags).

```javascript
function extractDNASummary(markdown) {
  const match = markdown.match(/^\*\*Negotiation DNA:\*\*\s*(.+?)$/m);
  return match ? match[1].trim() : null;
}
```

**Returns:** `"Industry-benchmark L5 level + Strong base + massive RSU grants + 15% bonus with performance multiplier | Google L5 is the most heavily benchmarked senior IC role in tech | **MARKET-DEFINING COMP**"` or `null`.

#### 6.3.3 extractSalaryTable(markdown)

**Target:** The markdown table starting with `| Region |`.

```javascript
function extractSalaryTable(markdown) {
  const lines = markdown.split('\n');
  const tableStartIndex = lines.findIndex(line => /^\|\s*Region\s*\|/.test(line));
  if (tableStartIndex === -1) return null;

  const headers = parseTableRow(lines[tableStartIndex]);
  // Skip the separator line (|--------|...)
  const rows = [];
  for (let i = tableStartIndex + 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('|')) break;
    rows.push(parseTableRow(line));
  }

  return { headers, rows };
}

function parseTableRow(line) {
  return line
    .split('|')
    .map(cell => cell.trim())
    .filter(cell => cell.length > 0);
}
```

**Returns:**
```json
{
  "headers": ["Region", "Base Salary", "Stock (RSU/4yr)", "Bonus", "Total Comp"],
  "rows": [
    ["Bay Area (HQ)", "$190K-$265K", "$220K-$520K", "15-20%", "$290K-$460K"],
    ["New York City", "$185K-$260K", "$210K-$500K", "15-20%", "$280K-$445K"],
    ["Seattle / Kirkland", "$180K-$250K", "$200K-$480K", "15-20%", "$270K-$430K"]
  ]
}
```

Or `null` if no table found.

#### 6.3.4 extractNegotiationDNA(markdown)

**Target:** The prose paragraphs following the standalone `**Negotiation DNA**` header (NOT the one-line summary). Ends at the next `**bold header**` line.

```javascript
function extractNegotiationDNA(markdown) {
  // Find the standalone "**Negotiation DNA**" header (not the "**Negotiation DNA:**" summary line)
  const marker = '**Negotiation DNA**';
  const markerIndex = markdown.indexOf(marker);
  if (markerIndex === -1) return null;

  // Get content after the marker
  const afterMarker = markdown.substring(markerIndex + marker.length).trim();
  const lines = afterMarker.split('\n');

  // Collect paragraphs until we hit the next section header (a line starting with **)
  const paragraphs = [];
  let currentParagraph = '';

  for (const line of lines) {
    const trimmed = line.trim();

    // Stop at next bold header (but not bold text within paragraphs)
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && paragraphs.length > 0) break;
    if (trimmed.startsWith('**Level Mapping')) break;

    if (trimmed === '') {
      if (currentParagraph) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = '';
      }
    } else {
      currentParagraph += (currentParagraph ? ' ' : '') + trimmed;
    }
  }

  if (currentParagraph) {
    paragraphs.push(currentParagraph.trim());
  }

  // Return first 2 paragraphs for the free report
  return paragraphs.length > 0 ? paragraphs.slice(0, 2) : null;
}
```

**Returns:** An array of 1-2 paragraph strings, or `null`.

#### 6.3.5 extractLevelMapping(markdown)

**Target:** The line starting with `**Level Mapping:**`.

```javascript
function extractLevelMapping(markdown) {
  const match = markdown.match(/^\*\*Level Mapping:\*\*\s*(.+?)$/m);
  return match ? match[1].trim() : null;
}
```

**Returns:** `"Senior SWE (L5) at Google = E5 at Meta, L63 at Microsoft, SDE III at Amazon, ICT4 at Apple, Senior at Netflix, Senior at Stripe"` or `null`.

#### 6.3.6 extractSources(markdown)

**Target:** The bulleted list under `**Evidence & Sources**`.

```javascript
function extractSources(markdown) {
  const marker = '**Evidence & Sources**';
  const markerIndex = markdown.indexOf(marker);
  if (markerIndex === -1) return null;

  const afterMarker = markdown.substring(markerIndex + marker.length).trim();
  const lines = afterMarker.split('\n');
  const sources = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      sources.push(trimmed.replace(/^-\s*/, ''));
    } else if (trimmed === '') {
      continue;
    } else {
      // Hit a non-list line, stop
      break;
    }
  }

  return sources.length > 0 ? sources : null;
}
```

**Returns:** `["Levels.fyi Google L5 SWE compensation data, all regions (2024-2026)", "Glassdoor Google Senior Software Engineer salary reports (2024-2026)", ...]` or `null`.

### 6.4 Edge Cases

| Scenario | Handling |
|----------|----------|
| Markdown table uses different currency symbols (USD, GBP, CHF, INR) | No conversion; values are rendered verbatim |
| Markdown table has different column count | `parseTableRow` handles dynamic column counts |
| "Negotiation DNA" section is missing | `extractNegotiationDNA` returns `null`; PDF shows "Data not available" |
| No "Evidence & Sources" section | `extractSources` returns `null`; PDF shows "Data not available" |
| File is empty or malformed | All extractors return `null`; PDF shows data completeness: 0/4 sections |
| Role-specific specialty file has slightly different format | Parsing is permissive (regex-based), falls back to `null` for each missing section |

---

## 7. Frontend Components

### 7.1 ReportPage (`/app/report/page.js`)

**Type:** Client component (`'use client'`)

**State:**
```javascript
const [step, setStep] = useState(1);               // 1-5
const [companyId, setCompanyId] = useState('');      // e.g., "google"
const [companyName, setCompanyName] = useState('');   // e.g., "Google"
const [roleId, setRoleId] = useState('');            // e.g., "senior-software-engineer"
const [roleName, setRoleName] = useState('');         // e.g., "Senior Software Engineer"
const [currentComp, setCurrentComp] = useState('');
const [yearsExp, setYearsExp] = useState('');
const [location, setLocation] = useState('');
const [email, setEmail] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [downloaded, setDownloaded] = useState(false);
```

**Layout:**
- Uses existing `Nav` component at top.
- Single centered card layout, matching the existing `/new-offer` and `/raise` page styling.
- Progress indicator: 5 dots or step labels across the top of the form card.
- Back button on steps 2-5.
- Accent color: `accent` (green, `#2d6a4f`) -- matches the "new offer" flow.

**Step transitions:**
- Step 1 -> 2: When a company is selected (exact match confirmed).
- Step 2 -> 3: When a role is clicked.
- Step 3 -> 4: On "Continue" click (all fields optional, so always enabled).
- Step 4 -> 5: On "Get My Free Report" click (transition is automatic -- step 4 contains both the preview and the email field).
- Step 5 (success): After successful PDF download.

**PDF Download handling:**
```javascript
const handleGenerateReport = async () => {
  setLoading(true);
  setError('');

  try {
    const res = await fetch('/api/generate-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId, roleId, email, currentComp, yearsExp, location }),
    });

    if (res.status === 429) {
      setError('You have reached the daily limit of 3 reports. Please try again tomorrow.');
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Something went wrong.');
      return;
    }

    // Download the PDF
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SalaryPrep-Report-${companyId}-${roleId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setStep(5);
  } catch (err) {
    setError('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### 7.2 RoleSelector (`/components/RoleSelector.js`)

**Type:** Client component

**Props:**
```javascript
{
  companyId: string,      // e.g., "google"
  selectedRole: string,   // e.g., "senior-software-engineer"
  onSelect: (roleId: string, roleName: string) => void,
}
```

**Behavior:**
- On mount (or when `companyId` changes), fetch `GET /api/companies/${companyId}/roles`.
- Render roles as a grid of selectable cards (2 columns on desktop, 1 on mobile).
- Standard roles shown first (sorted alphabetically), then specialty roles in a "Company-Specific Roles" subsection.
- Selected role highlighted with accent color border and checkmark.
- Loading state: skeleton cards while fetching.

**Styling:**
```
Each role card:
- Rounded-xl border
- Hover: bg-accent-light
- Selected: border-accent bg-accent-light with checkmark icon
- Text: role name in semibold, role type (standard/specialty) as a small muted badge
```

### 7.3 ReportPreview (`/components/ReportPreview.js`)

**Type:** Client component

**Props:**
```javascript
{
  companyName: string,
  roleName: string,
}
```

**Behavior:**
- Displays a stylized mockup of what the PDF report will contain.
- NOT a real preview with data -- this is shown BEFORE email capture, so we don't want to expose all the data for free.
- Shows section headings and blurred placeholder content.

**Layout:**
```
[Company Logo Placeholder] [Company Name] - [Role Name]

SALARY RANGES BY REGION
  [Blurred table with 3-4 rows barely visible]

COMPANY NEGOTIATION PROFILE
  [2-3 lines of blurred text]

LEVEL MAPPING ACROSS COMPANIES
  [1 line of blurred text]

EVIDENCE & SOURCES
  [2-3 lines of blurred text]

---
"Enter your email below to download the full report."
```

The blur effect uses CSS: `filter: blur(4px)` on placeholder text, or a gradient overlay that fades to white.

---

## 8. API Contracts

### 8.1 GET /api/companies (Existing)

No changes needed. Already returns:
```json
[
  { "id": "google", "name": "Google" },
  { "id": "jpmorgan-chase", "name": "JPMorgan Chase" },
  ...
]
```

### 8.2 GET /api/companies/[companyId]/roles (New)

**Request:** `GET /api/companies/google/roles`

**Response 200:**
```json
[
  { "id": "software-engineer", "name": "Software Engineer", "isStandard": true },
  { "id": "senior-software-engineer", "name": "Senior Software Engineer", "isStandard": true },
  { "id": "staff-software-engineer", "name": "Staff Software Engineer", "isStandard": true },
  { "id": "engineering-manager", "name": "Engineering Manager", "isStandard": true },
  { "id": "product-manager", "name": "Product Manager", "isStandard": true },
  { "id": "product-designer", "name": "Product Designer", "isStandard": true },
  { "id": "data-engineer", "name": "Data Engineer", "isStandard": true },
  { "id": "data-scientist", "name": "Data Scientist", "isStandard": true },
  { "id": "ml-ai-engineer", "name": "ML/AI Engineer", "isStandard": true },
  { "id": "devops-engineer", "name": "DevOps / SRE Engineer", "isStandard": true },
  { "id": "security-engineer", "name": "Security Engineer", "isStandard": true },
  { "id": "solutions-architect", "name": "Solutions Architect", "isStandard": true },
  { "id": "technical-program-manager", "name": "Technical Program Manager", "isStandard": true },
  { "id": "gemini-ai-platform-engineer", "name": "Gemini AI Platform Engineer", "isStandard": false }
]
```

**Response 404:**
```json
{ "error": "Company not found" }
```

### 8.3 POST /api/generate-report (New)

**Request:**
```json
{
  "companyId": "google",
  "roleId": "senior-software-engineer",
  "email": "user@example.com",
  "currentComp": "180000",
  "yearsExp": "6-10",
  "location": "Bay Area"
}
```

**Response 200:** Binary PDF (see Section 4.3)

**Response 400:**
```json
{ "error": "Missing required fields." }
```

**Response 404:**
```json
{ "error": "Data not available for this role.", "waitlisted": true }
```

**Response 429:**
```json
{ "error": "Rate limit reached. You can generate up to 3 reports per day." }
```

---

## 9. Rate Limiting & Lead Storage

### 9.1 Lead Store (`lib/lead-store.js`)

Since the app has no database, leads are stored in a JSON file on disk. This is a transitional solution; the file can be migrated to a database later.

**File location:** `data/leads.json` (gitignored)

**Schema:**
```json
[
  {
    "email": "user@example.com",
    "companyId": "google",
    "roleId": "senior-software-engineer",
    "currentComp": "180000",
    "yearsExp": "6-10",
    "location": "Bay Area",
    "status": "downloaded",
    "timestamp": "2026-02-23T14:30:00.000Z"
  }
]
```

**Implementation:**

```javascript
import fs from 'fs';
import path from 'path';

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');
const MAX_REPORTS_PER_EMAIL_PER_DAY = 3;

function ensureDataDir() {
  const dir = path.dirname(LEADS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readLeads() {
  ensureDataDir();
  if (!fs.existsSync(LEADS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeLeads(leads) {
  ensureDataDir();
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
}

export async function storeLead(lead) {
  const leads = readLeads();
  leads.push(lead);
  writeLeads(leads);
}

export async function checkRateLimit(email) {
  const leads = readLeads();
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const todayCount = leads.filter(
    (l) => l.email === email
      && l.status === 'downloaded'
      && new Date(l.timestamp) >= startOfDay
  ).length;

  return todayCount < MAX_REPORTS_PER_EMAIL_PER_DAY;
}
```

**Concurrency note:** On a single Vercel serverless instance, file writes are sequential within a request. Under high concurrency, there is a small race condition window. This is acceptable for a lead log (duplicate entries are harmless). For production scale, migrate to a database (Supabase, PlanetScale, or even Vercel KV).

### 9.2 Rate Limiting Details

| Parameter | Value |
|-----------|-------|
| Limit | 3 reports per email per day |
| Reset | Midnight UTC (or midnight in the server's timezone) |
| Enforcement | Checked before PDF generation, after input validation |
| Response on limit hit | HTTP 429 with user-friendly error message |

### 9.3 Gitignore Entry

Add to `.gitignore`:
```
data/
```

---

## 10. PDF Layout Specification

### 10.1 Module: `lib/report-pdf-generator.js`

Separate from the existing `lib/pdf-generator.js` (which handles the $39 playbook). The report PDF generator is simpler and has no AI content.

### 10.2 PDF Structure

```
Page 1: Cover Page
Page 2: Salary Ranges by Region (table)
Page 3: Company Negotiation Profile + Level Mapping
Page 4: Evidence & Sources + Data Completeness
Page 5: Upsell CTA (full page)
```

For roles with many regions (6+ rows), the salary table may spill onto page 3, pushing subsequent sections down. The generator should handle page breaks gracefully (same logic as existing `pdf-generator.js`).

### 10.3 Design Tokens

Reuse the existing color palette from `lib/pdf-generator.js`:

```javascript
const COLORS = {
  accent: '#2d6a4f',
  accentLight: '#d8f3dc',
  ink: '#1a1a1a',
  muted: '#6b7280',
  border: '#e5e2dd',
  paper: '#faf8f5',
  white: '#ffffff',
};
```

### 10.4 Cover Page Layout

```
[Full-page dark background (#1a1a1a)]
[Green accent bar, 6px, top]
[SalaryPrep logo text, top-left, white, 16pt]
[Main title: "Salary Report", 38pt, white, Helvetica-Bold, y=200]
[Subtitle: "[Role] at [Company]", 18pt, green (#2d6a4f), y=260]
[Date: "Generated February 23, 2026", 12pt, gray, y=290]
[Footer: "FREE REPORT", 10pt, muted, bottom-left]
["Contains only verified data from SalaryPrep's research database.", 9pt, gray, bottom]
```

### 10.5 Salary Table Rendering

```
[Section header: "Salary Ranges by Region", 20pt, accent green, Helvetica-Bold]
[12px spacing]
[Table header row: gray background (#f0eeeb), bold text]
[Alternating rows: white / paper (#faf8f5)]
[Cell text: 10pt Helvetica, left-aligned, #333]
[Column widths: Region=25%, Base=20%, Stock=20%, Bonus=15%, Total=20%]
[Border: 0.5pt #e5e2dd between rows]
```

### 10.6 Fonts

Use the same fonts as the existing playbook PDF (PDFKit built-in):
- Helvetica-Bold for headers
- Helvetica for body text
- Helvetica-Oblique for citations/sources

### 10.7 Function Signature

```javascript
export async function generateReportPDF({ companyId, companyName, roleId, roleName, data }) {
  // data = output of parseResearchMarkdown()
  // Returns: Promise<Buffer>
}
```

---

## 11. File Manifest

### New Files

| File | Purpose |
|------|---------|
| `app/report/page.js` | ReportPage: multi-step form, company/role selection, email capture, PDF download |
| `app/api/companies/[companyId]/roles/route.js` | API: returns available roles for a company |
| `app/api/generate-report/route.js` | API: validates inputs, parses markdown, generates PDF, stores lead |
| `components/RoleSelector.js` | Role selection grid component |
| `components/ReportPreview.js` | Blurred PDF preview before email gate |
| `lib/markdown-parser.js` | Extracts structured data from research markdown files |
| `lib/report-pdf-generator.js` | Generates the free salary report PDF |
| `lib/lead-store.js` | Lightweight JSON file lead storage + rate limiting |

### Modified Files

| File | Change |
|------|--------|
| `.gitignore` | Add `data/` directory |
| `components/Nav.js` | Add "Free Report" link to navigation (optional, depends on nav structure) |

### No Changes Required

| File | Reason |
|------|--------|
| `lib/pdf-generator.js` | Playbook PDF generator stays separate; report uses its own generator |
| `lib/research-matcher.js` | Report uses direct path lookups (companyId + roleId), not fuzzy matching |
| `lib/email.js` | Report is downloaded directly, not emailed (v1) |
| `lib/prompts.js` | No AI generation in reports |
| `app/api/companies/route.js` | Already returns the full company list; no changes needed |
| `package.json` | No new dependencies; PDFKit is already installed |

---

## 12. Open Questions & Future Work

### Open Questions (Decide Before Implementation)

1. **Email verification:** Should we send a verification email before allowing download, or is the download itself sufficient? (Recommendation: skip verification in v1 to minimize friction; validate format only.)

2. **Repeat downloads:** If the same email requests the same company+role again, do we regenerate the PDF or serve a cached version? (Recommendation: regenerate every time; PDFs are cheap to generate with no AI calls.)

3. **Analytics events:** What events should we fire? (Recommendation: `report_started`, `company_selected`, `role_selected`, `email_submitted`, `report_downloaded`, `upsell_clicked`.)

4. **Email follow-up sequence:** Should we send a follow-up email after download with the upsell CTA? (Recommendation: yes, but this is a separate feature using Resend's scheduled sends or a separate cron job.)

### Future Enhancements (Post-v1)

| Enhancement | Description |
|-------------|-------------|
| **Email delivery option** | In addition to download, offer to email the PDF (using existing `lib/email.js` pattern) |
| **Location highlighting** | If user provides location in step 3, highlight the matching row in the salary table |
| **Percentile positioning** | If user provides current comp, show where they fall in the range (requires careful handling to avoid "estimates") |
| **Waitlist notifications** | When new research files are added, notify users who were waitlisted for that company+role |
| **Database migration** | Replace `data/leads.json` with a proper database (Supabase, PlanetScale, Vercel KV) |
| **A/B testing** | Test different preview/blur strategies, CTA copy, and email capture placement |
| **Social sharing** | "Share your salary report" with an OG image showing the company+role (no salary data in the preview) |
| **SEO landing pages** | Generate `/report/google/senior-software-engineer` static pages for every company+role combo for organic search |
