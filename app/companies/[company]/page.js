import { notFound } from 'next/navigation';
import Link from 'next/link';
import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import {
  getAllCompanies,
  getRolesForCompany,
  getResearchContent,
  extractMetadata,
} from '../../../lib/research';

// Static generation: pre-build all 319 company pages at build time
export async function generateStaticParams() {
  return getAllCompanies().map(company => ({ company }));
}

// Metadata: derived from the company's first markdown file
export async function generateMetadata({ params }) {
  const { company } = params;
  const roles = getRolesForCompany(company);
  if (roles.length === 0) return {};

  const firstContent = getResearchContent(company, roles[0]);
  const { companyName } = extractMetadata(firstContent);

  const title = `${companyName} Salary Negotiation Guides — All Roles | SalaryPrep`;
  const description = `Salary negotiation guides for ${roles.length} roles at ${companyName}. Compensation data, negotiation scripts, and strategy for your ${companyName} offer.`;
  const url = `https://www.salaryprep.com/companies/${company}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'SalaryPrep',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function CompanyPage({ params }) {
  const { company } = params;
  const roles = getRolesForCompany(company);
  if (roles.length === 0) notFound();

  // Read metadata from each role file to get real titles and DNA summaries
  const roleData = roles.map(role => {
    const content = getResearchContent(company, role);
    const { roleTitle, companyName, negotiationDna } = extractMetadata(content);
    return { slug: role, roleTitle, companyName, negotiationDna };
  });

  const companyName = roleData[0]?.companyName || company;

  return (
    <main>
      <Nav />
      <div className="pt-32 pb-20 px-6 max-w-[800px] mx-auto">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-6 flex items-center gap-2 text-muted">
          <Link href="/companies" className="text-accent font-medium hover:underline">
            Companies
          </Link>
          <span>/</span>
          <span className="text-ink">{companyName}</span>
        </nav>

        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-3 py-1 rounded-full">
            {roleData.length} Negotiation Guides
          </span>
          <h1 className="font-serif text-4xl md:text-5xl mt-4 mb-4">
            {companyName}
          </h1>
          <p className="text-muted text-lg max-w-[550px] mx-auto">
            Salary data, negotiation scripts, and strategy for {roleData.length} roles at {companyName}.
          </p>
        </div>

        <div className="space-y-4">
          {roleData.map(({ slug, roleTitle, negotiationDna }) => (
            <Link
              key={slug}
              href={`/companies/${company}/${slug}`}
              className="block bg-white rounded-2xl p-6 border border-border hover:-translate-y-1 transition-all hover:shadow-lg"
            >
              <h2 className="font-serif text-lg md:text-xl mb-2 text-ink">{roleTitle}</h2>
              <p className="text-muted text-sm leading-relaxed line-clamp-2">
                {negotiationDna}
              </p>
              <span className="inline-block mt-3 text-accent text-sm font-semibold">
                View guide →
              </span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 bg-ink rounded-2xl p-10 text-center">
          <h2 className="font-serif text-2xl text-white mb-3">
            Negotiating with {companyName}?
          </h2>
          <p className="text-white/60 mb-6 text-sm">
            Get a personalized playbook with your exact counter-offer numbers and word-for-word scripts.
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
