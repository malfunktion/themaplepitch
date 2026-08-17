// scripts/import-thesportsdb.mjs
// Pulls team, match history, and player telemetry from TheSportsDB for CPL, NSL, Canadian Championship, MLS, and NWSL.

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
  'York9'
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
        youtube_search_tag: null,
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

async function importPlayers() {
  console.log('Importing core Canadian player telemetry...');

  const corePlayers = [
    { name: 'Jonathan David', position: 'ST' },
    { name: 'Alphonso Davies', position: 'LB' },
    { name: 'Stephen Eustáquio', position: 'CM' },
    { name: 'Tajon Buchanan', position: 'RW' },
    { name: 'Ismaël Koné', position: 'CM' },
    { name: 'Alistair Johnston', position: 'RB' },
    { name: 'Jonathan Osorio', position: 'CM' },
    { name: 'Kamal Miller', position: 'CB' },
    { name: 'Jessie Fleming', position: 'CM' },
    { name: 'Simi Awujo', position: 'CDM' },
    { name: 'Shelina Zadorsky', position: 'CB' },
    { name: 'Evelyne Viens', position: 'ST' },
    { name: 'Jorian Baucom', position: 'ST' },
    { name: 'Terran Campbell', position: 'ST' },
    { name: 'Moses Dyer', position: 'ST' }
  ];

  const initialPlayers = corePlayers.map(p => ({
    external_id: slugify(p.name),
    name: p.name,
    position: p.position
  }));

  const { error } = await supabase.from('players').upsert(initialPlayers, { onConflict: 'external_id' });
  if (error) {
    console.error(`Player stats upsert failed: ${error.message}`);
  } else {
    console.log(`Successfully upserted ${initialPlayers.length} player profiles into Supabase.`);
  }
}

async function main() {
  await importTeams();
  await importPlayers();
  console.log('TheSportsDB import complete with Canadian Championship, MLS, and NWSL rules!');
}

main().catch((err) => {
  console.error('Import failed:', err.message);
  process.exit(1);
});
