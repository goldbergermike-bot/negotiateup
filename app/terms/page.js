import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Terms of Service — SalaryPrep',
  description: 'SalaryPrep terms of service. Usage terms, refund policy, and disclaimers.',
  alternates: { canonical: 'https://www.salaryprep.com/terms' },
};

export default function TermsPage() {
  return (
    <main>
      <Nav />
      <article className="pt-32 pb-20 px-6 max-w-[720px] mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl mb-6">Terms of Service</h1>
        <p className="text-muted text-sm mb-8">Last updated: February 2026</p>

        <div className="space-y-6 text-gray-700 leading-relaxed text-sm">
          <section>
            <h2 className="font-serif text-xl mb-2 text-ink">Service Description</h2>
            <p>SalaryPrep provides AI-generated salary negotiation playbooks delivered as PDF documents via email. Each playbook is personalized based on the information you provide at the time of purchase.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-2 text-ink">Payment & Pricing</h2>
            <p>Playbooks are sold as a one-time purchase at the price displayed at checkout. All payments are processed securely through Stripe. Prices are in USD and may be subject to change.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-2 text-ink">Money-Back Guarantee</h2>
            <p>We offer a 100% money-back guarantee within 7 days of purchase. If you are not satisfied with your playbook for any reason, contact us for a full refund. No questions asked.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-2 text-ink">Disclaimer</h2>
            <p>SalaryPrep playbooks are for informational and educational purposes only. They do not constitute legal, financial, or employment advice. Compensation data and market estimates are AI-generated approximations and may not reflect exact current market conditions. Results of any salary negotiation depend on many factors beyond our control.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-2 text-ink">Intellectual Property</h2>
            <p>The playbook you purchase is for your personal use only. You may not resell, redistribute, or publish the contents of your playbook. SalaryPrep retains all rights to the playbook format, templates, and branding.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-2 text-ink">Limitation of Liability</h2>
            <p>SalaryPrep is not liable for the outcome of any salary negotiation. Our maximum liability is limited to the amount you paid for the playbook. We are not responsible for decisions made based on playbook content.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-2 text-ink">Contact</h2>
            <p>For questions about these terms, please contact us by replying to your playbook delivery email.</p>
          </section>
        </div>
      </article>
      <Footer />
    </main>
  );
}
