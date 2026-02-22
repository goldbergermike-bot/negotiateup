import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Privacy Policy — NegotiateUp',
  description: 'NegotiateUp privacy policy. How we collect, use, and protect your data.',
  alternates: { canonical: 'https://www.negotiateup.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-[680px] mx-auto prose prose-sm">
          <h1 className="font-serif text-3xl mb-8">Privacy Policy</h1>
          <p className="text-muted text-sm mb-8">Last updated: February 22, 2026</p>

          <h2 className="font-serif text-xl mt-8 mb-3">1. Information We Collect</h2>
          <p className="text-muted leading-relaxed mb-4">
            When you purchase a playbook, we collect: your name, email address, job details (company, title, location, salary), and any files you upload (resume, offer letter, job listing). Payment is processed by Stripe — we never see or store your full credit card number.
          </p>

          <h2 className="font-serif text-xl mt-8 mb-3">2. How We Use Your Information</h2>
          <p className="text-muted leading-relaxed mb-4">
            Your data is used solely to generate your personalized negotiation playbook and deliver it to your email. We may also use your email to send the playbook and any related follow-up (e.g., delivery confirmation). If you opt into our email list, we may send occasional negotiation tips and promotional offers.
          </p>

          <h2 className="font-serif text-xl mt-8 mb-3">3. AI Processing</h2>
          <p className="text-muted leading-relaxed mb-4">
            Your form data and uploaded documents are sent to Anthropic's Claude API to generate your playbook content. Anthropic's API does not use customer data for training. Your data is processed and not retained by the AI provider beyond the request.
          </p>

          <h2 className="font-serif text-xl mt-8 mb-3">4. Data Sharing</h2>
          <p className="text-muted leading-relaxed mb-4">
            We do not sell, rent, or share your personal information with third parties for marketing purposes. We use the following service providers to deliver our product:
          </p>
          <ul className="text-muted text-sm space-y-1 mb-4 list-disc pl-6">
            <li><strong>Stripe</strong> — payment processing</li>
            <li><strong>Anthropic</strong> — AI playbook generation</li>
            <li><strong>Resend</strong> — email delivery</li>
            <li><strong>Vercel</strong> — website hosting</li>
          </ul>

          <h2 className="font-serif text-xl mt-8 mb-3">5. Data Retention</h2>
          <p className="text-muted leading-relaxed mb-4">
            We retain your delivery record (name, email, company, playbook type) for analytics and customer support purposes. Uploaded files (resume, offer letter) are processed in memory and are not stored on our servers after your playbook is generated.
          </p>

          <h2 className="font-serif text-xl mt-8 mb-3">6. Data Security</h2>
          <p className="text-muted leading-relaxed mb-4">
            All data is transmitted over HTTPS. Payment processing is handled by Stripe, which is PCI DSS compliant. We implement reasonable security measures to protect your information.
          </p>

          <h2 className="font-serif text-xl mt-8 mb-3">7. Your Rights</h2>
          <p className="text-muted leading-relaxed mb-4">
            You may request deletion of your personal data at any time by emailing us. If you are in the EU/EEA, you have rights under GDPR including access, rectification, erasure, and data portability. California residents have rights under CCPA including the right to know, delete, and opt-out of sale (we do not sell data).
          </p>

          <h2 className="font-serif text-xl mt-8 mb-3">8. Cookies</h2>
          <p className="text-muted leading-relaxed mb-4">
            We use Google Analytics to understand how visitors use our site. This uses cookies to collect anonymized usage data. You can opt out by using browser settings or a Google Analytics opt-out extension.
          </p>

          <h2 className="font-serif text-xl mt-8 mb-3">9. Contact</h2>
          <p className="text-muted leading-relaxed mb-4">
            For privacy-related questions or data deletion requests, email us at <strong>support@negotiateup.com</strong>.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
