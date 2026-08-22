// scripts/ingest-thesportsdb.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
let TSDB_KEY = process.env.THESPORTSDB_KEY || process.env.TSDB_KEY || process.env.APIF_KEY || '123';

if (TSDB_KEY.length > 10 && TSDB_KEY !== '123') {
  TSDB_KEY = '123';
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

const TEAM_NAME_OVERRIDES = {
  'york united': 'Inter Toronto FC',
  'york united fc': 'Inter Toronto FC',
  'york9': 'Inter Toronto FC',
  'york9 fc': 'Inter Toronto FC',
};

function normalizeTeamName(name) {
  if (!name) return '';
  const trimmed = name.trim().toLowerCase();
  return TEAM_NAME_OVERRIDES[trimmed] || name.trim();
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

    const { data: existingTeams } = await supabase
      .from('teams')
      .select('id, name, slug, logo_url, venue, city, short_name');

    const existingMap = new Map();
    (existingTeams || []).forEach(team => existingMap.set(team.slug, team));

    let updatedCount = 0;
    let skippedCount = 0;

    for (const t of data.teams) {
      // Keep strict Canadian filter for MLS
      if (leagueObj.code === 'MLS' && t.strCountry !== 'Canada') {
        continue;
      }
      
      // Whitelist specific NWSL teams housing Canadian expats
      const NWSL_WHITELIST = [
        'Portland Thorns FC', 
        'San Diego Wave FC', 
        'Seattle Reign FC', 
        'Racing Louisville FC', 
        'Washington Spirit', 
        'North Carolina Courage', 
        'Chicago Red Stars'
      ];
      
      if (leagueObj.code === 'NWSL' && !NWSL_WHITELIST.includes(t.strTeam)) {
        continue;
      }

      const displayName = normalizeTeamName(t.strTeam);
      const slug = slugify(displayName);
      // external_id is the shared cross-script identity now (see the
      // matching comment in ingest-apifootball.mjs for why) — was
      // `tsdb-${t.idTeam}`, a scheme unique to this script that collided
      // with the other two ingest scripts' own external_id schemes on
      // the same row. TheSportsDB's own team ID still gets kept, in its
      // dedicated tsdb_id column instead.
      const externalId = slug;
      const tsdbId = t.idTeam || null;
      const newLogo = t.strBadge || t.strLogo || null;
      const newVenue = t.strStadium || null;
      const newCity = t.strLocation || null;

      const existing = existingMap.get(slug);

      if (existing) {
        const isIdentical =
          existing.name === displayName &&
          (existing.logo_url === newLogo || (!newLogo && existing.logo_url)) &&
          (existing.venue === newVenue || (!newVenue && existing.venue)) &&
          (existing.city === newCity || (!newCity && existing.city));

        if (isIdentical) {
          skippedCount++;
          continue;
        }
      }

      const payload = {
        external_id: externalId,
        tsdb_id: tsdbId,
        slug: slug,
        name: displayName,
        short_name: t.strTeamShort || existing?.short_name || null,
        league: leagueObj.code,
        competition: leagueObj.code,
        gender: leagueObj.gender,
        logo_url: newLogo || existing?.logo_url || null,
        venue: newVenue || existing?.venue || null,
        city: newCity || existing?.city || null
      };

      const { error } = await supabase
        .from('teams')
        .upsert(payload, { onConflict: 'slug' });

      if (error) {
        console.error(`⚠️ Error syncing ${displayName}:`, error.message);
      } else {
        updatedCount++;
      }
    }

    console.log(`✅ Synced ${updatedCount} team updates for ${leagueObj.name} (${skippedCount} already up-to-date)`);

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
