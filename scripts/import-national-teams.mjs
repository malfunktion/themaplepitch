import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY / SERVICE_ROLE_KEY).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function importNationalTeams() {
  console.log('🚀 Initializing Canadian National Teams & Squads Ingestion...');

  // 1. Ensure National Teams exist in 'teams' table
  const nationalTeams = [
    { external_id: 'nat-canmnt', name: "Canada Men's National Team", short_name: 'CanMNT', league: 'National Teams', gender: 'men', division_level: 'International', slug: 'canmnt' },
    { external_id: 'nat-canwnt', name: "Canada Women's National Team", short_name: 'CanWNT', league: 'National Teams', gender: 'women', division_level: 'International', slug: 'canwnt' },
  ];

  for (const team of nationalTeams) {
    const { error } = await supabase.from('teams').upsert(team, { onConflict: 'external_id' });
    if (error) {
      console.error(`⚠️ Failed to upsert team ${team.name}:`, error.message);
    }
  }

  // 2. Fetch team IDs to bind team_id foreign key
  const { data: dbTeams, error: fetchTeamError } = await supabase
    .from('teams')
    .select('id, short_name, external_id, slug');

  if (fetchTeamError) {
    console.error('❌ Failed to fetch team map:', fetchTeamError.message);
    return;
  }

  const teamMap = {};
  (dbTeams || []).forEach(t => {
    if (t.short_name) teamMap[t.short_name.toUpperCase()] = t.id;
    if (t.slug) teamMap[t.slug.toLowerCase()] = t.id;
    if (t.external_id) teamMap[t.external_id.toLowerCase()] = t.id;
  });

  const canmntId = teamMap['CANMNT'] || teamMap['canmnt'] || teamMap['nat-canmnt'] || null;
  const canwntId = teamMap['CANWNT'] || teamMap['canwnt'] || teamMap['nat-canwnt'] || null;

  // 3. Complete National Squad Call-Up Pools
  const completeSquads = [
    // --- CanMNT (Men's Senior Pool) ---
    { number: 19, name: 'Alphonso Davies', position: 'LB', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Bayern Munich', age: 25, caps: 58, goals: 15, assists: 18, rating: 8.9, status: 'LOCKED' },
    { number: 9, name: 'Jonathan David', position: 'ST', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Lille OSC', age: 26, caps: 55, goals: 31, assists: 10, rating: 8.8, status: 'LOCKED' },
    { number: 7, name: 'Stephen Eustáquio', position: 'CM', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'FC Porto', age: 29, caps: 45, goals: 5, assists: 6, rating: 8.3, status: 'LOCKED' },
    { number: 17, name: 'Tajon Buchanan', position: 'RW', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Villarreal', age: 27, caps: 42, goals: 8, assists: 5, rating: 8.1, status: 'INJURED' },
    { number: 8, name: 'Ismaël Koné', position: 'CM', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Marseille', age: 23, caps: 28, goals: 3, assists: 4, rating: 8.0, status: 'LOCKED' },
    { number: 2, name: 'Alistair Johnston', position: 'RB', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Celtic FC', age: 27, caps: 49, goals: 2, assists: 6, rating: 8.2, status: 'LOCKED' },
    { number: 15, name: 'Moïse Bombito', position: 'CB', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'OGC Nice', age: 25, caps: 20, goals: 1, assists: 0, rating: 7.9, status: 'LOCKED' },
    { number: 13, name: 'Derek Cornelius', position: 'CB', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Marseille', age: 28, caps: 26, goals: 0, assists: 1, rating: 7.7, status: 'LOCKED' },
    { number: 18, name: 'Cyle Larin', position: 'ST', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Mallorca', age: 31, caps: 78, goals: 30, assists: 5, rating: 8.1, status: 'LOCKED' },
    { number: 23, name: 'Liam Millar', position: 'LW', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Hull City', age: 26, caps: 34, goals: 3, assists: 5, rating: 7.6, status: 'LOCKED' },
    { number: 14, name: 'Jacob Shaffelburg', position: 'LW', league: 'MLS', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Nashville SC', age: 26, caps: 18, goals: 4, assists: 4, rating: 7.7, status: 'LOCKED' },
    { number: 22, name: 'Ali Ahmed', position: 'LM', league: 'MLS', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Vancouver Whitecaps', age: 25, caps: 12, goals: 1, assists: 3, rating: 7.4, status: 'LOCKED' },
    { number: 21, name: 'Jonathan Osorio', position: 'CM', league: 'MLS', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Toronto FC', age: 34, caps: 78, goals: 9, assists: 11, rating: 7.7, status: 'LOCKED' },
    { number: 22, name: 'Richie Laryea', position: 'RB', league: 'MLS', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Toronto FC', age: 31, caps: 52, goals: 3, assists: 7, rating: 7.6, status: 'LOCKED' },
    { number: 16, name: 'Mathieu Choinière', position: 'CM', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Grasshopper Zürich', age: 27, caps: 11, goals: 1, assists: 1, rating: 7.4, status: 'LOCKED' },
    { number: 24, name: 'Luc de Fougerolles', position: 'CB', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Fulham U21', age: 20, caps: 4, goals: 0, assists: 0, rating: 7.3, status: 'UNTIED / DUAL-NAT' },
    { number: 25, name: 'Niko Sigur', position: 'RB', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Hajduk Split', age: 22, caps: 5, goals: 0, assists: 1, rating: 7.4, status: 'UNTIED / DUAL-NAT' },
    { number: 11, name: 'Theo Bair', position: 'ST', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Auxerre', age: 26, caps: 6, goals: 1, assists: 1, rating: 7.3, status: 'LOCKED' },
    { number: 20, name: 'Tani Oluwaseyi', position: 'ST', league: 'MLS', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Minnesota United', age: 26, caps: 8, goals: 1, assists: 1, rating: 7.3, status: 'LOCKED' },
    { number: 4, name: 'Joel Waterman', position: 'CB', league: 'MLS', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'CF Montréal', age: 30, caps: 6, goals: 0, assists: 0, rating: 7.2, status: 'LOCKED' },
    { number: 3, name: 'Sam Adekugbe', position: 'LB', league: 'MLS', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Vancouver Whitecaps', age: 31, caps: 42, goals: 1, assists: 5, rating: 7.4, status: 'LOCKED' },
    { number: 16, name: 'Maxime Crépeau', position: 'GK', league: 'MLS', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Portland Timbers', age: 32, caps: 24, goals: 0, assists: 0, rating: 7.8, status: 'LOCKED' },
    { number: 1, name: 'Dayne St. Clair', position: 'GK', league: 'MLS', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'Minnesota United', age: 29, caps: 8, goals: 0, assists: 0, rating: 7.5, status: 'LOCKED' },
    { number: 12, name: 'Jonathan Sirois', position: 'GK', league: 'MLS', gender: 'men', squad_type: 'SENIOR', national_team: 'CanMNT', team_id: canmntId, club: 'CF Montréal', age: 25, caps: 2, goals: 0, assists: 0, rating: 7.2, status: 'LOCKED' },

    // --- CanWNT (Women's Senior Pool) ---
    { number: 6, name: 'Jessie Fleming', position: 'CM', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', team_id: canwntId, club: 'Portland Thorns FC', age: 28, caps: 138, goals: 31, assists: 16, rating: 8.6, status: 'LOCKED' },
    { number: 3, name: 'Kadeisha Buchanan', position: 'CB', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', team_id: canwntId, club: 'Chelsea FC', age: 30, caps: 156, goals: 5, assists: 2, rating: 8.5, status: 'LOCKED' },
    { number: 10, name: 'Ashley Lawrence', position: 'FB', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', team_id: canwntId, club: 'Chelsea FC', age: 31, caps: 134, goals: 8, assists: 21, rating: 8.4, status: 'LOCKED' },
    { number: 1, name: 'Kailen Sheridan', position: 'GK', league: 'NWSL', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', team_id: canwntId, club: 'San Diego Wave FC', age: 31, caps: 55, goals: 0, assists: 0, rating: 8.3, status: 'LOCKED' },
    { number: 16, name: 'Janine Beckie', position: 'FW', league: 'NWSL', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', team_id: canwntId, club: 'Utah Royals FC', age: 31, caps: 108, goals: 36, assists: 13, rating: 8.2, status: 'LOCKED' },
    { number: 19, name: 'Cloé Lacasse', position: 'RW', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', team_id: canwntId, club: 'Utah Royals FC', age: 33, caps: 40, goals: 21, assists: 6, rating: 8.0, status: 'LOCKED' },
    { number: 11, name: 'Evelyne Viens', position: 'ST', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', team_id: canwntId, club: 'AS Roma', age: 29, caps: 35, goals: 15, assists: 4, rating: 8.2, status: 'LOCKED' },
    { number: 7, name: 'Julia Grosso', position: 'CM', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', team_id: canwntId, club: 'Chicago Red Stars', age: 25, caps: 68, goals: 8, assists: 7, rating: 8.0, status: 'LOCKED' },
    { number: 14, name: 'Vanessa Gilles', position: 'CB', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', team_id: canwntId, club: 'Lyon', age: 30, caps: 46, goals: 5, assists: 1, rating: 8.1, status: 'LOCKED' },
    { number: 4, name: 'Shelina Zadorsky', position: 'CB', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', team_id: canwntId, club: 'West Ham United', age: 33, caps: 103, goals: 6, assists: 2, rating: 7.7, status: 'LOCKED' },
    { number: 12, name: 'Jade Rose', position: 'CB', league: 'Collegiate', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', team_id: canwntId, club: 'Harvard / CanWNT', age: 23, caps: 24, goals: 1, assists: 2, rating: 7.9, status: 'LOCKED' },
    { number: 9, name: 'Jordyn Huitema', position: 'ST', league: 'NWSL', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', team_id: canwntId, club: 'Seattle Reign FC', age: 25, caps: 82, goals: 21, assists: 6, rating: 8.0, status: 'LOCKED' },
    { number: 13, name: 'Simi Awujo', position: 'CM', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', team_id: canwntId, club: 'Manchester United', age: 22, caps: 20, goals: 2, assists: 2, rating: 7.7, status: 'LOCKED' },
    { number: 17, name: 'Gabrielle Carle', position: 'LB', league: 'NWSL', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', team_id: canwntId, club: 'Washington Spirit', age: 27, caps: 50, goals: 2, assists: 4, rating: 7.6, status: 'LOCKED' },
    { number: 15, name: 'Nichelle Prince', position: 'FW', league: 'NWSL', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', team_id: canwntId, club: 'Kansas City Current', age: 31, caps: 98, goals: 16, assists: 12, rating: 7.7, status: 'LOCKED' },
    { number: 5, name: 'Quinn', position: 'CM', league: 'NWSL', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', team_id: canwntId, club: 'Seattle Reign FC', age: 31, caps: 102, goals: 6, assists: 4, rating: 7.8, status: 'LOCKED' },
    { number: 18, name: 'Adriana Leon', position: 'RW', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', team_id: canwntId, club: 'Aston Villa', age: 33, caps: 114, goals: 40, assists: 15, rating: 8.1, status: 'LOCKED' },
    { number: 22, name: 'Sabrina D\'Angelo', position: 'GK', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', national_team: 'CanWNT', team_id: canwntId, club: 'Aston Villa', age: 33, caps: 18, goals: 0, assists: 0, rating: 7.5, status: 'LOCKED' },
  ];

  // 4. Fetch existing database records to compare for Smart Sync
  const { data: existingPlayers, error: fetchPlayersErr } = await supabase
    .from('players')
    .select('external_id, caps, goals, assists, club, rating, status, position');

  if (fetchPlayersErr) {
    console.warn('⚠️ Note when querying existing players:', fetchPlayersErr.message);
  }

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
      team_id: p.team_id,
      club: p.club,
      age: p.age,
      number: p.number,
      caps: p.caps,
      goals: p.goals,
      assists: p.assists,
      ga: `${p.goals} G / ${p.assists} A`,
      rating: p.rating,
      status: p.status,
    };

    const existing = existingMap.get(extId);
    if (existing) {
      // Smart Sync: Skip database write if core fields are unchanged
      const isIdentical =
        existing.caps === incomingData.caps &&
        existing.goals === incomingData.goals &&
        existing.assists === incomingData.assists &&
        existing.club === incomingData.club &&
        Number(existing.rating) === Number(incomingData.rating) &&
        existing.status === incomingData.status &&
        existing.position === incomingData.position;

      if (isIdentical) {
        skippedUnchanged++;
        continue;
      }
    }

    rowsToUpsert.push(incomingData);
  }

  // 5. Upsert updated or new player rows into Supabase
  if (rowsToUpsert.length > 0) {
    const { error: upsertError } = await supabase
      .from('players')
      .upsert(rowsToUpsert, { onConflict: 'external_id' });

    if (upsertError) {
      console.error('❌ Player upsert failed:', upsertError.message);
    } else {
      console.log(`✅ Successfully smart-synced ${rowsToUpsert.length} player profiles (${skippedUnchanged} unchanged profiles skipped).`);
    }
  } else {
    console.log(`⚡ All ${completeSquads.length} national team player records are already up to date. Zero database writes required.`);
  }

  console.log('🎉 National Teams and Squad Pools synchronization complete!');
}

importNationalTeams().catch(err => {
  console.error('❌ Import script failed:', err.message);
  process.exit(1);
});
