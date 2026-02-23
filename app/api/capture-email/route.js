import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, source } = body;

    // Validate email
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    // Validate source
    if (!source || typeof source !== 'string') {
      return NextResponse.json(
        { error: 'A source identifier is required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedSource = source.trim();

    // Ensure /data directory exists
    const dataDir = path.dirname(LEADS_FILE);
    await fs.mkdir(dataDir, { recursive: true });

    // Read existing leads (or start with empty array)
    let leads = [];
    try {
      const fileContents = await fs.readFile(LEADS_FILE, 'utf-8');
      leads = JSON.parse(fileContents);
      if (!Array.isArray(leads)) {
        leads = [];
      }
    } catch (err) {
      // File doesn't exist or is invalid — start fresh
      if (err.code !== 'ENOENT') {
        console.error('Error reading leads file, starting fresh:', err.message);
      }
      leads = [];
    }

    // Deduplicate: don't add same email+source combination twice
    const isDuplicate = leads.some(
      (lead) => lead.email === normalizedEmail && lead.source === normalizedSource
    );

    if (!isDuplicate) {
      leads.push({
        email: normalizedEmail,
        source: normalizedSource,
        capturedAt: new Date().toISOString(),
      });

      // Atomic write: write to a temp file then rename to prevent corruption
      const tempFile = LEADS_FILE + '.tmp.' + Date.now();
      try {
        await fs.writeFile(tempFile, JSON.stringify(leads, null, 2), 'utf-8');
        await fs.rename(tempFile, LEADS_FILE);
      } catch (writeErr) {
        // Clean up temp file on failure
        try {
          await fs.unlink(tempFile);
        } catch {
          // Temp file may not exist if writeFile failed
        }
        throw writeErr;
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Email capture error:', err);
    return NextResponse.json(
      { error: 'Failed to capture email. Please try again.' },
      { status: 500 }
    );
  }
}
