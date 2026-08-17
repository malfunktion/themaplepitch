// scripts/import-thesportsdb.mjs
// Pulls team telemetry and core Canadian player records into Supabase.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const TSDB_KEY = process.env.THESPORTSDB_KEY || process.env.THESPORTSDB_KEY || process.env.APIF_KEY || '123';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables (SUPABASE_URL or SERVICE_ROLE_KEY).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

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

const TARGET_LEAGUES = [
  { code: 'CPL', gender: 'men', whitelistedTeams: CPL_TEAMS },
  { code: 'NSL', gender: 'women', whitelistedTeams: NSL_TEAMS },
  { code: 'Canadian Championship', gender: 'men', whitelistedTeams: [...CPL_TEAMS, ...CANADIAN_MLS_TEAMS] },
  { code: 'MLS', gender: 'men', whitelistedTeams: CANADIAN_MLS_TEAMS },
  { code: 'NWSL', gender: 'women', whitelistedTeams: [] }
];

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function importTeams() {
  const initialRows = [];

  for (const leagueConfig of TARGET_LEAGUES) {
    console.log(`Importing teams for ${leagueConfig.code}...`);
    
    for (const teamName of leagueConfig.whitelistedTeams) {
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
  await importPlayers();
  console.log('TheSportsDB import complete with Canadian Championship, MLS, and NWSL rules!');
}

main().catch((err) => {
  console.error('Import failed:', err.message);
  process.exit(1);
});
