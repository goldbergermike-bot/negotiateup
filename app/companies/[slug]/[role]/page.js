import { getAllCompanyRolePairs, getRoleData, getCompanyRoles, getResearchCompanySummary } from '../../../../lib/research';
import Nav from '../../../../components/Nav';
import Footer from '../../../../components/Footer';
import Link from 'next/link';

export async function generateStaticParams() {
  return getAllCompanyRolePairs().map(({ company, role }) => ({
    slug: company,
    role,
  }));
}

export async function generateMetadata({ params: paramsPromise }) {
  const params = await paramsPromise;
  const data = getRoleData(params.slug, params.role);
  if (!data) return { title: 'Role Not Found — NegotiateUp' };

  const company = getResearchCompanySummary(params.slug);
  const companyName = company?.name || params.slug;

  return {
    title: `${data.roleName} at ${companyName} — 2026 Salary Negotiation Guide | NegotiateUp`,
    description: `How to negotiate your ${data.roleName} offer at ${companyName}. Compensation data, negotiation scripts, and insider strategies for 2026.`,
    keywords: [
      `${companyName} ${data.roleName} salary`,
      `${companyName} negotiation`,
      `${data.roleName} compensation`,
      `${companyName} offer negotiation`,
    ],
    openGraph: {
      title: `${data.roleName} at ${companyName} — Salary Negotiation Guide`,
      description: `Expert strategies to negotiate your ${data.roleName} offer at ${companyName}. Market data, scripts, and company-specific intel.`,
    },
    alternates: {
      canonical: `https://www.salaryprep.com/companies/${params.slug}/${params.role}`,
    },
  };
}

export default async function RolePage({ params: paramsPromise }) {
  const params = await paramsPromise;
  const data = getRoleData(params.slug, params.role);

  if (!data) {
    return (
      <main>
        <Nav />
        <div className="pt-32 pb-24 px-6 text-center">
          <h1 className="font-serif text-3xl mb-4">Role Not Found</h1>
          <p className="text-muted mb-8">We don&apos;t have a guide for this role yet.</p>
          <Link href="/companies" className="text-accent font-semibold hover:underline">&larr; Browse all companies</Link>
        </div>
        <Footer />
      </main>
    );
  }

  const company = getResearchCompanySummary(params.slug);
  const companyName = company?.name || params.slug;
  const otherRoles = (company?.roles || []).filter(r => r.slug !== params.role).slice(0, 6);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${data.roleName} at ${companyName} — 2026 Salary Negotiation Guide`,
    description: `Expert salary negotiation strategies for ${data.roleName} at ${companyName}.`,
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

      {/* Breadcrumb */}
      <div className="pt-24 px-6">
        <div className="max-w-[800px] mx-auto">
          <nav className="flex items-center gap-2 text-sm text-muted">
            <Link href="/companies" className="hover:text-accent">Companies</Link>
            <span>/</span>
            <Link href={`/companies/${params.slug}`} className="hover:text-accent">{companyName}</Link>
            <span>/</span>
            <span className="text-ink">{data.roleName}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-6 pb-12 px-6" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[800px] mx-auto">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">{companyName} · Negotiation Guide</p>
          <h1 className="font-serif text-3xl md:text-4xl leading-tight mb-4">
            {data.roleName}
          </h1>
          {data.dnaSummary && (
            <p className="text-muted text-base leading-relaxed mb-6">{data.dnaSummary}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/#pricing"
              className="bg-accent text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-accent-glow transition-all hover:-translate-y-0.5 shadow-lg shadow-accent/25 text-center"
            >
              Get Your Personalized Playbook &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Salary Table */}
      {data.salaryTable.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-[800px] mx-auto">
            <h2 className="font-serif text-2xl mb-6">Compensation by Region</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-[var(--border)]">
                    <th className="text-left py-3 pr-4 font-semibold">Region</th>
                    <th className="text-left py-3 pr-4 font-semibold">Base Salary</th>
                    <th className="text-left py-3 pr-4 font-semibold">Stock (RSU/4yr)</th>
                    <th className="text-left py-3 pr-4 font-semibold">Bonus</th>
                    {data.salaryTable[0]?.totalComp && (
                      <th className="text-left py-3 font-semibold">Total Comp</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.salaryTable.map((row, i) => (
                    <tr key={i} className="border-b border-[var(--border)]">
                      <td className="py-3 pr-4 font-medium">{row.region}</td>
                      <td className="py-3 pr-4 text-muted">{row.base}</td>
                      <td className="py-3 pr-4 text-muted">{row.stock}</td>
                      <td className="py-3 pr-4 text-muted">{row.bonus}</td>
                      {row.totalComp && (
                        <td className="py-3 font-semibold text-accent">{row.totalComp}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Negotiation DNA */}
      {data.dnaBody && (
        <section className="py-12 px-6 bg-white" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-[800px] mx-auto">
            <h2 className="font-serif text-2xl mb-4">Negotiation Intelligence</h2>
            <div className="text-muted leading-relaxed space-y-4">
              {data.dnaBody.split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {data.levelMapping && (
              <div className="mt-6 bg-paper rounded-xl p-5 border border-[var(--border)]">
                <p className="font-semibold text-sm text-ink mb-1">Level Mapping</p>
                <p className="text-muted text-sm">{data.levelMapping}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Negotiation Levers */}
      {data.levers.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-[800px] mx-auto">
            <h2 className="font-serif text-2xl mb-2">Negotiation Levers</h2>
            <p className="text-muted mb-6">Use these specific talking points when negotiating your offer.</p>
            <div className="space-y-4">
              {data.levers.map((lever, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-[var(--border)]">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-sm mb-2">{lever.name}</p>
                      <p className="text-sm text-muted leading-relaxed italic">&ldquo;{lever.script}&rdquo;</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Strategy */}
      {data.strategy && (
        <section className="py-12 px-6 bg-white" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-[800px] mx-auto">
            <h2 className="font-serif text-2xl mb-4">Negotiate Up Strategy</h2>
            <blockquote className="bg-accent-light rounded-2xl p-6 text-sm leading-relaxed italic text-gray-700">
              &ldquo;{data.strategy}&rdquo;
            </blockquote>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-6 bg-accent text-white text-center">
        <div className="max-w-[600px] mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl mb-4">
            Get Your Personalized {companyName} Playbook
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Stop guessing. Get exact counter-offer numbers, word-for-word scripts, and a step-by-step negotiation timeline tailored to your {companyName} {data.roleName} offer.
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

      {/* Other Roles at Company */}
      {otherRoles.length > 0 && (
        <section className="py-12 px-6" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="max-w-[800px] mx-auto">
            <h2 className="font-serif text-2xl mb-6">More {companyName} Guides</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {otherRoles.map(r => (
                <Link
                  key={r.slug}
                  href={`/companies/${params.slug}/${r.slug}`}
                  className="flex items-center gap-3 bg-white rounded-xl p-4 border border-[var(--border)] hover:-translate-y-0.5 transition-all hover:shadow-md"
                >
                  <span className="text-accent font-bold text-lg">&rarr;</span>
                  <span className="font-semibold text-sm">{r.name}</span>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href={`/companies/${params.slug}`} className="text-accent font-semibold text-sm hover:underline">
                View all {companyName} roles &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
