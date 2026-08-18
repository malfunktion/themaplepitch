// scripts/import-national-teams.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const THESPORTSDB_KEY = process.env.THESPORTSDB_KEY || '5c5b3e3c9a98dd5a09969018da39aa37';

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

async function importNationalTeams() {
  console.log('Importing Canadian National Teams...');

  // 1. Upsert National Teams into the teams table
  const nationalTeams = [
    {
      external_id: 'nat-canmnt',
      team_name: 'Canada Men\'s National Team',
      short_name: 'CanMNT',
      league: 'National Teams',
      gender: 'men',
      division_level: 'International',
      slug: 'canmnt',
    },
    {
      external_id: 'nat-canwnt',
      team_name: 'Canada Women\'s National Team',
      short_name: 'CanWNT',
      league: 'National Teams',
      gender: 'women',
      division_level: 'International',
      slug: 'canwnt',
    },
  ];

  for (const team of nationalTeams) {
    const { error } = await supabase.from('teams').upsert(team, { onConflict: 'external_id' });
    if (error) {
      console.error(`Failed to upsert team ${team.team_name}:`, error.message);
    } else {
      console.log(`Successfully upserted: ${team.team_name}`);
    }
  }

  // 2. Fetch team IDs from Supabase
  const { data: dbTeams, error: fetchTeamError } = await supabase
    .from('teams')
    .select('id, short_name, external_id');

  if (fetchTeamError || !dbTeams) {
    console.error('Failed to fetch team map:', fetchTeamError);
    return;
  }

  const teamMap = {};
  dbTeams.forEach((t) => {
    teamMap[t.short_name] = t.id;
  });

  // 3. Core National Team Players to Sync & Link
  const nationalPool = [
    // CanMNT
    { name: 'Alphonso Davies', position: 'LB', league: 'Abroad', gender: 'men', teamKey: 'CanMNT', caps: 55, goals: 15 },
    { name: 'Jonathan David', position: 'ST', league: 'Abroad', gender: 'men', teamKey: 'CanMNT', caps: 54, goals: 30 },
    { name: 'Stephen Eustáquio', position: 'CM', league: 'Abroad', gender: 'men', teamKey: 'CanMNT', caps: 42, goals: 5 },
    { name: 'Tajon Buchanan', position: 'RW', league: 'Abroad', gender: 'men', teamKey: 'CanMNT', caps: 40, goals: 8 },
    { name: 'Ismaël Koné', position: 'CM', league: 'Abroad', gender: 'men', teamKey: 'CanMNT', caps: 26, goals: 3 },
    { name: 'Alistair Johnston', position: 'RB', league: 'Abroad', gender: 'men', teamKey: 'CanMNT', caps: 48, goals: 2 },
    { name: 'Moïse Bombito', position: 'CB', league: 'Abroad', gender: 'men', teamKey: 'CanMNT', caps: 18, goals: 1 },

    // CanWNT
    { name: 'Jessie Fleming', position: 'CM', league: 'Abroad', gender: 'women', teamKey: 'CanWNT', caps: 130, goals: 30 },
    { name: 'Kadeisha Buchanan', position: 'CB', league: 'Abroad', gender: 'women', teamKey: 'CanWNT', caps: 130, goals: 5 },
    { name: 'Cloé Lacasse', position: 'LW', league: 'Abroad', gender: 'women', teamKey: 'CanWNT', caps: 55, goals: 20 },
    { name: 'Julia Grosso', position: 'CM', league: 'Abroad', gender: 'women', teamKey: 'CanWNT', caps: 60, goals: 8 },
    { name: 'Evelyne Viens', position: 'ST', league: 'NSL', gender: 'women', teamKey: 'CanWNT', caps: 45, goals: 12 },
    { name: 'Vanessa Gilles', position: 'CB', league: 'NSL', gender: 'women', teamKey: 'CanWNT', caps: 45, goals: 4 },
  ];

  console.log('Linking national team player profiles...');

  for (const player of nationalPool) {
    const playerSlug = slugify(player.name);
    const targetTeamId = teamMap[player.teamKey];

    // Check if player already exists in the database
    const { data: existingPlayer } = await supabase
      .from('players')
      .select('id, metadata')
      .eq('external_id', playerSlug)
      .single();

    const metadataPayload = {
      national_team: player.teamKey,
      caps: player.caps,
      international_goals: player.goals,
    };

    if (existingPlayer) {
      // Update existing profile with national team link without duplication
      const { error: updateError } = await supabase
        .from('players')
        .update({
          team_id: targetTeamId,
          metadata: metadataPayload,
        })
        .eq('id', existingPlayer.id);

      if (updateError) {
        console.error(`Failed to link player ${player.name}:`, updateError.message);
      } else {
        console.log(`Linked existing profile: ${player.name} → ${player.teamKey}`);
      }
    } else {
      // Insert new profile if not already present
      const { error: insertError } = await supabase.from('players').insert({
        external_id: playerSlug,
        slug: playerSlug,
        name: player.name,
        position: player.position,
        league: player.league,
        gender: player.gender,
        team_id: targetTeamId,
        metadata: metadataPayload,
      });

      if (insertError) {
        console.error(`Failed to insert player ${player.name}:`, insertError.message);
      } else {
        console.log(`Created & linked new profile: ${player.name} → ${player.teamKey}`);
      }
    }
  }

  console.log('National teams import and profile linking completed successfully!');
}

importNationalTeams().catch((err) => {
  console.error('National team import failed:', err.message);
  process.exit(1);
});
