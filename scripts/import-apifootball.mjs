import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const API_KEY = process.env.APIF_KEY || process.env.APIFOOTBALL_KEY || process.env.RAPIDAPI_KEY;
const API_HOST = process.env.APIFOOTBALL_HOST || 'v3.football.api-sports.io';

if (!SERVICE_ROLE_KEY || !API_KEY) {
  console.error('Error: Missing required environment variables (SUPABASE_SERVICE_ROLE_KEY/SERVICE_ROLE_KEY or APIF_KEY/APIFOOTBALL_KEY).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const API_HEADERS = { 'x-apisports-key': API_KEY };
const BASE_URL = `https://${API_HOST}`;

// API-Football numeric team ID map for Canadian clubs
const API_FOOTBALL_TEAM_MAP = {
  // MLS
  'toronto-fc': 1603,
  'cf-montreal': 1614,
  'montreal': 1614,
  'vancouver-whitecaps': 1601,
  'vancouver-whitecaps-fc': 1601,
  
  // CPL
  'forge-fc': 15123,
  'cavalry-fc': 15121,
  'pacific-fc': 15124,
  'york-united-fc': 15125,
  'inter-toronto-fc': 15125,
  'valour-fc': 15126,
  'hfx-wanderers-fc': 15122,
  'vancouver-fc': 20265,
  'atletico-ottawa': 16666,
};

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function normalizePosition(pos) {
  if (!pos) return 'CM';
  const p = pos.toUpperCase();
  if (p.includes('GOAL') || p === 'G') return 'GK';
  if (p.includes('DEFEN') || p === 'D') return 'DF';
  if (p.includes('MID') || p === 'M') return 'MF';
  if (p.includes('ATTAC') || p.includes('FORW') || p === 'F' || p === 'ST') return 'FW';
  return pos;
}

async function fetchFromApiFootball(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, { headers: API_HEADERS });
    if (!res.ok) {
      console.warn(`API-Football ${res.status} on ${endpoint}`);
      return null;
    }
    const data = await res.json();
    return data.response || null;
  } catch (err) {
    console.error(`Fetch error on ${endpoint}:`, err.message);
    return null;
  }
}

const CANADIAN_LEAGUES = ['CPL', 'NSL', 'MLS'];

async function runImportSequence() {
  console.log('Fetching Canadian teams from Supabase...');
  const { data: dbTeams, error: teamsError } = await supabase
    .from('teams')
    .select('id, external_id, name, league, slug')
    .in('league', CANADIAN_LEAGUES);

  if (teamsError || !dbTeams || dbTeams.length === 0) {
    console.log('No Canadian teams found or query failed:', teamsError?.message);
    return;
  }

  console.log(`Processing squads for ${dbTeams.length} Canadian teams with Smart Sync...`);

  // Fetch existing players to compare and prevent redundant writes
  const { data: existingPlayers } = await supabase
    .from('players')
    .select('id, external_id, slug, name, position, nationality, current_team_id, team_id');

  const existingMap = new Map();
  (existingPlayers || []).forEach((p) => {
    if (p.external_id) existingMap.set(p.external_id, p);
    if (p.slug) existingMap.set(p.slug, p);
  });

  let totalPlayersUpserted = 0;

  for (const team of dbTeams) {
    const teamSlug = team.slug || slugify(team.name);
    
    // Resolve numeric API-Football team ID from external_id or fallback map
    let apiTeamId = null;
    if (team.external_id && !isNaN(Number(team.external_id))) {
      apiTeamId = Number(team.external_id);
    } else {
      apiTeamId = API_FOOTBALL_TEAM_MAP[teamSlug] || API_FOOTBALL_TEAM_MAP[slugify(team.name)];
    }

    if (!apiTeamId) {
      console.log(`⚠️ Skipping ${team.name}: No numeric API-Football team ID mapped.`);
      continue;
    }

    console.log(`Fetching squad for ${team.name} (API ID: ${apiTeamId})...`);
    const squadRes = await fetchFromApiFootball(`/players/squads?team=${apiTeamId}`);

    if (squadRes && squadRes.length > 0 && squadRes[0].players) {
      const rowsToUpsert = [];

      for (const p of squadRes[0].players) {
        const playerSlug = slugify(p.name);
        const extId = playerSlug;
        const normPos = normalizePosition(p.position);
        
        const incomingData = {
          external_id: extId,
          slug: playerSlug,
          name: p.name,
          league: team.league || 'Domestic',
          gender: team.league === 'NSL' ? 'women' : 'men',
          position: normPos,
          current_team_id: team.id,
          team_id: team.id,
          nationality: p.nationality || 'Canada',
        };

        const existing = existingMap.get(extId) || existingMap.get(playerSlug);
        if (existing) {
          // Smart Sync: Skip write if squad information is unchanged
          if (
            existing.name === incomingData.name &&
            existing.position === incomingData.position &&
            existing.nationality === incomingData.nationality &&
            (existing.team_id === team.id || existing.current_team_id === team.id)
          ) {
            continue; 
          }
        }

        rowsToUpsert.push(incomingData);
      }

      if (rowsToUpsert.length > 0) {
        const { data: inserted, error } = await supabase
          .from('players')
          .upsert(rowsToUpsert, { onConflict: 'external_id' })
          .select('id');

        if (error) {
          console.error(`❌ Error upserting roster for ${team.name}:`, error.message);
        } else {
          console.log(`✅ Synced ${inserted?.length || rowsToUpsert.length} players for ${team.name}`);
          totalPlayersUpserted += inserted?.length || rowsToUpsert.length;
        }
      } else {
        console.log(`ℹ️ No changes detected for ${team.name} squad. Skipping write.`);
      }
    }

    await sleep(6000); // 6-second delay to honor API-Football rate limits (10 req/min)
  }

  console.log(`🎉 Smart-synced player profiles complete. Total updated/inserted: ${totalPlayersUpserted}`);
}

runImportSequence();
