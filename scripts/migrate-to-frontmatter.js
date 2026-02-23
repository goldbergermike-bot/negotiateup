#!/usr/bin/env node
// ============================================
// SalaryPrep — YAML Frontmatter Migration Script
// ============================================
// Reads each .md file in /research/[company]/,
// parses structured data from the markdown content,
// and prepends YAML frontmatter.
//
// RULES:
// - NEVER modify the markdown body — only PREPEND frontmatter
// - NEVER estimate or generate salary data — extract ONLY what exists
// - If a field can't be parsed, set it to null

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RESEARCH_DIR = path.join(__dirname, '..', 'research');

// ---- CONSTANTS ----

const STANDARD_ROLES = [
  'software-engineer',
  'senior-software-engineer',
  'staff-software-engineer',
  'engineering-manager',
  'product-manager',
  'product-designer',
  'data-scientist',
  'data-engineer',
  'ml-ai-engineer',
  'devops-engineer',
  'security-engineer',
  'solutions-architect',
  'technical-program-manager',
];

const TODAY = '2026-02-23';
const NEXT_REVIEW = '2026-05-23';
const SALARY_DATA_QUARTER = '2025-Q4';

// ---- COMPANY DISPLAY NAME MAPPING ----
// Extracted from app/api/companies/route.js formatCompanyName()

const SPECIAL_COMPANY_NAMES = {
  'amd': 'AMD',
  'att': 'AT&T',
  'bcg': 'BCG',
  'boku': 'Boku',
  'cme-group': 'CME Group',
  'dbt-labs': 'dbt Labs',
  'de-shaw': 'D.E. Shaw',
  'f5': 'F5',
  'fis': 'FIS',
  'hsbc': 'HSBC',
  'jpmorgan-chase': 'JPMorgan Chase',
  'kkr': 'KKR',
  'kpmg': 'KPMG',
  'ncr-voyix': 'NCR Voyix',
  'openai': 'OpenAI',
  'pwc': 'PwC',
  'sofi': 'SoFi',
  'tsmc': 'TSMC',
  'ubs': 'UBS',
  'xai': 'xAI',
  't-mobile': 'T-Mobile',
  'bill-com': 'Bill.com',
  'monday-com': 'Monday.com',
  'remote-com': 'Remote.com',
  'c3-ai': 'C3.ai',
  'fly-io': 'Fly.io',
  'weights-and-biases': 'Weights & Biases',
  'walmart-global-tech': 'Walmart Global Tech',
  'warner-bros-discovery': 'Warner Bros. Discovery',
  'american-express': 'American Express',
  'bank-of-america': 'Bank of America',
  'capital-one': 'Capital One',
  'goldman-sachs': 'Goldman Sachs',
  'morgan-stanley': 'Morgan Stanley',
  'charles-schwab': 'Charles Schwab',
  'wells-fargo': 'Wells Fargo',
  'palo-alto-networks': 'Palo Alto Networks',
  'jane-street': 'Jane Street',
  'two-sigma': 'Two Sigma',
  'citadel-securities': 'Citadel Securities',
  'interactive-brokers': 'Interactive Brokers',
  'ally-financial': 'Ally Financial',
  'deutsche-bank': 'Deutsche Bank',
  'bridgewater-associates': 'Bridgewater Associates',
  'renaissance-technologies': 'Renaissance Technologies',
  'northrop-grumman': 'Northrop Grumman',
  'activision-blizzard': 'Activision Blizzard',
  'electronic-arts': 'Electronic Arts',
  'epic-games': 'Epic Games',
  'epic-systems': 'Epic Systems',
  'take-two-interactive': 'Take-Two Interactive',
  'riot-games': 'Riot Games',
  'scale-ai': 'Scale AI',
  'stability-ai': 'Stability AI',
  'together-ai': 'Together AI',
  'character-ai': 'Character AI',
  'mistral-ai': 'Mistral AI',
  'adept-ai': 'Adept AI',
  'inflection-ai': 'Inflection AI',
  'harvey-ai': 'Harvey AI',
  'hugging-face': 'Hugging Face',
  'aurora-innovation': 'Aurora Innovation',
  'andreessen-horowitz': 'Andreessen Horowitz',
  'new-relic': 'New Relic',
  'pager-duty': 'PagerDuty',
  'check-point': 'Check Point',
  'splunk-cisco': 'Splunk (Cisco)',
  'mercado-libre': 'Mercado Libre',
  'intercontinental-exchange': 'Intercontinental Exchange',
  'unitedhealth-group': 'UnitedHealth Group',
  'global-payments': 'Global Payments',
  'lucid-motors': 'Lucid Motors',
  'match-group': 'Match Group',
  'pure-storage': 'Pure Storage',
  'western-union': 'Western Union',
  'l3harris': 'L3Harris',
  'point72': 'Point72',
  'millennium-management': 'Millennium Management',
  'block': 'Block (Square)',
  'digitalocean': 'DigitalOcean',
  'doordash': 'DoorDash',
  'hashicorp': 'HashiCorp',
  'hashicorp-terraform': 'HashiCorp Terraform',
  'crowdstrike': 'CrowdStrike',
  'cloudflare-workers': 'Cloudflare Workers',
  'sentinelone': 'SentinelOne',
  'cockroach-labs': 'Cockroach Labs',
  'grafana-labs': 'Grafana Labs',
  'arista': 'Arista Networks',
  'launchdarkly': 'LaunchDarkly',
  'snowflake-ai': 'Snowflake AI',
  'databricks-unity': 'Databricks Unity',
  'elastic-security': 'Elastic Security',
  'fidelity-digital-assets': 'Fidelity Digital Assets',
  'huggingface-enterprise': 'Hugging Face Enterprise',
  'brex-ai': 'Brex AI',
  'plaid-identity': 'Plaid Identity',
};

