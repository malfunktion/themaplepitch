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

// Helper to generate a random number within a range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate realistic stats based on a player's field position
function generateRealisticStats(position) {
  const pos = (position || 'CM').toUpperCase();
  let goals = 0, assists = 0, yellow = 0, red = 0, clean_sheets = null;
  let rating = (Math.random() * (8.5 - 6.0) + 6.0).toFixed(1);

  if (pos.includes('GK') || pos === 'GOALKEEPER') {
    clean_sheets = getRandomInt(0, 12);
    yellow = getRandomInt(0, 2);
  } else if (pos.includes('CB') || pos.includes('DEF') || pos.includes('B')) {
    goals = getRandomInt(0, 3);
    assists = getRandomInt(0, 4);
    yellow = getRandomInt(2, 8);
    red = getRandomInt(0, 1);
  } else if (pos.includes('M') || pos === 'M') {
    goals = getRandomInt(1, 7);
    assists = getRandomInt(2, 10);
    yellow = getRandomInt(1, 6);
  } else if (pos.includes('ST') || pos.includes('FW') || pos.includes('W') || pos.includes('ATT')) {
    goals = getRandomInt(3, 18);
    assists = getRandomInt(1, 8);
    yellow = getRandomInt(0, 4);
  } else {
    goals = getRandomInt(0, 5);
    assists = getRandomInt(0, 5);
  }

  return { goals, assists, yellow_cards: yellow, red_cards: red, clean_sheets, rating };
}

async function seedAllDatabasePlayers() {
  console.log('🚀 Fetching all active players from the database...');
  
  const { data: players, error } = await supabase
    .from('players')
    .select('id, name, position, is_canadian');

  if (error || !players) {
    console.error('❌ Failed to fetch players:', error);
    return;
  }

  console.log(`📊 Found ${players.length} players in the vault. Generating position-based telemetry...`);

  let successCount = 0;

  // We use a non-destructive update loop to ensure we ONLY overwrite stat columns, 
  // keeping external_ids, slugs, and relations completely intact.
  for (const p of players) {
    const stats = generateRealisticStats(p.position);
    
    const { error: updateError } = await supabase
      .from('players')
      .update(stats)
      .eq('id', p.id);

    if (updateError) {
      console.error(`⚠️ Error updating ${p.name}:`, updateError.message);
    } else {
      successCount++;
    }
  }

  console.log(`✨ Telemetry Hydration Complete! Successfully populated stats for ${successCount}/${players.length} players.`);
}

seedAllDatabasePlayers().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
