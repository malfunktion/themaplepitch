// scripts/ingest-apifootball.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const APIF_KEY = process.env.APIF_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables: SUPABASE_URL or SERVICE_ROLE_KEY.');
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

// Scope-Locked Teams
const TARGET_TEAMS = [
  // CPL
  { id: 15121, name: 'Forge FC', league: 'CPL', country: 'Canada' },
  { id: 15122, name: 'Cavalry FC', league: 'CPL', country: 'Canada' },
  { id: 15123, name: 'Atlético Ottawa', league: 'CPL', country: 'Canada' },
  { id: 15124, name: 'Pacific FC', league: 'CPL', country: 'Canada' },
  { id: 15125, name: 'York United FC', league: 'CPL', country: 'Canada' },
  { id: 15126, name: 'Valour FC', league: 'CPL', country: 'Canada' },
  { id: 15127, name: 'HFX Wanderers FC', league: 'CPL', country: 'Canada' },
  { id: 20265, name: 'Vancouver FC', league: 'CPL', country: 'Canada' },
  // Canadian MLS
  { id: 1603, name: 'Toronto FC', league: 'MLS', country: 'Canada' },
  { id: 1614, name: 'CF Montréal', league: 'MLS', country: 'Canada' },
  { id: 1601, name: 'Vancouver Whitecaps FC', league: 'MLS', country: 'Canada' }
];

async function syncApiFootball() {
  console.log('🚀 Executing Rules-Compliant API-Football Sync...');

  if (!APIF_KEY) {
    console.warn('⚠️ APIF_KEY is missing. Aborting external network fetches.');
    return;
  }

  const headers = {
    'x-apisports-key': APIF_KEY,
    'User-Agent': 'TheMaplePitch-Terminal/1.0',
    'Accept': 'application/json'
  };

  for (const team of TARGET_TEAMS) {
    const slug = slugify(team.name);

    // 1. Fetch existing team from DB to check multi-source mapping
    const { data: existingTeam } = await supabase
      .from('teams')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    // Fill blanks without replacing filled data
    const teamPayload = {
      slug: slug,
      name: team.name,
      league: team.league,
      apif_id: String(team.id),
      tsdb_id: existingTeam?.tsdb_id || null, // Preserve alternate provider IDs
      logo_url: existingTeam?.logo_url || null,
      updated_at: new Date().toISOString()
    };

    const { data: dbTeam, error: teamErr } = await supabase
      .from('teams')
      .upsert(teamPayload, { onConflict: 'slug' })
      .select()
      .single();

    if (teamErr || !dbTeam) {
      console.error(`❌ Team sync failed for ${team.name}:`, teamErr?.message);
      continue;
    }

    // 2. Check if active roster is already synced (Skip unnecessary re-fetches)
    const { data: existingPlayers } = await supabase
      .from('players')
      .select('id, external_id, name, nationality, is_canadian, metadata')
      .eq('current_team_id', dbTeam.id);

    if (existingPlayers && existingPlayers.length > 15) {
      console.log(`⏩ ${team.name} roster already populated (${existingPlayers.length} players). Skipping API squad fetch.`);
      continue;
    }

    // 3. Fetch live squad from API-Football
    try {
      console.log(`📡 Fetching squad for ${team.name} (API ID: ${team.id})...`);
      const res = await fetch(`https://v3.football.api-sports.io/players/squads?team=${team.id}`, { headers });
      
      if (!res.ok) {
        console.warn(`⚠️ API error for ${team.name}: Status ${res.status}`);
        continue;
      }

      const squadData = await res.json();
      const playersList = squadData?.response?.[0]?.players || [];

      const existingPlayerMap = new Map();
      (existingPlayers || []).forEach(p => existingPlayerMap.set(p.external_id, p));

      const playerPayloads = [];

      for (const p of playersList) {
        const pSlug = slugify(p.name);
        const externalId = `apif-player-${p.id}`;
        const existingP = existingPlayerMap.get(externalId);

        // Passport & Citizenship Logic
        const nationality = p.nationality || existingP?.nationality || 'Canada';
        const isCanadian = nationality.toLowerCase() === 'canada' || nationality.toLowerCase() === 'canadian';

        // Fill blanks while preserving historical metadata
        const mergedMetadata = {
          ...(existingP?.metadata || {}),
          age: p.age || existingP?.metadata?.age,
          photo: p.photo || existingP?.metadata?.photo,
          apif_id: p.id
        };

        playerPayloads.push({
          external_id: externalId,
          slug: pSlug,
          name: p.name,
          position: p.position || 'Unknown',
          current_team_id: dbTeam.id,
          league: team.league,
          nationality: nationality,
          is_canadian: isCanadian,
          gender: 'men',
          metadata: mergedMetadata,
          updated_at: new Date().toISOString()
        });
      }

      if (playerPayloads.length > 0) {
        const { error: pErr } = await supabase
          .from('players')
          .upsert(playerPayloads, { onConflict: 'external_id' });

        if (pErr) {
          console.error(`⚠️ Error writing squad for ${team.name}:`, pErr.message);
        } else {
          console.log(`✅ Synced ${playerPayloads.length} player profiles for ${team.name}`);
        }
      }

      // Safe rate-limit throttling
      await new Promise(r => setTimeout(r, 1500));

    } catch (err) {
      console.error(`❌ Network error fetching ${team.name}:`, err.message);
    }
  }

  console.log('✨ API-Football Smart Sync Complete!');
}

syncApiFootball().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