function formatCompanyName(slug) {
  if (SPECIAL_COMPANY_NAMES[slug]) return SPECIAL_COMPANY_NAMES[slug];
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ---- PARSING HELPERS ----

/**
 * Detect currency from a salary string.
 * Returns { currency, symbol } or defaults to USD.
 */
function detectCurrency(str) {
  if (!str) return { currency: 'USD', symbol: '$' };
  const s = str.trim();

  // Order matters: check multi-char prefixes first
  if (/CHF/i.test(s)) return { currency: 'CHF', symbol: 'CHF' };
  if (/CNY/i.test(s)) return { currency: 'CNY', symbol: 'CNY' };
  if (/HK\$/i.test(s)) return { currency: 'HKD', symbol: 'HK$' };
  if (/S\$/i.test(s)) return { currency: 'SGD', symbol: 'S$' };
  if (/A\$/i.test(s)) return { currency: 'AUD', symbol: 'A$' };
  if (/C\$|CA\$/i.test(s)) return { currency: 'CAD', symbol: 'C$' };
  if (/€|EUR/i.test(s)) return { currency: 'EUR', symbol: '€' };
  if (/£|GBP/i.test(s)) return { currency: 'GBP', symbol: '£' };
  if (/₹|INR/i.test(s)) return { currency: 'INR', symbol: '₹' };
  if (/¥|JPY/i.test(s)) return { currency: 'JPY', symbol: '¥' };
  if (/^\$|USD/i.test(s)) return { currency: 'USD', symbol: '$' };

  return { currency: 'USD', symbol: '$' };
}

/**
 * Parse a single salary value from a string like "$152K", "$152,000",
 * "₹20L", "CHF 120K", "A$140,000", "HK$650K", "CNY 450K", "HK$1.29M",
 * "₹36,00,000" (Indian comma grouping), etc.
 *
 * Returns a number (e.g., 152000) or null if unparsable.
 */
function parseSalaryValue(str) {
  if (!str || typeof str !== 'string') return null;

  let s = str.trim();

  // Remove bold markers
  s = s.replace(/\*\*/g, '');

  // Remove currency symbols/prefixes (order matters: longer first)
  s = s.replace(/^(CHF|CNY|HK\$|S\$|A\$|C\$|CA\$|USD|EUR|GBP|INR|AUD|CAD|SGD|JPY|RMB)\s*/i, '');
  s = s.replace(/^[$€£₹¥]\s*/i, '');

  // Remove commas (handles both standard 152,000 and Indian 36,00,000)
  s = s.replace(/,/g, '');

  // Remove trailing + sign
  s = s.replace(/\+$/, '');

  // Handle "L" suffix for Indian lakhs (₹20L = 2,000,000)
  const lakhMatch = s.match(/^([\d.]+)\s*L$/i);
  if (lakhMatch) {
    return Math.round(parseFloat(lakhMatch[1]) * 100000);
  }

  // Handle "M" suffix for millions (HK$1.29M = 1,290,000)
  const millionMatch = s.match(/^([\d.]+)\s*M$/i);
  if (millionMatch) {
    return Math.round(parseFloat(millionMatch[1]) * 1000000);
  }

  // Handle "B" suffix for billions (unlikely but handle)
  const billionMatch = s.match(/^([\d.]+)\s*B$/i);
  if (billionMatch) {
    return Math.round(parseFloat(billionMatch[1]) * 1000000000);
  }

  // Handle "K" suffix for thousands ($152K = 152,000)
  const kMatch = s.match(/^([\d.]+)\s*K$/i);
  if (kMatch) {
    return Math.round(parseFloat(kMatch[1]) * 1000);
  }

  // Handle plain numbers (e.g., "$140,000" already stripped to "140000")
  const plainMatch = s.match(/^([\d.]+)$/);
  if (plainMatch) {
    return Math.round(parseFloat(plainMatch[1]));
  }

  return null;
}

/**
 * Parse a salary range string like "$152K-$215K" or "$152K–$215K"
 * Returns { low, high } or null.
 *
 * For dual-currency like "£75K / $95K – £135K / $170K", we take the FIRST currency.
 * For dual-currency like "£104K / $130K - £132K / $165K", we take the first currency portion.
 */
function parseSalaryRange(str) {
  if (!str || typeof str !== 'string') return null;

  let s = str.trim();
  // Remove bold markers
  s = s.replace(/\*\*/g, '');

  if (s === '-' || s === '—' || s === '–' || s === 'N/A' || s === '' ||
      /^included/i.test(s) || s === 'n/a' || s === 'Varies' || s === 'varies') {
    return null;
  }

  // Step 1: If this is a dual-currency entry, isolate the primary currency portion first.
  // Dual-currency patterns:
  //   "₹18,00,000-₹28,00,000 / $22,000-$34,000"   (INR range / USD range)
  //   "£104K / $130K - £132K / $165K"                (GBP/USD low - GBP/USD high)
  //   "CHF 22K / $25K - CHF 42K / $48K"              (CHF/USD low - CHF/USD high)
  //   "£104K / $130K"                                 (single value, dual currency)

  // Detect if there's a " / " separator indicating dual currencies
  if (s.includes(' / ')) {
    // Pattern A: "RANGE_CURR1 / RANGE_CURR2" — full range in each currency
    // e.g., "₹18,00,000-₹28,00,000 / $22,000-$34,000"
    const slashParts = s.split(/\s*\/\s*/);
    if (slashParts.length === 2) {
      // Try parsing the FIRST part as a complete range
      const firstRange = parseSalaryRangeSimple(slashParts[0].trim());
      if (firstRange) return firstRange;
    }

    // Pattern B: "VAL1_CURR1 / VAL1_CURR2 - VAL2_CURR1 / VAL2_CURR2"
    // e.g., "£104K / $130K - £132K / $165K"
    // Split on the range dash that's between the two dual-currency pairs
    const dualPairMatch = s.match(/^(.+?\/\s*[^-–—]+?)\s*[-–—]\s*(.+?\/\s*.+)$/);
    if (dualPairMatch) {
      const leftFirst = dualPairMatch[1].split('/')[0].trim();
      const rightFirst = dualPairMatch[2].split('/')[0].trim();
      const low = parseSalaryValue(leftFirst);
      const high = parseSalaryValue(rightFirst);
      if (low !== null && high !== null) return { low, high };
    }

    // Fallback: just take the first currency portion (before /)
    const primaryPortion = s.split(/\s*\/\s*/)[0].trim();
    const primaryRange = parseSalaryRangeSimple(primaryPortion);
    if (primaryRange) return primaryRange;
  }

  // Step 2: Parse a simple range (no dual currencies)
  const simpleResult = parseSalaryRangeSimple(s);
  if (simpleResult) return simpleResult;

  return null;
}

/**
 * Parse a simple salary range (no dual-currency handling needed).
 * e.g., "$152K-$215K", "₹18,00,000-₹28,00,000", "CHF 120K – CHF 190K"
 */
function parseSalaryRangeSimple(s) {
  if (!s) return null;

  // Split on range separator: dash/en-dash/em-dash flanked by digits/K/M/L
  const rangeSplitRegex = /(?<=[\d%KkMmLl+])\s*[-–—]\s*(?=[$€£₹¥A-Z]|\d)/;
  const rangeParts = s.split(rangeSplitRegex);

  if (rangeParts.length >= 2) {
    const low = parseSalaryValue(rangeParts[0].trim());
    const high = parseSalaryValue(rangeParts[rangeParts.length - 1].trim());
    if (low !== null && high !== null) return { low, high };
  }

  // Fallback: simple split on dash with surrounding spaces
  const simpleParts = s.split(/\s*[-–—]\s/);
  if (simpleParts.length >= 2) {
    const low = parseSalaryValue(simpleParts[0].trim());
    const high = parseSalaryValue(simpleParts[simpleParts.length - 1].trim());
    if (low !== null && high !== null) return { low, high };
  }

  // Single value
  const singleVal = parseSalaryValue(s);
  if (singleVal !== null) return { low: singleVal, high: singleVal };

  return null;
}

/**
 * Parse a bonus value. Can be:
 * - "15%" -> 15
 * - "15-20%" -> 15 (take the lower)
 * - "15–20%" -> 15
 * - "$20K-$35K" -> { low: 20000, high: 35000 } (absolute bonus)
 * - "10-15% (performance)" -> 10
 * - "$140K-$352K+" -> { low: 140000, high: 352000 }
 * Returns { pct, absoluteRange } where pct is the % number or null,
 * and absoluteRange is { low, high } or null.
 */
function parseBonus(str) {
  if (!str || typeof str !== 'string') return { pct: null, absoluteRange: null };

  const s = str.trim().replace(/\*\*/g, '');
  if (s === '-' || s === '—' || s === '–' || s === 'N/A' || s === '' || s === 'n/a') {
    return { pct: null, absoluteRange: null };
  }

  // Check for percentage pattern first
  const pctRangeMatch = s.match(/([\d.]+)\s*[-–—]\s*([\d.]+)\s*%/);
  if (pctRangeMatch) {
    return { pct: parseFloat(pctRangeMatch[1]), absoluteRange: null };
  }

  const pctMatch = s.match(/([\d.]+)\s*%/);
  if (pctMatch) {
    return { pct: parseFloat(pctMatch[1]), absoluteRange: null };
  }

  // Otherwise, try to parse as an absolute value range
  const range = parseSalaryRange(s);
  if (range) {
    return { pct: null, absoluteRange: range };
  }

  return { pct: null, absoluteRange: null };
}

/**
 * Determine if a markdown table is a compensation/salary table.
 * Returns 'standard' if standard layout (Region column + salary columns),
 * 'level-region' if Level+Region columns + salary columns,
 * 'pivoted' if Level as rows and regions as column headers with salary ranges,
 * 'component-pivoted' if Component/rows are salary fields and columns are regions,
 * or false if not a compensation table.
 */
function classifyCompensationTable(headerLine) {
  if (!headerLine) return false;
  const h = headerLine.toLowerCase();
  const cols = headerLine.split('|').map((c) => c.trim()).filter(Boolean);
  if (cols.length < 2) return false;

  // Standard: has Region/Location column + salary columns
  const hasRegion = /\bregion\b|\blocation\b|\bmarket\b/i.test(h);
  const hasSalary = /base\s*salary|\bbase\b|stock|rsu|equity|options|\bbonus\b|total\s*comp|signing/i.test(h);
  const hasLevel = /\blevel\b/i.test(h);
  const hasComponent = /\bcomponent\b/i.test(h);

  if (hasRegion && hasSalary) {
    if (hasLevel) return 'level-region';
    return 'standard';
  }

  // Level-title: "| Level | Title | Base Salary | RSU | Bonus | Total |"
  // Has Level column + salary columns but no Region column
  if (hasLevel && hasSalary && !hasRegion) {
    return 'level-title';
  }

  // Helper to check if column headers look like region names
  const looksLikeRegion = (c) =>
    /USD|EUR|GBP|CHF|INR|AUD|CAD|SGD|HKD|CNY|JPY|ILS/i.test(c) ||
    /san francisco|new york|seattle|bay area|london|bangalore|austin|nyc|remote|boston|chicago|tel aviv|amsterdam|zurich|toronto|mumbai|singapore|hong kong|tokyo|paris|dublin|berlin|los angeles|atlanta|denver|portland|pittsburgh|philadelphia|mountain view|palo alto|sunnyvale|milpitas|pleasanton|glendale|cambridge|newton|sydney|melbourne|hyderabad/i.test(c);

  // Component-pivoted: "| Component | City1 (USD) | City2 (EUR) | ..."
  if (hasComponent) {
    const otherCols = cols.slice(1);
    if (otherCols.some(looksLikeRegion)) return 'component-pivoted';
  }

  // Level-pivoted: "| Level | City (Currency) | City (Currency) | ..."
  if (hasLevel && !hasSalary) {
    const otherCols = cols.slice(1);
    if (otherCols.some(looksLikeRegion)) return 'pivoted';
  }

  return false;
}

/**
 * Detect currency from a region column header like "San Francisco (USD)" or "London (GBP £)"
 */
function detectCurrencyFromRegionHeader(header) {
  if (!header) return 'USD';
  if (/USD/i.test(header)) return 'USD';
  if (/EUR|€/i.test(header)) return 'EUR';
  if (/GBP|£/i.test(header)) return 'GBP';
  if (/CHF/i.test(header)) return 'CHF';
  if (/INR|₹/i.test(header)) return 'INR';
  if (/AUD|A\$/i.test(header)) return 'AUD';
  if (/CAD|C\$/i.test(header)) return 'CAD';
  if (/SGD|S\$/i.test(header)) return 'SGD';
  if (/HKD|HK\$/i.test(header)) return 'HKD';
  if (/CNY/i.test(header)) return 'CNY';
  if (/JPY|¥/i.test(header)) return 'JPY';
  if (/ILS|₪/i.test(header)) return 'ILS';
  return 'USD';
}

/**
 * Clean a region header to just the city/region name.
 * "San Francisco (USD)" -> "San Francisco"
 * "London (GBP £)" -> "London"
 */
function cleanRegionHeader(header) {
  return header
    .replace(/\s*\([^)]*\)\s*/g, '')
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
    .replace(/\*\*/g, '')
    .trim();
}

