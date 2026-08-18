// scripts/import-apifootball.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
// Supports direct API-Football key or RapidAPI key
const API_KEY = process.env.APIFOOTBALL_KEY || process.env.RAPIDAPI_KEY || 'YOUR_API_FOOTBALL_KEY';
const API_HOST = process.env.APIFOOTBALL_HOST || 'v3.football.api-sports.io';

if (!SERVICE_ROLE_KEY) {
  console.error('Error: SERVICE_ROLE_KEY environment variable is missing.');
  process.exit(1);
}

if (!API_KEY || API_KEY === 'YOUR_API_FOOTBALL_KEY') {
  console.error('Error: API-Football key (APIFOOTBALL_KEY or RAPIDAPI_KEY) is missing.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const API_HEADERS = API_HOST.includes('rapidapi')
  ? {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': API_HOST,
    }
  : {
      'x-apisports-key': API_KEY,
    };

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

function normalizePosition(pos) {
  if (!pos) return 'CM';
  const p = pos.toLowerCase();
  if (p.includes('goal') || p.includes('keeper')) return 'GK';
  if (p.includes('back') || p.includes('defender') || p.includes('centre-back')) return 'CB';
  if (p.includes('midfield') || p.includes('holding')) return 'CM';
  if (p.includes('wing') || p.includes('attacker')) return 'RW';
  if (p.includes('forward') || p.includes('striker')) return 'ST';
  return 'CM';
}

// Target Canadian Competitions & League IDs in API-Football
const LEAGUES = [
  { id: 659, name: 'CPL', gender: 'men' },
  { id: 8150, name: 'NSL', gender: 'women' },
  { id: 407, name: 'Canadian Championship', gender: 'men' },
];

async function runImportSequence() {
  console.log('Starting API-Football import sequence for Canadian competitions...');

  let allTeams = [];
  const teamApiToDbMap = new Map();

  // 1. Import Teams per League
  for (const league of LEAGUES) {
    console.log(`Fetching teams for ${league.name} (ID: ${league.id})...`);
    const data = await fetchFromApiFootball(`/teams?league=${league.id}&season=2026`);
    if (!data || data.length === 0) {
      console.log(`No teams returned for ${league.name}. Trying 2025 season fallback...`);
      const fallbackData = await fetchFromApiFootball(`/teams?league=${league.id}&season=2025`);
      if (!fallbackData) continue;
      data.push(...fallbackData);
    }

    for (const item of data) {
      const t = item.team;
      const teamObj = {
        external_id: String(t.id),
        name: t.name,
        slug: slugify(t.name),
        league: league.name,
        logo_url: t.logo || null,
      };
      allTeams.push(teamObj);
    }
    await sleep(1000);
  }

  if (allTeams.length > 0) {
    const { error: teamErr } = await supabase
      .from('teams')
      .upsert(allTeams, { onConflict: 'slug' });
    if (teamErr) {
      console.error('Error upserting teams:', teamErr.message);
    } else {
      console.log(`Successfully upserted ${allTeams.length} teams into Supabase.`);
    }
  }

  // Retrieve stored team IDs from Supabase for fixture & player mapping
  const { data: dbTeams, error: dbTeamsErr } = await supabase
    .from('teams')
    .select('id, external_id, name, league');

  if (dbTeamsErr || !dbTeams) {
    console.error('Failed to retrieve teams from Supabase:', dbTeamsErr?.message);
    process.exit(1);
  }

  const teamNameMap = new Map();
  dbTeams.forEach((t) => {
    teamApiToDbMap.set(String(t.external_id), t.id);
    teamNameMap.set(t.name.toLowerCase(), t.id);
  });

  // 2. Import Fixtures & Match Results for Standings
  let totalMatchesUpserted = 0;
  for (const league of LEAGUES) {
    console.log(`Fetching 2026 fixtures for ${league.name}...`);
    const fixtures = await fetchFromApiFootball(`/fixtures?league=${league.id}&season=2026`);
    if (!fixtures || fixtures.length === 0) {
      console.log(`No fixtures found for ${league.name} in 2026.`);
      continue;
    }

    const formattedMatches = [];
    for (const fx of fixtures) {
      const homeTeamExtId = String(fx.teams.home.id);
      const awayTeamExtId = String(fx.teams.away.id);

      let homeTeamId = teamApiToDbMap.get(homeTeamExtId) || teamNameMap.get(fx.teams.home.name.toLowerCase());
      let awayTeamId = teamApiToDbMap.get(awayTeamExtId) || teamNameMap.get(fx.teams.away.name.toLowerCase());

      if (!homeTeamId || !awayTeamId) continue;

      const shortStatus = fx.fixture.status.short; // 'FT', 'NS', 'AET', etc.
      const isFinished = ['FT', 'AET', 'PEN'].includes(shortStatus);

      formattedMatches.push({
        external_id: String(fx.fixture.id),
        competition: league.name,
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        home_score: fx.goals.home !== null ? fx.goals.home : null,
        away_score: fx.goals.away !== null ? fx.goals.away : null,
        status: isFinished ? 'FT' : (shortStatus === '1H' || shortStatus === '2H' ? 'Live' : 'Scheduled'),
        match_date: fx.fixture.date || null,
      });
    }

    if (formattedMatches.length > 0) {
      const { data: insertedMatches, error: matchErr } = await supabase
        .from('matches')
        .upsert(formattedMatches, { onConflict: 'external_id' })
        .select('id');

      if (matchErr) {
        console.error(`Error upserting matches for ${league.name}:`, matchErr.message);
      } else {
        totalMatchesUpserted += insertedMatches?.length || formattedMatches.length;
      }
    }
    await sleep(1000);
  }

  console.log(`Successfully synced ${totalMatchesUpserted} match fixtures into Supabase.`);

  // 3. Import Player Squads
  console.log('Importing player rosters from API-Football squads...');
  let totalPlayersUpserted = 0;

  for (const team of dbTeams) {
    if (!team.external_id) continue;
    try {
      console.log(`Fetching squad for team: ${team.name} (API ID: ${team.external_id})`);
      const squadRes = await fetchFromApiFootball(`/players/squads?team=${team.external_id}`);
      if (!squadRes || squadRes.length === 0 || !squadRes[0].players) {
        await sleep(1000);
        continue;
      }

      const roster = squadRes[0].players.map((p) => {
        const pSlug = `${slugify(p.name)}-${p.id || Math.floor(Math.random() * 10000)}`;
        return {
          external_id: pSlug,
          name: p.name,
          league: team.league || 'Domestic',
          gender: team.league === 'NSL' ? 'women' : 'men',
          position: normalizePosition(p.position),
          goals: 0,
          assists: 0,
          rating: 7.0,
          current_team_id: team.id,
          nationality: p.nationality || 'Canada',
        };
      });

      if (roster.length > 0) {
        const { data: inserted, error: playerErr } = await supabase
          .from('players')
          .upsert(roster, { onConflict: 'external_id' })
          .select('id');

        if (playerErr) {
          console.error(`Error upserting roster for ${team.name}:`, playerErr.message);
        } else {
          totalPlayersUpserted += inserted?.length || roster.length;
        }
      }
    } catch (err) {
      console.warn(`Warning: Could not fetch squad for ${team.name}: ${err.message}`);
    }
    await sleep(1500); // Respect API rate limits
  }

  console.log(`Successfully upserted ${totalPlayersUpserted} total player profiles into Supabase.`);
  console.log('API-Football import sequence completed successfully!');
}

runImportSequence().catch((err) => {
  console.error('API-Football import failed:', err);
  process.exit(1);
});
