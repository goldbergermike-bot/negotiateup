'use client';

import { useState } from 'react';
import Nav from '../../components/Nav';

function estimateCounter(data) {
  const offered = parseInt(data.offered) || 0;
  if (!offered) return null;

  // Base counter percentage based on scenario
  let counterPct = 0.15; // default 15% above offer

  // Adjust by experience
  const exp = data.experience;
  if (exp === '6-10 years' || exp === '11-15 years') counterPct += 0.03;
  if (exp === '15+ years') counterPct += 0.05;

  // Adjust by leverage
  if (data.competing === 'yes') counterPct += 0.05;
  if (data.currently_employed === 'yes') counterPct += 0.03;

  // Adjust by company size (bigger companies have more room)
  if (data.company_size === 'Large (1,001-10,000)' || data.company_size === 'Enterprise (10,000+)') counterPct += 0.03;

  // Cap at reasonable range
  counterPct = Math.min(counterPct, 0.30);

  const counter = Math.round(offered * (1 + counterPct));
  const aggressive = Math.round(offered * (1 + counterPct + 0.05));
  const conservative = Math.round(offered * (1 + counterPct * 0.6));
  const walkAway = Math.round(offered * 0.97); // slightly below offer as floor

  return {
    offered,
    counter,
    aggressive,
    conservative,
    walkAway,
    pctIncrease: Math.round(counterPct * 100),
    potentialGain: counter - offered,
    lifetimeGain: (counter - offered) * 10, // rough 10-year compound
  };
}

function formatSalary(n) {
  return '$' + n.toLocaleString();
}

