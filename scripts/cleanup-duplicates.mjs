import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Map shorthand/old names to their correct canonical team name
const DUPLICATE_MAPPINGS = {
  'Cavalry': 'Cavalry FC',
  'Forge': 'Forge FC',
  'HFX Wanderers': 'HFX Wanderers FC',
  'Inter Toronto': 'Inter Toronto FC',
  'Pacific': 'Pacific FC',
  'Valour': 'Valour FC',
  'Supra': 'FC Supra du Québec',
  'Quebec Supra': 'FC Supra du Québec',
  'York United': 'Inter Toronto FC',
  'York9': 'Inter Toronto FC'
};

async function cleanupTeams() {
  console.log('Fetching CPL teams from Supabase...');
  const { data: teams, error } = await supabase
    .from('teams')
    .select('id, name, league')
    .eq('league', 'CPL');

  if (error) {
    console.error('Failed to fetch teams:', error.message);
    return;
  }

  for (const [badName, goodName] of Object.entries(DUPLICATE_MAPPINGS)) {
    const badTeam = teams.find(t => t.name.toLowerCase().trim() === badName.toLowerCase().trim());
    const goodTeam = teams.find(t => t.name.toLowerCase().trim() === goodName.toLowerCase().trim());

    if (badTeam && goodTeam && badTeam.id !== goodTeam.id) {
      console.log(`Merging duplicates: "${badTeam.name}" (${badTeam.id}) -> "${goodTeam.name}" (${goodTeam.id})`);

      // 1. Re-point home matches
      await supabase
        .from('matches')
        .update({ home_team_id: goodTeam.id })
        .eq('home_team_id', badTeam.id);

      // 2. Re-point away matches
      await supabase
        .from('matches')
        .update({ away_team_id: goodTeam.id })
        .eq('away_team_id', badTeam.id);

      // 3. Safe delete of the duplicate shorthand row
      const { error: delError } = await supabase
        .from('teams')
        .delete()
        .eq('id', badTeam.id);

      if (delError) {
        console.error(`Failed to delete duplicate team ${badTeam.name}:`, delError.message);
      } else {
        console.log(`Successfully removed duplicate: ${badTeam.name}`);
      }
    }
  }

  console.log('Duplicate team cleanup finished successfully!');
}

cleanupTeams().catch(console.error);
