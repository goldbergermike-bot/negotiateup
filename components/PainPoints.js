export default function PainPoints() {
  const pains = [
    { type: 'offer', icon: '😰', text: '"I\'m scared that if I counter, they\'ll rescind the offer entirely."' },
    { type: 'raise', icon: '😤', text: '"I know I\'m underpaid, but I don\'t know how to bring it up without making things awkward."' },
    { type: 'offer', icon: '🤷', text: '"I don\'t know what the market rate is — I might already have a great offer."' },
    { type: 'raise', icon: '📊', text: '"My boss says the budget is tight. I need proof I\'m underpaid, not just a gut feeling."' },
    { type: 'offer', icon: '⏰', text: '"They want an answer by Friday and I have no idea what to say or ask for."' },
    { type: 'raise', icon: '🗓️', text: '"I\'ve been meaning to ask for months but keep putting it off because I don\'t have a plan."' },
  ];

  return (
    <section className="py-24 px-6 bg-white" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-[1000px] mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">Sound familiar?</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {pains.map((p, i) => (
            <div
              key={i}
              className="p-7 rounded-2xl bg-paper"
              style={{ border: '1px solid var(--border)' }}
            >
              <div className={`text-[0.65rem] font-bold tracking-widest uppercase mb-2.5 ${
                p.type === 'offer' ? 'text-accent' : 'text-blue'
              }`}>
                {p.type === 'offer' ? 'New Offer' : 'Current Job'}
              </div>
              <span className="text-xl mb-2 block">{p.icon}</span>
              <p className="text-gray-600 text-sm leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
