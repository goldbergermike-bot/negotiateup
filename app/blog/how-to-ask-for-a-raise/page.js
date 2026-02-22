import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'How to Ask for a Raise: The Complete Playbook — NegotiateUp',
  description: 'Step-by-step guide to asking for a raise. Includes how to build your business case, what to say to your manager, and how to handle every objection.',
  keywords: ['how to ask for a raise', 'asking for a raise', 'salary raise', 'negotiate raise', 'raise negotiation', 'ask for more money'],
  alternates: { canonical: 'https://www.negotiateup.com/blog/how-to-ask-for-a-raise' },
};

function CTA() {
  return (
    <div className="my-10 bg-blue/10 rounded-2xl p-8 text-center border border-blue/20">
      <p className="font-serif text-xl mb-2 text-blue">Want a raise playbook built for YOUR situation?</p>
      <p className="text-sm text-muted mb-4">Get a personalized business case, manager conversation scripts, and objection handling tailored to your company and role.</p>
      <a href="/#pricing" className="inline-block bg-blue text-white px-6 py-3 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-all">
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
          <span className="text-xs font-bold uppercase tracking-wider text-blue bg-blue/10 px-3 py-1 rounded-full">Raises</span>
          <h1 className="font-serif text-3xl md:text-4xl mt-4 mb-3 leading-tight">How to Ask for a Raise: The Complete Playbook</h1>
          <p className="text-muted text-sm">February 9, 2026 · 14 min read</p>
        </div>

        <div className="prose-custom">
          <p className="text-lg text-muted leading-relaxed mb-6">
            Asking for a raise is uncomfortable. But here's what's more uncomfortable: <strong>doing the same work for less than you're worth, year after year.</strong>
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            The people who get raises aren't necessarily the hardest workers. They're the ones who build a compelling case, pick the right moment, and ask with confidence. This guide shows you how to do all three.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 1: Know Your Market Value</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Before you walk into any conversation about money, you need data. Not feelings. Not anecdotes from friends. Actual market compensation data for your role, location, and experience level.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Check Glassdoor, Payscale, Levels.fyi (for tech), LinkedIn Salary Insights, and industry salary surveys. Look at the 50th percentile (median) and 75th percentile for your specific title, city, and years of experience.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            If your current salary is below the 50th percentile, you have a strong market-based argument. If you're between the 50th and 75th, you can still make a case based on performance. If you're above the 75th, focus on promotion or role expansion rather than a raise.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 2: Document Your Accomplishments</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Your manager likely has 5-15 direct reports. They're busy. They don't have a detailed mental ledger of everything you've done in the past year. It's your job to remind them.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Make a list of your key accomplishments since your last raise or review. Focus on things that are quantifiable: revenue generated, costs saved, projects completed, efficiency improved, problems solved. If you can attach a dollar figure or percentage to it, do it.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Also note any responsibilities you've taken on beyond your job description. Managing an intern, leading a project, covering for a colleague on leave — these all demonstrate that your role has expanded beyond what your current salary reflects.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            The goal is to make the case that your compensation hasn't kept pace with your contributions. That's a fair, professional argument that resonates with managers and HR.
          </p>

          <CTA />

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 3: Pick the Right Timing</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Timing can make or break a raise request. There are right moments and wrong moments to ask.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Good times to ask:</strong> after a successful project launch or big win, during performance review season (but before budgets are finalized), after receiving positive feedback or a client compliment, when you've just taken on significant new responsibilities, and when the company is doing well financially.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Bad times to ask:</strong> right after the company announced layoffs or poor earnings, during a crisis or major deadline, when your manager is visibly stressed or dealing with their own issues, or right after a mistake or negative feedback.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            If you're not sure about timing, a good default is 1-2 months before your annual review. This gives your manager time to plan and advocate for you in budget discussions.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 4: Set Up the Conversation</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Don't ambush your manager. Schedule a dedicated meeting and be transparent about the topic. This gives them time to prepare (and mentally adjust to the conversation), and it shows you're treating this professionally.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Here's what to say when setting up the meeting:
          </p>
          <blockquote className="border-l-4 border-blue bg-blue/10 p-4 rounded-r-xl my-6 text-sm text-gray-700 italic">
            "Hi [Manager], I'd love to schedule 20-30 minutes to discuss my role and compensation. I've been reflecting on my contributions and growth over the past year, and I'd value the chance to have that conversation with you. Would [day/time] work?"
          </blockquote>
          <p className="text-gray-700 leading-relaxed mb-6">
            Short, professional, and clear. Don't overthink it.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 5: Have the Conversation</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            This is the part everyone dreads. But with preparation, it becomes a structured conversation, not an awkward plea. Here's the framework:
          </p>
          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Open with context (30 seconds):</strong> "Thanks for taking the time. I've been thinking about my role here and how it's evolved, and I wanted to have an open conversation about my compensation."
          </p>
          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Present your case (2-3 minutes):</strong> Walk through your accomplishments, expanded responsibilities, and market data. Keep it concise and factual. Don't ramble.
          </p>
          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Make the specific ask (10 seconds):</strong> "Based on all of this, I'd like to discuss adjusting my salary to $[specific number]." One number. Not a range.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Then stop talking.</strong> Seriously. Let them respond. The silence might feel uncomfortable, but it gives them space to process and respond thoughtfully.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 6: Handle Objections</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Expect pushback — it doesn't mean no. Here's how to handle the most common objections:
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>"The budget is tight right now."</strong> Respond: "I understand budget constraints. Could we set a specific timeline to revisit — say in 3 months? I'd also be open to discussing a one-time bonus or other adjustments in the meantime."
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>"Let's wait until your next review."</strong> Respond: "I appreciate that. Could we agree on specific goals or milestones that, if met by review time, would support the adjustment I'm asking for? I want to make sure we're aligned on what success looks like."
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>"We need to keep things equitable across the team."</strong> Respond: "I respect that. I'm asking based on my individual market value and contributions, and I trust you to evaluate that fairly. I've taken on [specific responsibilities] that may differentiate my situation."
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>"I need to check with HR."</strong> This is actually a positive sign — it means they're not saying no, they're saying they need to make it happen. Respond: "Of course. Is there anything I can provide to support the conversation — a summary of my contributions or market data?"
          </p>

          <CTA />

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 7: Follow Up</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            After the conversation, send a brief follow-up email thanking your manager for the discussion and summarizing any next steps or timelines that were agreed upon. This creates a paper trail and shows professionalism.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            If they said they need time, give them the time they asked for — then follow up on the agreed date. Don't nag, but don't let it drop either.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">What If They Say No?</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            A "no" to a raise isn't a "no" to your career. First, ask for clarity: "Can you help me understand what would need to change for this to be possible?" This turns a rejection into a roadmap.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Second, negotiate alternatives. A title change, additional PTO, remote work flexibility, a professional development budget, or a guaranteed review timeline can all be valuable even without a salary increase.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Third, if you've been consistently underpaid and the company can't (or won't) adjust, it may be time to explore external opportunities. Sometimes the best raise is the one that comes from a new offer — either to leverage internally or to make a move.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">The Bottom Line</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Asking for a raise isn't greedy. It's professional self-advocacy. Companies set salaries based on what they think they need to pay — not what you're worth. It's your job to close that gap.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            The people who earn the most over their careers aren't just skilled — they're skilled at communicating their value. Start today.
          </p>

          <CTA />
        </div>
      </article>
      <Footer />
    </main>
  );
}
