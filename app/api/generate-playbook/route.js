// ============================================
// NegotiateUp — Main Playbook Generation API
// ============================================
// Flow: Parse form + files → Call Claude AI → Generate PDF → Send email

import { NextResponse } from 'next/server';
import { getOfferPrompt, getRaisePrompt } from '../../../lib/prompts';
import { generatePlaybookPDF } from '../../../lib/pdf-generator';
import { sendPlaybookEmail } from '../../../lib/email';
import { logDelivery } from '../../../lib/analytics';
import { getCompanyIntelForPrompt } from '../../../lib/companies';

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

    // ---- ENRICH WITH COMPANY INTELLIGENCE ----
    if (data.companyName) {
      const companyIntel = getCompanyIntelForPrompt(data.companyName);
      if (companyIntel) {
        data.companyIntel = companyIntel;
      }
    }

    // ---- GENERATE PLAYBOOK CONTENT WITH AI ----
    const prompt = type === 'offer' ? getOfferPrompt(data) : getRaisePrompt(data);

    console.log(`Generating ${type} playbook for ${data.fullName}...`);

    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

    // ---- SEND EMAIL ----
    await sendPlaybookEmail(data.email, data.fullName, pdfBuffer, type);
    console.log(`Email sent to ${data.email}`);

    // ---- LOG DELIVERY ----
    await logDelivery({
      type,
      email: data.email,
      name: data.fullName,
      company: data.companyName,
      title: data.jobTitle,
      sessionId,
      pdfSize: pdfBuffer.length,
      contentLength: playbookContent.length,
    });

    return NextResponse.json({ success: true });

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

    // For .docx files, use mammoth
    if (filename.endsWith('.docx')) {
      const mammoth = (await import('mammoth')).default;
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    // For .doc or other files — basic fallback
    return buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ').trim();

  } catch (err) {
    console.error('File extraction error:', err);
    return '[Unable to extract text from uploaded file]';
  }
}
