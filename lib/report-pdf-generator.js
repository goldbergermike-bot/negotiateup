// ============================================
// SalaryPrep — Free Salary Report PDF Generator
// ============================================
// Generates a branded PDF report using PDFKit.
// CRITICAL: Uses ONLY data extracted from research markdown files.
// NO AI calls, NO estimates, NO generated data.

import PDFDocument from 'pdfkit';

const COLORS = {
  accent: '#2d6a4f',
  accentLight: '#d8f3dc',
  ink: '#1a1a1a',
  muted: '#6b7280',
  border: '#e5e2dd',
  paper: '#faf8f5',
  white: '#ffffff',
  tableHeader: '#2d6a4f',
  tableRowEven: '#f0fdf4',
  tableRowOdd: '#ffffff',
};

const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

/**
 * Generate a branded salary report PDF.
 *
 * @param {Object} parsedData - Output from parseResearchFile()
 * @param {string} companyName - Display name of the company
 * @param {string} roleName - Display name of the role
 * @returns {Promise<Buffer>} - PDF file as a buffer
 */
export async function generateReportPDF(parsedData, companyName, roleName) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      bufferPages: true,
      info: {
        Title: `Salary Report — ${companyName} ${roleName}`,
        Author: 'SalaryPrep',
        Subject: `Verified salary data for ${roleName} at ${companyName}`,
      },
    });

    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // ===== PAGE 1: COVER =====
    renderCoverPage(doc, companyName, roleName);

    // ===== PAGE 2: SALARY DATA =====
    doc.addPage();
    renderSalaryPage(doc, parsedData, companyName, roleName);

    // ===== PAGE 3: DETAILS & SOURCES =====
    doc.addPage();
    renderDetailsPage(doc, parsedData);

    // ===== FOOTERS ON ALL PAGES =====
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      // Top accent bar
      doc.save();
      doc.rect(0, 0, PAGE_WIDTH, 4).fill(COLORS.accent);
      doc.restore();

      // CTA bar at bottom
      if (i > 0) {
        renderCTA(doc);
      }

      // Footer text
      doc.fontSize(7).fillColor(COLORS.muted).font('Helvetica')
        .text(
          'This report contains only verified data from SalaryPrep\'s database. We do not estimate or generate salary figures.',
          MARGIN,
          PAGE_HEIGHT - 30,
          { width: CONTENT_WIDTH, align: 'center' }
        );

      // Page number (except cover)
      if (i > 0) {
        doc.fontSize(8).fillColor(COLORS.muted).font('Helvetica')
          .text(
            `Page ${i} of ${pages.count - 1}`,
            MARGIN,
            PAGE_HEIGHT - 20,
            { width: CONTENT_WIDTH, align: 'center' }
          );
      }
    }

    doc.end();
  });
}

function renderCoverPage(doc, companyName, roleName) {
  // Dark background
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(COLORS.ink);

  // Top accent bar
  doc.rect(0, 0, PAGE_WIDTH, 5).fill(COLORS.accent);

  // Logo
  doc.fontSize(18).fillColor(COLORS.white).font('Helvetica-Bold')
    .text('SalaryPrep', MARGIN, 50);

  // Decorative accent line
  doc.rect(MARGIN, 90, 60, 3).fill(COLORS.accent);

  // Report label
  doc.fontSize(12).fillColor(COLORS.accent).font('Helvetica-Bold')
    .text('FREE SALARY REPORT', MARGIN, 120);

  // Title
  doc.fontSize(36).fillColor(COLORS.white).font('Helvetica-Bold')
    .text(roleName, MARGIN, 170, { width: CONTENT_WIDTH });

  // Company
  doc.moveDown(0.3);
  doc.fontSize(24).fillColor(COLORS.accent).font('Helvetica')
    .text(`at ${companyName}`, MARGIN, doc.y, { width: CONTENT_WIDTH });

  // Date
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.moveDown(2);
  doc.fontSize(13).fillColor('#888888').font('Helvetica')
    .text(date, MARGIN);

  // Bottom section
  doc.fontSize(11).fillColor('#999999').font('Helvetica')
    .text(
      'This report contains verified salary data extracted from SalaryPrep\'s research database. All figures are sourced from public compensation databases, H1B disclosures, and verified employee reports.',
      MARGIN,
      PAGE_HEIGHT - 140,
      { width: CONTENT_WIDTH }
    );

  doc.fontSize(9).fillColor('#666666').font('Helvetica')
    .text(
      'CONFIDENTIAL — For personal use only. Data sourced from Levels.fyi, Glassdoor, Blind, and H1B disclosures.',
      MARGIN,
      PAGE_HEIGHT - 80
    );
}

