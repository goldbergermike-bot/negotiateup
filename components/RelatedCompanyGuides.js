import Link from 'next/link';
import { BIG_TECH_COMPANIES, POPULAR_COMPANIES } from '../lib/crosslinks';

/**
 * Server Component — shows company salary guide links on blog pages.
 * Two modes:
 *   - Big tech blog: detailed cards with featured roles for 5 FAANG companies
 *   - All other blogs: simple grid of 8 popular company links
 *
 * All data is hardcoded — zero file reads, zero API calls.
 */
export default function RelatedCompanyGuides({ variant = 'general' }) {
  if (variant === 'big-tech') {
    return <BigTechGuides />;
  }
  return <GeneralGuides />;
}

function BigTechGuides() {
  return (
    <div className="my-10 border border-border rounded-2xl p-8 bg-paper">
      <h3 className="font-serif text-xl mb-2 text-ink">Salary Guides by Company</h3>
      <p className="text-sm text-muted mb-6">
        Detailed compensation data, negotiation scripts, and strategies for every role.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BIG_TECH_COMPANIES.map(company => (
          <div
            key={company.slug}
            className="bg-white rounded-xl p-5 border border-border"
          >
            <Link
              href={`/companies/${company.slug}`}
              className="font-semibold text-ink hover:text-accent transition-colors"
            >
              {company.name}
            </Link>
            <div className="mt-3 space-y-1.5">
              {company.featuredRoles.map(role => (
                <Link
                  key={role.slug}
                  href={`/companies/${company.slug}/${role.slug}`}
                  className="block text-sm text-muted hover:text-accent transition-colors"
                >
                  → {role.title} Guide
                </Link>
              ))}
            </div>
            <Link
              href={`/companies/${company.slug}`}
              className="block mt-3 text-xs text-accent font-semibold hover:underline"
            >
              All {company.name} roles →
            </Link>
          </div>
        ))}
      </div>
      <Link
        href="/companies"
        className="inline-block mt-6 text-accent text-sm font-semibold hover:underline"
      >
        Browse all 319 companies →
      </Link>
    </div>
  );
}

function GeneralGuides() {
  return (
    <div className="my-10 border border-border rounded-2xl p-8 bg-paper">
      <h3 className="font-serif text-xl mb-2 text-ink">Explore Company Salary Guides</h3>
      <p className="text-sm text-muted mb-6">
        Compensation data and negotiation strategies for 319 companies and 14 roles.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {POPULAR_COMPANIES.map(company => (
          <Link
            key={company.slug}
            href={`/companies/${company.slug}`}
            className="bg-white rounded-xl p-4 border border-border hover:border-accent/40 hover:shadow-md transition-all text-center"
          >
            <span className="font-semibold text-sm text-ink">{company.name}</span>
            <span className="block text-xs text-accent mt-1">View guides →</span>
          </Link>
        ))}
      </div>
      <Link
        href="/companies"
        className="inline-block mt-6 text-accent text-sm font-semibold hover:underline"
      >
        Browse all 319 companies →
      </Link>
    </div>
  );
}
