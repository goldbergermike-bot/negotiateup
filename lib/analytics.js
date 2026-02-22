// ============================================
// NegotiateUp — Analytics & Delivery Tracking
// ============================================
// Logs playbook deliveries to a local JSON file
// For production, swap with a database (Supabase, Postgres, etc.)

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), '.data');
const LOG_FILE = join(DATA_DIR, 'deliveries.json');

async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

async function readLog() {
  try {
    const raw = await readFile(LOG_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeLog(entries) {
  await ensureDataDir();
  await writeFile(LOG_FILE, JSON.stringify(entries, null, 2));
}

export async function logDelivery(data) {
  try {
    const entries = await readLog();
    entries.push({
      id: `del_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      ...data,
    });
    await writeLog(entries);
  } catch (err) {
    // Don't let analytics failure break playbook delivery
    console.error('Analytics log error:', err);
  }
}

export async function getDeliveries() {
  return readLog();
}

export async function getStats() {
  const deliveries = await readLog();
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const weekAgo = new Date(now - 7 * 86400000).toISOString();

  return {
    total: deliveries.length,
    today: deliveries.filter(d => d.timestamp?.startsWith(today)).length,
    thisWeek: deliveries.filter(d => d.timestamp >= weekAgo).length,
    byType: {
      offer: deliveries.filter(d => d.type === 'offer').length,
      raise: deliveries.filter(d => d.type === 'raise').length,
    },
    recentDeliveries: deliveries.slice(-20).reverse(),
  };
}