function renderSalaryPage(doc, parsedData, companyName, roleName) {
  let y = 30;

  // Section header
  doc.fontSize(10).fillColor(COLORS.accent).font('Helvetica-Bold')
    .text('COMPENSATION OVERVIEW', MARGIN, y);
  y += 20;

  // Title
  doc.fontSize(22).fillColor(COLORS.ink).font('Helvetica-Bold')
    .text(`${roleName} at ${companyName}`, MARGIN, y, { width: CONTENT_WIDTH });
  y = doc.y + 10;

  // Negotiation DNA summary
  if (parsedData.dnaSummary) {
    doc.rect(MARGIN, y, CONTENT_WIDTH, 1).fill(COLORS.border);
    y += 12;
    doc.fontSize(9).fillColor(COLORS.accent).font('Helvetica-Bold')
      .text('NEGOTIATION DNA', MARGIN, y);
    y += 14;
    doc.fontSize(10).fillColor(COLORS.ink).font('Helvetica')
      .text(parsedData.dnaSummary, MARGIN, y, { width: CONTENT_WIDTH });
    y = doc.y + 16;
  }

  // Salary table
  if (parsedData.salaryTable && parsedData.salaryTable.length > 0) {
    doc.rect(MARGIN, y, CONTENT_WIDTH, 1).fill(COLORS.border);
    y += 12;
    doc.fontSize(9).fillColor(COLORS.accent).font('Helvetica-Bold')
      .text('COMPENSATION BY REGION', MARGIN, y);
    y += 16;

    y = renderTable(doc, parsedData.salaryTable, y);
  } else {
    doc.rect(MARGIN, y, CONTENT_WIDTH, 1).fill(COLORS.border);
    y += 12;
    doc.fontSize(11).fillColor(COLORS.muted).font('Helvetica')
      .text('Salary table data not available for this role.', MARGIN, y);
    y = doc.y + 12;
  }

  // Company overview (DNA body) — if there is room
  if (parsedData.dnaBody) {
    y += 8;
    if (y < PAGE_HEIGHT - 180) {
      doc.rect(MARGIN, y, CONTENT_WIDTH, 1).fill(COLORS.border);
      y += 12;
      doc.fontSize(9).fillColor(COLORS.accent).font('Helvetica-Bold')
        .text('COMPANY OVERVIEW', MARGIN, y);
      y += 14;

      // Truncate if needed to fit page
      const maxChars = y < PAGE_HEIGHT - 300 ? 800 : 400;
      let bodyText = parsedData.dnaBody;
      if (bodyText.length > maxChars) {
        bodyText = bodyText.substring(0, maxChars).trim() + '...';
      }

      doc.fontSize(9).fillColor('#333333').font('Helvetica')
        .text(bodyText, MARGIN, y, { width: CONTENT_WIDTH, lineGap: 2 });
    }
  }
}

function renderTable(doc, salaryTable, startY) {
  const colWidths = [130, 95, 100, 55, 105];
  const headers = ['Region', 'Base Salary', 'Stock (RSU/4yr)', 'Bonus', 'Total Comp'];
  const rowHeight = 22;
  let y = startY;

  // Header row
  doc.rect(MARGIN, y, CONTENT_WIDTH, rowHeight).fill(COLORS.tableHeader);

  let x = MARGIN;
  headers.forEach((header, i) => {
    doc.fontSize(8).fillColor(COLORS.white).font('Helvetica-Bold')
      .text(header, x + 6, y + 6, { width: colWidths[i] - 12 });
    x += colWidths[i];
  });
  y += rowHeight;

  // Data rows
  salaryTable.forEach((row, rowIndex) => {
    // Check if we need more space
    if (y > PAGE_HEIGHT - 120) return;

    const bgColor = rowIndex % 2 === 0 ? COLORS.tableRowEven : COLORS.tableRowOdd;
    doc.rect(MARGIN, y, CONTENT_WIDTH, rowHeight).fill(bgColor);

    // Light border between rows
    doc.rect(MARGIN, y, CONTENT_WIDTH, 0.5).fill(COLORS.border);

    x = MARGIN;
    const cells = [row.region, row.base, row.stock, row.bonus, row.totalComp];
    cells.forEach((cell, i) => {
      const displayText = cell || 'N/A';
      const fontName = i === 0 ? 'Helvetica-Bold' : 'Helvetica';
      const fontSize = i === 0 ? 8 : 8;
      doc.fontSize(fontSize).fillColor(COLORS.ink).font(fontName)
        .text(displayText, x + 6, y + 6, { width: colWidths[i] - 12 });
      x += colWidths[i];
    });
    y += rowHeight;
  });

  // Bottom border
  doc.rect(MARGIN, y, CONTENT_WIDTH, 1).fill(COLORS.border);
  y += 4;

  return y;
}

