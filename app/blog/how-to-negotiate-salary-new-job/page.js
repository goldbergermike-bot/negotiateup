import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import RelatedCompanyGuides from '../../../components/RelatedCompanyGuides';
import BlogJsonLd from '../../../components/BlogJsonLd';

export const metadata = {
  title: 'How to Negotiate Salary on a New Job Offer (2026 Guide) — SalaryPrep',
  description: 'Learn how to negotiate your job offer step by step. Includes when to negotiate, what to say, how to counter, and scripts you can use today.',
  keywords: ['negotiate salary', 'how to negotiate job offer', 'salary negotiation tips', 'counter offer', 'negotiate compensation'],
  alternates: { canonical: 'https://www.salaryprep.com/blog/how-to-negotiate-salary-new-job' },
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
      <BlogJsonLd
        title="How to Negotiate Salary on a New Job Offer (2026 Guide)"
        description="Learn how to negotiate your job offer step by step. Includes when to negotiate, what to say, how to counter, and scripts you can use today."
        slug="how-to-negotiate-salary-new-job"
        datePublished="2026-02-09"
      />
      <article className="pt-32 pb-20 px-6 max-w-[720px] mx-auto">
        <Link href="/blog" className="text-accent text-sm font-medium mb-6 inline-block">← Back to Blog</Link>

        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-3 py-1 rounded-full">Job Offers</span>
          <h1 className="font-serif text-3xl md:text-4xl mt-4 mb-3 leading-tight">How to Negotiate Salary on a New Job Offer (2026 Guide)</h1>
          <p className="text-muted text-sm">February 9, 2026 · 12 min read</p>
        </div>

        <div className="prose-custom">
          <p className="text-lg text-muted leading-relaxed mb-6">
            You got the offer. Congratulations. Now here's the part nobody teaches you in school: <strong>you're supposed to negotiate.</strong> And no, they won't take the offer away if you do.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Studies consistently show that 73% of employers expect candidates to negotiate. Yet most people accept the first number they're given. The result? They leave anywhere from $5,000 to $15,000 on the table — money that compounds over the course of their career into hundreds of thousands of dollars.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            This guide walks you through the entire process, step by step — from the moment you receive the offer to the moment you sign.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 1: Don't Accept (or Reject) Right Away</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            The single biggest mistake people make is responding to an offer emotionally. You're excited, you're relieved, and every fiber of your body wants to say "yes!" on the spot.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Don't. Instead, express gratitude and buy yourself time. Here's exactly what to say:
          </p>
          <blockquote className="border-l-4 border-accent bg-accent-light/50 p-4 rounded-r-xl my-6 text-sm text-gray-700 italic">
            "Thank you so much — I'm really excited about this opportunity and the team. I'd love to take a couple of days to review the full offer details. Would it be okay if I got back to you by [day]?"
          </blockquote>
          <p className="text-gray-700 leading-relaxed mb-6">
            This is completely normal and expected. No reasonable employer will push back on this. You now have time to research, strategize, and prepare your counter.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 2: Research the Market Rate</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Before you can negotiate, you need to know what the role is actually worth. This is your leverage — numbers, not feelings.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Check these free resources for salary data: Levels.fyi (especially for tech), Glassdoor, Payscale, LinkedIn Salary Insights, and the Bureau of Labor Statistics. Look for the 50th and 75th percentile for your role, location, and experience level.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Pay attention to <strong>total compensation</strong>, not just base salary. Factor in equity, bonuses, signing bonuses, benefits, and PTO. An offer with a lower base but strong equity could be worth significantly more.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 3: Decide What to Ask For</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Based on your research, set three numbers:
          </p>
          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Your target:</strong> The number you'd be happy with. This should be at or above the 50th percentile for your market.
          </p>
          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Your stretch:</strong> The best-case scenario. Usually the 75th percentile or higher. This is the number you actually ask for, because negotiation involves give and take.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Your floor:</strong> The minimum you'd accept. Below this, you walk away (or accept while knowing you'll be looking again soon).
          </p>

          <CTA />

          <div className="my-8 bg-paper rounded-xl p-6 border border-border flex flex-col sm:flex-row items-center gap-4">
            <div className="text-3xl">🎯</div>
            <div className="flex-1 text-center sm:text-left">
              <p className="font-semibold text-sm">Free: Counter-Offer Calculator</p>
              <p className="text-muted text-xs">Enter your offer and get an exact number to counter at.</p>
            </div>
            <a href="/calculator" className="text-accent font-semibold text-sm whitespace-nowrap">Try it free →</a>
          </div>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 4: Make the Counter (Phone or Email)</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            You have two options: negotiate over the phone or over email. Phone is faster and allows for real-time conversation. Email gives you control over your words and creates a paper trail. Both work — choose whichever makes you more comfortable.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Whichever you choose, your counter should include three things: enthusiasm for the role, your specific ask (a number, not a range), and a brief justification based on market data or your qualifications.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Here's a framework for the phone call:
          </p>
          <blockquote className="border-l-4 border-accent bg-accent-light/50 p-4 rounded-r-xl my-6 text-sm text-gray-700 italic">
            "I've had time to review the offer and I'm very excited about joining [Company]. Based on my research into market rates for this role in [location], and given my [X years of experience / specific qualification], I was hoping we could explore a base salary of [$X]. I believe this reflects the value I'll bring to the team, and I'm confident it's within range for this market."
          </blockquote>
          <p className="text-gray-700 leading-relaxed mb-6">
            Then stop talking. Silence is your friend. Let them respond.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 5: Handle Pushback Like a Pro</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Most of the time, the response won't be "no." It'll be something softer — a redirect, a deferral, or a partial yes. Here's how to handle the most common responses:
          </p>
          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>"This is our best offer"</strong> — Respond with: "I understand. Would there be flexibility on other components like the signing bonus, equity, or start date?" Companies often have more flexibility on non-base items.
          </p>
          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>"The budget is set"</strong> — Ask: "If the base is firm, is there room to discuss a performance review at 6 months with a potential adjustment? That way I can demonstrate my value and we can revisit."
          </p>
          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>"We can revisit after 6 months"</strong> — Get it in writing: "I appreciate that. Would it be possible to include that in the offer letter — a guaranteed review at 6 months with a target adjustment of [X]?"
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>"Other candidates accepted at this level"</strong> — Stay calm: "I appreciate the context. I'm evaluating this based on my specific experience and market data, and I want to make sure we start in a place that reflects my expected contribution."
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 6: Look Beyond Base Salary</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            If the base salary truly can't move, you still have leverage on other components. Many companies have separate budgets for different parts of the package. Consider negotiating on: signing bonus, equity or RSUs, annual bonus target or guarantee, extra PTO days, remote work flexibility, professional development budget, relocation assistance, or a title upgrade.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            A $10K signing bonus, one extra week of PTO, and a remote work agreement can be worth more than a $5K bump in base — and can often be approved by the hiring manager without going through a lengthy approval chain.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Step 7: Get It in Writing and Accept</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Once you reach an agreement, ask for an updated offer letter that reflects all the changes. Review it carefully. Then accept with enthusiasm and professionalism.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            And congratulations — you just advocated for yourself and likely added thousands of dollars to your starting compensation. That's a skill that compounds for the rest of your career.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">The Bottom Line</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Negotiation isn't confrontational — it's collaborative. You're not demanding. You're having a professional conversation about fair market value. Companies expect it. Recruiters respect it. And you deserve it.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            The biggest risk isn't negotiating and having the offer rescinded (this almost never happens). The biggest risk is <em>not</em> negotiating and leaving real money on the table for the rest of your career.
          </p>

          <CTA />

          <RelatedCompanyGuides variant="general" />
        </div>
      </article>
      <Footer />
    </main>
  );
}
