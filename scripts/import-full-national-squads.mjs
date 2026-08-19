import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

const fullNationalSquads = [
  // Men's National Team (CanMNT)
  { name: 'Alphonso Davies', position: 'LB', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', club: 'Bayern Munich', caps: 50, goals: 15, assists: 18, rating: 8.5, national_team: 'CanMNT' },
  { name: 'Jonathan David', position: 'ST', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', club: 'Lille OSC', caps: 55, goals: 28, assists: 10, rating: 8.4, national_team: 'CanMNT' },
  { name: 'Stephen Eustáquio', position: 'CM', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', club: 'FC Porto', caps: 40, goals: 5, assists: 8, rating: 8.1, national_team: 'CanMNT' },
  { name: 'Tajon Buchanan', position: 'RW', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', club: 'Villarreal', caps: 42, goals: 8, assists: 12, rating: 8.0, national_team: 'CanMNT' },
  { name: 'Alistair Johnston', position: 'RB', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', club: 'Celtic FC', caps: 44, goals: 2, assists: 9, rating: 7.9, national_team: 'CanMNT' },
  { name: 'Ismaël Koné', position: 'CM', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', club: 'Marseille', caps: 25, goals: 3, assists: 5, rating: 7.9, national_team: 'CanMNT' },
  { name: 'Cyle Larin', position: 'ST', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', club: Mallorca, caps: 75, goals: 30, assists: 6, rating: 7.9, national_team: 'CanMNT' },
  { name: 'Jacob Shaffelburg', position: 'LW', league: 'MLS', gender: 'men', squad_type: 'SENIOR', club: 'Nashville SC', caps: 20, goals: 4, assists: 5, rating: 7.8, national_team: 'CanMNT' },
  { name: 'Moïse Bombito', position: 'CB', league: 'MLS', gender: 'men', squad_type: 'SENIOR', club: 'Nice', caps: 15, goals: 1, assists: 0, rating: 7.8, national_team: 'CanMNT' },
  { name: 'Jonathan Osorio', position: 'CM', league: 'MLS', gender: 'men', squad_type: 'SENIOR', club: 'Toronto FC', caps: 78, goals: 9, assists: 11, rating: 7.7, national_team: 'CanMNT' },
  { name: 'Derek Cornelius', position: 'CB', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', club: 'Malmö FF', caps: 26, goals: 1, assists: 1, rating: 7.7, national_team: 'CanMNT' },
  { name: 'Maxime Crépeau', position: 'GK', league: 'MLS', gender: 'men', squad_type: 'SENIOR', club: 'Portland Timbers', caps: 22, goals: 0, assists: 0, rating: 7.7, national_team: 'CanMNT' },
  { name: 'Dayne St. Clair', position: 'GK', league: 'MLS', gender: 'men', squad_type: 'SENIOR', club: 'Minnesota United', caps: 6, goals: 0, assists: 0, rating: 7.5, national_team: 'CanMNT' },
  { name: 'Joel Waterman', position: 'CB', league: 'MLS', gender: 'men', squad_type: 'SENIOR', club: 'CF Montréal', caps: 4, goals: 0, assists: 0, rating: 7.4, national_team: 'CanMNT' },
  { name: 'Mathieu Choinière', position: 'CM', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', club: 'Grasshopper Zürich', caps: 6, goals: 0, assists: 1, rating: 7.5, national_team: 'CanMNT' },
  { name: 'Nathan Saliba', position: 'CM', league: 'MLS', gender: 'men', squad_type: 'SENIOR', club: 'CF Montréal', caps: 2, goals: 0, assists: 0, rating: 7.4, national_team: 'CanMNT' },
  { name: 'Liam Millar', position: 'FWD', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', club: 'Preston North End', caps: 32, goals: 2, assists: 4, rating: 7.6, national_team: 'CanMNT' },
  { name: 'Richie Laryea', position: 'DEF', league: 'MLS', gender: 'men', squad_type: 'SENIOR', club: 'Toronto FC', caps: 52, goals: 3, assists: 8, rating: 7.6, national_team: 'CanMNT' },
  { name: 'Tani Oluwaseyi', position: 'ST', league: 'MLS', gender: 'men', squad_type: 'SENIOR', club: 'Minnesota United', caps: 5, goals: 1, assists: 1, rating: 7.6, national_team: 'CanMNT' }
];

async function runImport() {
  console.log('Seeding full national team squad pool...');
  for (const p of fullNationalSquads) {
    const playerSlug = slugify(p.name);
    const payload = {
      external_id: playerSlug,
      slug: playerSlug,
      name: p.name,
      position: p.position,
      league: p.league,
      gender: p.gender,
      squad_type: p.squad_type,
      caps: p.caps,
      goals: p.goals,
      assists: p.assists,
      rating: p.rating,
      metadata: { national_team: p.national_team }
    };

    const { error } = await supabase.from('players').upsert(payload, { onConflict: 'external_id' });
    if (error) {
      console.error(`Failed to insert ${p.name}:`, error.message);
    }
  }
  console.log(`Successfully seeded ${fullNationalSquads.length} national team players into Supabase!`);
}

runImport().catch(console.error);
