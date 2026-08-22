// src/app/stats/page.tsx
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import SidebarStack from '@/components/sidebar/SidebarStack';
import ComparePanel from '@/components/stats/ComparePanel';
import type { StandingsRow } from '@/lib/types';
import { getCplStandings, getNslStandings } from '@/lib/data/standings';

type Gender = 'MEN' | 'WOMEN';
type ViewMode = 
  | 'OVERVIEW' 
  | 'PLAYERS' 
  | 'TEAMS' 
  | 'CANADIANS ABROAD' 
  | 'PROVINCIAL' 
  | 'COLLEGIATE';

type PlayerRow = {
  rank: number;
  name: string;
  club: string;
  value: string;
  initials: string;
  slug: string;
};

type ComparePlayer = {
  playerId: string;
  name: string;
  club: string;
  league: string;
  statSummary: string;
};

const tabs: { id: ViewMode; label: string }[] = [
  { id: 'OVERVIEW', label: 'OVERVIEW' },
  { id: 'PLAYERS', label: 'PLAYER LEADERS' },
  { id: 'TEAMS', label: 'TEAM STREAMS' },
  { id: 'CANADIANS ABROAD', label: 'CANADIANS ABROAD' },
  { id: 'PROVINCIAL', label: 'PROVINCIAL' },
  { id: 'COLLEGIATE', label: 'COLLEGIATE (NCAA/U SPORTS)' },
];

// Historical Team Name & Franchise Lineage Resolution based on Season
function resolveTeamNameForSeason(rawName: string, season: number): string {
  if (!rawName) return '';
  const lower = rawName.trim().toLowerCase();

  if (lower.includes('york9') || lower.includes('york united')) {
    return season >= 2025 ? 'Inter Toronto FC' : 'York United FC';
  }
  if (lower.includes('supra') || lower.includes('quebec')) return 'FC Supra du Québec';
  if (lower.includes('forge')) return 'Forge FC';
  if (lower.includes('cavalry')) return 'Cavalry FC';
  if (lower.includes('pacific')) return 'Pacific FC';
  if (lower.includes('hfx') || lower.includes('wanderers')) return 'HFX Wanderers FC';
  if (lower.includes('vancouver') && !lower.includes('whitecaps')) return 'Vancouver FC';
  if (lower.includes('ottawa') || lower.includes('atletico')) return 'Atlético Ottawa';
  if (lower.includes('valour')) return 'Valour FC';
  if (lower.includes('edmonton')) return 'FC Edmonton';
  if (lower.includes('inter toronto')) return 'Inter Toronto FC';
  if (lower.includes('toronto fc')) return 'Toronto FC';
  if (lower.includes('montreal') || lower.includes('montréal')) {
    if (lower.includes('roses')) return 'Roses de Montréal';
    return 'CF Montréal';
  }
  if (lower.includes('whitecaps')) return 'Vancouver Whitecaps';
  if (lower.includes('afc toronto')) return 'AFC Toronto';
  if (lower.includes('calgary wild')) return 'Calgary Wild';
  if (lower.includes('halifax tides')) return 'Halifax Tides';
  if (lower.includes('ottawa rapid')) return 'Ottawa Rapid';
  if (lower.includes('vancouver rise')) return 'Vancouver Rise';

  return rawName.trim();
}

// Team Active Years Mapping
const TEAM_ACTIVE_SEASONS: Record<string, { start: number; end: number }> = {
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
  // NSL Clubs (Launched 2025)
  'AFC Toronto': { start: 2025, end: 2026 },
  'Roses de Montréal': { start: 2025, end: 2026 },
  'Vancouver Rise': { start: 2025, end: 2026 },
  'Calgary Wild': { start: 2025, end: 2026 },
  'Ottawa Rapid': { start: 2025, end: 2026 },
  'Halifax Tides': { start: 2025, end: 2026 },
};

const menRecords = [
  { label: 'ALL-TIME CPL GOAL LEADER', value: 'Terran Campbell — 38 Goals' },
  { label: 'MOST CPL APPEARANCES', value: 'Karifa Yao — 130 Matches' },
  { label: 'LONGEST CPL UNBEATEN RUN', value: 'Forge FC — 23 Matches' },
  { label: 'FASTEST CPL HAT-TRICK', value: 'Anthony Novak — 19 min' },
  { label: 'CANMNT ALL-TIME TOP SCORER', value: 'Cyle Larin — 30 Goals' },
  { label: 'CANMNT MOST CAPS', value: 'Atiba Hutchinson — 104 Caps' },
];

