// User results / social proof section.
// Shows real-world negotiation outcomes to build trust and demonstrate value.

export default function UserResults() {
  const results = [
    {
      initials: 'MK',
      name: 'Maria K.',
      role: 'Product Manager → Senior PM',
      company: 'Series B Startup',
      quote: 'The playbook gave me exact numbers to counter with. I went from $145K to $168K — a $23K increase I never would have asked for on my own.',
      gain: '+$23,000',
      color: 'bg-accent',
    },
    {
      initials: 'JT',
      name: 'James T.',
      role: 'Software Engineer',
      company: 'Large Tech Company',
      quote: 'I was about to accept the first offer. The scripts for handling "this is our best offer" literally saved me $15K in base plus an extra $20K in RSUs.',
      gain: '+$35,000 TC',
      color: 'bg-blue',
    },
    {
      initials: 'SP',
      name: 'Sana P.',
      role: 'Data Scientist',
      company: 'Fortune 500',
      quote: 'Used the raise playbook after being told "no budget." Got a $12K raise plus a title bump to Senior within 3 weeks. The objection handling scripts were worth 10x the price.',
      gain: '+$12,000',
      color: 'bg-warm',
    },
  ];

  return (
    <section className="py-24 px-6 bg-white" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl mb-3">Real Results From Real Negotiations</h2>
          <p className="text-muted text-lg">Here's what SalaryPrep users have achieved with their personalized playbooks.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {results.map((r) => (
            <div key={r.initials} className="bg-paper rounded-2xl p-6 border border-border flex flex-col">
              {/* Avatar + info */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${r.color} flex items-center justify-center text-white text-sm font-bold`}>
                  {r.initials}
                </div>
                <div>
                  <p className="font-semibold text-sm text-ink">{r.name}</p>
                  <p className="text-xs text-muted">{r.role}</p>
                </div>
              </div>

              {/* Quote */}
              <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-4">
                "{r.quote}"
              </p>

              {/* Outcome badge */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <span className="text-xs text-muted">{r.company}</span>
                <span className="text-accent font-bold text-sm">{r.gain}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-muted text-xs mt-8">
          Results vary by individual situation. Names abbreviated for privacy.
        </p>
      </div>
    </section>
  );
}
