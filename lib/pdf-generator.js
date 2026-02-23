// ============================================
// SalaryPrep — PDF Playbook Generator
// ============================================
// Uses PDFKit to create polished, branded PDFs

import PDFDocument from 'pdfkit';

const COLORS = {
  accent: '#2d6a4f',
  accentLight: '#d8f3dc',
  blue: '#1d4e89',
  blueLight: '#d6e5f5',
  ink: '#1a1a1a',
  muted: '#6b7280',
  border: '#e5e2dd',
  paper: '#faf8f5',
  white: '#ffffff',
};

export async function generatePlaybookPDF(content, type, clientName) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 60, bottom: 60, left: 60, right: 60 },
      bufferPages: true,
      info: {
        Title: type === 'offer'
          ? `Offer Negotiation Playbook — ${clientName}`
          : `Raise Negotiation Playbook — ${clientName}`,
        Author: 'SalaryPrep',
      },
    });

    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const color = type === 'offer' ? COLORS.accent : COLORS.blue;
    const colorLight = type === 'offer' ? COLORS.accentLight : COLORS.blueLight;
    const emoji = type === 'offer' ? '🤝' : '📈';
    const title = type === 'offer'
      ? 'Offer Negotiation Playbook'
      : 'Raise Negotiation Playbook';

    // ---- COVER PAGE ----
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(COLORS.ink);

    // Top accent bar
    doc.rect(0, 0, doc.page.width, 6).fill(color);

    // Logo
    doc.fontSize(16).fillColor(COLORS.white).font('Helvetica-Bold')
      .text('SalaryPrep', 60, 50);

    // Main title
    doc.fontSize(38).fillColor(COLORS.white).font('Helvetica-Bold')
      .text(title, 60, 220, { width: doc.page.width - 120 });

    // Client name
    doc.fontSize(18).fillColor(color).font('Helvetica')
      .text(`Prepared for ${clientName}`, 60, 290);

    // Date
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    doc.fontSize(12).fillColor('#888888').font('Helvetica')
      .text(date, 60, 320);

    // Confidential notice
    doc.fontSize(10).fillColor('#666666').font('Helvetica')
      .text('CONFIDENTIAL — Prepared exclusively for the named recipient.', 60, doc.page.height - 80);

    doc.fontSize(9).fillColor('#555555')
      .text('This playbook contains personalized salary negotiation strategies based on your specific situation.', 60, doc.page.height - 65);

    // ---- CONTENT PAGES ----
    doc.addPage();

    // Parse the AI content into sections
    const sections = parseContent(content);

    sections.forEach((section, index) => {
      if (index > 0) {
        // Check if we need a new page (if less than 150pt left)
        if (doc.y > doc.page.height - 150) {
          doc.addPage();
        } else {
          doc.moveDown(1.5);
          // Divider line
          doc.moveTo(60, doc.y).lineTo(doc.page.width - 60, doc.y)
            .strokeColor(COLORS.border).lineWidth(1).stroke();
          doc.moveDown(1);
        }
      }

      // Section header
      doc.fontSize(20).fillColor(color).font('Helvetica-Bold')
        .text(section.title, { width: doc.page.width - 120 });
      doc.moveDown(0.5);

      // Section body - handle formatting
      renderFormattedText(doc, section.body, color);
    });

    // ---- FOOTER ON EACH PAGE ----
    const pages = doc.bufferedPageRange();
    for (let i = 1; i < pages.count; i++) {
      doc.switchToPage(i);
      // Top accent line
      doc.rect(0, 0, doc.page.width, 3).fill(color);
      // Disclaimer
      doc.fontSize(7).fillColor('#999999').font('Helvetica')
        .text(
          'Compensation data sourced from SalaryPrep Research Database. Figures are based on available market data and should be verified with your recruiter.',
          60,
          doc.page.height - 52,
          { width: doc.page.width - 120, align: 'center' }
        );
      // Page number
      doc.fontSize(9).fillColor(COLORS.muted).font('Helvetica')
        .text(
          `SalaryPrep — ${title}  |  Page ${i} of ${pages.count - 1}`,
          60,
          doc.page.height - 40,
          { width: doc.page.width - 120, align: 'center' }
        );
    }

    doc.end();
  });
}

