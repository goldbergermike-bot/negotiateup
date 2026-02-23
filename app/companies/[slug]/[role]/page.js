import { getAllCompanyRolePairs, getRoleData, getCompanyRoles, getResearchCompanySummary } from '../../../../lib/research';
import Nav from '../../../../components/Nav';
import Footer from '../../../../components/Footer';
import PaywallGate from '../../../../components/PaywallGate';
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

      {/* Gated content — salary table, negotiation intel, levers, strategy */}
      <PaywallGate
        slug={params.slug}
        role={params.role}
        companyName={companyName}
        roleName={data.roleName}
      />

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
