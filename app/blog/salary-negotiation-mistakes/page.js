import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import Link from 'next/link';

export const metadata = {
  title: '7 Salary Negotiation Mistakes That Cost You Thousands — SalaryPrep',
  description: 'Avoid these common salary negotiation mistakes that cost candidates thousands of dollars. Learn what NOT to do and how to fix each mistake with proven strategies.',
  keywords: ['salary negotiation mistakes', 'negotiation errors', 'salary negotiation tips', 'common negotiation mistakes', 'salary negotiation pitfalls'],
  alternates: { canonical: 'https://www.salaryprep.com/blog/salary-negotiation-mistakes' },
};

function CTA() {
  return (
    <div className="my-10 bg-accent-light rounded-2xl p-8 text-center border border-accent/20">
      <p className="font-serif text-xl mb-2 text-accent">Want a playbook built for YOUR offer?</p>
      <p className="text-sm text-muted mb-4">Get exact counter-offer numbers, word-for-word scripts, and a day-by-day plan personalized to your situation.</p>
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
          <h1 className="font-serif text-3xl md:text-4xl mt-4 mb-3 leading-tight">7 Salary Negotiation Mistakes That Cost You Thousands</h1>
          <p className="text-muted text-sm">February 19, 2026 · 11 min read</p>
        </div>

        <div className="prose-custom">
          <p className="text-lg text-muted leading-relaxed mb-6">
            Most people don't lose money in salary negotiations because they're bad at negotiating. <strong>They lose money because they make one or two avoidable mistakes</strong> that undercut their position before the real conversation even starts.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Here are the seven most expensive mistakes — and exactly how to avoid each one.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Mistake #1: Sharing Your Current Salary</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            This is the single most costly mistake in salary negotiation. When you share your current salary, you anchor the entire conversation to a number that may have nothing to do with the market value of the new role. If you're making $85,000 and the role pays $110,000 to $130,000, revealing your current number could cost you tens of thousands of dollars.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Why it happens:</strong> Recruiters ask because it helps them screen candidates and set offer ranges. It's a perfectly rational move for them. But it's not in your interest to answer.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>What to do instead:</strong> In many states and cities, it's actually illegal for employers to ask about salary history. Regardless of the law, you can redirect:
          </p>

          <blockquote className="border-l-4 border-accent bg-accent-light/50 p-4 rounded-r-xl my-6 text-sm text-gray-700 italic">
            "I'd prefer to focus on the value I'll bring to this role rather than my current compensation. Based on my research, the market range for this position is $X to $Y — is that in line with your budget for this role?"
          </blockquote>

          <p className="text-gray-700 leading-relaxed mb-6">
            This keeps the conversation forward-looking and anchored to market data, not your history.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Mistake #2: Giving a Number Too Early</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            When asked "What are your salary expectations?" before you understand the role, the team, the level, and the full compensation structure, any number you give is a shot in the dark. Name too low, and you've capped your offer. Name too high, and you might be screened out.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Why it happens:</strong> Recruiters need to know you're in range before investing time. That's fair. But you can satisfy that need without committing to a specific number.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>What to do instead:</strong> Deflect early, commit later. Use this response:
          </p>

          <blockquote className="border-l-4 border-accent bg-accent-light/50 p-4 rounded-r-xl my-6 text-sm text-gray-700 italic">
            "I'm flexible on compensation and more focused on finding the right fit. Once I learn more about the role and scope, I'd be happy to discuss numbers. Do you have a budget range in mind for this position?"
          </blockquote>

          <p className="text-gray-700 leading-relaxed mb-6">
            If pressed, give a researched range that's anchored above your minimum. Use our <Link href="/calculator" className="text-accent underline">Counter-Offer Calculator</Link> to determine the right range before your interview.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Mistake #3: Negotiating Against Yourself</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            This happens when you preemptively lower your ask before the other side even pushes back. It sounds like: "I'd like $120,000, but I understand if that's too much — I'd be okay with $110,000 too." You just saved the company $10,000 in a sentence.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Why it happens:</strong> Nervousness. Fear of seeming unreasonable. Wanting to be liked. These are all natural human responses — but they work against you in a negotiation.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>What to do instead:</strong> State your number confidently and then stop talking. Let the silence work. Your job is to make one clear ask, back it up with reasoning, and then let them respond. If they need to come down, let them tell you — don't do their work for them.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Practice this: say your ask out loud, then count to five silently. It will feel uncomfortable. That's fine. Discomfort is the price of thousands of dollars.
          </p>

          <CTA />

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Mistake #4: Focusing Only on Base Salary</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Base salary is important, but it's just one piece of total compensation. Many candidates fixate on the base number and completely ignore equity, bonuses, signing bonuses, PTO, remote work flexibility, and other benefits that can be worth tens of thousands of dollars.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Why it matters:</strong> Companies often have more flexibility on non-base components. A hiring manager who can't move the base salary by a single dollar may have authority to offer a $15,000 signing bonus, an extra week of PTO, or a larger equity grant.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>What to do instead:</strong> Always evaluate and negotiate total compensation. Before the negotiation, make a list of everything that matters to you beyond base salary. When the base is firm, pivot:
          </p>

          <blockquote className="border-l-4 border-accent bg-accent-light/50 p-4 rounded-r-xl my-6 text-sm text-gray-700 italic">
            "I understand the base salary is firm at this level. Would there be flexibility on the signing bonus or equity grant? I'm looking at total compensation and want to find a way to close the gap."
          </blockquote>

          <p className="text-gray-700 leading-relaxed mb-6">
            Read our full guide on <Link href="/blog/negotiate-beyond-salary" className="text-accent underline">negotiating beyond salary</Link> for more strategies on total compensation.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Mistake #5: Not Researching Market Rates</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Negotiating without data is like flying blind. You might ask for too little (and leave money on the table) or too much (and seem uninformed). Either way, you lose credibility and leverage.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Why it happens:</strong> People think salary research is hard or unreliable. It's not. It takes about 30 minutes and gives you an enormous advantage.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>What to do instead:</strong> Check multiple data sources: Levels.fyi (especially for tech), Glassdoor, Payscale, LinkedIn Salary Insights, and the Bureau of Labor Statistics. Use our free <Link href="/report" className="text-accent underline">salary report tool</Link> for company-specific data. Look at the 25th, 50th, and 75th percentiles for your role, experience level, and location.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            When you present your counter, reference the data: "Based on my research across multiple salary databases, the market rate for this role in [location] is $X to $Y. Given my [specific qualifications], I believe $Z is fair." Data makes your case objective, not personal.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Mistake #6: Accepting Immediately Out of Gratitude</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            You get the call. They're offering you the job. You're thrilled. You say "yes" on the spot. And just like that, you've accepted a number that was almost certainly negotiable.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Why it happens:</strong> Relief. Gratitude. The fear that if you don't say yes immediately, the offer will vanish. But offers don't disappear because you take 48 hours to review them. In fact, employers expect you to take time.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>What to do instead:</strong> Express enthusiasm, ask for time, and then use that time to prepare your negotiation. Here's the script:
          </p>

          <blockquote className="border-l-4 border-accent bg-accent-light/50 p-4 rounded-r-xl my-6 text-sm text-gray-700 italic">
            "Thank you so much — I'm genuinely excited about this opportunity and the team. I'd love to take a couple of days to review the full details. Would it be okay if I got back to you by [specific day]?"
          </blockquote>

          <p className="text-gray-700 leading-relaxed mb-6">
            This is standard professional behavior. Use those 48 hours to research, prepare your counter, and get your strategy right. Take our <Link href="/quiz" className="text-accent underline">Am I Underpaid? quiz</Link> to quickly benchmark the offer.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Mistake #7: Taking It Personally</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Salary negotiation is not a conflict. It's not personal. It's not adversarial. It's a business conversation between two parties trying to reach a mutually beneficial agreement. But many people treat it as a confrontation — which makes them either avoid it entirely or approach it with aggression.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Why it happens:</strong> Money is emotional. Our sense of self-worth gets tangled up with our salary. A low offer can feel like an insult, and asking for more can feel like being greedy. Neither is true.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>What to do instead:</strong> Reframe the negotiation in your mind. You're not demanding. You're collaborating. The recruiter or hiring manager is not your adversary — they're your future colleague, and they want to find a number that makes both sides happy. Use collaborative language:
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            Instead of "I need $120K" — say "Based on market data, I'd love to explore $120K."
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            Instead of "That's too low" — say "I was hoping we could get closer to $X. Is there room to move?"
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Instead of "I won't accept less than..." — say "To make this work, I'd ideally need the total package to be in the range of..."
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">The Compound Cost of These Mistakes</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            These aren't just one-time losses. Every dollar you leave on the table at the start of a job compounds over your entire tenure — and often your entire career. Future raises are calculated as a percentage of your base. Bonuses are tied to your base. Retirement contributions are a percentage of your compensation.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            A single negotiation mistake that costs you $5,000 in starting salary can easily become $50,000 or more over a five-year tenure when you factor in raises, bonuses, and retirement matching. Over a full career, the impact can reach six figures.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">The Bottom Line</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            You don't need to be a master negotiator to get a better offer. You just need to avoid these seven mistakes. Do your research, take your time, negotiate the full package, and approach the conversation as a collaborative professional discussion.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            The money you're negotiating for isn't just today's salary — it's the foundation for every raise, bonus, and opportunity for the rest of your career. Treat it accordingly.
          </p>

          <CTA />
        </div>
      </article>
      <Footer />
    </main>
  );
}
