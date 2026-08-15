// src/lib/data/proLeagues/proLeaguesDemo.ts
//
// Extracted out of src/app/pro-leagues/page.tsx. Development fixtures --
// see the page's <DataStatus /> badge.

import type { LeaderboardPlayer } from './proLeaguesTypes';
import type { StandingsRow } from '@/lib/types';

export const PLAYERS_LEADERBOARD: LeaderboardPlayer[] = [
  { rank: 1, name: 'Tobias Warschewski', club: 'Cavalry FC', league: 'CPL', goals: 14, assists: 6, rating: '8.4' },
  { rank: 2, name: 'Alejandro Díaz', club: 'Pacific FC', league: 'CPL', goals: 13, assists: 4, rating: '8.2' },
  { rank: 3, name: 'Brian Wright', club: 'York United', league: 'CPL', goals: 12, assists: 5, rating: '8.0' },
  { rank: 4, name: 'Terran Campbell', club: 'Forge FC', league: 'CPL', goals: 11, assists: 8, rating: '7.9' },
  { rank: 5, name: 'Gabriele Carlevaro', club: 'AFC Toronto', league: 'NSL', goals: 10, assists: 7, rating: '7.8' },
  { rank: 6, name: 'Myriam Hammami', club: 'Montreal Roses', league: 'NSL', goals: 9, assists: 9, rating: '7.8' },
  { rank: 7, name: 'Malcolm Shaw', club: 'Atlético Ottawa', league: 'CPL', goals: 9, assists: 3, rating: '7.6' },
  { rank: 8, name: 'Ali Musse', club: 'Cavalry FC', league: 'CPL', goals: 8, assists: 11, rating: '8.3' },
  { rank: 9, name: 'Sarah-Eve Gagnon', club: 'Vancouver Rise', league: 'NSL', goals: 8, assists: 4, rating: '7.5' },
  { rank: 10, name: 'Tristan Borges', club: 'Forge FC', league: 'CPL', goals: 7, assists: 12, rating: '8.1' },
];

export const XG_DATA = {
  CPL: [
    { name: 'Tobias Warschewski', club: 'Cavalry FC', goals: 14, xG: 11.2, diff: '+2.8' },
    { name: 'Alejandro Díaz', club: 'Pacific FC', goals: 13, xG: 14.1, diff: '-1.1' },
    { name: 'Brian Wright', club: 'York United', goals: 12, xG: 10.5, diff: '+1.5' },
    { name: 'Terran Campbell', club: 'Forge FC', goals: 11, xG: 11.8, diff: '-0.8' },
    { name: 'Ali Musse', club: 'Cavalry FC', goals: 8, xG: 6.2, diff: '+1.8' },
  ],
  NSL: [
    { name: 'Gabriele Carlevaro', club: 'AFC Toronto', goals: 10, xG: 8.5, diff: '+1.5' },
    { name: 'Myriam Hammami', club: 'Montreal Roses', goals: 9, xG: 9.8, diff: '-0.8' },
    { name: 'Sarah-Eve Gagnon', club: 'Vancouver Rise', goals: 8, xG: 7.1, diff: '+0.9' },
    { name: 'Olivia Smith', club: 'Halifax Tides', goals: 7, xG: 7.5, diff: '-0.5' },
    { name: 'Amanda Allen', club: 'Ottawa Rapid', goals: 6, xG: 4.8, diff: '+1.2' },
  ]
};

