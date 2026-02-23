import Link from 'next/link';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import {
  getAllCompanies,
  getRolesForCompany,
  getResearchContent,
  extractMetadata,
} from '../../lib/research';

export const metadata = {
  title: 'Company Salary Negotiation Guides — 300+ Companies | SalaryPrep',
  description: 'Browse salary negotiation guides for 300+ companies including Google, Amazon, Meta, Stripe, Apple, and more. Compensation data, scripts, and strategy for every role.',
  keywords: [
    'salary negotiation by company',
    'tech company salary negotiation',
    'FAANG salary negotiation',
    'company compensation guide',
    'negotiate tech offer',
  ],
  openGraph: {
    title: 'Company Salary Negotiation Guides — 300+ Companies',
    description: 'Browse salary negotiation guides for 300+ companies. Compensation data, scripts, and strategy.',
    url: 'https://www.salaryprep.com/companies',
    type: 'website',
    siteName: 'SalaryPrep',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Company Salary Negotiation Guides — 300+ Companies',
    description: 'Browse salary negotiation guides for 300+ companies.',
  },
  alternates: {
    canonical: 'https://www.salaryprep.com/companies',
  },
};

export default function CompaniesIndex() {
  const companies = getAllCompanies();

  // Get the real display name for each company from its first markdown file
  const companyData = companies.map(slug => {
    const roles = getRolesForCompany(slug);
    if (roles.length === 0) return { slug, name: slug, roleCount: 0 };
    const content = getResearchContent(slug, roles[0]);
    const { companyName } = extractMetadata(content);
    return { slug, name: companyName || slug, roleCount: roles.length };
  }).filter(c => c.roleCount > 0);

  // Group alphabetically by first character of display name
  const grouped = {};
  companyData.forEach(c => {
    const letter = c.name.charAt(0).toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(c);
  });

  const letters = Object.keys(grouped).sort();

  return (
    <main>
      <Nav />
      <div className="pt-32 pb-20 px-6 max-w-[900px] mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-3 py-1 rounded-full">
            {companyData.length}+ Companies
          </span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 mb-4">
            Company Negotiation Guides
          </h1>
          <p className="text-muted text-lg max-w-[600px] mx-auto">
            Salary data, negotiation scripts, and strategy for {companyData.length}+ companies and {companyData.length * 14}+ roles.
          </p>
        </div>

        {/* Alphabet jump links */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {letters.map(letter => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold bg-white border border-border hover:border-accent hover:text-accent transition-colors"
            >
              {letter}
            </a>
          ))}
        </div>

        {/* Company listings grouped by letter */}
        {letters.map(letter => (
          <div key={letter} id={`letter-${letter}`} className="mb-10">
            <h2 className="font-serif text-2xl mb-4 text-ink">{letter}</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {grouped[letter].map(({ slug, name, roleCount }) => (
                <Link
                  key={slug}
                  href={`/companies/${slug}`}
                  className="bg-white rounded-xl p-4 border border-border hover:border-accent/40 hover:shadow-md transition-all block"
                >
                  <span className="font-semibold text-ink text-sm">{name}</span>
                  <span className="block text-xs text-muted mt-1">{roleCount} roles</span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="mt-12 bg-ink rounded-2xl p-10 text-center">
          <h2 className="font-serif text-2xl text-white mb-3">
            Don&apos;t see your company?
          </h2>
          <p className="text-white/60 mb-6 text-sm">
            Our personalized playbook covers any company — not just the ones listed here.
          </p>
          <a
            href="/#pricing"
            className="inline-block bg-white text-ink px-8 py-3 rounded-xl font-semibold hover:-translate-y-0.5 transition-all"
          >
            Get My Playbook — $39 →
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