export default function CalculatorPage() {
  const [data, setData] = useState({
    offered: '',
    title: '',
    experience: '',
    company_size: '',
    competing: '',
    currently_employed: '',
  });
  const [showResults, setShowResults] = useState(false);

  const update = (key, val) => setData({ ...data, [key]: val });

  const result = estimateCounter(data);
  const canSubmit = data.offered && data.experience && data.competing && data.currently_employed;

  if (showResults && result) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-paper pt-28 pb-20 px-6">
          <div className="max-w-[640px] mx-auto">
            {/* Result Card */}
            <div className="bg-white rounded-3xl border-2 border-accent/30 p-8 md:p-12 text-center mb-8">
              <div className="text-5xl mb-4">🎯</div>
              <h1 className="font-serif text-3xl md:text-4xl mb-2">Your Recommended Counter-Offer</h1>
              <p className="text-muted mb-8">Based on your offer of {formatSalary(result.offered)}</p>

              {/* Main Number */}
              <div className="bg-accent-light rounded-2xl p-8 mb-8">
                <p className="text-xs text-accent uppercase tracking-wider font-semibold mb-1">Counter at</p>
                <p className="font-serif text-6xl text-accent mb-1">{formatSalary(result.counter)}</p>
                <p className="text-accent font-semibold">+{result.pctIncrease}% above offer</p>
              </div>

              {/* Range */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-paper rounded-xl p-4">
                  <p className="text-xs text-muted mb-1">Conservative</p>
                  <p className="font-serif text-lg text-ink">{formatSalary(result.conservative)}</p>
                  <p className="text-xs text-muted">Safe ask</p>
                </div>
                <div className="bg-accent-light rounded-xl p-4 border border-accent/20">
                  <p className="text-xs text-accent mb-1 font-semibold">Recommended</p>
                  <p className="font-serif text-lg text-accent">{formatSalary(result.counter)}</p>
                  <p className="text-xs text-accent">Best balance</p>
                </div>
                <div className="bg-paper rounded-xl p-4">
                  <p className="text-xs text-muted mb-1">Aggressive</p>
                  <p className="font-serif text-lg text-ink">{formatSalary(result.aggressive)}</p>
                  <p className="text-xs text-muted">Stretch ask</p>
                </div>
              </div>

              {/* Impact */}
              <div className="bg-paper rounded-2xl p-6 mb-8 text-left">
                <h3 className="font-semibold text-center mb-4">Impact of Negotiating</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted">Immediate Gain</p>
                    <p className="font-serif text-2xl text-accent">+{formatSalary(result.potentialGain)}<span className="text-sm text-muted">/yr</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">10-Year Impact (with raises)</p>
                    <p className="font-serif text-2xl text-accent">+{formatSalary(result.lifetimeGain)}</p>
                  </div>
                </div>
                <p className="text-xs text-muted mt-3 text-center">A higher base compounds every year through raises, bonuses, and 401k matches.</p>
              </div>

              {/* What you DON'T get (upsell) */}
              <div className="bg-white border-2 border-accent rounded-2xl p-6 mb-6 text-left">
                <h3 className="font-serif text-xl text-center mb-4">You have the number. Now you need the plan.</h3>
                <p className="text-muted text-sm text-center mb-4">The counter-offer number is just the start. Here's what you need to actually land it:</p>
                <div className="space-y-3">
                  {[
                    'Word-for-word scripts for the phone call',
                    'Email templates for the written counter',
                    'Objection handling ("This is our best offer")',
                    'Day-by-day negotiation timeline',
                    'Company-specific negotiation intel',
                    'What to negotiate beyond base salary',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm">
                      <span className="text-accent">✓</span>
                      <span className="text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="/#pricing"
                  className="block w-full bg-accent text-white py-4 rounded-xl font-semibold text-center mt-6 hover:bg-accent-glow transition-all hover:-translate-y-0.5 shadow-lg shadow-accent/25"
                >
                  Get My Full Playbook → $39 (30% off with FIRST30)
                </a>
                <p className="text-xs text-muted text-center mt-2">🔒 Money-back guarantee · Delivered in 10 minutes</p>
              </div>

              {/* Restart */}
              <button
                onClick={() => { setShowResults(false); setData({ offered: '', title: '', experience: '', company_size: '', competing: '', currently_employed: '' }); }}
                className="text-sm text-muted hover:text-ink transition-colors"
              >
                ← Calculate a different offer
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-paper pt-28 pb-20 px-6">
        <div className="max-w-[580px] mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-accent-light text-accent font-semibold text-xs px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">
              Free Tool
            </div>
            <h1 className="font-serif text-3xl md:text-4xl mb-3">Salary Counter-Offer Calculator</h1>
            <p className="text-muted text-lg">Enter your offer details and we'll tell you exactly what to counter at.</p>
          </div>

          <div className="bg-white rounded-3xl border border-border p-8 md:p-10">
            {/* Offered Salary */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Offered base salary (USD) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                <input
                  type="number"
                  value={data.offered}
                  onChange={(e) => update('offered', e.target.value)}
                  placeholder="e.g. 120000"
                  className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-border text-base focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
              </div>
            </div>

            {/* Job Title */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Job title (optional)</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="e.g. Software Engineer"
                className="w-full px-4 py-3.5 rounded-xl border border-border text-base focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>

            {/* Experience */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Years of experience *</label>
              <div className="grid grid-cols-3 gap-2">
                {['0-2 years', '3-5 years', '6-10 years', '11-15 years', '15+ years'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => update('experience', opt)}
                    className={`py-2.5 px-3 rounded-lg border text-sm transition-all ${
                      data.experience === opt ? 'border-accent bg-accent-light text-accent font-semibold' : 'border-border hover:border-accent/50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Company Size */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Company size (optional)</label>
              <select
                value={data.company_size}
                onChange={(e) => update('company_size', e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-border text-base focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white"
              >
                <option value="">Select...</option>
                <option>Startup (1-50)</option>
                <option>Small (51-200)</option>
                <option>Mid-size (201-1,000)</option>
                <option>Large (1,001-10,000)</option>
                <option>Enterprise (10,000+)</option>
              </select>
            </div>

            {/* Competing Offer */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Do you have a competing offer? *</label>
              <div className="flex gap-3">
                {['yes', 'no'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => update('competing', opt)}
                    className={`flex-1 py-3 rounded-xl border text-sm capitalize transition-all ${
                      data.competing === opt ? 'border-accent bg-accent-light text-accent font-semibold' : 'border-border hover:border-accent/50'
                    }`}
                  >
                    {opt === 'yes' ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
            </div>

            {/* Currently Employed */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-2">Are you currently employed? *</label>
              <div className="flex gap-3">
                {['yes', 'no'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => update('currently_employed', opt)}
                    className={`flex-1 py-3 rounded-xl border text-sm capitalize transition-all ${
                      data.currently_employed === opt ? 'border-accent bg-accent-light text-accent font-semibold' : 'border-border hover:border-accent/50'
                    }`}
                  >
                    {opt === 'yes' ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => canSubmit && setShowResults(true)}
              disabled={!canSubmit}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                canSubmit
                  ? 'bg-accent text-white hover:bg-accent-glow hover:-translate-y-0.5 shadow-lg shadow-accent/25'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Calculate My Counter-Offer →
            </button>
            <p className="text-xs text-muted text-center mt-3">🔒 Your data is never stored or shared. Free to use.</p>
          </div>
        </div>
      </div>
    </>
  );
}
