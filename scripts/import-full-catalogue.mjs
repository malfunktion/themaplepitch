import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

function slugify(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function runFullCatalogueImport() {
  console.log('🚀 Initializing Full Catalogue Ingestion for The Maple Pitch...');

  const masterTeams = [
    // CPL
    { name: 'Forge FC', league: 'CPL', gender: 'men' },
    { name: 'Cavalry FC', league: 'CPL', gender: 'men' },
    { name: 'Pacific FC', league: 'CPL', gender: 'men' },
    { name: 'York United FC', league: 'CPL', gender: 'men' },
    { name: 'Valour FC', league: 'CPL', gender: 'men' },
    { name: 'HFX Wanderers FC', league: 'CPL', gender: 'men' },
    { name: 'Vancouver FC', league: 'CPL', gender: 'men' },
    { name: 'Atlético Ottawa', league: 'CPL', gender: 'men' },
    // NSL
    { name: 'AFC Toronto', league: 'NSL', gender: 'women' },
    { name: 'Calgary Wild FC', league: 'NSL', gender: 'women' },
    { name: 'Halifax Tides FC', league: 'NSL', gender: 'women' },
    { name: 'Montreal Roses FC', league: 'NSL', gender: 'women' },
    { name: 'Ottawa Rapid FC', league: 'NSL', gender: 'women' },
    { name: 'Vancouver Rise FC', league: 'NSL', gender: 'women' },
    // MLS Canadian Clubs
    { name: 'Toronto FC', league: 'MLS', gender: 'men' },
    { name: 'CF Montréal', league: 'MLS', gender: 'men' },
    { name: 'Vancouver Whitecaps', league: 'MLS', gender: 'men' },
    // National Teams & Clubs Abroad
    { name: "Canada Men's National Team", league: 'National', gender: 'men' },
    { name: "Canada Women's National Team", league: 'National', gender: 'women' },
    { name: 'Lille OSC', league: 'Abroad', gender: 'men' },
    { name: 'Bayern Munich', league: 'Abroad', gender: 'men' },
    { name: 'FC Porto', league: 'Abroad', gender: 'men' },
    { name: 'Villarreal', league: 'Abroad', gender: 'men' },
    { name: 'Celtic FC', league: 'Abroad', gender: 'men' },
    { name: 'Marseille', league: 'Abroad', gender: 'men' },
    { name: 'Nice', league: 'Abroad', gender: 'men' },
    { name: 'Mallorca', league: 'Abroad', gender: 'men' },
    { name: 'Nashville SC', league: 'MLS', gender: 'men' },
    { name: 'AS Roma', league: 'NSL / Serie A', gender: 'women' },
    { name: 'Portland Thorns', league: 'NWSL', gender: 'women' },
    { name: 'Chelsea FC', league: 'FA WSL', gender: 'women' },
    { name: 'Utah Royals', league: 'NWSL', gender: 'women' },
    { name: 'Sporting CP', league: 'Abroad', gender: 'women' },
    // Additional Clubs for Abroad Players
    { name: 'Middlesbrough', league: 'Abroad', gender: 'men' },
    { name: 'Portland Timbers', league: 'MLS', gender: 'men' },
    { name: 'Minnesota United', league: 'MLS', gender: 'men' },
    { name: 'San Diego Wave', league: 'NWSL', gender: 'women' },
    { name: 'Manchester United', league: 'FA WSL', gender: 'women' },
    { name: 'Chicago Red Stars', league: 'NWSL', gender: 'women' },
    { name: 'Seattle Reign', league: 'NWSL', gender: 'women' },
    { name: 'Lyon', league: 'Abroad', gender: 'women' },
    { name: 'Grasshoppers', league: 'Abroad', gender: 'men' },
    { name: 'Rosenborg', league: 'Abroad', gender: 'men' },
    { name: 'Hajduk Split', league: 'Abroad', gender: 'men' },
    { name: 'Fulham', league: 'Abroad', gender: 'men' }
  ];

  const teamMap = {};
  console.log('🏟️ Resolving & syncing full club & team catalogue...');

  for (const t of masterTeams) {
    const slug = slugify(t.name);
    
    // First check if team already exists by name or slug
    const { data: existing } = await supabase
      .from('teams')
      .select('id, name')
      .or(`slug.eq.${slug},name.eq.${t.name}`)
      .maybeSingle();

    if (existing) {
      teamMap[t.name] = existing.id;
      console.log(`🔗 Linked Existing Team: ${t.name} (ID: ${existing.id})`);
    } else {
      const payload = {
        name: t.name,
        short_name: t.name,
        league: t.league,
        gender: t.gender,
        slug: slug,
        external_id: slug
      };

      const { data, error } = await supabase
        .from('teams')
        .insert(payload)
        .select('id, name')
        .maybeSingle();

      if (error) {
        // Fallback: fetch again if concurrent insert happened
        const { data: fallback } = await supabase.from('teams').select('id').eq('name', t.name).maybeSingle();
        if (fallback) {
          teamMap[t.name] = fallback.id;
          console.log(`✅ Synced Team via Fallback: ${t.name} (ID: ${fallback.id})`);
        } else {
          console.warn(`⚠️ Team note for ${t.name}: ${error.message}`);
        }
      } else if (data) {
        teamMap[t.name] = data.id;
        console.log(`✅ Synced New Team: ${t.name} (ID: ${data.id})`);
      }
    }
  }

  // 2. Comprehensive Player Rosters
  const cataloguePlayers = [
    // --- MARQUEE & ABROAD STARS ---
    { name: 'Jonathan David', club: 'Lille OSC', league: 'Abroad', gender: 'men', position: 'ST', rating: 8.4, goals: 18, assists: 4, caps: 54, squad_type: 'SENIOR' },
    { name: 'Alphonso Davies', club: 'Bayern Munich', league: 'Abroad', gender: 'men', position: 'LB', rating: 8.1, goals: 2, assists: 6, caps: 50, squad_type: 'SENIOR' },
    { name: 'Stephen Eustáquio', club: 'FC Porto', league: 'Abroad', gender: 'men', position: 'CM', rating: 7.8, goals: 3, assists: 5, caps: 42, squad_type: 'SENIOR' },
    { name: 'Tajon Buchanan', club: 'Villarreal', league: 'Abroad', gender: 'men', position: 'RW', rating: 7.7, goals: 4, assists: 3, caps: 40, squad_type: 'SENIOR' },
    { name: 'Alistair Johnston', club: 'Celtic FC', league: 'Abroad', gender: 'men', position: 'RB', rating: 7.9, goals: 1, assists: 5, caps: 44, squad_type: 'SENIOR' },
    { name: 'Ismaël Koné', club: 'Marseille', league: 'Abroad', gender: 'men', position: 'CM', rating: 7.6, goals: 2, assists: 4, caps: 24, squad_type: 'SENIOR' },
    { name: 'Moïse Bombito', club: 'Nice', league: 'Abroad', gender: 'men', position: 'CB', rating: 7.7, goals: 0, assists: 1, caps: 16, squad_type: 'SENIOR' },
    { name: 'Derek Cornelius', club: 'Marseille', league: 'Abroad', gender: 'men', position: 'CB', rating: 7.5, goals: 1, assists: 0, caps: 26, squad_type: 'SENIOR' },
    { name: 'Cyle Larin', club: 'Mallorca', league: 'Abroad', gender: 'men', position: 'ST', rating: 7.4, goals: 7, assists: 2, caps: 75, squad_type: 'SENIOR' },
    { name: 'Jacob Shaffelburg', club: 'Nashville SC', league: 'MLS', gender: 'men', position: 'LW', rating: 7.6, goals: 5, assists: 6, caps: 18, squad_type: 'SENIOR' },
    { name: 'Liam Millar', club: 'Middlesbrough', league: 'Abroad', gender: 'men', position: 'LW', rating: 7.3, goals: 3, assists: 4, caps: 32, squad_type: 'SENIOR' },
    { name: 'Maxime Crépeau', club: 'Portland Timbers', league: 'MLS', gender: 'men', position: 'GK', rating: 7.5, goals: 0, assists: 0, caps: 22, squad_type: 'SENIOR' },
    { name: 'Dayne St. Clair', club: 'Minnesota United', league: 'MLS', gender: 'men', position: 'GK', rating: 7.4, goals: 0, assists: 0, caps: 6, squad_type: 'SENIOR' },

    // --- WOMEN'S NATIONAL TEAM & ABROAD STARS ---
    { name: 'Jessie Fleming', club: 'Portland Thorns', league: 'NWSL', gender: 'women', position: 'CM', rating: 8.6, goals: 5, assists: 7, caps: 130, squad_type: 'SENIOR' },
    { name: 'Evelyne Viens', club: 'AS Roma', league: 'NSL / Serie A', gender: 'women', position: 'ST', rating: 8.5, goals: 14, assists: 3, caps: 35, squad_type: 'SENIOR' },
    { name: 'Kadeisha Buchanan', club: 'Chelsea FC', league: 'FA WSL', gender: 'women', position: 'CB', rating: 8.3, goals: 2, assists: 1, caps: 150, squad_type: 'SENIOR' },
    { name: 'Ashley Lawrence', club: 'Chelsea FC', league: 'FA WSL', gender: 'women', position: 'FB', rating: 8.2, goals: 1, assists: 8, caps: 140, squad_type: 'SENIOR' },
    { name: 'Cloé Lacasse', club: 'Utah Royals', league: 'NWSL', gender: 'women', position: 'W', rating: 7.9, goals: 6, assists: 4, caps: 38, squad_type: 'SENIOR' },
    { name: 'Olivia Smith', club: 'Sporting CP', league: 'Abroad', gender: 'women', position: 'FW', rating: 8.4, goals: 11, assists: 5, caps: 14, squad_type: 'SENIOR' },
    { name: 'Kailen Sheridan', club: 'San Diego Wave', league: 'NWSL', gender: 'women', position: 'GK', rating: 8.1, goals: 0, assists: 0, caps: 52, squad_type: 'SENIOR' },
    { name: 'Simi Awujo', club: 'Manchester United', league: 'FA WSL', gender: 'women', position: 'CM', rating: 7.8, goals: 1, assists: 2, caps: 20, squad_type: 'SENIOR' },
    { name: 'Julia Grosso', club: 'Chicago Red Stars', league: 'NWSL', gender: 'women', position: 'CM', rating: 7.9, goals: 2, assists: 3, caps: 65, squad_type: 'SENIOR' },
    { name: 'Jordyn Huitema', club: 'Seattle Reign', league: 'NWSL', gender: 'women', position: 'ST', rating: 7.7, goals: 8, assists: 2, caps: 80, squad_type: 'SENIOR' },
    { name: 'Vanessa Gilles', club: 'Lyon', league: 'Abroad', gender: 'women', position: 'CB', rating: 8.0, goals: 4, assists: 0, caps: 45, squad_type: 'SENIOR' },
    { name: 'Jade Rose', club: 'Harvard / National Pool', league: 'NCAA', gender: 'women', position: 'CB', rating: 7.6, goals: 1, assists: 1, caps: 22, squad_type: 'SENIOR' },

    // --- CPL DOMESTIC SQUADS ---
    { name: 'Tristan Borges', club: 'Forge FC', league: 'CPL', gender: 'men', position: 'AM', rating: 7.2, goals: 6, assists: 8, caps: 2, squad_type: 'SENIOR' },
    { name: 'Kyle Bekker', club: 'Forge FC', league: 'CPL', gender: 'men', position: 'CM', rating: 7.1, goals: 4, assists: 7, caps: 3, squad_type: 'SENIOR' },
    { name: 'Alexander Achinioti-Jönsson', club: 'Forge FC', league: 'CPL', gender: 'men', position: 'CB', rating: 7.3, goals: 2, assists: 1, caps: 0, squad_type: 'SENIOR' },
    { name: 'Sergio Camargo', club: 'Cavalry FC', league: 'CPL', gender: 'men', position: 'AM', rating: 7.2, goals: 8, assists: 4, caps: 0, squad_type: 'SENIOR' },
    { name: 'Marco Carducci', club: 'Cavalry FC', league: 'CPL', gender: 'men', position: 'GK', rating: 7.4, goals: 0, assists: 0, caps: 1, squad_type: 'SENIOR' },
    { name: 'Sean Young', club: 'Pacific FC', league: 'CPL', gender: 'men', position: 'CM', rating: 7.1, goals: 5, assists: 3, caps: 1, squad_type: 'SENIOR' },
    { name: 'Terran Campbell', club: 'Pacific FC', league: 'CPL', gender: 'men', position: 'ST', rating: 7.0, goals: 9, assists: 2, caps: 0, squad_type: 'SENIOR' },
    { name: 'Ollie Bassett', club: 'Atlético Ottawa', league: 'CPL', gender: 'men', position: 'AM', rating: 7.5, goals: 11, assists: 6, caps: 0, squad_type: 'SENIOR' },
    { name: 'Ballou Tabla', club: 'Atlético Ottawa', league: 'CPL', gender: 'men', position: 'RW', rating: 7.3, goals: 7, assists: 5, caps: 2, squad_type: 'SENIOR' },
    { name: 'Tobias Warschewski', club: 'Cavalry FC', league: 'CPL', gender: 'men', position: 'ST', rating: 7.4, goals: 12, assists: 3, caps: 0, squad_type: 'SENIOR' },

    // --- NSL DOMESTIC SQUADS ---
    { name: 'Jorian Baucom', club: 'Calgary Wild FC', league: 'NSL', gender: 'women', position: 'ST', rating: 7.6, goals: 13, assists: 2, caps: 1, squad_type: 'SENIOR' },
    { name: 'Marie-Yasmine Alidou', club: 'Montreal Roses FC', league: 'NSL', gender: 'women', position: 'CM', rating: 7.5, goals: 6, assists: 8, caps: 8, squad_type: 'SENIOR' },
    { name: 'Sarah Stratigakis', club: 'AFC Toronto', league: 'NSL', gender: 'women', position: 'CM', rating: 7.3, goals: 4, assists: 5, caps: 5, squad_type: 'SENIOR' },

    // --- CANADIAN MLS CLUBS & PATHWAYS ---
    { name: 'Jonathan Osorio', club: 'Toronto FC', league: 'MLS', gender: 'men', position: 'CM', rating: 7.5, goals: 6, assists: 5, caps: 71, squad_type: 'SENIOR' },
    { name: 'Richie Laryea', club: 'Toronto FC', league: 'MLS', gender: 'men', position: 'RB', rating: 7.6, goals: 2, assists: 6, caps: 52, squad_type: 'SENIOR' },
    { name: 'Kamal Miller', club: 'Portland Timbers', league: 'MLS', gender: 'men', position: 'CB', rating: 7.4, goals: 1, assists: 2, caps: 44, squad_type: 'SENIOR' },
    { name: 'Samuel Piette', club: 'CF Montréal', league: 'MLS', gender: 'men', position: 'DM', rating: 7.3, goals: 0, assists: 2, caps: 68, squad_type: 'SENIOR' },
    { name: 'Mathieu Choinière', club: 'Grasshoppers', league: 'Abroad', gender: 'men', position: 'CM', rating: 7.4, goals: 3, assists: 4, caps: 4, squad_type: 'SENIOR' },
    { name: 'Ali Ahmed', club: 'Vancouver Whitecaps', league: 'MLS', gender: 'men', position: 'LM', rating: 7.5, goals: 3, assists: 5, caps: 8, squad_type: 'SENIOR' },
    { name: 'Nathan Saliba', club: 'CF Montréal', league: 'MLS', gender: 'men', position: 'DM', rating: 7.2, goals: 1, assists: 2, caps: 2, squad_type: 'U-23' },
    { name: 'Jayden Nelson', club: 'Rosenborg', league: 'Abroad', gender: 'men', position: 'RW', rating: 7.1, goals: 4, assists: 3, caps: 4, squad_type: 'U-23' },
    { name: 'Niko Sigur', club: 'Hajduk Split', league: 'Abroad', gender: 'men', position: 'RB', rating: 7.3, goals: 2, assists: 3, caps: 3, squad_type: 'U-23' },
    { name: 'Luc de Fougerolles', club: 'Fulham', league: 'Abroad', gender: 'men', position: 'CB', rating: 7.1, goals: 0, assists: 0, caps: 2, squad_type: 'U-23' }
  ];

  console.log(`⚽ Syncing master player catalogue (${cataloguePlayers.length} athletes)...`);

  for (const p of cataloguePlayers) {
    const slug = slugify(p.name);
    const targetTeamId = teamMap[p.club] || null;

    const playerPayload = {
      external_id: slug,
      slug: slug,
      name: p.name,
      position: p.position,
      league: p.league,
      gender: p.gender,
      team_id: targetTeamId,
      squad_type: p.squad_type || 'SENIOR',
      goals: p.goals || 0,
      assists: p.assists || 0,
      rating: p.rating || 7.0,
      caps: p.caps || 0
    };

    const { error: upsertError } = await supabase
      .from('players')
      .upsert(playerPayload, { onConflict: 'external_id' });

    if (upsertError) {
      console.error(`⚠️ Error syncing ${p.name}: ${upsertError.message}`);
    } else {
      console.log(`✅ Synced Player: ${p.name} → Club: ${p.club} (Team ID: ${targetTeamId || 'N/A'})`);
    }
  }

  console.log('🎉 Full Catalogue Ingestion Complete! All professional player dossiers, leagues, and clubs are live in Supabase.');
}

runFullCatalogueImport().catch(err => {
  console.error('Fatal import failure:', err);
  process.exit(1);
});
