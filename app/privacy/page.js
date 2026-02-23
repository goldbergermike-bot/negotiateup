import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Privacy Policy — SalaryPrep',
  description: 'How SalaryPrep collects, uses, and protects your personal information.',
  alternates: { canonical: 'https://www.salaryprep.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <main>
      <Nav />
      <div className="pt-32 pb-20 px-6 max-w-[720px] mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl mb-2">Privacy Policy</h1>
        <p className="text-muted text-sm mb-10">Last updated: February 23, 2026</p>

        <div className="prose-custom space-y-8">
          <section>
            <h2 className="font-serif text-xl mb-3 text-ink">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              SalaryPrep ("we," "us," or "our") operates the website at salaryprep.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or purchase our products. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3 text-ink">2. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We collect information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2">
              <li><strong>Purchase a playbook:</strong> Full name, email address, job title, company name, salary details, and other career-related information you enter in our forms.</li>
              <li><strong>Upload documents:</strong> Resumes, offer letters, and job listings you optionally upload for analysis.</li>
              <li><strong>Subscribe to our email list:</strong> Email address and the source page (e.g., homepage, quiz).</li>
              <li><strong>Take our salary quiz:</strong> Job title, experience level, location, industry, company size, and current salary.</li>
              <li><strong>Make a payment:</strong> Payment information is processed directly by Stripe and is never stored on our servers.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3 text-ink">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2">
              <li>Generate your personalized salary negotiation playbook using AI analysis.</li>
              <li>Deliver your playbook to your email address as a PDF attachment.</li>
              <li>Process your payment through Stripe.</li>
              <li>Send you negotiation tips and product updates if you subscribe to our email list.</li>
              <li>Improve our product and website based on usage patterns.</li>
              <li>Respond to your inquiries and provide customer support.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3 text-ink">4. AI Processing</h2>
            <p className="text-gray-700 leading-relaxed">
              Your career information and uploaded documents are sent to Anthropic's Claude AI to generate your personalized playbook. This data is processed in real time and is not stored by Anthropic for training purposes. We use Anthropic's API, which has a zero-retention data policy for API inputs and outputs. Your information is used solely to generate your playbook and is not used to train any AI models.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3 text-ink">5. Data Storage & Security</h2>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2">
              <li><strong>Payments:</strong> Handled entirely by Stripe. We never see or store your credit card number. Stripe is PCI DSS Level 1 certified.</li>
              <li><strong>Emails:</strong> Sent via Resend. Email addresses for newsletter subscribers are stored in Resend's audience system.</li>
              <li><strong>Playbook data:</strong> Your form inputs are processed in memory to generate your playbook. We do not maintain a persistent database of your career details after delivery.</li>
              <li><strong>Hosting:</strong> Our website is hosted on Vercel, which provides enterprise-grade security and DDoS protection.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3 text-ink">6. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-3">We share your data with these third-party services only as needed to operate our product:</p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2">
              <li><strong>Stripe</strong> — payment processing (<a href="https://stripe.com/privacy" className="text-accent hover:underline">Stripe Privacy Policy</a>)</li>
              <li><strong>Anthropic (Claude AI)</strong> — playbook generation (<a href="https://www.anthropic.com/privacy" className="text-accent hover:underline">Anthropic Privacy Policy</a>)</li>
              <li><strong>Resend</strong> — email delivery (<a href="https://resend.com/legal/privacy-policy" className="text-accent hover:underline">Resend Privacy Policy</a>)</li>
              <li><strong>Vercel</strong> — website hosting (<a href="https://vercel.com/legal/privacy-policy" className="text-accent hover:underline">Vercel Privacy Policy</a>)</li>
              <li><strong>Google Analytics</strong> — anonymous website analytics (if enabled)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">We do not sell, rent, or trade your personal information to any third parties.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3 text-ink">7. Cookies & Tracking</h2>
            <p className="text-gray-700 leading-relaxed">
              We use essential cookies for website functionality and may use Google Analytics to understand how visitors use our site. Google Analytics collects anonymous usage data (pages visited, time on site) and does not collect personally identifiable information. You can opt out of Google Analytics by installing the <a href="https://tools.google.com/dlpage/gaoptout" className="text-accent hover:underline">Google Analytics Opt-out Browser Add-on</a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3 text-ink">8. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Deletion:</strong> Request that we delete your personal data.</li>
              <li><strong>Unsubscribe:</strong> Opt out of marketing emails at any time using the unsubscribe link in any email.</li>
              <li><strong>Correction:</strong> Request correction of any inaccurate personal data.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              To exercise any of these rights, email us at <a href="mailto:support@salaryprep.com" className="text-accent hover:underline">support@salaryprep.com</a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3 text-ink">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our service is not directed to individuals under 18 years of age. We do not knowingly collect personal information from children under 18.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3 text-ink">10. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. The updated version will be indicated by the "Last updated" date at the top of this page. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3 text-ink">11. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions or concerns about this Privacy Policy, please contact us at <a href="mailto:support@salaryprep.com" className="text-accent hover:underline">support@salaryprep.com</a>.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
