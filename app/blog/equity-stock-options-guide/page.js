import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Understanding Equity & Stock Options: RSUs, ISOs, and Negotiation Strategies — SalaryPrep',
  description: 'Learn the difference between RSUs, ISOs, and NSOs. Understand vesting schedules, tax implications, and how to negotiate equity as part of your compensation package.',
  keywords: ['stock options negotiation', 'RSU vs ISO', 'equity compensation', 'negotiate equity', 'vesting schedule', 'stock options guide'],
  alternates: { canonical: 'https://www.salaryprep.com/blog/equity-stock-options-guide' },
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
          <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-3 py-1 rounded-full">Compensation</span>
          <h1 className="font-serif text-3xl md:text-4xl mt-4 mb-3 leading-tight">Understanding Equity & Stock Options: RSUs, ISOs, and Negotiation Strategies</h1>
          <p className="text-muted text-sm">February 18, 2026 · 14 min read</p>
        </div>

        <div className="prose-custom">
          <p className="text-lg text-muted leading-relaxed mb-6">
            Equity can be the most valuable part of your compensation — or it can be worth nothing. <strong>The difference depends on understanding what you're being offered and how to negotiate it.</strong> This guide breaks down every type of equity compensation, explains how vesting works, and gives you the negotiation strategies to maximize your package.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Whether you're joining a pre-IPO startup or a public FAANG company, equity works differently — and your negotiation strategy should too.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">The Four Types of Equity Compensation</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Restricted Stock Units (RSUs)</strong> are the most common equity type at public companies. An RSU is a promise to give you shares of company stock on a set schedule. You don't buy them — they're granted to you. When they vest, they're taxed as ordinary income at their market value on that date. RSUs are straightforward: their value is directly tied to the stock price. If the company's stock is worth $150 when your RSUs vest, each RSU is worth $150 minus taxes.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Incentive Stock Options (ISOs)</strong> give you the right to buy company stock at a predetermined price (the "strike price" or "exercise price"). ISOs are typically offered by startups and private companies. The potential upside is huge: if you join early, your strike price might be $1 per share, and if the company goes public at $50, each option is worth $49. ISOs also get favorable tax treatment — if you hold the shares long enough, your gains are taxed at the long-term capital gains rate rather than as ordinary income.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Non-Qualified Stock Options (NSOs or NQSOs)</strong> work similarly to ISOs but with different tax treatment. When you exercise NSOs, the difference between the strike price and the current market value (the "spread") is taxed as ordinary income. NSOs are more common for contractors, advisors, and sometimes late-stage hires. They're less tax-advantaged than ISOs but more flexible.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Restricted Stock Awards (RSAs)</strong> are actual shares (not units or options) granted to you upfront, often subject to a vesting schedule and a buyback clause. These are most common at very early-stage startups. The advantage is that you can file an 83(b) election to be taxed on the value at grant (which is usually very low), and all future appreciation is taxed at capital gains rates.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Understanding Vesting Schedules</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Almost all equity compensation vests over time — meaning you earn it gradually. The most common schedule is <strong>four years with a one-year cliff</strong>. Here's what that means:
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>The cliff:</strong> You receive nothing for the first 12 months. On your one-year anniversary, 25% of your total grant vests all at once. This protects the company from giving equity to someone who leaves after a month.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Monthly or quarterly vesting:</strong> After the cliff, the remaining 75% vests in equal installments, typically monthly or quarterly, over the next three years.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Variations to watch for:</strong> Some companies use three-year vesting. Amazon famously uses a back-loaded vesting schedule (5% year one, 15% year two, 40% year three, 40% year four). Others may have a two-year cliff. Always read the fine print.
          </p>

          <CTA />

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">How to Value Equity in an Offer</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Valuing RSUs at a public company is relatively simple: multiply the number of shares by the current stock price, divide by the vesting period in years, and that's your annual equity value (before taxes). Of course, the stock price will fluctuate, but you can use the current price as a reasonable baseline.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Valuing startup equity is much harder. Here are the key questions to ask:
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>What is the latest 409A valuation (fair market value)?</strong> This determines your strike price for options. It's also your best estimate of current share value.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>How many total shares are outstanding?</strong> Knowing you have 10,000 options is meaningless without knowing the total. If there are 10 million shares outstanding, you own 0.1%. If there are 100 million, you own 0.01%. Ask for the percentage ownership your grant represents, fully diluted.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>What was the last funding round valuation?</strong> If the company raised at a $500 million valuation and you own 0.01%, your stake is theoretically worth $50,000 — but only if the company reaches a liquidity event at or above that valuation.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>What's the liquidation preference stack?</strong> In a sale, investors with preferred shares get paid before common shareholders. If the company raised $200M in funding with 1x liquidation preferences, the first $200M of any sale goes to investors before employees see a penny.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Is there a path to liquidity?</strong> Equity is only worth something if you can eventually sell it. Ask about IPO timeline, acquisition interest, or secondary sale programs for employees.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">How to Negotiate Equity</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Equity is often more negotiable than base salary, especially at public companies where there's no budget constraint — just stock. Here are the levers to pull:
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Ask for more shares.</strong> The simplest approach. "I'm excited about the offer. Would the team be open to increasing the RSU grant from X to Y shares? Based on my research and the level for this role, I believe that would be more aligned with market."
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Negotiate the vesting schedule.</strong> You may be able to negotiate a shorter vesting period, elimination of the cliff (especially if you're a senior hire), or an accelerated vesting schedule on change of control (meaning your equity vests immediately if the company is acquired).
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Request a sign-on equity grant.</strong> Some companies offer a one-time additional equity grant on top of the standard package, especially if you're leaving unvested equity at your current employer.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Negotiate the post-termination exercise period for options.</strong> The standard window to exercise options after leaving a company is 90 days. This can force you to come up with significant cash (and tax liability) shortly after leaving a job. Ask for an extended exercise window — 1, 3, or even 10 years. Some companies offer this for ISOs by converting them to NSOs after 90 days.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Ask about refresh grants.</strong> At public companies, you should ask about the company's refresh grant policy — annual additional equity grants given to existing employees. A generous refresh policy (50-100% of initial annual vesting value) can significantly boost your long-term compensation.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Tax Implications You Need to Know</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Equity taxation is complicated, and mistakes can be very expensive. Here are the essentials:
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>RSUs:</strong> Taxed as ordinary income when they vest. The company typically withholds shares to cover the tax. You then owe capital gains taxes on any appreciation from the vesting date to the sale date.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>ISOs:</strong> No regular income tax at exercise (though the spread may trigger Alternative Minimum Tax, or AMT). If you hold the shares for at least one year after exercise and two years after grant, the entire gain is taxed at long-term capital gains rates.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>NSOs:</strong> The spread at exercise is taxed as ordinary income. Any additional gain after exercise is taxed at capital gains rates.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>83(b) election:</strong> If you receive restricted stock (RSAs) at an early-stage startup, filing an 83(b) election within 30 days of grant allows you to pay taxes on the current value (often pennies) and have all future gains taxed at capital gains rates. This is a critical move for early-stage employees — missing the 30-day window cannot be undone.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Startup Equity Red Flags</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Not all equity is created equal. Watch out for these warning signs:
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            The company won't tell you the total shares outstanding or your percentage ownership.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            The exercise window after leaving is only 90 days with a high strike price, potentially forcing you to stay longer than you want.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            There's no clear path to liquidity — no IPO plans, no acquisition interest, no secondary sale program.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            Heavy liquidation preferences that would wipe out common shareholders in anything other than a blockbuster exit.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            The company has been around for 8+ years with no liquidity event and continues to raise funding at flat or declining valuations.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Scripts for Negotiating Equity</h2>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Asking for more shares at a public company:</strong>
          </p>

          <blockquote className="border-l-4 border-accent bg-accent-light/50 p-4 rounded-r-xl my-6 text-sm text-gray-700 italic">
            "I'm really excited about the offer and the team. I'd like to discuss the equity component. Based on my research into total compensation for this level, and given that I'm leaving unvested equity at my current company, I was hoping we could explore increasing the RSU grant to [X shares]. Would that be possible?"
          </blockquote>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Asking about equity details at a startup:</strong>
          </p>

          <blockquote className="border-l-4 border-accent bg-accent-light/50 p-4 rounded-r-xl my-6 text-sm text-gray-700 italic">
            "I'm excited about the option grant. To help me evaluate it fully, could you share the total number of shares outstanding on a fully diluted basis, the current 409A valuation, and the company's latest preferred share price from the most recent round?"
          </blockquote>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">The Bottom Line</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Equity is a powerful wealth-building tool — but only if you understand what you're getting. Don't treat it as "bonus" money that you don't need to evaluate carefully. Ask the hard questions, value it realistically, and negotiate it just as aggressively as you would base salary.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            And remember: the best equity negotiation is one informed by data. Use our <Link href="/report" className="text-accent underline">salary report tool</Link> and <Link href="/calculator" className="text-accent underline">counter-offer calculator</Link> to understand total compensation benchmarks before you sit down at the table.
          </p>

          <CTA />
        </div>
      </article>
      <Footer />
    </main>
  );
}
