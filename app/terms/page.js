import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Terms of Service — SalaryPrep',
  description: 'SalaryPrep terms of service. Read the terms and conditions for using our salary negotiation playbook service.',
};

export default function TermsPage() {
  return (
    <main>
      <Nav />
      <div className="pt-32 pb-20 px-6 max-w-[800px] mx-auto">
        <div className="text-center mb-14">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Terms of Service</h1>
          <p className="text-muted text-sm">Last updated: February 23, 2026</p>
        </div>

        <div className="space-y-8">
          {/* Intro */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <p className="text-muted leading-relaxed">
              Welcome to SalaryPrep. These Terms of Service (&quot;Terms&quot;) govern your use of
              the SalaryPrep website and services at{' '}
              <a href="https://www.salaryprep.com" className="text-accent font-medium hover:underline">
                salaryprep.com
              </a>{' '}
              (&quot;Service&quot;). By purchasing a playbook or using our Service, you agree to
              be bound by these Terms. If you do not agree, please do not use the Service.
            </p>
          </div>

          {/* Service Description */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-2xl mb-4">Service Description</h2>
            <p className="text-muted leading-relaxed">
              SalaryPrep provides personalized salary negotiation playbooks generated using
              artificial intelligence. Each playbook is a digital product (PDF) delivered to your
              email, containing AI-generated negotiation strategies, scripts, market data
              analysis, and recommendations tailored to the information you provide.
            </p>
          </div>

          {/* Payment Terms */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-2xl mb-4">Payment Terms</h2>
            <ul className="space-y-3 text-muted leading-relaxed">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  Each playbook is a <strong className="text-ink">one-time purchase of $39 USD</strong> (before
                  any applicable discount codes).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  There are no subscriptions, recurring charges, or hidden fees.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  All payments are processed securely through Stripe. We do not store your credit
                  card or payment details on our servers.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  Prices may change at any time, but changes will not affect orders already placed.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  Promotional discount codes may be offered at our discretion and may be subject
                  to expiration or usage limits.
                </span>
              </li>
            </ul>
          </div>

          {/* Refund Policy */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-2xl mb-4">Refund Policy</h2>
            <div className="p-4 bg-accent-light rounded-xl mb-4">
              <p className="text-sm text-accent font-medium">
                We offer a 7-day money-back guarantee. No questions asked.
              </p>
            </div>
            <ul className="space-y-3 text-muted leading-relaxed">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  If you are not satisfied with your playbook for any reason, you may request a
                  full refund within <strong className="text-ink">7 days of purchase</strong>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  To request a refund, email us at{' '}
                  <a href="mailto:support@salaryprep.com" className="text-accent hover:underline">
                    support@salaryprep.com
                  </a>{' '}
                  with your order details.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  Refunds are processed through Stripe and typically appear within 5-10 business
                  days.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>You may keep the playbook even after a refund has been issued.</span>
              </li>
            </ul>
          </div>

          {/* AI-Generated Content Disclaimer */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-2xl mb-4">AI-Generated Content Disclaimer</h2>
            <div className="p-4 bg-warm-light rounded-xl mb-4">
              <p className="text-sm text-ink font-medium">
                Important: SalaryPrep playbooks contain AI-generated content. They do not
                constitute legal, financial, or professional advice.
              </p>
            </div>
            <ul className="space-y-3 text-muted leading-relaxed">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  Playbooks are generated using artificial intelligence (Claude by Anthropic)
                  based on the information you provide and publicly available market data.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  AI-generated content may contain inaccuracies, outdated information, or
                  recommendations that may not be suitable for your specific situation.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  Salary figures, market data, and negotiation outcomes referenced in your
                  playbook are estimates and are <strong className="text-ink">not guaranteed</strong>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  You should use the playbook as a starting point and exercise your own judgment
                  when making career and financial decisions.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  For legal or financial advice specific to your situation, we recommend
                  consulting with a qualified professional.
                </span>
              </li>
            </ul>
          </div>

          {/* Acceptable Use */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-2xl mb-4">Acceptable Use</h2>
            <p className="text-muted leading-relaxed mb-4">
              By using SalaryPrep, you agree not to:
            </p>
            <ul className="space-y-3 text-muted leading-relaxed">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  Provide false or misleading information when generating a playbook.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  Resell, redistribute, or publicly share the contents of your playbook as your
                  own work.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  Use the Service to harass, defame, or harm others.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  Attempt to reverse-engineer, scrape, or interfere with the Service&apos;s
                  operation.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  Use automated tools or bots to access the Service without our written
                  permission.
                </span>
              </li>
            </ul>
            <p className="text-muted leading-relaxed mt-4">
              We reserve the right to refuse service or terminate access for violation of these
              terms.
            </p>
          </div>

          {/* Intellectual Property */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-2xl mb-4">Intellectual Property</h2>
            <ul className="space-y-3 text-muted leading-relaxed">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  The SalaryPrep brand, website design, templates, and underlying technology are
                  the intellectual property of SalaryPrep and are protected by applicable
                  copyright and trademark laws.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  Upon purchase, you receive a <strong className="text-ink">personal, non-transferable
                  license</strong> to use your playbook for your own private negotiation purposes.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  You retain ownership of any personal data, documents, or information you submit
                  to us.
                </span>
              </li>
            </ul>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-2xl mb-4">Limitation of Liability</h2>
            <p className="text-muted leading-relaxed mb-4">
              To the fullest extent permitted by law:
            </p>
            <ul className="space-y-3 text-muted leading-relaxed">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  SalaryPrep is provided on an &quot;as is&quot; and &quot;as available&quot;
                  basis without warranties of any kind, whether express or implied.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  We do not guarantee any specific negotiation outcome, salary increase, or
                  employment result from using our playbook.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  SalaryPrep shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages arising from your use of the Service.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  Our total liability for any claim related to the Service shall not exceed the
                  amount you paid for your playbook.
                </span>
              </li>
            </ul>
          </div>

          {/* Changes to Terms */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-2xl mb-4">Changes to These Terms</h2>
            <p className="text-muted leading-relaxed">
              We may update these Terms from time to time. If we make material changes, we will
              update the &quot;Last updated&quot; date at the top of this page. Your continued use
              of the Service after any changes constitutes acceptance of the updated Terms.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-2xl mb-4">Contact Us</h2>
            <p className="text-muted leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-4">
              <a
                href="mailto:support@salaryprep.com"
                className="text-accent font-semibold hover:underline"
              >
                support@salaryprep.com
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
