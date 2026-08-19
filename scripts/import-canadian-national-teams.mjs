// scripts/import-canadian-national-teams.mjs
//
// Creates the Canada Men's/Women's National Team rows in `teams` (external_id
// nat-canmnt / nat-canwnt — these already exist in production but weren't
// reproducible from any committed script, per the Aug 18-19 audit) and links
// a representative senior squad to each via current_team_id.
//
// Safe to re-run: teams upsert on external_id, players upsert on external_id
// (the same slugified-name scheme every other script uses), so this UPDATES
// the 5 already-live stub rows (Bombito, K. Buchanan, Lacasse, Grosso,
// Gilles — currently league:'Abroad', goals/assists/rating all 0, no
// nationality) with real stats instead of duplicating them.
//
// Needs two env vars, set ONLY in your shell for this run — never
// committed, never NEXT_PUBLIC_:
//   SUPABASE_URL               — same value as NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY  — from Supabase dashboard: Settings > API
//                                 > service_role secret. Bypasses RLS —
//                                 only for trusted scripts run by hand.
//
// Run from Termux:
//   SUPABASE_URL="https://xxxx.supabase.co" SUPABASE_SERVICE_ROLE_KEY="..." node scripts/import-canadian-national-teams.mjs

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars. See the comment at the top of this file.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents (Moïse -> Moise)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const NATIONAL_TEAMS = [
  { external_id: 'nat-canmnt', name: "Canada Men's National Team", short_name: 'CANMNT', league: 'National Teams', gender: 'men', division_level: 'International', slug: 'canmnt' },
  { external_id: 'nat-canwnt', name: "Canada Women's National Team", short_name: 'CANWNT', league: 'National Teams', gender: 'women', division_level: 'International', slug: 'canwnt' },
];

// Representative senior squads — long-tenured regulars only, not a live
// call-up list (that needs real fixture-by-fixture roster data this site
// doesn't have a source for yet). goals/assists/rating are illustrative,
// same "reasonable placeholder, clearly not live-synced" spirit as every
// other manually-curated list in this repo.
const SQUADS = {
  men: [
    { name: 'Jonathan David', position: 'ST', nationality: 'Canada', goals: 30, assists: 6, rating: 8.4 },
    { name: 'Alphonso Davies', position: 'LB', nationality: 'Canada', goals: 15, assists: 18, rating: 8.1 },
    { name: 'Alistair Johnston', position: 'RB', nationality: 'Canada', goals: 2, assists: 6, rating: 7.9 },
    { name: 'Tajon Buchanan', position: 'RW', nationality: 'Canada', goals: 8, assists: 5, rating: 7.8 },
    { name: 'Stephen Eustáquio', position: 'CM', nationality: 'Canada', goals: 5, assists: 11, rating: 7.8 },
    { name: 'Ismaël Koné', position: 'CM', nationality: 'Canada', goals: 3, assists: 4, rating: 7.7 },
    { name: 'Moïse Bombito', position: 'CB', nationality: 'Canada', goals: 1, assists: 0, rating: 7.4 },
    { name: 'Cyle Larin', position: 'ST', nationality: 'Canada', goals: 11, assists: 2, rating: 7.3 },
    { name: 'Jacob Shaffelburg', position: 'LW', nationality: 'Canada', goals: 4, assists: 5, rating: 7.2 },
    { name: 'Maxime Crépeau', position: 'GK', nationality: 'Canada', goals: 0, assists: 0, rating: 7.1 },
  ],
  women: [
    { name: 'Kadeisha Buchanan', position: 'CB', nationality: 'Canada', goals: 0, assists: 1, rating: 7.9 },
    { name: 'Jessie Fleming', position: 'CM', nationality: 'Canada', goals: 4, assists: 7, rating: 8.0 },
    { name: 'Vanessa Gilles', position: 'CB', nationality: 'Canada', goals: 1, assists: 0, rating: 7.6 },
    { name: 'Julia Grosso', position: 'CM', nationality: 'Canada', goals: 2, assists: 3, rating: 7.5 },
    { name: 'Cloé Lacasse', position: 'LW', nationality: 'Canada', goals: 6, assists: 2, rating: 7.7 },
    { name: 'Evelyne Viens', position: 'ST', nationality: 'Canada', goals: 5, assists: 1, rating: 7.4 },
    { name: 'Jordyn Huitema', position: 'ST', nationality: 'Canada', goals: 3, assists: 2, rating: 7.3 },
    { name: 'Adriana Leon', position: 'RW', nationality: 'Canada', goals: 2, assists: 4, rating: 7.2 },
    { name: 'Olivia Smith', position: 'LW', nationality: 'Canada', goals: 3, assists: 1, rating: 7.3 },
    { name: 'Kailen Sheridan', position: 'GK', nationality: 'Canada', goals: 0, assists: 0, rating: 7.5 },
  ],
};

async function run() {
  console.log('Upserting Canada Men\'s/Women\'s National Team rows...');
  for (const team of NATIONAL_TEAMS) {
    const { error } = await supabase.from('teams').upsert(team, { onConflict: 'external_id' });
    if (error) {
      console.error(`Failed to upsert team ${team.name}:`, error.message);
    } else {
      console.log(`Upserted team: ${team.name}`);
    }
  }

  const { data: dbTeams, error: fetchTeamError } = await supabase
    .from('teams')
    .select('id, external_id')
    .in('external_id', ['nat-canmnt', 'nat-canwnt']);

  if (fetchTeamError || !dbTeams) {
    console.error('Failed to fetch national team IDs:', fetchTeamError);
    return;
  }

  const teamIdByExternalId = {};
  dbTeams.forEach((t) => { teamIdByExternalId[t.external_id] = t.id; });

  const genderToTeamExternalId = { men: 'nat-canmnt', women: 'nat-canwnt' };

  console.log('Upserting national team squads...');
  let totalUpserted = 0;
  for (const [gender, squad] of Object.entries(SQUADS)) {
    const targetTeamId = teamIdByExternalId[genderToTeamExternalId[gender]];
    if (!targetTeamId) {
      console.error(`No team row found for gender ${gender}, skipping squad.`);
      continue;
    }

    const roster = squad.map((p) => {
      const slug = slugify(p.name);
      return {
        external_id: slug,
        slug,
        name: p.name,
        position: p.position,
        league: 'National Teams',
        gender,
        nationality: p.nationality,
        current_team_id: targetTeamId,
        goals: p.goals,
        assists: p.assists,
        rating: p.rating,
      };
    });

    const { data: inserted, error: upsertError } = await supabase
      .from('players')
      .upsert(roster, { onConflict: 'external_id' })
      .select();

    if (upsertError) {
      console.error(`Failed to upsert ${gender} squad:`, upsertError.message);
    } else {
      totalUpserted += inserted?.length || 0;
      console.log(`Upserted ${inserted?.length || 0} players for ${gender === 'men' ? 'CANMNT' : 'CANWNT'}.`);
    }
  }

  console.log(`Done. ${totalUpserted} national team players upserted.`);
}

run().catch((err) => {
  console.error('National teams import failed:', err.message);
  process.exit(1);
});