function parseContent(content) {
  const sections = [];
  // Split by ### headers
  const parts = content.split(/### /);

  parts.forEach((part) => {
    const trimmed = part.trim();
    if (!trimmed) return;

    const newlineIndex = trimmed.indexOf('\n');
    if (newlineIndex === -1) return;

    const title = trimmed.substring(0, newlineIndex).replace(/^#+\s*/, '').trim();
    const body = trimmed.substring(newlineIndex + 1).trim();

    if (title && body) {
      sections.push({ title, body });
    }
  });

  // If no sections found (AI didn't use ### format), try ## headers
  if (sections.length === 0) {
    const parts2 = content.split(/## /);
    parts2.forEach((part) => {
      const trimmed = part.trim();
      if (!trimmed) return;

      const newlineIndex = trimmed.indexOf('\n');
      if (newlineIndex === -1) return;

      const title = trimmed.substring(0, newlineIndex).replace(/^#+\s*/, '').trim();
      const body = trimmed.substring(newlineIndex + 1).trim();

      if (title && body) {
        sections.push({ title, body });
      }
    });
  }

  // Fallback: treat entire content as one section
  if (sections.length === 0) {
    sections.push({ title: 'Your Negotiation Playbook', body: content });
  }

  return sections;
}

function renderFormattedText(doc, text, accentColor) {
  const lines = text.split('\n');
  let inTable = false;
  let tableHeaders = [];
  let tableRows = [];

  function flushTable() {
    if (tableHeaders.length > 0 || tableRows.length > 0) {
      renderMarkdownTable(doc, tableHeaders, tableRows, accentColor);
      tableHeaders = [];
      tableRows = [];
    }
    inTable = false;
  }

  lines.forEach((line) => {
    const trimmed = line.trim();

    // Detect markdown table rows
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed.split('|').map((c) => c.trim()).filter(Boolean);
      // Skip separator rows (|---|---|...)
      if (cells.every((c) => /^[-:]+$/.test(c))) {
        inTable = true;
        return;
      }
      if (!inTable && tableHeaders.length === 0) {
        tableHeaders = cells;
        return;
      }
      tableRows.push(cells);
      return;
    }

    // If we were in a table and hit a non-table line, flush
    if (inTable || tableHeaders.length > 0) {
      flushTable();
    }

    if (!trimmed) {
      doc.moveDown(0.3);
      return;
    }

    // Check if we need a new page
    if (doc.y > doc.page.height - 80) {
      doc.addPage();
    }

    // Horizontal rules (---, ***, ___)
    if (/^[-*_]{3,}$/.test(trimmed)) {
      doc.moveDown(0.5);
      doc.moveTo(60, doc.y).lineTo(doc.page.width - 60, doc.y)
        .strokeColor('#e5e2dd').lineWidth(0.5).stroke();
      doc.moveDown(0.5);
      return;
    }

    // Sub-subheadings (#### )
    if (trimmed.startsWith('#### ')) {
      doc.moveDown(0.4);
      doc.fontSize(12).fillColor(accentColor).font('Helvetica-Bold')
        .text(trimmed.replace(/^####\s*/, ''), { width: doc.page.width - 120 });
      doc.moveDown(0.3);
      return;
    }

    // Bold subheaders (** text **) — entire line is bold
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes(':**')) {
      doc.moveDown(0.5);
      doc.fontSize(13).fillColor(accentColor).font('Helvetica-Bold')
        .text(trimmed.replace(/\*\*/g, ''), { width: doc.page.width - 120 });
      doc.moveDown(0.3);
      return;
    }

    // Bold-prefix labels (**Label:** explanation) — render label bold, rest normal
    if (/^\*\*[^*]+:\*\*/.test(trimmed)) {
      doc.moveDown(0.3);
      const match = trimmed.match(/^\*\*([^*]+):\*\*\s*(.*)/);
      if (match) {
        doc.fontSize(11).fillColor('#1a1a1a').font('Helvetica-Bold')
          .text(`${match[1]}:`, { width: doc.page.width - 120, continued: true });
        doc.fontSize(11).fillColor('#333333').font('Helvetica')
          .text(` ${match[2]}`, { width: doc.page.width - 120, continued: false });
      } else {
        doc.fontSize(13).fillColor(accentColor).font('Helvetica-Bold')
          .text(trimmed.replace(/\*\*/g, ''), { width: doc.page.width - 120 });
      }
      doc.moveDown(0.2);
      return;
    }

    // Blockquotes (> text) — render with accent left border
    if (trimmed.startsWith('> ')) {
      const quoteText = trimmed.replace(/^>\s*/, '').replace(/\*\*/g, '');
      doc.moveDown(0.2);
      const quoteX = 72;
      const savedY = doc.y;
      doc.fontSize(11).fillColor('#333333').font('Helvetica-Oblique')
        .text(quoteText, quoteX + 10, doc.y, { width: doc.page.width - 150 });
      const endY = doc.y;
      // Draw left accent bar
      doc.rect(quoteX, savedY - 2, 3, endY - savedY + 4).fill(accentColor);
      doc.moveDown(0.3);
      return;
    }

    // Bullet points
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
      const bulletText = trimmed.replace(/^[-•*]\s*/, '');
      renderRichLine(doc, `  •  ${bulletText}`, 11, doc.page.width - 120);
      doc.moveDown(0.15);
      return;
    }

    // Numbered items
    if (/^\d+[\.\)]\s/.test(trimmed)) {
      renderRichLine(doc, `  ${trimmed}`, 11, doc.page.width - 120);
      doc.moveDown(0.15);
      return;
    }

    // Quoted text / scripts (lines starting with ")
    if (trimmed.startsWith('"') || trimmed.startsWith('\u201c')) {
      doc.fontSize(11).fillColor('#333333').font('Helvetica-Oblique')
        .text(trimmed, { width: doc.page.width - 140, indent: 15 });
      doc.moveDown(0.2);
      return;
    }

    // Regular paragraph
    renderRichLine(doc, trimmed, 11, doc.page.width - 120);
    doc.moveDown(0.2);
  });

  // Flush any remaining table
  if (inTable || tableHeaders.length > 0) {
    flushTable();
  }
}

/**
 * Render a markdown-style table as a styled PDF table.
 */
function renderMarkdownTable(doc, headers, rows, accentColor) {
  if (headers.length === 0 && rows.length === 0) return;

  // Check if we need a new page (need at least room for header + 2 rows)
  const rowHeight = 20;
  const neededHeight = rowHeight * (Math.min(rows.length, 3) + 1) + 20;
  if (doc.y > doc.page.height - neededHeight - 60) {
    doc.addPage();
  }

  doc.moveDown(0.3);

  const startX = 60;
  const tableWidth = doc.page.width - 120;
  const colCount = Math.max(headers.length, rows[0]?.length || 1);
  const colWidth = tableWidth / colCount;
  let y = doc.y;

  // Header row
  if (headers.length > 0) {
    doc.rect(startX, y, tableWidth, rowHeight).fill(accentColor);
    headers.forEach((header, i) => {
      doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold')
        .text(header, startX + i * colWidth + 4, y + 5, {
          width: colWidth - 8,
          height: rowHeight - 4,
        });
    });
    y += rowHeight;
  }

  // Data rows
  rows.forEach((row, rowIdx) => {
    if (y > doc.page.height - 80) return; // Skip rows that won't fit

    const bgColor = rowIdx % 2 === 0 ? '#f0fdf4' : '#ffffff';
    doc.rect(startX, y, tableWidth, rowHeight).fill(bgColor);
    doc.rect(startX, y, tableWidth, 0.5).fill('#e5e2dd');

    row.forEach((cell, i) => {
      if (i >= colCount) return;
      doc.fontSize(8).fillColor('#1a1a1a').font(i === 0 ? 'Helvetica-Bold' : 'Helvetica')
        .text(cell || 'N/A', startX + i * colWidth + 4, y + 5, {
          width: colWidth - 8,
          height: rowHeight - 4,
        });
    });
    y += rowHeight;
  });

  // Bottom border
  doc.rect(startX, y, tableWidth, 1).fill('#e5e2dd');
  doc.y = y + 8;
  doc.moveDown(0.3);
}

function renderRichLine(doc, text, fontSize, width) {
  // Simple bold handling within text: **bold text**
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  
  if (parts.length === 1) {
    // No bold sections
    doc.fontSize(fontSize).fillColor('#333333').font('Helvetica')
      .text(text, { width, continued: false });
    return;
  }

  // Has bold sections - render inline
  parts.forEach((part, i) => {
    const isLast = i === parts.length - 1;
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.replace(/\*\*/g, '');
      doc.fontSize(fontSize).fillColor('#1a1a1a').font('Helvetica-Bold')
        .text(boldText, { width, continued: !isLast });
    } else if (part) {
      doc.fontSize(fontSize).fillColor('#333333').font('Helvetica')
        .text(part, { width, continued: !isLast });
    }
  });
}
