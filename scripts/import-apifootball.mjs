// scripts/import-apifootball.mjs
// Pulls team and match history from API-Football and upserts into Supabase.
// Run from Termux:
// SUPABASE_URL="https://xxxx.supabase.co" SUPABASE_SERVICE_ROLE_KEY="..." APIF_KEY="5c5b3e3c9a98dd5a09969018da39aa37" node scripts/import-apifootball.mjs

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APIF_KEY = process.env.APIF_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !APIF_KEY) {
  console.error('Missing required environment variables (SUPABASE_URL, SERVICE_ROLE_KEY, or APIF_KEY).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const API_BASE = 'https://v3.football.api-sports.io';

// Example League IDs for Canadian competitions in API-Football (Adjust if needed via /leagues search)
// Canadian Premier League (CPL) / Canadian Championship
const TARGET_LEAGUE_ID = 258; // Replace or expand with your target league ID
const SEASON = 2026;

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function fetchApiFootball(endpoint) {
  const url = `${API_BASE}${endpoint}`;
  console.log(`Fetching: ${url}`);
  const res = await fetch(url, {
    headers: {
      'x-apisports-key': APIF_KEY,
    },
  });

  if (!res.ok) {
    throw new Error(`API-Football request failed (${res.status}): ${res.statusText}`);
  }

  const data = await res.json();
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(`API Error: ${JSON.stringify(data.errors)}`);
  }
  return data.response;
}

async function importTeams() {
  console.log(`Fetching teams for league ID ${TARGET_LEAGUE_ID} (Season: ${SEASON})...`);
  const teamsData = await fetchApiFootball(`/teams?league=${TARGET_LEAGUE_ID}&season=${SEASON}`);
  
  const initialRows = [];
  for (const item of teamsData) {
    const t = item.team;
    const extId = slugify(t.name);
    initialRows.push({
      name: t.name,
      short_name: t.code || null,
      league: 'CPL',
      gender: 'men',
      division_level: 'Professional',
      logo_url: t.logo || null,
      youtube_search_tag: null,
      slug: extId,
      external_id: extId,
    });
  }

  const finalDeduper = new Map();
  for (const row of initialRows) {
    finalDeduper.set(row.external_id, row);
  }
  const uniqueRows = Array.from(finalDeduper.values());

  const { error } = await supabase.from('teams').upsert(uniqueRows, { onConflict: 'external_id' });
  if (error) throw new Error(`Teams upsert failed: ${error.message}`);
  console.log(`Successfully upserted ${uniqueRows.length} teams into Supabase.`);
}

async function getTeamIdMap() {
  const { data, error } = await supabase.from('teams').select('id, external_id');
  if (error) throw new Error(`Teams lookup failed: ${error.message}`);
  return new Map(data.map((t) => [t.external_id, t.id]));
}

async function importFixtures(teamIdMap) {
  console.log(`Fetching fixtures for league ID ${TARGET_LEAGUE_ID} (${SEASON})...`);
  const fixturesData = await fetchApiFootball(`/fixtures?league=${TARGET_LEAGUE_ID}&season=${SEASON}`);

  const initialRows = [];
  let skipped = 0;

  for (const f of fixturesData) {
    const homeName = f.teams.home.name;
    const awayName = f.teams.away.name;

    const homeId = teamIdMap.get(slugify(homeName));
    const awayId = teamIdMap.get(slugify(awayName));

    if (!homeId || !awayId) {
      skipped += 1;
      continue;
    }

    const matchDate = f.fixture.date;
    const extId = slugify(`${matchDate}-${homeName}-${awayName}`);

    initialRows.push({
      home_team_id: homeId,
      away_team_id: awayId,
      match_date: matchDate,
      status: f.fixture.status.short === 'FT' ? 'Finished' : 'Scheduled',
      home_score: f.goals.home ?? 0,
      away_score: f.goals.away ?? 0,
      competition: 'CPL',
      gender: 'men',
      external_id: extId,
    });
  }

  const finalDeduper = new Map();
  for (const row of initialRows) {
    finalDeduper.set(row.external_id, row);
  }
  const uniqueRows = Array.from(finalDeduper.values());

  const { error } = await supabase.from('matches').upsert(uniqueRows, { onConflict: 'external_id' });
  if (error) throw new Error(`Matches upsert failed: ${error.message}`);
  console.log(`Upserted ${uniqueRows.length} matches. Skipped ${skipped} unmatched teams.`);
}

async function main() {
  await importTeams();
  const teamIdMap = await getTeamIdMap();
  await importFixtures(teamIdMap);
  console.log('API-Football import complete!');
}

main().catch((err) => {
  console.error('Import failed:', err.message);
  process.exit(1);
});
