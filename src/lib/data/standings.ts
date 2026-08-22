// Add these to your existing TEAM_ACTIVE_SEASONS record in src/lib/data/standings.ts
const TEAM_ACTIVE_SEASONS: Record<string, { start: number; end: number }> = {
  // ... existing CPL & NSL clubs ...
  'Forge FC': { start: 2019, end: 2026 },
  'Cavalry FC': { start: 2019, end: 2026 },
  'Pacific FC': { start: 2019, end: 2026 },
  'HFX Wanderers FC': { start: 2019, end: 2026 },
  'Atlético Ottawa': { start: 2020, end: 2026 },
  'Valour FC': { start: 2019, end: 2026 },
  'York United FC': { start: 2019, end: 2024 },
  'Inter Toronto FC': { start: 2025, end: 2026 },
  'Vancouver FC': { start: 2023, end: 2026 },
  'FC Edmonton': { start: 2019, end: 2023 },
  'FC Supra du Québec': { start: 2019, end: 2026 },
  // NSL Clubs
  'AFC Toronto': { start: 2025, end: 2026 },
  'Roses de Montréal': { start: 2025, end: 2026 },
  'Vancouver Rise': { start: 2025, end: 2026 },
  'Calgary Wild': { start: 2025, end: 2026 },
  'Ottawa Rapid': { start: 2025, end: 2026 },
  'Halifax Tides': { start: 2025, end: 2026 },
  // MLS Canadian Franchises
  'Toronto FC': { start: 2019, end: 2026 },
  'CF Montréal': { start: 2019, end: 2026 },
  'Vancouver Whitecaps FC': { start: 2019, end: 2026 },
  // NWSL Tracked Clubs (Canadian Expats)
  'Portland Thorns FC': { start: 2025, end: 2026 },
  'San Diego Wave FC': { start: 2025, end: 2026 },
  'Seattle Reign FC': { start: 2025, end: 2026 },
  'Racing Louisville FC': { start: 2025, end: 2026 },
  'Washington Spirit': { start: 2025, end: 2026 },
  'North Carolina Courage': { start: 2025, end: 2026 },
  'Chicago Red Stars': { start: 2025, end: 2026 },
};

const NSL_CLUBS = new Set(['AFC Toronto', 'Roses de Montréal', 'Vancouver Rise', 'Calgary Wild', 'Ottawa Rapid', 'Halifax Tides']);
const MLS_CLUBS = new Set(['Toronto FC', 'CF Montréal', 'Vancouver Whitecaps FC']);
const NWSL_CLUBS = new Set([
  'Portland Thorns FC', 'San Diego Wave FC', 'Seattle Reign FC', 
  'Racing Louisville FC', 'Washington Spirit', 'North Carolina Courage', 'Chicago Red Stars'
]);

// Inside computeStandings, add the league-segregation filter rule:
    rawTeams.forEach(team => {
      const canonicalName = normalizeTeamName(team.name, season);
      const canonicalLower = canonicalName.toLowerCase();

      const lifespan = TEAM_ACTIVE_SEASONS[canonicalName];
      if (!lifespan) return;
      if (season < lifespan.start || season > lifespan.end) return;

      const isNsl = NSL_CLUBS.has(canonicalName);
      const isMls = MLS_CLUBS.has(canonicalName);
      const isNwsl = NWSL_CLUBS.has(canonicalName);

      if (targetCompUpper.includes('NSL') && !isNsl) return;
      if (targetCompUpper.includes('CPL') && (isNsl || isMls || isNwsl)) return;
      if (targetCompUpper.includes('MLS') && !isMls) return;
      if (targetCompUpper.includes('NWSL') && !isNwsl) return;

      if (!uniqueTeamsMap.has(canonicalLower)) {
        uniqueTeamsMap.set(canonicalLower, {
          ...team,
          name: canonicalName,
        });
      }
    });

// Export helper functions at the bottom:
export async function getMlsStandings(season: number = 2026): Promise<StandingsRow[]> {
  return computeStandings('MLS', season);
}

export async function getNwslStandings(season: number = 2026): Promise<StandingsRow[]> {
  return computeStandings('NWSL', season);
}
