// ============================================
// SalaryPrep — Input Sanitization for AI Prompts
// ============================================
// Prevents prompt injection by stripping control sequences and
// truncating inputs to reasonable lengths.

// Max length for any single form field sent to the AI prompt
const MAX_FIELD_LENGTH = 5000;

// Patterns that look like prompt injection attempts
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/gi,
  /ignore\s+(all\s+)?above\s+instructions/gi,
  /disregard\s+(all\s+)?previous/gi,
  /you\s+are\s+now\s+a/gi,
  /system\s*:\s*/gi,
  /assistant\s*:\s*/gi,
  /\[INST\]/gi,
  /<<SYS>>/gi,
  /<\|im_start\|>/gi,
  /BEGIN\s+INSTRUCTION/gi,
  /END\s+INSTRUCTION/gi,
  /\bprompt\s*injection\b/gi,
];

/**
 * Sanitizes a user-provided string before embedding it in an AI prompt.
 * - Truncates to MAX_FIELD_LENGTH
 * - Strips markdown/formatting that could confuse prompt structure
 * - Removes known injection patterns
 * - Replaces prompt boundary markers
 */
export function sanitizeForPrompt(input) {
  if (!input || typeof input !== 'string') return '';

  let sanitized = input;

  // 1. Truncate to prevent token abuse
  if (sanitized.length > MAX_FIELD_LENGTH) {
    sanitized = sanitized.slice(0, MAX_FIELD_LENGTH) + '... [truncated]';
  }

  // 2. Remove known injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[removed]');
  }

  // 3. Neutralize markdown heading markers that could break prompt section structure
  //    "### SECTION" in user input could confuse the AI's output sections
  sanitized = sanitized.replace(/^#{1,6}\s/gm, '');

  // 4. Strip triple-backtick code fences (could wrap fake "system" messages)
  sanitized = sanitized.replace(/```/g, "'''");

  // 5. Collapse excessive newlines (prevent spacing-based injection)
  sanitized = sanitized.replace(/\n{4,}/g, '\n\n\n');

  return sanitized.trim();
}
