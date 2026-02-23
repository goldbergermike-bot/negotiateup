'use client';

import { useState, useEffect } from 'react';

export default function PaywallGate({ slug, role, companyName, roleName, teaser }) {
  const [hasAccess, setHasAccess] = useState(false);
  const [data, setData] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAndFetch() {
      try {
        const res = await fetch('/api/check-access');
        const { hasAccess: access } = await res.json();
        setHasAccess(access);

        if (access) {
          const contentRes = await fetch(`/api/research-content?slug=${slug}&role=${role}`);
          if (contentRes.ok) {
            setData(await contentRes.json());
          }
        }
      } catch {
        // Access check failed — show paywall
      } finally {
        setChecking(false);
      }
    }
    checkAndFetch();
  }, [slug, role]);

  if (checking) {
    return (
      <div className="py-12 px-6 text-center">
        <div className="max-w-[800px] mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-64"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // User has paid — show full content
  if (hasAccess && data) {
    return <UnlockedContent data={data} />;
  }

  // User has NOT paid — show blurred teaser + paywall CTA
  return <LockedContent teaser={teaser} companyName={companyName} roleName={roleName} />;
}

function UnlockedContent({ data }) {
  return (
    <>
      {/* Salary Table */}
      {data.salaryTable?.length > 0 && (
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
      {data.levers?.length > 0 && (
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
    </>
  );
}

function LockedContent({ teaser, companyName, roleName }) {
  return (
    <div className="relative">
      {/* Blurred preview of what's behind the paywall */}
      <div className="paywall-blur select-none" aria-hidden="true">
        {/* Fake salary table */}
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
                    <th className="text-left py-3 font-semibold">Total Comp</th>
                  </tr>
                </thead>
                <tbody>
                  {['Bay Area / SF', 'New York / NYC', 'Seattle / WA', 'Austin / TX', 'London / UK'].map((region, i) => (
                    <tr key={i} className="border-b border-[var(--border)]">
                      <td className="py-3 pr-4 font-medium">{region}</td>
                      <td className="py-3 pr-4 text-muted">$XXX,XXX–$XXX,XXX</td>
                      <td className="py-3 pr-4 text-muted">$XXX,XXX–$XXX,XXX</td>
                      <td className="py-3 pr-4 text-muted">XX–XX%</td>
                      <td className="py-3 font-semibold text-accent">$XXX,XXX–$XXX,XXX</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Fake negotiation intel */}
        <section className="py-12 px-6 bg-white" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="max-w-[800px] mx-auto">
            <h2 className="font-serif text-2xl mb-4">Negotiation Intelligence</h2>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-11/12"></div>
              <div className="h-4 bg-gray-200 rounded w-10/12"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-9/12"></div>
            </div>
          </div>
        </section>

        {/* Fake levers */}
        <section className="py-12 px-6">
          <div className="max-w-[800px] mx-auto">
            <h2 className="font-serif text-2xl mb-6">Negotiation Levers</h2>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl p-5 border border-[var(--border)]">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">{i}</span>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-10/12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Paywall overlay */}
      <div className="paywall-overlay">
        <div className="max-w-[500px] mx-auto text-center px-6">
          <div className="bg-white rounded-2xl p-10 border-2 border-accent shadow-2xl shadow-accent/10">
            <div className="w-14 h-14 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl mb-2">Unlock Full {companyName} Data</h3>
            <p className="text-muted text-sm mb-6">
              Get salary ranges, negotiation scripts, insider levers, and strategy for the {roleName} role at {companyName} — plus all 4,400+ guides in our database.
            </p>
            <p className="text-xs text-muted mb-2">Included free with any playbook purchase</p>
            <a
              href="/#pricing"
              className="block w-full bg-accent text-white py-4 rounded-xl font-semibold text-lg hover:bg-accent-glow transition-all hover:-translate-y-0.5 shadow-lg shadow-accent/25"
            >
              Get Your Playbook — $39 &rarr;
            </a>
            <p className="text-muted text-xs mt-3">One-time payment · Full database access · Money-back guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
}
