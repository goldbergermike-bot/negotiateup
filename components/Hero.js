export default function Hero() {
  return (
    <section className="pt-36 pb-20 px-6 max-w-[1100px] mx-auto text-center">
      <div className="inline-block bg-accent-light text-accent font-semibold text-xs px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase animate-fade-up">
        🎯 Personalized Playbook · Ready in 10 Minutes
      </div>

      <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 max-w-[820px] mx-auto">
        Get paid what you're{' '}
        <span className="text-accent relative">
          actually worth.
          <span className="absolute bottom-0.5 left-0 right-0 h-2 bg-accent-light -z-10 rounded" />
        </span>
      </h1>

      <p className="text-lg text-muted max-w-[620px] mx-auto mb-10 font-light leading-relaxed">
        Whether you're negotiating a new job offer or asking for a raise, get a
        personalized playbook with exact scripts, market data, and a step-by-step strategy.
      </p>

      <div className="flex gap-4 justify-center items-center flex-wrap">
        <a
          href="#pricing"
          className="bg-accent text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-accent-glow transition-all hover:-translate-y-0.5 shadow-lg shadow-accent/25"
        >
          Get My Playbook →
        </a>
        <a href="#paths" className="text-muted font-medium flex items-center gap-1.5">
          See how it works ↓
        </a>
      </div>

      <div className="mt-12 flex justify-center gap-10 flex-wrap text-muted text-sm">
        <span className="flex items-center gap-1.5">
          ⭐ <strong className="text-ink">4.9/5</strong> average rating
        </span>
        <span className="flex items-center gap-1.5">
          📄 <strong className="text-ink">2,400+</strong> playbooks delivered
        </span>
        <span className="flex items-center gap-1.5">
          💰 <strong className="text-ink">$8,200</strong> avg. salary increase
        </span>
      </div>
    </section>
  );
}
