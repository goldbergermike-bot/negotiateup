export default function Comparison() {
  const rows = [
    { feature: 'Personalized to YOUR offer/raise', chatgpt: '⚠️ Generic', us: true, coach: true },
    { feature: '10+ page PDF you can reference', chatgpt: false, us: true, coach: false },
    { feature: 'Market salary data for your role', chatgpt: '⚠️ Unreliable', us: true, coach: true },
    { feature: 'Word-for-word call & email scripts', chatgpt: false, us: true, coach: 'Sometimes' },
    { feature: 'Company-specific negotiation intel', chatgpt: false, us: true, coach: true },
    { feature: 'Objection handling for every pushback', chatgpt: false, us: true, coach: true },
    { feature: 'Day-by-day negotiation timeline', chatgpt: false, us: true, coach: true },
    { feature: 'Ready in under 10 minutes', chatgpt: true, us: true, coach: false },
    { feature: 'Works for offers AND raises', chatgpt: '⚠️ If asked', us: true, coach: 'Usually offers only' },
    { feature: 'Price', chatgpt: 'Free', us: '$39', coach: '$1,250–$6,000', isPrice: true },
  ];

  const renderVal = (val) => {
    if (val === true) return <span className="text-accent font-bold text-base">✓</span>;
    if (val === false) return <span className="text-gray-300">✗</span>;
    return <span className="text-xs">{val}</span>;
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-[850px] mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-center mb-3">Why NegotiateUp?</h2>
        <p className="text-muted text-center mb-12 text-lg">The quality of a career coach at a fraction of the price.</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted font-semibold"></th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted font-semibold">ChatGPT / Free AI</th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-accent font-semibold bg-accent-light/30 rounded-t-xl">NegotiateUp ✦</th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted font-semibold">Career Coach</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={`border-b border-border ${row.isPrice ? 'font-bold' : ''}`}>
                  <td className={`p-4 text-sm ${row.isPrice ? 'text-ink' : 'text-gray-600'}`}>{row.feature}</td>
                  <td className="p-4 text-sm">{renderVal(row.chatgpt)}</td>
                  <td className="p-4 text-sm text-accent font-semibold bg-accent-light/10">{renderVal(row.us)}</td>
                  <td className="p-4 text-sm text-gray-600">{renderVal(row.coach)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