export const TOTW_DATA = {
  CPL: {
    week: "MATCHWEEK 18",
    manager: "Bobby Smyrniotis (Forge FC)",
    managerNote: "Tactical masterclass in breaking down the low block and securing crucial away points.",
    formation: "4-3-3",
    players: [
      { pos: "GK", name: "Triston Henry", club: "Forge FC" },
      { pos: "DEF", name: "Themi Antonoglou", club: "Valour FC" },
      { pos: "DEF", name: "Daan Klomp", club: "Cavalry FC" },
      { pos: "DEF", name: "Alex Achinioti-Jönsson", club: "Forge FC" },
      { pos: "DEF", name: "Daniel Parra", club: "Pacific FC" },
      { pos: "MID", name: "Kyle Bekker", club: "Forge FC" },
      { pos: "MID", name: "Lorenzo Callegari", club: "Wanderers" },
      { pos: "MID", name: "Tristan Borges", club: "Forge FC" },
      { pos: "FWD", name: "Tobias Warschewski", club: "Cavalry FC" },
      { pos: "FWD", name: "Brian Wright", club: "York United" },
      { pos: "FWD", name: "Kwasi Poku", club: "Forge FC" },
    ]
  },
  NSL: {
    week: "MATCHWEEK 12",
    manager: "Diana Matheson (AFC Toronto)",
    managerNote: "Aggressive high-press structure overwhelmed the midfield, leading to a dominant derby win.",
    formation: "4-2-3-1",
    players: [
      { pos: "GK", name: "Kailen Sheridan", club: "Vancouver Rise" },
      { pos: "DEF", name: "Kadeisha Buchanan", club: "AFC Toronto" },
      { pos: "DEF", name: "Vanessa Gilles", club: "Montreal Roses" },
      { pos: "DEF", name: "Jade Rose", club: "Halifax Tides" },
      { pos: "DEF", name: "Ashley Lawrence", club: "Calgary Wild" },
      { pos: "MID", name: "Julia Grosso", club: "Vancouver Rise" },
      { pos: "MID", name: "Jessie Fleming", club: "AFC Toronto" },
      { pos: "MID", name: "Olivia Smith", club: "Halifax Tides" },
      { pos: "FWD", name: "Gabriele Carlevaro", club: "AFC Toronto" },
      { pos: "FWD", name: "Myriam Hammami", club: "Montreal Roses" },
      { pos: "FWD", name: "Sarah-Eve Gagnon", club: "Vancouver Rise" },
    ]
  }
};

// Recent Results & Next Up. Dated around the calendar's reference date
// (Aug 7 2026) so results sit in the past and fixtures sit in the future
// relative to the same 'today' the rest of the page uses.
export const RECENT_RESULTS = {
  CPL: [
    { id: 'r1', date: 'SAT AUG 1', home: 'Forge FC', homeScore: 2, away: 'Vancouver FC', awayScore: 0, note: "Choinière's brace seals it before the half." },
    { id: 'r2', date: 'SUN AUG 2', home: 'Cavalry FC', homeScore: 1, away: 'Pacific FC', awayScore: 1, note: 'Late equalizer denies Cavalry a home win.' },
    { id: 'r3', date: 'WED AUG 5', home: 'Atlético Ottawa', homeScore: 3, away: 'Valour FC', awayScore: 1, note: 'Ottawa stays within two points of top spot.' },
  ],
  NSL: [
    { id: 'r1', date: 'SAT AUG 1', home: 'Vancouver Rise', homeScore: 2, away: 'Ottawa Rapid', awayScore: 0, note: 'Rise extends unbeaten run to six matches.' },
    { id: 'r2', date: 'SUN AUG 2', home: 'Montreal Roses', homeScore: 1, away: 'AFC Toronto', awayScore: 1, note: 'Derby levelled by a late Toronto equalizer.' },
    { id: 'r3', date: 'WED AUG 5', home: 'Calgary Wild', homeScore: 2, away: 'Halifax Tides', awayScore: 1, note: 'Wild come from behind to snap a two-game skid.' },
  ],
};

export const UPCOMING_FIXTURES = {
  CPL: [
    { id: 'u1', date: 'SAT AUG 9 · 3:00 PM EST', home: 'Forge FC', away: 'Cavalry FC', broadcaster: 'ONESOCCER' },
    { id: 'u2', date: 'SUN AUG 10 · 5:00 PM EST', home: 'Pacific FC', away: 'Atlético Ottawa', broadcaster: 'ONESOCCER' },
  ],
  NSL: [
    { id: 'u1', date: 'SAT AUG 9 · 1:00 PM EST', home: 'AFC Toronto', away: 'Vancouver Rise', broadcaster: 'ONESOCCER' },
    { id: 'u2', date: 'SUN AUG 10 · 4:00 PM EST', home: 'Halifax Tides', away: 'Montreal Roses', broadcaster: 'ONESOCCER' },
  ],
};

