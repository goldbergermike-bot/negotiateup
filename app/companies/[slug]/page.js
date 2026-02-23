import { getAllCompanies, getCompanyBySlug, getAllSlugs } from '../../../lib/companies';
import { getResearchCompanySummary, getResearchCompanies, getRoleData } from '../../../lib/research';
import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import Link from 'next/link';

export async function generateStaticParams() {
  // Merge slugs from both handcrafted data and research folders
  const handcraftedSlugs = getAllSlugs();
  const researchSlugs = getResearchCompanies();
  const allSlugs = [...new Set([...handcraftedSlugs, ...researchSlugs])];
  return allSlugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params: paramsPromise }) {
  const params = await paramsPromise;
  const handcrafted = getCompanyBySlug(params.slug);
  const research = getResearchCompanySummary(params.slug);
  const name = handcrafted?.name || research?.name || params.slug;

  if (!handcrafted && !research) return { title: 'Company Not Found — NegotiateUp' };

  return {
    title: `${name} Salary Negotiation Guide (2026) — NegotiateUp`,
    description: `How to negotiate your ${name} offer. ${research ? `${research.roleCount} role-specific guides with` : 'Get'} compensation benchmarks, negotiation scripts, and insider strategies.`,
    keywords: [`${name} salary negotiation`, `${name} offer negotiation`, `${name} compensation`, `${name} negotiation guide`],
    openGraph: {
      title: `${name} Salary Negotiation — NegotiateUp`,
      description: `Expert strategies to negotiate your ${name} compensation. Market data, scripts, and company-specific intel.`,
    },
    alternates: {
      canonical: `https://www.salaryprep.com/companies/${params.slug}`,
    },
  };
}

