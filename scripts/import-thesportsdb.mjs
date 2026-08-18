import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const THESPORTSDB_KEY = process.env.THESPORTSDB_KEY || '5c5b3e3c9a98dd5a09969018da39aa37';

if (!SERVICE_ROLE_KEY) {
  console.error('Error: SERVICE_ROLE_KEY environment variable is missing.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
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
    if (!res.ok || !contentType.includes('json')) {
      return [];
    }
    const data = await res.json();
    if (!data || !data.teams) return [];
    
    let rawTeams = data.teams;
    if (league.name === 'MLS') {
      rawTeams = rawTeams.filter((t) =>
        CANADIAN_MLS_TEAMS.some((cName) => t.strTeam?.toLowerCase().includes(cName.toLowerCase()))
      );
    }
    return rawTeams.map((t) => ({
      external_id: t.idTeam,
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

async function fetchFixturesForLeague(league, teamMap) {
  if (!league.idLeague) return [];
  try {
    const url = `https://www.thesportsdb.com/api/v1/json/${THESPORTSDB_KEY}/eventsseason.php?id=${league.idLeague}&s=2026`;
    const res = await fetch(url, { headers: FETCH_HEADERS });
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('json')) {
      return [];
    }
    const data = await res.json();
    const events = data.events || data.eventsseason;
    if (!events || !Array.isArray(events)) return [];

    const formattedMatches = [];
    for (const ev of events) {
      const homeTeamName = ev.strHomeTeam;
      const awayTeamName = ev.strAwayTeam;
      
      const homeTeamId = teamMap.get(homeTeamName?.toLowerCase());
      const awayTeamId = teamMap.get(awayTeamName?.toLowerCase());

      if (!homeTeamId || !awayTeamId) continue;

      const homeScore = ev.intHomeScore !== null && ev.intHomeScore !== '' ? parseInt(ev.intHomeScore, 10) : null;
      const awayScore = ev.intAwayScore !== null && ev.intAwayScore !== '' ? parseInt(ev.intAwayScore, 10) : null;
      
      let status = 'Scheduled';
      const progress = ev.strStatus?.toLowerCase() || '';
      if (progress.includes('ft') || progress.includes('final') || homeScore !== null) {
        status = 'FT';
      }

      formattedMatches.push({
        external_id: ev.idEvent,
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
  } catch (err) {
    console.error(`Error fetching fixtures for ${league.name}:`, err.message);
    return [];
  }
}

async function fetchRosterForTeam(team) {
  if (!team.external_id) return [];
  try {
    const url = `https://www.thesportsdb.com/api/v1/json/${THESPORTSDB_KEY}/lookup_all_players.php?id=${team.external_id}`;
    const res = await fetch(url, { headers: FETCH_HEADERS });
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('json')) {
      return [];
    }
    const data = await res.json();
    if (!data || !data.player) return [];
    
    return data.player.map((p) => {
      const pSlug = `${slugify(p.strPlayer)}-${p.idPlayer || Math.floor(Math.random() * 10000)}`;
      return {
        external_id: pSlug,
        name: p.strPlayer,
        league: team.league || 'Domestic',
        gender: p.strGender?.toLowerCase() || (team.league === 'NSL' ? 'women' : 'men'),
        position: normalizePosition(p.strPosition),
        goals: 0,
        assists: 0,
        rating: 7.0,
        current_team_id: team.id,
        nationality: p.strNationality || 'Canada',
      };
    });
  } catch (err) {
    return [];
  }
}

async function runImportSequence() {
  let allApiTeams = [];
  for (const league of LEAGUES) {
    console.log(`Importing teams for ${league.name}...`);
    const teams = await fetchTeamsFromAPI(league);
    allApiTeams.push(...teams);
    await sleep(250);
  }

  if (allApiTeams.length > 0) {
    const { error: teamUpsertErr } = await supabase
      .from('teams')
      .upsert(allApiTeams, { onConflict: 'slug' });
    if (teamUpsertErr) {
      console.error('Error upserting teams:', teamUpsertErr.message);
    }
  }

  const { data: dbTeams, error: dbTeamsErr } = await supabase
    .from('teams')
    .select('id, external_id, name, slug, league');

  if (dbTeamsErr || !dbTeams) {
    console.error('Failed to retrieve teams from Supabase vault:', dbTeamsErr?.message);
    process.exit(1);
  }

  console.log(`Successfully upserted ${dbTeams.length} official clean teams into Supabase.`);

  // Build a lookup map for team names (lowercase) to database UUID/IDs
  const teamNameMap = new Map();
  dbTeams.forEach((t) => {
    teamNameMap.set(t.name.toLowerCase(), t.id);
  });

  // Fetch and insert fixtures/matches for standings support
  let totalMatchesUpserted = 0;
  for (const league of LEAGUES) {
    console.log(`Fetching fixtures for ${league.name} (Season 2026)...`);
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
    await sleep(250);
  }

  if (totalMatchesUpserted > 0) {
    console.log(`Successfully synced ${totalMatchesUpserted} match fixtures into Supabase.`);
  } else {
    console.log('No external match fixtures retrieved; proceeding with team and player vaults.');
  }

  console.log('Importing core Canadian player profiles and telemetry...');
  let totalPlayersUpserted = 0;
  for (const team of dbTeams) {
    if (!team.external_id) continue;
    const roster = await fetchRosterForTeam(team);
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
    await sleep(250);
  }

  console.log(`Successfully upserted ${totalPlayersUpserted} player profiles into Supabase.`);
  console.log('TheSportsDB automated import sequence completed successfully!');
}

runImportSequence().catch((err) => {
  console.error('Import process failed:', err);
  process.exit(1);
});
