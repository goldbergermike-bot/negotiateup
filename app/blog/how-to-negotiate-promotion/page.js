import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'How to Negotiate a Promotion: From Conversation to Offer — SalaryPrep',
  description: 'Learn how to build your case for a promotion, time the conversation right, and negotiate the title and salary increase you deserve. Includes scripts and templates.',
  keywords: ['negotiate promotion', 'how to ask for promotion', 'promotion negotiation', 'promotion conversation', 'get promoted at work'],
  alternates: { canonical: 'https://www.salaryprep.com/blog/how-to-negotiate-promotion' },
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
          <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-3 py-1 rounded-full">Career Growth</span>
          <h1 className="font-serif text-3xl md:text-4xl mt-4 mb-3 leading-tight">How to Negotiate a Promotion: From Conversation to Offer</h1>
          <p className="text-muted text-sm">February 19, 2026 · 13 min read</p>
        </div>

        <div className="prose-custom">
          <p className="text-lg text-muted leading-relaxed mb-6">
            A promotion isn't something that just happens to you — <strong>it's something you build a case for, ask for, and negotiate</strong>. If you're waiting for your manager to notice your hard work and reward you spontaneously, you could be waiting a very long time.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            This guide walks you through the entire process: from laying the groundwork months before the conversation to negotiating the title, salary, and responsibilities once the promotion is on the table.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Phase 1: Build the Case (3-6 Months Before)</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            The promotion conversation doesn't start when you sit down with your manager. It starts months earlier, when you begin deliberately building and documenting your case.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Start a "brag document."</strong> Keep a running log of your accomplishments, impact, and contributions. Every project you lead, every problem you solve, every metric you improve — write it down. Include specific numbers wherever possible: revenue generated, costs saved, processes improved, team members mentored.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Understand the promotion criteria.</strong> Most companies have leveling frameworks or competency models that define what's expected at each level. If your company has one, study it. If it doesn't, ask your manager: "What would someone at the next level be doing differently than what I'm doing today?" This gives you a roadmap.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Start doing the job before you have the title.</strong> This is the most important principle. Promotions are typically awarded to people who are already performing at the next level, not people who promise they will. Take on higher-level responsibilities, lead bigger projects, and operate with more autonomy.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Get allies.</strong> Your manager will likely need to advocate for you to their manager or a compensation committee. Make sure other senior people in the organization know your work. Volunteer for cross-functional projects, present your work to leadership, and build relationships with stakeholders who can vouch for your impact.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Phase 2: Plant the Seed (6-8 Weeks Before)</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Don't blindside your manager with a promotion request. Instead, signal your intentions early so they can prepare and advocate internally.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            In a 1:1 meeting, bring it up naturally:
          </p>

          <blockquote className="border-l-4 border-accent bg-accent-light/50 p-4 rounded-r-xl my-6 text-sm text-gray-700 italic">
            "I've been thinking about my growth here, and I'd love to talk about what a path to [Senior/Lead/Manager title] looks like. I've been taking on more [specific responsibilities] and I'd like to understand what it would take to formalize that with a promotion. Can we discuss this in our next few check-ins?"
          </blockquote>

          <p className="text-gray-700 leading-relaxed mb-4">
            This does several things: it signals your intention without being demanding, it gives your manager time to think about it, and it opens a dialogue rather than a one-time ask.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Listen carefully to the response. If your manager says "Absolutely, let's work toward that," you're on track. If they seem surprised or hesitant, you may need to address gaps in perception or adjust your timeline.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Phase 3: Make the Ask</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            When you're ready to formally ask for the promotion, schedule a dedicated meeting — don't squeeze it into a regular 1:1. Come prepared with your brag document and a clear, structured case.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Here's a framework for the conversation:
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>1. State your intention clearly.</strong> "I'd like to discuss being promoted to [title]. I believe I've been consistently performing at that level, and I want to formalize it."
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>2. Present your evidence.</strong> Walk through your top 3-5 accomplishments, using the framework of impact, scope, and leadership. Tie each one to the promotion criteria or next-level expectations.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>3. Reference market data.</strong> Use your <Link href="/report" className="text-accent underline">salary research</Link> to show that your current compensation is below market for the level you're performing at. This adds an external anchor to your internal case.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>4. Ask for a specific next step.</strong> "What would you need from me to move forward with this? Is this something we can work toward for the next review cycle?"
          </p>

          <CTA />

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Timing Your Promotion Request</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Timing matters more than most people realize. Here's when to ask — and when to wait:
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Best timing:</strong> Right after a major win (launching a product, closing a big deal, exceeding targets). During or just before the annual review cycle — when budgets and promotions are being planned. After you've consistently performed at the next level for at least 6 months.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Bad timing:</strong> During layoffs or budget cuts. Right after a team failure or organizational upheaval. When your manager is stressed or dealing with their own career challenges. In your first few months at the company (unless the role was explicitly positioned as a path to promotion).
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Pro tip:</strong> Learn your company's promotion cycle. Many companies only approve promotions at specific times (quarterly, biannually, or annually). If you ask for a promotion in March but the next cycle is in September, your manager may support you but be unable to act on it for months. Ask: "When is the next promotion cycle, and what would I need to demonstrate by then?"
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Negotiating the Promotion Package</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Getting the promotion is only half the battle. Now you need to negotiate the compensation that comes with it. Many companies offer disappointing salary increases with promotions — sometimes as little as 3-5% — even when the market rate for the new level is significantly higher.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Research the market rate for the new title.</strong> Use tools like Levels.fyi, Glassdoor, and our <Link href="/calculator" className="text-accent underline">Counter-Offer Calculator</Link> to find what the new role pays at comparable companies. Your ask should be based on the market rate for the level you're moving into, not a percentage increase from your current salary.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Frame it as market alignment.</strong> "I appreciate the promotion. Based on my research, the market rate for [new title] at companies like ours is in the range of $X to $Y. I'd like to discuss getting my compensation aligned with that range."
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Negotiate the full package.</strong> Beyond base salary, consider: equity refresh, bonus target increase, title specificity (Senior vs. Lead vs. Staff), scope of responsibility, direct reports, and budget authority.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Get a timeline for the next step.</strong> If the salary increase is less than you hoped, ask: "Can we schedule a review in six months to evaluate my performance in the new role and revisit compensation at that point?"
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Handling Common Pushback</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>"You're not ready yet."</strong> Ask for specifics: "What specific skills or accomplishments would demonstrate readiness? Can we create a plan with clear milestones so I know exactly what to work toward?" Turn the rejection into a roadmap.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>"There's no budget right now."</strong> Separate the promotion decision from the budget question: "I understand the budget constraints. Can we formalize the title change and role expectations now, with a commitment to adjust compensation when the budget allows — ideally with a specific date?"
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>"We don't do off-cycle promotions."</strong> Respect the process, but get a commitment: "I understand. Can you support my case for the next promotion cycle? What can I do between now and then to make the case as strong as possible?"
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>"You need more tenure."</strong> If time-in-role is a factor, focus on impact: "I understand the typical timeline. Given the scope of my contributions — [list key accomplishments] — would you consider an exception? I believe my impact has been equivalent to what's typically expected over a longer period."
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">What If the Answer Is No?</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            A "no" is not the end of the conversation — it's the beginning of the next chapter. Here's how to handle it productively:
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Get clarity on what "yes" looks like.</strong> Ask your manager to define specific, measurable criteria for promotion. Write them down. This creates accountability for both of you.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Set a timeline.</strong> "Can we revisit this in [3/6 months]?" Having a date creates urgency and prevents the conversation from being indefinitely deferred.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Evaluate your options.</strong> If you've been consistently denied promotions despite strong performance, it may be time to explore external opportunities. Sometimes the fastest path to the next level is a new company. Take our <Link href="/quiz" className="text-accent underline">Am I Underpaid? quiz</Link> to see where you stand relative to the market.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Don't burn bridges.</strong> Even if you're frustrated, stay professional. Thank your manager for the feedback, demonstrate that you're committed to growth, and continue delivering excellent work. Whether you get promoted internally or leave for a better opportunity, maintaining strong relationships is always to your advantage.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">The Bottom Line</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Promotions rarely happen by accident. They happen because someone builds a clear case, asks at the right time, and negotiates effectively. Don't wait to be noticed — take charge of your career trajectory.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Start building your case today, even if you're months away from the conversation. The documentation, relationships, and next-level contributions you build now are the foundation of your promotion argument later.
          </p>

          <CTA />
        </div>
      </article>
      <Footer />
    </main>
  );
}
