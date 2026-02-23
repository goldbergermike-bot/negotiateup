import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Salary Negotiation Blog — SalaryPrep',
  description: 'Expert salary negotiation tips, scripts, and strategies. Learn how to negotiate your job offer, ask for a raise, and get paid what you deserve.',
};

const posts = [
  {
    slug: 'first-time-salary-negotiation',
    title: "First-Time Salary Negotiation: A Complete Beginner's Guide",
    excerpt: "Never negotiated before? This beginner-friendly guide walks you through your first salary negotiation step by step, with scripts, templates, and common scenarios.",
    date: 'February 23, 2026',
    readTime: '14 min read',
    tag: 'Beginners',
  },
  {
    slug: 'psychology-of-negotiation',
    title: 'The Psychology of Salary Negotiation: Anchoring, Framing, and Persuasion',
    excerpt: 'Master the psychology behind salary negotiation. Learn how anchoring, framing, loss aversion, and reciprocity can help you negotiate a better offer.',
    date: 'February 22, 2026',
    readTime: '13 min read',
    tag: 'Psychology',
  },
  {
    slug: 'negotiate-internal-transfer',
    title: 'How to Negotiate Salary for an Internal Transfer or Boomerang Role',
    excerpt: "Internal transfers and boomerang hires have unique negotiation dynamics. Learn how to negotiate when moving within your company or returning to a former employer.",
    date: 'February 22, 2026',
    readTime: '12 min read',
    tag: 'Career Growth',
  },
  {
    slug: 'salary-negotiation-engineers',
    title: 'Salary Negotiation for Software Engineers: A Technical Guide',
    excerpt: 'A software engineer-specific guide to salary negotiation. Covers total comp structures at tech companies, leveling, equity, competing offers, and negotiation scripts.',
    date: 'February 21, 2026',
    readTime: '14 min read',
    tag: 'Engineering',
  },
  {
    slug: 'negotiate-during-recession',
    title: 'How to Negotiate Salary During a Recession or Hiring Freeze',
    excerpt: 'Strategies for negotiating salary during economic downturns, layoffs, and hiring freezes. Learn when and how to advocate for yourself in tough market conditions.',
    date: 'February 21, 2026',
    readTime: '12 min read',
    tag: 'Strategy',
  },
  {
    slug: 'negotiate-beyond-salary',
    title: 'Negotiating Beyond Salary: PTO, Signing Bonus, Remote Work & More',
    excerpt: 'Base salary is just one part of total compensation. Learn how to negotiate signing bonuses, PTO, equity, remote work, and other benefits worth more than a raise.',
    date: 'February 20, 2026',
    readTime: '13 min read',
    tag: 'Total Comp',
  },
  {
    slug: 'handle-we-cant-go-higher',
    title: "How to Handle 'We Can't Go Higher' in Salary Negotiations",
    excerpt: "Learn exactly what to say when a company says their offer is final. Scripts and strategies for handling objections, pivoting to other components, and knowing when to accept.",
    date: 'February 20, 2026',
    readTime: '11 min read',
    tag: 'Negotiation',
  },
  {
    slug: 'research-market-value',
    title: 'How to Research Your Market Value Before Negotiating',
    excerpt: 'Learn how to research your market value using salary databases, networking, and frameworks. Build a data-driven case for your next negotiation.',
    date: 'February 20, 2026',
    readTime: '12 min read',
    tag: 'Research',
  },
  {
    slug: 'salary-negotiation-mistakes',
    title: '7 Salary Negotiation Mistakes That Cost You Thousands',
    excerpt: 'Avoid these common salary negotiation mistakes that cost candidates thousands of dollars. Learn what NOT to do and how to fix each mistake with proven strategies.',
    date: 'February 19, 2026',
    readTime: '11 min read',
    tag: 'Negotiation',
  },
  {
    slug: 'how-to-negotiate-promotion',
    title: 'How to Negotiate a Promotion: From Conversation to Offer',
    excerpt: 'Learn how to build your case for a promotion, time the conversation right, and negotiate the title and salary increase you deserve. Includes scripts and templates.',
    date: 'February 19, 2026',
    readTime: '13 min read',
    tag: 'Career Growth',
  },
  {
    slug: 'remote-work-salary-negotiation',
    title: 'How to Negotiate Salary for Remote Work in 2026',
    excerpt: 'Learn how to navigate location-based pay, geo-arbitrage, and remote premiums when negotiating salary for remote positions in 2026.',
    date: 'February 18, 2026',
    readTime: '12 min read',
    tag: 'Remote Work',
  },
  {
    slug: 'equity-stock-options-guide',
    title: 'Understanding Equity & Stock Options: RSUs, ISOs, and Negotiation Strategies',
    excerpt: 'Learn the difference between RSUs, ISOs, and NSOs. Understand vesting schedules, tax implications, and how to negotiate equity as part of your compensation.',
    date: 'February 18, 2026',
    readTime: '14 min read',
    tag: 'Compensation',
  },
  {
    slug: 'when-to-negotiate-salary',
    title: 'When to Negotiate Salary (And When Not To)',
    excerpt: "Not every offer should be negotiated the same way. Learn when to push hard, when to tread carefully, and when to accept gracefully with this decision framework.",
    date: 'February 16, 2026',
    readTime: '11 min read',
    tag: 'Strategy',
  },
  {
    slug: 'negotiate-salary-big-tech',
    title: 'How to Negotiate Salary at Amazon, Google & Big Tech (2026 Guide)',
    excerpt: 'FAANG negotiation is a different game. Learn how to negotiate RSUs, signing bonuses, and total compensation at Amazon, Google, Meta, Apple, and Microsoft.',
    date: 'February 12, 2026',
    readTime: '14 min read',
    tag: 'Big Tech',
  },
  {
    slug: 'how-to-respond-lowball-offer',
    title: 'How to Respond to a Lowball Job Offer (Without Burning the Bridge)',
    excerpt: 'Got an offer that\'s way below expectations? Here\'s exactly what to say, how to counter professionally, and when it\'s time to walk away.',
    date: 'February 12, 2026',
    readTime: '10 min read',
    tag: 'Negotiation',
  },
  {
    slug: 'salary-negotiation-women',
    title: 'Salary Negotiation for Women: Close the Pay Gap With These Strategies',
    excerpt: 'Research-backed negotiation strategies that work. Overcome bias, negotiate confidently, and close the gender pay gap with proven techniques.',
    date: 'February 12, 2026',
    readTime: '11 min read',
    tag: 'Strategy',
  },
  {
    slug: 'get-raise-no-budget',
    title: 'How to Get a Raise When Your Company Says "No Budget"',
    excerpt: '8 proven strategies to get more money, better title, or improved comp — even when your manager says there\'s nothing in the budget.',
    date: 'February 12, 2026',
    readTime: '9 min read',
    tag: 'Raises',
  },
  {
    slug: 'how-to-negotiate-salary-new-job',
    title: 'How to Negotiate Salary on a New Job Offer (2026 Guide)',
    excerpt: 'A step-by-step guide to negotiating your job offer with confidence — including what to say, when to say it, and the exact numbers to ask for.',
    date: 'February 9, 2026',
    readTime: '12 min read',
    tag: 'Job Offers',
  },
  {
    slug: 'counter-offer-email-template',
    title: 'Counter Offer Email Template: Exactly What to Write',
    excerpt: 'Copy-paste email templates for countering a job offer, plus tips on tone, timing, and how to justify your ask without sounding pushy.',
    date: 'February 9, 2026',
    readTime: '8 min read',
    tag: 'Scripts & Templates',
  },
  {
    slug: 'how-to-ask-for-a-raise',
    title: 'How to Ask for a Raise: The Complete Playbook',
    excerpt: 'Everything you need to ask for (and get) a raise — from building your business case to handling every objection your manager might throw at you.',
    date: 'February 9, 2026',
    readTime: '14 min read',
    tag: 'Raises',
  },
];

