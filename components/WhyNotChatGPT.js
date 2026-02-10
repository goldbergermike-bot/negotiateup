export default function WhyNotChatGPT() {
  return (
    <section className="py-24 px-6" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl mb-3">"Can't I just ask ChatGPT?"</h2>
          <p className="text-muted text-lg">You could. Here's why people choose SalaryPrep instead.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-8 border border-border">
            <div className="flex gap-4 items-start">
              <span className="text-2xl">🎯</span>
              <div>
                <h3 className="font-semibold text-ink mb-2">ChatGPT gives generic advice. We give you YOUR playbook.</h3>
                <p className="text-muted text-sm leading-relaxed">
                  ChatGPT doesn't know your company's compensation philosophy, your market value based on location and experience, or what specific pushback you'll face. SalaryPrep analyzes your offer details, resume, and situation to create a strategy that's built for you — not "a software engineer in the Bay Area."
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-border">
            <div className="flex gap-4 items-start">
              <span className="text-2xl">📄</span>
              <div>
                <h3 className="font-semibold text-ink mb-2">A 10+ page PDF beats a chat conversation.</h3>
                <p className="text-muted text-sm leading-relaxed">
                  A ChatGPT conversation disappears. Your SalaryPrep playbook is a polished, organized PDF you can review the night before your negotiation call, reference during the conversation, and keep forever. Market data, scripts, objection handlers, and timeline — all in one document.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-border">
            <div className="flex gap-4 items-start">
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="font-semibold text-ink mb-2">ChatGPT's salary data is often wrong.</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Harvard's Program on Negotiation found that ChatGPT's salary benchmarks are frequently inaccurate. SalaryPrep uses advanced AI specifically prompted with compensation frameworks to provide more reliable market ranges for your exact role, level, and location.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-border">
            <div className="flex gap-4 items-start">
              <span className="text-2xl">⏱️</span>
              <div>
                <h3 className="font-semibold text-ink mb-2">You'd spend hours prompting ChatGPT. This takes 5 minutes.</h3>
                <p className="text-muted text-sm leading-relaxed">
                  To get the same quality from ChatGPT, you'd need to write a dozen careful prompts, piece together the results, format them yourself, and hope nothing is hallucinated. SalaryPrep does all of that in one step and delivers a professional, organized playbook.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-muted text-sm mb-4">Bottom line: $39 to potentially negotiate thousands more? That's the best ROI you'll ever get.</p>
          <a
            href="#pricing"
            className="inline-block bg-accent text-white px-8 py-3 rounded-xl font-semibold hover:bg-accent-glow transition-all hover:-translate-y-0.5"
          >
            Get My Playbook →
          </a>
        </div>
      </div>
    </section>
  );
}
