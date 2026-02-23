import { getAllCompanies, getCompanyBySlug, getAllSlugs } from '../../../lib/companies';
import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import Link from 'next/link';

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params: paramsPromise }) {
  const params = await paramsPromise;
  const company = getCompanyBySlug(params.slug);
  if (!company) return { title: 'Company Not Found — SalaryPrep' };

  return {
    title: `${company.name} Salary Negotiation Guide (2026) — SalaryPrep`,
    description: `How to negotiate your ${company.name} offer. Get specific counter-offer strategies, compensation benchmarks, and word-for-word scripts for ${company.name} salary negotiation.`,
    keywords: [...company.keywords, 'salary negotiation', 'negotiate offer', 'counter offer'],
    openGraph: {
      title: `${company.name} Salary Negotiation — SalaryPrep`,
      description: `Expert strategies to negotiate your ${company.name} compensation. Market data, scripts, and company-specific intel.`,
    },
    alternates: {
      canonical: `https://www.salaryprep.com/companies/${company.slug}`,
    },
  };
}

export default async function CompanyPage({ params: paramsPromise }) {
  const params = await paramsPromise;
  const company = getCompanyBySlug(params.slug);

  if (!company) {
    return (
      <main>
        <Nav />
        <div className="pt-32 pb-24 px-6 text-center">
          <h1 className="font-serif text-3xl mb-4">Company Not Found</h1>
          <p className="text-muted mb-8">We don't have a guide for this company yet.</p>
          <Link href="/companies" className="text-accent font-semibold hover:underline">← Browse all companies</Link>
        </div>
        <Footer />
      </main>
    );
  }

  const allCompanies = getAllCompanies();
  const relatedCompanies = allCompanies
    .filter(c => c.industry === company.industry && c.slug !== company.slug)
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `How to Negotiate Your ${company.name} Salary Offer`,
    description: `Expert salary negotiation strategies for ${company.name}. Compensation benchmarks, counter-offer scripts, and insider tips.`,
    author: { '@type': 'Organization', name: 'SalaryPrep' },
    publisher: { '@type': 'Organization', name: 'SalaryPrep' },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />

      {/* Hero */}
      <section className="pt-28 pb-16 px-6" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[800px] mx-auto text-center">
          <div className="text-5xl mb-4">{company.logo}</div>
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">{company.industry} · Salary Negotiation Guide</p>
          <h1 className="font-serif text-3xl md:text-5xl leading-tight mb-4">
            How to Negotiate Your<br /><span style={{ color: company.color }}>{company.name}</span> Offer
          </h1>
          <p className="text-muted text-lg max-w-[600px] mx-auto mb-8">
            {company.tagline}. Get specific strategies, compensation benchmarks, and word-for-word scripts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/#pricing"
              className="bg-accent text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-accent-glow transition-all hover:-translate-y-0.5 shadow-lg shadow-accent/25"
            >
              Get Your {company.name} Playbook →
            </a>
            <a
              href="/calculator"
              className="border-2 border-current text-ink px-8 py-4 rounded-xl font-semibold text-lg hover:bg-ink hover:text-paper transition-all"
            >
              Free Counter-Offer Calculator
            </a>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 px-6">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl mb-4">About {company.name} Compensation</h2>
          <p className="text-muted text-lg leading-relaxed mb-8">{company.description}</p>

          {/* Average Increase callout */}
          <div className="bg-accent-light rounded-2xl p-8 text-center mb-8">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Average Negotiation Increase</p>
            <p className="font-serif text-4xl text-accent mb-2">{company.avgIncrease}</p>
            <p className="text-muted text-sm">in additional total compensation with a structured negotiation approach</p>
          </div>
        </div>
      </section>

      {/* Compensation Structure */}
      <section className="py-16 px-6 bg-white" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl mb-2">{company.name} Compensation Structure</h2>
          <p className="text-muted mb-8">Understanding how {company.name} structures pay is the first step to a successful negotiation.</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Base Salary', value: company.compStructure.base, icon: '💰' },
              { label: 'Equity / Stock', value: company.compStructure.equity, icon: '📈' },
              { label: 'Annual Bonus', value: company.compStructure.bonus, icon: '🎯' },
              { label: 'Signing Bonus', value: company.compStructure.signing, icon: '✍️' },
              ...(company.compStructure.other ? [{ label: 'Other Benefits', value: company.compStructure.other, icon: '🎁' }] : []),
            ].map((item, i) => (
              <div key={i} className="bg-paper rounded-xl p-5 border border-[var(--border)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-semibold text-sm text-ink">{item.label}</span>
                </div>
                <p className="text-muted text-sm">{item.value}</p>
              </div>
            ))}
          </div>

          {company.levels && (
            <div className="mt-6 bg-paper rounded-xl p-5 border border-[var(--border)]">
              <p className="font-semibold text-sm text-ink mb-1">📊 Levels</p>
              <p className="text-muted text-sm">{company.levels}</p>
            </div>
          )}
        </div>
      </section>

      {/* Negotiation Tips */}
      <section className="py-16 px-6">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl mb-2">{company.name} Negotiation Tips</h2>
          <p className="text-muted mb-8">Insider strategies for maximizing your {company.name} offer.</p>

          <div className="space-y-4">
            {company.negotiationTips.map((tip, i) => (
              <div key={i} className="flex gap-4 items-start bg-white rounded-xl p-5 border border-[var(--border)]">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-accent text-white text-center">
        <div className="max-w-[600px] mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl mb-4">
            Get Your Personalized {company.name} Playbook
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Stop guessing. Get exact counter-offer numbers, word-for-word scripts, and a step-by-step negotiation timeline tailored to your {company.name} offer.
          </p>
          <a
            href="/#pricing"
            className="inline-block bg-white text-accent px-10 py-4 rounded-xl font-bold text-lg hover:-translate-y-0.5 transition-all shadow-lg"
          >
            Get Your Playbook — $39 →
          </a>
          <p className="text-white/60 text-sm mt-4">10-minute delivery · Money-back guarantee · Use code FIRST30 for 30% off</p>
        </div>
      </section>

      {/* Related Companies */}
      {relatedCompanies.length > 0 && (
        <section className="py-16 px-6" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="max-w-[800px] mx-auto">
            <h2 className="font-serif text-2xl mb-6">More {company.industry} Negotiation Guides</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedCompanies.map(c => (
                <Link
                  key={c.slug}
                  href={`/companies/${c.slug}`}
                  className="flex items-center gap-3 bg-white rounded-xl p-4 border border-[var(--border)] hover:-translate-y-0.5 transition-all hover:shadow-md"
                >
                  <span className="text-2xl">{c.logo}</span>
                  <div>
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className="text-muted text-xs">{c.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/companies" className="text-accent font-semibold text-sm hover:underline">
                View all company guides →
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
