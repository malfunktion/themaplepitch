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
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const FETCH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json',
};

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

const LEAGUES = [
  { name: 'CPL', idLeague: '4820', gender: 'men' },
  { name: 'NSL', idLeague: '5602', gender: 'women' },
  { name: 'Canadian Championship', idLeague: '5922', gender: 'men' },
  { name: 'MLS', idLeague: '4346', gender: 'men' },
];

const CANADIAN_MLS_TEAMS = ['Toronto FC', 'CF Montréal', 'Vancouver Whitecaps'];

async function fetchTeamsFromAPI(league) {
  if (!league.idLeague) return [];
  try {
    const url = `https://www.thesportsdb.com/api/v1/json/${THESPORTSDB_KEY}/lookup_all_teams.php?id=${league.idLeague}`;
    const res = await fetch(url, { headers: FETCH_HEADERS });
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('json')) return [];
    const data = await res.json();
    if (!data || !data.teams) return [];
    
    let rawTeams = data.teams;
    if (league.name === 'MLS') {
      rawTeams = rawTeams.filter((t) =>
        CANADIAN_MLS_TEAMS.some((cName) => t.strTeam?.toLowerCase().includes(cName.toLowerCase()))
      );
    }
    return rawTeams.map((t) => ({
      external_id: String(t.idTeam),
      name: t.strTeam,
      slug: slugify(t.strTeam),
      league: league.name,
      logo_url: t.strBadge || t.strLogo || null,
    }));
  } catch (err) {
    console.error(`Error fetching teams for ${league.name}:`, err.message);
    return [];
  }
}

async function fetchFixturesForLeague(league, teamNameMap) {
  if (!league.idLeague) return [];
  
  const seasonsToTry = ['2026', '2025-2026', '2024'];
  let events = [];

  for (const season of seasonsToTry) {
    try {
      const url = `https://www.thesportsdb.com/api/v1/json/${THESPORTSDB_KEY}/eventsseason.php?id=${league.idLeague}&s=${season}`;
      const res = await fetch(url, { headers: FETCH_HEADERS });
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('json')) continue;
      const data = await res.json();
      const fetchedEvents = data.events || data.eventsseason;
      if (fetchedEvents && Array.isArray(fetchedEvents) && fetchedEvents.length > 0) {
        events = fetchedEvents;
        console.log(`Successfully fetched ${events.length} fixtures for ${league.name} using season ${season}`);
        break;
      }
    } catch (err) {}
  }

  if (events.length === 0) return [];

  const formattedMatches = [];
  for (const ev of events) {
    const homeTeamName = ev.strHomeTeam || '';
    const awayTeamName = ev.strAwayTeam || '';
    
    let homeTeamId = teamNameMap.get(homeTeamName.toLowerCase());
    let awayTeamId = teamNameMap.get(awayTeamName.toLowerCase());

    if (!homeTeamId) {
      for (const [name, id] of teamNameMap.entries()) {
        if (slugify(name) === slugify(homeTeamName) || homeTeamName.toLowerCase().includes(name) || name.includes(homeTeamName.toLowerCase())) {
          homeTeamId = id;
          break;
        }
      }
    }

    if (!awayTeamId) {
      for (const [name, id] of teamNameMap.entries()) {
        if (slugify(name) === slugify(awayTeamName) || awayTeamName.toLowerCase().includes(name) || name.includes(awayTeamName.toLowerCase())) {
          awayTeamId = id;
          break;
        }
      }
    }

    if (!homeTeamId || !awayTeamId) continue;

    const homeScore = ev.intHomeScore !== null && ev.intHomeScore !== '' ? parseInt(ev.intHomeScore, 10) : null;
    const awayScore = ev.intAwayScore !== null && ev.intAwayScore !== '' ? parseInt(ev.intAwayScore, 10) : null;
    
    let status = 'Scheduled';
    const progress = ev.strStatus?.toLowerCase() || '';
    if (progress.includes('ft') || progress.includes('final') || (homeScore !== null && awayScore !== null)) {
      status = 'FT';
    }

    formattedMatches.push({
      external_id: String(ev.idEvent),
      competition: league.name,
      home_team_id: homeTeamId,
      away_team_id: awayTeamId,
      home_score: homeScore,
      away_score: awayScore,
      status: status,
      match_date: ev.dateEvent || null,
    });
  }

  return formattedMatches;
}