const womenRecords = [
  { label: 'INAUGURAL NSL GOLDEN BOOT', value: 'Jorian Baucom — 11 Goals (2025)' },
  { label: 'FIRST NSL HAT-TRICK', value: 'Evelyne Viens — Montreal Roses' },
  { label: 'LONGEST NSL CLEAN-SHEET STREAK', value: 'Katelyn Rowland — 4 Matches' },
  { label: 'HIGHEST NSL SINGLE-MATCH ATTENDANCE', value: 'AFC Toronto — 12,410' },
  { label: 'CANWNT ALL-TIME TOP SCORER', value: 'Christine Sinclair — 190 Goals' },
  { label: 'CANWNT MOST CAPS', value: 'Christine Sinclair — 331 Caps' },
];

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function isPlayerAbroad(p: any) {
  const isC = p.is_canadian !== false;
  if (!isC) return false;

  const comp = String(p.league || p.competitionName || p.competition || '').toUpperCase();
  const teamObj = Array.isArray(p.current_team) ? p.current_team[0] : p.current_team;
  const teamName = String(teamObj?.name || p.clubName || p.club || '').trim().toLowerCase();

  const isCanadianMlsTeam = 
    teamName.includes('toronto fc') || 
    teamName.includes('montréal') || 
    teamName.includes('montreal') || 
    teamName.includes('whitecaps');

  if (comp.includes('CPL') || comp.includes('NSL')) return false;
  if (comp.includes('MLS') && isCanadianMlsTeam) return false;

  return true;
}

function matchesGenderFilter(p: any, targetGender: Gender) {
  const playerGender = String(p.gender || '').toLowerCase().trim();
  const target = targetGender.toLowerCase().trim();

  if (playerGender) {
    if (target === 'men') {
      return playerGender === 'men' || playerGender === 'male' || playerGender === 'm';
    } else {
      return playerGender === 'women' || playerGender === 'female' || playerGender === 'w';
    }
  }

  const leagueUpper = String(p.league || '').toUpperCase();
  if (target === 'women') {
    return leagueUpper.includes('NSL') || leagueUpper.includes('NWSL') || leagueUpper.includes('WOMEN');
  } else {
    return !leagueUpper.includes('NSL') && !leagueUpper.includes('NWSL') && !leagueUpper.includes('WOMEN');
  }
}

