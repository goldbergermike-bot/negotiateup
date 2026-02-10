'use client';
export default function Pricing() {
  const handleCheckout = async (type) => {
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }), // 'offer' or 'raise'
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <section className="py-24 px-6 bg-white text-center" id="pricing" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <h2 className="font-serif text-3xl md:text-4xl mb-4">Pick Your Playbook</h2>
      <p className="text-muted text-lg mb-12">One-time payment. No subscription. Delivered in under 10 minutes.</p>

      <div className="grid md:grid-cols-2 gap-6 max-w-[820px] mx-auto">
        {/* Offer Card */}
        <div className="bg-paper border-2 border-accent rounded-2xl p-10 relative hover:-translate-y-1 transition-all hover:shadow-xl hover:shadow-accent/10">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent text-white text-[0.7rem] font-bold px-5 py-1.5 rounded-full tracking-wider uppercase whitespace-nowrap">
            New Job Offer
          </div>
          <span className="text-3xl mb-2 block">🤝</span>
          <h3 className="font-serif text-xl text-accent mb-1">Offer Negotiation Playbook</h3>
          <p className="text-muted text-sm mb-4">Counter with confidence. Maximize your starting comp.</p>
          <div className="text-muted text-sm line-through">Career coaches charge $200+/hr</div>
          <div className="font-serif text-5xl text-accent my-2">$39</div>
          <p className="text-muted text-sm mb-6">One-time payment. Your playbook, forever.</p>
          <ul className="text-left space-y-2.5 mb-8">
            {[
              'Market salary benchmarks',
              'Specific counter-offer numbers',
              'Word-for-word call & email scripts',
              'Company negotiation intel',
              'Day-by-day negotiation timeline',
              '10+ page personalized PDF',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600 pb-2.5 border-b border-paper">
                <span className="text-accent font-bold text-lg">✓</span> {item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleCheckout('offer')}
            className="w-full bg-accent text-white py-4 rounded-xl font-semibold text-lg hover:bg-accent-glow transition-all hover:-translate-y-0.5 shadow-lg shadow-accent/25"
          >
            Get Offer Playbook →
          </button>
          <p className="text-muted text-xs mt-3">🔒 Secure checkout · Money-back guarantee</p>
        </div>

        {/* Raise Card */}
        <div className="bg-paper border-2 border-blue rounded-2xl p-10 relative hover:-translate-y-1 transition-all hover:shadow-xl hover:shadow-blue/10">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue text-white text-[0.7rem] font-bold px-5 py-1.5 rounded-full tracking-wider uppercase whitespace-nowrap">
            Current Job Raise
          </div>
          <span className="text-3xl mb-2 block">📈</span>
          <h3 className="font-serif text-xl text-blue mb-1">Raise Negotiation Playbook</h3>
          <p className="text-muted text-sm mb-4">Build an airtight case. Get the raise you've earned.</p>
          <div className="text-muted text-sm line-through">Career coaches charge $200+/hr</div>
          <div className="font-serif text-5xl text-blue my-2">$39</div>
          <p className="text-muted text-sm mb-6">One-time payment. Your playbook, forever.</p>
          <ul className="text-left space-y-2.5 mb-8">
            {[
              'Market comp report',
              'Ready-to-share business case doc',
              'Manager conversation scripts',
              'Objection handling for every pushback',
              'Timing & approach strategy',
              '10+ page personalized PDF',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600 pb-2.5 border-b border-paper">
                <span className="text-blue font-bold text-lg">✓</span> {item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleCheckout('raise')}
            className="w-full bg-blue text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#245fa0] transition-all hover:-translate-y-0.5 shadow-lg shadow-blue/25"
          >
            Get Raise Playbook →
          </button>
          <p className="text-muted text-xs mt-3">🔒 Secure checkout · Money-back guarantee</p>
        </div>
      </div>
    </section>
  );
}
