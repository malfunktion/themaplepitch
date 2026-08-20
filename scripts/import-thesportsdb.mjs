import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co';
const activeServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const THESPORTSDB_KEY = process.env.THESPORTSDB_KEY || '1'; 

if (!activeServiceKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is missing.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, activeServiceKey);

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

async function smartSyncMatches(incomingMatches) {
  if (!incomingMatches || incomingMatches.length === 0) return;

  const { data: existingMatches, error: fetchError } = await supabase
    .from('matches')
    .select('id, external_id, home_score, away_score, status');

  if (fetchError) {
    console.error('Error fetching existing matches for smart sync:', fetchError.message);
    return;
  }

  const existingMap = new Map();
  (existingMatches || []).forEach((m) => existingMap.set(m.external_id, m));

  const matchesToUpsert = [];
  let protectedCount = 0;

  for (const incoming of incomingMatches) {
    const existing = existingMap.get(incoming.external_id);

    if (existing) {
      const existingHasScore = existing.home_score !== null && existing.away_score !== null;
      const incomingHasScore = incoming.home_score !== null && incoming.away_score !== null;

      if (existingHasScore && !incomingHasScore) {
        incoming.home_score = existing.home_score;
        incoming.away_score = existing.away_score;
        incoming.status = existing.status;
        protectedCount++;
      }
    }

    matchesToUpsert.push(incoming);
  }

  const { data, error } = await supabase
    .from('matches')
    .upsert(matchesToUpsert, { onConflict: 'external_id' })
    .select('id');

  if (error) {
    console.error('Error during smart match sync:', error.message);
  } else {
    console.log(`Smart Sync updated/preserved ${data?.length || matchesToUpsert.length} matches (Protected ${protectedCount} finished scores).`);
  }
}

async function runTheSportsDbImport() {
  console.log('Fetching match events from TheSportsDB...');
  
  // Using English Premier League ID (4328) as a safe free-tier test, with format '2025-2026'
  const leagueId = '4328'; 
  const season = '2025-2026';
  const url = `https://www.thesportsdb.com/api/v1/json/${THESPORTSDB_KEY}/eventsseason.php?id=${leagueId}&s=${season}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`TheSportsDB returned status ${res.status}. Free-tier limits may apply. Skipping gracefully.`);
      return;
    }

    const data = await res.json();
    if (!data.events) {
      console.log('No events returned from TheSportsDB.');
      return;
    }

    const incomingMatches = data.events.map((event) => {
      const homeTeam = event.strHomeTeam || 'Home Team';
      const awayTeam = event.strAwayTeam || 'Away Team';
      const matchDate = event.dateEvent || new Date().toISOString().split('T')[0];
      
      return {
        external_id: slugify(`${matchDate}-${homeTeam}-${awayTeam}`),
        match_date: matchDate,
        home_score: event.intHomeScore !== null && event.intHomeScore !== '' ? Number(event.intHomeScore) : null,
        away_score: event.intAwayScore !== null && event.intAwayScore !== '' ? Number(event.intAwayScore) : null,
        status: event.strStatus || 'Scheduled',
        competition: 'Premier League',
        gender: 'men'
      };
    });

    await smartSyncMatches(incomingMatches);
  } catch (err) {
    console.warn('TheSportsDB import skipped due to network/API restriction:', err.message);
  }
}

runTheSportsDbImport();