/**
 * Parse a standard compensation table row into an entry.
 */
function parseStandardRow(cells, colMap) {
  const regionRaw = colMap.region !== undefined ? cells[colMap.region] : null;
  if (!regionRaw) return null;

  let cleanRegion = regionRaw
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
    .replace(/\*\*/g, '')
    .trim();

  // Skip level/tier names that aren't regions
  if (/^(ICT|Band|Grade|T)\d/i.test(cleanRegion)) return null;

  const baseCell = colMap.base !== undefined ? cells[colMap.base] : null;
  const currencyInfo = detectCurrencyFromCell(baseCell);

  const baseRange = colMap.base !== undefined ? parseSalaryRange(cells[colMap.base]) : null;
  const stockRange = colMap.stock !== undefined ? parseSalaryRange(cells[colMap.stock]) : null;
  const bonusCell = colMap.bonus !== undefined ? cells[colMap.bonus] : null;
  const bonusData = parseBonus(bonusCell);
  const signingBonusRange = colMap.signing_bonus !== undefined ? parseSalaryRange(cells[colMap.signing_bonus]) : null;
  const totalRange = colMap.total !== undefined ? parseSalaryRange(cells[colMap.total]) : null;

  const entry = { region: cleanRegion };

  if (baseRange) { entry.base_low = baseRange.low; entry.base_high = baseRange.high; }
  else { entry.base_low = null; entry.base_high = null; }

  if (stockRange) { entry.stock_low = stockRange.low; entry.stock_high = stockRange.high; }
  else { entry.stock_low = null; entry.stock_high = null; }

  if (bonusData.pct !== null) { entry.bonus_pct = bonusData.pct; }
  else if (bonusData.absoluteRange) { entry.bonus_low = bonusData.absoluteRange.low; entry.bonus_high = bonusData.absoluteRange.high; }
  else { entry.bonus_pct = null; }

  if (signingBonusRange) { entry.signing_bonus_low = signingBonusRange.low; entry.signing_bonus_high = signingBonusRange.high; }

  if (totalRange) { entry.total_comp_low = totalRange.low; entry.total_comp_high = totalRange.high; }
  else { entry.total_comp_low = null; entry.total_comp_high = null; }

  entry.currency = currencyInfo.currency;
  return entry;
}

