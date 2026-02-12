export default function FreeTools() {
  return (
    <section className="py-20 px-6 bg-white" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-[900px] mx-auto text-center">
        <p className="text-accent font-semibold text-xs uppercase tracking-wider mb-3">Free Tools</p>
        <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">
          Not sure where to start? Try these first.
        </h2>
        <p className="text-muted max-w-[500px] mx-auto mb-12">
          100% free, no signup required. Used by thousands of professionals.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Quiz Card */}
          <a
            href="/quiz"
            className="group block bg-paper rounded-2xl border border-border p-8 text-left hover:border-accent/40 hover:shadow-lg transition-all"
          >
            <div className="text-4xl mb-4">🤔</div>
            <h3 className="font-serif text-xl mb-2 group-hover:text-accent transition-colors">
              Am I Underpaid? Quiz
            </h3>
            <p className="text-muted text-sm mb-4">
              Answer 6 quick questions and find out how your salary compares to market data for your role, experience, and location.
            </p>
            <span className="text-accent font-semibold text-sm">
              Take the quiz → 60 seconds
            </span>
          </a>

          {/* Calculator Card */}
          <a
            href="/calculator"
            className="group block bg-paper rounded-2xl border border-border p-8 text-left hover:border-accent/40 hover:shadow-lg transition-all"
          >
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-serif text-xl mb-2 group-hover:text-accent transition-colors">
              Counter-Offer Calculator
            </h3>
            <p className="text-muted text-sm mb-4">
              Got a job offer? Enter the details and get the exact number to counter at — conservative, recommended, and aggressive ranges.
            </p>
            <span className="text-accent font-semibold text-sm">
              Calculate your counter → 30 seconds
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
