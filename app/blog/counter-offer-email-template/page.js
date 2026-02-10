import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Counter Offer Email Template: Exactly What to Write — SalaryPrep',
  description: 'Copy-paste counter offer email templates for salary negotiation. Includes templates for different situations, plus tips on tone and timing.',
  keywords: ['counter offer email', 'counter offer email template', 'salary negotiation email', 'how to counter a job offer', 'negotiate offer email'],
  alternates: { canonical: 'https://www.salaryprep.com/blog/counter-offer-email-template' },
};

function CTA() {
  return (
    <div className="my-10 bg-accent-light rounded-2xl p-8 text-center border border-accent/20">
      <p className="font-serif text-xl mb-2 text-accent">Want a counter offer written for YOUR situation?</p>
      <p className="text-sm text-muted mb-4">Get a personalized email script with exact numbers based on your offer, market data, and experience.</p>
      <a href="/#pricing" className="inline-block bg-accent text-white px-6 py-3 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-all">
        Get My Playbook — $39 →
      </a>
    </div>
  );
}

function EmailTemplate({ label, children }) {
  return (
    <div className="my-6 bg-white border-2 border-border rounded-2xl overflow-hidden">
      <div className="bg-paper px-6 py-3 border-b border-border">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">{label}</span>
      </div>
      <div className="px-6 py-5 text-sm text-gray-700 leading-relaxed whitespace-pre-line font-mono">
        {children}
      </div>
    </div>
  );
}

export default function Article() {
  return (
    <main>
      <Nav />
      <article className="pt-32 pb-20 px-6 max-w-[720px] mx-auto">
        <Link href="/blog" className="text-accent text-sm font-medium mb-6 inline-block">← Back to Blog</Link>
        
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-3 py-1 rounded-full">Scripts & Templates</span>
          <h1 className="font-serif text-3xl md:text-4xl mt-4 mb-3 leading-tight">Counter Offer Email Template: Exactly What to Write</h1>
          <p className="text-muted text-sm">February 9, 2026 · 8 min read</p>
        </div>

        <div className="prose-custom">
          <p className="text-lg text-muted leading-relaxed mb-6">
            Writing a counter offer email is one of the most nerve-wracking parts of salary negotiation. You don't want to sound pushy, ungrateful, or out of touch. But you also don't want to leave money on the table.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Below are ready-to-use email templates for the most common negotiation scenarios. Customize them with your details, hit send, and start earning what you're worth.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Template 1: The Standard Counter Offer</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Use this when you've received an offer and want to negotiate the base salary. It's professional, concise, and effective.
          </p>

          <EmailTemplate label="Email Template — Standard Counter">
{`Subject: [Your Name] — Offer Discussion

Hi [Recruiter/Hiring Manager Name],

Thank you again for extending the offer for the [Job Title] role. I'm genuinely excited about the opportunity to join [Company Name] and contribute to [specific thing you're excited about].

After reviewing the offer details and researching market compensation for this role in [location], I'd like to discuss the base salary. Based on my [X years of experience in Y], my [specific skill or accomplishment], and current market rates for similar positions, I was hoping we could explore a base salary of $[your target number].

I'm confident in the value I'll bring to the team, and I want to make sure we start on a foundation that reflects that. I'm very open to discussing this further.

Looking forward to hearing your thoughts.

Best,
[Your Name]`}
          </EmailTemplate>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Key Principles for Every Counter Email</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            No matter which template you use, follow these rules. First, lead with enthusiasm — always reaffirm that you want the job before making your ask. People are more willing to negotiate with someone who's clearly excited about the role.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Second, give a specific number, not a range. If you say "between $90K and $100K," they'll hear $90K. State one number — your target — and let the negotiation settle somewhere between that and their original offer.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Third, justify your ask briefly. One or two sentences referencing market data, your experience, or a competing offer is enough. You don't need to write a thesis.
          </p>

          <CTA />

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Template 2: Counter with a Competing Offer</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have another offer (or are in late-stage interviews elsewhere), you have real leverage. Use it honestly and professionally.
          </p>

          <EmailTemplate label="Email Template — Competing Offer">
{`Subject: [Your Name] — Offer Discussion

Hi [Recruiter/Hiring Manager Name],

Thank you so much for the [Job Title] offer. I want you to know that [Company Name] is my top choice — the team, the mission, and the role are exactly what I'm looking for.

I want to be transparent: I've also received an offer from another company at a base salary of $[competing number]. While compensation isn't the only factor in my decision, I want to make sure I'm making a well-informed choice.

Is there flexibility to bring the base salary closer to $[your target]? If so, I'd be ready to sign and stop my other process immediately.

Thank you for considering this — I'm looking forward to joining the team.

Best,
[Your Name]`}
          </EmailTemplate>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Template 3: Negotiating Beyond Base Salary</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Sometimes the base salary is firm. That doesn't mean the negotiation is over. Use this template to negotiate other parts of the package.
          </p>

          <EmailTemplate label="Email Template — Beyond Base">
{`Subject: [Your Name] — Offer Discussion

Hi [Recruiter/Hiring Manager Name],

Thank you for the updated offer details and for being transparent about the base salary constraints. I completely understand, and I appreciate you working with me on this.

I'd love to explore a few other areas to close the gap:

- A signing bonus of $[amount] to bridge the difference
- [Additional equity / RSU grant]
- A guaranteed performance review at 6 months with a salary adjustment target of [X%]
- [Extra PTO days / remote flexibility / professional development budget]

I'm flexible on the specifics — what matters most to me is that we find a package that works for both sides so I can hit the ground running.

Looking forward to your thoughts.

Best,
[Your Name]`}
          </EmailTemplate>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Common Mistakes to Avoid</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Don't apologize for negotiating.</strong> Phrases like "I'm sorry to ask" or "I know this might be uncomfortable" undermine your position. You're having a professional conversation, not making an unreasonable demand.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Don't give an ultimatum.</strong> Saying "I need $X or I'll walk" puts the other side in a corner. Keep the tone collaborative — "I was hoping we could explore" is much more effective than "I require."
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Don't over-explain.</strong> A short, confident email is more persuasive than a long, defensive one. State your ask, give a brief reason, and let them respond.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Don't negotiate by chat or text.</strong> Email or phone only. You want a format that lets you be thoughtful and creates a record of what was discussed.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">When to Send Your Counter</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Timing matters. Don't respond within hours of receiving the offer — it signals you haven't done your homework. But don't wait a week either, which can signal disinterest.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            The sweet spot is 1-3 business days after receiving the offer. This gives you time to research, prepare, and craft a thoughtful response while keeping momentum going.
          </p>

          <CTA />
        </div>
      </article>
      <Footer />
    </main>
  );
}
