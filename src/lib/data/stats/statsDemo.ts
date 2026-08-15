// src/lib/data/stats/statsDemo.ts
//
// Extracted out of src/app/stats/page.tsx (which was 1,247 lines mixing
// data, presentational components, and page logic in one file). This is
// the data half — mock leaderboards, streams, records, provincial helpers.
// All development fixtures; see the page header's DEMO DATA badge.

export const menGoldenBoot = [
  { rank: 1, name: 'Terran Campbell', club: 'Forge FC', value: '14 G', initials: 'T.C' },
  { rank: 2, name: 'Moses Dyer', club: 'Vancouver FC', value: '11 G', initials: 'M.D' },
  { rank: 3, name: 'Alejandro Díaz', club: 'Pacific FC', value: '10 G', initials: 'A.D' },
  { rank: 4, name: 'Gabriele Prokop', club: 'York United', value: '9 G', initials: 'G.P' },
  { rank: 5, name: 'Brian Wright', club: 'Atlético Ottawa', value: '8 G', initials: 'B.W' },
];
export const womenGoldenBoot = [
  { rank: 1, name: 'Jorian Baucom', club: 'AFC Toronto', value: '11 G', initials: 'J.B' },
  { rank: 2, name: 'Evelyne Viens', club: 'Montreal Roses', value: '9 G', initials: 'E.V' },
  { rank: 3, name: 'Melissa Tancredi', club: 'Calgary Wild', value: '8 G', initials: 'M.T' },
  { rank: 4, name: 'Cloé Lacasse', club: 'Ottawa Rapid', value: '7 G', initials: 'C.L' },
  { rank: 5, name: 'Sarah Stratigakis', club: 'Vancouver Rise', value: '6 G', initials: 'S.S' },
];
export const menAssists = [
  { rank: 1, name: 'Manny Aparicio', club: 'Pacific FC', value: '8 AST', initials: 'M.A' },
  { rank: 2, name: 'Tristan Borges', club: 'Forge FC', value: '8 AST', initials: 'T.B' },
  { rank: 3, name: 'Ali Musse', club: 'Cavalry FC', value: '7 AST', initials: 'A.M' },
  { rank: 4, name: 'Sean Young', club: 'Pacific FC', value: '5 AST', initials: 'S.Y' },
  { rank: 5, name: 'Brian Wright', club: 'Atlético Ottawa', value: '5 AST', initials: 'B.W' },
];
export const womenAssists = [
  { rank: 1, name: 'Sarah Stratigakis', club: 'Vancouver Rise', value: '6 AST', initials: 'S.S' },
  { rank: 2, name: 'Simi Awujo', club: 'Montreal Roses', value: '5 AST', initials: 'S.A' },
  { rank: 3, name: 'Evelyne Viens', club: 'Montreal Roses', value: '4 AST', initials: 'E.V' },
  { rank: 4, name: 'Adriana Leon', club: 'Calgary Wild', value: '4 AST', initials: 'A.L' },
  { rank: 5, name: 'Cloé Lacasse', club: 'Ottawa Rapid', value: '3 AST', initials: 'C.L' },
];
export const menCleanSheets = [
  { rank: 1, name: 'Triston Henry', club: 'Forge FC', value: '7 CS', initials: 'T.H' },
  { rank: 2, name: 'Marco Carducci', club: 'Cavalry FC', value: '6 CS', initials: 'M.C' },
  { rank: 3, name: 'Nathan Ingham', club: 'Atlético Ottawa', value: '5 CS', initials: 'N.I' },
  { rank: 4, name: 'Callum Irving', club: 'Pacific FC', value: '4 CS', initials: 'C.I' },
  { rank: 5, name: 'Sean Melvin', club: 'Atletico Ottawa', value: '3 CS', initials: 'S.M' },
];
export const womenCleanSheets = [
  { rank: 1, name: 'Katelyn Rowland', club: 'Calgary Wild', value: '6 CS', initials: 'K.R' },
  { rank: 2, name: 'Rylee Foster', club: 'AFC Toronto', value: '5 CS', initials: 'R.F' },
  { rank: 3, name: 'Stephanie Labbé', club: 'Montreal Roses', value: '4 CS', initials: 'S.L' },
  { rank: 4, name: 'Kailen Sheridan', club: 'San Diego Wave', value: '3 CS', initials: 'K.S' },
  { rank: 5, name: 'Sabrina D’Angelo', club: 'Aston Villa', value: '3 CS', initials: 'S.D' },
];
export const menAbroad = [
  { rank: 1, name: 'Jonathan David', club: 'Lille OSC // FRA', value: '8.4 RTG', initials: 'J.D' },
  { rank: 2, name: 'Alphonso Davies', club: 'Bayern Munich // GER', value: '8.1 RTG', initials: 'A.D' },
  { rank: 3, name: 'Stephen Eustáquio', club: 'FC Porto // POR', value: '7.8 RTG', initials: 'S.E' },
  { rank: 4, name: 'Tajon Buchanan', club: 'Villarreal // ESP', value: '7.8 RTG', initials: 'T.B' },
  { rank: 5, name: 'Ismaël Koné', club: 'Marseille // FRA', value: '7.7 RTG', initials: 'I.K' },
];
export const womenAbroad = [
  { rank: 1, name: 'Jessie Fleming', club: 'Portland Thorns // USA', value: '8.3 RTG', initials: 'J.F' },
  { rank: 2, name: 'Kadeisha Buchanan', club: 'Chelsea FC // ENG', value: '8.2 RTG', initials: 'K.B' },
  { rank: 3, name: 'Julia Grosso', club: 'Chicago Red Stars // USA', value: '8.0 RTG', initials: 'J.G' },
  { rank: 4, name: 'Evelyne Viens', club: 'AS Roma // ITA', value: '7.9 RTG', initials: 'E.V' },
  { rank: 5, name: 'Cloé Lacasse', club: 'Utah Royals // USA', value: '7.8 RTG', initials: 'C.L' },
];
// --- 10-Player Stream Data Lists ---
export const cplStreamPlayers = [
  { rank: 1, name: 'Terran Campbell', club: 'Forge FC', ga: '14 G • 3 A', rtg: '8.2' },
  { rank: 2, name: 'Moses Dyer', club: 'Vancouver FC', ga: '11 G • 2 A', rtg: '7.9' },
  { rank: 3, name: 'Alejandro Díaz', club: 'Pacific FC', ga: '10 G • 4 A', rtg: '7.8' },
  { rank: 4, name: 'Gabriele Prokop', club: 'York United', ga: '9 G • 1 A', rtg: '7.6' },
  { rank: 5, name: 'Brian Wright', club: 'Atlético Ottawa', ga: '8 G • 5 A', rtg: '7.5' },
  { rank: 6, name: 'Malcolm Shaw', club: 'Cavalry FC', ga: '7 G • 3 A', rtg: '7.4' },
  { rank: 7, name: 'Ali Musse', club: 'Cavalry FC', ga: '6 G • 7 A', rtg: '7.8' },
  { rank: 8, name: 'Tristan Borges', club: 'Forge FC', ga: '6 G • 8 A', rtg: '8.0' },
  { rank: 9, name: 'Matteo de Brienne', club: 'Atlético Ottawa', ga: '5 G • 2 A', rtg: '7.3' },
  { rank: 10, name: 'Sean Young', club: 'Pacific FC', ga: '4 G • 5 A', rtg: '7.5' },
];
export const nslStreamPlayers = [
  { rank: 1, name: 'Jorian Baucom', club: 'AFC Toronto', ga: '11 G • 2 A', rtg: '8.3' },
  { rank: 2, name: 'Evelyne Viens', club: 'Montreal Roses', ga: '9 G • 4 A', rtg: '8.1' },
  { rank: 3, name: 'Melissa Tancredi', club: 'Calgary Wild', ga: '8 G • 1 A', rtg: '7.7' },
  { rank: 4, name: 'Cloé Lacasse', club: 'Ottawa Rapid', ga: '7 G • 3 A', rtg: '7.6' },
  { rank: 5, name: 'Sarah Stratigakis', club: 'Vancouver Rise', ga: '6 G • 6 A', rtg: '7.5' },
  { rank: 6, name: 'Jade Rose', club: 'AFC Toronto', ga: '5 G • 2 A', rtg: '7.4' },
  { rank: 7, name: 'Simi Awujo', club: 'Montreal Roses', ga: '4 G • 5 A', rtg: '7.6' },
  { rank: 8, name: 'Shelina Zadorsky', club: 'Halifax Tides', ga: '3 G • 1 A', rtg: '7.2' },
  { rank: 9, name: 'Vanessa Gilles', club: 'Vancouver Rise', ga: '3 G • 0 A', rtg: '7.5' },
  { rank: 10, name: 'Adriana Leon', club: 'Calgary Wild', ga: '2 G • 4 A', rtg: '7.3' },
];
export const mlsStreamPlayers = [
  { rank: 1, name: 'Jacen Russell-Rowe', club: 'Columbus Crew', ga: '8 G • 3 A', mins: '1,240' },
  { rank: 2, name: 'Mathieu Choinière', club: 'CF Montréal', ga: '3 G • 7 A', mins: '2,150' },
  { rank: 3, name: 'Kamal Miller', club: 'Portland Timbers', ga: '1 G • 2 A', mins: '2,400' },
  { rank: 4, name: 'Richie Laryea', club: 'Toronto FC', ga: '2 G • 4 A', mins: '1,890' },
  { rank: 5, name: 'Ali Ahmed', club: 'Vancouver Whitecaps', ga: '2 G • 5 A', mins: '1,650' },
  { rank: 6, name: 'Jonathan Osorio', club: 'Toronto FC', ga: '4 G • 3 A', mins: '1,980' },
  { rank: 7, name: 'Jayden Nelson', club: 'Vancouver Whitecaps', ga: '3 G • 4 A', mins: '1,420' },
  { rank: 8, name: 'Nathan Saliba', club: 'CF Montréal', ga: '1 G • 3 A', mins: '1,710' },
  { rank: 9, name: 'Dayne St. Clair', club: 'Minnesota United', ga: '0 G • 0 A', mins: '2,700' },
  { rank: 10, name: 'Lucas Cavallini', club: 'Vancouver Whitecaps', ga: '6 G • 1 A', mins: '1,310' },
];
export const abroadStreamPlayers = [
  { rank: 1, name: 'Jonathan David', club: 'Lille OSC (Ligue 1)', ga: '18 G • 4 A', rtg: '8.4' },
  { rank: 2, name: 'Alphonso Davies', club: 'Bayern Munich (Bundesliga)', ga: '2 G • 6 A', rtg: '8.1' },
  { rank: 3, name: 'Tajon Buchanan', club: 'Villarreal (La Liga)', ga: '4 G • 3 A', rtg: '7.8' },
  { rank: 4, name: 'Ismaël Koné', club: 'Marseille (Ligue 1)', ga: '2 G • 3 A', rtg: '7.7' },
  { rank: 5, name: 'Liam Millar', club: 'Hull City (Championship)', ga: '5 G • 4 A', rtg: '7.5' },
  { rank: 6, name: 'Stephen Eustáquio', club: 'FC Porto (Primeira Liga)', ga: '3 G • 5 A', rtg: '7.8' },
  { rank: 7, name: 'Cyle Larin', club: 'RCD Mallorca (La Liga)', ga: '7 G • 1 A', rtg: '7.4' },
  { rank: 8, name: 'Alistair Johnston', club: 'Celtic FC (Scottish Premiership)', ga: '1 G • 6 A', rtg: '7.9' },
  { rank: 9, name: 'Moïse Bombito', club: 'OGC Nice (Ligue 1)', ga: '1 G • 0 A', rtg: '7.6' },
  { rank: 10, name: 'Derek Cornelius', club: 'Marseille (Ligue 1)', ga: '0 G • 1 A', rtg: '7.5' },
];
// --- TEAM OF THE WEEK: ALL-CANADIAN COMPOSITE XI (4-3-3), MIXED LEAGUES ---
export const menTeamOfWeek = [
  { playerId: 'motw-m-01', name: 'Triston Henry', club: 'Forge FC', league: 'CPL', initials: 'T.H', x: 50, y: 92, note: 'Clean sheet' },
  { playerId: 'motw-m-02', name: 'Richie Laryea', club: 'Toronto FC', league: 'MLS', initials: 'R.L', x: 15, y: 72 },
  { playerId: 'motw-m-03', name: 'Alistair Johnston', club: 'Celtic FC', league: 'ABROAD', initials: 'A.J', x: 38, y: 78 },
  { playerId: 'motw-m-04', name: 'Moïse Bombito', club: 'OGC Nice', league: 'ABROAD', initials: 'M.B', x: 62, y: 78 },
  { playerId: 'motw-m-05', name: 'Karifa Yao', club: 'Forge FC', league: 'CPL', initials: 'K.Y', x: 85, y: 72 },
  { playerId: 'motw-m-06', name: 'Ali Musse', club: 'Cavalry FC', league: 'CPL', initials: 'A.M', x: 25, y: 50 },
  { playerId: 'motw-m-07', name: 'Mathieu Choinière', club: 'CF Montréal', league: 'MLS', initials: 'M.C', x: 50, y: 46, note: '7 assists this month' },
  { playerId: 'motw-m-08', name: 'Stephen Eustáquio', club: 'FC Porto', league: 'ABROAD', initials: 'S.E', x: 75, y: 50 },
  { playerId: 'motw-m-09', name: 'Tristan Borges', club: 'Forge FC', league: 'CPL', initials: 'T.B', x: 15, y: 22 },
  { playerId: 'motw-m-10', name: 'Jonathan David', club: 'Lille OSC', league: 'ABROAD', initials: 'J.D', x: 50, y: 14, note: 'Brace, Ligue 1' },
  { playerId: 'motw-m-11', name: 'Tajon Buchanan', club: 'Villarreal', league: 'ABROAD', initials: 'T.B', x: 85, y: 22 },
];
export const womenTeamOfWeek = [
  { playerId: 'motw-w-01', name: 'Katelyn Rowland', club: 'Calgary Wild', league: 'NSL', initials: 'K.R', x: 50, y: 92, note: 'Clean sheet' },
  { playerId: 'motw-w-02', name: 'Jade Rose', club: 'AFC Toronto', league: 'NSL', initials: 'J.R', x: 15, y: 72 },
  { playerId: 'motw-w-03', name: 'Kadeisha Buchanan', club: 'Chelsea FC', league: 'ABROAD', initials: 'K.B', x: 38, y: 78 },
  { playerId: 'motw-w-04', name: 'Vanessa Gilles', club: 'Vancouver Rise', league: 'NSL', initials: 'V.G', x: 62, y: 78 },
  { playerId: 'motw-w-05', name: 'Shelina Zadorsky', club: 'Halifax Tides', league: 'NSL', initials: 'S.Z', x: 85, y: 72 },
  { playerId: 'motw-w-06', name: 'Sarah Stratigakis', club: 'Vancouver Rise', league: 'NSL', initials: 'S.S', x: 25, y: 50 },
  { playerId: 'motw-w-07', name: 'Julia Grosso', club: 'Chicago Red Stars', league: 'ABROAD', initials: 'J.G', x: 50, y: 46 },
  { playerId: 'motw-w-08', name: 'Simi Awujo', club: 'Montreal Roses', league: 'NSL', initials: 'S.A', x: 75, y: 50 },
  { playerId: 'motw-w-09', name: 'Cloé Lacasse', club: 'Utah Royals', league: 'ABROAD', initials: 'C.L', x: 15, y: 22 },
  { playerId: 'motw-w-10', name: 'Jorian Baucom', club: 'AFC Toronto', league: 'NSL', initials: 'J.B', x: 50, y: 14, note: 'Hat-trick' },
  { playerId: 'motw-w-11', name: 'Evelyne Viens', club: 'Montreal Roses', league: 'NSL', initials: 'E.V', x: 85, y: 22 },
];
// --- DISCIPLINE TRACKER: CARDED LEADERS ACROSS ALL LEAGUES ---
export const menDisciplineLeaders = [
  { rank: 1, playerId: 'disc-m-01', name: 'Malcolm Shaw', club: 'Cavalry FC', league: 'CPL', yellows: 6, reds: 0 },
  { rank: 2, playerId: 'disc-m-02', name: 'Jonathan Osorio', club: 'Toronto FC', league: 'MLS', yellows: 5, reds: 0 },
  { rank: 3, playerId: 'disc-m-03', name: 'Derek Cornelius', club: 'Marseille', league: 'ABROAD', yellows: 5, reds: 1 },
  { rank: 4, playerId: 'disc-m-04', name: 'Kamal Miller', club: 'Portland Timbers', league: 'MLS', yellows: 4, reds: 0 },
  { rank: 5, playerId: 'disc-m-05', name: 'Sean Young', club: 'Pacific FC', league: 'CPL', yellows: 4, reds: 0 },
];
export const womenDisciplineLeaders = [
  { rank: 1, playerId: 'disc-w-01', name: 'Vanessa Gilles', club: 'Vancouver Rise', league: 'NSL', yellows: 5, reds: 0 },
  { rank: 2, playerId: 'disc-w-02', name: 'Shelina Zadorsky', club: 'Halifax Tides', league: 'NSL', yellows: 4, reds: 0 },
  { rank: 3, playerId: 'disc-w-03', name: 'Kadeisha Buchanan', club: 'Chelsea FC', league: 'ABROAD', yellows: 4, reds: 0 },
  { rank: 4, playerId: 'disc-w-04', name: 'Jade Rose', club: 'AFC Toronto', league: 'NSL', yellows: 3, reds: 0 },
  { rank: 5, playerId: 'disc-w-05', name: 'Simi Awujo', club: 'Montreal Roses', league: 'NSL', yellows: 3, reds: 0 },
];
export const menSuspensionWatch = [
  { playerId: 'susp-m-01', name: 'Kamal Miller', club: 'Portland Timbers', league: 'MLS', yellows: 4 },
  { playerId: 'susp-m-02', name: 'Sean Young', club: 'Pacific FC', league: 'CPL', yellows: 4 },
];
export const womenSuspensionWatch = [
  { playerId: 'susp-w-01', name: 'Shelina Zadorsky', club: 'Halifax Tides', league: 'NSL', yellows: 4 },
  { playerId: 'susp-w-02', name: 'Kadeisha Buchanan', club: 'Chelsea FC', league: 'ABROAD', yellows: 4 },
];
// --- INTERNATIONAL DUTY TRACKER: CANMNT / CANWNT CAPS & GOALS ---
export const menDutyTracker = [
  { rank: 1, playerId: 'duty-m-01', name: 'Richie Laryea', position: 'RB', caps: 45, goals: 2, lastCalled: 'Jun 2026' },
  { rank: 2, playerId: 'duty-m-02', name: 'Alphonso Davies', position: 'LB', caps: 42, goals: 3, lastCalled: 'Jun 2026' },
  { rank: 3, playerId: 'duty-m-03', name: 'Jonathan David', position: 'ST', caps: 38, goals: 19, lastCalled: 'Jun 2026' },
  { rank: 4, playerId: 'duty-m-04', name: 'Stephen Eustáquio', position: 'CM', caps: 35, goals: 4, lastCalled: 'Jun 2026' },
  { rank: 5, playerId: 'duty-m-05', name: 'Alistair Johnston', position: 'RB', caps: 33, goals: 2, lastCalled: 'Jun 2026' },
  { rank: 6, playerId: 'duty-m-06', name: 'Tajon Buchanan', position: 'RW', caps: 30, goals: 8, lastCalled: 'Jun 2026' },
  { rank: 7, playerId: 'duty-m-07', name: 'Ismaël Koné', position: 'CM', caps: 22, goals: 3, lastCalled: 'Mar 2026' },
  { rank: 8, playerId: 'duty-m-08', name: 'Moïse Bombito', position: 'CB', caps: 18, goals: 1, lastCalled: 'Jun 2026' },
];
export const womenDutyTracker = [
  { rank: 1, playerId: 'duty-w-01', name: 'Jessie Fleming', position: 'CM', caps: 130, goals: 30, lastCalled: 'Jun 2026' },
  { rank: 2, playerId: 'duty-w-02', name: 'Kadeisha Buchanan', position: 'CB', caps: 130, goals: 5, lastCalled: 'Jun 2026' },
  { rank: 3, playerId: 'duty-w-03', name: 'Cloé Lacasse', position: 'LW', caps: 55, goals: 20, lastCalled: 'Jun 2026' },
  { rank: 4, playerId: 'duty-w-04', name: 'Julia Grosso', position: 'CM', caps: 60, goals: 8, lastCalled: 'Jun 2026' },
  { rank: 5, playerId: 'duty-w-05', name: 'Evelyne Viens', position: 'ST', caps: 45, goals: 15, lastCalled: 'Jun 2026' },
  { rank: 6, playerId: 'duty-w-06', name: 'Vanessa Gilles', position: 'CB', caps: 40, goals: 1, lastCalled: 'Jun 2026' },
  { rank: 7, playerId: 'duty-w-07', name: 'Sarah Stratigakis', position: 'CM', caps: 25, goals: 3, lastCalled: 'Mar 2026' },
  { rank: 8, playerId: 'duty-w-08', name: 'Jorian Baucom', position: 'ST', caps: 12, goals: 4, lastCalled: 'Mar 2026' },
];
// --- Helper mock data functions for the Provincial Mini Card ---
export function provStatsStatsHeading(prov: 'ON' | 'QC' | 'BC' | 'AB') {
  switch (prov) {
    case 'ON': return 'LEAGUE1 ONTARIO';
    case 'QC': return 'LIGUE1 QUÉBEC';
    case 'BC': return 'LEAGUE1 BC';
    case 'AB': return 'LEAGUE1 ALBERTA';
  }
}
export function getProvincialScorers(prov: 'ON' | 'QC' | 'BC' | 'AB') {
  switch (prov) {
    case 'ON': return [
      { name: 'Emil Nielsen', club: 'Simcoe County Rovers', goals: 16 },
      { name: 'Liam Fraser', club: 'Scrosoppi FC', goals: 14 },
      { name: 'Kobe Da Silva', club: 'Vaughan Azzurri', goals: 12 },
      { name: 'Daulton Robertson', club: 'Woodbridge Strikers', goals: 10 },
      { name: 'Stefan Nikolic', club: 'North Toronto Nitros', goals: 9 },
    ];
    case 'QC': return [
      { name: 'Adama Konte', club: 'CS Saint-Laurent', goals: 13 },
      { name: 'William Legault', club: 'AS Blainville', goals: 11 },
      { name: 'Nicolas Bertrand', club: 'FC Laval', goals: 9 },
      { name: 'Samuel Piette Jr.', club: 'CF Montréal U23', goals: 8 },
      { name: 'Karim Benaissa', club: 'CS Longueuil', goals: 7 },
    ];
    case 'BC': return [
      { name: 'Connor Douglas', club: 'TSS Rovers', goals: 12 },
      { name: 'Takumi Hayama', club: 'Altitude FC', goals: 10 },
      { name: 'Matteo Campagna', club: 'Whitecaps Elite', goals: 8 },
      { name: 'Josh Pritchard', club: 'Victoria Highlanders', goals: 7 },
      { name: 'Callum Montgomery', club: 'Unity FC', goals: 6 },
    ];
    case 'AB': return [
      { name: 'Ezekiel Adebisi', club: 'Calgary Foothills', goals: 11 },
      { name: 'Marcus Kallay', club: 'Cavalry U21', goals: 9 },
      { name: 'Julian Trott', club: 'Edmonton Scottish', goals: 7 },
      { name: 'Liam McDevitt', club: 'St. Albert Impact', goals: 6 },
      { name: 'Noah Czerwinski', club: 'Calgary Foothills', goals: 5 },
    ];
  }
}
export function getProvincialStandings(prov: 'ON' | 'QC' | 'BC' | 'AB') {
  switch (prov) {
    case 'ON': return [
      { pos: 1, club: 'Vaughan Azzurri', pts: 42, gd: '+21' },
      { pos: 2, club: 'Scrosoppi FC', pts: 41, gd: '+19' },
      { pos: 3, club: 'Simcoe Rovers', pts: 38, gd: '+15' },
      { pos: 4, club: 'Woodbridge Strikers', pts: 35, gd: '+10' },
      { pos: 5, club: 'North Toronto Nitros', pts: 33, gd: '+8' },
    ];
    case 'QC': return [
      { pos: 1, club: 'CS Saint-Laurent', pts: 39, gd: '+18' },
      { pos: 2, club: 'AS Blainville', pts: 35, gd: '+12' },
      { pos: 3, club: 'FC Laval', pts: 30, gd: '+4' },
      { pos: 4, club: 'CS Longueuil', pts: 27, gd: '+2' },
      { pos: 5, club: 'CF Montréal U23', pts: 25, gd: '0' },
    ];
    case 'BC': return [
      { pos: 1, club: 'TSS Rovers', pts: 36, gd: '+16' },
      { pos: 2, club: 'Altitude FC', pts: 32, gd: '+9' },
      { pos: 3, club: 'Whitecaps Elite', pts: 29, gd: '+6' },
      { pos: 4, club: 'Burnaby FC', pts: 24, gd: '+2' },
      { pos: 5, club: 'Unity FC', pts: 20, gd: '-3' },
    ];
    case 'AB': return [
      { pos: 1, club: 'Calgary Foothills', pts: 34, gd: '+15' },
      { pos: 2, club: 'Cavalry U21', pts: 31, gd: '+11' },
      { pos: 3, club: 'Edmonton Scottish', pts: 26, gd: '+3' },
      { pos: 4, club: 'St. Albert Impact', pts: 21, gd: '-2' },
      { pos: 5, club: 'Calgary Wild Pro-Am', pts: 18, gd: '-5' },
    ];
  }
}
// --- Expanded Records & Milestones ---
export const menRecords = [
  { label: 'Most goals, single CPL season', value: 'Tomasz Skublak — 12 (2021)' },
  { label: 'Most CPL appearances', value: 'Karifa Yao — 130' },
  { label: 'Longest unbeaten run', value: 'Forge FC — 23 matches' },
  { label: 'Fastest CPL hat-trick', value: 'Anthony Novak — 19 min' },
  { label: 'Most clean sheets, single season', value: 'Triston Henry — 14 (2023)' },
  { label: 'Youngest goalscorer in CPL history', value: 'Jahkeele Marshall-Rutty — 16y 214d' },
  { label: 'Largest margin of victory', value: 'Valour FC 6-0 HFX Wanderers (2022)' },
  { label: 'Most assists in a single season', value: 'Kyle Bekker — 10 (2022)' },
  { label: 'Most consecutive wins', value: 'Cavalry FC — 7 matches (2023)' },
  { label: 'Highest single-match attendance', value: 'Pacific FC vs Cavalry FC — 6,189' },
];
export const womenRecords = [
  { label: 'Most goals, inaugural NSL season', value: 'Jorian Baucom — 11 (2025)' },
  { label: 'First NSL hat-trick', value: 'Evelyne Viens — Montreal Roses' },
  { label: 'Longest clean-sheet streak', value: 'Katelyn Rowland — 4 straight' },
  { label: 'Highest single-match attendance', value: 'AFC Toronto — 12,410' },
  // Fixed unescaped entities below
  { label: 'Fastest goal from kickoff', value: 'Simi Awujo — 48"' }, 
  { label: 'Most assists, inaugural NSL season', value: 'Sarah Stratigakis — 6' },
  { label: 'Longest home unbeaten streak', value: 'AFC Toronto — 7 matches' },
  { label: 'Most saves in a single match', value: 'Rylee Foster — 11 saves' },
  { label: 'Youngest starter in NSL history', value: 'Olivia Smith — 18y 112d' },
  { label: 'Largest away victory margin', value: 'Vancouver Rise 4-0 Ottawa Rapid' },
];
