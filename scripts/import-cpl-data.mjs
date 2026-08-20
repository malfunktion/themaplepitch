import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables (SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY or SERVICE_ROLE_KEY).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const API_BASE = 'https://canadasoccerapi.com/api';

function slugify(name) {
  if (!name) return '';
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
  'atletico ottawa': 'Atlético Ottawa',
  'atletico ottawa fc': 'Atlético Ottawa',
  'edmonton': 'FC Edmonton',
};

function normalizeTeamName(name) {
  if (!name) return '';
  const trimmed = name.trim().toLowerCase();
  return TEAM_NAME_OVERRIDES[trimmed] || name.trim();
}

async function importTeams() {
  console.log('Fetching CPL teams from canadasoccerapi.com...');
  const res = await fetch(`${API_BASE}/teams`);
  if (!res.ok) throw new Error(`/api/teams failed: ${res.status}`);
  const { teams } = await res.json();

  // Self-healing step: Clean up legacy duplicate team records causing constraint conflicts
  const { data: existingTeams } = await supabase
    .from('teams')
    .select('id, external_id, name, league')
    .eq('league', 'CPL');

  if (existingTeams && existingTeams.length > 0) {
    const seenSlugs = new Map();
    for (const t of existingTeams) {
      const slug = slugify(normalizeTeamName(t.name));
      if (seenSlugs.has(slug)) {
        console.log(`Cleaning up duplicate team record for ${t.name} (ID: ${t.id})...`);
        await supabase.from('teams').delete().eq('id', t.id);
      } else {
        seenSlugs.set(slug, t.id);
      }
    }
  }

  // Re-fetch clean team list post-cleanup
  const { data: cleanExisting } = await supabase
    .from('teams')
    .select('id, external_id, name, league, logo_url, short_name')
    .eq('league', 'CPL');

  const existingByExtId = new Map((cleanExisting || []).map((t) => [t.external_id, t]));
  const existingByName = new Map((cleanExisting || []).map((t) => [`${t.league}::${t.name.toLowerCase().trim()}`, t]));

  const teamMap = new Map();
  for (const t of teams) {
    const displayName = normalizeTeamName(t.name);
    const extId = slugify(displayName);
    
    teamMap.set(extId, {
      name: displayName,
      league: 'CPL',
      gender: 'men',
      division_level: 'Professional',
      slug: extId,
      external_id: extId,
    });
  }

  const uniqueTeams = Array.from(teamMap.values());
  console.log(`Syncing ${uniqueTeams.length} unique CPL teams...`);

  for (const teamRow of uniqueTeams) {
    const matchByName = existingByName.get(`${teamRow.league}::${teamRow.name.toLowerCase().trim()}`);
    const matchByExtId = existingByExtId.get(teamRow.external_id);
    const targetMatch = matchByExtId || matchByName;

    let error;
    if (targetMatch) {
      // Update core fields without overwriting existing non-null logos/short_names with null
      const updatePayload = {
        name: teamRow.name,
        league: teamRow.league,
        gender: teamRow.gender,
        division_level: teamRow.division_level,
        slug: teamRow.slug,
        external_id: teamRow.external_id,
      };

      const { error: updateError } = await supabase
        .from('teams')
        .update(updatePayload)
        .eq('id', targetMatch.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('teams')
        .insert({
          ...teamRow,
          short_name: null,
          logo_url: null,
          youtube_search_tag: null,
        });
      error = insertError;
    }

    if (error) {
      console.error(`Failed to sync team ${teamRow.name}:`, error.message);
    }
  }

  console.log('CPL teams sync complete.');
}

async function getTeamIdMap() {
  const { data, error } = await supabase.from('teams').select('id, external_id, name, slug').eq('league', 'CPL');
  if (error) throw new Error(`teams lookup failed: ${error.message}`);
  
  const map = new Map();
  (data || []).forEach((t) => {
    const normalized = slugify(normalizeTeamName(t.name));
    map.set(normalized, t.id);
    if (t.external_id) map.set(t.external_id, t.id);
    if (t.slug) map.set(t.slug, t.id);
  });
  return map;
}

async function importMatches(teamIdMap) {
  console.log('Fetching CPL match history with Smart Sync protection...');
  const res = await fetch(`${API_BASE}/matches?limit=500`);
  if (!res.ok) throw new Error(`/api/matches failed: ${res.status}`);
  const { matches, total } = await res.json();
  console.log(`API reports ${total || matches.length} total matches, fetched ${matches.length}.`);

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

    let homeScore = m.home_goals ?? m.home_score ?? null;
    let awayScore = m.away_goals ?? m.away_score ?? null;
    let matchStatus = (homeScore !== null && awayScore !== null) ? 'Finished' : 'Scheduled';

    if (existing) {
      const existingHasScore = existing.home_score !== null && existing.away_score !== null;
      const incomingHasScore = homeScore !== null && awayScore !== null;

      // Smart Sync: Protect existing verified score & status if incoming feed drops to null
      if (existingHasScore && !incomingHasScore) {
        homeScore = existing.home_score;
        awayScore = existing.away_score;
        matchStatus = existing.status || 'Finished';
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
      external_id: extId,
    });
  }

  // Deduplicate by external_id before upserting
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
