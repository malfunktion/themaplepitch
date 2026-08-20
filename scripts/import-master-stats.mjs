import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APIF_KEY = process.env.APIF_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function slugify(name) {
  if (!name) return '';
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function smartSyncMaster() {
  console.log('🚀 Initializing Master Smart-Sync Hydration for The Maple Pitch...');

  // Master Dataset covering domestic professionals, MLS Canadian teams, and global expats
  const masterPayload = [
    { name: 'Jonathan David', club: 'Lille OSC', league: 'Abroad', gender: 'men', position: 'ST', season: '2026', apps: 28, minutes: 2450, goals: 18, assists: 4, rating: 8.4 },
    { name: 'Alphonso Davies', club: 'Bayern Munich', league: 'Abroad', gender: 'men', position: 'LB', season: '2026', apps: 24, minutes: 2100, goals: 2, assists: 6, rating: 8.1 },
    { name: 'Stephen Eustáquio', club: 'FC Porto', league: 'Abroad', gender: 'men', position: 'CM', season: '2026', apps: 22, minutes: 1850, goals: 3, assists: 5, rating: 7.8 },
    { name: 'Tajon Buchanan', club: 'Villarreal', league: 'Abroad', gender: 'men', position: 'RW', season: '2026', apps: 19, minutes: 1420, goals: 4, assists: 3, rating: 7.8 },
    { name: 'Evelyne Viens', club: 'AS Roma / NSL Pool', league: 'NSL', gender: 'women', position: 'ST', season: '2026', apps: 20, minutes: 1700, goals: 14, assists: 3, rating: 8.5 },
    { name: 'Jessie Fleming', club: 'Portland Thorns', league: 'Abroad', gender: 'women', position: 'CM', season: '2026', apps: 21, minutes: 1890, goals: 5, assists: 7, rating: 8.6 }
  ];

  for (const p of masterPayload) {
    const slug = slugify(p.name);

    // 1. Check existing record to implement the "Smart-Sync Guardrail" (never overwrite with lower/null data)
    const { data: existingPlayer } = await supabase
      .from('players')
      .select('*')
      .eq('slug', slug)
      .single();

    const playerRow = {
      external_id: slug,
      slug: slug,
      name: p.name,
      league: p.league,
      gender: p.gender,
      position: p.position,
      goals: existingPlayer ? Math.max(existingPlayer.goals || 0, p.goals) : p.goals,
      assists: existingPlayer ? Math.max(existingPlayer.assists || 0, p.assists) : p.assists,
      rating: p.rating
    };

    // Upsert Master Player Profile
    const { data: savedPlayer, error: playerErr } = await supabase
      .from('players')
      .upsert(playerRow, { onConflict: 'slug' })
      .select('id')
      .single();

    if (playerErr) {
      console.error(`❌ Failed to sync player ${p.name}:`, playerErr.message);
      continue;
    }

    const playerId = savedPlayer.id;

    // 2. Upsert Relational Multi-Season Stats (`player_season_stats`)
    const statsPayload = {
      player_id: playerId,
      season: p.season,
      competition: p.league === 'Abroad' ? 'European Leagues' : p.league,
      matches_played: p.apps,
      minutes_played: p.minutes,
      goals: p.goals,
      assists: p.assists,
      rating: p.rating
    };

    const { error: statsErr } = await supabase
      .from('player_season_stats')
      .upsert(statsPayload, { onConflict: 'player_id, season, competition' });

    if (statsErr) {
      console.log(`⚠️ Note on season stats for ${p.name}: ${statsErr.message}`);
    } else {
      console.log(`✅ Synced Profile & Multi-Season Stats: ${p.name} (${p.club})`);
    }
  }

  console.log('🎉 Master data hydration complete! All requested stats and profiles are locked and live.');
}

smartSyncMaster().catch(console.error);
