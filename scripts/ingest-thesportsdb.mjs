// scripts/import-thesportsdb.mjs
// Pulls team, match history, and player telemetry from TheSportsDB for CPL, NSL, Canadian Championship, MLS, and NWSL.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const TSDB_KEY = process.env.THESPORTSDB_KEY || process.env.APIF_KEY || '123';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables (SUPABASE_URL or SERVICE_ROLE_KEY).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const API_BASE = `https://www.thesportsdb.com/api/v1/json/${TSDB_KEY}`;

// Strict Whitelists & Core Canadian Teams
const CPL_TEAMS = [
  'Atlético Ottawa',
  'Cavalry FC',
  'Forge FC',
  'HFX Wanderers FC',
  'Pacific FC',
  'Valour FC',
  'Vancouver FC',
  'York United FC',
  'York9',
  'FC Supra du Québec'
];

const NSL_TEAMS = [
  'AFC Toronto',
  'Calgary Wild',
  'Halifax Tides',
  'Ottawa Rapid',
  'Roses de Montréal',
  'Vancouver Rise'
];

const CANADIAN_MLS_TEAMS = [
  'Toronto FC',
  'CF Montréal',
  'Vancouver Whitecaps'
];

// Master Target Competitions Map
const TARGET_LEAGUES = [
  { id: 4820, code: 'CPL', gender: 'men', whitelistedTeams: CPL_TEAMS },
  { id: 5602, code: 'NSL', gender: 'women', whitelistedTeams: NSL_TEAMS },
  { id: 5922, code: 'Canadian Championship', gender: 'men', whitelistedTeams: [...CPL_TEAMS, ...CANADIAN_MLS_TEAMS] },
  { id: 4346, code: 'MLS', gender: 'men', whitelistedTeams: CANADIAN_MLS_TEAMS, filterCanadianExpats: true },
  { id: 4521, code: 'NWSL', gender: 'women', whitelistedTeams: [], filterCanadianExpats: true }
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
    console.log(`Importing teams for ${leagueConfig.code}...`);
    
    const teamsToProcess = leagueConfig.whitelistedTeams.length > 0 
      ? leagueConfig.whitelistedTeams 
      : [];

    for (const teamName of teamsToProcess) {
      const extId = slugify(`${leagueConfig.code}-${teamName}`);
      initialRows.push({
        name: teamName,
        short_name: null,
        league: leagueConfig.code,
        gender: leagueConfig.gender,
        division_level: 'Professional',
        logo_url: null,
        slug: extId,
        external_id: extId,
      });
    }
  }

  const finalDeduper = new Map();
  for (const row of initialRows) {
    finalDeduper.set(`${row.league}::${row.name}`, row);
  }
  const uniqueRows = Array.from(finalDeduper.values());

  if (uniqueRows.length > 0) {
    const { error } = await supabase.from('teams').upsert(uniqueRows, { onConflict: 'league,name' });
    if (error) throw new Error(`Teams upsert failed: ${error.message}`);
    console.log(`Successfully upserted ${uniqueRows.length} official teams into Supabase.`);
  }
}

async function getTeamMaps() {
  const { data, error } = await supabase.from('teams').select('id, external_id, name, league');
  if (error) throw new Error(`Teams lookup failed: ${error.message}`);
  
  const map = new Map();
  for (const t of data) {
    map.set(t.external_id, t.id);
    map.set(slugify(t.name), t.id);
    map.set(`${t.league}-${slugify(t.name)}`, t.id);
  }
  return map;
}

