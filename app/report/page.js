'use client';

import { useState, useEffect } from 'react';
import Nav from '../../components/Nav';
import CompanyAutocomplete from '../../components/CompanyAutocomplete';

const STEPS = ['company', 'role', 'email', 'download'];

export default function ReportPage() {
  const [step, setStep] = useState(0);

  // Company state
  const [companyInput, setCompanyInput] = useState('');
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null); // { id, name }

  // Role state
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null); // { id, name }

  // Email state
  const [email, setEmail] = useState('');

  // Download state
  const [generating, setGenerating] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Notification email state (for when company not found)
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  // Load companies list on mount
  useEffect(() => {
    fetch('/api/companies')
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch(() => {});
  }, []);

  // Resolve company from input
  useEffect(() => {
    if (!companyInput || companies.length === 0) {
      setSelectedCompany(null);
      return;
    }
    const query = companyInput.toLowerCase();
    const match = companies.find(
      (c) => c.name.toLowerCase() === query || c.id === query
    );
    setSelectedCompany(match || null);
  }, [companyInput, companies]);

  // Fetch roles when company is selected
  useEffect(() => {
    if (!selectedCompany) {
      setRoles([]);
      setRolesError(null);
      return;
    }

    setRolesLoading(true);
    setRolesError(null);
    setRoles([]);
    setSelectedRole(null);

    fetch(`/api/companies/${selectedCompany.id}/roles`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch roles');
        return res.json();
      })
      .then((data) => {
        setRoles(data);
        setRolesLoading(false);
      })
      .catch(() => {
        setRolesError('Failed to load roles. Please try again.');
        setRolesLoading(false);
      });
  }, [selectedCompany]);

  const handleCompanyChange = (e) => {
    setCompanyInput(e.target.value);
    // Reset downstream
    setSelectedRole(null);
    setDownloadSuccess(false);
    setDownloadError(null);
    if (step > 0) setStep(0);
  };

  const handleCompanyNext = () => {
    if (selectedCompany) {
      setStep(1);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setDownloadSuccess(false);
    setDownloadError(null);
    setStep(2);
  };

  const handleEmailNext = (e) => {
    e.preventDefault();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStep(3);
    }
  };

  const handleDownload = async () => {
    if (!selectedCompany || !selectedRole || !email) return;

    setGenerating(true);
    setDownloadError(null);
    setDownloadSuccess(false);

    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          companyId: selectedCompany.id,
          roleId: selectedRole.id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setDownloadError(data.error || 'Failed to generate report.');
        setGenerating(false);
        return;
      }

      // Download the PDF
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SalaryPrep-${selectedCompany.id}-${selectedRole.id}-report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setGenerating(false);
    } catch {
      setDownloadError('Network error. Please try again.');
      setGenerating(false);
    }
  };

  const currentStepName = STEPS[step];
  const showNoCompanyMessage = companyInput.length >= 3 && !selectedCompany;

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-paper pt-28 pb-20 px-6">
        <div className="max-w-[640px] mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-accent font-semibold text-xs uppercase tracking-wider mb-3">Free Tool</p>
            <h1 className="font-serif text-3xl md:text-4xl text-ink mb-3">
              Free Salary Report
            </h1>
            <p className="text-muted max-w-[480px] mx-auto">
              Get a PDF with verified salary data for your company and role. Base, stock, bonus, and total comp — all from real data.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex gap-1.5 mb-10">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  i <= step ? 'bg-accent' : 'bg-border'
                }`}
              />
            ))}
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl border border-border p-8 md:p-12">

            {/* ---- STEP 1: Company Selection ---- */}
            {currentStepName === 'company' && (
              <>
                <p className="text-xs text-muted uppercase tracking-wider mb-2">Step 1 of 4</p>
                <h2 className="font-serif text-2xl md:text-3xl mb-2">Select your company</h2>
                <p className="text-muted text-sm mb-8">We have verified salary data for 200+ companies.</p>

                <CompanyAutocomplete
                  value={companyInput}
                  onChange={handleCompanyChange}
                  name="company"
                  required
                  placeholder="Start typing a company name..."
                />

                {/* No company found message */}
                {showNoCompanyMessage && !notifySubmitted && (
                  <div className="mt-6 bg-paper rounded-2xl border border-border p-6">
                    <p className="text-sm text-muted mb-3">
                      We don&apos;t have data for &ldquo;{companyInput}&rdquo; yet. Enter your email to be notified when we add it.
                    </p>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setNotifySubmitted(true);
                      }}
                      className="flex gap-3"
                    >
                      <input
                        type="email"
                        required
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="flex-1 px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:border-accent"
                      />
                      <button
                        type="submit"
                        className="bg-ink text-white px-5 py-3 rounded-xl font-semibold text-sm whitespace-nowrap"
                      >
                        Notify Me
                      </button>
                    </form>
                  </div>
                )}
                {showNoCompanyMessage && notifySubmitted && (
                  <div className="mt-6 bg-accent-light rounded-2xl border border-accent/20 p-6 text-center">
                    <p className="text-accent text-sm font-semibold">
                      We&apos;ll email you when we add data for this company.
                    </p>
                  </div>
                )}

                {/* Next button */}
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleCompanyNext}
                    disabled={!selectedCompany}
                    className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all ${
                      selectedCompany
                        ? 'bg-accent text-white hover:bg-accent-glow hover:-translate-y-0.5'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Next: Choose Role →
                  </button>
                </div>
              </>
            )}

            {/* ---- STEP 2: Role Selection ---- */}
            {currentStepName === 'role' && (
              <>
                <p className="text-xs text-muted uppercase tracking-wider mb-2">Step 2 of 4</p>
                <h2 className="font-serif text-2xl md:text-3xl mb-2">Select your role</h2>
                <p className="text-muted text-sm mb-8">
                  Showing roles at <strong className="text-ink">{selectedCompany?.name}</strong>
                </p>

                {rolesLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    <span className="ml-3 text-muted text-sm">Loading roles...</span>
                  </div>
                )}

                {rolesError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
                    {rolesError}
                  </div>
                )}

                {!rolesLoading && !rolesError && roles.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted">No roles found for this company.</p>
                  </div>
                )}

                {!rolesLoading && roles.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => handleRoleSelect(role)}
                        className={`text-left px-5 py-4 rounded-xl border text-sm transition-all ${
                          selectedRole?.id === role.id
                            ? 'border-accent bg-accent-light text-accent font-semibold'
                            : 'border-border hover:border-accent/50 hover:bg-accent-light/30'
                        }`}
                      >
                        {role.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Back button */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setStep(0)}
                    className="text-sm text-muted hover:text-ink transition-colors"
                  >
                    ← Change company
                  </button>
                </div>
              </>
            )}

            {/* ---- STEP 3: Email Capture ---- */}
            {currentStepName === 'email' && (
              <>
                <p className="text-xs text-muted uppercase tracking-wider mb-2">Step 3 of 4</p>
                <h2 className="font-serif text-2xl md:text-3xl mb-2">Enter your email</h2>
                <p className="text-muted text-sm mb-8">
                  We&apos;ll send your report for <strong className="text-ink">{selectedRole?.name}</strong> at <strong className="text-ink">{selectedCompany?.name}</strong>.
                </p>

                <form onSubmit={handleEmailNext}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-5 py-4 rounded-xl border border-border text-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                    autoFocus
                  />
                  <p className="text-xs text-muted mt-3">
                    Your email is used only to prevent abuse (3 reports/day limit). We won&apos;t spam you.
                  </p>

                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-sm text-muted hover:text-ink transition-colors"
                    >
                      ← Change role
                    </button>
                    <button
                      type="submit"
                      disabled={!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                      className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all ${
                        email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                          ? 'bg-accent text-white hover:bg-accent-glow hover:-translate-y-0.5'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Generate My Report →
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ---- STEP 4: Download ---- */}
            {currentStepName === 'download' && (
              <>
                <p className="text-xs text-muted uppercase tracking-wider mb-2">Step 4 of 4</p>
                <h2 className="font-serif text-2xl md:text-3xl mb-2">Download your report</h2>
                <p className="text-muted text-sm mb-8">
                  Your salary report for <strong className="text-ink">{selectedRole?.name}</strong> at <strong className="text-ink">{selectedCompany?.name}</strong> is ready.
                </p>

                {/* Summary Card */}
                <div className="bg-paper rounded-2xl border border-border p-6 mb-8">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted text-xs mb-1">Company</p>
                      <p className="font-semibold text-ink">{selectedCompany?.name}</p>
                    </div>
                    <div>
                      <p className="text-muted text-xs mb-1">Role</p>
                      <p className="font-semibold text-ink">{selectedRole?.name}</p>
                    </div>
                    <div>
                      <p className="text-muted text-xs mb-1">Email</p>
                      <p className="font-semibold text-ink">{email}</p>
                    </div>
                    <div>
                      <p className="text-muted text-xs mb-1">Format</p>
                      <p className="font-semibold text-ink">PDF Report</p>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                {!downloadSuccess && (
                  <button
                    onClick={handleDownload}
                    disabled={generating}
                    className={`w-full py-4 rounded-xl font-semibold text-base transition-all ${
                      generating
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-accent text-white hover:bg-accent-glow hover:-translate-y-0.5'
                    }`}
                  >
                    {generating ? (
                      <span className="flex items-center justify-center gap-3">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating PDF...
                      </span>
                    ) : (
                      'Download Free PDF Report'
                    )}
                  </button>
                )}

                {/* Success */}
                {downloadSuccess && (
                  <div className="bg-accent-light border border-accent/20 rounded-2xl p-6 text-center mb-6">
                    <p className="text-accent font-semibold text-lg mb-1">Report downloaded!</p>
                    <p className="text-muted text-sm">Check your downloads folder for the PDF.</p>
                  </div>
                )}

                {/* Error */}
                {downloadError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm mt-4">
                    {downloadError}
                  </div>
                )}

                {/* CTA */}
                {downloadSuccess && (
                  <div className="bg-paper rounded-2xl border border-accent/20 p-6 text-center mt-6">
                    <h3 className="font-serif text-xl mb-2">Want the full negotiation playbook?</h3>
                    <p className="text-muted text-sm mb-4">
                      Get personalized scripts, counter-offer strategies, and step-by-step guidance for your specific situation.
                    </p>
                    <a
                      href="/#pricing"
                      className="inline-block bg-accent text-white px-8 py-3 rounded-xl font-semibold hover:-translate-y-0.5 transition-all hover:bg-accent-glow"
                    >
                      Get Your Playbook → $39
                    </a>
                  </div>
                )}

                {/* Back button */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => {
                      setStep(0);
                      setDownloadSuccess(false);
                      setDownloadError(null);
                    }}
                    className="text-sm text-muted hover:text-ink transition-colors"
                  >
                    ← Start over
                  </button>
                  {downloadSuccess && (
                    <button
                      onClick={handleDownload}
                      className="text-sm text-accent hover:text-accent-glow font-semibold transition-colors"
                    >
                      Download again
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Trust badge */}
          <p className="text-center text-xs text-muted mt-6">
            All data sourced from Levels.fyi, Glassdoor, Blind, and H1B disclosures. No estimates or AI-generated figures.
          </p>
        </div>
      </div>
    </>
  );
}
