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

  const teamMap = new Map();
  for (const t of teams) {
    const displayName = normalizeTeamName(t.name);
    const extId = slugify(displayName);
    
    // Key by league + name to match teams_league_name_key constraint uniquely
    const mapKey = `CPL::${displayName.toLowerCase()}`;
    teamMap.set(mapKey, {
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

  const uniqueTeams = Array.from(teamMap.values());
  console.log(`Upserting ${uniqueTeams.length} unique CPL teams individually...`);

  for (const teamRow of uniqueTeams) {
    // Fixed: Match the 'league,name' database constraint
    const { error } = await supabase
      .from('teams')
      .upsert(teamRow, { onConflict: 'league,name' });

    if (error) {
      console.error(`Failed to upsert team ${teamRow.name}:`, error.message);
    }
  }

  console.log('CPL teams sync complete.');
}

async function getTeamIdMap() {
  const { data, error } = await supabase.from('teams').select('id, external_id, name').eq('league', 'CPL');
  if (error) throw new Error(`teams lookup failed: ${error.message}`);
  return new Map(data.map((t) => [slugify(t.name), t.id]));
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
    const normalizedHome = normalizeTeamName(m.home_team);
    const normalizedAway = normalizeTeamName(m.away_team);
    
    const homeId = teamIdMap.get(slugify(normalizedHome));
    const awayId = teamIdMap.get(slugify(normalizedAway));
    
    if (!homeId || !awayId) {
      skipped += 1;
      continue;
    }

    const extId = slugify(`${m.date}-${normalizedHome}-${normalizedAway}`);
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

    // Stripped non-existent columns (affiliate_ticket_link, broadcast_network) to match schema cache
    initialRows.push({
      home_team_id: homeId,
      away_team_id: awayId,
      match_date: m.date,
      status: matchStatus,
      home_score: homeScore,
      away_score: awayScore,
      competition: 'CPL',
      gender: 'men',
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
