export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-paper" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl mb-3">What's Inside Your Playbook</h2>
          <p className="text-muted text-lg">Here's a preview of what you'll get — personalized for your specific situation.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Sample sections */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-serif text-lg mb-2">Market Salary Analysis</h3>
            <div className="bg-paper rounded-xl p-4 text-xs text-gray-500 font-mono leading-relaxed">
              <p className="mb-1"><strong className="text-ink">Role:</strong> Senior Product Manager</p>
              <p className="mb-1"><strong className="text-ink">Location:</strong> San Francisco, CA</p>
              <p className="mb-1"><strong className="text-ink">Market Range:</strong></p>
              <p className="ml-3">25th percentile: $165,000</p>
              <p className="ml-3">50th percentile: $185,000</p>
              <p className="ml-3">75th percentile: $210,000</p>
              <p className="mt-2"><strong className="text-ink">Your offer of $170K sits at the 32nd percentile.</strong></p>
              <p className="mt-1 text-accent font-semibold">Recommended counter: $195,000</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-border">
            <div className="text-2xl mb-3">🎙️</div>
            <h3 className="font-serif text-lg mb-2">Word-for-Word Scripts</h3>
            <div className="bg-paper rounded-xl p-4 text-xs text-gray-500 italic leading-relaxed">
              <p className="text-accent font-semibold not-italic mb-2">Counter-Offer Phone Script:</p>
              <p>"Thank you again for the offer — I'm genuinely excited about joining [Company]. After reviewing the package and researching market rates for senior PMs in the Bay Area, I'd love to discuss adjusting the base to $195,000. Given my 8 years leading cross-functional product teams and my track record of launching products that drove $12M in revenue, I believe this reflects the value I'll bring..."</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-border">
            <div className="text-2xl mb-3">🛡️</div>
            <h3 className="font-serif text-lg mb-2">Objection Handling</h3>
            <div className="bg-paper rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
              <p className="text-ink font-semibold mb-1">When they say: "This is our best offer"</p>
              <p className="italic">"I appreciate that. Would there be flexibility on other parts of the package? I'd love to explore the signing bonus, equity refresh, or a guaranteed 6-month review with a target adjustment..."</p>
              <p className="text-ink font-semibold mb-1 mt-3">When they say: "The budget is set"</p>
              <p className="italic">"I understand budget constraints. Could we structure a signing bonus of $15K to bridge the gap? That's often easier to approve as a one-time cost..."</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-border">
            <div className="text-2xl mb-3">📅</div>
            <h3 className="font-serif text-lg mb-2">Day-by-Day Timeline</h3>
            <div className="bg-paper rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
              <p className="mb-1"><strong className="text-ink">Day 1:</strong> Send acknowledgment email (script included), begin market research review</p>
              <p className="mb-1"><strong className="text-ink">Day 2-3:</strong> Finalize counter-offer numbers, practice scripts out loud</p>
              <p className="mb-1"><strong className="text-ink">Day 3-4:</strong> Make the counter via phone (Script B) or email (Script C)</p>
              <p className="mb-1"><strong className="text-ink">Day 5:</strong> Handle response, negotiate secondary items if base is firm</p>
              <p><strong className="text-ink">Day 6-7:</strong> Close the deal, get updated offer in writing</p>
            </div>
          </div>
        </div>

        <p className="text-center text-muted text-sm mt-10">
          ⬆️ This is a preview with example data. <strong className="text-ink">Your playbook is personalized to your exact offer, company, and experience.</strong>
        </p>
      </div>
    </section>
  );
}
