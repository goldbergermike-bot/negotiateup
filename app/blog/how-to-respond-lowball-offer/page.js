import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'How to Respond to a Lowball Job Offer (Without Burning the Bridge) — SalaryPrep',
  description: 'Got a lowball salary offer? Learn exactly what to say, how to counter professionally, and when to walk away. Includes scripts and email templates.',
  keywords: ['lowball offer', 'low salary offer', 'how to respond lowball', 'job offer too low', 'counter lowball offer', 'salary offer too low what to do'],
  alternates: { canonical: 'https://www.salaryprep.com/blog/how-to-respond-lowball-offer' },
};

function CTA() {
  return (
    <div className="my-10 bg-accent-light rounded-2xl p-8 text-center border border-accent/20">
      <p className="font-serif text-xl mb-2 text-accent">Need a personalized counter-strategy?</p>
      <p className="text-sm text-muted mb-4">Get a playbook with market data, exact counter numbers, and word-for-word scripts built for your specific situation.</p>
      <a href="/#pricing" className="inline-block bg-accent text-white px-6 py-3 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-all">
        Get My Playbook — $39 →
      </a>
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
          <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-3 py-1 rounded-full">Negotiation</span>
          <h1 className="font-serif text-3xl md:text-4xl mt-4 mb-3 leading-tight">How to Respond to a Lowball Job Offer (Without Burning the Bridge)</h1>
          <p className="text-muted text-sm">February 12, 2026 · 10 min read</p>
        </div>

        <div className="prose-custom">
          <p className="text-lg text-muted leading-relaxed mb-6">
            You made it through three rounds of interviews. You aced the case study. And then the offer comes in... and it's <strong>significantly lower than what you expected.</strong> Your stomach drops. Now what?
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            First, take a breath. A lowball offer doesn't necessarily mean the company doesn't value you. It often means they're starting at the bottom of their range, testing whether you'll accept without negotiating. The good news? This is one of the most common — and most fixable — negotiation scenarios.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 1: Don't React Emotionally</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            The absolute worst thing you can do is respond immediately with frustration. Don't say "That's way too low" or "I'm insulted by this offer." Even if you feel those things, expressing them puts the company on the defensive and makes the negotiation adversarial. Instead, use the same response you'd use for any offer: <em>"Thank you so much — I'm really excited about this opportunity. I'd like to take some time to review the full package. Can you send me the details in writing?"</em>
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            This buys you time to research, prepare your counter, and respond from a place of strategy rather than emotion. Take at least 24-48 hours before responding, even if the recruiter pressures you for a faster answer.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 2: Figure Out If It's Actually a Lowball</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Before you counter, confirm that the offer really is below market. Sometimes our expectations are based on outdated data, inflated Glassdoor numbers, or what we think we "deserve" rather than what the market actually pays. Use at least three sources to check: Levels.fyi (best for tech), Glassdoor, Payscale, LinkedIn Salary, and the Bureau of Labor Statistics. Factor in your location, experience level, industry, and company size.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Also consider the full package, not just base. Sometimes a "low" base comes with generous equity, bonuses, benefits, or remote flexibility that bring the total compensation above market. Calculate your total comp before deciding how to respond.
          </p>

          <div className="my-8 bg-paper rounded-xl p-6 border border-border flex flex-col sm:flex-row items-center gap-4">
            <div className="text-3xl">🎯</div>
            <div className="flex-1 text-center sm:text-left">
              <p className="font-semibold text-sm">Free: Counter-Offer Calculator</p>
              <p className="text-muted text-xs">Enter your offer and get an exact number to counter at.</p>
            </div>
            <a href="/calculator" className="text-accent font-semibold text-sm whitespace-nowrap">Try it free →</a>
          </div>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 3: Counter With Data, Not Feelings</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            The key to countering a lowball offer is anchoring your response to data. Don't say "I want more money." Say "Based on my research, the market range for this role is X to Y, and given my [specific experience/skills], I believe Z is fair." This shifts the conversation from subjective feelings to objective facts.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Here's an email template you can adapt:
          </p>

          <div className="bg-paper rounded-xl p-6 border border-border text-sm text-gray-700 mb-6 italic leading-relaxed">
            <p className="mb-3">Hi [Name],</p>
            <p className="mb-3">Thank you again for the offer — I'm genuinely excited about the opportunity to join [Company] and contribute to [specific project or team].</p>
            <p className="mb-3">I've reviewed the compensation package and done some research on market rates for [Role] in [Location] at the [experience level] level. Based on data from [sources], the market range appears to be [X-Y]. Given my experience with [1-2 specific relevant skills or achievements], I was hoping we could explore a base closer to [your target number].</p>
            <p className="mb-3">I want to be transparent that this is really about alignment — I'm committed to making this work and am flexible on how we get there, whether that's base, signing bonus, or equity.</p>
            <p>Looking forward to discussing. Thank you for your time.</p>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            Notice what this email does: it leads with enthusiasm, uses data, highlights your value, names a specific number, and opens the door for creative solutions. It's professional, not confrontational.
          </p>

          <CTA />

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 4: How Much to Counter</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            A common question: how high should your counter be? A good rule of thumb is to counter 15-25% above the initial offer if it's genuinely below market. If the offer is $80,000 and market data shows $95,000-$105,000 for the role, counter at $100,000-$105,000. You'll typically land somewhere in the middle.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Don't be afraid to counter higher than you think you'll get. Hiring managers expect to negotiate down. If you counter at exactly what you want, you'll end up below it. Counter at the high end of the market range, and you'll likely settle at a number you're happy with.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 5: What If They Don't Budge?</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Sometimes companies genuinely can't move on base salary — especially at startups with tight budgets or roles with rigid pay bands (government, education, some healthcare). If they say "this is our best and final offer" on base, pivot to other levers:
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Ask about a signing bonus to bridge the gap. Request an early performance review at 6 months (with a raise tied to meeting goals). Negotiate additional PTO, remote work days, professional development budget, or a better title. These don't cost the company the same as a salary increase but they have real value to you.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            You can say: <em>"I understand the base salary is firm. Would it be possible to include a signing bonus of [X] to help bridge the gap? Or perhaps we could build in a 6-month review with a raise contingent on hitting targets?"</em>
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">When to Walk Away</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Walking away is always an option, and sometimes it's the right one. Consider walking if the offer is more than 20% below market rate and they won't negotiate; if the company responds negatively to a reasonable, professional counter (a red flag about the culture); if accepting would require a significant pay cut from your current role with no upside to justify it; or if your gut is telling you the company doesn't value the role.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            If you decide to decline, do it gracefully: <em>"I really appreciate the offer and the time the team invested. Unfortunately, I'm not able to make the numbers work at this level. I'd love to stay in touch in case anything changes."</em> This keeps the door open — and sometimes, they'll come back with a better offer.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">The Bottom Line</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            A lowball offer isn't the end of the negotiation — it's the beginning. Companies that lowball expect you to counter. The ones who don't negotiate leave the most money on the table. Stay calm, use data, counter confidently, and remember: the worst thing that happens when you negotiate is they say no and you're back where you started.
          </p>

          <div className="my-8 bg-paper rounded-xl p-6 border border-border flex flex-col sm:flex-row items-center gap-4">
            <div className="text-3xl">🤔</div>
            <div className="flex-1 text-center sm:text-left">
              <p className="font-semibold text-sm">Is your current salary competitive?</p>
              <p className="text-muted text-xs">Take our free 60-second quiz to compare your pay to market data.</p>
            </div>
            <a href="/quiz" className="text-accent font-semibold text-sm whitespace-nowrap">Take the quiz →</a>
          </div>

          <CTA />
        </div>
      </article>
      <Footer />
    </main>
  );
}
