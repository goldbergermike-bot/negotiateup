import { getAllCompanies } from '../../lib/companies';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Salary Negotiation Guides by Company — SalaryPrep',
  description: 'Company-specific salary negotiation guides with compensation benchmarks, counter-offer strategies, and insider tips for Google, Amazon, Meta, Goldman Sachs, McKinsey, and more.',
  keywords: ['company salary negotiation', 'tech salary negotiation', 'FAANG negotiation', 'finance salary negotiation', 'consulting salary negotiation'],
  openGraph: {
    title: 'Company Salary Negotiation Guides — SalaryPrep',
    description: 'Expert negotiation guides for 25+ top companies. Compensation data, strategies, and scripts.',
  },
  alternates: {
    canonical: 'https://www.salaryprep.com/companies',
  },
};

export default function CompaniesIndex() {
  const allCompanies = getAllCompanies();

  const industries = {};
  allCompanies.forEach(c => {
    if (!industries[c.industry]) industries[c.industry] = [];
    industries[c.industry].push(c);
  });

  const industryOrder = ['Technology', 'Finance', 'Consulting'];

  return (
    <main>
      <Nav />

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 text-center" style={{ borderBottom: '1px solid var(--border)' }}>
        <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">Company Guides</p>
        <h1 className="font-serif text-3xl md:text-5xl leading-tight mb-4">
          Salary Negotiation Guides<br />by Company
        </h1>
        <p className="text-muted text-lg max-w-[600px] mx-auto">
          Company-specific compensation data, negotiation strategies, and insider tips for {allCompanies.length}+ top employers.
        </p>
      </section>

      {/* Company Grid by Industry */}
      <section className="py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          {industryOrder.map(industry => (
            industries[industry] && (
              <div key={industry} className="mb-14">
                <h2 className="font-serif text-2xl mb-2">{industry}</h2>
                <p className="text-muted text-sm mb-6">
                  {industry === 'Technology' && 'Negotiation guides for top tech companies — from FAANG to high-growth startups.'}
                  {industry === 'Finance' && 'Wall Street negotiation strategies for investment banks and financial firms.'}
                  {industry === 'Consulting' && 'Compensation guides for MBB and Big 4 consulting firms.'}
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {industries[industry].map(company => (
                    <Link
                      key={company.slug}
                      href={`/companies/${company.slug}`}
                      className="group bg-white rounded-xl p-5 border border-[var(--border)] hover:-translate-y-1 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{company.logo}</span>
                        <h3 className="font-semibold text-sm group-hover:text-accent transition-colors">{company.name}</h3>
                      </div>
                      <p className="text-muted text-xs leading-relaxed mb-3">{company.tagline}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-accent font-semibold">Avg. increase: {company.avgIncrease}</span>
                        <span className="text-accent text-xs font-semibold group-hover:translate-x-0.5 transition-transform">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-accent text-white text-center">
        <div className="max-w-[600px] mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl mb-4">Don't See Your Company?</h2>
          <p className="text-white/80 text-lg mb-8">
            Our personalized playbook works for any company. Just enter your offer details and get custom negotiation strategy in under 10 minutes.
          </p>
          <a
            href="/#pricing"
            className="inline-block bg-white text-accent px-10 py-4 rounded-xl font-bold text-lg hover:-translate-y-0.5 transition-all shadow-lg"
          >
            Get Your Playbook — $39 →
          </a>
          <p className="text-white/60 text-sm mt-4">Works for any company · Money-back guarantee</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