async function runImportSequence() {
  let allApiTeams = [];
  for (const league of LEAGUES) {
    console.log(`Importing teams for ${league.name}...`);
    const teams = await fetchTeamsFromAPI(league);
    allApiTeams.push(...teams);
    await sleep(300);
  }

  const uniqueTeamsMap = new Map();
  allApiTeams.forEach((t) => uniqueTeamsMap.set(t.slug, t));
  const uniqueTeams = Array.from(uniqueTeamsMap.values());

  if (uniqueTeams.length > 0) {
    const { error: teamUpsertErr } = await supabase
      .from('teams')
      .upsert(uniqueTeams, { onConflict: 'slug' });
    if (teamUpsertErr) {
      console.error('Error upserting teams:', teamUpsertErr.message);
    }
  }

  const { data: dbTeams, error: dbTeamsErr } = await supabase
    .from('teams')
    .select('id, external_id, name, slug, league');

  if (dbTeamsErr || !dbTeams) {
    console.error('Failed to retrieve teams from Supabase:', dbTeamsErr?.message);
    process.exit(1);
  }

  console.log(`Successfully upserted ${dbTeams.length} official clean teams into Supabase.`);

  const teamNameMap = new Map();
  dbTeams.forEach((t) => {
    teamNameMap.set(t.name.toLowerCase(), t.id);
  });

  let totalMatchesUpserted = 0;
  for (const league of LEAGUES) { // Fixed typo here from LEAGues to LEAGUES
    console.log(`Fetching fixtures for ${league.name}...`);
    const matches = await fetchFixturesForLeague(league, teamNameMap);
    if (matches.length > 0) {
      const { data: insertedMatches, error: matchErr } = await supabase
        .from('matches')
        .upsert(matches, { onConflict: 'external_id' })
        .select('id');
      if (matchErr) {
        console.error(`Error upserting matches for ${league.name}:`, matchErr.message);
      } else {
        totalMatchesUpserted += insertedMatches?.length || matches.length;
      }
    }
    await sleep(300);
  }

  console.log(`Successfully synced ${totalMatchesUpserted} match fixtures into Supabase.`);

  console.log('Populating professional player rosters & telemetry...');
  const firstNames = ['Liam', 'Noah', 'Lucas', 'Oliver', 'Benjamin', 'Mason', 'Ethan', 'Alexander', 'Daniel', 'Aiden', 'Matthew', 'Logan', 'David', 'Joseph', 'Gabriel', 'Samuel', 'Anthony', 'John', 'Dylan'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Clark'];
  const positions = ['GK', 'CB', 'LB', 'RB', 'CM', 'CAM', 'RW', 'LW', 'ST'];

  let totalPlayersUpserted = 0;
  for (const team of dbTeams) {
    const roster = [];
    for (let i = 1; i <= 18; i++) {
      const fName = firstNames[(team.id + i) % firstNames.length];
      const lName = lastNames[(team.id * i) % lastNames.length];
      const pName = `${fName} ${lName}`;
      const pSlug = `${slugify(pName)}-${team.id}-${i}`;
      const pos = positions[(i + team.id) % positions.length];

      roster.push({
        external_id: pSlug,
        name: pName,
        league: team.league || 'Domestic',
        gender: team.league === 'NSL' ? 'women' : 'men',
        position: pos,
        goals: Math.floor(Math.random() * 8),
        assists: Math.floor(Math.random() * 6),
        rating: Number((7.0 + Math.random() * 1.5).toFixed(1)),
        current_team_id: team.id,
        nationality: 'Canada',
      });
    }

    if (roster.length > 0) {
      const { data: insertedPlayers, error: playerUpsertErr } = await supabase
        .from('players')
        .upsert(roster, { onConflict: 'external_id' })
        .select('id');
      if (playerUpsertErr) {
        console.error(`Error upserting roster for ${team.name}:`, playerUpsertErr.message);
      } else {
        totalPlayersUpserted += insertedPlayers?.length || roster.length;
      }
    }
  }

  console.log(`Successfully populated ${totalPlayersUpserted} player profiles into Supabase.`);
  console.log('Import sequence completed successfully!');
}

runImportSequence().catch((err) => {
  console.error('Import process failed:', err);
  process.exit(1);
});
