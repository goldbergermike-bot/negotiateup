// ============================================
// SalaryPrep — Main Playbook Generation API
// ============================================
// Flow: Parse form + files → Call Claude AI → Generate PDF → Send email
// Guards: Idempotency (one generation per Stripe session), email failure recovery

import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getOfferPrompt, getRaisePrompt } from '../../../lib/prompts';
import { generatePlaybookPDF } from '../../../lib/pdf-generator';
import { sendPlaybookEmail } from '../../../lib/email';
import { findCompanySlug, findBestRoleMatch, getResearchContent } from '../../../lib/research';

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export const maxDuration = 120; // Allow up to 2 min for generation (Vercel Pro)

export async function POST(req) {
  try {
    const formData = await req.formData();

    const sessionId = formData.get('sessionId');
    const type = formData.get('type'); // 'offer' or 'raise'
    const data = JSON.parse(formData.get('formData'));

    // Verify Stripe session is valid and paid
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed. Please complete checkout first.' },
        { status: 403 }
      );
    }

    // ---- IDEMPOTENCY GUARD ----
    // Prevent duplicate AI generation if user refreshes or retries
    if (session.metadata?.playbook_generated === 'true') {
      console.log(`Playbook already generated for session ${sessionId} — skipping duplicate`);
      return NextResponse.json({
        success: true,
        alreadyGenerated: true,
        message: 'Your playbook has already been generated and emailed. Check your inbox (and spam folder).',
      });
    }

    // Mark session as in-progress immediately to prevent concurrent duplicates
    await stripe.checkout.sessions.update(sessionId, {
      metadata: {
        ...session.metadata,
        playbook_generated: 'in_progress',
      },
    });

    // ---- EXTRACT TEXT FROM UPLOADED FILES ----
    const resumeFile = formData.get('resume');
    const offerLetterFile = formData.get('offerLetter');
    const jobListingFile = formData.get('jobListing');

    if (resumeFile && resumeFile.size > 0) {
      data.resumeText = await extractTextFromFile(resumeFile);
    }
    if (offerLetterFile && offerLetterFile.size > 0) {
      data.offerLetterText = await extractTextFromFile(offerLetterFile);
    }
    if (jobListingFile && jobListingFile.size > 0) {
      data.jobListingText = await extractTextFromFile(jobListingFile);
    }

    // ---- LOOK UP COMPANY RESEARCH DATA ----
    const companySlug = findCompanySlug(data.companyName);
    const roleSlug = companySlug ? findBestRoleMatch(companySlug, data.jobTitle) : null;
    const researchContext = (companySlug && roleSlug) ? getResearchContent(companySlug, roleSlug) : null;

    if (researchContext) {
      console.log(`Research data found: ${companySlug}/${roleSlug} (${researchContext.length} chars)`);
    } else {
      console.log(`No research data found for "${data.companyName}" / "${data.jobTitle}"`);
    }

    // ---- GENERATE PLAYBOOK CONTENT WITH AI ----
    const prompt = type === 'offer'
      ? getOfferPrompt(data, researchContext)
      : getRaisePrompt(data, researchContext);

    console.log(`Generating ${type} playbook for ${data.fullName}...`);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const playbookContent = message.content[0].text;
    console.log(`AI generation complete. Content length: ${playbookContent.length}`);

    // ---- GENERATE PDF ----
    const pdfBuffer = await generatePlaybookPDF(playbookContent, type, data.fullName);
    console.log(`PDF generated. Size: ${pdfBuffer.length} bytes`);

    // ---- SEND EMAIL (with failure recovery) ----
    // If email fails, the playbook is still generated — return PDF as base64 download fallback
    let emailSent = true;
    let emailError = null;
    try {
      await sendPlaybookEmail(data.email, data.fullName, pdfBuffer, type);
      console.log(`Email sent to ${data.email}`);
    } catch (err) {
      emailSent = false;
      emailError = err.message;
      console.error(`Email failed for ${data.email}:`, err);
    }

    // ---- MARK SESSION AS COMPLETE ----
    await stripe.checkout.sessions.update(sessionId, {
      metadata: {
        ...session.metadata,
        playbook_generated: 'true',
        generated_at: new Date().toISOString(),
      },
    });

    // Return success — include PDF download fallback if email failed
    const response = { success: true };
    if (!emailSent) {
      response.emailFailed = true;
      response.emailError = emailError;
      response.pdfBase64 = pdfBuffer.toString('base64');
      response.pdfFilename = `SalaryPrep-${type === 'offer' ? 'Offer' : 'Raise'}-Playbook-${data.fullName.replace(/\s+/g, '-')}.pdf`;
      response.message = 'Your playbook was generated but we had trouble sending the email. You can download it directly below.';
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Playbook generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate playbook. Please try again or contact support.' },
      { status: 500 }
    );
  }
}

// ---- FILE TEXT EXTRACTION ----
async function extractTextFromFile(file) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name?.toLowerCase() || '';

    // For PDFs, use pdf-parse
    if (filename.endsWith('.pdf') || file.type === 'application/pdf') {
      const pdfParse = (await import('pdf-parse')).default;
      const parsed = await pdfParse(buffer);
      return parsed.text;
    }

    // For text files, just decode
    if (filename.endsWith('.txt') || filename.endsWith('.md')) {
      return buffer.toString('utf-8');
    }

    // For images (screenshots of offer letters), describe that we received an image
    if (file.type?.startsWith('image/')) {
      return '[Image uploaded — unable to extract text from image in this version. Please paste offer details in the text fields above for best results.]';
    }

    // For .doc/.docx — basic fallback
    // In production, you'd use mammoth.js or similar
    return buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ').trim();

  } catch (err) {
    console.error('File extraction error:', err);
    return '[Unable to extract text from uploaded file]';
  }
}
