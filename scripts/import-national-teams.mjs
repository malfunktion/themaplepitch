// scripts/import-teams-abroad.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function importTeamsAbroad() {
  console.log('Importing Global Clubs (Teams Abroad)...');

  // 1. Define international clubs where Canadian stars play
  const globalClubs = [
    {
      external_id: 'club-bayern-munich',
      name: 'Bayern Munich',
      short_name: 'BAY',
      league: 'Abroad',
      division_level: 'International',
      slug: 'bayern-munich',
    },
    {
      external_id: 'club-lille-osc',
      name: 'Lille OSC',
      short_name: 'LIL',
      league: 'Abroad',
      division_level: 'International',
      slug: 'lille-osc',
    },
    {
      external_id: 'club-fc-porto',
      name: 'FC Porto',
      short_name: 'POR',
      league: 'Abroad',
      division_level: 'International',
      slug: 'fc-porto',
    },
    {
      external_id: 'club-villarreal',
      name: 'Villarreal',
      short_name: 'VIL',
      league: 'Abroad',
      division_level: 'International',
      slug: 'villarreal',
    },
    {
      external_id: 'club-marseille',
      name: 'Marseille',
      short_name: 'OM',
      league: 'Abroad',
      division_level: 'International',
      slug: 'marseille',
    },
    {
      external_id: 'club-celtic-fc',
      name: 'Celtic FC',
      short_name: 'CEL',
      league: 'Abroad',
      division_level: 'International',
      slug: 'celtic-fc',
    },
  ];

  for (const club of globalClubs) {
    const { error } = await supabase.from('teams').upsert(club, { onConflict: 'external_id' });
    if (error) {
      console.error(`Failed to upsert club ${club.name}:`, error.message);
    } else {
      console.log(`Successfully upserted global club: ${club.name}`);
    }
  }

  // 2. Fetch updated team map to retrieve generated club IDs
  const { data: dbTeams, error: fetchTeamError } = await supabase
    .from('teams')
    .select('id, name, external_id');

  if (fetchTeamError || !dbTeams) {
    console.error('Failed to fetch team map:', fetchTeamError);
    return;
  }

  const clubMap = {};
  dbTeams.forEach((t) => {
    clubMap[t.name] = t.id;
  });

  // 3. Players Abroad dataset mapping to their respective everyday clubs
  const playersAbroad = [
    { name: 'Alphonso Davies', position: 'LB', league: 'Abroad', gender: 'men', clubName: 'Bayern Munich', goals: 15, assists: 18, rating: 8.1 },
    { name: 'Jonathan David', position: 'ST', league: 'Abroad', gender: 'men', clubName: 'Lille OSC', goals: 30, assists: 6, rating: 8.4 },
    { name: 'Stephen Eustáquio', position: 'CM', league: 'Abroad', gender: 'men', clubName: 'FC Porto', goals: 5, assists: 11, rating: 7.8 },
    { name: 'Tajon Buchanan', position: 'RW', league: 'Abroad', gender: 'men', clubName: 'Villarreal', goals: 8, assists: 5, rating: 7.8 },
    { name: 'Ismaël Koné', position: 'CM', league: 'Abroad', gender: 'men', clubName: 'Marseille', goals: 3, assists: 4, rating: 7.7 },
    { name: 'Alistair Johnston', position: 'RB', league: 'Abroad', gender: 'men', clubName: 'Celtic FC', goals: 2, assists: 6, rating: 7.9 },
  ];

  console.log('Linking players abroad to their global club profiles...');

  for (const player of playersAbroad) {
    const playerSlug = slugify(player.name);
    const targetTeamId = clubMap[player.clubName];

    const playerPayload = {
      external_id: playerSlug,
      slug: playerSlug,
      name: player.name,
      position: player.position,
      league: player.league,
      gender: player.gender,
      team_id: targetTeamId || null,
      goals: player.goals,
      assists: player.assists,
      rating: player.rating,
    };

    const { error: upsertError } = await supabase
      .from('players')
      .upsert(playerPayload, { onConflict: 'external_id' });

    if (upsertError) {
      console.error(`Failed to sync player ${player.name}:`, upsertError.message);
    } else {
      console.log(`Successfully linked: ${player.name} → Club: ${player.clubName} (Team ID: ${targetTeamId || 'Unlinked'})`);
    }
  }

  console.log('Teams Abroad import and player club linking completed successfully!');
}

importTeamsAbroad().catch((err) => {
  console.error('Teams abroad import failed:', err.message);
  process.exit(1);
});