export default async function CompanyPage({ params: paramsPromise }) {
  const params = await paramsPromise;
  const handcrafted = getCompanyBySlug(params.slug);
  const research = getResearchCompanySummary(params.slug);

  if (!handcrafted && !research) {
    return (
      <main>
        <Nav />
        <div className="pt-32 pb-24 px-6 text-center">
          <h1 className="font-serif text-3xl mb-4">Company Not Found</h1>
          <p className="text-muted mb-8">We don&apos;t have a guide for this company yet.</p>
          <Link href="/companies" className="text-accent font-semibold hover:underline">&larr; Browse all companies</Link>
        </div>
        <Footer />
      </main>
    );
  }

  const companyName = handcrafted?.name || research?.name;
  const industry = handcrafted?.industry || research?.industry || 'Technology';
  const roles = research?.roles || [];

  // Get salary preview from first role with a salary table
  let salaryPreview = null;
  if (roles.length > 0) {
    const previewRole = getRoleData(params.slug, roles[0].slug);
    if (previewRole?.salaryTable?.length > 0) {
      salaryPreview = previewRole.salaryTable[0];
    }
  }

  // Related companies from handcrafted data
  const allCompanies = getAllCompanies();
  const relatedCompanies = allCompanies
    .filter(c => c.industry === industry && c.slug !== params.slug)
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `How to Negotiate Your ${companyName} Salary Offer`,
    description: `Expert salary negotiation strategies for ${companyName}. ${roles.length} role-specific guides with compensation benchmarks, counter-offer scripts, and insider tips.`,
    author: { '@type': 'Organization', name: 'NegotiateUp' },
    publisher: { '@type': 'Organization', name: 'NegotiateUp' },
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
          {handcrafted?.logo && <div className="text-5xl mb-4">{handcrafted.logo}</div>}
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">{industry} · Salary Negotiation Guide</p>
          <h1 className="font-serif text-3xl md:text-5xl leading-tight mb-4">
            How to Negotiate Your<br /><span style={{ color: handcrafted?.color || 'var(--accent)' }}>{companyName}</span> Offer
          </h1>
          <p className="text-muted text-lg max-w-[600px] mx-auto mb-4">
            {handcrafted?.tagline || `Expert negotiation strategies for ${companyName}`}. {roles.length > 0 && `${roles.length} role-specific guides with compensation data and scripts.`}
          </p>
          {roles.length > 0 && (
            <p className="text-accent font-semibold text-sm mb-8">{roles.length} Role Guides Available</p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/#pricing"
              className="bg-accent text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-accent-glow transition-all hover:-translate-y-0.5 shadow-lg shadow-accent/25"
            >
              Get Your {companyName} Playbook &rarr;
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

      {/* Role Guides Grid */}
      {roles.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-[900px] mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl mb-2">Role-Specific Negotiation Guides</h2>
            <p className="text-muted mb-8">Deep-dive salary data, negotiation scripts, and insider levers for each role at {companyName}.</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {roles.map(role => (
                <Link
                  key={role.slug}
                  href={`/companies/${params.slug}/${role.slug}`}
                  className="group bg-white rounded-xl p-5 border border-[var(--border)] hover:-translate-y-1 transition-all hover:shadow-lg"
                >
                  <h3 className="font-semibold text-sm group-hover:text-accent transition-colors mb-2">{role.name}</h3>
                  <p className="text-muted text-xs mb-3">Salary data, negotiation levers &amp; scripts</p>
                  <span className="text-accent text-xs font-semibold group-hover:translate-x-0.5 transition-transform inline-block">View guide &rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Handcrafted Overview (if available) */}
      {handcrafted && (
        <>
          <section className="py-16 px-6" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="max-w-[800px] mx-auto">
              <h2 className="font-serif text-2xl md:text-3xl mb-4">About {companyName} Compensation</h2>
              <p className="text-muted text-lg leading-relaxed mb-8">{handcrafted.description}</p>

              <div className="bg-accent-light rounded-2xl p-8 text-center mb-8">
                <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Average Negotiation Increase</p>
                <p className="font-serif text-4xl text-accent mb-2">{handcrafted.avgIncrease}</p>
                <p className="text-muted text-sm">in additional total compensation with a structured negotiation approach</p>
              </div>
            </div>
          </section>

          <section className="py-16 px-6 bg-white" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <div className="max-w-[800px] mx-auto">
              <h2 className="font-serif text-2xl md:text-3xl mb-2">{companyName} Compensation Structure</h2>
              <p className="text-muted mb-8">Understanding how {companyName} structures pay is the first step to a successful negotiation.</p>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Base Salary', value: handcrafted.compStructure.base, icon: '💰' },
                  { label: 'Equity / Stock', value: handcrafted.compStructure.equity, icon: '📈' },
                  { label: 'Annual Bonus', value: handcrafted.compStructure.bonus, icon: '🎯' },
                  { label: 'Signing Bonus', value: handcrafted.compStructure.signing, icon: '✍️' },
                  ...(handcrafted.compStructure.other ? [{ label: 'Other Benefits', value: handcrafted.compStructure.other, icon: '🎁' }] : []),
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

              {handcrafted.levels && (
                <div className="mt-6 bg-paper rounded-xl p-5 border border-[var(--border)]">
                  <p className="font-semibold text-sm text-ink mb-1">Levels</p>
                  <p className="text-muted text-sm">{handcrafted.levels}</p>
                </div>
              )}
            </div>
          </section>

          <section className="py-16 px-6">
            <div className="max-w-[800px] mx-auto">
              <h2 className="font-serif text-2xl md:text-3xl mb-2">{companyName} Negotiation Tips</h2>
              <p className="text-muted mb-8">Insider strategies for maximizing your {companyName} offer.</p>

              <div className="space-y-4">
                {handcrafted.negotiationTips.map((tip, i) => (
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
        </>
      )}

      {/* CTA Section */}
      <section className="py-20 px-6 bg-accent text-white text-center">
        <div className="max-w-[600px] mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl mb-4">
            Get Your Personalized {companyName} Playbook
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Stop guessing. Get exact counter-offer numbers, word-for-word scripts, and a step-by-step negotiation timeline tailored to your {companyName} offer.
          </p>
          <a
            href="/#pricing"
            className="inline-block bg-white text-accent px-10 py-4 rounded-xl font-bold text-lg hover:-translate-y-0.5 transition-all shadow-lg"
          >
            Get Your Playbook &rarr;
          </a>
          <p className="text-white/60 text-sm mt-4">10-minute delivery &middot; Money-back guarantee</p>
        </div>
      </section>

      {/* Related Companies */}
      {relatedCompanies.length > 0 && (
        <section className="py-16 px-6" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="max-w-[800px] mx-auto">
            <h2 className="font-serif text-2xl mb-6">More {industry} Negotiation Guides</h2>
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
                View all company guides &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
