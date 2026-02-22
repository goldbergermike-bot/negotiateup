// ============================================
// NegotiateUp — Company Intelligence Database
// ============================================
// Structured data for 300+ companies used to:
//   1. Generate SEO landing pages (/companies/[slug])
//   2. Enrich AI prompts with real company intel
//   3. Power the company directory (/companies)
//
// To add companies: append to the COMPANIES array below.
// Each company needs at minimum: name, slug, industry, size.

const COMPANIES = [
  // ---- BIG TECH / FAANG ----
  {
    name: 'Google',
    slug: 'google',
    parent: 'Alphabet',
    industry: 'Technology',
    size: 'Enterprise (10,000+)',
    headquarters: 'Mountain View, CA',
    negotiationDifficulty: 'moderate',
    compPhilosophy: 'Pays at or above 75th percentile. Strong emphasis on total comp (base + bonus + equity). Levels-based comp system where each level has defined bands.',
    flexibleLevers: ['equity', 'signing bonus', 'level', 'location'],
    rigidLevers: ['base salary within band'],
    typicalProcess: 'Offer comes from recruiter. First offer is rarely final. Expect 1-2 rounds of negotiation. Competing offers are highly effective leverage.',
    benefitsHighlights: ['401k match', 'free meals', 'generous PTO', 'parental leave (24 weeks)', 'learning stipend'],
    compStructure: {
      basePct: 40,
      equityPct: 45,
      bonusPct: 15,
      notes: 'RSUs vest over 4 years. Annual refreshers common. Target bonus 15% of base for most ICs.',
    },
    negotiationTips: [
      'Competing offers (especially from Meta/Apple) significantly move comp.',
      'Equity is the most flexible lever — push here first.',
      'Signing bonuses of $15K-$100K are common for senior roles.',
      'Level is the biggest comp lever — advocate for the right level.',
      'Google recruiters expect negotiation — not negotiating leaves money on the table.',
    ],
    tags: ['faang', 'big-tech', 'public'],
  },
  {
    name: 'Amazon',
    slug: 'amazon',
    industry: 'Technology',
    size: 'Enterprise (10,000+)',
    headquarters: 'Seattle, WA',
    negotiationDifficulty: 'moderate',
    compPhilosophy: 'Base salary capped at $175K-$185K for most roles. Heavy equity loading. Year 1-2 lower comp offset by signing bonus.',
    flexibleLevers: ['signing bonus', 'equity (RSUs)', 'level', 'relocation'],
    rigidLevers: ['base salary cap'],
    typicalProcess: 'Structured offer with strict base cap. Signing bonus used to bridge year 1-2 equity gap. Back-loaded RSU vesting (5/15/40/40).',
    benefitsHighlights: ['401k match (50% up to 4%)', 'relocation assistance', 'adoption assistance', 'career choice program'],
    compStructure: {
      basePct: 30,
      equityPct: 55,
      bonusPct: 15,
      notes: 'RSUs vest 5/15/40/40 over 4 years. Year 1-2 signing bonus compensates for backloading. Base capped ~$175K-$185K.',
    },
    negotiationTips: [
      "Don't focus on base — it's capped. Push on signing bonus and RSUs instead.",
      'Signing bonuses of $50K-$150K are common for senior roles to offset RSU vesting.',
      'Level is everything at Amazon — fight for the right level, not just more money at a lower level.',
      'Year 1 total comp includes signing bonus — negotiate signing bonus split between Y1 and Y2.',
      'Competing offers with higher base can help raise signing bonus significantly.',
    ],
    tags: ['faang', 'big-tech', 'public', 'e-commerce'],
  },
  {
    name: 'Meta',
    slug: 'meta',
    parent: 'Meta Platforms',
    industry: 'Technology',
    size: 'Enterprise (10,000+)',
    headquarters: 'Menlo Park, CA',
    negotiationDifficulty: 'moderate',
    compPhilosophy: 'Pays aggressively at 75th-90th percentile to compete for top talent. Level-based comp with wide bands. Strong equity component.',
    flexibleLevers: ['equity', 'signing bonus', 'level', 'location differential'],
    rigidLevers: ['base salary within level'],
    typicalProcess: 'Recruiter delivers initial offer. Competing offers (especially Google/Apple) trigger "strong" or "very strong" offer tiers. Up to 3 rounds possible.',
    benefitsHighlights: ['401k match', 'free meals', 'generous PTO', 'parental leave (20 weeks)', '$3K annual wellness stipend'],
    compStructure: {
      basePct: 35,
      equityPct: 50,
      bonusPct: 15,
      notes: 'RSUs vest quarterly over 4 years. Annual refreshers. Target bonus 10-20% of base.',
    },
    negotiationTips: [
      'Meta is one of the most negotiation-friendly FAANG companies.',
      'A Google or Apple competing offer can increase equity by 20-50%.',
      "Signing bonuses of $25K-$100K are readily available if you ask.",
      'Focus on equity — Meta stock grants are quarterly-vesting and significant.',
      'If you have a competing offer, mention it early — Meta moves fast.',
    ],
    tags: ['faang', 'big-tech', 'public', 'social-media'],
  },
  {
    name: 'Apple',
    slug: 'apple',
    industry: 'Technology',
    size: 'Enterprise (10,000+)',
    headquarters: 'Cupertino, CA',
    negotiationDifficulty: 'hard',
    compPhilosophy: 'Competitive but not top of market for base. Strong equity. Known for making "best and final" offers. More rigid than other FAANG.',
    flexibleLevers: ['equity (RSUs)', 'signing bonus', 'relocation'],
    rigidLevers: ['base salary', 'annual bonus'],
    typicalProcess: 'Offers tend to be presented as "strong" from the start. Less back-and-forth than Google/Meta. Competing offers help but Apple rarely matches dollar-for-dollar.',
    benefitsHighlights: ['employee stock purchase plan', 'product discounts', '401k match (50% up to 6%)', 'comprehensive health'],
    compStructure: {
      basePct: 40,
      equityPct: 45,
      bonusPct: 15,
      notes: 'RSUs vest over 4 years. Signing bonus common. Annual bonus target varies by role.',
    },
    negotiationTips: [
      'Apple tends to give fewer rounds of negotiation — make your first counter strong.',
      'Equity is the best lever. Base salary bands are tighter at Apple.',
      'Apple values loyalty — they may not match competitors but emphasize culture and mission.',
      "Signing bonuses up to $50K-$100K are possible for senior hires.",
      'If relocating, negotiate relocation package aggressively — Apple has strong relo benefits.',
    ],
    tags: ['faang', 'big-tech', 'public', 'hardware'],
  },
  {
    name: 'Microsoft',
    slug: 'microsoft',
    industry: 'Technology',
    size: 'Enterprise (10,000+)',
    headquarters: 'Redmond, WA',
    negotiationDifficulty: 'moderate',
    compPhilosophy: 'Level-based comp. Competitive total comp with good work-life balance. Generous equity refreshers annually.',
    flexibleLevers: ['signing bonus', 'equity', 'level'],
    rigidLevers: ['base within band'],
    typicalProcess: 'Recruiter presents offer. Standard negotiation expected. Level is critical — each level has distinct comp bands. Competing offers from Google/Meta most effective.',
    benefitsHighlights: ['401k match (50% up to IRS limit)', '20+ days PTO', 'parental leave (20 weeks)', 'tuition assistance'],
    compStructure: {
      basePct: 45,
      equityPct: 35,
      bonusPct: 20,
      notes: 'RSUs vest annually over 4 years. Strong annual refreshers. Bonus target 0-30% depending on level.',
    },
    negotiationTips: [
      'Microsoft is very negotiation-friendly — always counter.',
      'Level matters enormously. A level bump can mean $50K-$100K+ more in total comp.',
      'Signing bonuses of $30K-$100K are common for senior roles.',
      'Annual equity refreshers at Microsoft are generous — factor into multi-year comp.',
      'If coming from FAANG, your current comp is strong leverage.',
    ],
    tags: ['big-tech', 'public', 'cloud'],
  },
  {
    name: 'Netflix',
    slug: 'netflix',
    industry: 'Technology',
    size: 'Large (1,001-10,000)',
    headquarters: 'Los Gatos, CA',
    negotiationDifficulty: 'moderate',
    compPhilosophy: 'Pays top-of-market. All-cash comp (no equity vesting schedule). High base, high autonomy, high expectations.',
    flexibleLevers: ['base salary', 'stock vs cash split'],
    rigidLevers: ['no signing bonus', 'no annual bonus'],
    typicalProcess: 'Netflix offers tend to be aggressive from the start. They aim to pay at top of market. You choose your cash vs. stock option split annually.',
    benefitsHighlights: ['unlimited PTO', 'no vesting schedule', 'choose your own cash/stock split', 'generous parental leave'],
    compStructure: {
      basePct: 70,
      equityPct: 30,
      bonusPct: 0,
      notes: 'No bonuses. No vesting. You pick your cash/stock split. Re-evaluated annually at top of market.',
    },
    negotiationTips: [
      'Netflix already pays at top-of-market — but negotiation still works.',
      "Focus on base salary since there's no bonus or signing bonus.",
      'Your cash vs stock split preference is flexible and re-set annually.',
      'Netflix values senior talent — strong experience and competing offers give leverage.',
      'No vesting means you can leave anytime with full comp already paid.',
    ],
    tags: ['faang', 'big-tech', 'public', 'streaming'],
  },

  // ---- OTHER TECH ----
  {
    name: 'Salesforce',
    slug: 'salesforce',
    industry: 'Technology',
    size: 'Enterprise (10,000+)',
    headquarters: 'San Francisco, CA',
    negotiationDifficulty: 'moderate',
    compPhilosophy: 'Competitive total comp. Strong equity grants. Culture emphasizes work-life balance.',
    flexibleLevers: ['equity', 'signing bonus', 'level'],
    rigidLevers: ['base within band'],
    typicalProcess: 'Standard corporate negotiation. Recruiters have room to move on equity and signing bonus. Competing offers help.',
    benefitsHighlights: ['7 days volunteer PTO', '401k match', 'wellness reimbursement', 'parental leave'],
    compStructure: {
      basePct: 45,
      equityPct: 35,
      bonusPct: 20,
      notes: 'RSUs vest over 4 years. Target bonus varies by role (10-20%). Annual refreshers common.',
    },
    negotiationTips: [
      'Salesforce recruiters have meaningful room on equity — always ask for more.',
      'Signing bonuses of $20K-$50K are available for experienced hires.',
      "Competing offers from other enterprise SaaS companies are effective leverage.",
      'Level is tied to comp bands — confirm your level matches your experience.',
      'Salesforce values cultural fit — frame negotiation as excitement about joining.',
    ],
    tags: ['big-tech', 'public', 'saas', 'enterprise'],
  },
  {
    name: 'Stripe',
    slug: 'stripe',
    industry: 'Technology',
    size: 'Large (1,001-10,000)',
    headquarters: 'San Francisco, CA',
    negotiationDifficulty: 'moderate',
    compPhilosophy: 'Pays competitively. Equity is a major component. Values technical excellence.',
    flexibleLevers: ['equity', 'signing bonus', 'level'],
    rigidLevers: ['base within range'],
    typicalProcess: 'Structured offers with competitive base + significant equity. Standard negotiation expected. Level determines comp band.',
    benefitsHighlights: ['generous PTO', '401k', 'health & wellness', 'learning stipend', 'remote-friendly'],
    compStructure: {
      basePct: 40,
      equityPct: 45,
      bonusPct: 15,
      notes: 'Pre-IPO equity (RSUs). 4-year vesting. Valuation updates affect paper value.',
    },
    negotiationTips: [
      'Stripe equity is pre-IPO — high upside potential but discuss valuation assumptions.',
      'Competing offers from public companies can push Stripe to increase equity significantly.',
      'Signing bonuses are available — ask for $25K-$75K for senior roles.',
      'Level mapping matters — ensure your experience is reflected in the offer level.',
      'Stripe values mission alignment — frame your negotiation professionally.',
    ],
    tags: ['fintech', 'payments', 'late-stage-startup'],
  },
  {
    name: 'Uber',
    slug: 'uber',
    industry: 'Technology',
    size: 'Enterprise (10,000+)',
    headquarters: 'San Francisco, CA',
    negotiationDifficulty: 'moderate',
    compPhilosophy: 'Competitive total comp. Level-based system. Equity is a major component.',
    flexibleLevers: ['equity', 'signing bonus'],
    rigidLevers: ['base within band'],
    typicalProcess: 'Recruiter presents initial offer. Room to negotiate equity and signing bonus. Competing offers from ride-share/tech companies are effective.',
    benefitsHighlights: ['Uber credits', '401k match', 'parental leave', 'gym reimbursement'],
    compStructure: {
      basePct: 40,
      equityPct: 40,
      bonusPct: 20,
      notes: 'RSUs vest over 4 years. Annual refreshers. Target bonus 15-25% depending on level.',
    },
    negotiationTips: [
      'Uber recruiters expect negotiation — the first offer has room to move.',
      'Equity is the most flexible lever. Push for additional RSUs.',
      'Signing bonuses of $20K-$50K are common.',
      'If you have competing offers, mention them — Uber will try to be competitive.',
      'Level negotiation is critical — one level up can mean $50K+ more annually.',
    ],
    tags: ['big-tech', 'public', 'rideshare', 'gig-economy'],
  },
  {
    name: 'Airbnb',
    slug: 'airbnb',
    industry: 'Technology',
    size: 'Large (1,001-10,000)',
    headquarters: 'San Francisco, CA',
    negotiationDifficulty: 'moderate',
    compPhilosophy: 'Competitive total comp. Known for flexible work policies. Equity-heavy packages.',
    flexibleLevers: ['equity', 'signing bonus'],
    rigidLevers: ['base salary'],
    typicalProcess: 'Standard tech negotiation. Competing offers help. Airbnb emphasizes culture and mission in the process.',
    benefitsHighlights: ['travel credits', 'work from anywhere', 'sabbatical program', '401k match', 'generous PTO'],
    compStructure: {
      basePct: 40,
      equityPct: 45,
      bonusPct: 15,
      notes: 'RSUs over 4 years. Annual refreshers. Travel credit perks.',
    },
    negotiationTips: [
      'Airbnb values cultural add — express genuine interest in the mission.',
      'Equity is the main lever for negotiation.',
      'Travel credits and "live and work anywhere" are unique perks worth asking about.',
      'Signing bonuses available for senior roles.',
      'Competing offers from other travel-tech or FAANG help move numbers.',
    ],
    tags: ['big-tech', 'public', 'travel'],
  },

  // ---- FINANCE ----
  {
    name: 'JPMorgan Chase',
    slug: 'jpmorgan-chase',
    industry: 'Finance',
    size: 'Enterprise (10,000+)',
    headquarters: 'New York, NY',
    negotiationDifficulty: 'moderate',
    compPhilosophy: 'Structured comp with defined bands. Strong bonus culture. Base + guaranteed bonus for first year.',
    flexibleLevers: ['signing bonus', 'guaranteed bonus', 'title/level'],
    rigidLevers: ['base salary within grade'],
    typicalProcess: 'HR-driven offers with defined comp bands per grade. Negotiation possible within bands. Competing offers from other banks are most effective.',
    benefitsHighlights: ['strong 401k match', 'healthcare', 'tuition reimbursement', 'banking perks', 'wellness programs'],
    compStructure: {
      basePct: 50,
      equityPct: 15,
      bonusPct: 35,
      notes: 'Bonus can be 20-100%+ of base depending on role/level. RSUs for VP+ roles. Year-end discretionary bonus is major component.',
    },
    negotiationTips: [
      'Base salary is often rigid within grade — focus on guaranteed first-year bonus and signing bonus.',
      'Signing bonuses of $10K-$100K+ depending on level and competing offers.',
      'Title/grade is critical — each grade has a comp band. Fight for the right grade.',
      'Year-end bonus is discretionary but forms a large part of comp — ask about target ranges.',
      'Competing offers from Goldman, Morgan Stanley, or top tech firms provide strong leverage.',
    ],
    tags: ['finance', 'banking', 'public'],
  },
  {
    name: 'Goldman Sachs',
    slug: 'goldman-sachs',
    industry: 'Finance',
    size: 'Enterprise (10,000+)',
    headquarters: 'New York, NY',
    negotiationDifficulty: 'hard',
    compPhilosophy: 'Pay for performance. Structured levels. Year-end bonus is the main variable lever.',
    flexibleLevers: ['signing bonus', 'guaranteed first-year bonus'],
    rigidLevers: ['base salary within level', 'year-end bonus (discretionary)'],
    typicalProcess: 'Offers are structured by level with defined base ranges. Limited base negotiation. Focus on signing bonus and guaranteed bonus.',
    benefitsHighlights: ['healthcare', '401k', 'parental leave (20 weeks)', 'wellness stipend', 'professional development'],
    compStructure: {
      basePct: 40,
      equityPct: 20,
      bonusPct: 40,
      notes: 'Year-end bonus can be 50-150%+ of base for VP+. RSUs vest over 3-5 years. Signing bonus for lateral hires.',
    },
    negotiationTips: [
      'Goldman base salaries are less negotiable — focus on signing and guaranteed bonus.',
      'First-year guaranteed bonus protects against low discretionary bonus in year 1.',
      "Competing offers from JPMorgan, Morgan Stanley, or tech firms provide leverage.",
      'Level/title determines your comp band — ensure proper leveling.',
      'Goldman values prestige and commitment — don\'t come across as purely transactional.',
    ],
    tags: ['finance', 'banking', 'public'],
  },

  // ---- CONSULTING ----
  {
    name: 'McKinsey & Company',
    slug: 'mckinsey',
    industry: 'Consulting',
    size: 'Enterprise (10,000+)',
    headquarters: 'New York, NY',
    negotiationDifficulty: 'hard',
    compPhilosophy: 'Lockstep compensation by tenure and level. Very limited individual negotiation. Transparent comp bands.',
    flexibleLevers: ['signing bonus', 'start date', 'location'],
    rigidLevers: ['base salary (lockstep)', 'annual bonus (formulaic)'],
    typicalProcess: 'Offers are formulaic by level. Little room for base negotiation. Signing bonus is the main negotiable lever.',
    benefitsHighlights: ['retirement plan', 'extensive travel perks', 'professional development', 'sabbatical option'],
    compStructure: {
      basePct: 55,
      equityPct: 0,
      bonusPct: 45,
      notes: 'No equity (private). Performance bonus + signing bonus. Lockstep pay by level.',
    },
    negotiationTips: [
      'McKinsey has lockstep pay — base negotiation is essentially impossible.',
      'Signing bonus is your main lever ($10K-$50K depending on level and background).',
      'Start date flexibility can be valuable — negotiate if you need time between roles.',
      'Office location affects comp — some offices pay more than others.',
      'If you have competing offers from BCG/Bain, mention them — it can help at margins.',
    ],
    tags: ['consulting', 'mbb', 'private'],
  },
  {
    name: 'Deloitte',
    slug: 'deloitte',
    industry: 'Consulting',
    size: 'Enterprise (10,000+)',
    headquarters: 'New York, NY',
    negotiationDifficulty: 'moderate',
    compPhilosophy: 'Level-based comp with defined bands. More negotiable than MBB. Strong bonus structure.',
    flexibleLevers: ['base salary (within band)', 'signing bonus', 'level'],
    rigidLevers: ['annual bonus percentage'],
    typicalProcess: 'Offers come from HR/recruiting. Some room to negotiate base within the band. Signing bonuses available for experienced hires.',
    benefitsHighlights: ['401k match', 'healthcare', 'CPA support', 'education reimbursement', 'wellness programs'],
    compStructure: {
      basePct: 60,
      equityPct: 0,
      bonusPct: 40,
      notes: 'No equity (partnership). Target bonus by level. Signing bonus for laterals.',
    },
    negotiationTips: [
      'Deloitte has more room than MBB firms — always negotiate base within the band.',
      'Signing bonuses of $10K-$30K are common for experienced hires.',
      'Level is important — each level has a comp band. Ensure proper leveling.',
      'Competing offers from other Big 4 or tech companies provide good leverage.',
      'Ask about the path to senior manager/director — comp jumps significantly at those levels.',
    ],
    tags: ['consulting', 'big-four', 'private'],
  },

  // ---- HEALTHCARE ----
  {
    name: 'UnitedHealth Group',
    slug: 'unitedhealth-group',
    industry: 'Healthcare',
    size: 'Enterprise (10,000+)',
    headquarters: 'Minnetonka, MN',
    negotiationDifficulty: 'moderate',
    compPhilosophy: 'Competitive within healthcare. Structured comp bands. Strong benefits package.',
    flexibleLevers: ['base salary (within band)', 'signing bonus', 'PTO'],
    rigidLevers: ['annual bonus target'],
    typicalProcess: 'HR presents offer within grade band. Room to negotiate base and signing bonus. Benefits are standardized.',
    benefitsHighlights: ['strong healthcare (as expected)', '401k match', 'tuition reimbursement', 'employee stock purchase plan'],
    compStructure: {
      basePct: 60,
      equityPct: 15,
      bonusPct: 25,
      notes: 'RSUs for director+. Annual bonus 10-30% depending on level. ESPP available.',
    },
    negotiationTips: [
      'UHG pays competitively within healthcare — use tech industry comps for leverage if relevant.',
      'Signing bonuses of $5K-$25K available for experienced hires.',
      'Remote work is increasingly available — negotiate location flexibility.',
      'The healthcare benefits are excellent — consider total value of benefits package.',
      'If coming from tech, negotiate higher to offset any equity difference.',
    ],
    tags: ['healthcare', 'insurance', 'public'],
  },

  // ---- RETAIL ----
  {
    name: 'Walmart',
    slug: 'walmart',
    industry: 'Retail',
    size: 'Enterprise (10,000+)',
    headquarters: 'Bentonville, AR',
    negotiationDifficulty: 'moderate',
    compPhilosophy: 'Increasingly competitive for tech roles. Cost-of-living adjusted. Strong equity for corporate roles.',
    flexibleLevers: ['base salary', 'signing bonus', 'relocation'],
    rigidLevers: ['annual bonus target'],
    typicalProcess: 'Corporate roles have defined bands. Tech roles are more competitive. Negotiation expected for experienced hires.',
    benefitsHighlights: ['401k match (6%)', 'associate stock purchase plan (15% discount)', 'healthcare', 'education benefits'],
    compStructure: {
      basePct: 55,
      equityPct: 25,
      bonusPct: 20,
      notes: 'RSUs for manager+. ESPP with 15% discount. Bonus target varies by level.',
    },
    negotiationTips: [
      "Walmart's tech division pays competitively with other tech companies.",
      'If based in Bentonville, cost of living is much lower — factor this into comp comparison.',
      'Signing bonuses available for experienced hires — ask for $10K-$30K.',
      'The ESPP with 15% discount is a meaningful benefit — factor it into total comp.',
      'Competing offers from other retailers or tech companies provide leverage.',
    ],
    tags: ['retail', 'public', 'e-commerce'],
  },

  // ---- MORE TECH ----
  {
    name: 'Adobe',
    slug: 'adobe',
    industry: 'Technology',
    size: 'Enterprise (10,000+)',
    headquarters: 'San Jose, CA',
    negotiationDifficulty: 'moderate',
    compPhilosophy: 'Competitive total comp. Level-based system. Strong equity refreshers.',
    flexibleLevers: ['equity', 'signing bonus', 'level'],
    rigidLevers: ['base within band'],
    typicalProcess: 'Standard tech company negotiation. Room to move on equity and signing bonus.',
    benefitsHighlights: ['401k match', 'ESPP', 'sabbatical (4 weeks after 5 years)', 'learning fund'],
    compStructure: {
      basePct: 45,
      equityPct: 35,
      bonusPct: 20,
      notes: 'RSUs vest over 4 years. Annual refreshers. Target bonus 10-20%.',
    },
    negotiationTips: [
      'Adobe recruiters have room on equity — always ask for more RSUs.',
      'Signing bonuses of $15K-$50K are common for experienced hires.',
      'The sabbatical program is a unique perk — factor it into your total comp evaluation.',
      'Competing offers from other SaaS/tech companies are effective leverage.',
      'Level mapping is important — confirm your level matches experience.',
    ],
    tags: ['big-tech', 'public', 'saas', 'creative'],
  },
  {
    name: 'Oracle',
    slug: 'oracle',
    industry: 'Technology',
    size: 'Enterprise (10,000+)',
    headquarters: 'Austin, TX',
    negotiationDifficulty: 'moderate',
    compPhilosophy: 'Competitive base. Structured equity grants. Sales roles have aggressive commission.',
    flexibleLevers: ['base salary', 'signing bonus', 'equity'],
    rigidLevers: ['annual bonus target'],
    typicalProcess: 'Recruiter presents offer. Room to negotiate base and signing bonus. Competing offers help.',
    benefitsHighlights: ['401k', 'ESPP', 'healthcare', 'employee assistance program'],
    compStructure: {
      basePct: 50,
      equityPct: 30,
      bonusPct: 20,
      notes: 'RSUs vest over 4 years. Sales roles have variable comp. Bonus target varies.',
    },
    negotiationTips: [
      'Oracle has room to negotiate — especially on signing bonus and base.',
      'If in a sales role, negotiate the commission plan structure and accelerators.',
      'Competing offers from Salesforce, SAP, or tech companies are effective.',
      'Cloud division roles tend to pay more competitively than legacy divisions.',
      'Signing bonuses of $10K-$40K are available for experienced hires.',
    ],
    tags: ['big-tech', 'public', 'enterprise', 'cloud', 'database'],
  },
  {
    name: 'Nvidia',
    slug: 'nvidia',
    industry: 'Technology',
    size: 'Enterprise (10,000+)',
    headquarters: 'Santa Clara, CA',
    negotiationDifficulty: 'moderate',
    compPhilosophy: 'Top-of-market comp, especially for AI/ML roles. Heavy equity. Strong stock performance amplifies total comp.',
    flexibleLevers: ['equity', 'signing bonus'],
    rigidLevers: ['base within band'],
    typicalProcess: 'Competitive offers with significant equity. Standard negotiation expected. AI/ML talent gets premium offers.',
    benefitsHighlights: ['ESPP (15% discount)', '401k match', 'healthcare', 'gym membership'],
    compStructure: {
      basePct: 35,
      equityPct: 50,
      bonusPct: 15,
      notes: 'RSUs vest over 4 years. Stock appreciation has made equity very valuable. Annual refreshers.',
    },
    negotiationTips: [
      "Nvidia equity has been extremely valuable — but negotiate for more RSUs regardless.",
      'AI/ML roles command premium comp — use market data to your advantage.',
      'Signing bonuses of $20K-$75K available for in-demand roles.',
      'Competing offers from other AI companies (Google DeepMind, OpenAI) are strong leverage.',
      'The ESPP with 15% discount is a meaningful additional benefit.',
    ],
    tags: ['big-tech', 'public', 'ai', 'semiconductors', 'gpu'],
  },
  {
    name: 'Tesla',
    slug: 'tesla',
    industry: 'Technology',
    size: 'Enterprise (10,000+)',
    headquarters: 'Austin, TX',
    negotiationDifficulty: 'hard',
    compPhilosophy: 'Below-market base, heavy equity. Mission-driven compensation. Expects dedication.',
    flexibleLevers: ['equity'],
    rigidLevers: ['base salary', 'no signing bonus typically', 'no annual bonus'],
    typicalProcess: 'Offers tend to be "take it or leave it." Less negotiation culture than other tech. Equity is the main lever.',
    benefitsHighlights: ['ESPP', 'vehicle discount', '401k', 'healthcare'],
    compStructure: {
      basePct: 40,
      equityPct: 55,
      bonusPct: 5,
      notes: 'RSUs vest over 4 years. No cash bonus for most roles. Stock options for some. Mission-driven.',
    },
    negotiationTips: [
      "Tesla offers are harder to negotiate — but equity is still movable.",
      'Base salary is typically lower than other FAANG — set expectations accordingly.',
      'Tesla rarely offers signing bonuses — focus negotiation on RSU count.',
      'Competing offers can help but Tesla relies heavily on mission appeal.',
      'If you believe in the mission, factor in stock appreciation potential.',
    ],
    tags: ['big-tech', 'public', 'automotive', 'ev', 'energy'],
  },
  {
    name: 'OpenAI',
    slug: 'openai',
    industry: 'Technology',
    size: 'Mid-size (201-1,000)',
    headquarters: 'San Francisco, CA',
    negotiationDifficulty: 'moderate',
    compPhilosophy: 'Top-of-market for AI talent. Significant equity (profit participation units). Competing aggressively for top researchers.',
    flexibleLevers: ['equity (PPUs)', 'signing bonus', 'base salary'],
    rigidLevers: [],
    typicalProcess: 'Competitive offers for in-demand AI talent. Standard negotiation. Competing offers from Google, Meta, Anthropic, etc. carry weight.',
    benefitsHighlights: ['generous PTO', 'healthcare', 'meals', '401k', 'learning budget'],
    compStructure: {
      basePct: 30,
      equityPct: 60,
      bonusPct: 10,
      notes: 'Profit participation units (PPUs) instead of traditional RSUs. High potential value but dependent on company valuation.',
    },
    negotiationTips: [
      "OpenAI PPUs are high-risk, high-reward — understand the vesting and valuation.",
      'Competing offers from Google Brain, DeepMind, Anthropic, or Meta AI are very effective.',
      "Base salary is negotiable — OpenAI pays well to compete with FAANG.",
      'Signing bonuses available for senior hires.',
      'The AI industry is white-hot — you have more leverage than you think.',
    ],
    tags: ['ai', 'late-stage-startup', 'research'],
  },

  // ---- PLACEHOLDER for bulk import ----
  // Add your 300+ companies below in the same format.
  // At minimum, each company needs: name, slug, industry, size.
  // The more fields you fill in, the better the AI playbooks will be.
];