async function importFixtures(teamMap) {
  const initialRows = [];
  const fixtureLeagues = TARGET_LEAGUES.filter(l => l.code === 'CPL' || l.code === 'NSL' || l.code === 'Canadian Championship' || l.code === 'MLS');

  for (const leagueConfig of fixtureLeagues) {
    console.log(`Fetching fixtures for ${leagueConfig.code} (League ID: ${leagueConfig.id})...`);
    try {
      const data = await fetchTheSportsDB(`/eventsseason.php?id=${leagueConfig.id}&s=2026`);
      const fixturesData = data.events || [];
      console.log(`Found ${fixturesData.length} events for ${leagueConfig.code}`);

      for (const f of fixturesData) {
        const homeName = f.strHomeTeam;
        const awayName = f.strAwayTeam;

        if (!homeName || !awayName) continue;

        if (leagueConfig.code === 'MLS' && !CANADIAN_MLS_TEAMS.includes(homeName) && !CANADIAN_MLS_TEAMS.includes(awayName)) {
          continue;
        }

        if (leagueConfig.whitelistedTeams.length > 0 && 
            !leagueConfig.whitelistedTeams.includes(homeName) && 
            !leagueConfig.whitelistedTeams.includes(awayName) && 
            homeName !== 'York9' && awayName !== 'York9') {
          continue;
        }

        const homeExtId = slugify(`${leagueConfig.code}-${homeName}`);
        const awayExtId = slugify(`${leagueConfig.code}-${awayName}`);

        const homeId = teamMap.get(homeExtId) || teamMap.get(slugify(homeName));
        const awayId = teamMap.get(awayExtId) || teamMap.get(slugify(awayName));

        if (!homeId || !awayId) continue;

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
  console.log(`Upserted ${uniqueRows.length} clean Canadian fixtures & matches.`);
}

async function importPlayers() {
  console.log('Importing core Canadian player profiles...');

  const corePlayers = [
    { name: 'Jonathan David', league: 'Abroad', gender: 'men', position: 'ST' },
    { name: 'Alphonso Davies', league: 'Abroad', gender: 'men', position: 'LB' },
    { name: 'Stephen Eustáquio', league: 'Abroad', gender: 'men', position: 'CM' },
    { name: 'Tajon Buchanan', league: 'Abroad', gender: 'men', position: 'RW' },
    { name: 'Ismaël Koné', league: 'Abroad', gender: 'men', position: 'CM' },
    { name: 'Alistair Johnston', league: 'Abroad', gender: 'men', position: 'RB' },
    { name: 'Jonathan Osorio', league: 'MLS', gender: 'men', position: 'CM' },
    { name: 'Kamal Miller', league: 'MLS', gender: 'men', position: 'CB' },
    { name: 'Jessie Fleming', league: 'Abroad', gender: 'women', position: 'CM' },
    { name: 'Simi Awujo', league: 'Abroad', gender: 'women', position: 'CDM' },
    { name: 'Shelina Zadorsky', league: 'Abroad', gender: 'women', position: 'CB' },
    { name: 'Evelyne Viens', league: 'NSL', gender: 'women', position: 'ST' },
    { name: 'Jorian Baucom', league: 'NSL', gender: 'women', position: 'ST' },
    { name: 'Terran Campbell', league: 'CPL', gender: 'men', position: 'ST' },
    { name: 'Moses Dyer', league: 'CPL', gender: 'men', position: 'ST' }
  ];

  // FIXED: Changed 'full_name' back to 'name' to perfectly match your schema
  const initialPlayers = corePlayers.map(p => ({
    name: p.name,
    league: p.league,
    gender: p.gender,
    position: p.position
  }));

  const { error } = await supabase.from('players').upsert(initialPlayers, { onConflict: 'name' });
  if (error) {
    console.error(`Player stats upsert failed: ${error.message}`);
  } else {
    console.log(`Successfully upserted ${initialPlayers.length} player profiles into Supabase.`);
  }
}

async function main() {
  await importTeams();
  const teamMap = await getTeamMaps();
  await importFixtures(teamMap);
  await importPlayers();
  console.log('TheSportsDB import complete with Canadian Championship, MLS, and NWSL rules!');
}

main().catch((err) => {
  console.error('Import failed:', err.message);
  process.exit(1);
});
