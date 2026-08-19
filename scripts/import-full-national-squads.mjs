// scripts/import-full-national-squads.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

const fullNationalPool = [
  // --- MEN'S SENIOR ---
  { name: 'Alphonso Davies', position: 'LB', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', age: 25, caps: 54, goals: 15, assists: 18, rating: 8.9, status: 'LOCKED' },
  { name: 'Jonathan David', position: 'ST', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', age: 26, caps: 56, goals: 31, assists: 10, rating: 8.8, status: 'LOCKED' },
  { name: 'Stephen Eustáquio', position: 'CM', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', age: 29, caps: 42, goals: 4, assists: 6, rating: 8.1, status: 'LOCKED' },
  { name: 'Tajon Buchanan', position: 'RW', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', age: 27, caps: 40, goals: 6, assists: 9, rating: 8.0, status: 'LOCKED' },
  { name: 'Ismaël Koné', position: 'CM', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', age: 23, caps: 25, goals: 2, assists: 4, rating: 7.8, status: 'LOCKED' },
  { name: 'Alistair Johnston', position: 'RB', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', age: 27, caps: 48, goals: 1, assists: 5, rating: 8.2, status: 'LOCKED' },
  { name: 'Moïse Bombito', position: 'CB', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', age: 25, caps: 18, goals: 0, assists: 1, rating: 7.9, status: 'LOCKED' },
  { name: 'Derek Cornelius', position: 'CB', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', age: 28, caps: 24, goals: 1, assists: 0, rating: 7.7, status: 'LOCKED' },
  { name: 'Maxime Crépeau', position: 'GK', league: 'MLS', gender: 'men', squad_type: 'SENIOR', age: 31, caps: 22, goals: 0, assists: 0, rating: 7.6, status: 'LOCKED' },
  { name: 'Dayne St. Clair', position: 'GK', league: 'MLS', gender: 'men', squad_type: 'SENIOR', age: 28, caps: 6, goals: 0, assists: 0, rating: 7.4, status: 'ACTIVE' },
  { name: 'Richie Laryea', position: 'RWB', league: 'MLS', gender: 'men', squad_type: 'SENIOR', age: 31, caps: 52, goals: 3, assists: 11, rating: 7.5, status: 'ACTIVE' },
  { name: 'Jacob Shaffelburg', position: 'LW', league: 'MLS', gender: 'men', squad_type: 'SENIOR', age: 26, caps: 18, goals: 4, assists: 5, rating: 7.7, status: 'ACTIVE' },
  { name: 'Tani Oluwaseyi', position: 'ST', league: 'MLS', gender: 'men', squad_type: 'SENIOR', age: 25, caps: 5, goals: 1, assists: 2, rating: 7.4, status: 'UNTIED / DUAL-NAT' },
  { name: 'Ali Ahmed', position: 'LM', league: 'MLS', gender: 'men', squad_type: 'SENIOR', age: 25, caps: 8, goals: 0, assists: 2, rating: 7.3, status: 'ACTIVE' },
  { name: 'Mathieu Choinière', position: 'CM', league: 'Abroad', gender: 'men', squad_type: 'SENIOR', age: 27, caps: 14, goals: 0, assists: 3, rating: 7.5, status: 'ACTIVE' },

  // --- WOMEN'S SENIOR ---
  { name: 'Jessie Fleming', position: 'CM', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', age: 28, caps: 135, goals: 20, assists: 18, rating: 9.0, status: 'LOCKED' },
  { name: 'Kadeisha Buchanan', position: 'CB', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', age: 30, caps: 152, goals: 4, assists: 3, rating: 8.8, status: 'LOCKED' },
  { name: 'Ashley Lawrence', position: 'FB', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', age: 30, caps: 138, goals: 8, assists: 25, rating: 8.7, status: 'LOCKED' },
  { name: 'Cloé Lacasse', position: 'FW', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', age: 32, caps: 35, goals: 5, assists: 7, rating: 8.0, status: 'ACTIVE' },
  { name: 'Evelyne Viens', position: 'ST', league: 'NSL', gender: 'women', squad_type: 'SENIOR', age: 29, caps: 32, goals: 8, assists: 4, rating: 8.1, status: 'ACTIVE' },
  { name: 'Shelina Zadorsky', position: 'CB', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', age: 33, caps: 101, goals: 5, assists: 2, rating: 7.8, status: 'ACTIVE' },
  { name: 'Kailen Sheridan', position: 'GK', league: 'NWSL', gender: 'women', squad_type: 'SENIOR', age: 30, caps: 52, goals: 0, assists: 0, rating: 8.4, status: 'LOCKED' },
  { name: 'Jade Rose', position: 'CB', league: 'Abroad', gender: 'women', squad_type: 'SENIOR', age: 23, caps: 22, goals: 1, assists: 1, rating: 7.9, status: 'UNTIED / DUAL-NAT' },
  { name: 'Jorian Baucom', position: 'ST', league: 'NSL', gender: 'women', squad_type: 'SENIOR', age: 29, caps: 4, goals: 2, assists: 1, rating: 7.6, status: 'ACTIVE' },
];

async function seedSquads() {
  console.log('Seeding full national team squad pool...');
  const payload = fullNationalPool.map(p => ({
    external_id: slugify(p.name),
    slug: slugify(p.name),
    name: p.name,
    position: p.position,
    league: p.league,
    gender: p.gender,
    squad_type: p.squad_type,
    age: p.age,
    caps: p.caps,
    goals: p.goals,
    assists: p.assists,
    ga: `${p.goals} G / ${p.assists} A`,
    rating: p.rating,
    status: p.status
  }));

  const { error } = await supabase.from('players').upsert(payload, { onConflict: 'external_id' });
  if (error) {
    console.error('Failed to seed squad pool:', error.message);
  } else {
    console.log(`Successfully seeded ${payload.length} national team players into Supabase!`);
  }
}

seedSquads();
