// scripts/import-thesportsdb.mjs
// Pulls team and match history from TheSportsDB for CPL and NSL and upserts into Supabase.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const TSDB_KEY = process.env.THESPORTSDB_KEY || process.env.THESPORTSDB_KEY || process.env.APIF_KEY || '123';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables (SUPABASE_URL or SERVICE_ROLE_KEY).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const API_BASE = `https://www.thesportsdb.com/api/v1/json/${TSDB_KEY}`;

// Target Leagues: CPL (4820) and NSL (5602)
const TARGET_LEAGUES = [
  { id: 4820, code: 'CPL', gender: 'men' },
  { id: 5602, code: 'NSL', gender: 'women' }
];

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function fetchTheSportsDB(endpoint) {
  const url = `${API_BASE}${endpoint}`;
  console.log(`Fetching: ${url}`);
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`TheSportsDB request failed (${res.status}): ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

async function importTeams() {
  const initialRows = [];

  for (const leagueConfig of TARGET_LEAGUES) {
    console.log(`Fetching teams for ${leagueConfig.code} (League ID: ${leagueConfig.id})...`);
    try {
      const data = await fetchTheSportsDB(`/lookup_all_teams.php?id=${leagueConfig.id}`);
      const teamsData = data.teams || [];
      
      for (const t of teamsData) {
        const extId = slugify(`${leagueConfig.code}-${t.strTeam}`);
        initialRows.push({
          name: t.strTeam,
          short_name: t.strTeamShort || null,
          league: leagueConfig.code,
          gender: leagueConfig.gender,
          division_level: 'Professional',
          logo_url: t.strBadge || null,
          youtube_search_tag: null,
          slug: extId,
          external_id: extId,
        });
      }
    } catch (err) {
      console.warn(`Warning: Could not fetch teams for ${leagueConfig.code}: ${err.message}`);
    }
  }

  if (initialRows.length === 0) {
    console.log('No teams fetched from any league.');
    return;
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

async function getTeamMaps() {
  const { data, error } = await supabase.from('teams').select('id, external_id, name, league');
  if (error) throw new Error(`Teams lookup failed: ${error.message}`);
  
  const exactMap = new Map();
  const looseMap = new Map();

  for (const t of data) {
    exactMap.set(t.external_id, t.id);
    looseMap.set(`${t.league}-${slugify(t.name)}`, t.id);
    looseMap.set(slugify(t.name), t.id);
  }
  return { exactMap, looseMap };
}

async function importFixtures(teamMaps) {
  const { exactMap, looseMap } = teamMaps;
  const initialRows = [];
  let skipped = 0;

  for (const leagueConfig of TARGET_LEAGUES) {
    console.log(`Fetching seasons for ${leagueConfig.code} (League ID: ${leagueConfig.id})...`);
    try {
      const seasonsData = await fetchTheSportsDB(`/search_all_seasons.php?id=${leagueConfig.id}`);
      const seasons = seasonsData.seasons || [];

      if (seasons.length === 0) {
        console.warn(`No seasons found for ${leagueConfig.code}`);
        continue;
      }

      let targetSeasonObj = seasons.find(s => s.strSeason === '2026' || s.strSeason?.includes('2026'));
      if (!targetSeasonObj) {
        targetSeasonObj = seasons[seasons.length - 1];
      }

      const seasonStr = targetSeasonObj.strSeason;
      console.log(`Fetching fixtures for ${leagueConfig.code} (Season: ${seasonStr})...`);

      const data = await fetchTheSportsDB(`/eventsseason.php?id=${leagueConfig.id}&s=${seasonStr}`);
      const fixturesData = data.events || [];
      console.log(`Found ${fixturesData.length} events for ${leagueConfig.code}`);

      for (const f of fixturesData) {
        const homeName = f.strHomeTeam;
        const awayName = f.strAwayTeam;

        if (!homeName || !awayName) {
          skipped += 1;
          continue;
        }

        const homeExtId = slugify(`${leagueConfig.code}-${homeName}`);
        const awayExtId = slugify(`${leagueConfig.code}-${awayName}`);

        const homeId = exactMap.get(homeExtId) || looseMap.get(`${leagueConfig.code}-${slugify(homeName)}`) || looseMap.get(slugify(homeName));
        const awayId = exactMap.get(awayExtId) || looseMap.get(`${leagueConfig.code}-${slugify(awayName)}`) || looseMap.get(slugify(awayName));

        if (!homeId || !awayId) {
          console.warn(`Skipping fixture: Unmatched teams ("${homeName}" vs "${awayName}")`);
          skipped += 1;
          continue;
        }

        const matchDate = f.dateEvent ? `${f.dateEvent}T${f.strTime || '00:00:00'}` : new Date().toISOString();
        const extId = slugify(`${f.dateEvent || 'date'}-${leagueConfig.code}-${homeName}-${awayName}`);

        initialRows.push({
          home_team_id: homeId,
          away_team_id: awayId,
          match_date: matchDate,
          status: f.strStatus === 'Match Finished' || f.strStatus === 'FT' ? 'Finished' : 'Scheduled',
          home_score: f.intHomeScore !== null && f.intHomeScore !== '' ? parseInt(f.intHomeScore, 10) : 0,
          away_score: f.intAwayScore !== null && f.intAwayScore !== '' ? parseInt(f.intAwayScore, 10) : 0,
          competition: leagueConfig.code,
          gender: leagueConfig.gender,
          external_id: extId,
        });
      }
    } catch (err) {
      console.warn(`Warning: Could not fetch fixtures for ${leagueConfig.code}: ${err.message}`);
    }
  }

  if (initialRows.length === 0) {
    console.log('No matches to upsert.');
    return;
  }

  const finalDeduper = new Map();
  for (const row of initialRows) {
    finalDeduper.set(row.external_id, row);
  }
  const uniqueRows = Array.from(finalDeduper.values());

  const { error } = await supabase.from('matches').upsert(uniqueRows, { onConflict: 'external_id' });
  if (error) throw new Error(`Matches upsert failed: ${error.message}`);
  console.log(`Upserted ${uniqueRows.length} matches. Skipped ${skipped} unmatched fixtures.`);
}

async function main() {
  await importTeams();
  const teamMaps = await getTeamMaps();
  await importFixtures(teamMaps);
  console.log('TheSportsDB import complete!');
}

main().catch((err) => {
  console.error('Import failed:', err.message);
  process.exit(1);
});
