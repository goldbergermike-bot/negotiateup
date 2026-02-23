#!/usr/bin/env node
// ============================================
// SalaryPrep — Research Database Validation Script
// ============================================
// Validates every file in /research/ against schema rules.
// Exits with code 1 if any failures are found.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RESEARCH_DIR = path.join(__dirname, '..', 'research');

// ---- VALIDATION RULES ----

// Salary value range thresholds per currency
// All values are in the base currency unit
const SALARY_BOUNDS = {
  USD: { min: 10000, max: 10000000 },
  EUR: { min: 8000, max: 8000000 },
  GBP: { min: 7000, max: 7000000 },
  CHF: { min: 9000, max: 9000000 },
  INR: { min: 100000, max: 100000000 },  // ₹1L to ₹10Cr
  AUD: { min: 10000, max: 10000000 },
  CAD: { min: 10000, max: 10000000 },
  SGD: { min: 10000, max: 10000000 },
  HKD: { min: 50000, max: 50000000 },
  CNY: { min: 50000, max: 50000000 },
  JPY: { min: 1000000, max: 500000000 },
  ILS: { min: 30000, max: 30000000 },
};

function getSalaryBounds(currency) {
  return SALARY_BOUNDS[currency] || SALARY_BOUNDS.USD;
}

// ---- VALIDATION ENGINE ----

class ValidationResult {
  constructor(filePath) {
    this.filePath = filePath;
    this.errors = [];    // Hard failures
    this.warnings = [];  // Soft warnings
  }

  addError(msg) { this.errors.push(msg); }
  addWarning(msg) { this.warnings.push(msg); }

  get passed() { return this.errors.length === 0; }
}

function validateFile(filePath, relPath) {
  const result = new ValidationResult(relPath);

  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    result.addError(`Cannot read file: ${err.message}`);
    return result;
  }

  // 1. Check for valid YAML frontmatter
  if (!raw.startsWith('---')) {
    result.addError('Missing YAML frontmatter (file does not start with ---)');
    return result;
  }

  let metadata, content;
  try {
    const parsed = matter(raw);
    metadata = parsed.data;
    content = parsed.content;
  } catch (err) {
    result.addError(`Invalid YAML frontmatter: ${err.message}`);
    return result;
  }

  // 2. Has company and role fields
  if (!metadata.company) {
    result.addError('Missing "company" field in frontmatter');
  }
  if (!metadata.role) {
    result.addError('Missing "role" field in frontmatter');
  }

  // 3. Check company_display
  if (!metadata.company_display) {
    result.addWarning('Missing "company_display" field');
  }

  // 4. Check role_display
  if (!metadata.role_display) {
    result.addWarning('Missing "role_display" field');
  }

  // 5. Check role_type
  if (metadata.role_type && !['standard', 'specialty'].includes(metadata.role_type)) {
    result.addError(`Invalid role_type: "${metadata.role_type}" (must be "standard" or "specialty")`);
  }

  // 6. Check data_quality
  if (metadata.data_quality && !['high', 'medium', 'low'].includes(metadata.data_quality)) {
    result.addError(`Invalid data_quality: "${metadata.data_quality}" (must be "high", "medium", or "low")`);
  }

  // 7. Has compensation array with at least 1 entry
  if (!metadata.compensation || !Array.isArray(metadata.compensation)) {
    result.addError('Missing or invalid "compensation" array');
  } else if (metadata.compensation.length === 0) {
    result.addError('Empty "compensation" array (must have at least 1 entry)');
  } else {
    // 8. Validate each compensation entry
    for (let i = 0; i < metadata.compensation.length; i++) {
      const comp = metadata.compensation[i];
      const prefix = `compensation[${i}] (${comp.region || 'unknown'})`;

      if (!comp.region) {
        result.addError(`${prefix}: Missing "region" field`);
      }

      const currency = comp.currency || 'USD';
      const bounds = getSalaryBounds(currency);

      // Validate salary values are positive numbers within range
      const salaryFields = [
        'base_low', 'base_high', 'stock_low', 'stock_high',
        'total_comp_low', 'total_comp_high',
        'signing_bonus_low', 'signing_bonus_high',
        'bonus_low', 'bonus_high',
      ];

      for (const field of salaryFields) {
        if (comp[field] !== null && comp[field] !== undefined) {
          const val = comp[field];
          if (typeof val !== 'number' || isNaN(val)) {
            result.addError(`${prefix}: "${field}" is not a valid number (got ${val})`);
          } else if (val < 0) {
            result.addError(`${prefix}: "${field}" is negative (${val})`);
          } else if (val < bounds.min) {
            result.addWarning(`${prefix}: "${field}" = ${val} is below expected minimum (${bounds.min} ${currency})`);
          } else if (val > bounds.max) {
            result.addWarning(`${prefix}: "${field}" = ${val} exceeds expected maximum (${bounds.max} ${currency})`);
          }
        }
      }

      // Validate bonus_pct
      if (comp.bonus_pct !== null && comp.bonus_pct !== undefined) {
        if (typeof comp.bonus_pct !== 'number' || isNaN(comp.bonus_pct)) {
          result.addError(`${prefix}: "bonus_pct" is not a valid number`);
        } else if (comp.bonus_pct < 0 || comp.bonus_pct > 200) {
          result.addWarning(`${prefix}: "bonus_pct" = ${comp.bonus_pct}% seems unusual`);
        }
      }

      // Validate low <= high where both exist
      const rangePairs = [
        ['base_low', 'base_high'],
        ['stock_low', 'stock_high'],
        ['total_comp_low', 'total_comp_high'],
        ['signing_bonus_low', 'signing_bonus_high'],
      ];

      for (const [low, high] of rangePairs) {
        if (comp[low] !== null && comp[low] !== undefined &&
            comp[high] !== null && comp[high] !== undefined) {
          if (typeof comp[low] === 'number' && typeof comp[high] === 'number' &&
              comp[low] > comp[high]) {
            result.addWarning(`${prefix}: ${low} (${comp[low]}) > ${high} (${comp[high]})`);
          }
        }
      }

      // Validate currency
      if (!comp.currency) {
        result.addWarning(`${prefix}: Missing "currency" field`);
      }
    }
  }

  // 9. Has at least 1 data source
  if (!metadata.data_sources || !Array.isArray(metadata.data_sources) || metadata.data_sources.length === 0) {
    result.addWarning('No data sources listed');
  }

  // 10. Has negotiation_dna_summary
  if (!metadata.negotiation_dna_summary) {
    result.addWarning('Missing "negotiation_dna_summary"');
  }

  // 11. Markdown body checks — verify original content is still present
  if (!content || content.trim().length === 0) {
    result.addError('Markdown body is empty (original content missing)');
  } else {
    // Check for key sections in the body
    const hasTable = /\|.*\|/.test(content);
    if (!hasTable) {
      result.addWarning('Markdown body does not contain any table');
    }

    // Check for Negotiation DNA section (in either bold or heading format)
    const hasDna = /Negotiation DNA/i.test(content);
    if (!hasDna) {
      result.addWarning('Markdown body does not contain "Negotiation DNA" section');
    }
  }

  return result;
}

