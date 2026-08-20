import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const API_KEY = process.env.APIFOOTBALL_KEY || process.env.RAPIDAPI_KEY;
const API_HOST = process.env.APIFOOTBALL_HOST || 'v3.football.api-sports.io';

if (!SERVICE_ROLE_KEY || !API_KEY) {
  console.error('Error: Missing SERVICE_ROLE_KEY or APIFOOTBALL_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const API_HEADERS = { 'x-apisports-key': API_KEY };
const BASE_URL = `https://${API_HOST}`;

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

const CANADIAN_LEAGUES = ['CPL', 'NSL', 'MLS'];

async function runImportSequence() {
  console.log('Fetching Canadian teams from Supabase...');
  const { data: dbTeams } = await supabase
    .from('teams')
    .select('id, external_id, name, league')
    .in('league', CANADIAN_LEAGUES);

  if (!dbTeams || dbTeams.length === 0) {
    console.log('No Canadian teams found in Supabase.');
    return;
  }

  console.log(`Processing squads for ${dbTeams.length} Canadian teams with Smart Sync...`);

  // Fetch existing players to compare and prevent redundant writes
  const { data: existingPlayers } = await supabase
    .from('players')
    .select('external_id, name, position, nationality');

  const existingMap = new Map();
  (existingPlayers || []).forEach((p) => existingMap.set(p.external_id, p));

  let totalPlayersUpserted = 0;

  for (const team of dbTeams) {
    if (!team.external_id || isNaN(Number(team.external_id))) continue;

    console.log(`Fetching squad for ${team.name} (API ID: ${team.external_id})...`);
    const squadRes = await fetchFromApiFootball(`/players/squads?team=${team.external_id}`);

    if (squadRes && squadRes.length > 0 && squadRes[0].players) {
      const rowsToUpsert = [];

      for (const p of squadRes[0].players) {
        const extId = `${slugify(p.name)}-${p.id || Math.floor(Math.random() * 10000)}`;
        const incomingData = {
          external_id: extId,
          name: p.name,
          league: team.league || 'Domestic',
          gender: team.league === 'NSL' ? 'women' : 'men',
          position: p.position || 'CM',
          current_team_id: team.id,
          nationality: p.nationality || 'Canada',
        };

        const existing = existingMap.get(extId);
        if (existing) {
          // Smart Sync: Skip write if data is completely unchanged
          if (
            existing.name === incomingData.name &&
            existing.position === incomingData.position &&
            existing.nationality === incomingData.nationality
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
          console.error(`Error upserting roster for ${team.name}:`, error.message);
        } else {
          totalPlayersUpserted += inserted?.length || 0;
        }
      } else {
        console.log(`No changes detected for ${team.name} squad. Skipping write.`);
      }
    }

    await sleep(6000); // Respect API-Football rate limit
  }

  console.log(`Successfully smart-synced player profiles. Total updated/inserted: ${totalPlayersUpserted}`);
}

runImportSequence();
