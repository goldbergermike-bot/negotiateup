// ============================================
// SalaryPrep — Free Salary Report Generator API
// ============================================
// POST /api/generate-report
// Input: { email, companyId, roleId }
// Output: PDF buffer (application/pdf)
//
// CRITICAL RULES:
// - NO AI calls — pure data extraction + PDFKit
// - Rate limit: 3 reports per email per day
// - All data comes from /research/ markdown files

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseResearchFile } from '../../../lib/markdown-parser';
import { generateReportPDF } from '../../../lib/report-pdf-generator';

// Valid slug pattern
const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Basic email validation
const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');
const MAX_REPORTS_PER_DAY = 3;

// Special role name formatting (duplicated from roles route for independence)
const ROLE_DISPLAY_NAMES = {
  'ml-ai-engineer': 'ML/AI Engineer',
  'devops-engineer': 'DevOps Engineer',
  'technical-program-manager': 'Technical Program Manager',
  'ui-ux-designer': 'UI/UX Designer',
};

function formatRoleName(slug) {
  if (ROLE_DISPLAY_NAMES[slug]) return ROLE_DISPLAY_NAMES[slug];
  return slug
    .split('-')
    .map((word) => {
      if (['ai', 'ml', 'ui', 'ux', 'sre', 'api', 'aws', 'gcp'].includes(word)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

// Special company name formatting
const COMPANY_DISPLAY_NAMES = {
  'openai': 'OpenAI',
  'jpmorgan-chase': 'JPMorgan Chase',
  'xai': 'xAI',
  'att': 'AT&T',
  'amd': 'AMD',
  'de-shaw': 'D.E. Shaw',
  'scale-ai': 'Scale AI',
  'meta': 'Meta',
  'google': 'Google',
  'apple': 'Apple',
  'amazon': 'Amazon',
  'microsoft': 'Microsoft',
  'netflix': 'Netflix',
};

function formatCompanyName(slug) {
  if (COMPANY_DISPLAY_NAMES[slug]) return COMPANY_DISPLAY_NAMES[slug];
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Load leads from the JSON file.
 * Creates the file/directory if they don't exist.
 */
function loadLeads() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(LEADS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Save leads to the JSON file.
 */
function saveLeads(leads) {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
}

/**
 * Check if the given email has exceeded the daily rate limit.
 */
function isRateLimited(email, leads) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  const todayCount = leads.filter((lead) => {
    if (lead.email.toLowerCase() !== email.toLowerCase()) return false;
    const leadDate = new Date(lead.timestamp);
    leadDate.setHours(0, 0, 0, 0);
    return leadDate.getTime() === todayTimestamp;
  }).length;

  return todayCount >= MAX_REPORTS_PER_DAY;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, companyId, roleId } = body;

    // ---- VALIDATE INPUTS ----
    if (!email || !VALID_EMAIL.test(email)) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    if (!companyId || !VALID_SLUG.test(companyId)) {
      return NextResponse.json(
        { error: 'Invalid company ID.' },
        { status: 400 }
      );
    }

    if (!roleId || !VALID_SLUG.test(roleId)) {
      return NextResponse.json(
        { error: 'Invalid role ID.' },
        { status: 400 }
      );
    }

    // ---- RATE LIMIT CHECK ----
    const leads = loadLeads();

    if (isRateLimited(email, leads)) {
      return NextResponse.json(
        { error: 'You have reached the daily limit of 3 reports. Please try again tomorrow.' },
        { status: 429 }
      );
    }

    // ---- LOAD MARKDOWN FILE ----
    const mdPath = path.join(process.cwd(), 'research', companyId, `${roleId}.md`);

    if (!fs.existsSync(mdPath)) {
      return NextResponse.json(
        { error: `No salary data found for ${formatRoleName(roleId)} at ${formatCompanyName(companyId)}. We may not have data for this combination yet.` },
        { status: 404 }
      );
    }

    let content;
    try {
      content = fs.readFileSync(mdPath, 'utf-8');
    } catch {
      return NextResponse.json(
        { error: 'Failed to read salary data file.' },
        { status: 500 }
      );
    }

    // ---- PARSE MARKDOWN ----
    const parsedData = parseResearchFile(content);

    if (!parsedData) {
      return NextResponse.json(
        { error: 'Failed to parse salary data. The file may be malformed.' },
        { status: 500 }
      );
    }

    // ---- GENERATE PDF ----
    const companyName = formatCompanyName(companyId);
    const roleName = formatRoleName(roleId);

    let pdfBuffer;
    try {
      pdfBuffer = await generateReportPDF(parsedData, companyName, roleName);
    } catch (err) {
      console.error('PDF generation error:', err);
      return NextResponse.json(
        { error: 'Failed to generate PDF report.' },
        { status: 500 }
      );
    }

    // ---- SAVE LEAD ----
    leads.push({
      email: email.toLowerCase().trim(),
      companyId,
      roleId,
      timestamp: new Date().toISOString(),
    });
    saveLeads(leads);

    // ---- RETURN PDF ----
    const filename = `SalaryPrep-${companyId}-${roleId}-report.pdf`;

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Generate report error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
