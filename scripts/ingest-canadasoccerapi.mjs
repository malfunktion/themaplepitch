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

// Canonical Aliases Mapping: Standardizes variant team strings across providers
const TEAM_NAME_OVERRIDES = {
  'forge': 'Forge FC',
  'cavalry': 'Cavalry FC',
  'pacific': 'Pacific FC',
  'valour': 'Valour FC',
  'hfx wanderers': 'HFX Wanderers FC',
  'inter toronto': 'Inter Toronto FC',
  'york united': 'Inter Toronto FC',
  'york united fc': 'Inter Toronto FC',
  'atletico ottawa': 'Atlético Ottawa'
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

    // Fetch existing teams from DB to map provider IDs to canonical slugs
    const { data: existingTeams } = await supabase
      .from('teams')
      .select('id, name, slug, csapi_id');

    const existingMap = new Map();
    (existingTeams || []).forEach(t => existingMap.set(t.slug, t));

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
        city: team.city || existing?.city || null
      };

      const { data, error } = await supabase
        .from('teams')
        .upsert(payload, { onConflict: 'slug' })
        .select('id, name, slug')
        .maybeSingle();

      if (!error && data) {
        teamMap.set(data.name.toLowerCase(), data.id);
        teamMap.set(data.slug, data.id);
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

    const matchPayloadMap = new Map();
    let skippedCount = 0;

    for (const m of matches) {
      const homeName = normalizeTeamName(m.home_team || m.homeTeam || m.home_team_name);
      const awayName = normalizeTeamName(m.away_team || m.awayTeam || m.away_team_name);

      if (!homeName || !awayName) continue;

      const homeId = teamMap.get(homeName.toLowerCase()) || teamMap.get(slugify(homeName)) || null;
      const awayId = teamMap.get(awayName.toLowerCase()) || teamMap.get(slugify(awayName)) || null;

      if (!homeId || !awayId) {
        skippedCount++;
        continue;
      }

      const matchDate = m.date || m.match_date || new Date().toISOString();
      const dateOnly = matchDate.split('T')[0];
      const externalId = `cpl-match-${slugify(homeName)}-vs-${slugify(awayName)}-${dateOnly}`;

      const homeScore = m.home_goals ?? m.home_score ?? m.homeScore ?? null;
      const awayScore = m.away_goals ?? m.away_score ?? m.awayScore ?? null;

      // In-Memory Deduplication: Prevents matches_unique_fixture batch constraint errors
      matchPayloadMap.set(externalId, {
        external_id: externalId,
        home_team_id: homeId,
        away_team_id: awayId,
        home_score: homeScore,
        away_score: awayScore,
        home_xg: m.home_xg || m.homeXg || null,
        away_xg: m.away_xg || m.awayXg || null,
        venue: m.venue || m.stadium || null,
        status: m.status || (homeScore !== null ? 'FT' : 'NS'),
        match_date: matchDate,
        competition: 'CPL'
      });
    }

    const uniqueMatchPayloads = Array.from(matchPayloadMap.values());

    if (uniqueMatchPayloads.length > 0) {
      const { error } = await supabase
        .from('matches')
        .upsert(uniqueMatchPayloads, { onConflict: 'external_id' });

      if (error) {
        console.error('⚠️ Error syncing match batch:', error.message);
      } else {
        console.log(`🎉 Successfully synced ${uniqueMatchPayloads.length} CPL matches into Supabase!`);
      }
    }
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
