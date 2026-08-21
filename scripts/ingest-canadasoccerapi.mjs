// scripts/ingest-canadasoccerapi.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables (SUPABASE_URL or SERVICE_ROLE_KEY).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

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

async function ingestTeams() {
  console.log('🏟️ Ingesting CPL Teams from CanadaSoccerAPI...');
  try {
    const res = await fetch('https://canadasoccerapi.com/api/teams');
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const body = await res.json();
    const teams = Array.isArray(body) ? body : (body.teams || []);

    // Query existing teams to preserve non-null data and cross-reference IDs
    const { data: existingTeams } = await supabase
      .from('teams')
      .select('*')
      .eq('league', 'CPL');

    const existingMap = new Map();
    (existingTeams || []).forEach(t => existingMap.set(slugify(normalizeTeamName(t.name)), t));

    const teamMap = new Map();

    for (const team of teams) {
      const rawName = team.name || team.team_name || team.team;
      if (!rawName) continue;

      const displayName = normalizeTeamName(rawName);
      const slug = slugify(displayName);
      const externalId = `cpl-${slug}`;
      const existing = existingMap.get(slug);

      const payload = {
        external_id: externalId,
        slug: slug,
        name: displayName,
        short_name: team.short_name || team.code || existing?.short_name || null,
        league: 'CPL',
        competition: 'CPL',
        gender: 'men',
        venue: team.venue || team.stadium || existing?.venue || null,
        city: team.city || existing?.city || null,
        logo_url: existing?.logo_url || null,
        csapi_id: String(team.id || slug)
      };

      const { data, error } = await supabase
        .from('teams')
        .upsert(payload, { onConflict: 'slug' })
        .select('id, name, external_id')
        .single();

      if (error) {
        console.error(`⚠️ Error upserting team ${payload.name}:`, error.message);
      } else if (data) {
        teamMap.set(data.name.toLowerCase(), data.id);
        teamMap.set(data.name.toLowerCase().replace(' fc', ''), data.id);
        teamMap.set(slug, data.id);
        console.log(`✅ Synced Team: ${data.name} (ID: ${data.id})`);
      }
    }

    return teamMap;
  } catch (err) {
    console.error('❌ Failed to ingest CPL teams:', err.message);
    return new Map();
  }
}

async function ingestMatches(teamMap) {
  console.log('⚽ Ingesting CPL Match History & Telemetry (with xG)...');
  try {
    const res = await fetch('https://canadasoccerapi.com/api/matches?limit=500');
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const body = await res.json();
    const matches = Array.isArray(body) ? body : (body.matches || []);

    const { data: existingMatches } = await supabase
      .from('matches')
      .select('external_id, home_score, away_score, home_xg, away_xg, status');

    const existingMatchMap = new Map();
    (existingMatches || []).forEach(m => existingMatchMap.set(m.external_id, m));

    let syncedCount = 0;
    let skippedCount = 0;

    for (const m of matches) {
      const homeName = normalizeTeamName(m.home_team || m.homeTeam || m.home_team_name);
      const awayName = normalizeTeamName(m.away_team || m.awayTeam || m.away_team_name);

      if (!homeName || !awayName) continue;

      const homeId = teamMap.get(slugify(homeName)) || teamMap.get(homeName.toLowerCase()) || null;
      const awayId = teamMap.get(slugify(awayName)) || teamMap.get(awayName.toLowerCase()) || null;

      if (!homeId || !awayId) {
        skippedCount++;
        continue;
      }

      const matchDate = m.date || m.match_date || new Date().toISOString();
      const externalId = `cpl-match-${slugify(homeName)}-vs-${slugify(awayName)}-${matchDate.split('T')[0]}`;
      const existing = existingMatchMap.get(externalId);

      let homeScore = m.home_goals ?? m.home_score ?? m.homeScore ?? existing?.home_score ?? null;
      let awayScore = m.away_goals ?? m.away_score ?? m.awayScore ?? existing?.away_score ?? null;
      let homeXg = m.home_xg ?? m.homeXg ?? existing?.home_xg ?? null;
      let awayXg = m.away_xg ?? m.awayXg ?? existing?.away_xg ?? null;
      let matchStatus = existing?.status || ((homeScore !== null && awayScore !== null) ? 'FT' : 'NS');

      // Rule 4: Skip re-writing completed historical matches unless filling missing xG or scores
      if (existing && existing.status === 'FT' && existing.home_score !== null && existing.home_xg !== null) {
        continue;
      }

      const matchPayload = {
        external_id: externalId,
        home_team_id: homeId,
        away_team_id: awayId,
        home_score: homeScore,
        away_score: awayScore,
        home_xg: homeXg,
        away_xg: awayXg,
        venue: m.venue || m.stadium || null,
        status: matchStatus,
        match_date: matchDate,
        competition: 'CPL'
      };

      const { error } = await supabase
        .from('matches')
        .upsert(matchPayload, { onConflict: 'external_id' });

      if (error) {
        console.error(`⚠️ Error syncing match (${homeName} vs ${awayName}):`, error.message);
      } else {
        syncedCount++;
      }
    }

    console.log(`🎉 Successfully synced ${syncedCount} CPL matches into Supabase! (${skippedCount} skipped)`);
  } catch (err) {
    console.error('❌ Failed to ingest matches:', err.message);
  }
}

async function run() {
  console.log('🚀 Starting CanadaSoccerAPI Ingestion Pipeline...');
  const teamMap = await ingestTeams();
  await ingestMatches(teamMap);
  console.log('✨ CanadaSoccerAPI Ingestion Complete!\n');
}

run().catch(err => {
  console.error('❌ Fatal Pipeline Error:', err);
  process.exit(1);
});
