import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;

// Default to free key '3' if key is missing or invalid
let TSDB_KEY = process.env.THESPORTSDB_KEY || '3';
if (TSDB_KEY.length > 10) {
  TSDB_KEY = '3';
}

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables (SUPABASE_URL or SERVICE_ROLE_KEY).');
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

const LEAGUES_TO_IMPORT = [
  { name: 'Canadian Premier League', code: 'CPL', gender: 'men' },
  { name: 'Northern Super League', code: 'NSL', gender: 'women' },
  { name: 'Canadian Championship', code: 'CanChamp', gender: 'men' },
  { name: 'Major League Soccer', code: 'MLS', gender: 'men' },
  { name: 'National Womens Soccer League', code: 'NWSL', gender: 'women' }
];

async function fetchTeamsForLeague(leagueObj) {
  console.log(`🔍 Fetching team profiles & assets for ${leagueObj.name}...`);
  const url = `https://www.thesportsdb.com/api/v1/json/${TSDB_KEY}/search_all_teams.php?l=${encodeURIComponent(leagueObj.name)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`⚠️ TheSportsDB returned status ${res.status} for ${leagueObj.name}.`);
      return;
    }
    const data = await res.json();

    if (!data || !data.teams) {
      console.warn(`ℹ️ No team records found for ${leagueObj.name}.`);
      return;
    }

    let count = 0;
    for (const t of data.teams) {
      if ((leagueObj.code === 'MLS' || leagueObj.code === 'NWSL') && t.strCountry !== 'Canada') {
        continue;
      }

      const slug = slugify(t.strTeam);
      const externalId = `tsdb-${t.idTeam || slug}`;

      const payload = {
        external_id: externalId,
        slug: slug,
        name: t.strTeam,
        short_name: t.strTeamShort || null,
        league: leagueObj.code,
        competition: leagueObj.code,
        gender: leagueObj.gender,
        logo_url: t.strBadge || t.strLogo || null,
        venue: t.strStadium || null,
        city: t.strLocation || null
      };

      const { error } = await supabase
        .from('teams')
        .upsert(payload, { onConflict: 'external_id' });

      if (error) {
        console.error(`⚠️ Error syncing ${t.strTeam}:`, error.message);
      } else {
        count++;
      }
    }

    console.log(`✅ Synced ${count} official team profiles for ${leagueObj.name}`);
  } catch (err) {
    console.error(`❌ Failed fetching ${leagueObj.name}:`, err.message);
  }
}

async function run() {
  console.log(`🚀 Starting TheSportsDB Ingestion Pipeline (Key: ${TSDB_KEY})...`);
  for (const league of LEAGUES_TO_IMPORT) {
    await fetchTeamsForLeague(league);
  }
  console.log('✨ TheSportsDB Ingestion Complete!\n');
}

run().catch(err => {
  console.error('❌ Fatal Pipeline Error:', err);
  process.exit(1);
});
