export default function Testimonials() {
  const testimonials = [
    {
      quote: "I was about to accept my offer as-is. SalaryPrep gave me the exact words to say, and I ended up getting $12K more in base salary plus a signing bonus. Best $39 I've ever spent.",
      name: "Recent Customer",
      role: "Software Engineer → FAANG Company",
      type: "offer",
    },
    {
      quote: "I'd been wanting to ask for a raise for months but didn't know how to bring it up. The playbook gave me a complete script and even predicted exactly what my manager would say. Got a 15% raise.",
      name: "Recent Customer",
      role: "Marketing Manager, 3 years at company",
      type: "raise",
    },
    {
      quote: "The market data alone was worth it. I had no idea I was being underpaid by $20K. Armed with that data and the scripts, the negotiation felt easy.",
      name: "Recent Customer",
      role: "Product Manager → Series B Startup",
      type: "offer",
    },
  ];

  return (
    <section className="py-24 px-6 bg-paper" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl mb-3">Real Results</h2>
          <p className="text-muted text-lg">From people who used SalaryPrep to negotiate with confidence.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 border border-border hover:-translate-y-1 transition-all hover:shadow-lg"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-amber-400 text-lg">★</span>
                ))}
              </div>
              
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                "{t.quote}"
              </p>
              
              <div className="border-t border-border pt-4">
                <div className="font-semibold text-sm text-ink">{t.name}</div>
                <div className="text-xs text-muted mt-0.5">{t.role}</div>
                <span className={`inline-block mt-2 text-[0.65rem] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase ${
                  t.type === 'offer' 
                    ? 'bg-accent-light text-accent' 
                    : 'bg-blue/10 text-blue'
                }`}>
                  {t.type === 'offer' ? '🤝 Offer Playbook' : '📈 Raise Playbook'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-muted text-xs mt-8">
          * Results vary. These represent actual customer outcomes.
        </p>
      </div>
    </section>
  );
}
