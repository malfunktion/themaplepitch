// scripts/ingest-apifootball.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const APIF_KEY = process.env.APIF_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

function slugify(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Franchise Renaming Normalization (Matching TheSportsDB and CanadaSoccerAPI scripts)
const TEAM_NAME_OVERRIDES = {
  'york united': 'Inter Toronto FC',
  'york united fc': 'Inter Toronto FC',
  'york9': 'Inter Toronto FC',
  'york9 fc': 'Inter Toronto FC'
};

function normalizeTeamName(name) {
  if (!name) return '';
  const trimmed = name.trim().toLowerCase();
  return TEAM_NAME_OVERRIDES[trimmed] || name.trim();
}

// Scope-Locked Canadian & MLS Team Registry
const VERIFIED_CANADIAN_API_TEAMS = [
  // CPL Clubs
  { id: 15121, name: 'Forge FC', league: 'CPL' },
  { id: 15122, name: 'Cavalry FC', league: 'CPL' },
  { id: 15123, name: 'Atlético Ottawa', league: 'CPL' },
  { id: 15124, name: 'Pacific FC', league: 'CPL' },
  { id: 15125, name: 'York United FC', league: 'CPL' },
  { id: 15126, name: 'Valour FC', league: 'CPL' },
  { id: 15127, name: 'HFX Wanderers FC', league: 'CPL' },
  { id: 20265, name: 'Vancouver FC', league: 'CPL' },

  // Canadian MLS Franchises
  { id: 1603, name: 'Toronto FC', league: 'MLS' },
  { id: 1614, name: 'CF Montréal', league: 'MLS' },
  { id: 1601, name: 'Vancouver Whitecaps FC', league: 'MLS' }
];

async function runIngestion() {
  console.log('🚀 Executing Safe Rules-Compliant API-Football Sync...');

  if (!APIF_KEY) {
    console.warn('⚠️ APIF_KEY is missing. Aborting external network requests.');
    return;
  }

  const headers = {
    'x-apisports-key': APIF_KEY,
    'User-Agent': 'TheMaplePitch-Terminal/1.0',
    'Accept': 'application/json'
  };

  for (const team of VERIFIED_CANADIAN_API_TEAMS) {
    const displayName = normalizeTeamName(team.name);
    const teamSlug = slugify(displayName);

    // 1. Fetch existing team from DB to preserve multi-provider cross-reference IDs
    const { data: existingTeam } = await supabase
      .from('teams')
      .select('id, tsdb_id, csapi_id, logo_url')
      .eq('slug', teamSlug)
      .maybeSingle();

    // 2. Build team payload keeping canonical team names consistent across all script runs
    const teamPayload = {
      external_id: `apif-${team.id}`,
      slug: teamSlug,
      name: displayName,
      league: team.league,
      apif_id: String(team.id),
      tsdb_id: existingTeam?.tsdb_id || null,
      csapi_id: existingTeam?.csapi_id || null
    };

    const { data: dbTeam, error: teamErr } = await supabase
      .from('teams')
      .upsert(teamPayload, { onConflict: 'slug' })
      .select()
      .maybeSingle();

    if (teamErr || !dbTeam) {
      console.error(`❌ Team sync failed for ${displayName}:`, teamErr?.message || 'Database error');
      continue;
    }

    console.log(`✅ Synced Canadian Club: ${displayName} (ID: ${dbTeam.id})`);

    // 3. Smart-Sync Pre-Check: Skip squad fetch if players are already linked
    const { data: existingPlayers } = await supabase
      .from('players')
      .select('id')
      .eq('team_id', dbTeam.id);

    if (existingPlayers && existingPlayers.length > 0) {
      console.log(`⏩ ${displayName} roster already populated (${existingPlayers.length} players found). Skipping API fetch.`);
      continue;
    }

    // 4. Fetch live squad from API-Football
    try {
      console.log(`📡 Fetching live squad for ${displayName}...`);
      const res = await fetch(`https://v3.football.api-sports.io/players/squads?team=${team.id}`, { headers });

      if (res.status === 429) {
        console.warn(`⚠️ Rate limit hit (429) on ${displayName}. Pausing for 15s cooldown...`);
        await new Promise(r => setTimeout(r, 15000));
        continue;
      }

      if (!res.ok) {
        console.warn(`⚠️ API error for ${displayName}: Status ${res.status}`);
        continue;
      }

      const squadData = await res.json();
      const playersList = squadData?.response?.[0]?.players || [];

      if (playersList.length === 0) {
        console.log(`ℹ️ No players found via API for ${displayName}.`);
        continue;
      }

      const playerPayloads = playersList.map(p => {
        const nationality = p.nationality || 'Canada';
        const isCanadian = nationality.toLowerCase() === 'canada' || nationality.toLowerCase() === 'canadian';

        return {
          external_id: `apif-player-${p.id}`,
          slug: slugify(p.name),
          name: p.name,
          position: p.position || 'Unknown',
          team_id: dbTeam.id,
          gender: 'men',
          league: team.league,
          nationality: nationality,
          is_canadian: isCanadian,
          metadata: { age: p.age, photo: p.photo, apif_id: p.id }
        };
      });

      const { error: playerErr } = await supabase
        .from('players')
        .upsert(playerPayloads, { onConflict: 'external_id' });

      if (playerErr) {
        console.error(`⚠️ Error syncing roster for ${displayName}:`, playerErr.message);
      } else {
        console.log(`👤 Successfully synced ${playerPayloads.length} players for ${displayName}`);
      }

      // Safe throttling delay
      await new Promise(r => setTimeout(r, 1500));

    } catch (err) {
      console.error(`❌ Network error fetching ${displayName}:`, err.message);
    }
  }

  console.log('✨ API-Football Smart Sync Complete!');
}

runIngestion().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
