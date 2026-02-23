'use client';

import { useState } from 'react';

export default function WhatYouGet() {
  const [tab, setTab] = useState('offer');

  const offerItems = [
    { icon: '📊', title: 'Verified Salary Benchmarks', desc: 'Compensation ranges from our database of 300+ companies — real figures for your role, level, and location, not AI guesses.' },
    { icon: '🎯', title: 'Your Leverage Analysis', desc: 'We read your resume and identify your strongest negotiating cards — rare skills, competing offers, and key experience.' },
    { icon: '💬', title: 'Counter-Offer Scripts', desc: 'Word-for-word scripts for the phone call, email templates for the written counter, and responses to every recruiter pushback.' },
    { icon: '🔢', title: 'Counter-Offer Numbers', desc: 'Specific targets for base salary, equity, bonus, and signing bonus — with a "stretch" ask and a "walk away" floor.' },
    { icon: '🏢', title: 'Company Intelligence', desc: 'Verified data on how this company negotiates — their comp structure, vesting schedules, level mappings, and which levers actually move.' },
    { icon: '🗺️', title: 'Negotiation Timeline', desc: 'A day-by-day plan from first response to final signature — when to reply, what to say at each stage, and how to close.' },
  ];

  const raiseItems = [
    { icon: '📊', title: 'Verified Comp Report', desc: 'Compensation ranges from our 300+ company database showing exactly what people in your role are earning — the proof your manager needs.' },
    { icon: '📝', title: 'Your Business Case Document', desc: 'A polished one-pager summarizing your contributions, market data, and specific ask — ready to share with your manager or HR.' },
    { icon: '💬', title: 'Conversation Scripts', desc: 'Exactly how to open the conversation, present your case, and handle responses like "the budget is tight" or "let\'s revisit next quarter."' },
    { icon: '🛡️', title: 'Objection Handling Guide', desc: 'Prepared responses for every common pushback — budget constraints, timing issues, "you just got promoted," and more.' },
    { icon: '📅', title: 'Timing & Approach Strategy', desc: 'When to ask (relative to review cycles, company earnings, project milestones) and whether to go to your manager, skip-level, or HR.' },
    { icon: '🔄', title: 'Plan B: If They Say No', desc: 'Alternative wins to negotiate (title, remote days, equity, bonus) and a timeline for re-asking — so a "no" still moves you forward.' },
  ];

  const items = tab === 'offer' ? offerItems : raiseItems;

  return (
    <section className="py-24 px-6 bg-white" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-[1000px] mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-center mb-3">What's Inside Your Playbook</h2>
        <p className="text-center text-muted text-lg mb-12">Every playbook is customized. Here's what each version includes.</p>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-12">
          <div className="flex gap-0 bg-paper rounded-xl p-1 border border-border max-w-[420px] w-full">
            <button
              onClick={() => setTab('offer')}
              className={`flex-1 py-3 px-5 rounded-lg text-sm font-semibold transition-all ${
                tab === 'offer'
                  ? 'bg-accent text-white shadow-md shadow-accent/20'
                  : 'text-muted hover:text-ink'
              }`}
            >
              🤝 New Job Offer
            </button>
            <button
              onClick={() => setTab('raise')}
              className={`flex-1 py-3 px-5 rounded-lg text-sm font-semibold transition-all ${
                tab === 'raise'
                  ? 'bg-blue text-white shadow-md shadow-blue/20'
                  : 'text-muted hover:text-ink'
              }`}
            >
              📈 Raise Request
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {items.map((item, i) => (
            <div
              key={`${tab}-${i}`}
              className={`bg-paper rounded-2xl p-8 transition-all hover:-translate-y-1 border border-border ${
                tab === 'offer' ? 'hover:border-accent hover:shadow-lg hover:shadow-accent/5' : 'hover:border-blue hover:shadow-lg hover:shadow-blue/5'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 ${
                tab === 'offer' ? 'bg-accent-light' : 'bg-blue-light'
              }`}>
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
