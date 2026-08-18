// scripts/import-apifootball.mjs
// Pulls team, match history, and squad rosters across multi-seasons from API-Football and upserts into Supabase.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const APIF_KEY = process.env.APIF_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !APIF_KEY) {
  console.error('Missing required environment variables (SUPABASE_URL, SERVICE_ROLE_KEY, or APIF_KEY).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const API_BASE = 'https://v3.football.api-sports.io';

// Target Leagues with an array of seasons to max out historical data retrieval
const TARGET_LEAGUES = [
  { id: 659, code: 'CPL', gender: 'men', seasons: [2022, 2023, 2024] },
  { id: 12606, code: 'NSL', gender: 'women', seasons: [2024] }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function slugify(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizePosition(pos) {
  if (!pos) return 'CM';
  const p = pos.toLowerCase();
  if (p.includes('goalkeeper') || p.includes('keeper')) return 'GK';
  if (p.includes('centre-back') || p.includes('central defender')) return 'CB';
  if (p.includes('left-back') || p.includes('left back')) return 'LB';
  if (p.includes('right-back') || p.includes('right back')) return 'RB';
  if (p.includes('defender')) return 'CB';
  if (p.includes('defensive midfield')) return 'CDM';
  if (p.includes('attacking midfield')) return 'CAM';
  if (p.includes('midfield')) return 'CM';
  if (p.includes('right wing')) return 'RW';
  if (p.includes('left wing')) return 'LW';
  if (p.includes('winger')) return 'RW';
  if (p.includes('forward') || p.includes('striker')) return 'ST';
  return 'CM';
}

// Franchise-rename normalization keeps historical continuity correct
const TEAM_NAME_OVERRIDES = {
  'york united': 'Inter Toronto FC',
  'york united fc': 'Inter Toronto FC',
  'york9': 'Inter Toronto FC',
  'york9 fc': 'Inter Toronto FC',
};

function normalizeTeamName(name) {
  return TEAM_NAME_OVERRIDES[name.trim().toLowerCase()] || name;
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
  const initialRows = [];

  for (const leagueConfig of TARGET_LEAGUES) {
    for (const season of leagueConfig.seasons) {
      console.log(`Fetching teams for ${leagueConfig.code} (League ID: ${leagueConfig.id}, Season: ${season})...`);
      try {
        const teamsData = await fetchApiFootball(`/teams?league=${leagueConfig.id}&season=${season}`);
        
        for (const item of teamsData) {
          const t = item.team;
          const displayName = normalizeTeamName(t.name);
          const extId = slugify(`${leagueConfig.code}-${displayName}`);
          initialRows.push({
            name: displayName,
            short_name: t.code || null,
            league: leagueConfig.code,
            gender: leagueConfig.gender,
            division_level: 'Professional',
            logo_url: t.logo || null,
            youtube_search_tag: null,
            slug: slugify(displayName),
            external_id: t.id ? String(t.id) : extId, // Store API team ID as external_id for squad mapping
          });
        }
      } catch (err) {
        console.warn(`Warning: Could not fetch teams for ${leagueConfig.code} (${season}): ${err.message}`);
      }
      await sleep(250);
    }
  }

  if (initialRows.length === 0) {
    console.log('No teams fetched from any league.');
    return;
  }

  const finalDeduper = new Map();
  for (const row of initialRows) {
    finalDeduper.set(`${row.league}::${row.name}`, row);
  }
  const uniqueRows = Array.from(finalDeduper.values());

  const { error } = await supabase.from('teams').upsert(uniqueRows, { onConflict: 'league,name' });
  if (error) throw new Error(`Teams upsert failed: ${error.message}`);
  console.log(`Successfully upserted ${uniqueRows.length} unique teams into Supabase.`);
}

async function getTeamsFromDb() {
  const { data, error } = await supabase.from('teams').select('id, external_id, name, league');
  if (error) throw new Error(`Teams lookup failed: ${error.message}`);
  return data;
}

async function importFixtures(teams) {
  const initialRows = [];
  let skipped = 0;
  
  // Create a map matching slugified names back to database internal UUIDs
  const teamIdMap = new Map();
  teams.forEach(t => {
    teamIdMap.set(slugify(`${t.league}-${t.name}`), t.id);
  });

  for (const leagueConfig of TARGET_LEAGUES) {
    for (const season of leagueConfig.seasons) {
      console.log(`Fetching fixtures for ${leagueConfig.code} (League ID: ${leagueConfig.id}, Season: ${season})...`);
      try {
        const fixturesData = await fetchApiFootball(`/fixtures?league=${leagueConfig.id}&season=${season}`);

        for (const f of fixturesData) {
          const homeName = f.teams.home.name;
          const awayName = f.teams.away.name;

          const homeExtId = slugify(`${leagueConfig.code}-${homeName}`);
          const awayExtId = slugify(`${leagueConfig.code}-${awayName}`);

          const homeId = teamIdMap.get(homeExtId);
          const awayId = teamIdMap.get(awayExtId);

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
            competition: leagueConfig.code,
            gender: leagueConfig.gender,
            external_id: extId,
          });
        }
      } catch (err) {
        console.warn(`Warning: Could not fetch fixtures for ${leagueConfig.code} (${season}): ${err.message}`);
      }
      await sleep(250);
    }
  }

  if (initialRows.length === 0) {
    console.log('No matches to upsert.');
    return;
  }

  const finalDeduper = new Map();
  for (const row of initialRows) {
    finalDeduper.set(`${row.match_date}::${row.home_team_id}::${row.away_team_id}`, row);
  }
  const uniqueRows = Array.from(finalDeduper.values());

  const { error } = await supabase.from('matches').upsert(uniqueRows, { onConflict: 'match_date,home_team_id,away_team_id' });
  if (error) throw new Error(`Matches upsert failed: ${error.message}`);
  console.log(`Upserted ${uniqueRows.length} total matches. Skipped ${skipped} unmatched teams.`);
}

async function importPlayers(teams) {
  console.log('Importing player rosters from API-Football squads...');
  let totalPlayersUpserted = 0;

  for (const team of teams) {
    // If external_id is numeric, it maps directly to API-Football team ID
    const apiTeamId = team.external_id;
    if (!apiTeamId || isNaN(Number(apiTeamId))) continue;

    try {
      console.log(`Fetching squad for team: ${team.name} (API ID: ${apiTeamId})`);
      const squadData = await fetchApiFootball(`/players/squads?team=${apiTeamId}`);
      
      if (!squadData || squadData.length === 0 || !squadData[0].players) {
        continue;
      }

      const roster = squadData[0].players.map((p) => {
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
          nationality: 'Canada', // Default or parse if available
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
    await sleep(250);
  }

  console.log(`Successfully upserted ${totalPlayersUpserted} total player profiles into Supabase.`);
}

async function main() {
  await importTeams();
  const dbTeams = await getTeamsFromDb();
  await importFixtures(dbTeams);
  await importPlayers(dbTeams);
  console.log('Multi-season API-Football full pipeline complete!');
}

main().catch((err) => {
  console.error('Import failed:', err.message);
  process.exit(1);
});
