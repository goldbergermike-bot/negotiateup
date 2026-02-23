export default function ResearchCTA({ companyName, roleTitle }) {
  return (
    <div className="my-10 bg-accent-light rounded-2xl p-8 text-center border border-accent/20">
      <p className="font-serif text-xl mb-2 text-accent">
        Negotiating {roleTitle ? `a ${roleTitle} offer` : ''}{companyName ? ` at ${companyName}` : ''}?
      </p>
      <p className="text-sm text-muted mb-4">
        Get a personalized playbook with your exact counter-offer numbers,
        word-for-word scripts, and a day-by-day negotiation plan.
      </p>
      <a
        href="/#pricing"
        className="inline-block bg-accent text-white px-6 py-3 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-all"
      >
        Get My Playbook — $39 →
      </a>
    </div>
  );
}
