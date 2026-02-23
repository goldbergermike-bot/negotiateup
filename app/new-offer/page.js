'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Nav from '../../components/Nav';

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Clipboard API not available
    }
  };
  return (
    <button onClick={handleCopy} className="flex-1 bg-accent text-white py-3 rounded-xl font-semibold text-sm hover:bg-accent-glow transition-all">
      {copied ? 'Copied!' : label}
    </button>
  );
}

function NewOfferContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  // Form state
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    companyName: '',
    jobTitle: '',
    location: '',
    offeredSalary: '',
    offeredEquity: '',
    offeredBonus: '',
    offeredSigningBonus: '',
    additionalOfferDetails: '',
    currentSalary: '',
    yearsExperience: '',
    hasCompetingOffers: 'no',
    competingOfferDetails: '',
    biggestConcern: '',
    deadline: '',
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [offerFile, setOfferFile] = useState(null);
  const [jobListingFile, setJobListingFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('sessionId', sessionId);
      formData.append('type', 'offer');
      formData.append('formData', JSON.stringify(form));
      if (resumeFile) formData.append('resume', resumeFile);
      if (offerFile) formData.append('offerLetter', offerFile);
      if (jobListingFile) formData.append('jobListing', jobListingFile);

      const res = await fetch('/api/generate-playbook', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setEmail(form.email);
        setSubmitted(true);
      } else {
        const data = await res.json();
        alert(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-serif text-3xl mb-4">No payment found</h1>
          <p className="text-muted mb-8">Please purchase a playbook first.</p>
          <a href="/#pricing" className="bg-accent text-white px-8 py-3 rounded-xl font-semibold">
            Go to Pricing →
          </a>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-6">🎉</div>
          <h1 className="font-serif text-3xl mb-4">Your Playbook is Being Created!</h1>
          <p className="text-muted text-lg mb-2">
            We're generating your personalized negotiation playbook now.
          </p>
          <p className="text-muted mb-8">
            It will be delivered to <strong className="text-ink">{email}</strong> in under 10 minutes.
          </p>
          <p className="text-sm text-muted mb-10">Check your spam folder if you don't see it.</p>
          
          {/* Share Discount Section */}
          <div className="bg-white rounded-2xl p-8 border-2 border-accent/20 text-left">
            <div className="text-center mb-4">
              <span className="text-3xl">🎁</span>
              <h2 className="font-serif text-xl mt-2">Share 30% Off With a Friend</h2>
              <p className="text-muted text-sm mt-1">Know someone who's negotiating? Send them a discount.</p>
            </div>
            <div className="bg-accent-light rounded-xl p-4 text-center mt-4">
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Discount Code</p>
              <p className="font-mono text-2xl font-bold text-accent tracking-wider">FIRST30</p>
              <p className="text-xs text-muted mt-2">30% off → only $27.30 for their playbook</p>
            </div>
            <div className="mt-4 flex gap-2">
              <CopyButton
                text="Hey! I just used SalaryPrep to get a personalized salary negotiation playbook. Use code FIRST30 for 30% off → https://www.salaryprep.com"
                label="Copy Share Message"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <div className="pt-28 pb-20 px-6 max-w-[680px] mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-accent-light text-accent font-semibold text-xs px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">
            🤝 Offer Negotiation Playbook
          </div>
          <h1 className="font-serif text-3xl md:text-4xl mb-3">Tell us about your offer</h1>
          <p className="text-muted text-lg">
            The more details you share, the more personalized your playbook will be.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-xl mb-6">About You</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                <input
                  type="text" name="fullName" required value={form.fullName} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-accent"
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email *</label>
                <input
                  type="email" name="email" required value={form.email} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-accent"
                  placeholder="jane@email.com"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Years of Experience *</label>
                <input
                  type="text" name="yearsExperience" required value={form.yearsExperience} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-accent"
                  placeholder="5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Current Salary</label>
                <input
                  type="text" name="currentSalary" value={form.currentSalary} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-accent"
                  placeholder="$85,000"
                />
              </div>
            </div>
          </div>

          {/* Offer Details */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-xl mb-6">The Offer</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Company Name *</label>
                <input
                  type="text" name="companyName" required value={form.companyName} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-accent"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Job Title *</label>
                <input
                  type="text" name="jobTitle" required value={form.jobTitle} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-accent"
                  placeholder="Senior Product Manager"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Location *</label>
                <input
                  type="text" name="location" required value={form.location} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-accent"
                  placeholder="San Francisco, CA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Offered Base Salary *</label>
                <input
                  type="text" name="offeredSalary" required value={form.offeredSalary} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-accent"
                  placeholder="$130,000"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Equity / RSUs</label>
                <input
                  type="text" name="offeredEquity" value={form.offeredEquity} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-accent"
                  placeholder="$50,000 over 4 yrs"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Annual Bonus</label>
                <input
                  type="text" name="offeredBonus" value={form.offeredBonus} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-accent"
                  placeholder="15% target"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Signing Bonus</label>
                <input
                  type="text" name="offeredSigningBonus" value={form.offeredSigningBonus} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-accent"
                  placeholder="$10,000"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1.5">Any other offer details?</label>
              <textarea
                name="additionalOfferDetails" value={form.additionalOfferDetails} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-accent"
                rows={3}
                placeholder="e.g., remote/hybrid, PTO, relocation package, etc."
              />
            </div>
          </div>

          {/* Competing Offers & Concerns */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-xl mb-6">Your Situation</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5">Do you have competing offers?</label>
              <select
                name="hasCompetingOffers" value={form.hasCompetingOffers} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-accent"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
                <option value="in-process">I'm in the process with other companies</option>
              </select>
            </div>
            {form.hasCompetingOffers !== 'no' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5">Tell us about them</label>
                <textarea
                  name="competingOfferDetails" value={form.competingOfferDetails} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-accent"
                  rows={3}
                  placeholder="Company names, salary ranges, stage of interview process..."
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5">What's your response deadline?</label>
              <input
                type="text" name="deadline" value={form.deadline} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-accent"
                placeholder="e.g., Friday this week, no deadline yet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">What's your biggest concern about negotiating?</label>
              <textarea
                name="biggestConcern" value={form.biggestConcern} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-accent"
                rows={3}
                placeholder="e.g., I'm worried they'll rescind the offer, I don't know what's reasonable to ask for..."
              />
            </div>
          </div>

          {/* File Uploads */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-xl mb-2">Upload Documents</h2>
            <p className="text-muted text-sm mb-6">Optional but recommended — these make your playbook much more personalized.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Resume (PDF)</label>
                <input
                  type="file" accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full text-sm text-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-light file:text-accent hover:file:bg-accent/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Offer Letter (PDF, image, or screenshot)</label>
                <input
                  type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={(e) => setOfferFile(e.target.files[0])}
                  className="w-full text-sm text-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-light file:text-accent hover:file:bg-accent/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Job Listing (PDF or link)</label>
                <input
                  type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={(e) => setJobListingFile(e.target.files[0])}
                  className="w-full text-sm text-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-light file:text-accent hover:file:bg-accent/20"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-4 rounded-xl font-semibold text-lg hover:bg-accent-glow transition-all hover:-translate-y-0.5 shadow-lg shadow-accent/25 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating Your Playbook...' : 'Generate My Playbook →'}
          </button>
          <p className="text-center text-muted text-xs">Your data is encrypted and never shared.</p>
        </form>
      </div>
    </div>
  );
}

export default function NewOfferPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper flex items-center justify-center"><p className="text-muted">Loading...</p></div>}>
      <NewOfferContent />
    </Suspense>
  );
}
