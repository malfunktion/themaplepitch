import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY;
const APIF_KEY = process.env.APIF_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !APIF_KEY) {
  console.error('❌ Missing SUPABASE_URL, SERVICE_ROLE_KEY, or APIF_KEY.');
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

const VERIFIED_CANADIAN_API_TEAMS = [
  // CPL Clubs (API-Football IDs)
  { id: 15121, name: 'Forge FC', league: 'CPL' },
  { id: 15122, name: 'Cavalry FC', league: 'CPL' },
  { id: 15123, name: 'Atlético Ottawa', league: 'CPL' },
  { id: 15124, name: 'Pacific FC', league: 'CPL' },
  { id: 15125, name: 'York United FC', league: 'CPL' },
  { id: 15126, name: 'Valour FC', league: 'CPL' },
  { id: 15127, name: 'HFX Wanderers FC', league: 'CPL' },
  { id: 15128, name: 'Vancouver FC', league: 'CPL' },
  // Canadian MLS Clubs
  { id: 1603, name: 'Toronto FC', league: 'MLS' },
  { id: 1614, name: 'CF Montréal', league: 'MLS' },
  { id: 1601, name: 'Vancouver Whitecaps FC', league: 'MLS' }
];

async function runIngestion() {
  console.log('🚀 Starting Scope-Locked API-Football & Squad Ingestion...');

  for (const team of VERIFIED_CANADIAN_API_TEAMS) {
    try {
      // 1. Look up the internal team ID from Supabase using the team name
      const { data: dbTeam, error: teamErr } = await supabase
        .from('teams')
        .select('id')
        .ilike('name', team.name)
        .maybeSingle();

      if (teamErr || !dbTeam) {
        console.warn(`⚠️ Could not find database record for team: ${team.name}`);
        continue;
      }

      // 2. Fetch squad data from API-Football
      const squadRes = await fetch(`https://v3.football.api-sports.io/players/squads?team=${team.id}`, {
        headers: { 'x-apisports-key': APIF_KEY }
      });

      if (squadRes.status === 429) {
        console.warn(`⚠️ Rate limit hit (429) for ${team.name}. Pausing for cooldown...`);
        await new Promise(r => setTimeout(r, 6000));
        continue;
      }

      if (!squadRes.ok) {
        console.warn(`⚠️ Failed to fetch squad for ${team.name}: HTTP ${squadRes.status}`);
        continue;
      }

      const squadData = await squadRes.json();
      const playersList = squadData?.response?.[0]?.players || [];

      if (playersList.length === 0) {
        console.log(`ℹ️ No players found via API for ${team.name}.`);
        continue;
      }

      // 3. Map players payload
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

      // 4. Upsert players into Supabase safely
      const { error: playerErr } = await supabase
        .from('players')
        .upsert(playerPayloads, { onConflict: 'external_id' });

      if (playerErr) {
        console.error(`⚠️ Error syncing roster for ${team.name}:`, playerErr.message);
      } else {
        console.log(`👤 Successfully synced ${playerPayloads.length} players for ${team.name}`);
      }

      // 5. Throttling delay between requests to protect daily limits
      await new Promise(r => setTimeout(r, 500));

    } catch (err) {
      console.error(`❌ Network error processing ${team.name}:`, err.message);
    }
  }

  console.log('✨ Scope-Locked Ingestion & Squad Sync Complete!');
}

runIngestion().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
