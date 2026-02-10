export default function Comparison() {
  const rows = [
    { feature: 'Personalized to your situation', chatgpt: false, us: true, coach: true },
    { feature: 'Real market salary data', chatgpt: false, us: true, coach: true },
    { feature: 'Word-for-word scripts', chatgpt: false, us: true, coach: 'Sometimes' },
    { feature: 'Ready in minutes', chatgpt: true, us: true, coach: false },
    { feature: 'Works for offers & raises', chatgpt: false, us: true, coach: true },
    { feature: 'Price', chatgpt: 'Free', us: '$39', coach: '$200–$500+', isPrice: true },
  ];

  const renderVal = (val) => {
    if (val === true) return <span className="text-accent">✓</span>;
    if (val === false) return <span className="text-gray-300">✗</span>;
    return val;
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-[800px] mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">Why NegotiateUp?</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted font-semibold"></th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted font-semibold">ChatGPT / Google</th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-accent font-semibold">NegotiateUp ✦</th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-muted font-semibold">Career Coach</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={`border-b border-border ${row.isPrice ? 'font-bold' : ''}`}>
                  <td className={`p-4 text-sm ${row.isPrice ? 'text-ink' : 'text-gray-600'}`}>{row.feature}</td>
                  <td className="p-4 text-sm">{renderVal(row.chatgpt)}</td>
                  <td className="p-4 text-sm text-accent font-semibold">{renderVal(row.us)}</td>
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
