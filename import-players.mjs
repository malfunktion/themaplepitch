import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function slugify(name) {
  if (!name) return '';
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function seedPlayers() {
  const corePlayers = [
    { name: 'Jonathan David', league: 'Abroad', gender: 'men', position: 'ST', goals: 18, assists: 4, rating: 8.4 },
    { name: 'Alphonso Davies', league: 'Abroad', gender: 'men', position: 'LB', goals: 2, assists: 6, rating: 8.1 },
    { name: 'Stephen Eustáquio', league: 'Abroad', gender: 'men', position: 'CM', goals: 3, assists: 5, rating: 7.8 },
    { name: 'Evelyne Viens', league: 'NSL', gender: 'women', position: 'ST', goals: 8, assists: 2, rating: 7.9 }
  ];

  const payload = corePlayers.map(p => ({
    external_id: slugify(p.name),
    slug: slugify(p.name),
    name: p.name,
    league: p.league,
    gender: p.gender,
    position: p.position,
    goals: p.goals,
    assists: p.assists,
    rating: p.rating
  }));

  const { error } = await supabase.from('players').upsert(payload, { onConflict: 'external_id' });
  if (error) {
    console.error('Player seed failed:', error.message);
  } else {
    console.log('Successfully seeded core player vault into Supabase!');
  }
}

seedPlayers();
