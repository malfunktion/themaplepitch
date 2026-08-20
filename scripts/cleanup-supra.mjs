import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const MAPPINGS = {
  'Supra': 'FC Supra du Québec',
  'Quebec Supra': 'FC Supra du Québec',
  'Québec Supra': 'FC Supra du Québec'
};

async function run() {
  const { data: teams } = await supabase.from('teams').select('id, name').eq('league', 'CPL');
  
  for (const [bad, good] of Object.entries(MAPPINGS)) {
    const badT = teams.find(t => t.name.toLowerCase().trim() === bad.toLowerCase().trim());
    const goodT = teams.find(t => t.name.toLowerCase().trim() === good.toLowerCase().trim());
    
    if (badT && goodT && badT.id !== goodT.id) {
      console.log(`Merging "${badT.name}" (${badT.id}) -> "${goodT.name}" (${goodT.id})`);
      await supabase.from('matches').update({ home_team_id: goodT.id }).eq('home_team_id', badT.id);
      await supabase.from('matches').update({ away_team_id: goodT.id }).eq('away_team_id', badT.id);
      await supabase.from('teams').delete().eq('id', badT.id);
    }
  }
  console.log('Supra duplicates cleaned successfully!');
}

run();
