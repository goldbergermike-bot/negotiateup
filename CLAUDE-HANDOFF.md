# CLAUDE-HANDOFF.md — SalaryPrep (NegotiateUp)

Read this file to get fully up to speed on the project.

## What This Is

SalaryPrep (originally NegotiateUp) is a paid, automated salary negotiation playbook generator. Users pay $39, fill out a form about their negotiation situation, and receive a personalized 10+ page PDF playbook via email within ~5-10 minutes. The entire pipeline is: Stripe payment -> form submission -> Claude AI generation -> PDFKit rendering -> Resend email delivery.

Production URL: `https://www.salaryprep.com`

## Tech Stack

- **Framework:** Next.js 14 (App Router, JavaScript — no TypeScript)
- **Styling:** Tailwind CSS 3.4 + custom design tokens
- **AI:** Anthropic Claude API (`@anthropic-ai/sdk`, model: `claude-sonnet-4-20250514`)
- **Payments:** Stripe (checkout sessions, webhooks)
- **PDF:** PDFKit (server-side generation)
- **Email:** Resend
- **File parsing:** `pdf-parse` for PDF text extraction
- **Hosting:** Vercel (needs Pro plan for 120s API route timeout)
- **Fonts:** DM Serif Display (headings), Outfit (body) — loaded via Google Fonts in `globals.css`

## Project Structure

```
negotiateup/
├── app/
│   ├── page.js                          # Landing page (composes all marketing components)
│   ├── layout.js                        # Root layout (metadata, JSON-LD schema, Google Analytics)
│   ├── globals.css                      # Tailwind setup + CSS variables + Google Fonts import
│   ├── opengraph-image.js               # Dynamic OG image generation
│   ├── api/
│   │   ├── create-checkout/route.js     # POST: Creates Stripe checkout session (offer or raise)
│   │   ├── generate-playbook/route.js   # POST: Main engine — parses form, calls Claude, generates PDF, emails it
│   │   └── webhook/route.js             # POST: Stripe webhook handler (checkout.session.completed)
│   ├── new-offer/page.js                # Client component: offer negotiation intake form
│   ├── raise/page.js                    # Client component: raise negotiation intake form
│   ├── blog/
│   │   ├── page.js                      # Blog index (7 SEO articles)
│   │   ├── how-to-negotiate-salary-new-job/page.js
│   │   ├── counter-offer-email-template/page.js
│   │   ├── how-to-ask-for-a-raise/page.js
│   │   ├── negotiate-salary-big-tech/page.js
│   │   ├── how-to-respond-lowball-offer/page.js
│   │   ├── salary-negotiation-women/page.js
│   │   └── get-raise-no-budget/page.js
│   ├── quiz/                            # "Am I Underpaid?" interactive quiz (free tool)
│   │   ├── layout.js
│   │   └── page.js
│   ├── calculator/                      # Counter-offer calculator (free tool)
│   │   ├── layout.js
│   │   └── page.js
│   └── sitemap.xml/route.js             # Dynamic XML sitemap
├── components/                          # Landing page sections (all client components)
│   ├── Nav.js                           # Sticky navigation
│   ├── PromoBanner.js                   # Top promo banner (discount code FIRST30)
│   ├── Hero.js                          # Hero section
│   ├── StatBar.js                       # Statistics bar
│   ├── PainPoints.js                    # Pain points section
│   ├── TwoPaths.js                      # Two paths (offer vs raise)
│   ├── HowItWorks.js                    # How it works steps
│   ├── WhatYouGet.js                    # What's in the playbook
│   ├── Testimonials.js                  # Customer testimonials
│   ├── Comparison.js                    # Comparison table
│   ├── WhyNotChatGPT.js                # ChatGPT differentiation section
│   ├── FreeTools.js                     # Links to quiz + calculator
│   ├── Guarantee.js                     # Money-back guarantee
│   ├── Pricing.js                       # Pricing cards (calls /api/create-checkout)
│   ├── FAQ.js                           # FAQ accordion
│   ├── EmailCapture.js                  # Email capture form
│   ├── FinalCTA.js                      # Bottom CTA
│   └── Footer.js                        # Footer
├── lib/
│   ├── prompts.js                       # AI prompt templates (getOfferPrompt, getRaisePrompt)
│   ├── pdf-generator.js                 # PDFKit-based PDF generation (cover page + formatted content)
│   └── email.js                         # Resend email with HTML template + PDF attachment
├── research/                            # 323 company directories, each with ~14 role-specific negotiation guides (.md)
│   ├── google/software-engineer.md      # Example: detailed comp data, negotiation scripts, lever strategies
│   ├── amazon/...
│   ├── meta/...
│   └── ... (323 companies total)
├── public/
│   └── robots.txt
├── .env.example                         # Environment variable template
├── .gitignore
├── package.json
├── next.config.js                       # pdfkit in serverComponentsExternalPackages
├── postcss.config.js
├── tailwind.config.js
└── README.md                            # Full setup guide for non-technical users
```

## Core User Flow

