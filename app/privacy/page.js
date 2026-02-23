import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Privacy Policy — SalaryPrep',
  description: 'SalaryPrep privacy policy. Learn how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <main>
      <Nav />
      <div className="pt-32 pb-20 px-6 max-w-[800px] mx-auto">
        <div className="text-center mb-14">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Privacy Policy</h1>
          <p className="text-muted text-sm">Last updated: February 23, 2026</p>
        </div>

        <div className="space-y-8">
          {/* Intro */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <p className="text-muted leading-relaxed">
              SalaryPrep (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting
              your privacy. This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our website and services at{' '}
              <a href="https://www.salaryprep.com" className="text-accent font-medium hover:underline">
                salaryprep.com
              </a>.
              By using SalaryPrep, you agree to the practices described in this policy.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-2xl mb-4">Information We Collect</h2>
            <p className="text-muted leading-relaxed mb-4">
              We collect information that you provide directly to us when using our services:
            </p>
            <ul className="space-y-3 text-muted leading-relaxed">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-ink">Account &amp; contact information:</strong> Your name and email
                  address, provided when purchasing a playbook or signing up for communications.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-ink">Salary &amp; compensation data:</strong> Current salary, target
                  salary, job title, company name, years of experience, and other compensation
                  details you enter to generate your personalized playbook.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-ink">Uploaded documents:</strong> Resumes, offer letters, or other
                  documents you upload for playbook personalization. These files are processed
                  temporarily and are <strong>not permanently stored</strong> after your playbook
                  has been generated.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-ink">Payment information:</strong> Payment details are collected and
                  processed securely by Stripe. We do not store your credit card number or full
                  payment details on our servers.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-ink">Usage data:</strong> We automatically collect information about
                  how you interact with our website, including pages visited, time on site, and
                  referral sources, through Google Analytics.
                </span>
              </li>
            </ul>
          </div>

          {/* How We Use Your Information */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-2xl mb-4">How We Use Your Information</h2>
            <p className="text-muted leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="space-y-3 text-muted leading-relaxed">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-ink">Playbook generation:</strong> Your salary data, job details, and
                  uploaded documents are used exclusively to generate your personalized
                  negotiation playbook using AI (Claude by Anthropic).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-ink">Playbook delivery:</strong> Your email address is used to deliver
                  your completed playbook and order confirmation.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-ink">Payment processing:</strong> To process your one-time purchase
                  securely through Stripe.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-ink">Product improvement:</strong> Aggregated, anonymized usage data
                  helps us improve our product and user experience.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-ink">Communications:</strong> If you opt in, we may send you
                  negotiation tips or product updates. You can unsubscribe at any time.
                </span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-accent-light rounded-xl">
              <p className="text-sm text-accent font-medium">
                Your data is never sold to third parties. It is used solely for generating your
                personalized negotiation playbook.
              </p>
            </div>
          </div>

          {/* Third-Party Services */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-2xl mb-4">Third-Party Services</h2>
            <p className="text-muted leading-relaxed mb-4">
              We use the following trusted third-party services to operate SalaryPrep:
            </p>
            <ul className="space-y-3 text-muted leading-relaxed">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-ink">Stripe</strong> — Processes payments securely. Stripe&apos;s
                  privacy policy is available at{' '}
                  <a href="https://stripe.com/privacy" className="text-accent hover:underline">
                    stripe.com/privacy
                  </a>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-ink">Anthropic (Claude AI)</strong> — Powers the AI-generated content
                  in your playbook. Your input data is sent to the Anthropic API for processing.
                  Anthropic&apos;s privacy policy is available at{' '}
                  <a href="https://www.anthropic.com/privacy" className="text-accent hover:underline">
                    anthropic.com/privacy
                  </a>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-ink">Resend</strong> — Delivers transactional emails (playbook
                  delivery and order confirmations). Resend&apos;s privacy policy is available at{' '}
                  <a href="https://resend.com/legal/privacy-policy" className="text-accent hover:underline">
                    resend.com/legal/privacy-policy
                  </a>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-ink">Google Analytics</strong> — Collects anonymized usage data to
                  help us understand how visitors interact with our website. You can opt out using
                  the{' '}
                  <a href="https://tools.google.com/dlpage/gaoptout" className="text-accent hover:underline">
                    Google Analytics Opt-out Browser Add-on
                  </a>.
                </span>
              </li>
            </ul>
            <p className="text-muted leading-relaxed mt-4">
              We do not use an external database. Research data used for playbook generation is
              stored locally on our secured servers and is encrypted at rest.
            </p>
          </div>

          {/* Data Security */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-2xl mb-4">Data Security</h2>
            <p className="text-muted leading-relaxed mb-4">
              We take the security of your data seriously and implement appropriate technical and
              organizational measures to protect it:
            </p>
            <ul className="space-y-3 text-muted leading-relaxed">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>All data is transmitted over HTTPS with TLS encryption.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>Data at rest is encrypted on our servers.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  Uploaded resumes and offer letters are processed in memory and are not
                  permanently stored after playbook generation is complete.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>Payment information is handled entirely by Stripe and never touches our servers.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>Access to user data is restricted to essential personnel only.</span>
              </li>
            </ul>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-2xl mb-4">Your Rights</h2>
            <p className="text-muted leading-relaxed mb-4">
              Depending on your location, you may have the following rights regarding your
              personal data:
            </p>
            <ul className="space-y-3 text-muted leading-relaxed">
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-ink">Access:</strong> Request a copy of the personal data we hold
                  about you.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-ink">Correction:</strong> Request correction of any inaccurate
                  personal data.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-ink">Deletion:</strong> Request deletion of your personal data from
                  our systems.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-ink">Opt out:</strong> Unsubscribe from marketing communications at
                  any time using the link in any email, or by contacting us.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-ink">Data portability:</strong> Request a machine-readable copy of
                  your data.
                </span>
              </li>
            </ul>
            <p className="text-muted leading-relaxed mt-4">
              To exercise any of these rights, please contact us at the email below. We will
              respond to your request within 30 days.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-2xl mb-4">Contact Us</h2>
            <p className="text-muted leading-relaxed">
              If you have any questions about this Privacy Policy or how we handle your data,
              please contact us at:
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