export default function BlogIndex() {
  return (
    <main>
      <Nav />
      <div className="pt-32 pb-20 px-6 max-w-[800px] mx-auto">
        <div className="text-center mb-14">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Salary Negotiation Blog</h1>
          <p className="text-muted text-lg max-w-[550px] mx-auto">
            Free guides, scripts, and strategies to help you earn what you're worth.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white rounded-2xl p-8 border border-border hover:-translate-y-1 transition-all hover:shadow-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-3 py-1 rounded-full">
                  {post.tag}
                </span>
                <span className="text-xs text-muted">{post.date}</span>
                <span className="text-xs text-muted">·</span>
                <span className="text-xs text-muted">{post.readTime}</span>
              </div>
              <h2 className="font-serif text-xl md:text-2xl mb-2 text-ink">{post.title}</h2>
              <p className="text-muted text-sm leading-relaxed">{post.excerpt}</p>
              <span className="inline-block mt-4 text-accent text-sm font-semibold">
                Read more →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-4">
          <Link href="/quiz" className="bg-white rounded-xl p-6 border border-border hover:border-accent/40 hover:shadow-md transition-all block">
            <span className="text-2xl">🤔</span>
            <h3 className="font-serif text-lg mt-2 mb-1">Am I Underpaid? Quiz</h3>
            <p className="text-muted text-sm">Compare your salary to market data in 60 seconds.</p>
            <span className="text-accent text-sm font-semibold mt-2 inline-block">Take the quiz →</span>
          </Link>
          <Link href="/calculator" className="bg-white rounded-xl p-6 border border-border hover:border-accent/40 hover:shadow-md transition-all block">
            <span className="text-2xl">🎯</span>
            <h3 className="font-serif text-lg mt-2 mb-1">Counter-Offer Calculator</h3>
            <p className="text-muted text-sm">Get the exact number to counter at — free.</p>
            <span className="text-accent text-sm font-semibold mt-2 inline-block">Calculate now →</span>
          </Link>
        </div>

        <div className="mt-12 bg-ink rounded-2xl p-10 text-center">
          <h2 className="font-serif text-2xl text-white mb-3">Skip the research. Get your playbook.</h2>
          <p className="text-white/60 mb-6">
            A personalized negotiation strategy with exact scripts, numbers, and a day-by-day plan.
          </p>
          <a
            href="/#pricing"
            className="inline-block bg-white text-ink px-8 py-3 rounded-xl font-semibold hover:-translate-y-0.5 transition-all"
          >
            Get My Playbook — $39 →
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
