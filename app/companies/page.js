import { getCompaniesIndex } from '../../lib/companies-index';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import CompaniesDirectory from '../../components/CompaniesDirectory';

export default function CompaniesIndex() {
  const companiesIndex = getCompaniesIndex();

  return (
    <main>
      <Nav />

      {/* Hero */}
      <section className="pt-28 pb-12 px-6 text-center" style={{ borderBottom: '1px solid var(--border)' }}>
        <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">Company Guides</p>
        <h1 className="font-serif text-3xl md:text-5xl leading-tight mb-4">
          Salary Negotiation Guides<br />by Company
        </h1>
        <p className="text-muted text-lg max-w-[600px] mx-auto mb-8">
          {companiesIndex.length}+ companies. 4,400+ role-specific guides. Compensation data, negotiation scripts, and insider strategies.
        </p>

        <CompaniesDirectory companies={companiesIndex} />
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-accent text-white text-center">
        <div className="max-w-[600px] mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl mb-4">Don&apos;t See Your Company?</h2>
          <p className="text-white/80 text-lg mb-8">
            Our personalized playbook works for any company. Just enter your offer details and get custom negotiation strategy in under 10 minutes.
          </p>
          <a
            href="/#pricing"
            className="inline-block bg-white text-accent px-10 py-4 rounded-xl font-bold text-lg hover:-translate-y-0.5 transition-all shadow-lg"
          >
            Get Your Playbook &rarr;
          </a>
          <p className="text-white/60 text-sm mt-4">Works for any company &middot; Money-back guarantee</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
