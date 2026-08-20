import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const API_BASE = 'https://canadasoccerapi.com/api';

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const TEAM_NAME_OVERRIDES = {
  'york united': 'Inter Toronto FC',
  'york united fc': 'Inter Toronto FC',
  'york9': 'Inter Toronto FC',
  'york9 fc': 'Inter Toronto FC',
  'quebec supra': 'FC Supra du Québec',
  'québec supra': 'FC Supra du Québec',
};

function normalizeTeamName(name) {
  return TEAM_NAME_OVERRIDES[name.trim().toLowerCase()] || name;
}

async function importTeams() {
  console.log('Fetching CPL teams from canadasoccerapi.com...');
  const res = await fetch(`${API_BASE}/teams`);
  if (!res.ok) throw new Error(`/api/teams failed: ${res.status}`);
  const { teams } = await res.json();

  const initialRows = [];
  for (const t of teams) {
    const displayName = normalizeTeamName(t.name);
    const extId = slugify(displayName);
    initialRows.push({
      name: displayName,
      short_name: null,
      league: 'CPL',
      gender: 'men',
      division_level: 'Professional',
      logo_url: null,
      youtube_search_tag: null,
      slug: extId,
      external_id: extId,
    });
  }

  const finalDeduper = new Map();
  for (const row of initialRows) {
    finalDeduper.set(`${row.league}::${row.name}`, row);
  }
  const uniqueRows = Array.from(finalDeduper.values());

  // Fixed: Target the exact 'league,name' constraint unique key matching teams_league_name_key
  const { error } = await supabase.from('teams').upsert(uniqueRows, { onConflict: 'league,name' });
  if (error) throw new Error(`teams upsert failed: ${error.message}`);
  console.log(`Upserted ${uniqueRows.length} unique CPL teams.`);
}

async function getTeamIdMap() {
  const { data, error } = await supabase.from('teams').select('id, external_id').eq('league', 'CPL');
  if (error) throw new Error(`teams lookup failed: ${error.message}`);
  return new Map(data.map((t) => [t.external_id, t.id]));
}

async function importMatches(teamIdMap) {
  console.log('Fetching CPL match history with Smart Sync protection...');
  const res = await fetch(`${API_BASE}/matches?limit=500`);
  if (!res.ok) throw new Error(`/api/matches failed: ${res.status}`);
  const { matches, total } = await res.json();
  console.log(`API reports ${total} total matches, fetched ${matches.length}.`);

  const { data: existingMatches } = await supabase
    .from('matches')
    .select('external_id, home_score, away_score, status');

  const existingMap = new Map();
  (existingMatches || []).forEach((m) => existingMap.set(m.external_id, m));

  const initialRows = [];
  let skipped = 0;
  let matchesProtected = 0;

  for (const m of matches) {
    const homeId = teamIdMap.get(slugify(m.home_team));
    const awayId = teamIdMap.get(slugify(m.away_team));
    if (!homeId || !awayId) {
      skipped += 1;
      continue;
    }

    const extId = slugify(`${m.date}-${m.home_team}-${m.away_team}`);
    const existing = existingMap.get(extId);

    let homeScore = m.home_goals;
    let awayScore = m.away_goals;
    let matchStatus = 'Finished';

    if (existing) {
      const existingHasScore = existing.home_score !== null && existing.away_score !== null;
      const incomingHasScore = homeScore !== null && awayScore !== null;

      if (existingHasScore && !incomingHasScore) {
        homeScore = existing.home_score;
        awayScore = existing.away_score;
        matchStatus = existing.status;
        matchesProtected++;
      }
    }

    initialRows.push({
      home_team_id: homeId,
      away_team_id: awayId,
      match_date: m.date,
      status: matchStatus,
      home_score: homeScore,
      away_score: awayScore,
      competition: 'CPL',
      gender: 'men',
      affiliate_ticket_link: null,
      broadcast_network: null,
      external_id: extId,
    });
  }

  const finalDeduper = new Map();
  for (const row of initialRows) {
    finalDeduper.set(row.external_id, row);
  }
  const uniqueRows = Array.from(finalDeduper.values());

  const { error } = await supabase.from('matches').upsert(uniqueRows, { onConflict: 'external_id' });
  if (error) throw new Error(`matches upsert failed: ${error.message}`);
  
  console.log(`Smart-synced ${uniqueRows.length} matches. Protected ${matchesProtected} finished scores. Skipped ${skipped} unmatched teams.`);
}

async function main() {
  await importTeams();
  const teamIdMap = await getTeamIdMap();
  await importMatches(teamIdMap);
  console.log('CPL data import complete.');
}

main().catch((err) => {
  console.error('Import failed:', err.message);
  process.exit(1);
});
