# NegotiateUp / SalaryPrep — Claude Code Handoff Brief

> This file brings a new Claude Code session up to speed on this project.
> Last updated: 2026-02-23

---

## What This Is

**SalaryPrep** (repo name: negotiateup) is a live, production SaaS product that generates **personalized salary negotiation playbooks** using AI. Users pay $39 (or $27.30 with code FIRST30), fill out a detailed form about their situation, and receive a 10+ page branded PDF via email within 10 minutes.

**Two products:**
1. **Offer Negotiation Playbook** — for people with a new job offer who want to negotiate higher
2. **Raise Negotiation Playbook** — for people who want to ask their current employer for a raise

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14.2.0 (App Router) |
| UI | React 18.2 + Tailwind CSS 3.4 |
| AI | Anthropic Claude API (claude-sonnet, via @anthropic-ai/sdk 0.30.0) |
| Payments | Stripe (checkout sessions + webhooks) |
| PDF | PDFKit 0.15.0 |
| Email | Resend 4.0.0 |
| Hosting | Vercel (Pro plan recommended for 120s API timeout) |

---

## File Structure

```
app/
├── page.js                          # Landing page (all marketing sections)
├── layout.js                        # Root layout, metadata, GA, fonts
├── globals.css                      # Global styles + font imports
├── new-offer/page.js                # Offer negotiation form (post-payment)
├── raise/page.js                    # Raise negotiation form (post-payment)
├── calculator/page.js + layout.js   # Free counter-offer calculator
├── quiz/page.js + layout.js         # Free "Am I Underpaid?" quiz
├── blog/page.js                     # Blog index
├── blog/[7 article slugs]/page.js   # SEO blog posts
├── api/create-checkout/route.js     # Creates Stripe checkout session
├── api/generate-playbook/route.js   # THE CORE: AI generation + PDF + email
├── api/webhook/route.js             # Stripe webhook handler
└── sitemap.xml/route.js             # Dynamic sitemap

components/
├── Nav.js, Hero.js, PromoBanner.js, StatBar.js, TwoPaths.js,
├── PainPoints.js, HowItWorks.js, WhatYouGet.js, Testimonials.js,
├── Comparison.js, WhyNotChatGPT.js, FreeTools.js, Pricing.js,
├── Guarantee.js, FAQ.js, EmailCapture.js, FinalCTA.js, Footer.js

lib/
├── prompts.js          # AI prompt templates (getOfferPrompt / getRaisePrompt)
├── pdf-generator.js    # PDFKit PDF creation with branded cover page
├── email.js            # Resend email with PDF attachment
```

---

## Core Flow

```
User visits landing page → clicks "Get Playbook"
  → Stripe checkout ($39 or $27.30 with FIRST30)
  → Redirected to /new-offer or /raise with ?session_id
  → Fills detailed form (name, salary, company, concerns, file uploads)
  → POST /api/generate-playbook
     → Verifies Stripe payment
     → Extracts text from uploaded PDFs
     → Calls Claude API with detailed prompt
     → Generates branded PDF (green for offers, blue for raises)
     → Emails PDF via Resend
  → User sees confirmation, receives email with PDF
```

---

## Environment Variables

```
STRIPE_SECRET_KEY          # Stripe secret key
STRIPE_PUBLISHABLE_KEY     # Stripe publishable key
STRIPE_WEBHOOK_SECRET      # Webhook signature verification
STRIPE_PRICE_OFFER         # Price ID for offer playbook ($39)
STRIPE_PRICE_RAISE         # Price ID for raise playbook ($39)
ANTHROPIC_API_KEY          # Claude API key
RESEND_API_KEY             # Email delivery
FROM_EMAIL                 # Sender address (e.g. playbook@salaryprep.com)
NEXT_PUBLIC_URL            # Base URL for the app
NEXT_PUBLIC_GA_ID          # Google Analytics (optional)
```

---

## AI Prompts (lib/prompts.js)

Each playbook generates 8 sections via Claude:

**Offer playbook:**
1. Executive Summary
2. Market Salary Analysis (25th/50th/75th/90th percentiles)
3. Your Leverage Points
4. Recommended Counter-Offer Numbers (specific dollar amounts)
5. Negotiation Scripts (initial response, phone call, email, pushback)
6. Company Intelligence
7. Negotiation Timeline (day-by-day)
8. Beyond Base Salary (alternative negotiables)

**Raise playbook:**
1. Executive Summary
2. Market Compensation Report
3. Your Business Case Document
4. Recommended Salary Target
5. Conversation Scripts (setup meeting, main convo, follow-up)
6. Objection Handling (5+ common pushbacks)
7. Timing & Approach Strategy
8. Plan B — If They Say No

---

## Design System

- **Colors:** ink (#1a1a1a), paper (#faf8f5), accent/green (#2d6a4f), warm/orange (#f4845f), blue (#1d4e89)
- **Fonts:** DM Serif Display (headings), Outfit (body)
- **Offer color:** Green (#2d6a4f)
- **Raise color:** Blue (#1d4e89)

---

## Free Marketing Tools

1. **/calculator** — Counter-offer calculator. Takes offered salary + context, outputs recommended counter with ranges and 10-year impact.
2. **/quiz** — "Am I Underpaid?" quiz. 6 questions, outputs market salary range with percentile placement.
3. **/blog** — 7 SEO articles with CTAs to paid playbooks.

---

## Business Model & Economics

- $39 per playbook (one-time), $27.30 with FIRST30 discount
- AI cost: ~$0.05-0.15 per generation
- Stripe: 2.9% + $0.30 per sale
- Email: free tier (3,000/mo)
- **Profit margin: ~$37+ per sale**
- No recurring subscriptions, no user accounts, no database

---

## Git History Summary (15 commits)

Started as basic MVP → added SEO (blog, sitemap, structured data) → added free tools (quiz, calculator) → conversion optimization (promo banner, discount, email capture, FAQ schema) → competitive positioning (vs ChatGPT, vs coaches) → rebranded to SalaryPrep

---

## What Has NOT Been Built Yet / Known Gaps

- No persistent database (no user accounts, no order history)
- No admin dashboard
- No refund automation
- No error tracking (Sentry recommended)
- No customer support chat
- Document text extraction is basic (no OCR)
- No analytics on playbook generation/downloads

---

## Important Context from the Owner

- The owner has been building a **company dataset of 320+ companies** in a separate Claude session on their laptop. Those data files exist locally on their computer but have NOT been committed to this repository yet. If you're asked about company data, that's where it lives.
- The owner wants to explore using anonymized negotiation data to improve the product (e.g., showing users what others in similar roles negotiated). Legal/privacy review of this approach is pending.

---

## How to Run Locally

```bash
npm install
cp .env.example .env    # Fill in all keys
npm run dev              # http://localhost:3000
```

For production: `npm run build && npm run start`

Requires Vercel Pro plan (or equivalent) for the 120-second API timeout needed by the playbook generation endpoint.

---

## Key Files to Edit

| Goal | File(s) |
|------|---------|
| Change AI output quality/structure | `lib/prompts.js` |
| Change PDF formatting/branding | `lib/pdf-generator.js` |
| Change email template | `lib/email.js` |
| Change landing page copy | `components/*.js` |
| Change colors/fonts | `tailwind.config.js`, `app/globals.css` |
| Add new blog post | `app/blog/[new-slug]/page.js` + update `app/blog/page.js` |
| Change pricing | Stripe dashboard + `components/Pricing.js` |
| Change AI model | `app/api/generate-playbook/route.js` (model param) |
