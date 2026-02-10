'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Nav from '../../components/Nav';

function RaiseContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    companyName: '',
    jobTitle: '',
    department: '',
    location: '',
    currentSalary: '',
    targetSalary: '',
    timeInRole: '',
    timeAtCompany: '',
    lastRaise: '',
    recentAccomplishments: '',
    additionalResponsibilities: '',
    managerRelationship: '',
    companyFinancialHealth: '',
    biggestConcern: '',
    previousNegotiationAttempts: '',
  });

  const [resumeFile, setResumeFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('sessionId', sessionId);
      formData.append('type', 'raise');
      formData.append('formData', JSON.stringify(form));
      if (resumeFile) formData.append('resume', resumeFile);

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
          <a href="/#pricing" className="bg-blue text-white px-8 py-3 rounded-xl font-semibold">
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
            We're generating your personalized raise negotiation playbook now.
          </p>
          <p className="text-muted mb-8">
            It will be delivered to <strong className="text-ink">{email}</strong> in under 10 minutes.
          </p>
          <p className="text-sm text-muted">Check your spam folder if you don't see it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <div className="pt-28 pb-20 px-6 max-w-[680px] mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-blue-light text-blue font-semibold text-xs px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">
            📈 Raise Negotiation Playbook
          </div>
          <h1 className="font-serif text-3xl md:text-4xl mb-3">Tell us about your situation</h1>
          <p className="text-muted text-lg">
            The more details you share, the stronger your business case will be.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-xl mb-6">About You</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                <input type="text" name="fullName" required value={form.fullName} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-blue" placeholder="Jane Smith" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email *</label>
                <input type="email" name="email" required value={form.email} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-blue" placeholder="jane@email.com" />
              </div>
            </div>
          </div>

          {/* Current Role */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-xl mb-6">Your Current Role</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Company Name *</label>
                <input type="text" name="companyName" required value={form.companyName} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-blue" placeholder="Acme Corp" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Job Title *</label>
                <input type="text" name="jobTitle" required value={form.jobTitle} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-blue" placeholder="Senior Product Manager" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Department</label>
                <input type="text" name="department" value={form.department} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-blue" placeholder="Product" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Location *</label>
                <input type="text" name="location" required value={form.location} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-blue" placeholder="San Francisco, CA" />
              </div>
            </div>
          </div>

          {/* Compensation */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-xl mb-6">Compensation & Timeline</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Current Base Salary *</label>
                <input type="text" name="currentSalary" required value={form.currentSalary} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-blue" placeholder="$95,000" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Target Salary</label>
                <input type="text" name="targetSalary" value={form.targetSalary} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-blue" placeholder="$115,000 (or leave blank for our recommendation)" />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Time in Current Role *</label>
                <input type="text" name="timeInRole" required value={form.timeInRole} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-blue" placeholder="2 years" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Time at Company</label>
                <input type="text" name="timeAtCompany" value={form.timeAtCompany} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-blue" placeholder="3.5 years" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Last Raise / When</label>
                <input type="text" name="lastRaise" value={form.lastRaise} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-blue" placeholder="3% in Jan 2025" />
              </div>
            </div>
          </div>

          {/* Your Case */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-xl mb-6">Build Your Case</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Key accomplishments in the past 12 months *</label>
                <textarea name="recentAccomplishments" required value={form.recentAccomplishments} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-blue" rows={4}
                  placeholder="e.g., Led the launch of X feature that increased revenue by 20%, managed a team of 5, took on the Y project that was outside my role..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Additional responsibilities you've taken on</label>
                <textarea name="additionalResponsibilities" value={form.additionalResponsibilities} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-blue" rows={3}
                  placeholder="e.g., Started mentoring 2 junior team members, took over client relationship management..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">How would you describe your relationship with your manager?</label>
                <select name="managerRelationship" value={form.managerRelationship} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-blue">
                  <option value="">Select...</option>
                  <option value="excellent">Excellent — they're my biggest advocate</option>
                  <option value="good">Good — solid working relationship</option>
                  <option value="neutral">Neutral — professional but not close</option>
                  <option value="strained">Strained — there's some tension</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">How is the company doing financially?</label>
                <select name="companyFinancialHealth" value={form.companyFinancialHealth} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-blue">
                  <option value="">Select...</option>
                  <option value="growing">Growing / doing well</option>
                  <option value="stable">Stable</option>
                  <option value="struggling">Cost-cutting / layoffs</option>
                  <option value="unsure">Not sure</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Have you tried asking for a raise before?</label>
                <textarea name="previousNegotiationAttempts" value={form.previousNegotiationAttempts} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-blue" rows={2}
                  placeholder="e.g., I asked last year but was told the budget was frozen..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">What's your biggest concern about asking for a raise?</label>
                <textarea name="biggestConcern" value={form.biggestConcern} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none focus:border-blue" rows={3}
                  placeholder="e.g., I don't want to seem ungrateful, I'm worried my manager will take it personally..." />
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-2xl p-8 border border-border">
            <h2 className="font-serif text-xl mb-2">Upload Your Resume</h2>
            <p className="text-muted text-sm mb-6">Optional but helps us identify your strongest leverage points.</p>
            <input
              type="file" accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="w-full text-sm text-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-light file:text-blue hover:file:bg-blue/20"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#245fa0] transition-all hover:-translate-y-0.5 shadow-lg shadow-blue/25 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating Your Playbook...' : 'Generate My Playbook →'}
          </button>
          <p className="text-center text-muted text-xs">Your data is encrypted and never shared.</p>
        </form>
      </div>
    </div>
  );
}

export default function RaisePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper flex items-center justify-center"><p className="text-muted">Loading...</p></div>}>
      <RaiseContent />
    </Suspense>
  );
}
