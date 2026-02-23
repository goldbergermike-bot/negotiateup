# SalaryPrep Product Roadmap

Prioritized by business impact. Each item includes an effort estimate (S/M/L) and expected impact (High/Med/Low).

---

## Tier 1: Revenue & Legal (Do This Week)

Critical fixes that protect revenue, reduce legal risk, and patch obvious UX gaps.

- [ ] **Fix email capture to actually persist emails** — Connect the quiz page email form to Resend audience API or, as a stopgap, write submissions to a server-side JSON file. The current implementation is client-side only and discards every lead. `Effort: S | Impact: High`
- [ ] **Create /privacy and /terms pages** — Footer already links to these routes but they 404. Draft baseline policies covering data collection, Stripe payment processing, and AI-generated content disclaimers. `Effort: S | Impact: High`
- [ ] **Add mobile hamburger nav menu** — Navigation is currently invisible on small screens. Implement a collapsible menu with accessible toggle button. `Effort: S | Impact: High`
- [ ] **Fix input validation on calculator and quiz** — Prevent NaN, negative numbers, and empty submissions. Add inline error messages so users know what went wrong. `Effort: S | Impact: Med`

---

## Tier 2: Conversion & Trust (Do This Month)

Features and polish that increase conversion rate and build credibility with visitors.

- [ ] **Build free /report page (salary report lead magnet)** — Gate a condensed salary report behind email capture. See `PDF_REPORT_FEATURE_SPEC.md` for full spec. This is the primary funnel for turning organic traffic into email subscribers and eventual playbook buyers. `Effort: L | Impact: High`
- [ ] **Add loading states and better error handling on forms** — Show spinners during async operations, surface user-friendly error messages on failure, and disable submit buttons to prevent double-clicks. `Effort: S | Impact: Med`
- [ ] **Per-page OpenGraph images for blog articles** — Generate or design unique OG images for each of the 7 blog posts so social shares look professional instead of using a generic fallback. `Effort: M | Impact: Med`
- [ ] **Add GA4 custom events at conversion points** — Track checkout click, form submit, quiz complete, and report download as custom events. Essential for understanding the funnel and making data-driven decisions. `Effort: S | Impact: High`
- [ ] **Remove /new-offer and /raise from sitemap** — These pages are behind the paywall and should not be indexed. Exclude them from sitemap.xml and add noindex meta tags. `Effort: S | Impact: Low`

---

## Tier 3: Data & Infrastructure (Do This Quarter)

Structural improvements that reduce tech debt and unlock future features.

- [ ] **Migrate research data to structured format** — Add JSON frontmatter to all 4,470 research markdown files so they can be queried, filtered, and validated programmatically. `Effort: L | Impact: High`
- [ ] **Add last_updated and data_source fields to all research files** — Track when each data point was last verified and where it came from. Critical for maintaining trust as the dataset grows. `Effort: M | Impact: Med`
- [ ] **Build simple admin dashboard for viewing orders and managing data** — Read-only dashboard showing Stripe webhook events, order history, and research file stats. No auth framework needed yet; protect with a shared secret or basic auth. `Effort: M | Impact: Med`
- [ ] **Set up lightweight database for orders, emails, and report downloads** — SQLite (via Turso) or Supabase free tier. Replace the current webhook-logs-to-nowhere pattern with actual persistence. `Effort: M | Impact: High`
- [ ] **Improve PDF markdown parsing robustness** — The current basic markdown parser breaks on edge cases. Switch to a battle-tested library (e.g., markdown-it) and add fallback formatting so PDFs never ship with broken layout. `Effort: M | Impact: Med`
- [ ] **Add proper .docx file extraction** — Integrate mammoth.js for any .docx research source files so data ingestion is more reliable than raw text extraction. `Effort: S | Impact: Low`

---

## Tier 4: Growth & Scale (Next Quarter)

Expansion efforts that grow traffic, revenue, and the product surface area.

- [ ] **Blog expansion to 20+ articles** — Target long-tail SEO keywords around salary negotiation, offer evaluation, and company-specific compensation. Each article funnels to the quiz or report page. `Effort: L | Impact: High`
- [ ] **Add company-specific landing pages** — Generate SEO-optimized pages at /companies/google, /companies/meta, etc. for all 319 companies. Each page surfaces a summary of research data and CTAs to the playbook. `Effort: L | Impact: High`
- [ ] **Implement A/B testing on pricing page** — Test price points, copy variations, and CTA placement. Use Vercel Edge Config or a lightweight client-side split. `Effort: M | Impact: Med`
- [ ] **Build referral program** — Move beyond the current share-a-code approach. Implement tracked referral links with discount codes and a simple dashboard showing referral stats. `Effort: M | Impact: Med`
- [ ] **Add more roles to research database** — Expand from 13 to 20+ standard roles, prioritizing high-search-volume titles (e.g., Data Scientist, DevOps Engineer, TPM). `Effort: L | Impact: Med`
- [ ] **Customer portal for accessing purchased playbooks** — Lightweight account system (magic link auth) so buyers can re-download their playbook without emailing support. `Effort: L | Impact: Med`

---

## Tier 5: Future Vision

Longer-term bets that expand the business model beyond individual playbook sales.

- [ ] **White-label playbooks for career coaches** — Let coaches purchase bulk-generated playbooks branded with their own logo and practice name. Requires a partner onboarding flow and custom branding layer in PDF generation. `Effort: L | Impact: High`
- [ ] **API for partners** — Expose salary data and playbook generation as an API for job boards, HR platforms, and career services. `Effort: L | Impact: Med`
- [ ] **Video and podcast content** — Produce negotiation coaching content to build brand authority and drive top-of-funnel traffic from YouTube and podcast directories. `Effort: L | Impact: Med`
- [ ] **International expansion** — Localize salary data for major markets (UK, Canada, EU, India). Requires new data sources, currency handling, and region-specific negotiation norms. `Effort: L | Impact: High`

---

## Accessibility & Quality (Ongoing)

These cut across all tiers and should be addressed incrementally alongside feature work.

- [ ] **Add aria labels and roles to all interactive elements** — Buttons, form inputs, navigation, and modals all need proper ARIA attributes. `Effort: M | Impact: Med`
- [ ] **Set up testing suite** — Add Jest + React Testing Library for unit tests and Playwright for critical-path E2E tests (checkout flow, quiz completion, report download). `Effort: M | Impact: Med`
- [ ] **Keyboard navigation audit** — Ensure all interactive flows are fully operable via keyboard. `Effort: S | Impact: Med`

---

*Last updated: 2026-02-23*