// ---- HELPER FUNCTIONS ----

export function getAllCompanies() {
  return COMPANIES.map(({ negotiationTips, compStructure, compPhilosophy, typicalProcess, flexibleLevers, rigidLevers, ...rest }) => rest);
}

export function getCompanyBySlug(slug) {
  return COMPANIES.find((c) => c.slug === slug) || null;
}

export function getCompanySlugs() {
  return COMPANIES.map((c) => c.slug);
}

export function searchCompanies(query) {
  const q = query.toLowerCase();
  return COMPANIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q) ||
      (c.tags && c.tags.some((t) => t.includes(q)))
  ).map(({ negotiationTips, compStructure, compPhilosophy, typicalProcess, flexibleLevers, rigidLevers, ...rest }) => rest);
}

export function getCompaniesByIndustry(industry) {
  return COMPANIES.filter((c) => c.industry === industry).map(({ negotiationTips, compStructure, ...rest }) => rest);
}

export function getIndustries() {
  return [...new Set(COMPANIES.map((c) => c.industry))].sort();
}

export function getCompanyIntelForPrompt(companyName) {
  const company = COMPANIES.find(
    (c) => c.name.toLowerCase() === companyName.toLowerCase() || c.slug === companyName.toLowerCase().replace(/\s+/g, '-')
  );
  if (!company) return null;

  return `
VERIFIED COMPANY INTELLIGENCE FOR ${company.name.toUpperCase()}:
- Industry: ${company.industry}
- Size: ${company.size}
- HQ: ${company.headquarters}
- Negotiation Difficulty: ${company.negotiationDifficulty}
- Compensation Philosophy: ${company.compPhilosophy}
- Flexible Levers: ${company.flexibleLevers.join(', ')}
- Rigid Levers: ${company.rigidLevers.join(', ')}
- Typical Process: ${company.typicalProcess}
- Comp Structure: ~${company.compStructure.basePct}% base, ~${company.compStructure.equityPct}% equity, ~${company.compStructure.bonusPct}% bonus. ${company.compStructure.notes}
- Key Benefits: ${company.benefitsHighlights.join(', ')}
- Negotiation Tips:
${company.negotiationTips.map((t) => `  • ${t}`).join('\n')}

USE THIS VERIFIED DATA in the playbook. It is more reliable than general knowledge.`.trim();
}
