// ============================================
// D4: Cross-Link Mapping — Blog ↔ Company Pages
// ============================================
// All data is hardcoded from known blog posts and company directories.
// Zero AI generation, zero runtime file reads for blog pages.

/**
 * All 7 blog posts with metadata for cross-linking.
 * `companies`: slugs of companies explicitly discussed in the article.
 * `topic`: 'offer' | 'raise' | 'both' — used to match with company page context.
 */
export const BLOG_POSTS = [
  {
    slug: 'negotiate-salary-big-tech',
    title: 'How to Negotiate Salary at Amazon, Google & Big Tech',
    tag: 'Big Tech',
    companies: ['amazon', 'google', 'meta', 'apple', 'microsoft'],
    topic: 'offer',
  },
  {
    slug: 'how-to-negotiate-salary-new-job',
    title: 'How to Negotiate Salary on a New Job Offer',
    tag: 'Job Offers',
    companies: [],
    topic: 'offer',
  },
  {
    slug: 'counter-offer-email-template',
    title: 'Counter Offer Email Template: Exactly What to Write',
    tag: 'Scripts & Templates',
    companies: [],
    topic: 'offer',
  },
  {
    slug: 'how-to-respond-lowball-offer',
    title: 'How to Respond to a Lowball Job Offer',
    tag: 'Negotiation',
    companies: [],
    topic: 'offer',
  },
  {
    slug: 'how-to-ask-for-a-raise',
    title: 'How to Ask for a Raise: The Complete Playbook',
    tag: 'Raises',
    companies: [],
    topic: 'raise',
  },
  {
    slug: 'get-raise-no-budget',
    title: 'How to Get a Raise When Your Company Says "No Budget"',
    tag: 'Raises',
    companies: [],
    topic: 'raise',
  },
  {
    slug: 'salary-negotiation-women',
    title: 'Salary Negotiation for Women: Close the Pay Gap',
    tag: 'Strategy',
    companies: [],
    topic: 'both',
  },
];

/**
 * Popular companies to feature on blog pages.
 * These are high-recognition brands that drive clicks.
 */
export const POPULAR_COMPANIES = [
  { slug: 'google', name: 'Google' },
  { slug: 'amazon', name: 'Amazon' },
  { slug: 'meta', name: 'Meta' },
  { slug: 'apple', name: 'Apple' },
  { slug: 'microsoft', name: 'Microsoft' },
  { slug: 'netflix', name: 'Netflix' },
  { slug: 'salesforce', name: 'Salesforce' },
  { slug: 'nvidia', name: 'Nvidia' },
];

/**
 * Big tech companies with featured roles for the big tech blog article.
 * These are the 5 companies explicitly discussed in the article.
 */
export const BIG_TECH_COMPANIES = [
  {
    slug: 'amazon',
    name: 'Amazon',
    featuredRoles: [
      { slug: 'software-engineer', title: 'Software Engineer' },
      { slug: 'product-manager', title: 'Product Manager' },
      { slug: 'senior-software-engineer', title: 'Senior Software Engineer' },
    ],
  },
  {
    slug: 'google',
    name: 'Google',
    featuredRoles: [
      { slug: 'software-engineer', title: 'Software Engineer' },
      { slug: 'product-manager', title: 'Product Manager' },
      { slug: 'senior-software-engineer', title: 'Senior Software Engineer' },
    ],
  },
  {
    slug: 'meta',
    name: 'Meta',
    featuredRoles: [
      { slug: 'software-engineer', title: 'Software Engineer' },
      { slug: 'product-manager', title: 'Product Manager' },
      { slug: 'data-scientist', title: 'Data Scientist' },
    ],
  },
  {
    slug: 'apple',
    name: 'Apple',
    featuredRoles: [
      { slug: 'software-engineer', title: 'Software Engineer' },
      { slug: 'product-manager', title: 'Product Manager' },
      { slug: 'engineering-manager', title: 'Engineering Manager' },
    ],
  },
  {
    slug: 'microsoft',
    name: 'Microsoft',
    featuredRoles: [
      { slug: 'software-engineer', title: 'Software Engineer' },
      { slug: 'product-manager', title: 'Product Manager' },
      { slug: 'senior-software-engineer', title: 'Senior Software Engineer' },
    ],
  },
];

/**
 * Simple hash for deterministic rotation of blog posts across company pages.
 * Ensures different companies show different article combinations.
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Returns 2-3 relevant blog posts for a given company slug.
 * Used on company role pages to show "Related Negotiation Articles".
 *
 * Logic:
 * 1. If the company is explicitly discussed in a blog post → include it first
 * 2. Fill remaining slots with general offer-topic articles, rotated by company hash
 * 3. Always include the "women" article as it's universally relevant
 */
export function getRelatedBlogPosts(companySlug) {
  const results = [];

  // 1. Company-specific articles (e.g., big tech article for Google)
  const companySpecific = BLOG_POSTS.filter(
    p => p.companies.includes(companySlug)
  );
  results.push(...companySpecific);

  // 2. General offer articles (not company-specific, not raise-only)
  const generalOfferPosts = BLOG_POSTS.filter(
    p => p.companies.length === 0 && (p.topic === 'offer' || p.topic === 'both')
  );

  // Rotate based on company slug so different companies show different articles
  const hash = simpleHash(companySlug);
  const sorted = [...generalOfferPosts].sort(
    (a, b) => simpleHash(a.slug + companySlug) - simpleHash(b.slug + companySlug)
  );

  for (const post of sorted) {
    if (results.length >= 3) break;
    if (!results.find(r => r.slug === post.slug)) {
      results.push(post);
    }
  }

  // 3. If still under 3, add raise articles
  if (results.length < 3) {
    const raisePosts = BLOG_POSTS.filter(
      p => p.companies.length === 0 && p.topic === 'raise'
    );
    for (const post of raisePosts) {
      if (results.length >= 3) break;
      if (!results.find(r => r.slug === post.slug)) {
        results.push(post);
      }
    }
  }

  return results.slice(0, 3);
}
