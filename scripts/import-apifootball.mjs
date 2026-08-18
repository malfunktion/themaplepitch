// scripts/import-apifootball.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const API_KEY = process.env.APIFOOTBALL_KEY || process.env.RAPIDAPI_KEY;
const API_HOST = process.env.APIFOOTBALL_HOST || 'v3.football.api-sports.io';

if (!SERVICE_ROLE_KEY) {
  console.error('Error: SERVICE_ROLE_KEY environment variable is missing.');
  process.exit(1);
}

if (!API_KEY) {
  console.error('Error: API-Football key (APIFOOTBALL_KEY or RAPIDAPI_KEY) is missing.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const API_HEADERS = API_HOST.includes('rapidapi')
  ? { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': API_HOST }
  : { 'x-apisports-key': API_KEY };

const BASE_URL = `https://${API_HOST}`;

async function fetchFromApiFootball(endpoint) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(url, { headers: API_HEADERS });
    if (!res.ok) {
      console.warn(`API-Football warning: ${res.status} on ${endpoint}`);
      return null;
    }
    const data = await res.json();
    return data.response || null;
  } catch (err) {
    console.error(`API-Football fetch error on ${endpoint}:`, err.message);
    return null;
  }
}

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

const CANADIAN_LEAGUES = ['CPL', 'NSL', 'Canadian Championship', 'MLS'];

async function runImportSequence() {
  console.log('Fetching stored teams from Supabase...');
  
  const { data: dbTeams, error: dbTeamsErr } = await supabase
    .from('teams')
    .select('id, external_id, name, league');

  if (dbTeamsErr || !dbTeams) {
    console.error('Failed to retrieve teams from Supabase:', dbTeamsErr?.message);
    process.exit(1);
  }

  // STRICT FILTER: Only keep Canadian competitions
  const canadianTeams = dbTeams.filter((t) => CANADIAN_LEAGUES.includes(t.league));

  console.log(`Found ${canadianTeams.length} Canadian teams in Supabase. Importing rosters...`);

  let totalPlayersUpserted = 0;
  for (const team of canadianTeams) {
    if (!team.external_id || isNaN(Number(team.external_id))) continue;

    try {
      console.log(`Fetching squad for ${team.name} (${team.league})...`);
      const squadRes = await fetchFromApiFootball(`/players/squads?team=${team.external_id}`);
      
      if (!squadRes || squadRes.length === 0 || !squadRes[0].players) {
        await sleep(1500);
        continue;
      }

      const roster = squadRes[0].players.map((p) => ({
        external_id: `${slugify(p.name)}-${p.id || Math.floor(Math.random() * 10000)}`,
        name: p.name,
        league: team.league || 'Domestic',
        gender: team.league === 'NSL' ? 'women' : 'men',
        position: p.position || 'CM',
        goals: 0,
        assists: 0,
        rating: 7.0,
        current_team_id: team.id,
        nationality: p.nationality || 'Canada',
      }));

      if (roster.length > 0) {
        const { data: inserted, error: playerErr } = await supabase
          .from('players')
          .upsert(roster, { onConflict: 'external_id' })
          .select('id');

        if (!playerErr) {
          totalPlayersUpserted += inserted?.length || roster.length;
        }
      }
    } catch (err) {
      console.warn(`Warning for ${team.name}: ${err.message}`);
    }
    await sleep(1500); // Respect API rate limits
  }

  console.log(`Successfully upserted ${totalPlayersUpserted} Canadian player profiles.`);
}

runImportSequence().catch((err) => {
  console.error('Import process failed:', err);
  process.exit(1);
});
