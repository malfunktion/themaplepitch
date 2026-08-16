// scripts/import-cpl-data.mjs
//
// One-time (but safe to re-run) import of real CPL teams and match
// history from canadasoccerapi.com (free, CC-BY-4.0, no auth needed —
// see workers/wire-ingest/README.md-style docs for the site's own
// verified-source notes) into Supabase.
//
// Safe to re-run: everything upserts on a stable external_id, so running
// this twice updates existing rows instead of duplicating them.
//
// Needs two env vars, set ONLY in your shell for this run — never
// committed, never NEXT_PUBLIC_:
//   SUPABASE_URL               — same value as NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY  — from Supabase dashboard: Settings > API
//                                 > service_role secret. This key bypasses
//                                 Row Level Security, which is exactly why
//                                 it must never end up in the app itself —
//                                 it's only for trusted scripts like this
//                                 one, run by hand.
//
// Run from Termux:
//   SUPABASE_URL="https://xxxx.supabase.co" SUPABASE_SERVICE_ROLE_KEY="..." node scripts/import-cpl-data.mjs

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars. See the comment at the top of this file.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const API_BASE = 'https://canadasoccerapi.com';


function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents (Atlético -> Atletico)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function importTeams() {
  console.log('Fetching CPL teams (including inactive — historical matches reference them)...');
  const res = await fetch(`${API_BASE}/teams`);
  if (!res.ok) throw new Error(`/api/teams failed: ${res.status}`);
  const { teams } = await res.json();

  // Step 1: Format rows dynamically
  const initialRows = [];
  for (const t of teams) {
    const extId = slugify(t.name);
    initialRows.push({
      name: t.name,
      short_name: null,
      league: 'CPL',
      gender: 'men',
      division_level: 'Professional',
      logo_url: null,
      youtube_search_tag: null,
      slug: extId,
      external_id: extId,
    });
  }

  // Step 2: Strict final deduplication by external_id to guarantee unique batch keys
  const finalDeduper = new Map();
  for (const row of initialRows) {
    finalDeduper.set(row.external_id, row);
  }
  const uniqueRows = Array.from(finalDeduper.values());

  const { error } = await supabase.from('teams').upsert(uniqueRows, { onConflict: 'external_id' });
  if (error) throw new Error(`teams upsert failed: ${error.message}`);
  console.log(`Upserted ${uniqueRows.length} unique teams (${teams.filter((t) => t.status === 'active').length} active, ${teams.filter((t) => t.status !== 'active').length} inactive).`);
}

async function getTeamIdMap() {
  const { data, error } = await supabase.from('teams').select('id, external_id').eq('league', 'CPL');
  if (error) throw new Error(`teams lookup failed: ${error.message}`);
  return new Map(data.map((t) => [t.external_id, t.id]));
}

async function importMatches(teamIdMap) {
  console.log('Fetching CPL match history (2019-2026)...');
  const res = await fetch(`${API_BASE}/matches?limit=500`);
  if (!res.ok) throw new Error(`/api/matches failed: ${res.status}`);
  const { matches, total } = await res.json();
  console.log(`API reports ${total} total matches, fetched ${matches.length}.`);

  const initialRows = [];
  let skipped = 0;
  for (const m of matches) {
    const homeId = teamIdMap.get(slugify(m.home_team));
    const awayId = teamIdMap.get(slugify(m.away_team));
    if (!homeId || !awayId) {
      skipped += 1;
      continue; // team name didn't match anything we just imported — skip rather than guess
    }
    const extId = slugify(`${m.date}-${m.home_team}-${m.away_team}`);
    initialRows.push({
      home_team_id: homeId,
      away_team_id: awayId,
      match_date: m.date,
      status: 'Finished',
      home_score: m.home_goals,
      away_score: m.away_goals,
      competition: 'CPL',
      gender: 'men',
      affiliate_ticket_link: null,
      broadcast_network: null,
      external_id: extId,
    });
  }

  // Strict final deduplication by external_id to guarantee unique match keys
  const finalDeduper = new Map();
  for (const row of initialRows) {
    finalDeduper.set(row.external_id, row);
  }
  const uniqueRows = Array.from(finalDeduper.values());

  const { error } = await supabase.from('matches').upsert(uniqueRows, { onConflict: 'external_id' });
  if (error) throw new Error(`matches upsert failed: ${error.message}`);
  console.log(`Upserted ${uniqueRows.length} unique matches. Skipped ${skipped} (team name didn't match).`);
}

async function main() {
  await importTeams();
  const teamIdMap = await getTeamIdMap();
  await importMatches(teamIdMap);
  console.log('Done.');
}

main().catch((err) => {
  console.error('Import failed:', err.message);
  process.exit(1);
});
