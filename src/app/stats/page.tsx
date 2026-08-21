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

// CPL Team Alias Mapping for 2026 Season
const CPL_TEAM_NAME_MAP: Record<string, string> = {
  'york9': 'Inter Toronto FC',
  'york9 fc': 'Inter Toronto FC',
  'york united': 'Inter Toronto FC',
  'york united fc': 'Inter Toronto FC',
  'inter toronto': 'Inter Toronto FC',
  'inter toronto fc': 'Inter Toronto FC',
  'supra': 'FC Supra du Québec',
  'quebec supra': 'FC Supra du Québec',
  'fc supra du quebec': 'FC Supra du Québec',
  'fc supra du québec': 'FC Supra du Québec',
  'supra du québec': 'FC Supra du Québec',
};

const DEFUNCT_CPL_TEAMS = new Set(['fc edmonton', 'edmonton', 'valour fc', 'valour']);

// Program Historical Records & Milestones
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
            NO RECORDS FOUND FOR SELECT PROGRAM
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

function DataTable({
  title,
  players,
  onAddToCompare,
}: {
  title: string;
  players: any[];
  onAddToCompare?: (player: ComparePlayer) => void;
}) {
  return (
    <section className="bg-card border border-border rounded-sm overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between gap-4">
        <div>
          <span className="text-[9px] font-mono tracking-[0.18em] text-charcoal-soft uppercase">
            DATABASE ENTITY STREAM
          </span>
          <h2 className="text-sm font-mono font-bold text-charcoal uppercase mt-1">
            {title}
          </h2>
        </div>
        <span className="text-[9px] font-mono text-charcoal-soft">
          {players.length} RECORDS
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left font-mono">
          <thead className="text-[8px] uppercase tracking-widest text-charcoal-soft bg-surface/60">
            <tr>
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Player / Club</th>
              <th className="px-4 py-2">League {'// Position'}</th>
              <th className="px-4 py-2 text-right">Metrics</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-[10px]">
            {players.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-charcoal-soft">
                  NO DATABASE RECORDS SYNCED
                </td>
              </tr>
            ) : (
              players.map((p: any, idx: number) => {
                const teamObj = Array.isArray(p.current_team) ? p.current_team[0] : p.current_team;
                const entitySlug = p.slug || p.external_id || p.id || slugify(p.name || 'player');
                const playerName = p.name || p.full_name || 'Player';
                const playerClub = teamObj?.name || p.clubName || p.club || 'Pro Club';
                const playerLeague = p.league || p.competitionName || 'Pro';
                const statSummary = p.goals !== undefined && p.goals !== null ? `${p.goals} G` : 'Active';
                return (
                  <tr
                    key={`${title}-${p.id || idx}`}
                    className="border-t border-border/40 hover:bg-surface/50 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-charcoal-soft font-bold">
                      {p.rank || idx + 1}
                    </td>
                    <td className="px-4 py-2.5">
                      <Link
                        href={`/players/${entitySlug}`}
                        prefetch={false}
                        className="text-charcoal font-bold hover:text-crimson transition-colors"
                      >
                        {playerName}
                      </Link>
                      {p.is_canadian === false && (
                        <span className="ml-1.5 text-[8px] text-charcoal-soft border border-border px-1 rounded-xs">
                          INTL
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-charcoal-soft">
                      {playerLeague} {'//'} {p.position || 'GEN'}
                    </td>
                    <td className="px-4 py-2.5 text-right text-crimson font-bold">
                      {statSummary}
                    </td>
                    <td className="px-4 py-2.5 text-right space-x-2">
                      {onAddToCompare && (
                        <button
                          onClick={() =>
                            onAddToCompare({
                              playerId: String(p.id || entitySlug),
                              name: playerName,
                              club: playerClub,
                              league: playerLeague,
                              statSummary,
                            })
                          }
                          className="text-[8px] font-mono border border-border px-2 py-1 text-charcoal hover:border-crimson hover:text-crimson transition-colors"
                        >
                          [ + COMPARE ]
                        </button>
                      )}
                      <Link
                        href={`/players/${entitySlug}`}
                        prefetch={false}
                        className="text-[9px] font-mono text-crimson hover:underline"
                      >
                        [ DOSSIER → ]
                      </Link>
                    </td>
                  </tr>
                );
              })
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
      try {
        const res = await fetch('/api/stats', { cache: 'no-store' });
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
  }, []);

  useEffect(() => {
    getCplStandings().then((data) => {
      if (data) setStandings(data);
    });
    getNslStandings().then((data) => {
      if (data) setNslStandings(data);
    });
  }, []);

  const activePlayers = dbPlayers;
  const activeTeams = dbTeams;

  // Strict Gender Filtering
  const filteredPlayers = useMemo(() => {
    return activePlayers.filter((p: any) => {
      const playerGender = String(p.gender || '').toLowerCase();
      const targetGender = programGender.toLowerCase();

      // Ensure exact gender match
      if (playerGender && playerGender !== targetGender) {
        return false;
      }
      
      // Fallback for entries missing gender property
      if (!playerGender) {
        const leagueUpper = String(p.league || '').toUpperCase();
        if (targetGender === 'women' && !leagueUpper.includes('NSL') && !leagueUpper.includes('NWSL')) return false;
        if (targetGender === 'men' && (leagueUpper.includes('NSL') || leagueUpper.includes('NWSL'))) return false;
      }

      const comp = String(p.league || p.competitionName || p.competition || '').toUpperCase();

      if (competition === 'CPL') {
        return comp.includes('CPL');
      } else if (competition === 'NSL') {
        return comp.includes('NSL');
      } else if (competition === 'ABROAD') {
        const isCanadian = p.is_canadian !== false;
        return isCanadian && (comp === 'ABROAD' || comp === 'MLS' || (!comp.includes('CPL') && !comp.includes('NSL')));
      }

      // Default 'ALL CANADIAN': Canadian players
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
        club: teamObj?.name || p.league || 'Pro Club',
        value: `${p.goals ?? 0} G`,
        initials: playerName.split(' ').map((n: string) => n[0]).join('.'),
        slug: p.slug || p.external_id || p.id,
      };
    });
  }, [filteredPlayers]);

  const computedAssists = useMemo<PlayerRow[]>(() => {
    const sorted = [...filteredPlayers].sort((a: any, b: any) => (b.assists ?? 0) - (a.assists ?? 0));
    return sorted.slice(0, 5).map((p: any, idx: number) => {
      const playerName = p.name || p.full_name || 'Player';
      const teamObj = Array.isArray(p.current_team) ? p.current_team[0] : p.current_team;
      return {
        rank: idx + 1,
        name: playerName,
        club: teamObj?.name || p.league || 'Pro Club',
        value: `${p.assists ?? 0} AST`,
        initials: playerName.split(' ').map((n: string) => n[0]).join('.'),
        slug: p.slug || p.external_id || p.id,
      };
    });
  }, [filteredPlayers]);

  const computedGoalkeepers = useMemo<PlayerRow[]>(() => {
    const keepers = filteredPlayers.filter((p: any) => p.position === 'GK');
    const source = keepers.length > 0 ? keepers : filteredPlayers;
    const sorted = [...source].sort((a: any, b: any) => (b.rating ?? 0) - (a.rating ?? 0));
    return sorted.slice(0, 5).map((p: any, idx: number) => {
      const playerName = p.name || p.full_name || 'Player';
      const teamObj = Array.isArray(p.current_team) ? p.current_team[0] : p.current_team;
      return {
        rank: idx + 1,
        name: playerName,
        club: teamObj?.name || p.league || 'Pro Club',
        value: `${p.rating ? Number(p.rating).toFixed(1) : '7.0'} RTG`,
        initials: playerName.split(' ').map((n: string) => n[0]).join('.'),
        slug: p.slug || p.external_id || p.id,
      };
    });
  }, [filteredPlayers]);

  // Canadians Abroad Leaderboard Reacts Strictly to Selected Program Gender
  const computedAbroad = useMemo<PlayerRow[]>(() => {
    const abroad = activePlayers.filter((p: any) => {
      const playerGender = String(p.gender || '').toLowerCase();
      const targetGender = programGender.toLowerCase();

      if (playerGender && playerGender !== targetGender) return false;

      const isC = p.is_canadian !== false;
      const comp = String(p.league || '').toUpperCase();
      return isC && (comp === 'ABROAD' || comp === 'MLS' || (!comp.includes('CPL') && !comp.includes('NSL')));
    });

    const sorted = [...abroad].sort((a: any, b: any) => (b.rating ?? 0) - (a.rating ?? 0));
    return sorted.slice(0, 5).map((p: any, idx: number) => {
      const playerName = p.name || p.full_name || 'Player';
      const teamObj = Array.isArray(p.current_team) ? p.current_team[0] : p.current_team;
      return {
        rank: idx + 1,
        name: playerName,
        club: teamObj?.name || p.league || 'International',
        value: `${p.rating ? Number(p.rating).toFixed(1) : '7.5'} RTG`,
        initials: playerName.split(' ').map((n: string) => n[0]).join('.'),
        slug: p.slug || p.external_id || p.id,
      };
    });
  }, [activePlayers, programGender]);

  // Clean, Unified CPL Teams List (Normalizes York9 / Inter Toronto & FC Supra du Québec)
  const cleanCplTeams = useMemo(() => {
    const seen = new Set<string>();

    const filtered = activeTeams.filter((t: any) => {
      const rawName = String(t.name || t.clubName || '').trim();
      const normKey = rawName.toLowerCase();
      const comp = String(t.competition || t.competitionName || t.league || '').toUpperCase();

      if (!comp.includes('CPL')) return false;
      if (DEFUNCT_CPL_TEAMS.has(normKey)) return false;

      const canonicalName = CPL_TEAM_NAME_MAP[normKey] || rawName;
      const canonicalKey = canonicalName.toLowerCase();

      if (seen.has(canonicalKey)) return false;
      seen.add(canonicalKey);
      return true;
    });

    return filtered.map((t: any, idx: number) => {
      const rawName = String(t.name || t.clubName || '').trim();
      const normKey = rawName.toLowerCase();
      const canonicalName = CPL_TEAM_NAME_MAP[normKey] || rawName;
      return {
        ...t,
        rank: idx + 1,
        name: canonicalName,
        clubName: canonicalName,
        position: t.position || 'GEN',
        league: 'CPL',
      };
    });
  }, [activeTeams]);

  const cleanNslTeams = useMemo(() => {
    const seen = new Set<string>();

    const filtered = activeTeams.filter((t: any) => {
      const rawName = String(t.name || t.clubName || '').trim();
      const canonicalKey = rawName.toLowerCase();
      const comp = String(t.competition || t.competitionName || t.league || '').toUpperCase();

      if (!comp.includes('NSL')) return false;
      if (seen.has(canonicalKey)) return false;

      seen.add(canonicalKey);
      return true;
    });

    return filtered.map((t: any, idx: number) => ({
      ...t,
      rank: idx + 1,
      position: t.position || 'GEN',
      league: 'NSL',
    }));
  }, [activeTeams]);

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
        club: teamObj?.name || p.league || 'Pro Club',
        yellows: p.yellow_cards ?? 0,
        reds: p.red_cards ?? 0,
        slug: p.slug || p.external_id || p.id,
      };
    });
  }, [filteredPlayers]);

  const computedTeamOfWeek = useMemo(() => {
    const sorted = [...filteredPlayers].sort((a: any, b: any) => (b.rating ?? 0) - (a.rating ?? 0));
    return sorted.slice(0, 6).map((p: any) => {
      const teamObj = Array.isArray(p.current_team) ? p.current_team[0] : p.current_team;
      const playerName = p.name || 'Player';
      return {
        playerId: p.id || p.slug,
        name: playerName,
        club: teamObj?.name || p.league || 'Pro Club',
        league: p.league || 'Domestic',
        initials: playerName.split(' ').map((n: string) => n[0]).join('.'),
        slug: p.slug || p.external_id || p.id,
      };
    });
  }, [filteredPlayers]);

  // Dynamic Historical Database / Records & Milestones depending on Gender Toggle
  const computedRecords = useMemo(() => {
    const baseRecords = programGender === 'MEN' ? menRecords : womenRecords;

    const genderPlayers = activePlayers.filter((p: any) => {
      const g = String(p.gender || '').toLowerCase();
      return g === programGender.toLowerCase();
    });

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
                  Live database query telemetry, player rankings, and entity streams across CPL, NSL, and global pathways.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[8px] shrink-0">
                <span className="px-2 py-1 border border-crimson/40 text-crimson rounded-sm">
                  {isLoading ? 'SYNCING DB...' : `${activePlayers.length} DB ENTRIES`}
                </span>
                <span className="px-2 py-1 border border-border text-charcoal-soft rounded-sm">
                  UPDATED // {season}
                </span>
              </div>
            </div>
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
                <option>2026</option>
                <option>2025</option>
              </select>
              <select
                value={competition}
                onChange={(e) => setCompetition(e.target.value)}
                className="bg-card border border-border rounded-sm px-3 py-2 text-[10px] font-mono text-charcoal flex-1"
              >
                <option>ALL CANADIAN</option>
                <option>CPL</option>
                <option>NSL</option>
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

          {(showOverview || showPlayers) && (
            <>
              <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                <MetricCard
                  label="DATABASE PLAYERS"
                  value={String(activePlayers.length)}
                  detail="SUPABASE SYNCED"
                  accent
                />
                <MetricCard
                  label="REGISTERED CLUBS"
                  value={String(activeTeams.length)}
                  detail="LEAGUES & PATHWAYS"
                />
                <MetricCard
                  label="CPL CLUBS"
                  value={String(standings.length)}
                  detail="LIVE STANDINGS"
                />
                <MetricCard
                  label="NSL CLUBS"
                  value={String(nslStandings.length)}
                  detail="LIVE STANDINGS"
                />
              </section>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <Leaderboard
                  title="Golden Boot"
                  subtitle={`${competition} // ${season} (${programGender})`}
                  rows={computedGoldenBoot}
                  valueLabel="GOALS"
                />
                <Leaderboard
                  title="Playmakers"
                  subtitle={`${competition} // ${season} (${programGender})`}
                  rows={computedAssists}
                  valueLabel="ASSISTS"
                />
                <Leaderboard
                  title="Goalkeeping"
                  subtitle={`TOP PERFORMERS // RATING (${programGender})`}
                  rows={computedGoalkeepers}
                  valueLabel="RATING"
                />
                <Leaderboard
                  title="Canadian Abroad"
                  subtitle={`GLOBAL PERFORMANCE INDEX // ${programGender}`}
                  rows={computedAbroad}
                  valueLabel="RATING"
                />
              </div>
            </>
          )}

          {showPlayers && (
            <DataTable
              title={programGender === 'MEN' ? 'ALL-CANADIAN MEN DATABASE LEADERS' : 'ALL-CANADIAN WOMEN DATABASE LEADERS'}
              players={filteredPlayers}
              onAddToCompare={handleAddToCompare}
            />
          )}

          {showTeams && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <DataTable
                title="CPL // CANADIAN PREMIER LEAGUE (2026 ACTIVE)"
                players={cleanCplTeams}
              />
              <DataTable
                title="NSL // NORTHERN SUPER LEAGUE (2026 ACTIVE)"
                players={cleanNslTeams}
              />
            </div>
          )}

          {showAbroad && (
            <DataTable
              title={`GLOBAL CANADIAN PERFORMANCE STREAM // ${programGender}`}
              players={activePlayers.filter((p: any) => {
                const targetIsFemale = programGender === 'WOMEN';
                const g = String(p.gender || 'men').toUpperCase();
                const matchesGender = targetIsFemale 
                  ? (g === 'WOMEN' || String(p.league || '').toUpperCase().includes('NSL'))
                  : (g === 'MEN' || !String(p.league || '').toUpperCase().includes('NSL'));

                if (!matchesGender) return false;

                const isC = p.is_canadian !== false;
                const comp = String(p.league || '').toUpperCase();
                return isC && (comp === 'ABROAD' || comp === 'MLS' || (!comp.includes('CPL') && !comp.includes('NSL')));
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
                Collegiate pathway data isn&apos;t tracked in the database yet. This tab will
                populate once a verified NCAA/U SPORTS source is connected.
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

          {(showOverview || showPlayers) && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <section className="bg-card border border-border rounded-sm overflow-hidden">
                <div className="p-4 border-b border-border">
                  <span className="text-[9px] font-mono tracking-widest text-charcoal-soft">
                    DISCIPLINE MONITOR
                  </span>
                  <h2 className="text-sm font-mono font-bold text-charcoal mt-1">
                    CARDED LEADERS ({programGender})
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

          {showOverview && (
            <section className="bg-card border border-border rounded-sm overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-charcoal-soft">
                    EDITOR&apos;S INDEX
                  </span>
                  <h2 className="text-sm font-mono font-bold text-charcoal mt-1">
                    ALL-CANADIAN TEAM OF THE WEEK ({programGender})
                  </h2>
                </div>
                <span className="text-[9px] font-mono border border-border px-2 py-1 text-charcoal-soft">
                  TOP RATED DB
                </span>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {computedTeamOfWeek.map((p) => (
                  <Link
                    key={p.playerId}
                    href={`/players/${p.slug}`}
                    prefetch={false}
                    className="border border-border/60 bg-surface/40 hover:border-crimson rounded-sm p-2 flex items-center gap-2 transition-colors"
                  >
                    <span className="w-7 h-7 bg-border rounded-sm flex items-center justify-center text-[8px] font-bold shrink-0">
                      {p.initials}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono font-bold truncate hover:text-crimson">
                        {p.name}
                      </div>
                      <div className="text-[8px] font-mono text-charcoal-soft truncate">
                        {p.club} {'// '}
                        {p.league}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
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
                <span>PROGRAM</span>
                <b className="text-charcoal">{programGender}</b>
              </div>
              <div className="flex justify-between">
                <span>DB PLAYERS</span>
                <b className="text-charcoal">{activePlayers.length}</b>
              </div>
              <div className="flex justify-between">
                <span>DB CLUBS</span>
                <b className="text-charcoal">{activeTeams.length}</b>
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
