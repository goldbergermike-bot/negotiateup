export default function TwoPaths() {
  return (
    <section className="py-24 px-6 max-w-[1000px] mx-auto" id="paths">
      <div className="text-center mb-14">
        <div className="text-xs font-bold tracking-widest uppercase text-warm mb-4">
          Two Playbooks, One Mission
        </div>
        <h2 className="font-serif text-3xl md:text-4xl mb-3">
          Pick your situation. We'll handle the rest.
        </h2>
        <p className="text-muted text-lg">
          Different conversations need different strategies. Tell us which one you're facing.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* New Offer */}
        <div className="bg-white border-2 border-accent rounded-2xl p-6 md:p-10 hover:-translate-y-1 transition-all hover:shadow-xl hover:shadow-accent/10">
          <span className="text-4xl mb-4 block">🤝</span>
          <h3 className="font-serif text-2xl text-accent mb-2">New Job Offer</h3>
          <p className="text-muted mb-6 leading-relaxed">
            You got the offer — now make sure you don't leave money on the table before you sign.
          </p>
          <div className="text-[0.65rem] font-bold tracking-widest uppercase text-muted mb-3">You Upload</div>
          <ul className="space-y-2 mb-6">
            {['Your offer letter (or offer details)', 'Your resume', 'The job listing'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-7 h-7 bg-accent-light rounded-lg flex items-center justify-center text-xs shrink-0">
                  {['📄', '📋', '💼'][i]}
                </div>
                {item}
              </li>
            ))}
          </ul>
          <div className="text-[0.65rem] font-bold tracking-widest uppercase text-muted mb-3">You Get</div>
          <ul className="space-y-1.5">
            {[
              'Market salary benchmarks for the role',
              'Specific counter-offer numbers',
              'Word-for-word scripts for call & email',
              'Company negotiation intelligence',
              'Day-by-day negotiation timeline',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-accent font-bold">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Raise */}
        <div className="bg-white border-2 border-blue rounded-2xl p-6 md:p-10 hover:-translate-y-1 transition-all hover:shadow-xl hover:shadow-blue/10">
          <span className="text-4xl mb-4 block">📈</span>
          <h3 className="font-serif text-2xl text-blue mb-2">Raise at Current Job</h3>
          <p className="text-muted mb-6 leading-relaxed">
            You've earned it — now build the case that makes it impossible to say no.
          </p>
          <div className="text-[0.65rem] font-bold tracking-widest uppercase text-muted mb-3">You Upload</div>
          <ul className="space-y-2 mb-6">
            {['Your resume or current role details', 'Company name & your title', 'Current salary & target'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-7 h-7 bg-blue-light rounded-lg flex items-center justify-center text-xs shrink-0">
                  {['📄', '🏢', '💰'][i]}
                </div>
                {item}
              </li>
            ))}
          </ul>
          <div className="text-[0.65rem] font-bold tracking-widest uppercase text-muted mb-3">You Get</div>
          <ul className="space-y-1.5">
            {[
              'Market comp data proving you\'re underpaid',
              'A persuasive "business case" document',
              'Scripts for the conversation with your manager',
              'Objection handling for every pushback',
              'Timing & approach strategy',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-blue font-bold">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