function renderDetailsPage(doc, parsedData) {
  let y = 30;

  // Section header
  doc.fontSize(10).fillColor(COLORS.accent).font('Helvetica-Bold')
    .text('DETAILS & SOURCES', MARGIN, y);
  y += 24;

  // Level Mapping
  doc.fontSize(14).fillColor(COLORS.ink).font('Helvetica-Bold')
    .text('Level Mapping', MARGIN, y);
  y += 20;

  if (parsedData.levelMapping) {
    // Draw a styled box for level mapping
    const levelBoxHeight = 50;
    doc.roundedRect(MARGIN, y, CONTENT_WIDTH, levelBoxHeight, 4)
      .fill('#f0fdf4');
    doc.roundedRect(MARGIN, y, CONTENT_WIDTH, levelBoxHeight, 4)
      .strokeColor(COLORS.accent).lineWidth(0.5).stroke();

    doc.fontSize(9).fillColor(COLORS.ink).font('Helvetica')
      .text(parsedData.levelMapping, MARGIN + 12, y + 10, {
        width: CONTENT_WIDTH - 24,
        lineGap: 3,
      });
    y += levelBoxHeight + 16;
  } else {
    doc.fontSize(10).fillColor(COLORS.muted).font('Helvetica')
      .text('Level mapping data not available for this role.', MARGIN, y);
    y = doc.y + 16;
  }

  // Data Completeness
  doc.fontSize(14).fillColor(COLORS.ink).font('Helvetica-Bold')
    .text('Data Completeness', MARGIN, y);
  y += 20;

  const completeness = parsedData.dataCompleteness;
  if (completeness) {
    // Progress bar background
    const barWidth = 200;
    const barHeight = 14;
    doc.roundedRect(MARGIN, y, barWidth, barHeight, 3).fill('#e5e7eb');

    // Progress bar fill
    const fillWidth = (completeness.percentage / 100) * barWidth;
    const fillColor = completeness.percentage >= 80 ? COLORS.accent : completeness.percentage >= 50 ? '#f59e0b' : '#ef4444';
    doc.roundedRect(MARGIN, y, fillWidth, barHeight, 3).fill(fillColor);

    // Percentage text
    doc.fontSize(9).fillColor(COLORS.ink).font('Helvetica-Bold')
      .text(
        `${completeness.percentage}% — ${completeness.available} of ${completeness.total} data sections available`,
        MARGIN + barWidth + 12,
        y + 2
      );
    y += barHeight + 20;
  }

  // Sources
  doc.fontSize(14).fillColor(COLORS.ink).font('Helvetica-Bold')
    .text('Evidence & Sources', MARGIN, y);
  y += 20;

  if (parsedData.sources && parsedData.sources.length > 0) {
    parsedData.sources.forEach((source, i) => {
      if (y > PAGE_HEIGHT - 120) return;
      doc.fontSize(9).fillColor(COLORS.muted).font('Helvetica')
        .text(`${i + 1}. ${source}`, MARGIN + 8, y, { width: CONTENT_WIDTH - 16 });
      y = doc.y + 4;
    });
  } else {
    doc.fontSize(10).fillColor(COLORS.muted).font('Helvetica')
      .text('Source information not available for this role.', MARGIN, y);
    y = doc.y + 12;
  }

  // Disclaimer
  y += 12;
  if (y < PAGE_HEIGHT - 160) {
    doc.rect(MARGIN, y, CONTENT_WIDTH, 1).fill(COLORS.border);
    y += 12;
    doc.fontSize(8).fillColor(COLORS.muted).font('Helvetica')
      .text(
        'Disclaimer: All salary data in this report is extracted from SalaryPrep\'s verified research database. Figures represent reported compensation ranges and are not predictions or estimates. Actual compensation may vary based on individual factors including experience, performance, location, and negotiation outcomes.',
        MARGIN,
        y,
        { width: CONTENT_WIDTH, lineGap: 2 }
      );
  }
}

function renderCTA(doc) {
  const ctaY = PAGE_HEIGHT - 70;
  const ctaHeight = 28;

  // CTA background bar
  doc.rect(MARGIN, ctaY, CONTENT_WIDTH, ctaHeight).fill('#f0fdf4');
  doc.rect(MARGIN, ctaY, CONTENT_WIDTH, ctaHeight)
    .strokeColor(COLORS.accent).lineWidth(0.5).stroke();

  // CTA text
  doc.fontSize(9).fillColor(COLORS.accent).font('Helvetica-Bold')
    .text(
      'Want the full negotiation playbook with scripts and strategies?  salaryprep.com  —  $39',
      MARGIN + 12,
      ctaY + 9,
      { width: CONTENT_WIDTH - 24, align: 'center' }
    );
}
