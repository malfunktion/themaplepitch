// scripts/import-real-api.mjs
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APIF_KEY = process.env.APIF_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !APIF_KEY) {
  console.error('❌ Missing environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-');
}

// NOTE: API-Football free tier requires historical seasons (2022–2024)
const LEAGUES_TO_FETCH = [
  { id: 659, name: 'CPL', season: 2024 },
  { id: 494, name: 'Canadian Championship', season: 2024 }
];

async function fetchRealApiData() {
  console.log('📡 Connecting to API-Football with robust headers...');

  const headers = {
    'x-apisports-key': APIF_KEY,
    'Accept-Encoding': 'identity', // Bypasses Termux gunzip stream crash
    'User-Agent': 'TheMaplePitch-ScoutTerminal/1.0',
    'Accept': 'application/json'
  };

  for (const league of LEAGUES_TO_FETCH) {
    console.log(`🔍 Fetching teams for ${league.name} (ID: ${league.id}, Season: ${league.season})...`);
    
    try {
      const res = await fetch(`https://v3.football.api-sports.io/teams?league=${league.id}&season=${league.season}`, { headers });
      const data = await res.json();

      if (!data.response || data.response.length === 0) {
        console.log(`⚠️ No teams returned for ${league.name}. Response:`, JSON.stringify(data));
        continue;
      }

      for (const item of data.response) {
        const team = item.team;
        console.log(`🛡️ Processing club: ${team.name}`);

        const { data: savedTeam, error: teamErr } = await supabase
          .from('teams')
          .upsert({
            external_id: String(team.id),
            slug: slugify(team.name),
            name: team.name,
            league: league.name,
            logo_url: team.logo
          }, { onConflict: 'external_id' })
          .select('id')
          .single();

        if (teamErr) {
          console.error(`❌ Failed to save team ${team.name}:`, teamErr.message);
          continue;
        }

        const teamId = savedTeam?.id;

        // Fetch squad list
        const squadRes = await fetch(`https://v3.football.api-sports.io/players/squads?team=${team.id}`, { headers });
        const squadData = await squadRes.json();

        if (squadData.response && squadData.response.length > 0) {
          const playersList = squadData.response[0].players || [];
          console.log(`👤 Syncing ${playersList.length} real players for ${team.name}...`);

          const playerPayloads = playersList.map(p => ({
            external_id: String(p.id),
            slug: slugify(p.name),
            name: p.name,
            position: p.position || 'MID',
            gender: 'men',
            team_id: teamId,
            league: league.name,
            avatar_url: p.photo, // Captured so media vault can sync headshots
            rating: 7.2
          }));

          const { error: playerErr } = await supabase
            .from('players')
            .upsert(playerPayloads, { onConflict: 'external_id' });

          if (playerErr) {
            console.error(`⚠️ Error syncing players for ${team.name}:`, playerErr.message);
          } else {
            console.log(`✅ Successfully locked real roster for ${team.name}`);
          }
        }
      }
    } catch (apiErr) {
      console.error(`❌ Network or API error on league ${league.name}:`, apiErr.message);
    }
  }

  console.log('🎉 Real API Ingestion Complete!');
}

fetchRealApiData().catch(err => {
  console.error('❌ Fatal script failure:', err);
  process.exit(1);
});
