'use client';

import { useState } from 'react';
import Nav from '../../components/Nav';

const steps = [
  {
    id: 'title',
    question: "What's your job title?",
    type: 'text',
    placeholder: 'e.g. Software Engineer, Marketing Manager, Product Designer',
  },
  {
    id: 'experience',
    question: 'How many years of experience do you have?',
    type: 'select',
    options: ['0-2 years', '3-5 years', '6-10 years', '11-15 years', '15+ years'],
  },
  {
    id: 'location',
    question: 'Where are you located?',
    type: 'text',
    placeholder: 'e.g. New York, San Francisco, Austin, Remote',
  },
  {
    id: 'industry',
    question: 'What industry do you work in?',
    type: 'select',
    options: ['Technology', 'Finance / Banking', 'Healthcare', 'Consulting', 'Retail / E-commerce', 'Media / Entertainment', 'Manufacturing', 'Education', 'Government', 'Other'],
  },
  {
    id: 'company_size',
    question: 'How large is your company?',
    type: 'select',
    options: ['Startup (1-50)', 'Small (51-200)', 'Mid-size (201-1,000)', 'Large (1,001-10,000)', 'Enterprise (10,000+)'],
  },
  {
    id: 'salary',
    question: "What's your current base salary? (USD)",
    type: 'salary',
    placeholder: 'e.g. 85000',
  },
];

// Salary multipliers based on inputs
function estimateMarketRange(answers) {
  const baseByExp = {
    '0-2 years': 55000,
    '3-5 years': 75000,
    '6-10 years': 100000,
    '11-15 years': 125000,
    '15+ years': 145000,
  };

  const industryMult = {
    'Technology': 1.35,
    'Finance / Banking': 1.30,
    'Consulting': 1.25,
    'Healthcare': 1.10,
    'Media / Entertainment': 1.05,
    'Retail / E-commerce': 1.10,
    'Manufacturing': 1.05,
    'Education': 0.85,
    'Government': 0.90,
    'Other': 1.00,
  };

  const sizeMult = {
    'Startup (1-50)': 0.90,
    'Small (51-200)': 0.95,
    'Mid-size (201-1,000)': 1.05,
    'Large (1,001-10,000)': 1.15,
    'Enterprise (10,000+)': 1.20,
  };

  const loc = (answers.location || '').toLowerCase();
  let locMult = 1.0;
  if (loc.includes('san francisco') || loc.includes('sf') || loc.includes('new york') || loc.includes('nyc') || loc.includes('manhattan')) locMult = 1.35;
  else if (loc.includes('seattle') || loc.includes('boston') || loc.includes('los angeles') || loc.includes('la') || loc.includes('washington') || loc.includes('dc')) locMult = 1.20;
  else if (loc.includes('austin') || loc.includes('denver') || loc.includes('chicago') || loc.includes('san diego') || loc.includes('atlanta') || loc.includes('miami')) locMult = 1.10;
  else if (loc.includes('remote')) locMult = 1.05;
  else locMult = 1.0;

  const title = (answers.title || '').toLowerCase();
  let titleMult = 1.0;
  if (title.includes('director') || title.includes('vp') || title.includes('vice president')) titleMult = 1.40;
  else if (title.includes('senior') || title.includes('sr.') || title.includes('lead') || title.includes('principal')) titleMult = 1.20;
  else if (title.includes('manager') || title.includes('head of')) titleMult = 1.15;
  else if (title.includes('junior') || title.includes('jr.') || title.includes('associate') || title.includes('entry')) titleMult = 0.85;

  const base = baseByExp[answers.experience] || 80000;
  const im = industryMult[answers.industry] || 1.0;
  const sm = sizeMult[answers.company_size] || 1.0;

  const median = Math.round(base * im * sm * locMult * titleMult);
  const low = Math.round(median * 0.82);
  const high = Math.round(median * 1.22);

  return { low, median, high };
}

function formatSalary(n) {
  return '$' + n.toLocaleString();
}

