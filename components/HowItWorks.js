export default function HowItWorks() {
  const steps = [
    { num: '1', title: 'Tell Us Your Situation', desc: 'New offer or raise? Upload your details — offer letter, resume, role info, or current salary. Takes 2 minutes.' },
    { num: '2', title: 'We Build Your Playbook', desc: 'Market data, leverage analysis, negotiation scripts, and a full strategy — all personalized to you.' },
    { num: '3', title: 'Negotiate With Confidence', desc: 'Your 10+ page playbook arrives via email in under 10 minutes. Open it, follow the plan, get paid more.' },
  ];

  return (
    <section className="py-24 px-6" id="how">
      <div className="max-w-[1000px] mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-center mb-16">
          Three Steps to a Bigger Paycheck
        </h2>
        <div className="grid md:grid-cols-3 gap-10 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-9 left-[16%] right-[16%] h-0.5 bg-border" />

          {steps.map((s, i) => (
            <div key={i} className="text-center relative">
              <div className="w-[72px] h-[72px] bg-accent text-white rounded-full flex items-center justify-center font-serif text-2xl mx-auto mb-5 relative z-10 shadow-lg shadow-accent/20">
                {s.num}
              </div>
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-muted text-sm leading-relaxed max-w-[280px] mx-auto">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
