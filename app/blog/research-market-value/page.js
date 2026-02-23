import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'How to Research Your Market Value Before Negotiating — SalaryPrep',
  description: 'Learn how to research your market value using salary databases, networking, and frameworks. Build a data-driven case for your next negotiation.',
  keywords: ['research market value', 'salary research', 'what am I worth', 'market rate salary', 'salary benchmarking', 'salary data sources'],
  alternates: { canonical: 'https://www.salaryprep.com/blog/research-market-value' },
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
          <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-3 py-1 rounded-full">Research</span>
          <h1 className="font-serif text-3xl md:text-4xl mt-4 mb-3 leading-tight">How to Research Your Market Value Before Negotiating</h1>
          <p className="text-muted text-sm">February 20, 2026 · 12 min read</p>
        </div>

        <div className="prose-custom">
          <p className="text-lg text-muted leading-relaxed mb-6">
            The single biggest advantage you can have in a salary negotiation isn't charm, confidence, or a slick script — <strong>it's data</strong>. When you know exactly what your role is worth in your market, you negotiate from a position of strength. Without that data, you're guessing.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            This guide walks you through every method, tool, and framework for researching your market value — so you walk into your next negotiation with numbers, not feelings.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Why Market Research Is Non-Negotiable</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Here's what happens without research: you get an offer, you don't know if it's good or bad, so you either accept it (potentially leaving money on the table) or throw out a random counter that isn't grounded in reality (potentially annoying the hiring manager or underselling yourself).
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            With research, you transform the conversation. Instead of "I want more," you say "The market rate for this role is $X to $Y based on data from multiple sources, and here's where I believe I should fall in that range." One of these approaches is a negotiation. The other is a complaint.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Good research also gives you confidence. If you know the offer is below market, you don't have to feel guilty about asking for more. If the offer is above market, you can accept with peace of mind. Either way, you make an informed decision.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">The Best Salary Research Tools (And How to Use Them)</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            No single data source is perfect. Each has strengths and weaknesses. Use multiple sources and triangulate the data for the most accurate picture.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Levels.fyi</strong> — The gold standard for tech compensation data. Includes base salary, equity, bonus, and total compensation broken down by company, level, and location. Self-reported by employees and verified where possible. If you're in tech, start here.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Glassdoor Salary</strong> — Broad coverage across industries and roles. Data is self-reported by employees. Best for getting a general range, though accuracy can vary. Filter by company, location, title, and years of experience.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Payscale</strong> — Offers detailed reports based on your specific profile (role, experience, location, skills, education). Their reports include percentiles, which are extremely useful for negotiation.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>LinkedIn Salary Insights</strong> — Provides salary ranges based on LinkedIn's data, filtered by title, location, and experience. Useful for directional information and understanding how companies compare.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Bureau of Labor Statistics (BLS)</strong> — Government data on occupational employment and wages. Highly reliable but updated less frequently and less granular for specific tech roles. Best for getting baseline data on broad job categories.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Salary.com</strong> — Compensation data from HR-sourced surveys. More employer-facing but useful for understanding how companies set pay bands.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>SalaryPrep</strong> — Use our free <Link href="/report" className="text-accent underline">salary report tool</Link> for company-specific data and our <Link href="/calculator" className="text-accent underline">Counter-Offer Calculator</Link> to determine the right number to ask for based on your situation.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">The Four Variables That Determine Your Market Value</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Your market value isn't a single number — it's a range determined by four key variables. Understanding these helps you figure out where you should fall within that range.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>1. Role and level.</strong> A "Product Manager" at one company might be an entry-level position. At another, it could be a senior role. Pay attention to the actual level (L3, L4, Senior, Staff, etc.) and the responsibilities, not just the title. Two jobs with the same title can have wildly different compensation.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>2. Location (or pay zone).</strong> Geography still matters, even in a remote world. San Francisco, New York, and Seattle command premium salaries. Smaller markets pay less for the same role. Some companies use pay zones or tiers. Others pay a flat national rate. Know which model the company uses.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>3. Experience and skills.</strong> Years of experience matter, but specific skills matter more. A software engineer with machine learning expertise typically earns more than one with the same years of experience in a more common specialty. Certifications, degrees, and specialized training can also move you up within a range.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>4. Company type and size.</strong> Large public companies, well-funded startups, and consulting firms tend to pay more than small businesses, non-profits, and government agencies. Industry matters too: finance and tech generally pay more than education and healthcare for equivalent roles.
          </p>

          <CTA />

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">The Network Method: Talking to Real People</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Salary databases are a great starting point, but talking to actual people in similar roles gives you the most nuanced, current, and accurate data. Here's how to do it without making it awkward.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Ask peers in your network.</strong> You don't have to ask "What do you make?" directly. Instead, try: "I'm evaluating an offer and trying to calibrate the market. For a [role] at [type of company] in [location], does a total comp range of $X to $Y sound right to you?" People are usually comfortable confirming or correcting a range, even if they wouldn't volunteer their exact number.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Join professional communities.</strong> Many industries have Slack groups, Discord servers, subreddits, and professional associations where compensation is discussed openly. Blind (the anonymous professional network) is particularly popular in tech for salary discussions.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Talk to recruiters.</strong> Even if you're not actively looking, building relationships with recruiters in your field gives you access to real-time market data. They know what companies are paying because they place people there. Ask: "What are you seeing for [role] at [level] in [market]?"
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Look at job postings.</strong> Many states and cities now require salary ranges in job postings. Even if you're not applying, browsing current postings for similar roles gives you a live view of what companies are willing to pay right now.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Understanding Percentiles (And Where You Should Aim)</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Most salary data is presented in percentiles. Here's what they mean and how to use them in your negotiation:
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>25th percentile:</strong> Below average for the market. You'd typically see this for entry-level candidates, those switching careers, or roles at companies that underpay relative to market.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>50th percentile (median):</strong> The middle of the market. This is a fair and competitive rate for someone with solid experience and qualifications for the role. Most companies aim to pay around the median.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>75th percentile:</strong> Above average. Appropriate for candidates with strong experience, in-demand skills, or those negotiating with multiple offers. This is often a good target for your initial ask.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>90th percentile:</strong> Top of market. Reserved for exceptional candidates, scarce specializations, or premium-paying employers. Aiming here requires strong justification — but it's not unreasonable if you have rare skills or competing offers from top-paying companies.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Building Your Market Value Summary</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Before you negotiate, compile your research into a simple one-page summary. This document is for your own reference — you probably won't share it directly, but it arms you with confidence and talking points. Include:
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Your target role and level:</strong> Be specific. "Senior Product Manager, L5, at a mid-to-large SaaS company."
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Location/pay zone:</strong> The market you're benchmarking against.
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Data from 3+ sources:</strong> Note the 50th and 75th percentile from each source. If they converge, you have a strong data point. If they diverge, dig into why (different definitions of the role, different company types, etc.).
          </p>

          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Your three numbers:</strong> Your floor (minimum you'd accept), your target (the realistic good outcome), and your stretch (the aspiration you actually ask for in the negotiation).
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Your differentiators:</strong> What justifies you being at the higher end of the range? Specific skills, certifications, accomplishments, or competing offers.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">How to Use Market Data in the Negotiation</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Having the data is step one. Using it effectively is step two. Here's how to weave your research into the negotiation conversation without sounding like a spreadsheet:
          </p>

          <blockquote className="border-l-4 border-accent bg-accent-light/50 p-4 rounded-r-xl my-6 text-sm text-gray-700 italic">
            "I've done quite a bit of research on market rates for this role, looking at data from Levels.fyi, Glassdoor, and conversations with peers in similar positions. The market range I'm seeing is $X to $Y for someone at my level in this area. Given my [specific experience or qualifications], I believe $Z is a fair and competitive number. I'd love to discuss how we can get there."
          </blockquote>

          <p className="text-gray-700 leading-relaxed mb-6">
            Notice the structure: you cite your sources (without being exhaustive), you give the range, you position yourself within it with justification, and you invite collaboration. This is professional, data-driven, and hard to argue with.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">Common Research Mistakes to Avoid</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Using only one data source.</strong> Any single source can be skewed. Always cross-reference at least three.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Comparing the wrong roles.</strong> Job titles are inconsistent across companies. A "Director" at a 50-person startup is very different from a "Director" at Google. Match on responsibilities and scope, not just title.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Ignoring total compensation.</strong> Base salary is just one component. An offer with a lower base but strong equity, bonus, and benefits could be worth significantly more in total compensation. Always compare apples to apples.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Using outdated data.</strong> The market moves fast. Data from two or three years ago may not reflect current conditions, especially in fast-moving industries like tech. Look for data points from the last 12 months.
          </p>

          <h2 className="font-serif text-2xl mt-10 mb-4 text-ink">The Bottom Line</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Thirty minutes of research can be worth thousands of dollars. There's no excuse for going into a salary negotiation without data — the tools are free, the data is abundant, and the payoff is enormous.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Do the research. Know your number. And walk into the conversation knowing exactly what you're worth.
          </p>

          <CTA />
        </div>
      </article>
      <Footer />
    </main>
  );
}
