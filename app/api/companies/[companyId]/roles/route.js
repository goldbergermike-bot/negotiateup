// ============================================
// SalaryPrep — Company Roles API
// ============================================
// GET /api/companies/[companyId]/roles
// Returns available roles for a given company from /research/[companyId]/
// ONLY reads actual .md files — no guessing or generating.

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Valid slug pattern — alphanumeric + hyphens only, no path traversal
const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Special role name formatting
const ROLE_DISPLAY_NAMES = {
  'ml-ai-engineer': 'ML/AI Engineer',
  'devops-engineer': 'DevOps Engineer',
  'technical-program-manager': 'Technical Program Manager',
  'ui-ux-designer': 'UI/UX Designer',
};

/**
 * Convert a role slug to a display name.
 * "software-engineer" -> "Software Engineer"
 * "ml-ai-engineer" -> "ML/AI Engineer"
 */
function formatRoleName(slug) {
  if (ROLE_DISPLAY_NAMES[slug]) return ROLE_DISPLAY_NAMES[slug];

  return slug
    .split('-')
    .map((word) => {
      // Keep common abbreviations uppercase
      if (['ai', 'ml', 'ui', 'ux', 'sre', 'api', 'aws', 'gcp'].includes(word)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export async function GET(request, { params }) {
  try {
    const { companyId } = await params;

    // Validate companyId — must be a safe slug
    if (!companyId || !VALID_SLUG.test(companyId)) {
      return NextResponse.json(
        { error: 'Invalid company ID. Must be a valid slug (lowercase, hyphens only).' },
        { status: 400 }
      );
    }

    const researchDir = path.join(process.cwd(), 'research', companyId);

    // Check if directory exists
    if (!fs.existsSync(researchDir)) {
      return NextResponse.json(
        { error: `No data found for company: ${companyId}` },
        { status: 404 }
      );
    }

    // Verify it's actually a directory (prevents path traversal attacks)
    const stat = fs.statSync(researchDir);
    if (!stat.isDirectory()) {
      return NextResponse.json(
        { error: 'Invalid company ID.' },
        { status: 400 }
      );
    }

    // Read all .md files in the directory
    const files = fs.readdirSync(researchDir).filter((f) => f.endsWith('.md'));

    const roles = files.map((filename) => {
      const id = filename.replace('.md', '');
      return {
        id,
        name: formatRoleName(id),
      };
    });

    // Sort alphabetically by name
    roles.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles.' },
      { status: 500 }
    );
  }
}
