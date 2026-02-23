import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Privacy Policy — SalaryPrep',
  description: 'SalaryPrep privacy policy. How we collect, use, and protect your data.',
  alternates: { canonical: 'https://www.salaryprep.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <main>
      <Nav />
      <article className="pt-32 pb-20 px-6 max-w-[720px] mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl mb-6">Privacy Policy</h1>
        <p className="text-muted text-sm mb-8">Last updated: February 2026</p>

        <div className="space-y-6 text-gray-700 leading-relaxed text-sm">
          <section>
            <h2 className="font-serif text-xl mb-2 text-ink">What We Collect</h2>
            <p>When you purchase a playbook, we collect the information you provide in the form (name, email, job details) and any files you upload (resume, offer letter). We also collect payment information via Stripe — we never see or store your full card number.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-2 text-ink">How We Use Your Data</h2>
            <p>Your form data and uploaded files are used solely to generate your personalized playbook. Your email is used to deliver the playbook PDF. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-2 text-ink">Data Retention</h2>
            <p>Uploaded files (resumes, offer letters) are processed in memory and are not permanently stored on our servers. Your playbook content is generated in real-time and delivered via email. We retain your email and purchase record for customer support and refund purposes.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-2 text-ink">Third-Party Services</h2>
            <p>We use the following third-party services to operate SalaryPrep:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Stripe</strong> — payment processing</li>
              <li><strong>Resend</strong> — email delivery</li>
              <li><strong>Anthropic</strong> — AI content generation</li>
              <li><strong>Vercel</strong> — hosting</li>
            </ul>
            <p className="mt-2">Each service has its own privacy policy governing its use of your data.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-2 text-ink">Cookies</h2>
            <p>We use minimal cookies for basic site functionality. If Google Analytics is enabled, it may use cookies to collect anonymous usage data. You can disable cookies in your browser settings.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-2 text-ink">Contact</h2>
            <p>If you have questions about this privacy policy or want to request deletion of your data, please contact us by replying to your playbook delivery email.</p>
          </section>
        </div>
      </article>
      <Footer />
    </main>
  );
}
