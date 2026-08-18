// scripts/import-thesportsdb.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co';
const activeServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const THESPORTSDB_KEY = process.env.THESPORTSDB_KEY || '123';

if (!activeServiceKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is missing.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, activeServiceKey);

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function smartSyncMatches(incomingMatches) {
  if (!incomingMatches || incomingMatches.length === 0) return;

  // 1. Fetch current matches from Supabase to compare
  const { data: existingMatches } = await supabase
    .from('matches')
    .select('id, external_id, home_score, away_score, status');

  const existingMap = new Map();
  (existingMatches || []).forEach((m) => existingMap.set(m.external_id, m));

  const matchesToUpsert = [];

  for (const incoming of incomingMatches) {
    const existing = existingMap.get(incoming.external_id);

    if (existing) {
      // PROTECT GUARD: If DB already has finished scores, don't let out-of-date API data overwrite them with NULL
      const existingHasScore = existing.home_score !== null && existing.away_score !== null;
      const incomingHasScore = incoming.home_score !== null && incoming.away_score !== null;

      if (existingHasScore && !incomingHasScore) {
        // Keep existing scores and status
        incoming.home_score = existing.home_score;
        incoming.away_score = existing.away_score;
        incoming.status = existing.status;
      }
    }

    matchesToUpsert.push(incoming);
  }

  // 2. Upsert safely without deleting anything
  const { data, error } = await supabase
    .from('matches')
    .upsert(matchesToUpsert, { onConflict: 'external_id' })
    .select('id');

  if (error) {
    console.error('Error during smart match sync:', error.message);
  } else {
    console.log(`Smart Sync updated/preserved ${data?.length || matchesToUpsert.length} matches.`);
  }
}

// ... Additional helper execution code
