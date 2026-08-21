// scripts/seed-clean-database.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables (SUPABASE_URL or SERVICE_ROLE_KEY).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

function slugify(name) {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Central Alias Resolution Map: Fixes API naming discrepancies instantly
const TEAM_ALIASES = {
  'york9': 'York United FC',
  'york9 fc': 'York United FC',
  'york united': 'York United FC',
  'york united fc': 'York United FC',
  'atletico ottawa': 'Atlético Ottawa',
  'ottawa': 'Atlético Ottawa',
  'montreal roses': 'Roses de Montréal',
  'montreal roses fc': 'Roses de Montréal'
};

function normalizeTeamName(name) {
  if (!name) return '';
  const clean = name.trim().toLowerCase();
  return TEAM_ALIASES[clean] || name.trim();
}

const OFFICIAL_TEAMS = [
  // CPL (Men)
  { name: 'Forge FC', league: 'CPL', gender: 'men' },
  { name: 'Cavalry FC', league: 'CPL', gender: 'men' },
  { name: 'Atlético Ottawa', league: 'CPL', gender: 'men' },
  { name: 'Vancouver FC', league: 'CPL', gender: 'men' },
  { name: 'York United FC', league: 'CPL', gender: 'men' },
  { name: 'HFX Wanderers FC', league: 'CPL', gender: 'men' },
  { name: 'Pacific FC', league: 'CPL', gender: 'men' },
  { name: 'Valour FC', league: 'CPL', gender: 'men' },
  
  // NSL (Women)
  { name: 'AFC Toronto', league: 'NSL', gender: 'women' },
  { name: 'Roses de Montréal', league: 'NSL', gender: 'women' },
  { name: 'Vancouver Rise', league: 'NSL', gender: 'women' },
  { name: 'Calgary Wild', league: 'NSL', gender: 'women' },
  { name: 'Ottawa Rapid', league: 'NSL', gender: 'women' },
  { name: 'Halifax Tides', league: 'NSL', gender: 'women' },

  // Canadian MLS
  { name: 'Toronto FC', league: 'MLS', gender: 'men' },
  { name: 'CF Montréal', league: 'MLS', gender: 'men' },
  { name: 'Vancouver Whitecaps', league: 'MLS', gender: 'men' }
];

const CORE_PLAYERS = [
  { name: 'Jonathan David', league: 'Abroad', gender: 'men', position: 'ST', goals: 18, assists: 4, rating: 8.4 },
  { name: 'Alphonso Davies', league: 'Abroad', gender: 'men', position: 'LB', goals: 2, assists: 6, rating: 8.1 },
  { name: 'Stephen Eustáquio', league: 'Abroad', gender: 'men', position: 'CM', goals: 3, assists: 5, rating: 7.8 },
  { name: 'Tajon Buchanan', league: 'Abroad', gender: 'men', position: 'RW', goals: 4, assists: 3, rating: 7.7 },
  { name: 'Ismaël Koné', league: 'Abroad', gender: 'men', position: 'CM', goals: 2, assists: 4, rating: 7.6 },
  { name: 'Alistair Johnston', league: 'Abroad', gender: 'men', position: 'RB', goals: 1, assists: 5, rating: 7.9 },
  { name: 'Jessie Fleming', league: 'Abroad', gender: 'women', position: 'CM', goals: 5, assists: 7, rating: 8.3 },
  { name: 'Simi Awujo', league: 'Abroad', gender: 'women', position: 'CDM', goals: 1, assists: 3, rating: 7.6 },
  { name: 'Shelina Zadorsky', league: 'Abroad', gender: 'women', position: 'CB', goals: 1, assists: 1, rating: 7.5 },
  { name: 'Evelyne Viens', league: 'NSL', gender: 'women', position: 'ST', goals: 12, assists: 4, rating: 8.2 },
  { name: 'Jorian Baucom', league: 'NSL', gender: 'women', position: 'ST', goals: 10, assists: 3, rating: 8.0 },
  { name: 'Terran Campbell', league: 'CPL', gender: 'men', position: 'ST', goals: 14, assists: 2, rating: 7.8 },
  { name: 'Moses Dyer', league: 'CPL', gender: 'men', position: 'ST', goals: 11, assists: 3, rating: 7.5 }
];

async function seedDatabase() {
  console.log('🚀 Starting Clean Database Seeding Pipeline...');

  // 1. Seed Teams
  console.log('🏟️ Seeding official teams...');
  const teamRows = OFFICIAL_TEAMS.map(t => {
    const canonicalName = normalizeTeamName(t.name);
    const extId = slugify(`${t.league}-${canonicalName}`);
    return {
      external_id: extId,
      slug: extId,
      name: canonicalName,
      league: t.league,
      gender: t.gender,
      division_level: 'Professional'
    };
  });

  const { error: teamError } = await supabase.from('teams').upsert(teamRows, { onConflict: 'external_id' });
  if (teamError) throw new Error(`Teams seeding failed: ${teamError.message}`);
  console.log(`✅ Successfully seeded ${teamRows.length} canonical teams.`);

  // 2. Seed Players
  console.log('⚽ Seeding core player profiles...');
  const playerRows = CORE_PLAYERS.map(p => ({
    external_id: slugify(p.name),
    name: p.name,
    league: p.league,
    gender: p.gender,
    position: p.position,
    goals: p.goals,
    assists: p.assists,
    rating: p.rating
  }));

  const { error: playerError } = await supabase.from('players').upsert(playerRows, { onConflict: 'external_id' });
  if (playerError) throw new Error(`Players seeding failed: ${playerError.message}`);
  console.log(`✅ Successfully seeded ${playerRows.length} player records.`);

  console.log('✨ Clean Database Seeding Complete! Your frontend components and standings will now calculate perfectly.');
}

seedDatabase().catch(err => {
  console.error('❌ Seeding pipeline failed:', err.message);
  process.exit(1);
});
