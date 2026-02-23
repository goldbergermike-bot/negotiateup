// ============================================
// SalaryPrep — Markdown Research File Parser
// ============================================
// Extracts structured data from research .md files.
// CRITICAL: Returns ONLY data found in the file.
// If a section is missing, returns null — NEVER estimates.

/**
 * Extract the ### heading (title) from the markdown content.
 * e.g., "### Software Engineer (L3-L4) | Google Global Negotiation Guide"
 * Returns the full heading text without the ### prefix, or null.
 */
export function extractTitle(content) {
  if (!content || typeof content !== 'string') return null;
  const match = content.match(/^###\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Extract the first **Negotiation DNA:** summary line.
 * This is the bold one-liner near the top of the file.
 * Returns the text after "Negotiation DNA:", or null.
 */
export function extractDNASummary(content) {
  if (!content || typeof content !== 'string') return null;
  // Match the first **Negotiation DNA:** line (the summary, not the section)
  const match = content.match(/^\*\*Negotiation DNA:\*\*\s*(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Extract the salary/compensation table from the markdown.
 * Parses the markdown table into an array of objects.
 *
 * Returns: [{ region, base, stock, bonus, totalComp }] or null
 */
export function extractSalaryTable(content) {
  if (!content || typeof content !== 'string') return null;

  // Find the markdown table — starts with | Region or | Header
  // The table has a header row, a separator row (|---|...), then data rows.
  const lines = content.split('\n');

  let tableStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('|') && lines[i].includes('Region')) {
      tableStart = i;
      break;
    }
  }

  if (tableStart === -1) return null;

  // Read header to understand column positions
  const headerCells = lines[tableStart]
    .split('|')
    .map((c) => c.trim())
    .filter(Boolean);

  // Skip the separator row (|---|---|...)
  const separatorIndex = tableStart + 1;
  if (!lines[separatorIndex] || !lines[separatorIndex].includes('---')) {
    return null;
  }

  // Parse data rows
  const rows = [];
  for (let i = separatorIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('|')) break; // End of table

    const cells = line
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean);

    if (cells.length < 4) continue;

    rows.push({
      region: cells[0] || null,
      base: cells[1] || null,
      stock: cells[2] || null,
      bonus: cells[3] || null,
      totalComp: cells[4] || null,
    });
  }

  return rows.length > 0 ? rows : null;
}

/**
 * Extract the **Level Mapping:** line.
 * Returns the text after "Level Mapping:", or null.
 */
export function extractLevelMapping(content) {
  if (!content || typeof content !== 'string') return null;
  const match = content.match(/^\*\*Level Mapping:\*\*\s*(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Extract the **Evidence & Sources** section.
 * Returns an array of source strings, or null.
 */
export function extractSources(content) {
  if (!content || typeof content !== 'string') return null;

  const match = content.match(/\*\*Evidence & Sources\*\*\s*\n([\s\S]*?)$/);
  if (!match) return null;

  const sourceBlock = match[1].trim();
  const sources = sourceBlock
    .split('\n')
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);

  return sources.length > 0 ? sources : null;
}

/**
 * Extract the Negotiation DNA body section (the long-form analysis).
 * This is the section under the **Negotiation DNA** heading (without the colon).
 * Returns the paragraph text, or null.
 */
export function extractDNABody(content) {
  if (!content || typeof content !== 'string') return null;

  // Find the **Negotiation DNA** section heading (no colon — the body section)
  const match = content.match(/^\*\*Negotiation DNA\*\*\s*\n\n([\s\S]*?)(?=\n\*\*[A-Z]|\n$)/m);
  if (!match) return null;

  return match[1].trim() || null;
}

/**
 * Parse an entire research markdown file into a structured object.
 * Returns ONLY data that exists in the file — null for missing sections.
 */
export function parseResearchFile(content) {
  if (!content || typeof content !== 'string') {
    return null;
  }

  const title = extractTitle(content);
  const dnaSummary = extractDNASummary(content);
  const salaryTable = extractSalaryTable(content);
  const levelMapping = extractLevelMapping(content);
  const sources = extractSources(content);
  const dnaBody = extractDNABody(content);

  // Count how many sections have data
  const sections = [title, dnaSummary, salaryTable, levelMapping, sources];
  const available = sections.filter((s) => s !== null).length;
  const total = sections.length;

  return {
    title,
    dnaSummary,
    dnaBody,
    salaryTable,
    levelMapping,
    sources,
    dataCompleteness: {
      available,
      total,
      percentage: Math.round((available / total) * 100),
    },
  };
}
