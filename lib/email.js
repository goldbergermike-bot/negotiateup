// ============================================
// SalaryPrep — Email Delivery
// ============================================

import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendPlaybookEmail(email, name, pdfBuffer, type) {
  const isOffer = type === 'offer';
  const subject = isOffer
    ? `Your Offer Negotiation Playbook is Ready, ${name.split(' ')[0]}!`
    : `Your Raise Negotiation Playbook is Ready, ${name.split(' ')[0]}!`;

  const filename = isOffer
    ? `SalaryPrep-Offer-Playbook-${name.replace(/\s+/g, '-')}.pdf`
    : `SalaryPrep-Raise-Playbook-${name.replace(/\s+/g, '-')}.pdf`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <span style="color:${isOffer ? '#2d6a4f' : '#1d4e89'};font-size:18px;">↑</span>
      <span style="font-size:20px;font-weight:bold;color:#1a1a1a;"> SalaryPrep</span>
    </div>

    <!-- Main Card -->
    <div style="background:white;border-radius:16px;padding:40px 32px;border:1px solid #e5e2dd;">
      
      <div style="text-align:center;margin-bottom:24px;">
        <span style="font-size:48px;">${isOffer ? '🤝' : '📈'}</span>
      </div>
      
      <h1 style="font-size:24px;color:#1a1a1a;text-align:center;margin:0 0 8px;">
        Your Playbook is Ready!
      </h1>
      
      <p style="color:#6b7280;text-align:center;font-size:16px;margin:0 0 32px;">
        ${isOffer
          ? "Your personalized offer negotiation playbook is attached."
          : "Your personalized raise negotiation playbook is attached."
        }
      </p>

      <div style="background:${isOffer ? '#d8f3dc' : '#d6e5f5'};border-radius:12px;padding:20px 24px;margin-bottom:24px;">
        <p style="margin:0;font-size:14px;color:${isOffer ? '#2d6a4f' : '#1d4e89'};font-weight:bold;">
          📎 Your playbook PDF is attached to this email.
        </p>
        <p style="margin:8px 0 0;font-size:13px;color:#555;">
          Download it, read through it, and follow the step-by-step plan inside.
        </p>
      </div>

      <h2 style="font-size:16px;color:#1a1a1a;margin:24px 0 12px;">Quick Start Guide:</h2>
      
      <div style="font-size:14px;color:#555;line-height:1.8;">
        <p style="margin:0 0 8px;">
          <strong>Step 1:</strong> Read the Executive Summary for your overall strategy.
        </p>
        <p style="margin:0 0 8px;">
          <strong>Step 2:</strong> Review the Market Analysis to understand your worth.
        </p>
        <p style="margin:0 0 8px;">
          <strong>Step 3:</strong> Practice the scripts out loud (seriously — it helps).
        </p>
        <p style="margin:0 0 8px;">
          <strong>Step 4:</strong> Follow the timeline and ${isOffer ? 'make your counter' : 'schedule the conversation'}.
        </p>
      </div>

      <div style="border-top:1px solid #e5e2dd;margin-top:32px;padding-top:24px;text-align:center;">
        <p style="color:#6b7280;font-size:13px;margin:0;">
          Questions? Reply to this email and we'll help.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:24px;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">
        © ${new Date().getFullYear()} SalaryPrep. You received this because you purchased a playbook.
      </p>
    </div>
  </div>
</body>
</html>`;

  const { data, error } = await resend.emails.send({
    from: process.env.FROM_EMAIL || 'SalaryPrep <playbook@salaryprep.com>',
    to: email,
    subject,
    html,
    attachments: [
      {
        filename,
        content: pdfBuffer.toString('base64'),
        contentType: 'application/pdf',
      },
    ],
  });

  if (error) {
    console.error('Email send error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}
