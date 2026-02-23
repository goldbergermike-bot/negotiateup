'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function CompaniesDirectory({ companies }) {
  const [search, setSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const industries = useMemo(() => {
    const set = new Set(companies.map(c => c.industry));
    return ['All', ...Array.from(set).sort()];
  }, [companies]);

  const filtered = useMemo(() => {
    return companies.filter(c => {
      const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.includes(search.toLowerCase());
      const matchesIndustry = selectedIndustry === 'All' || c.industry === selectedIndustry;
      return matchesSearch && matchesIndustry;
    });
  }, [companies, search, selectedIndustry]);

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(c => {
      if (!groups[c.industry]) groups[c.industry] = [];
      groups[c.industry].push(c);
    });
    return groups;
  }, [filtered]);

  const industryOrder = ['Technology', 'Finance', 'Consulting', 'Healthcare'];

  return (
    <>
      {/* Search + Filter */}
      <div className="max-w-[500px] mx-auto flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <select
          value={selectedIndustry}
          onChange={e => setSelectedIndustry(e.target.value)}
          className="px-4 py-3 rounded-xl border border-[var(--border)] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          {industries.map(ind => (
            <option key={ind} value={ind}>{ind === 'All' ? 'All Industries' : ind}</option>
          ))}
        </select>
      </div>

      {search && (
        <p className="text-muted text-sm text-center mb-8">{filtered.length} {filtered.length === 1 ? 'company' : 'companies'} found</p>
      )}

      {/* Company Grid by Industry */}
      <div className="max-w-[900px] mx-auto">
        {[...industryOrder, ...Object.keys(grouped).filter(k => !industryOrder.includes(k)).sort()].map(industry => (
          grouped[industry] && (
            <div key={industry} className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-serif text-2xl">{industry}</h2>
                <span className="text-muted text-sm">({grouped[industry].length})</span>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {grouped[industry].map(company => (
                  <Link
                    key={company.slug}
                    href={`/companies/${company.slug}`}
                    className="group bg-white rounded-xl p-5 border border-[var(--border)] hover:-translate-y-1 transition-all hover:shadow-lg"
                  >
                    <h3 className="font-semibold text-sm group-hover:text-accent transition-colors mb-1">{company.name}</h3>
                    <p className="text-muted text-xs">{company.roleCount} role guides</p>
                  </Link>
                ))}
              </div>
            </div>
          )
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted text-lg mb-4">No companies found matching &ldquo;{search}&rdquo;</p>
            <button onClick={() => { setSearch(''); setSelectedIndustry('All'); }} className="text-accent font-semibold hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}