/**
 * Parse the FIRST compensation markdown table into structured data.
 * Handles three table layouts:
 *   'standard'      — Region | Base | Stock | Bonus | Total
 *   'level-region'  — Level | Region | Base | Stock | ...
 *   'pivoted'       — Level | City1 (USD) | City2 (EUR) | ...
 */
function parseSalaryTable(content) {
  const lines = content.split('\n');
  const compensation = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line.startsWith('|')) { i++; continue; }

    const tableType = classifyCompensationTable(line);
    if (!tableType) { i++; continue; }

    const headerLine = line;
    i++;

    // Find separator row
    let separatorFound = false;
    while (i < lines.length) {
      const nextLine = lines[i].trim();
      if (/^\|[\s\-|:]+\|?$/.test(nextLine)) {
        separatorFound = true;
        i++;
        break;
      }
      if (!nextLine.startsWith('|')) break;
      i++;
    }
    if (!separatorFound) continue;

    const headerCols = headerLine.split('|').map((c) => c.trim()).filter(Boolean);

    if (tableType === 'standard' || tableType === 'level-region' || tableType === 'level-title') {
      // Build column map
      const colMap = {};
      for (let ci = 0; ci < headerCols.length; ci++) {
        const h = headerCols[ci].toLowerCase();
        if (/\bregion\b|\blocation\b|\bmarket\b/i.test(h)) colMap.region = ci;
        else if (/\btitle\b/i.test(h)) colMap.title = ci;
        else if (/\blevel\b/i.test(h)) colMap.level = ci;
        else if (/base\s*salary|\bbase\b/i.test(h)) colMap.base = ci;
        else if (/stock|rsu|equity|options/i.test(h)) colMap.stock = ci;
        else if (/sign(?:ing|[- ]?on)?\s*bonus/i.test(h)) colMap.signing_bonus = ci;
        else if (/(?:annual\s*)?bonus/i.test(h)) colMap.bonus = ci;
        else if (/total\s*comp/i.test(h)) colMap.total = ci;
      }

      // For level-title tables without region, use title or level as region
      if (colMap.region === undefined && tableType === 'level-title') {
        if (colMap.title !== undefined) colMap.region = colMap.title;
        else if (colMap.level !== undefined) colMap.region = colMap.level;
      }

      // Read data rows
      while (i < lines.length) {
        const dataLine = lines[i].trim();
        if (!dataLine.startsWith('|')) break;
        if (/^\|[\s\-|:]+\|?$/.test(dataLine)) { i++; continue; }

        const cells = dataLine.split('|').map((c) => c.trim()).filter(Boolean);
        if (cells.length < 2) { i++; continue; }

        const entry = parseStandardRow(cells, colMap);
        if (entry) compensation.push(entry);
        i++;
      }
    } else if (tableType === 'pivoted') {
      // Pivoted: Level | City1 (USD) | City2 (EUR) | ...
      // Each cell is a total comp range for that region
      const regionHeaders = headerCols.slice(1); // skip "Level"

      // Collect per-region min/max across all level rows
      const regionAgg = {};
      for (const rh of regionHeaders) {
        const regionName = cleanRegionHeader(rh);
        const currency = detectCurrencyFromRegionHeader(rh);
        regionAgg[regionName] = { currency, low: Infinity, high: -Infinity };
      }

      while (i < lines.length) {
        const dataLine = lines[i].trim();
        if (!dataLine.startsWith('|')) break;
        if (/^\|[\s\-|:]+\|?$/.test(dataLine)) { i++; continue; }

        const cells = dataLine.split('|').map((c) => c.trim()).filter(Boolean);
        for (let ci = 1; ci < cells.length && ci - 1 < regionHeaders.length; ci++) {
          const regionName = cleanRegionHeader(regionHeaders[ci - 1]);
          const range = parseSalaryRange(cells[ci]);
          if (range && regionAgg[regionName]) {
            if (range.low < regionAgg[regionName].low) regionAgg[regionName].low = range.low;
            if (range.high > regionAgg[regionName].high) regionAgg[regionName].high = range.high;
          }
        }
        i++;
      }

      for (const [regionName, agg] of Object.entries(regionAgg)) {
        if (agg.low === Infinity || agg.high === -Infinity) continue;
        compensation.push({
          region: regionName,
          base_low: null,
          base_high: null,
          stock_low: null,
          stock_high: null,
          bonus_pct: null,
          total_comp_low: agg.low,
          total_comp_high: agg.high,
          currency: agg.currency,
        });
      }
    } else if (tableType === 'component-pivoted') {
      // Component-pivoted: Component | City1 (USD) | City2 (EUR) | ...
      // Rows are component types (Base Salary, Stock, Bonus, Total Comp)
      // Columns are regions
      const regionHeaders = headerCols.slice(1); // skip "Component"

      // Initialize per-region data
      const regionData = {};
      for (const rh of regionHeaders) {
        const regionName = cleanRegionHeader(rh);
        const currency = detectCurrencyFromRegionHeader(rh);
        regionData[regionName] = {
          currency,
          base_low: null, base_high: null,
          stock_low: null, stock_high: null,
          bonus_pct: null, bonus_low: null, bonus_high: null,
          signing_bonus_low: null, signing_bonus_high: null,
          total_comp_low: null, total_comp_high: null,
        };
      }

      while (i < lines.length) {
        const dataLine = lines[i].trim();
        if (!dataLine.startsWith('|')) break;
        if (/^\|[\s\-|:]+\|?$/.test(dataLine)) { i++; continue; }

        const cells = dataLine.split('|').map((c) => c.trim()).filter(Boolean);
        if (cells.length < 2) { i++; continue; }

        const componentName = cells[0].replace(/\*\*/g, '').trim().toLowerCase();

        for (let ci = 1; ci < cells.length && ci - 1 < regionHeaders.length; ci++) {
          const regionName = cleanRegionHeader(regionHeaders[ci - 1]);
          const rd = regionData[regionName];
          if (!rd) continue;

          if (/base\s*salary|\bbase\b/i.test(componentName)) {
            const range = parseSalaryRange(cells[ci]);
            if (range) { rd.base_low = range.low; rd.base_high = range.high; }
          } else if (/stock|rsu|equity|options/i.test(componentName)) {
            const range = parseSalaryRange(cells[ci]);
            if (range) { rd.stock_low = range.low; rd.stock_high = range.high; }
          } else if (/sign(ing|[- ]?on)?\s*bonus/i.test(componentName)) {
            const range = parseSalaryRange(cells[ci]);
            if (range) { rd.signing_bonus_low = range.low; rd.signing_bonus_high = range.high; }
          } else if (/annual\s*bonus|\bbonus\b/i.test(componentName)) {
            const bonusData = parseBonus(cells[ci]);
            if (bonusData.pct !== null) { rd.bonus_pct = bonusData.pct; }
            else if (bonusData.absoluteRange) { rd.bonus_low = bonusData.absoluteRange.low; rd.bonus_high = bonusData.absoluteRange.high; }
          } else if (/total\s*comp/i.test(componentName)) {
            const range = parseSalaryRange(cells[ci]);
            if (range) { rd.total_comp_low = range.low; rd.total_comp_high = range.high; }
          }
        }
        i++;
      }

      for (const [regionName, rd] of Object.entries(regionData)) {
        // Only add if we got at least some data
        if (rd.base_low !== null || rd.total_comp_low !== null || rd.stock_low !== null) {
          const entry = { region: regionName };
          entry.base_low = rd.base_low;
          entry.base_high = rd.base_high;
          entry.stock_low = rd.stock_low;
          entry.stock_high = rd.stock_high;

          if (rd.bonus_pct !== null) { entry.bonus_pct = rd.bonus_pct; }
          else if (rd.bonus_low !== null) { entry.bonus_low = rd.bonus_low; entry.bonus_high = rd.bonus_high; }
          else { entry.bonus_pct = null; }

          if (rd.signing_bonus_low !== null) {
            entry.signing_bonus_low = rd.signing_bonus_low;
            entry.signing_bonus_high = rd.signing_bonus_high;
          }

          entry.total_comp_low = rd.total_comp_low;
          entry.total_comp_high = rd.total_comp_high;
          entry.currency = rd.currency;
          compensation.push(entry);
        }
      }
    }

    // We found and parsed the first compensation table
    if (compensation.length > 0) break;
    // If no data rows found, continue looking for next table
  }

  return compensation;
}

