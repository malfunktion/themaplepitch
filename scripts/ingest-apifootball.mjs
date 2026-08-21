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

// Scope-Locked Canadian & MLS Team Map in API-Football
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

  // Canadian MLS Clubs
  { id: 1603, name: 'Toronto FC', league: 'MLS' },
  { id: 1614, name: 'CF Montréal', league: 'MLS' },
  { id: 1601, name: 'Vancouver Whitecaps FC', league: 'MLS' }
];

async function ingestApiFootball() {
  console.log('🚀 Starting Scope-Locked API-Football & Squad Ingestion...');

  if (!APIF_KEY) {
    console.warn('⚠️ APIF_KEY environment variable is missing.');
    return;
  }

  const headers = {
    'x-apisports-key': APIF_KEY,
    'User-Agent': 'TheMaplePitch-ScoutTerminal/1.0',
    'Accept': 'application/json'
  };

  for (const team of VERIFIED_CANADIAN_API_TEAMS) {
    const teamSlug = slugify(team.name);

    // 1. Sync Team Record (Uses composite conflict target 'league, name' to prevent unique key errors)
    const teamPayload = {
      external_id: `apif-${team.id}`,
      slug: teamSlug,
      name: team.name,
      league: team.league
    };

    const { data: dbTeam, error: teamErr } = await supabase
      .from('teams')
      .upsert(teamPayload, { onConflict: 'league, name' })
      .select()
      .single();

    if (teamErr || !dbTeam) {
      console.error(`❌ Error syncing team ${team.name}:`, teamErr?.message || 'Unknown database error');
      continue;
    }

    console.log(`✅ Synced Canadian Club: ${team.name} (ID: ${dbTeam.id})`);

    // 2. SMART-SYNC CHECK: Skip external API call if team roster is already populated
    const { data: existingPlayers } = await supabase
      .from('players')
      .select('id')
      .eq('team_id', dbTeam.id);

    if (existingPlayers && existingPlayers.length > 0) {
      console.log(`ℹ️ Roster already up-to-date for ${team.name} (${existingPlayers.length} players found). Skipping write.`);
      continue;
    }

    // 3. Fetch Squad from API-Football
    try {
      console.log(`📡 Fetching live squad for ${team.name}...`);
      const squadRes = await fetch(`https://v3.football.api-sports.io/players/squads?team=${team.id}`, { headers });
      
      if (!squadRes.ok) {
        console.warn(`⚠️ API Error for ${team.name}: Status ${squadRes.status}`);
        continue;
      }

      const squadData = await squadRes.json();
      const playersList = squadData?.response?.[0]?.players || [];

      if (playersList.length === 0) {
        console.log(`ℹ️ No players found via API for ${team.name}.`);
        continue;
      }

      const playerPayloads = playersList.map(p => ({
        external_id: `apif-player-${p.id}`,
        slug: slugify(p.name),
        name: p.name,
        position: p.position || 'Unknown',
        team_id: dbTeam.id,
        gender: 'men',
        league: team.league,
        metadata: { age: p.age, photo: p.photo }
      }));

      const { error: playerErr } = await supabase
        .from('players')
        .upsert(playerPayloads, { onConflict: 'external_id' });

      if (playerErr) {
        console.error(`⚠️ Error syncing roster for ${team.name}:`, playerErr.message);
      } else {
        console.log(`👤 Successfully synced ${playerPayloads.length} players for ${team.name}`);
      }

      // Safe throttling delay (1.5 seconds)
      await new Promise(r => setTimeout(r, 1500));

    } catch (apiErr) {
      console.error(`❌ Network error fetching squad for ${team.name}:`, apiErr.message);
    }
  }

  console.log('✨ Scope-Locked Ingestion & Squad Sync Complete!');
}

ingestApiFootball().catch(err => {
  console.error('❌ Fatal ingestion failure:', err);
  process.exit(1);
});
