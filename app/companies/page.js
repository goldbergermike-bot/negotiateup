'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

export default function CompaniesIndex() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/companies')
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return companies;
    const q = search.toLowerCase();
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    );
  }, [companies, search]);

  return (
    <main>
      <Nav />
      <div className="pt-32 pb-20 px-6 max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">
            Company Salary Data
          </h1>
          <p className="text-muted text-lg max-w-[600px] mx-auto">
            Verified salary data and negotiation guides for {companies.length}+ companies.
            Base salary, stock, bonus, and total comp by role and region.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-[500px] mx-auto mb-12">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-white text-ink text-sm focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
            />
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-20">
            <p className="text-muted">Loading companies...</p>
          </div>
        )}

        {/* No results */}
        {!loading && filtered.length === 0 && search.trim() && (
          <div className="text-center py-20">
            <p className="text-muted text-lg mb-2">
              No companies found for &ldquo;{search}&rdquo;
            </p>
            <p className="text-muted text-sm">
              Try a different search term or{' '}
              <button
                onClick={() => setSearch('')}
                className="text-accent font-semibold hover:underline"
              >
                clear the filter
              </button>
            </p>
          </div>
        )}

        {/* Company grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((company) => (
              <Link
                key={company.id}
                href={`/companies/${company.id}`}
                className="block bg-white rounded-xl p-5 border border-border hover:border-accent/40 hover:-translate-y-0.5 hover:shadow-md transition-all"
              >
                <h2 className="font-serif text-base text-ink mb-1">
                  {company.name}
                </h2>
                <span className="text-accent text-xs font-semibold">
                  View salary data &rarr;
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Results count */}
        {!loading && search.trim() && filtered.length > 0 && (
          <p className="text-center text-muted text-sm mt-6">
            Showing {filtered.length} of {companies.length} companies
          </p>
        )}

        {/* CTA */}
        <div className="mt-16 bg-ink rounded-2xl p-10 text-center">
          <h2 className="font-serif text-2xl text-white mb-3">
            Get your personalized negotiation playbook
          </h2>
          <p className="text-white/60 mb-6 max-w-[500px] mx-auto">
            Company-specific salary data is just the starting point. Get exact
            counter-offer scripts and a day-by-day negotiation plan.
          </p>
          <a
            href="/#pricing"
            className="inline-block bg-white text-ink px-8 py-3 rounded-xl font-semibold hover:-translate-y-0.5 transition-all"
          >
            Get My Playbook &mdash; $39 &rarr;
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