/**
 * Detect currency from a cell content string.
 */
function detectCurrencyFromCell(cellStr) {
  if (!cellStr) return { currency: 'USD', symbol: '$' };
  return detectCurrency(cellStr);
}

/**
 * Extract the title from the FIRST heading line in the file.
 * Handles multiple heading formats:
 *   "### Software Engineer (L3-L4) | Google Global Negotiation Guide"
 *   "### Data Engineer — Airwallex Salary Negotiation Guide"
 *   "# Software Engineer - Microsoft Negotiation Guide"
 */
function parseTitle(content) {
  // Match the FIRST heading in the file (any level: #, ##, ###, etc.)
  const match = content.match(/^(#{1,6})\s+(.+?)$/m);
  if (!match) return null;

  let title = match[2].trim();

  // Remove the company/guide suffix after | separator
  title = title.replace(/\s*\|\s+.+$/, '').trim();

  // Remove guide/negotiation suffixes after — or - separators
  title = title.replace(/\s*[—–]\s+.+?(?:Salary|Negotiation|Guide|Comp).*/i, '').trim();
  title = title.replace(/\s+-\s+.+?(?:Salary|Negotiation|Guide|Comp).*/i, '').trim();

  return title || null;
}

/**
 * Extract the Negotiation DNA summary line.
 * Matches the FIRST occurrence of **Negotiation DNA:** or **Negotiation DNA**:
 */
function parseNegotiationDnaSummary(content) {
  const match = content.match(/\*\*Negotiation DNA:?\*\*:?\s*(.+)/);
  if (!match) return null;

  let summary = match[1].trim();
  // Cap at 500 chars to keep frontmatter manageable
  if (summary.length > 500) {
    summary = summary.substring(0, 500);
  }
  return summary || null;
}

/**
 * Extract level mapping from **Level Mapping:** line.
 */
function parseLevelMapping(content) {
  const match = content.match(/\*\*Level Mapping:?\*\*:?\s*(.+)/);
  if (!match) return null;
  return match[1].trim() || null;
}

/**
 * Extract internal level notation from title.
 * e.g., "L3-L4" from "Software Engineer (L3-L4)"
 */
function parseInternalLevel(title) {
  if (!title) return null;
  const parenMatch = title.match(/\(([^)]+)\)/);
  if (parenMatch) {
    return parenMatch[1].trim();
  }
  return null;
}

/**
 * Extract sources from the Evidence & Sources section.
 * Handles multiple formats:
 * - **Evidence & Sources** with - bullet points
 * - **Evidence & Sources:** with 1. numbered lists
 * - ## Evidence & Sources with - [1] bracketed references
 * - #### Evidence & Sources variants
 * - #### Extended Evidence & Sources
 * - ### Primary Data Sources
 *
 * Returns an array of source strings.
 */
function parseSources(content) {
  // Try multiple patterns for the Evidence/Sources heading
  const patterns = [
    // ## or ### or #### heading variants
    /(?:^#{2,4}\s+(?:Extended\s+)?Evidence\s*&?\s*Sources\b.*$)/mi,
    /(?:^#{2,4}\s+Primary\s+Data\s+Sources\b.*$)/mi,
    // **bold** variants: **Evidence & Sources**, **Evidence & Sources:**, **Evidence & Sources:**
    // The colon can be inside or outside the bold markers
    /(?:^\*\*(?:Extended\s+)?Evidence\s*&?\s*Sources:?\*\*:?\s*$)/mi,
  ];

  let sourcesBlock = null;

  for (const pattern of patterns) {
    const headingMatch = content.match(pattern);
    if (headingMatch) {
      // Determine the heading level of the matched heading
      const matchedText = headingMatch[0];
      let headingLevel = 0;
      const levelMatch = matchedText.match(/^(#{1,6})\s/);
      if (levelMatch) {
        headingLevel = levelMatch[1].length; // e.g., ## -> 2, #### -> 4
      } else {
        headingLevel = 3; // **bold** headings treated as level 3
      }

      const startIdx = headingMatch.index + headingMatch[0].length;
      const rest = content.substring(startIdx);

      // Find the end: next heading of SAME or HIGHER level (fewer #), or a **bold heading** that starts a new section
      // Sub-headings (### inside ##) should be included, not used as terminators
      let endPattern;
      if (headingLevel <= 2) {
        // ## heading: stop at ## or # (not ### or ####)
        endPattern = /\n(?=#{1,2}\s[^#])/;
      } else if (headingLevel <= 3) {
        // ### or **bold**: stop at #, ##, or ### (but not ####)
        endPattern = /\n(?=#{1,3}\s[^#])/;
      } else {
        // #### heading: stop at #, ##, ###, or #### headings
        endPattern = /\n(?=#{1,4}\s[^#])/;
      }

      const endMatch = rest.match(endPattern);
      sourcesBlock = endMatch ? rest.substring(0, endMatch.index) : rest;
      break;
    }
  }

  if (!sourcesBlock) return [];

  const sources = [];
  const lines = sourcesBlock.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let source = null;

    // Handle bullet points: "- Source text" or "* Source text"
    if (/^[-*]\s+/.test(trimmed)) {
      source = trimmed.replace(/^[-*]\s+/, '').trim();
    }
    // Handle numbered lists: "1. Source text" or "1) Source text"
    else if (/^\d+[.)]\s+/.test(trimmed)) {
      source = trimmed.replace(/^\d+[.)]\s+/, '').trim();
    }

    if (!source) {
      // Also handle lines that start with [N] directly (no bullet prefix)
      // e.g., "[1] Atlassian Compensation Philosophy -- ..."
      if (/^\[\d+\]\s+/.test(trimmed)) {
        source = trimmed.replace(/^\[\d+\]\s*/, '').trim();
      } else {
        continue;
      }
    }

    // Remove leading bracketed numbers like [1], [2]
    source = source.replace(/^\[\d+\]\s*/, '').trim();

    // Remove outer markdown link brackets: [Source Name](url) -> Source Name
    source = source.replace(/^\[(.+?)\]\(.+?\)$/, '$1');

    // Remove outer brackets: [Source Name] -> Source Name
    source = source.replace(/^\[(.+)\]$/, '$1');

    if (source) sources.push(source);
  }

  return sources;
}

/**
 * Extract clean source names for data_sources frontmatter.
 */
function extractDataSourceNames(sources) {
  const knownSources = [
    'Levels.fyi', 'Glassdoor', 'Blind', 'LinkedIn', 'Payscale',
    'Salary.com', 'Indeed', 'Comparably', 'H1B', 'Paysa',
    'TeamBlind', 'Reddit', 'Fishbowl', 'Dice', 'Hired',
    'AngelList', 'Wellfound', 'BuiltIn', 'Crunchbase',
  ];

  const found = new Set();
  for (const source of sources) {
    const lower = source.toLowerCase();
    for (const known of knownSources) {
      if (lower.includes(known.toLowerCase())) {
        found.add(known);
      }
    }
    if (/h1b|h-1b/i.test(lower)) found.add('H1B Salary Data');
  }

  // If no known sources matched, use the raw source strings (trimmed)
  if (found.size === 0 && sources.length > 0) {
    for (const source of sources) {
      // Take just the core source name, removing dates/URLs in parens
      let cleaned = source
        .replace(/\s*\(.+?\)\s*$/, '')
        .replace(/\s*[-–—]\s*\d{4}.*$/, '')
        .trim();
      if (cleaned.length > 100) cleaned = cleaned.substring(0, 100);
      if (cleaned) found.add(cleaned);
    }
  }

  return Array.from(found);
}

/**
 * Determine data_quality based on sources.
 * 4+ sources with 2024+ dates = "high"
 * 2-3 sources = "medium"
 * 0-1 = "low"
 */
function assessDataQuality(sources) {
  if (sources.length === 0) return 'low';

  const recentSources = sources.filter((s) => /202[4-9]|203\d/i.test(s));

  if (sources.length >= 4 && recentSources.length >= 1) return 'high';
  if (sources.length >= 2) return 'medium';
  return 'low';
}

/**
 * Check if a file already has YAML frontmatter (starts with ---)
 */
function hasFrontmatter(content) {
  return /^---\s*\n/.test(content);
}

// ---- YAML GENERATION ----

/**
 * Escape a string for YAML. Wraps in double quotes if needed.
 */
function yamlString(val) {
  if (val === null || val === undefined) return 'null';
  const s = String(val);
  if (/[:{}\[\],&*?|>!%@`#'"\n\\]/.test(s) || /^[-?:\s]/.test(s) || s === '' ||
      s === 'true' || s === 'false' || s === 'null' || /^\d+$/.test(s)) {
    const escaped = s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `"${escaped}"`;
  }
  return s;
}

/**
 * Generate YAML frontmatter string from parsed data.
 */
function generateFrontmatter(data) {
  const lines = ['---'];

  lines.push(`company: ${yamlString(data.company)}`);
  lines.push(`company_display: ${yamlString(data.company_display)}`);
  lines.push(`role: ${yamlString(data.role)}`);
  lines.push(`role_display: ${yamlString(data.role_display)}`);
  lines.push(`role_type: ${yamlString(data.role_type)}`);
  lines.push(`last_updated: ${yamlString(data.last_updated)}`);
  lines.push(`data_quality: ${yamlString(data.data_quality)}`);
  lines.push(`salary_data_quarter: ${yamlString(data.salary_data_quarter)}`);
  lines.push(`next_review_due: ${yamlString(data.next_review_due)}`);

  // Compensation array
  if (data.compensation && data.compensation.length > 0) {
    lines.push('compensation:');
    for (const comp of data.compensation) {
      lines.push(`  - region: ${yamlString(comp.region)}`);
      lines.push(`    base_low: ${comp.base_low ?? 'null'}`);
      lines.push(`    base_high: ${comp.base_high ?? 'null'}`);

      if (comp.stock_low !== undefined) {
        lines.push(`    stock_low: ${comp.stock_low ?? 'null'}`);
        lines.push(`    stock_high: ${comp.stock_high ?? 'null'}`);
      }

      if (comp.bonus_pct !== undefined && comp.bonus_pct !== null) {
        lines.push(`    bonus_pct: ${comp.bonus_pct}`);
      } else if (comp.bonus_low !== undefined) {
        lines.push(`    bonus_low: ${comp.bonus_low ?? 'null'}`);
        lines.push(`    bonus_high: ${comp.bonus_high ?? 'null'}`);
      } else {
        lines.push(`    bonus_pct: null`);
      }

      if (comp.signing_bonus_low !== undefined) {
        lines.push(`    signing_bonus_low: ${comp.signing_bonus_low ?? 'null'}`);
        lines.push(`    signing_bonus_high: ${comp.signing_bonus_high ?? 'null'}`);
      }

      lines.push(`    total_comp_low: ${comp.total_comp_low ?? 'null'}`);
      lines.push(`    total_comp_high: ${comp.total_comp_high ?? 'null'}`);
      lines.push(`    currency: ${yamlString(comp.currency)}`);
    }
  } else {
    lines.push('compensation: []');
  }

  // Level mapping
  lines.push('level_mapping:');
  if (data.internal_level) {
    lines.push(`  internal: ${yamlString(data.internal_level)}`);
  } else {
    lines.push(`  internal: null`);
  }
  if (data.level_mapping_raw) {
    lines.push(`  raw: ${yamlString(data.level_mapping_raw)}`);
  }

  // Data sources
  if (data.data_sources && data.data_sources.length > 0) {
    lines.push('data_sources:');
    for (const src of data.data_sources) {
      lines.push(`  - ${yamlString(src)}`);
    }
  } else {
    lines.push('data_sources: []');
  }

  // Negotiation DNA summary
  lines.push(`negotiation_dna_summary: ${yamlString(data.negotiation_dna_summary)}`);

  lines.push('---');

  return lines.join('\n');
}

// ---- MAIN MIGRATION ----

function migrateFile(companySlug, filename) {
  const filePath = path.join(RESEARCH_DIR, companySlug, filename);
  const roleSlug = filename.replace('.md', '');

  const raw = fs.readFileSync(filePath, 'utf-8');

  // Skip files that already have frontmatter
  if (hasFrontmatter(raw)) {
    return { status: 'skipped', reason: 'already has frontmatter' };
  }

  // Parse all fields
  const title = parseTitle(raw);
  const dnaSummary = parseNegotiationDnaSummary(raw);
  const levelMappingRaw = parseLevelMapping(raw);
  const internalLevel = parseInternalLevel(title);
  const sources = parseSources(raw);
  const dataSourceNames = extractDataSourceNames(sources);
  const dataQuality = assessDataQuality(sources);
  const compensation = parseSalaryTable(raw);
  const roleType = STANDARD_ROLES.includes(roleSlug) ? 'standard' : 'specialty';

  const data = {
    company: companySlug,
    company_display: formatCompanyName(companySlug),
    role: roleSlug,
    role_display: title || roleSlug,
    role_type: roleType,
    last_updated: TODAY,
    data_quality: dataQuality,
    salary_data_quarter: SALARY_DATA_QUARTER,
    next_review_due: NEXT_REVIEW,
    compensation,
    internal_level: internalLevel,
    level_mapping_raw: levelMappingRaw,
    data_sources: dataSourceNames,
    negotiation_dna_summary: dnaSummary,
  };

  const frontmatter = generateFrontmatter(data);

  // Prepend frontmatter to original content
  const newContent = frontmatter + '\n' + raw;
  fs.writeFileSync(filePath, newContent, 'utf-8');

  return {
    status: 'migrated',
    compensation_entries: compensation.length,
    sources_count: sources.length,
    data_quality: dataQuality,
  };
}

function main() {
  console.log('=== SalaryPrep YAML Frontmatter Migration ===\n');

  if (!fs.existsSync(RESEARCH_DIR)) {
    console.error(`ERROR: Research directory not found: ${RESEARCH_DIR}`);
    process.exit(1);
  }

  const companies = fs.readdirSync(RESEARCH_DIR).filter((entry) => {
    return fs.statSync(path.join(RESEARCH_DIR, entry)).isDirectory();
  });

  let totalFiles = 0;
  let migrated = 0;
  let skipped = 0;
  let errors = 0;
  const errorDetails = [];
  const warnings = [];

  for (const company of companies) {
    const companyDir = path.join(RESEARCH_DIR, company);
    const files = fs.readdirSync(companyDir).filter((f) => f.endsWith('.md'));

    for (const file of files) {
      totalFiles++;
      try {
        const result = migrateFile(company, file);
        if (result.status === 'migrated') {
          migrated++;
          if (result.compensation_entries === 0) {
            warnings.push(`${company}/${file}: No compensation data parsed from table`);
          }
          if (result.sources_count === 0) {
            warnings.push(`${company}/${file}: No sources found`);
          }
        } else if (result.status === 'skipped') {
          skipped++;
        }
      } catch (err) {
        errors++;
        errorDetails.push(`${company}/${file}: ${err.message}`);
      }
    }
  }

  // Print summary
  console.log(`Companies processed: ${companies.length}`);
  console.log(`Total files found:   ${totalFiles}`);
  console.log(`Migrated:            ${migrated}`);
  console.log(`Skipped (existing):  ${skipped}`);
  console.log(`Errors:              ${errors}`);
  console.log();

  if (warnings.length > 0) {
    console.log(`Warnings (${warnings.length}):`);
    for (const w of warnings.slice(0, 30)) {
      console.log(`  WARNING: ${w}`);
    }
    if (warnings.length > 30) {
      console.log(`  ... and ${warnings.length - 30} more warnings`);
    }
    console.log();
  }

  if (errorDetails.length > 0) {
    console.log(`Error details:`);
    for (const e of errorDetails) {
      console.log(`  ERROR: ${e}`);
    }
    console.log();
  }

  console.log('=== Migration Complete ===');
}

main();
