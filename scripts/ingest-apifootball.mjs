import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const APIF_KEY = process.env.APIF_KEY || '5c5b3e3c9a98dd5a09969018da39aa37';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !APIF_KEY) {
  console.error('❌ Missing required environment variables (SUPABASE_URL, SERVICE_ROLE_KEY, or APIF_KEY).');
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

async function uploadToMediaVault(imageUrl, destinationPath) {
  if (!imageUrl || imageUrl.includes('supabase.co')) return imageUrl;

  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return imageUrl;

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get('content-type') || 'image/png';

    const { error } = await supabase.storage
      .from('media')
      .upload(destinationPath, buffer, {
        contentType,
        upsert: true
      });

    if (error) {
      return imageUrl;
    }

    const { data } = supabase.storage
      .from('media')
      .getPublicUrl(destinationPath);

    return data.publicUrl;
  } catch (err) {
    return imageUrl;
  }
}

const APIF_TARGETS = [
  { leagueId: 659, leagueName: 'CPL', gender: 'men' },
  { leagueId: 494, leagueName: 'Canadian Championship', gender: 'men' },
  { leagueId: 253, leagueName: 'MLS', gender: 'men' }
];

const SEASONS = [2025, 2024];

async function apiFetch(endpoint) {
  const headers = {
    'x-apisports-key': APIF_KEY,
    'Accept': 'application/json'
  };

  const res = await fetch(`https://v3.football.api-sports.io/${endpoint}`, { headers });
  if (!res.ok) throw new Error(`API-Football HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors && Object.keys(json.errors).length > 0) {
    const errMsgs = Object.values(json.errors).join(', ');
    throw new Error(errMsgs);
  }
  return json;
}

async function syncRostersAndStats() {
  console.log('📡 Connecting to API-Football for Squad Rosters, Stats & Media Vault Sync...');

  const { data: dbTeams } = await supabase.from('teams').select('id, name, slug, external_id');
  const teamMap = new Map();
  (dbTeams || []).forEach(t => teamMap.set(slugify(t.name), t.id));

  for (const target of APIF_TARGETS) {
    let teamsResponse = null;
    let activeSeason = 2025;

    for (const season of SEASONS) {
      try {
        console.log(`\n🔍 Querying ${target.leagueName} (${season})...`);
        const res = await apiFetch(`teams?league=${target.leagueId}&season=${season}`);
        if (res?.response && res.response.length > 0) {
          teamsResponse = res.response;
          activeSeason = season;
          break;
        }
      } catch (err) {
        console.warn(`⚠️ Season ${season} query note: ${err.message}`);
      }
    }

    if (!teamsResponse) {
      console.warn(`⚠️ No team payload returned for ${target.leagueName}.`);
      continue;
    }

    for (const item of teamsResponse) {
      const teamInfo = item.team;
      const teamSlug = slugify(teamInfo.name);

      if (target.leagueName === 'MLS' && teamInfo.country !== 'Canada') {
        continue;
      }

      let targetTeamId = teamMap.get(teamSlug) || null;

      let logoCdnUrl = teamInfo.logo;
      if (logoCdnUrl) {
        logoCdnUrl = await uploadToMediaVault(teamInfo.logo, `teams/${teamSlug}.png`);
      }

      const teamPayload = {
        external_id: `apif-team-${teamInfo.id}`,
        slug: teamSlug,
        name: teamInfo.name,
        league: target.leagueName,
        competition: target.leagueName,
        gender: target.gender,
        logo_url: logoCdnUrl
      };

      const { data: savedTeam, error: teamErr } = await supabase
        .from('teams')
        .upsert(teamPayload, { onConflict: 'external_id' })
        .select('id')
        .single();

      if (savedTeam) {
        targetTeamId = savedTeam.id;
        teamMap.set(teamSlug, targetTeamId);
      }

      console.log(`👤 Fetching squad roster for ${teamInfo.name}...`);
      try {
        const squadData = await apiFetch(`players/squads?team=${teamInfo.id}`);

        if (squadData?.response?.[0]?.players) {
          const players = squadData.response[0].players;

          for (const p of players) {
            const playerSlug = slugify(p.name);
            const externalId = `apif-player-${p.id}`;

            let avatarCdnUrl = p.photo;
            if (avatarCdnUrl) {
              avatarCdnUrl = await uploadToMediaVault(p.photo, `players/${playerSlug}.png`);
            }

            const playerPayload = {
              external_id: externalId,
              slug: playerSlug,
              name: p.name,
              position: p.position || 'MID',
              gender: target.gender,
              team_id: targetTeamId,
              league: target.leagueName,
              avatar_url: avatarCdnUrl,
              age: p.age || null,
              rating: 7.5
            };

            const { data: savedPlayer, error: pErr } = await supabase
              .from('players')
              .upsert(playerPayload, { onConflict: 'external_id' })
              .select('id')
              .single();

            if (pErr) {
              console.error(`⚠️ Player sync error (${p.name}): ${pErr.message}`);
              continue;
            }

            if (savedPlayer?.id) {
              const statsPayload = {
                player_id: savedPlayer.id,
                team_id: targetTeamId,
                season: String(activeSeason),
                competition: target.leagueName,
                matches_played: p.number || 0,
                rating: 7.5
              };

              await supabase
                .from('player_season_stats')
                .upsert(statsPayload, { onConflict: 'player_id,season,competition' });
            }
          }
          console.log(`✅ Synced ${players.length} players & media for ${teamInfo.name}`);
        }
      } catch (sqErr) {
        console.warn(`⚠️ Could not fetch squad for ${teamInfo.name}: ${sqErr.message}`);
      }
    }
  }
}

async function run() {
  console.log('🚀 Starting API-Football & Media Vault Ingestion Pipeline...');
  await syncRostersAndStats();
  console.log('\n🎉 API-Football Pipeline & Storage Upload Complete!');
}

run().catch(err => {
  console.error('❌ Fatal Pipeline Error:', err);
  process.exit(1);
});