// --- Deterministic Calendar Fixture Generator ---
export const getDeterministicFixtures = (league: 'CPL' | 'NSL', year: number) => {
  const fixtures: Record<string, string> = {};
  const teams = league === 'CPL'
    ? ['Forge FC', 'Cavalry FC', 'Pacific FC', 'Atlético Ottawa', 'York Utd', 'Valour FC', 'Wanderers', 'Vancouver FC']
    : ['AFC Toronto', 'Calgary Wild', 'Halifax Tides', 'Montreal Roses', 'Ottawa Rapid', 'Vancouver Rise'];
  for (let month = 0; month < 12; month++) {
    const days = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= days; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() === 5 || date.getDay() === 6 || date.getDay() === 0) {
        const seed = year * 10000 + month * 100 + day + (league === 'CPL' ? 1 : 2);
        if (seed % 3 !== 0) {
          const t1 = teams[seed % teams.length];
          const t2 = teams[(seed + 3) % teams.length];
          const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          fixtures[dStr] = `${t1} vs ${t2}`;
        }
      }
    }
  }
  return fixtures;
};

export const CPL_FIXTURES_2026 = getDeterministicFixtures('CPL', 2026);
export const NSL_FIXTURES_2026 = getDeterministicFixtures('NSL', 2026);

export const standings: StandingsRow[] = [
  { position: 1, clubName: "Forge FC", played: 0, points: 0, goalDifference: 0 },
  { position: 2, clubName: "Pacific FC", played: 0, points: 0, goalDifference: 0 },
  { position: 3, clubName: "Cavalry FC", played: 0, points: 0, goalDifference: 0 },
  { position: 4, clubName: "Atlético Ottawa", played: 0, points: 0, goalDifference: 0 },
  { position: 5, clubName: "York United FC", played: 0, points: 0, goalDifference: 0 },
  { position: 6, clubName: "Valour FC", played: 0, points: 0, goalDifference: 0 },
  { position: 7, clubName: "HFX Wanderers FC", played: 0, points: 0, goalDifference: 0 },
  { position: 8, clubName: "Vancouver FC", played: 0, points: 0, goalDifference: 0 },
];

export const nslStandings: StandingsRow[] = [
  { position: 1, clubName: "AFC Toronto", played: 0, points: 0, goalDifference: 0 },
  { position: 2, clubName: "Calgary Wild FC", played: 0, points: 0, goalDifference: 0 },
  { position: 3, clubName: "Halifax Tides FC", played: 0, points: 0, goalDifference: 0 },
  { position: 4, clubName: "Montreal Roses FC", played: 0, points: 0, goalDifference: 0 },
  { position: 5, clubName: "Ottawa Rapid FC", played: 0, points: 0, goalDifference: 0 },
  { position: 6, clubName: "Vancouver Rise FC", played: 0, points: 0, goalDifference: 0 },
];

export const recentStories = [
  { id: 'p-1', league: 'CPL', headline: 'Tactical Breakdown: How Cavalry’s Midfield Block Shut Down Forge', timestamp: '2H AGO', url: '#' },
  { id: 'p-2', league: 'NSL', headline: 'AFC Toronto Unveils New High-Performance Training Infrastructure', timestamp: '4H AGO', url: '#' },
  { id: 'p-3', league: 'CPL', headline: 'Pacific FC Youngsters Shine in West Coast Derby Thriller', timestamp: '6H AGO', url: '#' },
  { id: 'p-4', league: 'TRANSFERS', headline: 'Winter Window Radar: European Scouts Circling CPL Standouts', timestamp: '8H AGO', url: '#' },
  { id: 'p-5', league: 'CPL', headline: 'Atlético Ottawa Secures Vital Three Points on the Road', timestamp: '12H AGO', url: '#' },
  { id: 'p-6', league: 'NSL', headline: 'Montreal Roses Clinch Dramatic Late Equalizer in Derby Match', timestamp: '15H AGO', url: '#' },
  { id: 'p-7', league: 'CPL', headline: 'Scouting Notebook: Under-21 Minutes Rule Impacting Roster Builds', timestamp: '1D AGO', url: '#' },
  { id: 'p-8', league: 'CANMNT', headline: 'Pro League Graduates Making Waves in World Cup Qualifiers', timestamp: '1D AGO', url: '#' },
];