export default function QuizClient() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [copied, setCopied] = useState(false);

  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [step.id]: value });
  };

  const currentAnswer = answers[step.id] || '';
  const salary = parseInt(answers.salary) || 0;
  const range = estimateMarketRange(answers);

  const percentile = salary <= range.low
    ? Math.max(5, Math.round(((salary - range.low * 0.6) / (range.low - range.low * 0.6)) * 25))
    : salary <= range.median
      ? 25 + Math.round(((salary - range.low) / (range.median - range.low)) * 25)
      : salary <= range.high
        ? 50 + Math.round(((salary - range.median) / (range.high - range.median)) * 25)
        : Math.min(95, 75 + Math.round(((salary - range.high) / (range.high * 0.3)) * 20));

  const isUnderpaid = salary < range.median;
  const gap = range.median - salary;

  const handleCopyShare = async () => {
    const text = isUnderpaid
      ? `I just found out I might be underpaid by ${formatSalary(Math.abs(gap))}/year. Take this free quiz to check yours → https://www.salaryprep.com/quiz`
      : `I just checked my salary against market data. Take this free quiz → https://www.salaryprep.com/quiz`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Clipboard API not available
    }
  };

  if (showResults) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-paper pt-28 pb-20 px-6">
          <div className="max-w-[640px] mx-auto">
            {/* Result Card */}
            <div className="bg-white rounded-3xl border-2 border-border p-8 md:p-12 text-center mb-8">
              <div className="text-5xl mb-4">{isUnderpaid ? '😬' : salary >= range.high ? '🎉' : '👍'}</div>
              <h1 className="font-serif text-3xl md:text-4xl mb-3">
                {isUnderpaid
                  ? `You're likely underpaid by ${formatSalary(Math.abs(gap))}/year`
                  : salary >= range.high
                    ? "You're above market — nice work!"
                    : "You're right around market rate"}
              </h1>
              <p className="text-muted text-lg mb-8">
                Based on your role as <strong className="text-ink">{answers.title}</strong> with {answers.experience} of experience in {answers.location}.
              </p>

              {/* Salary Bar */}
              <div className="bg-paper rounded-2xl p-6 mb-8 text-left">
                <p className="text-xs text-muted uppercase tracking-wider mb-4 text-center font-semibold">Market Salary Range</p>
                <div className="relative h-8 bg-gradient-to-r from-red-100 via-amber-100 via-green-100 to-emerald-100 rounded-full mb-2">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-ink rounded-full border-2 border-white shadow-lg z-10"
                    style={{ left: `${Math.max(2, Math.min(98, percentile))}%`, transform: 'translate(-50%, -50%)' }}
                    aria-label={`Your salary at the ${Math.round(percentile)}th percentile`}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted mt-1">
                  <span>{formatSalary(range.low)}</span>
                  <span className="font-semibold text-ink">{formatSalary(range.median)} median</span>
                  <span>{formatSalary(range.high)}</span>
                </div>
                <div className="text-center mt-4">
                  <span className="bg-ink text-white text-sm font-bold px-4 py-1.5 rounded-full">
                    You: {formatSalary(salary)} · {Math.round(percentile)}th percentile
                  </span>
                </div>
              </div>

              {/* Key Insights */}
              <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                <div className="bg-paper rounded-xl p-4">
                  <p className="text-xs text-muted mb-1">Your Salary</p>
                  <p className="font-serif text-xl text-ink">{formatSalary(salary)}</p>
                </div>
                <div className="bg-paper rounded-xl p-4">
                  <p className="text-xs text-muted mb-1">Market Median</p>
                  <p className="font-serif text-xl text-accent">{formatSalary(range.median)}</p>
                </div>
                <div className="bg-paper rounded-xl p-4">
                  <p className="text-xs text-muted mb-1">Your Percentile</p>
                  <p className="font-serif text-xl text-ink">{Math.round(percentile)}th</p>
                </div>
                <div className="bg-paper rounded-xl p-4">
                  <p className="text-xs text-muted mb-1">{isUnderpaid ? 'Gap to Close' : 'Above Median'}</p>
                  <p className={`font-serif text-xl ${isUnderpaid ? 'text-red-500' : 'text-green-600'}`}>
                    {isUnderpaid ? `-${formatSalary(Math.abs(gap))}` : `+${formatSalary(Math.abs(gap))}`}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className={`rounded-2xl p-6 mb-4 ${isUnderpaid ? 'bg-accent-light border border-accent/20' : 'bg-blue/10 border border-blue/20'}`}>
                <h3 className="font-serif text-xl mb-2">
                  {isUnderpaid
                    ? 'Ready to close that gap?'
                    : 'Want to negotiate even higher?'}
                </h3>
                <p className="text-muted text-sm mb-4">
                  {isUnderpaid
                    ? `Get a personalized playbook with exact scripts to negotiate ${formatSalary(Math.abs(gap))}+ more — whether it's a raise or your next offer.`
                    : 'Get a personalized playbook with market data and scripts to maximize your next raise or offer negotiation.'}
                </p>
                <a
                  href="/#pricing"
                  className={`inline-block text-white px-8 py-3 rounded-xl font-semibold hover:-translate-y-0.5 transition-all ${isUnderpaid ? 'bg-accent hover:bg-accent-glow' : 'bg-blue hover:bg-[#245fa0]'}`}
                >
                  Get My Playbook → $39 (30% off with FIRST30)
                </a>
              </div>

              {/* Share */}
              <button
                onClick={handleCopyShare}
                className="text-sm text-muted hover:text-ink transition-colors mt-4"
              >
                {copied ? 'Copied!' : '📋 Copy share link'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-paper pt-28 pb-20 px-6">
        <div className="max-w-[540px] mx-auto">
          {/* Progress */}
          <div className="flex gap-1.5 mb-10">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  i <= currentStep ? 'bg-accent' : 'bg-border'
                }`}
              />
            ))}
          </div>

          {/* Question */}
          <div className="bg-white rounded-3xl border border-border p-8 md:p-12">
            <p className="text-xs text-muted uppercase tracking-wider mb-2">Question {currentStep + 1} of {steps.length}</p>
            <h2 className="font-serif text-2xl md:text-3xl mb-8">{step.question}</h2>

            {step.type === 'text' && (
              <input
                type="text"
                value={currentAnswer}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder={step.placeholder}
                className="w-full px-5 py-4 rounded-xl border border-border text-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                onKeyDown={(e) => e.key === 'Enter' && currentAnswer && handleNext()}
                autoFocus
              />
            )}

            {step.type === 'salary' && (
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted text-lg">$</span>
                <input
                  type="number"
                  value={currentAnswer}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder={step.placeholder}
                  className="w-full pl-10 pr-5 py-4 rounded-xl border border-border text-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  onKeyDown={(e) => e.key === 'Enter' && currentAnswer && handleNext()}
                  autoFocus
                />
              </div>
            )}

            {step.type === 'select' && (
              <div className="space-y-3">
                {step.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { handleAnswer(opt); setTimeout(handleNext, 200); }}
                    className={`w-full text-left px-5 py-4 rounded-xl border text-base transition-all ${
                      currentAnswer === opt
                        ? 'border-accent bg-accent-light text-accent font-semibold'
                        : 'border-border hover:border-accent/50 hover:bg-accent-light/30'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                className={`text-sm text-muted hover:text-ink transition-colors ${currentStep === 0 ? 'invisible' : ''}`}
              >
                ← Back
              </button>
              {step.type !== 'select' && (
                <button
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all ${
                    currentAnswer
                      ? 'bg-accent text-white hover:bg-accent-glow hover:-translate-y-0.5'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {currentStep === steps.length - 1 ? 'See My Results →' : 'Next →'}
                </button>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-muted mt-6">Your data is never stored or shared.</p>
        </div>
      </div>
    </>
  );
}
