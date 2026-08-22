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
  'forge': 'Forge FC',
  'forge fc': 'Forge FC',
  'cavalry': 'Cavalry FC',
  'cavalry fc': 'Cavalry FC',
  'pacific': 'Pacific FC',
  'pacific fc': 'Pacific FC',
  'valour': 'Valour FC',
  'valour fc': 'Valour FC',
  'hfx wanderers': 'HFX Wanderers FC',
  'hfx wanderers fc': 'HFX Wanderers FC',
  'inter toronto': 'Inter Toronto FC',
  'york united': 'Inter Toronto FC',
  'york united fc': 'Inter Toronto FC',
  'atletico ottawa': 'Atlético Ottawa',
  'atlético ottawa': 'Atlético Ottawa',
  'supra': 'FC Supra du Québec',
  'quebec supra': 'FC Supra du Québec',
  'québec supra': 'FC Supra du Québec',
  'fc edmonton': 'FC Edmonton',
  'edmonton': 'FC Edmonton'
};

function normalizeTeamName(name) {
  if (!name) return '';
  const trimmed = name.trim().toLowerCase();
  return TEAM_NAME_OVERRIDES[trimmed] || name.trim();
}

async function ingestTeams() {
  console.log('🏟️ Ingesting CPL Teams from CanadaSoccerAPI...');
  try {
    const res = await fetch('https://canadasoccerapi.com/api/teams?active_only=false');
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const body = await res.json();
    const teams = Array.isArray(body) ? body : (body.teams || []);
    console.log(`   Raw response: ${Array.isArray(body) ? 'array' : 'object'} with ${teams.length} team record(s). Response keys: ${Array.isArray(body) ? 'n/a' : Object.keys(body).join(', ')}`);
    const teamMap = new Map();

    for (const team of teams) {
      const rawName = team.name || team.team_name || team.team;
      if (!rawName) {
        console.warn('   ⚠️ Skipped a team record with no usable name field. Raw keys:', Object.keys(team).join(', '));
        continue;
      }
      const displayName = normalizeTeamName(rawName);
      const slug = slugify(displayName);
      // external_id is the shared cross-script identity now (see the
      // matching comment in ingest-apifootball.mjs) — was `cpl-${slug}`,
      // a scheme unique to this script that collided with the other two
      // ingest scripts' own external_id schemes on the same row.
      const externalId = slug;

      const payload = {
        external_id: externalId,
        slug: slug,
        name: displayName,
        short_name: team.short_name || team.code || null,
        league: 'CPL',
        competition: 'CPL',
        gender: 'men',
        venue: team.venue || team.stadium || null,
        city: team.city || null,
        founded: team.founded || null
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
      } else if (error) {
        console.error(`❌ Team sync failed for "${displayName}": ${error.message}`);
      }
    }
    console.log(`   Team sync complete. ${teamMap.size / 2} team(s) mapped.`);
    return teamMap;
  } catch (err) {
    console.error('❌ Failed to ingest CPL teams:', err.message);
    return new Map();
  }
}

async function ingestHistoricalSeasons(teamMap) {
  // Spanning from the inaugural 2019 season to 2026 active season as outlined in documentation
  const seasons = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
  
  console.log(`⚽ Ingesting Multi-Season Match History & Standings (${seasons[0]} - ${seasons[seasons.length - 1]})...`);

  for (const season of seasons) {
    console.log(`\n--- Processing Season: ${season} ---`);
    
    // 1. Fetch Matches for Season
    try {
      const matchRes = await fetch(`https://canadasoccerapi.com/api/matches?season=${season}&limit=500`);
      if (matchRes.ok) {
        const matchBody = await matchRes.json();
        const matches = Array.isArray(matchBody) ? matchBody : (matchBody.matches || []);
        console.log(`   Raw response: total=${matchBody.total ?? 'n/a'}, count=${matchBody.count ?? 'n/a'}, offset=${matchBody.offset ?? 'n/a'}, limit=${matchBody.limit ?? 'n/a'}, matches array length=${matches.length}`);
        const matchPayloadMap = new Map();
        let skippedNoName = 0;
        let skippedNoTeamId = 0;

        for (const m of matches) {
          const homeName = normalizeTeamName(m.home_team || m.homeTeam || m.home_team_name);
          const awayName = normalizeTeamName(m.away_team || m.awayTeam || m.away_team_name);
          if (!homeName || !awayName) { skippedNoName++; continue; }

          const homeId = teamMap.get(homeName.toLowerCase()) || teamMap.get(slugify(homeName)) || null;
          const awayId = teamMap.get(awayName.toLowerCase()) || teamMap.get(slugify(awayName)) || null;
          if (!homeId || !awayId) {
            skippedNoTeamId++;
            if (skippedNoTeamId <= 3) {
              console.warn(`   ⚠️ No team match for "${homeName}" (id=${homeId}) vs "${awayName}" (id=${awayId}) — check these names against teamMap.`);
            }
            continue;
          }

          const matchDate = m.date || m.match_date || `${season}-01-01`;
          const dateOnly = matchDate.split('T')[0];
          const externalId = `cpl-match-${season}-${slugify(homeName)}-vs-${slugify(awayName)}-${dateOnly}`;
          const homeScore = m.home_goals ?? m.home_score ?? m.homeScore ?? null;
          const awayScore = m.away_goals ?? m.away_score ?? m.awayScore ?? null;

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
            competition: 'CPL',
            season: season
          });
        }

        if (skippedNoName > 0) console.log(`   Skipped ${skippedNoName} match(es) with no usable team name.`);
        if (skippedNoTeamId > 0) console.log(`   Skipped ${skippedNoTeamId} match(es) with a team name that didn't map to a synced team.`);

        const payloads = Array.from(matchPayloadMap.values());
        if (payloads.length > 0) {
          const { error } = await supabase.from('matches').upsert(payloads, { onConflict: 'external_id' });
          if (error) {
            console.error(`⚠️ Error syncing matches for ${season}:`, error.message);
          } else {
            console.log(`🎉 Synced ${payloads.length} matches for season ${season}.`);
          }
        } else {
          console.log(`   No matches to sync for ${season} (${matches.length} fetched, all filtered out — see skip counts above).`);
        }
      } else {
        console.error(`   ❌ Match fetch for ${season} returned HTTP ${matchRes.status}`);
      }
    } catch (err) {
      console.error(`❌ Failed to fetch matches for ${season}:`, err.message);
    }

    // 2. Fetch Standings for Season
    try {
      const standRes = await fetch(`https://canadasoccerapi.com/api/standings?season=${season}`);
      if (standRes.ok) {
        const standBody = await standRes.json();
        const standings = standBody.standings || [];
        console.log(`📊 Retrieved ${standings.length} official table records for season ${season} (Source: ${standBody.source || 'official'})`);
      }
    } catch (err) {
      console.error(`⚠️ Could not fetch standings for ${season}:`, err.message);
    }
  }
}

async function run() {
  console.log('🚀 Starting Full CanadaSoccerAPI Historical Pipeline...');
  const teamMap = await ingestTeams();
  await ingestHistoricalSeasons(teamMap);
  console.log('\n✨ Complete Historical Data Ingestion Finished Successfully!');
}

run().catch(err => {
  console.error('❌ Fatal Pipeline Error:', err);
  process.exit(1);
});
