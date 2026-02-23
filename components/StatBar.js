export default function StatBar() {
  const stats = [
    { num: '300+', label: 'companies with verified comp data' },
    { num: '$5K–$15K', label: 'left on the table without negotiating' },
    { num: '10 min', label: 'to get your custom playbook' },
  ];

  return (
    <section className="bg-ink py-12 mt-10">
      <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-6">
        {stats.map((s, i) => (
          <div key={i}>
            <div className="font-serif text-4xl text-accent-light leading-none">{s.num}</div>
            <div className="text-white/60 text-sm mt-1.5 font-light">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
