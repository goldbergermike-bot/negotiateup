'use client';

import { useState, useMemo } from 'react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { getAllCompanies, getIndustries } from '../../lib/companies';

const companies = getAllCompanies();
const industries = getIndustries();

const difficultyColors = {
  easy: 'bg-green-100 text-green-700',
  moderate: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

export default function CompaniesPage() {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');

  const filtered = useMemo(() => {
    let list = companies;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.headquarters?.toLowerCase().includes(q)
      );
    }
    if (industry) {
      list = list.filter((c) => c.industry === industry);
    }
    return list;
  }, [search, industry]);

  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <div className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-accent-light text-accent font-semibold text-xs px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">
              Company Intelligence
            </div>
            <h1 className="font-serif text-3xl md:text-4xl mb-3">
              Salary Negotiation Guides by Company
            </h1>
            <p className="text-muted text-lg max-w-[600px] mx-auto">
              Research your company's compensation philosophy, negotiation style, and flexible levers before you negotiate.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies..."
              className="flex-1 px-4 py-3.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white"
            />
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="px-4 py-3.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white"
            >
              <option value="">All Industries</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          {/* Count */}
          <p className="text-sm text-muted mb-4">
            {filtered.length} {filtered.length === 1 ? 'company' : 'companies'}
            {search || industry ? ' found' : ' in database'}
          </p>

          {/* Company Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((c) => (
              <Link
                key={c.slug}
                href={`/companies/${c.slug}`}
                className="bg-white rounded-xl border border-border p-5 hover:border-accent/50 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-semibold text-ink group-hover:text-accent transition-colors">{c.name}</h2>
                  <span className={`text-[0.65rem] px-2 py-0.5 rounded-full font-semibold ${difficultyColors[c.negotiationDifficulty] || difficultyColors.moderate}`}>
                    {c.negotiationDifficulty}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted">
                  <span>{c.industry}</span>
                  <span className="text-border">|</span>
                  <span>{c.size}</span>
                  {c.headquarters && (
                    <>
                      <span className="text-border">|</span>
                      <span>{c.headquarters}</span>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted text-lg mb-2">No companies match your search.</p>
              <p className="text-sm text-muted">
                Don't see your company? No worries — our AI still generates great playbooks using market data for any company.
              </p>
              <a
                href="/#pricing"
                className="inline-block mt-6 bg-accent text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-accent-glow transition-all"
              >
                Get My Playbook Anyway →
              </a>
            </div>
          )}

          {/* Bottom CTA */}
          {filtered.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-muted mb-4">Ready to negotiate? Get a personalized playbook with scripts and strategy.</p>
              <a
                href="/#pricing"
                className="inline-block bg-accent text-white px-8 py-3 rounded-xl font-semibold hover:bg-accent-glow transition-all hover:-translate-y-0.5"
              >
                Get My Playbook →
              </a>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
