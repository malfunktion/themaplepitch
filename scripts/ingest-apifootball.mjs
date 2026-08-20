import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const APIF_KEY = process.env.APIF_KEY || '5c5b3e3c9a98dd5a09969018da39aa37';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !APIF_KEY) {
  console.error('❌ Missing required environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or APIF_KEY).');
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

/**
 * Downloads a remote image and streams it directly to Supabase Storage ('media' bucket)
 */
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
      console.warn(`⚠️ Storage note (${destinationPath}): ${error.message}`);
      return imageUrl;
    }

    const { data } = supabase.storage
      .from('media')
      .getPublicUrl(destinationPath);

    return data.publicUrl;
  } catch (err) {
    console.warn(`⚠️ Media upload skipped for ${imageUrl}: ${err.message}`);
    return imageUrl;
  }
}

// Key domestic and international competitions
const APIF_TARGETS = [
  { leagueId: 659, season: 2026, leagueName: 'CPL', gender: 'men' },
  { leagueId: 494, season: 2026, leagueName: 'Canadian Championship', gender: 'men' },
  { leagueId: 253, season: 2026, leagueName: 'MLS', gender: 'men' }
];

async function apiFetch(endpoint) {
  const headers = {
    'x-apisports-key': APIF_KEY,
    'Accept': 'application/json'
  };

  const res = await fetch(`https://v3.football.api-sports.io/${endpoint}`, { headers });
  if (!res.ok) throw new Error(`API-Football HTTP ${res.status}`);
  return await res.json();
}

async function syncRostersAndStats() {
  console.log('📡 Connecting to API-Football for Squad Rosters, Stats & Media Vault Sync...');

  // 1. Get existing teams from Supabase to link records cleanly
  const { data: dbTeams, error: teamsErr } = await supabase.from('teams').select('id, name, slug, external_id');
  if (teamsErr) {
    console.error('❌ Failed fetching teams from Supabase:', teamsErr.message);
    return;
  }

  const teamMap = new Map();
  (dbTeams || []).forEach(t => teamMap.set(slugify(t.name), t.id));

  for (const target of APIF_TARGETS) {
    console.log(`\n🔍 Fetching squad telemetry for ${target.leagueName} (${target.season})...`);
    try {
      const teamsData = await apiFetch(`teams?league=${target.leagueId}&season=${target.season}`);
      if (!teamsData?.response) continue;

      for (const item of teamsData.response) {
        const teamInfo = item.team;
        const coachInfo = item.venue; // basic info container

        const teamSlug = slugify(teamInfo.name);
        const targetTeamId = teamMap.get(teamSlug) || null;

        // Stream Team Logo to Supabase Storage
        let logoCdnUrl = teamInfo.logo;
        if (logoCdnUrl) {
          logoCdnUrl = await uploadToMediaVault(teamInfo.logo, `teams/${teamSlug}.png`);
        }

        // Upsert/Update Team with CDN Logo
        if (targetTeamId) {
          await supabase
            .from('teams')
            .update({ logo_url: logoCdnUrl })
            .eq('id', targetTeamId);
        }

        // Fetch Squad Roster
        console.log(`👤 Fetching squad roster for ${teamInfo.name}...`);
        const squadData = await apiFetch(`players/squads?team=${teamInfo.id}`);

        if (squadData?.response?.[0]?.players) {
          const players = squadData.response[0].players;

          for (const p of players) {
            const playerSlug = slugify(p.name);
            const externalId = `apif-player-${p.id}`;

            // Stream Headshot to Supabase Storage
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
              rating: 7.2
            };

            const { data: savedPlayer, error: pErr } = await supabase
              .from('players')
              .upsert(playerPayload, { onConflict: 'external_id' })
              .select('id')
              .single();

            if (pErr) {
              console.error(`⚠️ Error syncing player ${p.name}:`, pErr.message);
              continue;
            }

            // Upsert Season Stats Entry
            if (savedPlayer?.id) {
              const statsPayload = {
                player_id: savedPlayer.id,
                team_id: targetTeamId,
                season: String(target.season),
                competition: target.leagueName,
                matches_played: p.number || 0,
                rating: 7.2
              };

              await supabase
                .from('player_season_stats')
                .upsert(statsPayload, { onConflict: 'player_id,season,competition' });
            }
          }
          console.log(`✅ Locked & Media-Synced ${players.length} players for ${teamInfo.name}`);
        }
      }
    } catch (err) {
      console.error(`❌ API Error on league ${target.leagueName}:`, err.message);
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
