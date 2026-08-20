import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).');
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

async function ingestTeams() {
  console.log('🏟️ Ingesting CPL Teams from CanadaSoccerAPI...');
  try {
    const res = await fetch('https://canadasoccerapi.com/api/v1/teams');
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const teams = await res.json();

    const teamMap = new Map();

    for (const team of teams) {
      const slug = slugify(team.name || team.team_name);
      const externalId = `cpl-${slug}`;

      const payload = {
        external_id: externalId,
        slug: slug,
        name: team.name || team.team_name,
        short_name: team.short_name || team.code || null,
        league: 'CPL',
        competition: 'CPL',
        gender: 'men',
        venue: team.venue || team.stadium || null,
        city: team.city || null
      };

      const { data, error } = await supabase
        .from('teams')
        .upsert(payload, { onConflict: 'external_id' })
        .select('id, name, external_id')
        .single();

      if (error) {
        console.error(`⚠️ Error upserting team ${payload.name}:`, error.message);
      } else if (data) {
        teamMap.set(data.name.toLowerCase(), data.id);
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
    const res = await fetch('https://canadasoccerapi.com/api/v1/matches');
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const matches = await res.json();

    let syncedCount = 0;

    for (const m of matches) {
      const homeName = m.home_team || m.homeTeam || m.home_team_name;
      const awayName = m.away_team || m.awayTeam || m.away_team_name;

      if (!homeName || !awayName) continue;

      const homeId = teamMap.get(homeName.toLowerCase()) || null;
      const awayId = teamMap.get(awayName.toLowerCase()) || null;

      const matchDate = m.date || m.match_date || new Date().toISOString();
      const externalId = `cpl-match-${slugify(homeName)}-vs-${slugify(awayName)}-${matchDate.split('T')[0]}`;

      const matchPayload = {
        external_id: externalId,
        home_team_id: homeId,
        away_team_id: awayId,
        home_score: m.home_score !== undefined ? m.home_score : m.homeGoals ?? null,
        away_score: m.away_score !== undefined ? m.away_score : m.awayGoals ?? null,
        home_xg: m.home_xg || m.homeXg || null,
        away_xg: m.away_xg || m.awayXg || null,
        venue: m.venue || m.stadium || null,
        status: m.status || (m.home_score !== null && m.home_score !== undefined ? 'FT' : 'NS'),
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

    console.log(`🎉 Successfully synced ${syncedCount} CPL matches with xG into Supabase!`);
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