// ---- MAIN ----

function main() {
  console.log('=== SalaryPrep Research Database Validation ===\n');

  if (!fs.existsSync(RESEARCH_DIR)) {
    console.error(`ERROR: Research directory not found: ${RESEARCH_DIR}`);
    process.exit(1);
  }

  const companies = fs.readdirSync(RESEARCH_DIR).filter((entry) => {
    return fs.statSync(path.join(RESEARCH_DIR, entry)).isDirectory();
  });

  let totalFiles = 0;
  let passed = 0;
  let failed = 0;
  let totalWarnings = 0;
  let totalErrors = 0;
  const failedFiles = [];
  const warningFiles = [];

  for (const company of companies) {
    const companyDir = path.join(RESEARCH_DIR, company);
    const files = fs.readdirSync(companyDir).filter((f) => f.endsWith('.md'));

    for (const file of files) {
      totalFiles++;
      const filePath = path.join(companyDir, file);
      const relPath = `${company}/${file}`;

      const result = validateFile(filePath, relPath);

      if (result.passed) {
        passed++;
      } else {
        failed++;
        failedFiles.push(result);
      }

      if (result.warnings.length > 0) {
        warningFiles.push(result);
      }

      totalErrors += result.errors.length;
      totalWarnings += result.warnings.length;
    }
  }

  // Print summary
  console.log('--- Summary ---');
  console.log(`Total files:   ${totalFiles}`);
  console.log(`Passed:        ${passed}`);
  console.log(`Failed:        ${failed}`);
  console.log(`Warnings:      ${totalWarnings} across ${warningFiles.length} files`);
  console.log(`Errors:        ${totalErrors}`);
  console.log();

  // Print failures
  if (failedFiles.length > 0) {
    console.log(`--- Failures (${failedFiles.length}) ---`);
    for (const result of failedFiles.slice(0, 50)) {
      console.log(`\n  FILE: ${result.filePath}`);
      for (const err of result.errors) {
        console.log(`    ERROR: ${err}`);
      }
      for (const warn of result.warnings) {
        console.log(`    WARN:  ${warn}`);
      }
    }
    if (failedFiles.length > 50) {
      console.log(`\n  ... and ${failedFiles.length - 50} more failed files`);
    }
    console.log();
  }

  // Print warnings (only first 20)
  if (warningFiles.length > 0) {
    const warningOnlyFiles = warningFiles.filter((r) => r.passed);
    if (warningOnlyFiles.length > 0) {
      console.log(`--- Warnings (showing first 20 of ${warningOnlyFiles.length} files with warnings only) ---`);
      for (const result of warningOnlyFiles.slice(0, 20)) {
        console.log(`\n  FILE: ${result.filePath}`);
        for (const warn of result.warnings) {
          console.log(`    WARN:  ${warn}`);
        }
      }
      if (warningOnlyFiles.length > 20) {
        console.log(`\n  ... and ${warningOnlyFiles.length - 20} more files with warnings`);
      }
      console.log();
    }
  }

  console.log('=== Validation Complete ===');

  // Exit code 1 if any failures
  if (failed > 0) {
    process.exit(1);
  }
}

main();
