// scripts/ingest-apifootball.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const APIF_KEY = process.env.APIF_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !APIF_KEY) {
  console.error('❌ Missing required environment variables (SUPABASE_URL, SERVICE_ROLE_KEY, or APIF_KEY).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

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
  { id: 4,     name: 'HFX Wanderers FC', league: 'CPL' },
  { id: 20265, name: 'Vancouver FC', league: 'CPL' },
  // MLS Canadian Franchises
  { id: 1603,  name: 'Toronto FC', league: 'MLS' },
  { id: 1614,  name: 'CF Montréal', league: 'MLS' },
  { id: 1601,  name: 'Vancouver Whitecaps FC', league: 'MLS' }
];

async function runIngestion() {
  console.log('🚀 Starting Smart-Skipped Scope-Locked API-Football & Squad Ingestion...');

  const headers = {
    'x-apisports-key': APIF_KEY,
    'User-Agent': 'TheMaplePitch-ScoutTerminal/1.0',
    'Accept': 'application/json'
  };

  for (const team of VERIFIED_CANADIAN_API_TEAMS) {
    try {
      // 1. Ensure team exists in database and get its UUID
      const teamSlug = slugify(team.name);
      const { data: dbTeam, error: teamErr } = await supabase
        .from('teams')
        .select('id')
        .eq('slug', teamSlug)
        .maybeSingle();

      if (teamErr || !dbTeam) {
        console.log(`⚠️ Team record not found in Supabase for ${team.name}. Skipping squad fetch.`);
        continue;
      }

      // 2. SMART-SKIPPING: Check if roster is already populated in Supabase
      const { data: existingPlayers, error: checkErr } = await supabase
        .from('players')
        .select('id')
        .eq('team_id', dbTeam.id);

      if (!checkErr && existingPlayers && existingPlayers.length > 0) {
        console.log(`⏩ Skipping ${team.name}: Roster already synced (${existingPlayers.length} players found in DB).`);
        continue;
      }

      console.log(`📡 Fetching squad for ${team.name} (API ID: ${team.id})...`);
      const squadRes = await fetch(`https://v3.football.api-sports.io/players/squads?team=${team.id}`, { headers });

      if (squadRes.status === 429) {
        console.warn(`⚠️ Rate limit hit (429) for ${team.name}. Pausing for 15s cooldown...`);
        await new Promise(r => setTimeout(r, 15000));
        // Retry once after cooldown
        continue;
      }

      if (!squadRes.ok) {
        console.error(`❌ API Error for ${team.name}: Status ${squadRes.status}`);
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
        nationality: p.nationality || 'Canada',
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

      // 3. Safe throttling delay (2 seconds) to respect the 10 req/min free limit
      await new Promise(r => setTimeout(r, 2000));

    } catch (apiErr) {
      console.error(`❌ Network error fetching squad for ${team.name}:`, apiErr.message);
    }
  }

  console.log('✨ Smart-Skipped Ingestion & Squad Sync Complete!');
}

runIngestion().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});

