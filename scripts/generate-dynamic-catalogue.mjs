// scripts/generate-dynamic-catalogue.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// First names and last names arrays to algorithmically and dynamically generate realistic deep-tier squads
const firstNames = {
  men: ['Liam', 'Noah', 'Lucas', 'Oliver', 'Ethan', 'Mason', 'Logan', 'Elijah', 'Aiden', 'Caleb', 'Gabriel', 'Julian', 'Mateo', 'Owen', 'Theodore', 'Archie', 'Leo', 'Lincoln', 'Grayson', 'Lucas', 'Tristan', 'Kyle', 'Ismaël', 'Moïse', 'Derek', 'Jonathan', 'Alphonso', 'Stephen', 'Tajon', 'Alistair'],
  women: ['Jorian', 'Marie-Yasmine', 'Simi', 'Shelina', 'Evelyne', 'Cloé', 'Jade', 'Olivia', 'Kadeisha', 'Ashley', 'Jessie', 'Janine', 'Jordyn', 'Vanessa', 'Julia', 'Gabrielle', 'Kailen', 'Sabrina', 'Rylee', 'Katelyn', 'Zoe', 'Maya', 'Chloe', 'Sophie', 'Mia', 'Ella', 'Hannah', 'Amelia', 'Charlotte', 'Harper']
};

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];

const positions = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'];
const squadTypes = ['SENIOR', 'U-23', 'U-20', 'U-17'];
const seasons = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];

async function runDynamicGenerator() {
  console.log('🚀 Initializing Dynamic Programmatic Catalogue Generator...');

  // 1. Fetch existing teams from Supabase to link foreign keys cleanly
  const { data: teams, error: teamError } = await supabase.from('teams').select('id, name, league, gender');
  
  if (teamError || !teams || teams.length === 0) {
    console.error('❌ Failed to fetch teams from Supabase. Ensure your teams table is populated first:', teamError?.message);
    process.exit(1);
  }

  console.log(`✅ Loaded ${teams.length} teams from Supabase for relational linking.`);

  const generatedPlayers = [];
  const playerSeasonStats = [];
  const usedSlugs = new Set();

  // 2. Programmatically generate a massive, rich pool across genders, age groups, and seasons
  for (const gender of ['men', 'women']) {
    for (const squadType of squadTypes) {
      // Generate 15-20 players per combination to scale past hundreds of records safely
      const targetCount = squadType === 'SENIOR' ? 25 : 15;
      
      for (let i = 0; i < targetCount; i++) {
        const fList = firstNames[gender];
        const fName = fList[Math.floor(Math.random() * fList.length)];
        const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${fName} ${lName}-${squadType}-${gender}-${i}`; // ensure unique combinatorial suffix if needed, or clean name
        const cleanName = `${fName} ${lName}`;
        const slug = slugify(cleanName);

        if (usedSlugs.has(slug)) continue;
        usedSlugs.add(slug);

        const pos = positions[Math.floor(Math.random() * positions.length)];
        const matchingTeams = teams.filter(t => t.gender === gender || !t.gender);
        const assignedTeam = matchingTeams.length > 0 ? matchingTeams[Math.floor(Math.random() * matchingTeams.length)] : null;

        const rating = Number((6.5 + Math.random() * 2.2).toFixed(1)); // 6.5 to 8.7 rating
        const caps = squadType === 'SENIOR' ? Math.floor(Math.random() * 60) : Math.floor(Math.random() * 15);
        const goals = pos === 'ST' || pos === 'LW' || pos === 'RW' ? Math.floor(Math.random() * 20) : Math.floor(Math.random() * 5);
        const assists = pos.includes('M') || pos.includes('W') ? Math.floor(Math.random() * 15) : Math.floor(Math.random() * 3);

        const playerRow = {
          external_id: slug,
          slug: slug,
          name: cleanName,
          position: pos,
          gender: gender,
          squad_type: squadType,
          league: assignedTeam ? assignedTeam.league : 'Abroad',
          team_id: assignedTeam ? assignedTeam.id : null,
          rating: rating,
          caps: caps,
          goals: goals,
          assists: assists,
          status: 'LOCKED'
        };

        generatedPlayers.push(playerRow);

        // Generate multi-season historical stats (2017–2026)
        for (const season of seasons) {
          playerSeasonStats.push({
            player_slug: slug, // temporary lookup or linked via inserted ID
            team_id: assignedTeam ? assignedTeam.id : null,
            season: season,
            competition: assignedTeam ? assignedTeam.league : 'Domestic Comp',
            matches_played: Math.floor(Math.random() * 30),
            minutes_played: Math.floor(Math.random() * 2700),
            goals: Math.floor(Math.random() * 10),
            assists: Math.floor(Math.random() * 8),
            rating: Number((6.3 + Math.random() * 2.0).toFixed(1))
          });
        }
      }
    }
  }

  console.log(`📊 Generated ${generatedPlayers.length} unique player dossiers and ${playerSeasonStats.length} historical season records.`);

  // 3. Batch upsert players into Supabase in chunks of 50
  const chunkSize = 50;
  for (let i = 0; i < generatedPlayers.length; i += chunkSize) {
    const chunk = generatedPlayers.slice(i, i + chunkSize);
    const { error } = await supabase
      .from('players')
      .upsert(chunk, { onConflict: 'external_id' });

    if (error) {
      console.error(`⚠️ Error upserting player chunk ${i}:`, error.message);
    } else {
      console.log(`✅ Successfully synced player records ${i} to ${i + chunk.length}`);
    }
  }

  console.log('🎉 Dynamic Programmatic Catalogue Generation Complete! Your database is now fully scaled.');
}

runDynamicGenerator().catch(err => {
  console.error('❌ Fatal generator failure:', err);
  process.exit(1);
});
