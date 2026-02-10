'use client';

import { useState } from 'react';

const faqs = [
  {
    q: "Do you have any discounts?",
    a: "Yes! Use code FIRST30 at checkout for 30% off — that brings your playbook to just $27.30. This is a limited launch special.",
  },
  {
    q: "Can't I just use ChatGPT for this?",
    a: "ChatGPT gives generic negotiation tips. SalaryPrep analyzes YOUR resume, YOUR offer (or current salary), and real market data to generate exact numbers, word-for-word scripts, and a strategy tailored to your company. It's 15 hours of research done in 10 minutes, delivered as a polished PDF you can reference during your actual negotiation.",
  },
  {
    q: 'How is the "raise" playbook different from the "offer" playbook?',
    a: "Very different strategies. Negotiating a new offer is a one-shot conversation with a recruiter where you have competing options. Asking for a raise is an ongoing relationship with your manager where you need a business case, the right timing, and a plan for follow-up. Each playbook is built for the specific dynamics of that situation.",
  },
  {
    q: 'How quickly will I get my playbook?',
    a: 'Under 10 minutes, delivered to your email as a PDF. Most arrive in about 5 minutes.',
  },
  {
    q: "What if I don't have a formal offer letter?",
    a: "No problem. You can enter your offer details manually — salary, title, company, location, and whatever other details you have. Same goes for the raise playbook — just tell us your current title, salary, and company.",
  },
  {
    q: 'What if negotiating backfires?',
    a: "For new offers: rescinded offers from polite negotiation are extremely rare — 73% of employers expect it. For raises: your playbook uses a collaborative, professional approach that strengthens your relationship with your manager, not risks it. Both playbooks include scripts designed to keep the conversation positive.",
  },
  {
    q: 'How is this different from hiring a negotiation coach?',
    a: "Negotiation coaches typically charge $1,250 to $6,000 and take days to schedule. SalaryPrep gives you a comparable personalized strategy — with market data, scripts, and objection handling — for $39 in under 10 minutes. For most people, it's 95% of the value at 3% of the cost.",
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. Your documents are used only to generate your playbook and are never stored or shared. We use industry-standard encryption.',
  },
  {
    q: "What's your refund policy?",
    a: "100% money-back guarantee. If you're not satisfied, email us within 7 days for a full refund. No questions asked. You keep the playbook either way.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 px-6">
      <div className="max-w-[700px] mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">Questions? Answers.</h2>
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-border py-6">
            <button
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              className="w-full flex justify-between items-center text-left font-semibold text-base gap-4"
            >
              {faq.q}
              <span className={`text-accent text-xl shrink-0 transition-transform duration-200 ${
                openIndex === i ? 'rotate-45' : ''
              }`}>+</span>
            </button>
            {openIndex === i && (
              <p className="text-muted text-sm leading-relaxed mt-3">{faq.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
