import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY;

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
  console.log('Importing Canadian National Teams & Squads with Smart Sync...');

  const nationalTeams = [
    { external_id: 'nat-canmnt', name: "Canada Men's National Team", short_name: 'CanMNT', league: 'National Teams', gender: 'men', division_level: 'International', slug: 'canmnt' },
    { external_id: 'nat-canwnt', name: "Canada Women's National Team", short_name: 'CanWNT', league: 'National Teams', gender: 'women', division_level: 'International', slug: 'canwnt' },
  ];

  for (const team of nationalTeams) {
    const { error } = await supabase.from('teams').upsert(team, { onConflict: 'external_id' });
    if (error) {
      console.error(`Failed to upsert team ${team.name}:`, error.message);
    }
  }

  const { data: dbTeams, error: fetchTeamError } = await supabase.from('teams').select('id, short_name');
  if (fetchTeamError) {
    console.error('Failed to fetch teams:', fetchTeamError.message);
    return;
  }

  const teamMap = {};
  dbTeams.forEach(t => {
    teamMap[t.short_name] = t.id;
  });

  const completeSquads = [
    // --- CANMNT ---
    { name: 'Alphonso Davies', position: 'LB', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', club: 'Bayern Munich', caps: 55, goals: 15, assists: 12, rating: 8.9 },
    { name: 'Jonathan David', position: 'ST', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', club: 'Lille OSC', caps: 54, goals: 29, assists: 8, rating: 8.8 },
    { name: 'Stephen Eustáquio', position: 'CM', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', club: 'FC Porto', caps: 42, goals: 5, assists: 6, rating: 8.3 },
    { name: 'Tajon Buchanan', position: 'RW', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', club: 'Villarreal', caps: 40, goals: 8, assists: 5, rating: 8.1 },
    { name: 'Ismaël Koné', position: 'CM', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', club: 'Marseille', caps: 26, goals: 3, assists: 4, rating: 8.0 },
    { name: 'Alistair Johnston', position: 'RB', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', club: 'Celtic FC', caps: 48, goals: 2, assists: 6, rating: 8.2 },
    { name: 'Moïse Bombito', position: 'CB', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', club: 'OGC Nice', caps: 18, goals: 1, assists: 0, rating: 7.9 },
    { name: 'Derek Cornelius', position: 'CB', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', club: 'Marseille', caps: 24, goals: 0, assists: 1, rating: 7.7 },
    { name: 'Maxime Crépeau', position: 'GK', league: 'MLS', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', club: 'Portland Timbers', caps: 22, goals: 0, assists: 0, rating: 7.8 },
    { name: 'Dayne St. Clair', position: 'GK', league: 'MLS', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', club: 'Minnesota United', caps: 6, goals: 0, assists: 0, rating: 7.4 },
    { name: 'Richie Laryea', position: 'RB', league: 'MLS', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', club: 'Toronto FC', caps: 50, goals: 3, assists: 7, rating: 7.6 },
    { name: 'Jonathan Osorio', position: 'CM', league: 'MLS', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', club: 'Toronto FC', caps: 75, goals: 9, assists: 11, rating: 7.7 },
    { name: 'Ali Ahmed', position: 'LM', league: 'MLS', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', club: 'Vancouver Whitecaps', caps: 8, goals: 0, assists: 2, rating: 7.3 },
    { name: 'Jacob Shaffelburg', position: 'LW', league: 'MLS', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', club: 'Nashville SC', caps: 16, goals: 3, assists: 4, rating: 7.6 },
    { name: 'Cyle Larin', position: 'ST', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', club: 'Mallorca', caps: 78, goals: 30, assists: 5, rating: 8.1 },
    // --- CANWNT ---
    { name: 'Jessie Fleming', position: 'CM', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', club: 'Portland Thorns FC', caps: 135, goals: 30, assists: 15, rating: 8.6 },
    { name: 'Kadeisha Buchanan', position: 'CB', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', club: 'Chelsea FC', caps: 154, goals: 5, assists: 2, rating: 8.5 },
    { name: 'Ashley Lawrence', position: 'FB', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', club: 'Chelsea FC', caps: 132, goals: 8, assists: 20, rating: 8.4 },
    { name: 'Kailen Sheridan', position: 'GK', league: 'NWSL', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', club: 'San Diego Wave', caps: 52, goals: 0, assists: 0, rating: 8.3 },
    { name: 'Janine Beckie', position: 'FW', league: 'NWSL', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', club: 'Utah Royals', caps: 105, goals: 35, assists: 12, rating: 8.2 },
    { name: 'Julia Grosso', position: 'CM', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', club: 'Chicago Red Stars', caps: 65, goals: 8, assists: 6, rating: 8.0 },
    { name: 'Cloé Lacasse', position: 'RW', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', club: 'Utah Royals', caps: 38, goals: 20, assists: 5, rating: 7.9 },
    { name: 'Evelyne Viens', position: 'ST', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', club: 'AS Roma', caps: 32, goals: 14, assists: 4, rating: 8.1 },
    { name: 'Vanessa Gilles', position: 'CB', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', club: 'Lyon', caps: 44, goals: 4, assists: 1, rating: 8.0 },
    { name: 'Shelina Zadorsky', position: 'CB', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', club: 'West Ham United', caps: 101, goals: 6, assists: 2, rating: 7.7 },
    { name: 'Jade Rose', position: 'CB', league: 'Collegiate', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', club: 'Harvard / CanWNT', caps: 22, goals: 1, assists: 2, rating: 7.8 }
  ];

  // Fetch existing records to compare stats/caps/goals before writing
  const { data: existingPlayers } = await supabase.from('players').select('external_id, caps, goals, assists');
  const existingMap = new Map();
  (existingPlayers || []).forEach(p => existingMap.set(p.external_id, p));

  const rowsToUpsert = [];
  let skippedUnchanged = 0;

  for (const p of completeSquads) {
    const extId = slugify(p.name);
    const incomingData = {
      external_id: extId,
      slug: extId,
      name: p.name,
      position: p.position,
      league: p.league,
      gender: p.gender,
      squad_type: p.squad_type,
      team_id: teamMap[p.national_team] || null,
      caps: p.caps,
      goals: p.goals,
      assists: p.assists,
      rating: p.rating,
    };

    const existing = existingMap.get(extId);
    if (existing) {
      // Smart Sync Check: Skip DB write if caps, goals, and assists are completely identical
      if (existing.caps === incomingData.caps && existing.goals === incomingData.goals && existing.assists === incomingData.assists) {
        skippedUnchanged++;
        continue;
      }
    }

    rowsToUpsert.push(incomingData);
  }

  if (rowsToUpsert.length > 0) {
    const { error: upsertError } = await supabase
      .from('players')
      .upsert(rowsToUpsert, { onConflict: 'external_id' });

    if (upsertError) {
      console.error('Player upsert failed:', upsertError.message);
    } else {
      console.log(`Successfully smart-synced ${rowsToUpsert.length} player profiles (${skippedUnchanged} unchanged profiles skipped).`);
    }
  } else {
    console.log('All national team player records are already up to date. No database writes required.');
  }
}

importNationalTeams().catch(err => {
  console.error('Import script failed:', err.message);
  process.exit(1);
});
