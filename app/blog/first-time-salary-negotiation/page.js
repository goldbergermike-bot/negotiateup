import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import Link from 'next/link';

export const metadata = {
  title: "First-Time Salary Negotiation: A Complete Beginner's Guide — SalaryPrep",
  description: "Never negotiated before? This beginner-friendly guide walks you through your first salary negotiation step by step, with scripts, templates, and common scenarios.",
  keywords: ['first time salary negotiation', 'beginner salary negotiation', 'entry level salary negotiation', 'how to negotiate first job', 'new graduate salary negotiation'],
  alternates: { canonical: 'https://www.salaryprep.com/blog/first-time-salary-negotiation' },
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
          <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-3 py-1 rounded-full">Beginners</span>
          <h1 className="font-serif text-3xl md:text-4xl mt-4 mb-3 leading-tight">First-Time Salary Negotiation: A Complete Beginner's Guide</h1>
          <p className="text-muted text-sm">February 23, 2026 · 14 min read</p>
        </div>

        <div className="prose-custom">
          <p className="text-lg text-muted leading-relaxed mb-6">
            If you've never negotiated a salary before, the whole idea might feel terrifying. <strong>What if they take the offer away? What if I ask for too much? What if I look greedy?</strong> These fears are completely normal — and completely unfounded. This guide is designed specifically for first-timers.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            By the end of this article, you'll understand exactly why negotiation is normal, how to prepare, what to say, and how to handle every response. No experience required.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Why You Should Negotiate (Even as a Beginner)</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Let's address the fear first: <strong>companies do not rescind offers because you negotiate.</strong> It almost never happens. Negotiation is a normal, expected part of the hiring process. Recruiters and hiring managers deal with it every day. They've already budgeted for it.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Most employers build room for negotiation into their initial offers. The first number they give you is almost never the most they're willing to pay. It's a starting point.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Now consider the math: your starting salary is the foundation for every future raise, bonus, and retirement contribution. A single successful negotiation that increases your starting salary compounds over your entire career. Even a modest increase at the start can translate into significant additional lifetime earnings.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            You don't need to be a master negotiator. You just need to ask, back it up with data, and be professional about it. That's the entire formula.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 1: Get the Offer (and Don't Say Yes Yet)</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            When you receive the offer — whether by phone, email, or in person — your first job is to express genuine enthusiasm and buy yourself time. Do not accept, reject, or counter on the spot. Here's exactly what to say:
          </p>

          <blockquote className="border-l-4 border-accent bg-accent-light/50 p-4 rounded-r-xl my-6 text-sm text-gray-700 italic">
            "Thank you so much — I'm really excited about this opportunity! I'd love to take a couple of days to review everything carefully. Would it be okay if I got back to you by [specific day, 2-3 business days out]?"
          </blockquote>

          <p className="text-gray-700 leading-relaxed mb-4">
            This is completely normal and expected. No reasonable employer will push back. You've just given yourself the time you need to research, think, and prepare.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            If the offer comes by phone, ask for it in writing: "Could you send me the details in an email so I can review everything? I want to make sure I understand the full picture." This ensures you have all the numbers in front of you.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 2: Understand the Full Offer</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Before you can negotiate, you need to understand what you're negotiating. A job offer isn't just a salary — it's a package. Here are the components to look at:
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Base salary:</strong> Your annual gross pay. This is the number most people focus on.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Bonus:</strong> Some companies offer an annual target bonus (e.g., "10% target"). Ask whether it's guaranteed or performance-based.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Signing bonus:</strong> A one-time lump sum paid when you start. Very negotiable.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Equity:</strong> Stock options (startups) or RSUs (public companies). These can be worth a lot or very little. Read our <Link href="/blog/equity-stock-options-guide" className="text-accent underline">equity guide</Link> to understand what you're being offered.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>PTO:</strong> How many vacation days, sick days, and holidays?
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Benefits:</strong> Health insurance (and how much you pay), dental, vision, 401(k) match, life insurance, etc.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Other perks:</strong> Remote work, flexible hours, professional development budget, relocation assistance, commuter benefits.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Write it all down. Understanding the full package helps you identify which components are most important to you — and which ones might have room to move.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 3: Research the Market</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            This is the most important step. You need to know what the role is worth so your negotiation is grounded in data, not guesswork.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Spend 30 minutes checking these free resources:
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Glassdoor:</strong> Search for the exact role and company. Look at the salary range, not just the average.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Levels.fyi:</strong> The best resource for tech roles. Shows total compensation by company, level, and location.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Payscale:</strong> Enter your profile details to get a personalized salary report with percentiles.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>LinkedIn Salary:</strong> Salary insights based on your title, location, and experience.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Job postings:</strong> Many states now require salary ranges in postings. Browse current listings for similar roles.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Also use our free <Link href="/quiz" className="text-accent underline">Am I Underpaid? quiz</Link> and <Link href="/calculator" className="text-accent underline">Counter-Offer Calculator</Link> to help benchmark your offer.
          </p>

          <CTA />

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 4: Set Your Three Numbers</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Based on your research, determine three numbers before you negotiate:
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Your stretch (the number you ask for):</strong> This should be above your target — typically at or near the 75th percentile for the role. It gives room for the company to negotiate down to a number you're still happy with. This is the number you actually say out loud.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Your target (what you'd be happy with):</strong> The number that would make you feel good about the offer. Usually around the 50th to 60th percentile for someone at your experience level.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Your floor (the minimum you'd accept):</strong> Below this number, you walk away (or accept knowing you'll be looking for something better soon). Set this before the conversation so emotions don't cloud your judgment.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 5: Make the Ask</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            This is the part that scares people, but it's actually simple. You need three things: enthusiasm, a specific number, and a brief justification. Here's the formula:
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Express enthusiasm:</strong> "I'm really excited about this role and the team."
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>State your ask:</strong> "Based on my research, I was hoping we could discuss a base salary of $[stretch number]."
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Justify briefly:</strong> "This aligns with the market rate for this role in [location], and I believe it reflects the value I'd bring with my [relevant experience/skills]."
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Then stop talking. That's it. Let them respond.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Here's the full script for a phone call:
          </p>

          <blockquote className="border-l-4 border-accent bg-accent-light/50 p-4 rounded-r-xl my-6 text-sm text-gray-700 italic">
            "Hi [Name], thanks for making time to chat. I've reviewed the offer and I'm genuinely excited about joining the team. I'd love to discuss the compensation a bit. Based on my research into market rates for this role in [location], I was hoping we could explore a base salary of $[number]. I think this reflects the market and the value I'd bring, especially given my [specific qualification]. Is there flexibility there?"
          </blockquote>

          <p className="text-gray-700 leading-relaxed mb-4">
            If you prefer email, here's a template:
          </p>

          <blockquote className="border-l-4 border-accent bg-accent-light/50 p-4 rounded-r-xl my-6 text-sm text-gray-700 italic">
            "Hi [Name],

            Thank you again for the offer — I'm very excited about the opportunity to join [Company] and the [Team] team.

            I've taken some time to review the details, and I'd like to discuss the base salary. Based on my research into market rates for this role in [location], I believe a base of $[number] would be more closely aligned with the market. I'm confident in the value I'll bring, especially with my experience in [relevant skill or achievement].

            I'd love to discuss this further. Is there flexibility on the base, or are there other components we could explore?

            Looking forward to hearing from you."
          </blockquote>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 6: Handle the Response</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            There are really only four possible responses. Here's how to handle each:
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>"Yes, we can do that."</strong> Great! Express thanks and confirm you'd like to see the updated offer in writing. Don't keep negotiating after they say yes.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>"We can meet you partway."</strong> Evaluate the counter. If it's at or above your target, accept with enthusiasm. If it's between your target and your floor, consider accepting or making one more ask: "Thank you — I appreciate you working on that. Is there any flexibility on a signing bonus to help close the remaining gap?"
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>"We can't move on base, but..."</strong> They may offer alternatives: a signing bonus, more equity, extra PTO, or a faster review cycle. Evaluate these against your priorities. Many of these can be worth as much as or more than a base salary increase.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>"This is our final offer."</strong> If the offer meets your floor, accept gracefully. If it's below your floor, you have a decision to make — but at least you've made an informed one. Read our guide on <Link href="/blog/handle-we-cant-go-higher" className="text-accent underline">handling "we can't go higher"</Link> for detailed strategies.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Common First-Timer Fears (Debunked)</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>"They'll rescind the offer."</strong> This virtually never happens when you negotiate respectfully. Companies invest significant time and money in the hiring process. They're not going to start over because you asked a professional question about compensation.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>"They'll think I'm greedy."</strong> They won't. Recruiters expect negotiation. Hiring managers respect it. Asking for fair market compensation is a sign of self-awareness and professionalism, not greed.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>"I don't have enough experience to negotiate."</strong> You don't need 20 years of experience. You need data about what the role pays and a professional way to ask. That's it. Even entry-level candidates can and should negotiate.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>"I should just be grateful for the offer."</strong> You can be grateful and advocate for yourself at the same time. Gratitude and negotiation aren't mutually exclusive. You're not demanding — you're having a conversation about fair compensation.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>"I don't know what to say."</strong> Use the scripts above. Literally copy them. Practice them out loud a few times. The words matter less than you think — what matters is that you ask.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Special Situations for First-Timers</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>New graduate / first job ever.</strong> You can still negotiate. Research entry-level salaries for your specific role, degree, and location. Even at standardized entry-level programs, there may be flexibility on signing bonus, start date, or relocation. And if the offer is truly non-negotiable, at least you'll know.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Career changer.</strong> If you're switching fields, the company may try to anchor to your old, lower salary. Redirect: "My compensation in [old field] isn't reflective of the market rate for [new role]. Based on my research, the range for this position is $X to $Y." Your old salary is irrelevant.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Internship to full-time conversion.</strong> If you're converting from an intern, the company knows you well — use that to your advantage. "Given my performance during the internship, including [specific contributions], I'd like to discuss starting my full-time role at the higher end of the range." Your track record is your strongest argument.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">The One-Page Checklist</h2>

          <p className="text-gray-700 leading-relaxed mb-2">
            1. Receive the offer and say thank you. Ask for 2-3 days to review.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            2. Get the offer in writing with all components listed.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            3. Research the market rate (30 minutes, multiple sources).
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            4. Set your three numbers: stretch, target, floor.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            5. Call or email with your ask: enthusiasm + specific number + brief justification.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            6. Handle the response using the scripts above.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            7. Get the final agreement in writing.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            8. Accept with enthusiasm and celebrate.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">The Bottom Line</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Your first salary negotiation doesn't need to be perfect. It just needs to happen. The fact that you're reading this article means you're already more prepared than most people are for their first negotiation.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Remember: the worst case scenario is they say "this is our best offer" and you decide whether to accept. The best case is you walk away with thousands of dollars more — money that compounds over your entire career. The only guaranteed bad outcome is not asking at all.
          </p>

          <CTA />
        </div>
      </article>
      <Footer />
    </main>
  );
}
