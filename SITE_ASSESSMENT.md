# SalaryPrep — Full Site Assessment

> **Date:** February 23, 2026
> **Project:** SalaryPrep (salaryprep.com)
> **Repository:** negotiateup
> **Assessed by:** Automated audit of full codebase

---

## Table of Contents

1. [Architecture & Tech Stack](#1-architecture--tech-stack)
2. [Project Structure](#2-project-structure)
3. [What's Working Well](#3-whats-working-well)
4. [Page-by-Page Audit](#4-page-by-page-audit)
5. [API Routes](#5-api-routes)
6. [Component Inventory](#6-component-inventory)
7. [Library Files (Backend Logic)](#7-library-files-backend-logic)
8. [Research Database Inventory](#8-research-database-inventory)
9. [SEO & Metadata](#9-seo--metadata)
10. [Conversion Funnel Analysis](#10-conversion-funnel-analysis)
11. [What Needs Improvement](#11-what-needs-improvement)
12. [Content Inventory](#12-content-inventory)
13. [Business Model Summary](#13-business-model-summary)

---

## 1. Architecture & Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Framework** | Next.js 14 (App Router) | JavaScript only, no TypeScript |
| **Styling** | Tailwind CSS 3.4 | Custom design tokens via CSS variables |
| **AI Engine** | Anthropic Claude API | Model: `claude-sonnet-4-20250514`, 8000 max tokens |
| **Payments** | Stripe | Checkout sessions + webhooks |
| **PDF Generation** | PDFKit 0.15 | Server-side, A4 format, branded |
| **Email** | Resend API | HTML template + PDF attachment |
| **File Parsing** | pdf-parse | PDF text extraction for uploaded resumes |
| **Fonts** | DM Serif Display + Outfit | Google Fonts import |
| **Hosting** | Vercel | Requires Pro plan for 120s API timeout |
| **Database** | None | Stateless; Stripe sessions used for payment verification |

### Dependencies (package.json)

```
next: ^14.2.0          react: ^18.2.0
@anthropic-ai/sdk: ^0.30.0    stripe: ^17.0.0
resend: ^4.0.0         pdfkit: ^0.15.0
formidable: ^3.5.0     pdf-parse: ^1.1.1
```

### Design System

| Token | Value | Usage |
|-------|-------|-------|
| `ink` | #1a1a1a | Primary text |
| `paper` | #faf8f5 | Page background |
| `accent` | #2d6a4f | Offer playbook (green) |
| `accent-light` | #d8f3dc | Light green |
| `blue` | #1d4e89 | Raise playbook (blue) |
| `blue-light` | #d6e5f5 | Light blue |
| `warm` | #f4845f | Secondary accent (orange) |
| `muted` | #6b7280 | Secondary text |
| `border` | #e5e2dd | Divider lines |

---

## 2. Project Structure

```
negotiateup/
  app/
    page.js                    # Landing page (client component)
    layout.js                  # Root layout with SEO, GA, schema markup
    globals.css                # Tailwind + custom CSS variables + fonts
    opengraph-image.js         # Dynamic OG image (edge runtime)
    sitemap.xml/route.js       # Dynamic sitemap (12 URLs)
    blog/
      page.js                  # Blog index (7 articles)
      how-to-negotiate-salary-new-job/page.js
      how-to-ask-for-a-raise/page.js
      counter-offer-email-template/page.js
      negotiate-salary-big-tech/page.js
      how-to-respond-lowball-offer/page.js
      salary-negotiation-women/page.js
      get-raise-no-budget/page.js
    calculator/
      page.js                  # Free counter-offer calculator
      layout.js                # Calculator-specific metadata
    quiz/
      page.js                  # Free "Am I Underpaid?" quiz
      layout.js                # Quiz-specific metadata
    new-offer/page.js          # Post-payment offer form
    raise/page.js              # Post-payment raise form
    api/
      create-checkout/route.js # Stripe checkout session creation
      generate-playbook/route.js # Main AI + PDF + email pipeline
      webhook/route.js         # Stripe webhook handler
      companies/route.js       # Company list endpoint for autocomplete
  components/                  # 19 landing page + shared components
  lib/
    prompts.js                 # AI prompt templates (offer + raise)
    pdf-generator.js           # PDFKit rendering engine
    email.js                   # Resend email with HTML template
    research-matcher.js        # Company/role lookup against research DB
  research/                    # 319 company directories, 4,470 markdown files
  public/
    robots.txt
```

---

## 3. What's Working Well

### Strong Product-Market Fit
- Clear value proposition: $39 for a personalized negotiation playbook
- Two distinct products (offer vs. raise) with tailored flows
- Full automated pipeline: payment -> form -> AI -> PDF -> email in under 10 minutes

### Solid Marketing Funnel
- Landing page is well-structured with 19 purpose-built sections
- Two free tools (quiz + calculator) drive organic traffic and convert to paid
- 7 substantial blog articles (1,500-2,500+ words each) targeting high-intent keywords
- Smart differentiation section ("Why Not ChatGPT?") addresses the #1 objection

### Massive Research Database
- 319 companies with verified compensation data
- 4,470 research files covering 13 standard roles + 320 specialty roles
- Each file includes regional salary tables, negotiation scripts, level mappings, and sources
- Research matcher (research-matcher.js) has 100+ company aliases for robust matching

### Good Unit Economics
- Revenue per sale: $39 (or $27.30 with FIRST30 discount)
- Cost per sale: ~$1.65-$1.75 (Stripe fees + Claude API + Resend)
- Profit margin: ~95% per unit

### Clean Codebase
- Consistent component architecture
- Semantic color system with clear offer (green) vs raise (blue) differentiation
- Anti-hallucination guardrails built into AI prompts
- Research data is used to ground AI output in real numbers

---

## 4. Page-by-Page Audit

### Landing Page (`/`)
- **Type:** Client component
- **Status:** Fully functional
- **Sections:** PromoBanner > Nav > Hero > StatBar > TwoPaths > PainPoints > HowItWorks > WhatYouGet > Testimonials > Comparison > WhyNotChatGPT > FreeTools > Pricing > Guarantee > FAQ > EmailCapture > FinalCTA > Footer
- **SEO:** Root layout provides title, description, keywords, OG, Twitter, JSON-LD (Product + FAQ schemas)
- **Issues:** EmailCapture is non-functional (client-side only, no backend)

### Blog Index (`/blog`)
- **Type:** Server component
- **Status:** Fully functional
- **Content:** Lists 7 articles with metadata (date, read time, category)
- **SEO:** Title + description set
- **Issues:** No pagination, no category filtering

### Blog Articles (7 total)

| Article | Words | Read Time | SEO | CTAs |
|---------|-------|-----------|-----|------|
| How to Negotiate Salary on New Job (2026) | ~2,500 | 12 min | Title, desc, keywords | 2 inline |
| How to Ask for a Raise: Complete Playbook | ~2,500 | 14 min | Title, desc, keywords | 2 inline |
| Counter Offer Email Template | ~1,800 | 8 min | Title, desc | 2 inline |
| Negotiate Salary at Big Tech (2026) | ~2,500 | 14 min | Title, desc, keywords | 2 inline + tool CTA |
| How to Respond to a Lowball Offer | ~2,000 | 10 min | Title, desc | 2 inline |
| Salary Negotiation for Women | ~2,200 | 11 min | Title, desc | 2 inline |
| Get a Raise When No Budget | ~1,800 | 9 min | Title, desc | 2 inline |

**Assessment:** Real, substantial content. Not thin pages. Each targets distinct search intent. Articles cite real research (Hannah Riley Bowles, Carnegie Mellon studies) and link to external resources (Glassdoor, Levels.fyi). Strong internal linking to quiz/calculator/pricing.

### Calculator (`/calculator`)
- **Type:** Client component
- **Status:** Functional with issues
- **Flow:** 6-field form -> algorithm -> results with 3 tiers + lifetime impact + upsell
- **SEO:** Layout provides calculator-specific metadata
- **Issues:**
  - No validation for salary input (parseInt can return NaN)
  - Algorithm is heuristic-based (15% base + adjustments), not tied to research data
  - "Calculate a Different Offer" resets entire form

### Quiz (`/quiz`)
- **Type:** Client component
- **Status:** Functional with issues
- **Flow:** 6-question stepped form -> percentile result + market range + share CTA
- **SEO:** Layout provides quiz-specific metadata
- **Issues:**
  - Email capture is CLIENT-SIDE ONLY — emails are never saved anywhere
  - Location matching uses string.includes() — typos fail silently
  - Salary input accepts negative numbers
  - Market estimates are heuristic-based, not tied to research database

### New Offer Form (`/new-offer`)
- **Type:** Client component with Suspense
- **Status:** Functional (post-payment only)
- **Access:** Requires `session_id` query param from Stripe checkout
- **Sections:** About You, The Offer (with CompanyAutocomplete), Your Situation, Document Uploads
- **Issues:**
  - No client-side session validation before rendering form
  - Image uploads return placeholder text (not extracted)
  - .doc/.docx extraction is regex-based and lossy

### Raise Form (`/raise`)
- **Type:** Client component with Suspense
- **Status:** Functional (post-payment only)
- **Sections:** About You, Current Role (with CompanyAutocomplete), Compensation & Timeline, Build Your Case, Resume Upload
- **Issues:** Same as new-offer form

---

## 5. API Routes

### POST `/api/create-checkout`
- Creates Stripe checkout session with type-specific price ID
- Redirects to `/new-offer` or `/raise` with session_id on success
- **Issues:** No validation of `type` parameter; no null check on price IDs

### POST `/api/generate-playbook` (Critical Path)
- **maxDuration:** 120 seconds (requires Vercel Pro)
- **Pipeline:**
  1. Extract FormData (sessionId, type, formData JSON, file uploads)
  2. Verify Stripe session payment_status = 'paid'
  3. Extract text from uploaded PDFs (pdf-parse), docs (regex fallback), images (placeholder)
  4. Match company/role to research database via `lookupResearch()`
  5. Build prompt with research data via `getOfferPrompt()` / `getRaisePrompt()`
  6. Call Claude API (claude-sonnet-4-20250514, 8000 tokens)
  7. Generate branded PDF via `generatePlaybookPDF()`
  8. Send email with PDF attachment via `sendPlaybookEmail()`
- **Issues:**
  - No timeout handling for Claude API calls
  - No retry logic if email delivery fails
  - Generic 500 error response (not user-friendly)

### POST `/api/webhook`
- Handles Stripe events: `checkout.session.completed`, `payment_intent.payment_failed`
- Signature verification with STRIPE_WEBHOOK_SECRET
- **Issues:** Only logs events — doesn't persist orders or trigger any actions

### GET `/api/companies`
- Returns list of company directories from /research/ with formatted display names
- Results cached in memory (single static cache)
- **Issues:** Cache never invalidates without server restart; hardcoded display name overrides

---

## 6. Component Inventory

| Component | Type | Purpose | Issues |
|-----------|------|---------|--------|
| PromoBanner | Client | Dismissible FIRST30 discount banner | Hardcoded discount code |
| Nav | Client | Sticky nav with scroll blur effect | No mobile hamburger menu |
| Hero | Server | Main headline + trust badges | Hardcoded stats |
| StatBar | Server | 3-metric dark bar (300+, $5K-$15K, 10 min) | Hardcoded values |
| TwoPaths | Server | Offer vs Raise comparison cards | None |
| PainPoints | Server | 6-card grid of user pain points | No emoji aria-labels |
| HowItWorks | Server | 3-step visual flow | None |
| WhatYouGet | Client | Tabbed feature list (offer/raise tabs) | None |
| Testimonials | Server | "What's Inside" sample playbook cards | Misleading component name |
| Comparison | Server | SalaryPrep vs ChatGPT vs Coach table | None |
| WhyNotChatGPT | Server | 4 differentiation cards | None |
| FreeTools | Server | Links to quiz + calculator | None |
| Pricing | Client | Two pricing cards + Stripe checkout trigger | No loading state; uses alert() for errors |
| Guarantee | Server | Money-back guarantee section | None |
| FAQ | Client | 9-question accordion | Single-select only |
| EmailCapture | Client | Email signup form | **NON-FUNCTIONAL — no backend** |
| FinalCTA | Server | Bottom CTA with dark background | None |
| Footer | Server | Copyright + Privacy/Terms links | **Links to non-existent pages** |
| CompanyAutocomplete | Client | Company name autocomplete with "Verified" badge | No error handling if API fails |

---

## 7. Library Files (Backend Logic)

### `lib/prompts.js` — AI Prompt Generation
- `buildResearchBlock(research)` — Adds verified data guardrails when research available
- `getOfferPrompt(data, research)` — 8-section offer negotiation prompt
- `getRaisePrompt(data, research)` — 8-section raise negotiation prompt
- **Sections:** Executive Summary, Market Analysis, Leverage Points, Counter-Offer Numbers, Scripts (4 variants), Company Intelligence, Timeline, Beyond Base Salary
- **Issues:** Very long prompts; no versioning or A/B testing

### `lib/pdf-generator.js` — PDF Rendering
- `generatePlaybookPDF(content, type, clientName)` — PDFKit-based A4 PDF
- Cover page with branded design + content pages with formatted sections
- Parses AI output by `###` markdown headers
- **Issues:** Fragile markdown parsing; no table support; no custom fonts; no Unicode handling

### `lib/email.js` — Email Delivery
- `sendPlaybookEmail(email, name, pdfBuffer, type)` — Sends via Resend
- Branded HTML template with Quick Start Guide + PDF attachment
- **Issues:** No unsubscribe link (CAN-SPAM concern); no open/click tracking; hardcoded from address fallback

### `lib/research-matcher.js` — Company/Role Database Lookup
- `matchCompany(userCompany)` — Slug + alias matching (100+ aliases)
- `matchRole(userTitle)` — Pattern matching to 13 standard roles
- `lookupResearch(companyName, jobTitle)` — Main entry point
- **Issues:** Company directory cache never invalidates; no fuzzy matching for typos; limited to 13 standard role patterns

---

## 8. Research Database Inventory

### Scale
| Metric | Count |
|--------|-------|
| Company directories | 319 |
| Total research files | 4,470 |
| Standard roles per company | 13 |
| Unique specialty roles | 320 (1 per company) |
| Total unique role filenames | 333 |

### Standard Roles (13, present for all 319 companies)
1. software-engineer
2. senior-software-engineer
3. staff-software-engineer
4. engineering-manager
5. product-manager
6. product-designer
7. data-scientist
8. data-engineer
9. ml-ai-engineer
10. devops-engineer
11. security-engineer
12. solutions-architect
13. technical-program-manager

### Specialty Roles (examples)
- `starship-flight-software-engineer` (SpaceX)
- `copilot-ai-platform-engineer` (Microsoft)
- `warzone-platform-engineer` (Activision Blizzard)
- `tiktok-recommendation-engineer` (TikTok)
- `gemini-ai-platform-engineer` (Google)
- `autopilot-firmware-engineer` (Tesla)

### Data Format Per Research File
Each markdown file contains:
1. **Title & Level** — e.g., "Software Engineer (L3-L4) | Google Global Negotiation Guide"
2. **Negotiation DNA** — One-line summary of comp philosophy and key levers
3. **Regional Salary Table** — Markdown table with 6 regions:
   - Bay Area / HQ
   - New York City
   - Seattle
   - London (GBP)
   - Zurich (CHF)
   - Bangalore (INR)
   - Columns: Base Salary, Stock (RSU/4yr), Bonus, Total Comp
4. **Detailed Negotiation Strategy** — 800-2,000 words of prose covering:
   - Company-specific context
   - Level mapping to peer companies
   - Career credential value
5. **Global Levers** — 4 numbered negotiation scripts/tactics
6. **Negotiate Up Strategy** — Blockquoted sample negotiation script
7. **Evidence & Sources** — Cited sources (Levels.fyi, Glassdoor, Blind, H1B data, 2024-2026)

### Data Gaps
- No `last_updated` timestamp per file
- No `data_source` or `confidence_level` field
- No structured metadata (all unstructured markdown)
- Salary data is text (not machine-parseable numbers)
- No coverage for non-tech roles (marketing, finance, HR, legal, sales)
- No coverage for non-engineering industries (healthcare, manufacturing, etc.)

---

## 9. SEO & Metadata

### What's Configured
- **Root layout:** Title, description, 10+ keywords, Open Graph, Twitter Card, canonical URL
- **Schema markup:** Product schema ($39, InStock) + FAQPage schema (5 Q&As) as JSON-LD
- **OG image:** Dynamic 1200x630 PNG via edge runtime (ImageResponse)
- **Sitemap:** Dynamic route generating 12 URLs with priority weights
- **robots.txt:** Present in /public/
- **Google Analytics:** GTM integration with afterInteractive loading
- **Per-page metadata:** Calculator and quiz have layout.js with specific titles/descriptions
- **Blog articles:** Each has individual title, description, and keyword metadata

### SEO Strengths
- Comprehensive schema markup (Product + FAQ)
- Proper heading hierarchy throughout
- Strong keyword-targeted blog content
- Internal linking (blog -> tools -> pricing)
- Canonical URLs set

### SEO Gaps
- **No per-page OG images** — All pages share the same default image on social
- **No per-page FAQ schema** — Only on root layout
- **No breadcrumb schema** on blog articles
- **No author/publication structured data** on blog
- **/new-offer and /raise in sitemap** — These are behind a paywall and shouldn't be indexed
- **No blog category pages** — All 7 articles on one index page
- **No location-specific optimization** — Missing geo-targeted content

---

## 10. Conversion Funnel Analysis

### User Journeys

```
Path A (Direct): Landing Page -> Pricing -> Stripe Checkout -> Form -> Playbook
Path B (Educational): Blog Article -> Inline CTA -> Pricing -> Checkout -> Form -> Playbook
Path C (Interactive): Quiz/Calculator -> Results -> Upsell CTA -> Pricing -> Checkout -> Form -> Playbook
```

### Funnel Strengths
- Multiple entry points (SEO blog, free tools, direct)
- Free tools provide immediate value before asking for money
- Clear price anchoring ($39 vs $1,250-$6,000 coaching)
- Money-back guarantee reduces purchase anxiety
- Post-purchase share discount encourages word-of-mouth

### Funnel Leakage Points
1. **Email capture is broken** — Quiz email collection goes nowhere; zero list building happening
2. **No retargeting** — No pixel/event tracking beyond basic GA pageviews
3. **Calculator doesn't use real data** — Heuristic-based estimates undermine trust if users compare to actual market data
4. **Quiz estimates are generic** — Not tied to our 319-company database; missed opportunity to show "we have data on YOUR company"
5. **No abandoned cart recovery** — If someone leaves checkout, there's no follow-up
6. **Single pricing page** — No comparison of free vs. paid to demonstrate upgrade value
7. **Blog CTAs are static** — Same CTA copy regardless of article context

---

## 11. What Needs Improvement

### Critical (Fix Immediately)

| Issue | Location | Impact |
|-------|----------|--------|
| **Email capture is non-functional** | `components/EmailCapture.js`, quiz page | Zero email list building; lost leads |
| **Missing /privacy and /terms pages** | `components/Footer.js` links | Legal compliance risk; 404 errors |
| **No mobile navigation** | `components/Nav.js` | Nav links invisible on mobile without hamburger menu |
| **No input validation on free tools** | calculator, quiz | NaN/negative salary breaks calculations |

### High Priority (This Month)

| Issue | Location | Impact |
|-------|----------|--------|
| No loading states on forms | new-offer, raise pages | Poor UX during 30-120s generation |
| No per-page OG images | All blog articles | Weak social sharing presence |
| Webhook doesn't persist orders | `api/webhook/route.js` | No order history or analytics |
| No GA4 custom events | All conversion points | Can't measure funnel performance |
| /new-offer and /raise in sitemap | `sitemap.xml/route.js` | Indexing paywalled pages |
| Generic error handling | Pricing, forms | alert() instead of user-friendly messages |

### Medium Priority (This Quarter)

| Issue | Location | Impact |
|-------|----------|--------|
| Research data is unstructured markdown | /research/ directory | Can't programmatically query salary ranges |
| No last_updated field on research data | /research/ files | Can't track data freshness |
| PDF markdown parsing is fragile | `lib/pdf-generator.js` | Can break if AI output format varies |
| .doc/.docx extraction is lossy | `api/generate-playbook/route.js` | Resume data lost for non-PDF uploads |
| Image uploads not extracted | `api/generate-playbook/route.js` | Offer letters as screenshots are ignored |
| Company cache never invalidates | `lib/research-matcher.js` | New companies need server restart |
| No testing suite | Project-wide | No safety net for changes |
| No accessibility (a11y) | Components | Missing aria-labels, focus management, color-blind support |
| Hardcoded discount code | PromoBanner, Pricing, FAQ | Can't change promotions without code changes |
| No email unsubscribe link | `lib/email.js` | CAN-SPAM compliance concern |

### Low Priority (Nice to Have)

| Issue | Location | Impact |
|-------|----------|--------|
| No TypeScript | Project-wide | Refactoring risk |
| No dark mode | globals.css | Missing user preference |
| No blog pagination/categories | /blog | Scaling concern as content grows |
| No author bios on blog | Blog articles | Missing expertise signals for E-E-A-T |
| No reading progress bar | Blog articles | Minor UX improvement |
| Testimonials component misnamed | components/Testimonials.js | Developer confusion (shows "What's Inside", not testimonials) |
| No database | Project-wide | No user accounts, order history, or admin |

---

## 12. Content Inventory

### Pages

| Page | URL | Meta Tags | OG Image | Schema | Status |
|------|-----|-----------|----------|--------|--------|
| Landing | / | Title, desc, keywords | Default | Product + FAQ | Live |
| Blog Index | /blog | Title, desc | Default | None | Live |
| Blog: Negotiate New Job | /blog/how-to-negotiate-salary-new-job | Title, desc, keywords | Default | None | Live |
| Blog: Ask for Raise | /blog/how-to-ask-for-a-raise | Title, desc, keywords | Default | None | Live |
| Blog: Counter Offer Email | /blog/counter-offer-email-template | Title, desc | Default | None | Live |
| Blog: Big Tech | /blog/negotiate-salary-big-tech | Title, desc, keywords | Default | None | Live |
| Blog: Lowball Offer | /blog/how-to-respond-lowball-offer | Title, desc | Default | None | Live |
| Blog: Women | /blog/salary-negotiation-women | Title, desc | Default | None | Live |
| Blog: No Budget | /blog/get-raise-no-budget | Title, desc | Default | None | Live |
| Calculator | /calculator | Title, desc | Default | None | Live |
| Quiz | /quiz | Title, desc | Default | None | Live |
| New Offer Form | /new-offer | None | Default | None | Behind paywall |
| Raise Form | /raise | None | Default | None | Behind paywall |
| Privacy Policy | /privacy | — | — | — | **MISSING (404)** |
| Terms of Service | /terms | — | — | — | **MISSING (404)** |

### Interactive Tools

| Tool | URL | Status | Data Source |
|------|-----|--------|-------------|
| Counter-Offer Calculator | /calculator | Working | Heuristic algorithm (not research DB) |
| "Am I Underpaid?" Quiz | /quiz | Working* | Heuristic algorithm (not research DB) |
| Company Autocomplete | Forms | Working | /api/companies (reads /research/ dirs) |

*Quiz email capture is non-functional

### Research Database

| Metric | Value |
|--------|-------|
| Companies | 319 |
| Total files | 4,470 |
| Standard roles | 13 per company |
| Specialty roles | 320 total (1 per company) |
| Unique role types | 333 |
| Format | Unstructured markdown |
| Fields per file | Title, salary table (6 regions), negotiation DNA, strategy prose, level mappings, scripts, sources |
| Sources cited | Levels.fyi, Glassdoor, Blind, H1B data (2024-2026) |
| Freshness tracking | None (no last_updated field) |

---

## 13. Business Model Summary

| Metric | Value |
|--------|-------|
| **Product** | Personalized salary negotiation playbook (PDF) |
| **Price** | $39 per playbook |
| **Promo** | FIRST30 code = 30% off ($27.30) |
| **Types** | Offer negotiation, Raise negotiation |
| **Delivery** | Email with PDF attachment, <10 minutes |
| **Guarantee** | 100% money-back, 7 days |
| **Cost per unit** | ~$1.65-$1.75 (Stripe 2.9%+$0.30, Claude ~$0.10, Resend free tier) |
| **Gross margin** | ~95% |
| **Fixed costs** | Vercel Pro $20/mo (required for 120s timeout) |
| **Free tools** | Quiz, Calculator (lead generation) |
| **Content marketing** | 7 blog articles targeting high-intent keywords |
| **Research database** | 319 companies, 4,470 files |

### Revenue Opportunities Not Yet Captured
1. **Email list** — Quiz/calculator/blog visitors not being captured (EmailCapture broken)
2. **Free report lead magnet** — Research database could power a free salary report to capture emails
3. **Company-specific landing pages** — 319 companies = 319 potential SEO landing pages
4. **Repeat purchases** — No customer portal; users can't access past playbooks
5. **Referral program** — Current share-a-code is passive; could be formalized

---

## Conclusion

SalaryPrep is a **well-built MVP with strong unit economics and a clear product-market fit**. The core pipeline (Stripe -> Form -> Claude AI -> PDFKit -> Resend) works end-to-end. The research database (319 companies, 4,470 files) is a genuine competitive moat.

**Biggest wins:** Quality blog content, massive research database, clean conversion funnel, 95% margins.

**Biggest gaps:** Broken email capture (zero list building), missing legal pages, no data persistence (no DB), research data not programmatically queryable, free tools disconnected from research database.

The next highest-impact work is: (1) fix email capture, (2) build a free report feature powered by the research DB, (3) add structured metadata to research files, and (4) create a lightweight database for orders and leads. See `ROADMAP.md` for the full prioritized plan.