1. User lands on `page.js` (landing page with marketing sections)
2. Clicks "Get Playbook" in Pricing component -> POST to `/api/create-checkout` with `type: "offer"` or `"raise"`
3. Redirected to Stripe Checkout
4. After payment -> redirected to `/new-offer?session_id=...` or `/raise?session_id=...`
5. Fills out detailed intake form + optional file uploads (resume, offer letter, job listing)
6. Form submits POST to `/api/generate-playbook` with multipart FormData
7. Server verifies Stripe session is paid, extracts text from uploaded files, builds prompt, calls Claude API
8. Claude output is parsed into sections and rendered as a branded PDF via PDFKit
9. PDF is emailed to user via Resend

## Key Architecture Details

### Two Product Types
- **Offer negotiation** (`type: "offer"`): For negotiating a new job offer. Color: green (`#2d6a4f`). Route: `/new-offer`.
- **Raise negotiation** (`type: "raise"`): For asking for a raise at current company. Color: blue (`#1d4e89`). Route: `/raise`.

Both cost $39 and follow the same pipeline but use different prompt templates and form fields.

### API Route: `/api/generate-playbook/route.js`
This is the core engine. Key details:
- `maxDuration = 120` (requires Vercel Pro)
- Verifies Stripe payment via `session.payment_status === 'paid'`
- Extracts text from uploaded PDFs using `pdf-parse`, plain text from .txt/.md, fallback for .doc/.docx
- Images cannot be OCR'd (returns placeholder message)
- Calls `claude-sonnet-4-20250514` with `max_tokens: 8000`
- Prompt templates are in `lib/prompts.js` — these are the "secret sauce"

### PDF Generation (`lib/pdf-generator.js`)
- PDFKit-based, A4 format with branded cover page
- Parses AI output by splitting on `###` headers (falls back to `##`, then single section)
- Handles bold text (`**text**`), bullets, numbered lists, quoted text
- Adds footer with page numbers on every page

### Email (`lib/email.js`)
- HTML email template with branded design
- PDF attached as base64-encoded attachment
- Sent via Resend API

### AI Prompts (`lib/prompts.js`)
- `getOfferPrompt(data)`: 8-section prompt (executive summary, market analysis, leverage points, counter-offer numbers, negotiation scripts, company intelligence, timeline, beyond base salary)
- `getRaisePrompt(data)`: 8-section prompt (executive summary, market report, business case document, salary target, conversation scripts, objection handling, timing strategy, plan B)

### Research Directory
The `research/` folder contains ~4,500 markdown files across 323 companies. Each file is a detailed negotiation guide for a specific role at a specific company (e.g., `google/software-engineer.md`). These include compensation tables by region, negotiation DNA analysis, specific lever strategies with scripts, and evidence sources. These are static content files — not currently used by the app at runtime, but serve as reference material.

### Design System (Tailwind Config)
Custom colors defined in `tailwind.config.js`:
- `ink: #1a1a1a` (text), `paper: #faf8f5` (background), `accent: #2d6a4f` (green/offer), `blue: #1d4e89` (raise)
- `accent-light`, `accent-glow`, `warm`, `warm-light`, `blue-light`, `muted`, `border`

### SEO
- JSON-LD structured data (Product + FAQPage) in `layout.js`
- Dynamic XML sitemap at `/sitemap.xml`
- `robots.txt` in public directory
- Blog articles with individual metadata and canonical URLs
- Meta keywords, OpenGraph, and Twitter cards configured

## Environment Variables

```
STRIPE_SECRET_KEY=sk_test_...           # Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_...      # Stripe publishable key
STRIPE_WEBHOOK_SECRET=whsec_...         # Stripe webhook signing secret
STRIPE_PRICE_OFFER=price_...            # Stripe Price ID for offer playbook ($39)
STRIPE_PRICE_RAISE=price_...            # Stripe Price ID for raise playbook ($39)
ANTHROPIC_API_KEY=sk-ant-...            # Anthropic API key
RESEND_API_KEY=re_...                   # Resend API key
FROM_EMAIL=playbook@yourdomain.com      # Sender email address
NEXT_PUBLIC_URL=https://www.salaryprep.com  # Base URL (used for Stripe redirects)
NEXT_PUBLIC_GA_ID=                      # Optional Google Analytics ID
```

## Commands

```bash
npm run dev    # Start development server (localhost:3000)
npm run build  # Production build
npm run start  # Start production server
```

No test suite, no linter, no TypeScript — this is a straightforward JS project.

## Branding Notes

The project was originally called "NegotiateUp" (repo name, folder name) but was rebranded to "SalaryPrep" (all user-facing copy, metadata, emails, PDFs). The package name in `package.json` is `salaryprep`. Code comments reference "SalaryPrep". The domain is `salaryprep.com`.

## Current Promo

Active discount code: `FIRST30` for 30% off ($27.30). Referenced in the PromoBanner component and post-purchase share screens on both `/new-offer` and `/raise` pages.

## Known Constraints

- **Vercel timeout:** Free plan has 10s timeout; this app needs Vercel Pro (120s) for AI generation
- **Image uploads:** Cannot extract text from images (no OCR). Users see a placeholder message advising them to paste details into text fields instead
- **DOCX parsing:** Basic fallback only — strips non-ASCII characters. Production improvement would use `mammoth.js`
- **No database:** No persistence layer. Payment verification is done by checking Stripe session status in real-time. No user accounts, no order history
- **No background jobs:** Generation is synchronous in the API route. If it times out, it fails silently from the user's perspective
