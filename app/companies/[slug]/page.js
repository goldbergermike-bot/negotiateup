import { notFound } from 'next/navigation';
import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import { getCompanyBySlug, getCompanySlugs } from '../../../lib/companies';

export async function generateStaticParams() {
  return getCompanySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const company = getCompanyBySlug(params.slug);
  if (!company) return {};

  return {
    title: `How to Negotiate Salary at ${company.name} (2026 Guide) — NegotiateUp`,
    description: `${company.name} salary negotiation guide. Learn ${company.name}'s compensation philosophy, which levers are flexible, negotiation tips, and get a personalized playbook with scripts.`,
    keywords: [
      `negotiate salary ${company.name}`,
      `${company.name} compensation`,
      `${company.name} offer negotiation`,
      `${company.name} salary`,
      `${company.name} counter offer`,
    ],
    alternates: {
      canonical: `https://www.negotiateup.com/companies/${company.slug}`,
    },
  };
}

function DifficultyBadge({ level }) {
  const colors = {
    easy: 'bg-green-100 text-green-700',
    moderate: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors[level] || colors.moderate}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)} to negotiate
    </span>
  );
}

function CompBar({ label, pct, color }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted w-16 shrink-0">{label}</span>
      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-semibold w-10 text-right">{pct}%</span>
    </div>
  );
}

export default function CompanyPage({ params }) {
  const company = getCompanyBySlug(params.slug);
  if (!company) notFound();

  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <div className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-[780px] mx-auto">
          {/* Breadcrumb */}
          <div className="text-sm text-muted mb-6">
            <Link href="/companies" className="hover:text-ink transition-colors">Companies</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{company.name}</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="font-serif text-3xl md:text-4xl">Negotiating at {company.name}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <span>{company.industry}</span>
              <span className="text-border">|</span>
              <span>{company.size}</span>
              <span className="text-border">|</span>
              <span>{company.headquarters}</span>
            </div>
            <div className="mt-3">
              <DifficultyBadge level={company.negotiationDifficulty} />
            </div>
          </div>

          {/* Comp Philosophy */}
          <div className="bg-white rounded-2xl border border-border p-6 md:p-8 mb-6">
            <h2 className="font-serif text-xl mb-3">Compensation Philosophy</h2>
            <p className="text-muted leading-relaxed">{company.compPhilosophy}</p>
          </div>

          {/* Comp Structure */}
          <div className="bg-white rounded-2xl border border-border p-6 md:p-8 mb-6">
            <h2 className="font-serif text-xl mb-4">Typical Comp Breakdown</h2>
            <div className="space-y-3 mb-4">
              <CompBar label="Base" pct={company.compStructure.basePct} color="bg-accent" />
              <CompBar label="Equity" pct={company.compStructure.equityPct} color="bg-blue" />
              <CompBar label="Bonus" pct={company.compStructure.bonusPct} color="bg-warm" />
            </div>
            <p className="text-sm text-muted">{company.compStructure.notes}</p>
          </div>

          {/* Levers */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl border border-border p-6 md:p-8">
              <h2 className="font-serif text-lg mb-3 text-accent">Flexible Levers</h2>
              <p className="text-xs text-muted mb-3">These are negotiable — push here.</p>
              <ul className="space-y-2">
                {company.flexibleLevers.map((l, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-accent font-bold">+</span> {l}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-border p-6 md:p-8">
              <h2 className="font-serif text-lg mb-3 text-red-600">Rigid Levers</h2>
              <p className="text-xs text-muted mb-3">Harder to move — don't spend leverage here.</p>
              <ul className="space-y-2">
                {company.rigidLevers.length > 0 ? company.rigidLevers.map((l, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-red-500 font-bold">—</span> {l}
                  </li>
                )) : (
                  <li className="text-sm text-muted">Most levers are flexible at this company.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Negotiation Process */}
          <div className="bg-white rounded-2xl border border-border p-6 md:p-8 mb-6">
            <h2 className="font-serif text-xl mb-3">How {company.name} Negotiates</h2>
            <p className="text-muted leading-relaxed">{company.typicalProcess}</p>
          </div>

          {/* Insider Tips */}
          <div className="bg-white rounded-2xl border border-border p-6 md:p-8 mb-6">
            <h2 className="font-serif text-xl mb-4">Negotiation Tips for {company.name}</h2>
            <div className="space-y-4">
              {company.negotiationTips.map((tip, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="bg-accent-light text-accent w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-600 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl border border-border p-6 md:p-8 mb-10">
            <h2 className="font-serif text-xl mb-4">Key Benefits</h2>
            <div className="flex flex-wrap gap-2">
              {company.benefitsHighlights.map((b, i) => (
                <span key={i} className="bg-paper text-sm text-muted px-3 py-1.5 rounded-full border border-border">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-accent/5 border-2 border-accent rounded-2xl p-6 md:p-10 text-center">
            <h2 className="font-serif text-2xl md:text-3xl mb-3">
              Get Your {company.name} Negotiation Playbook
            </h2>
            <p className="text-muted mb-6 max-w-[500px] mx-auto">
              Personalized scripts, counter-offer numbers, and {company.name}-specific strategy. Delivered in under 10 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/#pricing"
                className="bg-accent text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-accent-glow transition-all hover:-translate-y-0.5 shadow-lg shadow-accent/25"
              >
                Get My Playbook — $39
              </a>
            </div>
            <p className="text-xs text-muted mt-3">Use code FIRST30 for 30% off ($27.30)</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