function MetricCard({
  label,
  value,
  detail,
  accent = false,
}: {
  label: string;
  value: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-sm p-4 min-h-[112px] flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[9px] font-mono tracking-[0.18em] text-charcoal-soft uppercase">
          {label}
        </span>
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            accent ? 'bg-crimson animate-pulse' : 'bg-charcoal-soft/40'
          }`}
        />
      </div>
      <div>
        <div
          className={`text-2xl sm:text-3xl font-mono font-black tracking-tight ${
            accent ? 'text-crimson' : 'text-charcoal'
          }`}
        >
          {value}
        </div>
        <div className="text-[9px] font-mono text-charcoal-soft mt-1 uppercase">
          {detail}
        </div>
      </div>
    </div>
  );
}

function Leaderboard({
  title,
  subtitle,
  rows,
  valueLabel = 'VALUE',
}: {
  title: string;
  subtitle: string;
  rows: PlayerRow[];
  valueLabel?: string;
}) {
  return (
    <section className="bg-card border border-border rounded-sm overflow-hidden">
      <div className="p-4 border-b border-border flex items-start justify-between gap-4">
        <div>
          <div className="text-[9px] font-mono tracking-[0.18em] text-charcoal-soft uppercase">
            {subtitle}
          </div>
          <h2 className="text-sm font-mono font-bold uppercase text-charcoal mt-1">
            {title}
          </h2>
        </div>
        <span className="text-[9px] font-mono text-crimson border border-crimson/30 px-2 py-1 rounded-sm">
          TOP 5
        </span>
      </div>
      <div className="p-2 sm:p-3 font-mono">
        <div className="grid grid-cols-12 px-2 py-1.5 text-[8px] tracking-widest text-charcoal-soft border-b border-border uppercase">
          <span className="col-span-1">#</span>
          <span className="col-span-7">PLAYER {'// CLUB'}</span>
          <span className="col-span-4 text-right">{valueLabel}</span>
        </div>
        {rows.length === 0 ? (
          <div className="py-6 text-center text-[10px] text-charcoal-soft">
            NO RECORDS FOUND FOR THIS PERIOD
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={`${title}-${row.rank}-${row.slug || row.name}`}
              className="grid grid-cols-12 items-center px-2 py-2 border-b border-border/40 last:border-0 hover:bg-surface/60 transition-colors"
            >
              <span className="col-span-1 text-[10px] text-charcoal-soft font-bold">
                {row.rank}
              </span>
              <div className="col-span-7 min-w-0 flex items-center gap-2">
                <span className="hidden sm:flex w-7 h-7 rounded-sm border border-border bg-surface items-center justify-center text-[8px] font-bold shrink-0">
                  {row.initials}
                </span>
                <div className="min-w-0">
                  <Link
                    href={`/players/${row.slug}`}
                    prefetch={false}
                    className="text-[10px] sm:text-[11px] font-bold text-charcoal hover:text-crimson truncate block transition-colors"
                  >
                    {row.name}
                  </Link>
                  <div className="text-[8px] sm:text-[9px] text-charcoal-soft truncate">
                    {row.club}
                  </div>
                </div>
              </div>
              <span className="col-span-4 text-right text-[11px] sm:text-xs font-bold text-crimson">
                {row.value}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

// Standings Table Component for Team Streams Tab
function StandingsTable({
  title,
  standings,
}: {
  title: string;
  standings: StandingsRow[];
}) {
  return (
    <section className="bg-card border border-border rounded-sm overflow-hidden font-mono">
      <div className="p-4 border-b border-border flex items-center justify-between gap-4">
        <div>
          <span className="text-[9px] tracking-[0.18em] text-charcoal-soft uppercase">
            HISTORICAL STANDINGS & PERFORMANCE
          </span>
          <h2 className="text-sm font-bold text-charcoal uppercase mt-1">
            {title}
          </h2>
        </div>
        <span className="text-[9px] text-charcoal-soft">
          {standings.length} CLUBS
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-[11px]">
          <thead className="text-[9px] uppercase tracking-widest text-charcoal-soft bg-surface/60 border-b border-border">
            <tr>
              <th className="px-4 py-2 w-12">Pos</th>
              <th className="px-4 py-2">Club</th>
              <th className="px-4 py-2 text-center">P</th>
              <th className="px-4 py-2 text-center">W</th>
              <th className="px-4 py-2 text-center">D</th>
              <th className="px-4 py-2 text-center">L</th>
              <th className="px-4 py-2 text-center">GF</th>
              <th className="px-4 py-2 text-center">GA</th>
              <th className="px-4 py-2 text-center">GD</th>
              <th className="px-4 py-2 text-right">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {standings.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-6 text-center text-charcoal-soft">
                  NO STANDINGS RECORDED FOR THIS SELECTION / WEEK
                </td>
              </tr>
            ) : (
              standings.map((row) => (
                <tr key={row.id || row.clubName} className="hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-charcoal-soft">
                    {row.position}
                  </td>
                  <td className="px-4 py-2.5 font-bold text-charcoal flex items-center gap-2">
                    {row.clubName}
                  </td>
                  <td className="px-4 py-2.5 text-center text-charcoal-soft">{row.played}</td>
                  <td className="px-4 py-2.5 text-center text-charcoal">{row.won}</td>
                  <td className="px-4 py-2.5 text-center text-charcoal">{row.drawn}</td>
                  <td className="px-4 py-2.5 text-center text-charcoal">{row.lost}</td>
                  <td className="px-4 py-2.5 text-center text-charcoal-soft">{row.goalsFor}</td>
                  <td className="px-4 py-2.5 text-center text-charcoal-soft">{row.goalsAgainst}</td>
                  <td className="px-4 py-2.5 text-center text-charcoal font-semibold">
                    {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                  </td>
                  <td className="px-4 py-2.5 text-right font-black text-crimsion text-xs">
                    {row.points}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function StatsHubPage() {
  const [programGender, setProgramGender] = useState<Gender>('MEN');
  const [view, setView] = useState<ViewMode>('OVERVIEW');
  const [competition, setCompetition] = useState('ALL CANADIAN');
  const [season, setSeason] = useState('2026');
  const [week, setWeek] = useState('ALL');
  const [provStatsProvince, setProvStatsProvince] = useState<'ON' | 'QC' | 'BC' | 'AB'>('ON');
  const [dbPlayers, setDbPlayers] = useState<any[]>([]);
  const [dbTeams, setDbTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [nslStandings, setNslStandings] = useState<StandingsRow[]>([]);
  const [comparePlayerA, setComparePlayerA] = useState<ComparePlayer | null>(null);
  const [comparePlayerB, setComparePlayerB] = useState<ComparePlayer | null>(null);

  const handleAddToCompare = (player: ComparePlayer) => {
    if (!comparePlayerA || comparePlayerA.playerId === player.playerId) {
      setComparePlayerA(player);
    } else if (!comparePlayerB || comparePlayerB.playerId === player.playerId) {
      setComparePlayerB(player);
    } else {
      setComparePlayerA(player);
    }
  };

  useEffect(() => {
    async function fetchDatabaseData() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/stats?season=${season}&week=${week}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.players) setDbPlayers(json.players);
          if (json.teams) setDbTeams(json.teams);
        }
      } catch (err) {
        console.error('Failed to query live database entities:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDatabaseData();
  }, [season, week]);

  useEffect(() => {
    // Fetch base standings for the selected season (used for Team Streams tab & Standings)
    getCplStandings(Number(season)).then((data) => {
      if (data) setStandings(data);
    });
    getNslStandings(Number(season)).then((data) => {
      if (data) setNslStandings(data);
    });
  }, [season]);

  const activePlayers = dbPlayers;

  const filteredPlayers = useMemo(() => {
    return activePlayers.filter((p: any) => {
      if (!matchesGenderFilter(p, programGender)) return false;

      const comp = String(p.league || p.competitionName || p.competition || '').toUpperCase();

      if (competition === 'CPL') return comp.includes('CPL');
      if (competition === 'NSL') return comp.includes('NSL');
      if (competition === 'MLS') return comp.includes('MLS');
      if (competition === 'ABROAD') return isPlayerAbroad(p);

      return p.is_canadian !== false;
    });
  }, [activePlayers, programGender, competition]);

  const computedGoldenBoot = useMemo<PlayerRow[]>(() => {
    const sorted = [...filteredPlayers].sort((a: any, b: any) => (b.goals ?? 0) - (a.goals ?? 0));
    return sorted.slice(0, 5).map((p: any, idx: number) => {
      const playerName = p.name || p.full_name || 'Player';
      const teamObj = Array.isArray(p.current_team) ? p.current_team[0] : p.current_team;
      return {
        rank: idx + 1,
        name: playerName,
        club: resolveTeamNameForSeason(teamObj?.name || p.league || 'Pro Club', Number(season)),
        value: `${p.goals ?? 0} G`,
        initials: playerName.split(' ').map((n: string) => n[0]).join('.'),
        slug: p.slug || p.external_id || p.id,
      };
    });
  }, [filteredPlayers, season]);

  const computedAssists = useMemo<PlayerRow[]>(() => {
    const sorted = [...filteredPlayers].sort((a: any, b: any) => (b.assists ?? 0) - (a.assists ?? 0));
    return sorted.slice(0, 5).map((p: any, idx: number) => {
      const playerName = p.name || p.full_name || 'Player';
      const teamObj = Array.isArray(p.current_team) ? p.current_team[0] : p.current_team;
      return {
        rank: idx + 1,
        name: playerName,
        club: resolveTeamNameForSeason(teamObj?.name || p.league || 'Pro Club', Number(season)),
        value: `${p.assists ?? 0} AST`,
        initials: playerName.split(' ').map((n: string) => n[0]).join('.'),
        slug: p.slug || p.external_id || p.id,
      };
    });
  }, [filteredPlayers, season]);

  const computedGoalkeepers = useMemo<PlayerRow[]>(() => {
    const keepers = filteredPlayers.filter((p: any) => {
      const pos = String(p.position || '').trim().toUpperCase();
      return pos === 'GK' || pos === 'GOALKEEPER';
    });

    const sorted = [...keepers].sort((a: any, b: any) => (b.clean_sheets ?? b.rating ?? 0) - (a.clean_sheets ?? a.rating ?? 0));
    return sorted.slice(0, 5).map((p: any, idx: number) => {
      const playerName = p.name || p.full_name || 'Player';
      const teamObj = Array.isArray(p.current_team) ? p.current_team[0] : p.current_team;
      const cleanSheetsVal = p.clean_sheets !== undefined ? `${p.clean_sheets} CS` : `${p.rating ? Number(p.rating).toFixed(1) : '7.5'} RTG`;
      return {
        rank: idx + 1,
        name: playerName,
        club: resolveTeamNameForSeason(teamObj?.name || p.league || 'Pro Club', Number(season)),
        value: cleanSheetsVal,
        initials: playerName.split(' ').map((n: string) => n[0]).join('.'),
        slug: p.slug || p.external_id || p.id,
      };
    });
  }, [filteredPlayers, season]);

  const computedAbroad = useMemo<PlayerRow[]>(() => {
    const abroad = filteredPlayers.filter((p: any) => isPlayerAbroad(p));
    const sorted = [...abroad].sort((a: any, b: any) => (b.rating ?? 0) - (a.rating ?? 0));
    return sorted.slice(0, 5).map((p: any, idx: number) => {
      const playerName = p.name || p.full_name || 'Player';
      const teamObj = Array.isArray(p.current_team) ? p.current_team[0] : p.current_team;
      return {
        rank: idx + 1,
        name: playerName,
        club: resolveTeamNameForSeason(teamObj?.name || p.league || 'International', Number(season)),
        value: `${p.rating ? Number(p.rating).toFixed(1) : '7.5'} RTG`,
        initials: playerName.split(' ').map((n: string) => n[0]).join('.'),
        slug: p.slug || p.external_id || p.id,
      };
    });
  }, [filteredPlayers, season]);

  const computedDiscipline = useMemo(() => {
    const sorted = [...filteredPlayers].sort((a: any, b: any) => {
      const scoreB = (b.yellow_cards || 0) * 1 + (b.red_cards || 0) * 3;
      const scoreA = (a.yellow_cards || 0) * 1 + (a.red_cards || 0) * 3;
      return scoreB - scoreA;
    });
    return sorted.slice(0, 5).map((p: any, idx: number) => {
      const teamObj = Array.isArray(p.current_team) ? p.current_team[0] : p.current_team;
      return {
        rank: idx + 1,
        playerId: p.id || p.slug,
        name: p.name || 'Player',
        club: resolveTeamNameForSeason(teamObj?.name || p.league || 'Pro Club', Number(season)),
        yellows: p.yellow_cards ?? 0,
        reds: p.red_cards ?? 0,
        slug: p.slug || p.external_id || p.id,
      };
    });
  }, [filteredPlayers, season]);

  const computedTeamOfWeek = useMemo(() => {
    const sorted = [...filteredPlayers].sort((a: any, b: any) => (b.rating ?? 0) - (a.rating ?? 0));
    return sorted.slice(0, 6).map((p: any) => {
      const teamObj = Array.isArray(p.current_team) ? p.current_team[0] : p.current_team;
      const playerName = p.name || 'Player';
      return {
        playerId: p.id || p.slug,
        name: playerName,
        club: resolveTeamNameForSeason(teamObj?.name || p.league || 'Pro Club', Number(season)),
        league: p.league || 'Domestic',
        initials: playerName.split(' ').map((n: string) => n[0]).join('.'),
        slug: p.slug || p.external_id || p.id,
      };
    });
  }, [filteredPlayers, season]);

  const computedRecords = useMemo(() => {
    const baseRecords = programGender === 'MEN' ? menRecords : womenRecords;
    const genderPlayers = activePlayers.filter((p: any) => matchesGenderFilter(p, programGender));

    const topScorer = [...genderPlayers].sort((a: any, b: any) => (b.goals ?? 0) - (a.goals ?? 0))[0];
    const topAssister = [...genderPlayers].sort((a: any, b: any) => (b.assists ?? 0) - (a.assists ?? 0))[0];
    const topRated = [...genderPlayers].sort((a: any, b: any) => (b.rating ?? 0) - (a.rating ?? 0))[0];

    const dbRecords = [
      { label: `CURRENT ${programGender} DB GOAL LEADER`, value: topScorer ? `${topScorer.name} — ${topScorer.goals ?? 0} Goals` : '—' },
      { label: `CURRENT ${programGender} DB PLAYMAKER`, value: topAssister ? `${topAssister.name} — ${topAssister.assists ?? 0} Assists` : '—' },
      { label: `HIGHEST RATED ${programGender} DB ENTITY`, value: topRated ? `${topRated.name} — ${topRated.rating ? Number(topRated.rating).toFixed(1) : '—'} RTG` : '—' },
    ];

    return [...dbRecords, ...baseRecords];
  }, [activePlayers, programGender]);

  const provincialScorers = getProvincialScorers(provStatsProvince);
  const provincialStandings = getProvincialStandings(provStatsProvince);
  const showOverview = view === 'OVERVIEW';
  const showPlayers = view === 'PLAYERS';
  const showTeams = view === 'TEAMS';
  const showAbroad = view === 'CANADIANS ABROAD';
  const showProvincial = view === 'PROVINCIAL';
  const showCollegiate = view === 'COLLEGIATE';

  return (
    <div className="min-h-[100dvh] p-2 sm:p-4 md:p-6 pb-[env(safe-area-inset-bottom)] bg-surface text-charcoal">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <main className="lg:col-span-8 flex flex-col gap-5">
          <header className="bg-card border border-border rounded-sm overflow-hidden">
            <div className="px-4 sm:px-5 py-4 border-b border-border flex flex-col xl:flex-row xl:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[9px] font-mono tracking-[0.2em] text-charcoal-soft">
                  <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />{' '}
                  CANADIAN FOOTBALL INTELLIGENCE CENTRE
                </div>
                <h1 className="text-xl sm:text-2xl font-mono font-black tracking-tight mt-1">
                  STATS // MASTER INTELLIGENCE HUB
                </h1>
                <p className="text-[10px] sm:text-xs font-mono text-charcoal-soft max-w-2xl mt-2 leading-relaxed">
                  Live database query telemetry, player rankings, and entity streams across CPL, NSL, MLS, and global pathways.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[8px] shrink-0">
                <span className="px-2 py-1 border border-crimson/40 text-crimson rounded-sm">
                  {isLoading ? 'SYNCING DB...' : `${activePlayers.length} DB ENTRIES`}
                </span>
                <span className="px-2 py-1 border border-border text-charcoal-soft rounded-sm">
                  {season} // {week === 'ALL' ? 'FULL SEASON' : `WEEK ${week}`}
                </span>
              </div>
            </div>
            
            {/* Filter Bar */}
            <div className="p-3 border-b border-border bg-surface/40 flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-1 bg-card border border-border p-1 rounded-sm w-full sm:w-auto">
                {(['MEN', 'WOMEN'] as Gender[]).map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setProgramGender(gender)}
                    className={`flex-1 sm:flex-none px-4 py-2 text-[10px] font-mono font-bold rounded-sm transition-colors ${
                      programGender === gender
                        ? 'bg-crimson text-white'
                        : 'text-charcoal-soft hover:text-charcoal'
                    }`}
                  >
                    {gender === 'MEN' ? "MEN'S PROGRAM" : "WOMEN'S PROGRAM"}
                  </button>
                ))}
              </div>
              
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="bg-card border border-border rounded-sm px-3 py-2 text-[10px] font-mono text-charcoal"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
              </select>

              <select
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="bg-card border border-border rounded-sm px-3 py-2 text-[10px] font-mono text-charcoal"
              >
                <option value="ALL">ALL WEEKS</option>
                {Array.from({ length: 28 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1)}>
                    Matchweek {i + 1}
                  </option>
                ))}
              </select>

              <select
                value={competition}
                onChange={(e) => setCompetition(e.target.value)}
                className="bg-card border border-border rounded-sm px-3 py-2 text-[10px] font-mono text-charcoal flex-1"
              >
                <option>ALL CANADIAN</option>
                <option>CPL</option>
                <option>NSL</option>
                <option>MLS</option>
                <option>ABROAD</option>
              </select>
            </div>

            <nav aria-label="Statistics sections" className="overflow-x-auto border-b border-border">
              <div className="flex min-w-max px-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setView(tab.id)}
                    className={`px-3 sm:px-4 py-3 text-[9px] font-mono tracking-wider border-b-2 transition-colors ${
                      view === tab.id
                        ? 'border-crimson text-crimson'
                        : 'border-transparent text-charcoal-soft hover:text-charcoal'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>
          </header>

          <ComparePanel
            playerA={comparePlayerA}
            playerB={comparePlayerB}
            onClear={() => {
              setComparePlayerA(null);
              setComparePlayerB(null);
            }}
          />

          {showOverview && (
            <>
              <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                <MetricCard
                  label="DATABASE PLAYERS"
                  value={String(activePlayers.length)}
                  detail={`SUPABASE // ${season}`}
                  accent
                />
                <MetricCard
                  label="REGISTERED CLUBS"
                  value={String(standings.length)}
                  detail={`ACTIVE IN ${season}`}
                />
                <MetricCard
                  label="CPL CLUBS"
                  value={String(standings.length)}
                  detail={`${season} STANDINGS`}
                />
                <MetricCard
                  label="NSL CLUBS"
                  value={String(nslStandings.length)}
                  detail={`${season} STANDINGS`}
                />
              </section>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <Leaderboard
                  title="Golden Boot"
                  subtitle={`${competition} // ${season} (${week === 'ALL' ? 'Full Season' : `Week ${week}`})`}
                  rows={computedGoldenBoot}
                  valueLabel="GOALS"
                />
                <Leaderboard
                  title="Playmakers"
                  subtitle={`${competition} // ${season} (${week === 'ALL' ? 'Full Season' : `Week ${week}`})`}
                  rows={computedAssists}
                  valueLabel="ASSISTS"
                />
                <Leaderboard
                  title="Goalkeeping"
                  subtitle={`GOALKEEPER LEADERS // (${season})`}
                  rows={computedGoalkeepers}
                  valueLabel="RATING"
                />
                <Leaderboard
                  title="Canadian Abroad"
                  subtitle={`GLOBAL PERFORMANCE INDEX // ${season}`}
                  rows={computedAbroad}
                  valueLabel="RATING"
                />
              </div>
            </>
          )}

          {showPlayers && (
            <DataTable
              title={programGender === 'MEN' ? `ALL-CANADIAN MEN DATABASE LEADERS (${season})` : `ALL-CANADIAN WOMEN DATABASE LEADERS (${season})`}
              players={filteredPlayers}
              onAddToCompare={handleAddToCompare}
            />
          )}

          {/* TEAM STREAMS TAB: Displays Standings Table for CPL/NSL based on Season & Week */}
          {showTeams && (
            <div className="space-y-5">
              {(competition === 'ALL CANADIAN' || competition === 'CPL') && standings.length > 0 && (
                <StandingsTable
                  title={`CPL // CANADIAN PREMIER LEAGUE STANDINGS (${season} // ${week === 'ALL' ? 'End of Season' : `Matchweek ${week}`})`}
                  standings={standings}
                />
              )}
              {(competition === 'ALL CANADIAN' || competition === 'NSL') && Number(season) >= 2025 && nslStandings.length > 0 && (
                <StandingsTable
                  title={`NSL // NORTHERN SUPER LEAGUE STANDINGS (${season} // ${week === 'ALL' ? 'End of Season' : `Matchweek ${week}`})`}
                  standings={nslStandings}
                />
              )}
            </div>
          )}

          {showAbroad && (
            <DataTable
              title={`GLOBAL CANADIAN PERFORMANCE STREAM // ${programGender} (${season})`}
              players={activePlayers.filter((p: any) => {
                if (!matchesGenderFilter(p, programGender)) return false;
                return isPlayerAbroad(p);
              })}
              onAddToCompare={handleAddToCompare}
            />
          )}

          {showCollegiate && (
            <section className="bg-card border border-border rounded-sm p-6 text-center">
              <div className="text-[9px] font-mono tracking-widest text-charcoal-soft uppercase">
                NCAA / U SPORTS
              </div>
              <div className="text-xs font-mono text-charcoal-soft mt-2">
                Collegiate pathway data is static and managed independently of professional season filters.
              </div>
            </section>
          )}

          {showProvincial && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <section className="bg-card border border-border rounded-sm p-4">
                <span className="text-[9px] font-mono tracking-widest text-charcoal-soft">
                  {provStatsStatsHeading(provStatsProvince)}
                </span>
                <h2 className="text-sm font-mono font-bold mt-1">
                  STANDINGS SIGNAL
                </h2>
                <div className="mt-3 space-y-1 font-mono">
                  {provincialStandings.map((r: any) => (
                    <div
                      key={r.pos}
                      className="grid grid-cols-12 text-[10px] py-2 border-b border-border/40"
                    >
                      <span className="col-span-1 text-charcoal-soft">{r.pos}</span>
                      <span className="col-span-7 font-bold">{r.club}</span>
                      <span className="col-span-2 text-right">{r.pts}</span>
                      <span className="col-span-2 text-right text-charcoal-soft">
                        {r.gd}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
              <section className="bg-card border border-border rounded-sm p-4">
                <span className="text-[9px] font-mono tracking-widest text-charcoal-soft">
                  GOALSCORING INDEX
                </span>
                <h2 className="text-sm font-mono font-bold mt-1">
                  TOP PROVINCIAL SCORERS
                </h2>
                <div className="mt-3 space-y-1 font-mono">
                  {provincialScorers.map((r: any, i: number) => (
                    <div
                      key={r.name}
                      className="flex items-center justify-between text-[10px] py-2 border-b border-border/40"
                    >
                      <span>
                        <span className="text-charcoal-soft mr-2">{i + 1}</span>
                        <b>{r.name}</b>
                        <span className="text-charcoal-soft">
                          {' // '}
                          {r.club}
                        </span>
                      </span>
                      <span className="text-crimson font-bold">{r.goals} G</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {showOverview && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <section className="bg-card border border-border rounded-sm overflow-hidden">
                <div className="p-4 border-b border-border">
                  <span className="text-[9px] font-mono tracking-widest text-charcoal-soft">
                    DISCIPLINE MONITOR
                  </span>
                  <h2 className="text-sm font-mono font-bold text-charcoal mt-1">
                    CARDED LEADERS ({programGender} // {season})
                  </h2>
                </div>
                <div className="p-3 font-mono">
                  {computedDiscipline.length === 0 ? (
                    <div className="py-4 text-center text-[10px] text-charcoal-soft">
                      NO CARD DATA RECORDED
                    </div>
                  ) : (
                    computedDiscipline.map((p) => (
                      <div
                        key={p.playerId}
                        className="grid grid-cols-12 items-center py-2 border-b border-border/40 text-[10px]"
                      >
                        <span className="col-span-1 text-charcoal-soft">{p.rank}</span>
                        <div className="col-span-7 min-w-0">
                          <Link
                            href={`/players/${p.slug}`}
                            prefetch={false}
                            className="font-bold text-charcoal hover:text-crimson truncate block transition-colors"
                          >
                            {p.name}
                          </Link>
                          <span className="font-normal text-charcoal-soft text-[8px] truncate block">
                            {p.club}
                          </span>
                        </div>
                        <span className="col-span-2 text-right text-crimson font-bold">
                          {p.yellows} Y
                        </span>
                        <span className="col-span-2 text-right text-charcoal font-bold">
                          {p.reds} R
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="bg-card border border-border rounded-sm overflow-hidden">
                <div className="p-4 border-b border-border">
                  <span className="text-[9px] font-mono tracking-widest text-charcoal-soft">
                    HISTORICAL DATABASE
                  </span>
                  <h2 className="text-sm font-mono font-bold text-charcoal mt-1">
                    RECORDS & MILESTONES ({programGender})
                  </h2>
                </div>
                <div className="p-3">
                  {computedRecords.map((r) => (
                    <div key={r.label} className="py-2 border-b border-border/40">
                      <div className="text-[8px] font-mono uppercase tracking-wider text-charcoal-soft">
                        {r.label}
                      </div>
                      <div className="text-[10px] font-mono font-bold text-charcoal mt-0.5">
                        {r.value}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </main>

        <aside className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-card border border-border rounded-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-mono tracking-widest text-charcoal-soft">
                DATA INTEGRITY
              </span>
              <span className="text-[8px] font-mono text-crimson">
                SUPABASE LIVE
              </span>
            </div>
            <div className="space-y-2 text-[9px] font-mono text-charcoal-soft">
              <div className="flex justify-between">
                <span>SEASON</span>
                <b className="text-charcoal">{season}</b>
              </div>
              <div className="flex justify-between">
                <span>MATCHWEEK</span>
                <b className="text-charcoal">{week === 'ALL' ? 'Full Season' : `Week ${week}`}</b>
              </div>
              <div className="flex justify-between">
                <span>PROGRAM</span>
                <b className="text-charcoal">{programGender}</b>
              </div>
              <div className="flex justify-between">
                <span>DB PLAYERS</span>
                <b className="text-charcoal">{activePlayers.length}</b>
              </div>
            </div>
          </div>
          <SidebarStack standings={standings} nslStandings={nslStandings} />
        </aside>
      </div>
    </div>
  );
}

function provStatsStatsHeading(prov: 'ON' | 'QC' | 'BC' | 'AB') {
  switch (prov) {
    case 'ON': return 'LEAGUE1 ONTARIO';
    case 'QC': return 'LIGUE1 QUÉBEC';
    case 'BC': return 'LEAGUE1 BC';
    case 'AB': return 'LEAGUE1 ALBERTA';
  }
}

function getProvincialScorers(prov: 'ON' | 'QC' | 'BC' | 'AB') {
  switch (prov) {
    case 'ON': return [{ name: 'Emil Nielsen', club: 'Simcoe County Rovers', goals: 16 }];
    case 'QC': return [{ name: 'Adama Konte', club: 'CS Saint-Laurent', goals: 13 }];
    case 'BC': return [{ name: 'Connor Douglas', club: 'TSS Rovers', goals: 12 }];
    case 'AB': return [{ name: 'Ezekiel Adebisi', club: 'Calgary Foothills', goals: 11 }];
  }
}

function getProvincialStandings(prov: 'ON' | 'QC' | 'BC' | 'AB') {
  switch (prov) {
    case 'ON': return [{ pos: 1, club: 'Vaughan Azzurri', pts: 42, gd: '+21' }];
    case 'QC': return [{ pos: 1, club: 'CS Saint-Laurent', pts: 39, gd: '+18' }];
    case 'BC': return [{ pos: 1, club: 'TSS Rovers', pts: 36, gd: '+16' }];
    case 'AB': return [
      { pos: 1, club: 'Calgary Foothills', pts: 34, gd: '+34' },
      { pos: 2, club: 'Cavalry U21', pts: 31, gd: '+11' },
      { pos: 3, club: 'Edmonton Scottish', pts: 26, gd: '+3' },
      { pos: 4, club: 'St. Albert Impact', pts: 21, gd: '-2' },
      { pos: 5, club: 'Calgary Wild Pro-Am', pts: 18, gd: '-5' },
      { pos: 6, club: 'Edmonton BTB', pts: 14, gd: '-8' },
      { pos: 7, club: 'Cavalry U21 B', pts: 10, gd: '-12' },
    ];
  }
}
