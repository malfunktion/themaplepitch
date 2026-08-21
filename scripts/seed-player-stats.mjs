// scripts/seed-player-stats.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsbyyvtcvyhidvijvwuo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required SUPABASE_URL or SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const MARQUEE_CANADIANS = [
  // Men's Stars
  { name: 'Jonathan David', league: 'Abroad', gender: 'men', position: 'ST', goals: 18, assists: 6, rating: 8.4, is_canadian: true },
  { name: 'Alphonso Davies', league: 'Abroad', gender: 'men', position: 'LB', goals: 3, assists: 8, rating: 8.2, is_canadian: true },
  { name: 'Stephen Eustáquio', league: 'Abroad', gender: 'men', position: 'CM', goals: 4, assists: 5, rating: 7.8, is_canadian: true },
  { name: 'Tajon Buchanan', league: 'Abroad', gender: 'men', position: 'RW', goals: 5, assists: 4, rating: 7.6, is_canadian: true },
  { name: 'Ismaël Koné', league: 'Abroad', gender: 'men', position: 'CM', goals: 3, assists: 3, rating: 7.5, is_canadian: true },
  { name: 'Alistair Johnston', league: 'Abroad', gender: 'men', position: 'RB', goals: 2, assists: 6, rating: 7.7, is_canadian: true },
  { name: 'Jonathan Osorio', league: 'MLS', gender: 'men', position: 'CM', goals: 6, assists: 7, rating: 7.4, is_canadian: true },
  { name: 'Moïse Bombito', league: 'Abroad', gender: 'men', position: 'CB', goals: 2, assists: 1, rating: 7.6, is_canadian: true },
  { name: 'Cyle Larin', league: 'Abroad', gender: 'men', position: 'ST', goals: 9, assists: 3, rating: 7.3, is_canadian: true },
  { name: 'Jacob Shaffelburg', league: 'MLS', gender: 'men', position: 'LW', goals: 7, assists: 5, rating: 7.5, is_canadian: true },
  
  // Women's Stars (Europe/Abroad)
  { name: 'Evelyne Viens', league: 'Abroad', gender: 'women', position: 'ST', goals: 14, assists: 4, rating: 8.3, is_canadian: true },
  { name: 'Kadeisha Buchanan', league: 'Abroad', gender: 'women', position: 'CB', goals: 2, assists: 1, rating: 7.9, is_canadian: true },
  { name: 'Ashley Lawrence', league: 'Abroad', gender: 'women', position: 'RB', goals: 1, assists: 7, rating: 7.8, is_canadian: true },
  { name: 'Cloé Lacasse', league: 'Abroad', gender: 'women', position: 'RW', goals: 8, assists: 5, rating: 7.7, is_canadian: true },
  { name: 'Olivia Smith', league: 'Abroad', gender: 'women', position: 'ST', goals: 11, assists: 6, rating: 8.2, is_canadian: true },

  // NWSL Stars (Canadian Expats)
  { name: 'Jessie Fleming', league: 'NWSL', gender: 'women', position: 'CM', goals: 5, assists: 9, rating: 8.1, is_canadian: true },
  { name: 'Kailen Sheridan', league: 'NWSL', gender: 'women', position: 'GK', goals: 0, assists: 0, rating: 8.0, is_canadian: true },
  { name: 'Janine Beckie', league: 'NWSL', gender: 'women', position: 'RW', goals: 6, assists: 4, rating: 7.8, is_canadian: true },
  { name: 'Quinn', league: 'NWSL', gender: 'women', position: 'CM', goals: 2, assists: 5, rating: 7.7, is_canadian: true },
  { name: 'Jordyn Huitema', league: 'NWSL', gender: 'women', position: 'ST', goals: 9, assists: 3, rating: 7.9, is_canadian: true },

  // CPL Stars
  { name: 'Tristan Borges', league: 'CPL', gender: 'men', position: 'RW', goals: 10, assists: 8, rating: 7.8, is_canadian: true },
  { name: 'Tobias Warschewski', league: 'CPL', gender: 'men', position: 'ST', goals: 12, assists: 4, rating: 7.9, is_canadian: false },
  { name: 'Brian Wright', league: 'CPL', gender: 'men', position: 'ST', goals: 9, assists: 6, rating: 7.6, is_canadian: true },
  { name: 'Alejandro Díaz', league: 'CPL', gender: 'men', position: 'ST', goals: 11, assists: 3, rating: 7.7, is_canadian: false },
  { name: 'Mael Henry', league: 'CPL', gender: 'men', position: 'CAM', goals: 4, assists: 7, rating: 7.4, is_canadian: true },

  // NSL Stars
  { name: 'Adriana Leon', league: 'NSL', gender: 'women', position: 'LW', goals: 8, assists: 5, rating: 8.0, is_canadian: true },
  { name: 'Nichelle Prince', league: 'NSL', gender: 'women', position: 'ST', goals: 7, assists: 4, rating: 7.7, is_canadian: true },
  { name: 'Deanne Rose', league: 'NSL', gender: 'women', position: 'RW', goals: 6, assists: 6, rating: 7.6, is_canadian: true },
  { name: 'Clarissa Larisey', league: 'NSL', gender: 'women', position: 'ST', goals: 9, assists: 3, rating: 7.8, is_canadian: true }
];

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function seedPlayerTelemetry() {
  console.log('🚀 Hydrating Player Goals, Telemetry & Forms in Supabase...');

  for (const player of MARQUEE_CANADIANS) {
    const slug = slugify(player.name);
    const externalId = `seed-${slug}`;

    const payload = {
      external_id: externalId,
      slug: slug,
      name: player.name,
      position: player.position,
      gender: player.gender,
      league: player.league,
      goals: player.goals,
      assists: player.assists,
      rating: player.rating,
      is_canadian: player.is_canadian
    };

    // Target external_id on conflict
    const { error } = await supabase
      .from('players')
      .upsert(payload, { onConflict: 'external_id' });

    if (error) {
      console.error(`⚠️ Error seeding ${player.name}:`, error.message);
    } else {
      console.log(`✅ Telemetry Seeded: ${player.name} (${player.goals}G / ${player.assists}A)`);
    }
  }

  console.log('✨ Telemetry Hydration Complete!');
}

seedPlayerTelemetry().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
