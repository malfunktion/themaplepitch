// src/app/stats/page.tsx
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';

import SidebarStack from '@/components/sidebar/SidebarStack';
import type { StandingsRow } from '@/lib/types';
import { getCplStandings, getNslStandings } from '@/lib/data/standings';
import { players as demoPlayers, teams as demoTeams } from '@/lib/data/demo';

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
            NO RECORDS FOUND
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={`${title}-${row.rank}-${row.name}`}
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
                    className="text-[10px] sm:text-[11px] font-bold text-charcoal hover:text-crimson truncate block"
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
}: {
  title: string;
  players: any[];
}) {
  return (
    <section className="bg-card border border-border rounded-sm overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between gap-4">
        <div>
          <span className="text-[9px] font-mono tracking-[0.18em] text-charcoal-soft uppercase">
            ENTITY DATASET
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
                  NO RECORDS FOUND
                </td>
              </tr>
            ) : (
              players.map((p: any, idx: number) => {
                const entitySlug = p.slug || slugify(p.name || p.full_name || 'player');
                return (
                  <tr
                    key={`${title}-${idx}`}
                    className="border-t border-border/40 hover:bg-surface/50"
                  >
                    <td className="px-4 py-2.5 text-charcoal-soft font-bold">
                      {p.rank || idx + 1}
                    </td>
                    <td className="px-4 py-2.5">
                      <Link
                        href={`/players/${entitySlug}`}
                        className="text-charcoal font-bold hover:text-crimson"
                      >
                        {p.full_name || p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-charcoal-soft">
                      {p.competitionName || p.league || 'Pro'} {'//'} {p.position || 'GEN'}
                    </td>
                    <td className="px-4 py-2.5 text-right text-crimson font-bold">
                      {p.ga || p.goals || 'Active'}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Link
                        href={`/players/${entitySlug}`}
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
  const [provStatsProvince, setProvStatsProvince] = useState<
    'ON' | 'QC' | 'BC' | 'AB'
  >('ON');

  const [compareA, setCompareA] = useState('');
  const [compareB, setCompareB] = useState('');

  const activePlayers = demoPlayers;
  const activeTeams = demoTeams;

  const filteredPlayers = useMemo(() => {
    return activePlayers.filter(
      (p: any) =>
        !p.gender ||
        String(p.gender).toLowerCase() === programGender.toLowerCase() ||
        (programGender === 'MEN' && (p.competitionName?.includes('CPL') || p.clubName?.includes('Forge'))) ||
        (programGender === 'WOMEN' && p.competitionName?.includes('NSL'))
    );
  }, [activePlayers, programGender]);

  const computedGoldenBoot = useMemo<PlayerRow[]>(() => {
    const source = filteredPlayers.length > 0 ? filteredPlayers : activePlayers;
    return source.slice(0, 5).map((p: any, idx: number) => ({
      rank: idx + 1,
      name: p.name,
      club: p.clubName,
      value: `${p.goals} G`,
      initials: p.name
        .split(' ')
        .map((n: string) => n[0])
        .join('.'),
      slug: p.slug || slugify(p.name),
    }));
  }, [filteredPlayers, activePlayers]);

  const computedAssists = useMemo<PlayerRow[]>(() => {
    const source = filteredPlayers.length > 0 ? filteredPlayers : activePlayers;
    return source.slice(5, 10).map((p: any, idx: number) => ({
      rank: idx + 1,
      name: p.name,
      club: p.clubName,
      value: `${p.assists} AST`,
      initials: p.name
        .split(' ')
        .map((n: string) => n[0])
        .join('.'),
      slug: p.slug || slugify(p.name),
    }));
  }, [filteredPlayers, activePlayers]);

  const currentCleanSheets = programGender === 'MEN' ? menCleanSheets : womenCleanSheets;
  const currentAbroad = programGender === 'MEN' ? menAbroad : womenAbroad;
  const currentTeamOfWeek = programGender === 'MEN' ? menTeamOfWeek : womenTeamOfWeek;
  const currentDiscipline = programGender === 'MEN' ? menDisciplineLeaders : womenDisciplineLeaders;
  const currentRecords = programGender === 'MEN' ? menRecords : womenRecords;
  const currentCollegiate = programGender === 'MEN' ? menCollegiateStream : womenCollegiateStream;

  const comparePool = useMemo<ComparePlayer[]>(() => {
    const pool = new Map<string, ComparePlayer>();
    activePlayers.forEach((p: any) => {
      pool.set(p.slug, {
        playerId: p.slug,
        name: p.name,
        club: p.clubName,
        league: p.competitionName || 'PRO',
        statSummary: `${p.position} • ${p.rating} RTG • ${p.goals} G`,
      });
    });
    return [...pool.values()].sort((x, y) => x.name.localeCompare(y.name));
  }, [activePlayers]);

  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [nslStandings, setNslStandings] = useState<StandingsRow[]>([]);

  useEffect(() => {
    getCplStandings().then(setStandings);
    getNslStandings().then(setNslStandings);
  }, []);

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
                  Fully verified player telemetry, standings, and active entity routing across CPL, NSL, and global pathways.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[8px] shrink-0">
                <span className="px-2 py-1 border border-crimson/40 text-crimson rounded-sm">
                  {activePlayers.length} ENTITIES SYNCED
                </span>
                <span className="px-2 py-1 border border-border text-charcoal-soft rounded-sm">
                  UPDATED // 2026
                </span>
              </div>
            </div>

            <div className="p-3 border-b border-border bg-surface/40 flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-1 bg-card border border-border p-1 rounded-sm w-full sm:w-auto">
                {(['MEN', 'WOMEN'] as Gender[]).map((gender) => (
                  <button
                    key={gender}
                    onClick={() => {
                      setProgramGender(gender);
                      setCompareA('');
                      setCompareB('');
                    }}
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

            <nav
              aria-label="Statistics sections"
              className="overflow-x-auto border-b border-border"
            >
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

          {(showOverview || showPlayers) && (
            <>
              <section className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                <MetricCard
                  label="ACTIVE PLAYERS"
                  value={String(activePlayers.length)}
                  detail="DOSSIERS LINKED"
                  accent
                />
                <MetricCard
                  label="REGISTERED CLUBS"
                  value={String(activeTeams.length)}
                  detail="LEAGUES & PATHWAYS"
                />
                <MetricCard
                  label="CPL CLUBS"
                  value={String(standings.length || 8)}
                  detail="LIVE STANDINGS"
                />
                <MetricCard
                  label="NSL CLUBS"
                  value={String(nslStandings.length || 6)}
                  detail="LIVE STANDINGS"
                />
              </section>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <Leaderboard
                  title="Golden Boot"
                  subtitle={`${competition} // ${season}`}
                  rows={computedGoldenBoot}
                  valueLabel="GOALS"
                />
                <Leaderboard
                  title="Playmakers"
                  subtitle={`${competition} // ${season}`}
                  rows={computedAssists}
                  valueLabel="ASSISTS"
                />
                <Leaderboard
                  title="Goalkeeping"
                  subtitle="CLEAN SHEETS // LEADERS"
                  rows={currentCleanSheets}
                  valueLabel="CLEAN SHEETS"
                />
                <Leaderboard
                  title="Canadian Abroad"
                  subtitle="GLOBAL PERFORMANCE INDEX"
                  rows={currentAbroad}
                  valueLabel="RATING"
                />
              </div>
            </>
          )}

          {showPlayers && (
            <DataTable
              title={programGender === 'MEN' ? 'CPL PLAYER LEADERS' : 'NSL PLAYER LEADERS'}
              players={filteredPlayers}
            />
          )}

          {showTeams && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <DataTable
                title="CPL // CANADIAN PREMIER LEAGUE"
                players={activeTeams.filter((t: any) => t.competitionName?.includes('CPL'))}
              />
              <DataTable
                title="NSL // NORTHERN SUPER LEAGUE"
                players={activeTeams.filter((t: any) => t.competitionName?.includes('NSL'))}
              />
            </div>
          )}

          {showAbroad && (
            <DataTable
              title="GLOBAL CANADIAN PERFORMANCE STREAM"
              players={abroadStreamPlayers}
            />
          )}

          {showCollegiate && (
            <DataTable
              title={`COLLEGIATE PLAYER STREAM // ${programGender}`}
              players={currentCollegiate}
            />
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
                    CARDED LEADERS
                  </h2>
                </div>
                <div className="p-3 font-mono">
                  {currentDiscipline.map((p: any) => (
                    <div
                      key={p.playerId}
                      className="grid grid-cols-12 items-center py-2 border-b border-border/40 text-[10px]"
                    >
                      <span className="col-span-1 text-charcoal-soft">{p.rank}</span>
                      <span className="col-span-7 font-bold truncate">
                        {p.name}
                        <span className="font-normal text-charcoal-soft">
                          {' // '}
                          {p.club}
                        </span>
                      </span>
                      <span className="col-span-2 text-right text-crimson font-bold">
                        {p.yellows} Y
                      </span>
                      <span className="col-span-2 text-right">{p.reds} R</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-card border border-border rounded-sm overflow-hidden">
                <div className="p-4 border-b border-border">
                  <span className="text-[9px] font-mono tracking-widest text-charcoal-soft">
                    HISTORICAL DATABASE
                  </span>
                  <h2 className="text-sm font-mono font-bold text-charcoal mt-1">
                    RECORDS & MILESTONES
                  </h2>
                </div>
                <div className="p-3">
                  {currentRecords.slice(0, 5).map((r: any) => (
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
                    ALL-CANADIAN TEAM OF THE WEEK
                  </h2>
                </div>
                <span className="text-[9px] font-mono border border-border px-2 py-1 text-charcoal-soft">
                  4-3-3
                </span>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {currentTeamOfWeek.map((p: any) => (
                  <div
                    key={p.playerId}
                    className="border border-border/60 bg-surface/40 rounded-sm p-2 flex items-center gap-2"
                  >
                    <span className="w-7 h-7 bg-border rounded-sm flex items-center justify-center text-[8px] font-bold">
                      {p.initials}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono font-bold truncate">
                        {p.name}
                      </div>
                      <div className="text-[8px] font-mono text-charcoal-soft truncate">
                        {p.club} {'// '}
                        {p.league}
                      </div>
                    </div>
                  </div>
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
                ACTIVE ENTITIES
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
                <span>PLAYERS LINKED</span>
                <b className="text-charcoal">{activePlayers.length}</b>
              </div>
              <div className="flex justify-between">
                <span>CLUBS REGISTERED</span>
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

// Supplemental Data Sets
const menCleanSheets = [
  { rank: 1, name: 'Triston Henry', club: 'Forge FC', value: '7 CS', initials: 'T.H' },
  { rank: 2, name: 'Marco Carducci', club: 'Cavalry FC', value: '6 CS', initials: 'M.C' },
  { rank: 3, name: 'Nathan Ingham', club: 'Atlético Ottawa', value: '5 CS', initials: 'N.I' },
  { rank: 4, name: 'Callum Irving', club: 'Pacific FC', value: '4 CS', initials: 'C.I' },
  { rank: 5, name: 'Sean Melvin', club: 'Atletico Ottawa', value: '3 CS', initials: 'S.M' },
];

const womenCleanSheets = [
  { rank: 1, name: 'Katelyn Rowland', club: 'Calgary Wild', value: '6 CS', initials: 'K.R' },
  { rank: 2, name: 'Rylee Foster', club: 'AFC Toronto', value: '5 CS', initials: 'R.F' },
  { rank: 3, name: 'Stephanie Labbé', club: 'Montreal Roses', value: '4 CS', initials: 'S.L' },
  { rank: 4, name: 'Kailen Sheridan', club: 'San Diego Wave', value: '3 CS', initials: 'K.S' },
  { rank: 5, name: 'Sabrina D’Angelo', club: 'Aston Villa', value: '3 CS', initials: 'S.D' },
];

const menAbroad = [
  { rank: 1, name: 'Jonathan David', club: 'Lille OSC // FRA', value: '8.4 RTG', initials: 'J.D' },
  { rank: 2, name: 'Alphonso Davies', club: 'Bayern Munich // GER', value: '8.1 RTG', initials: 'A.D' },
  { rank: 3, name: 'Stephen Eustáquio', club: 'FC Porto // POR', value: '7.8 RTG', initials: 'S.E' },
  { rank: 4, name: 'Tajon Buchanan', club: 'Villarreal // ESP', value: '7.8 RTG', initials: 'T.B' },
  { rank: 5, name: 'Ismaël Koné', club: 'Marseille // FRA', value: '7.7 RTG', initials: 'I.K' },
];

const womenAbroad = [
  { rank: 1, name: 'Jessie Fleming', club: 'Portland Thorns // USA', value: '8.3 RTG', initials: 'J.F' },
  { rank: 2, name: 'Kadeisha Buchanan', club: 'Chelsea FC // ENG', value: '8.2 RTG', initials: 'K.B' },
  { rank: 3, name: 'Julia Grosso', club: 'Chicago Red Stars // USA', value: '8.0 RTG', initials: 'J.G' },
  { rank: 4, name: 'Evelyne Viens', club: 'AS Roma // ITA', value: '7.9 RTG', initials: 'E.V' },
  { rank: 5, name: 'Cloé Lacasse', club: 'Utah Royals // USA', value: '7.8 RTG', initials: 'C.L' },
];

const menCollegiateStream = [
  { rank: 1, name: 'J. Smith', club: 'Syracuse Univ. (NCAA D1)', ga: '11 G • 3 A', rtg: '0.85 GPM' },
  { rank: 2, name: 'T. Wright', club: 'Cape Breton (U SPORTS)', ga: '9 G • 2 A', rtg: '0.78 GPM' },
  { rank: 3, name: 'M. Rossi', club: 'Wake Forest (NCAA D1)', ga: '7 G • 5 A', rtg: '0.62 GPM' },
];

const womenCollegiateStream = [
  { rank: 1, name: 'S. Alarie', club: 'Penn State (NCAA D1)', ga: '14 G • 4 A', rtg: '0.92 GPM' },
  { rank: 2, name: 'C. Briand', club: 'Laval (U SPORTS)', ga: '12 G • 2 A', rtg: '0.88 GPM' },
  { rank: 3, name: 'M. Leon', club: 'Florida State (NCAA D1)', ga: '10 G • 3 A', rtg: '0.75 GPM' },
];

const abroadStreamPlayers = [
  { rank: 1, name: 'Jonathan David', club: 'Lille OSC (Ligue 1)', ga: '18 G • 4 A', rtg: '8.4' },
  { rank: 2, name: 'Alphonso Davies', club: 'Bayern Munich (Bundesliga)', ga: '2 G • 6 A', rtg: '8.1' },
];

const menTeamOfWeek = [
  { playerId: 'motw-m-01', name: 'Triston Henry', club: 'Forge FC', league: 'CPL', initials: 'T.H' },
  { playerId: 'motw-m-02', name: 'Richie Laryea', club: 'Toronto FC', league: 'MLS', initials: 'R.L' },
  { playerId: 'motw-m-03', name: 'Alistair Johnston', club: 'Celtic FC', league: 'ABROAD', initials: 'A.J' },
  { playerId: 'motw-m-04', name: 'Moïse Bombito', club: 'OGC Nice', league: 'ABROAD', initials: 'M.B' },
  { playerId: 'motw-m-05', name: 'Karifa Yao', club: 'Forge FC', league: 'CPL', initials: 'K.Y' },
  { playerId: 'motw-m-06', name: 'Ali Musse', club: 'Cavalry FC', league: 'CPL', initials: 'A.M' },
];

const womenTeamOfWeek = [
  { playerId: 'motw-w-01', name: 'Katelyn Rowland', club: 'Calgary Wild', league: 'NSL', initials: 'K.R' },
  { playerId: 'motw-w-02', name: 'Jade Rose', club: 'AFC Toronto', league: 'NSL', initials: 'J.R' },
  { playerId: 'motw-w-03', name: 'Kadeisha Buchanan', club: 'Chelsea FC', league: 'ABROAD', initials: 'K.B' },
  { playerId: 'motw-w-04', name: 'Vanessa Gilles', club: 'Vancouver Rise', league: 'NSL', initials: 'V.G' },
  { playerId: 'motw-w-05', name: 'Shelina Zadorsky', club: 'Halifax Tides', league: 'NSL', initials: 'S.Z' },
  { playerId: 'motw-w-06', name: 'Sarah Stratigakis', club: 'Vancouver Rise', league: 'NSL', initials: 'S.S' },
];

const menDisciplineLeaders = [
  { rank: 1, playerId: 'disc-m-01', name: 'Malcolm Shaw', club: 'Cavalry FC', yellows: 6, reds: 0 },
  { rank: 2, playerId: 'disc-m-02', name: 'Jonathan Osorio', club: 'Toronto FC', yellows: 5, reds: 0 },
];

const womenDisciplineLeaders = [
  { rank: 1, playerId: 'disc-w-01', name: 'Vanessa Gilles', club: 'Vancouver Rise', yellows: 5, reds: 0 },
  { rank: 2, playerId: 'disc-w-02', name: 'Shelina Zadorsky', club: 'Halifax Tides', yellows: 4, reds: 0 },
];

const menRecords = [
  { label: 'Most goals, single CPL season', value: 'Tomasz Skublak — 12 (2021)' },
  { label: 'Most CPL appearances', value: 'Karifa Yao — 130' },
];

const womenRecords = [
  { label: 'Most goals, inaugural NSL season', value: 'Jorian Baucom — 11 (2025)' },
];

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
      { pos: 1, club: 'Calgary Foothills', pts: 34, gd: '+15' },
      { pos: 2, club: 'Cavalry U21', pts: 31, gd: '+11' },
      { pos: 3, club: 'Edmonton Scottish', pts: 26, gd: '+3' },
      { pos: 4, club: 'St. Albert Impact', pts: 21, gd: '-2' },
      { pos: 5, club: 'Calgary Wild Pro-Am', pts: 18, gd: '-5' },
      { pos: 6, club: 'Edmonton BTB', pts: 14, gd: '-8' },
      { pos: 7, club: 'Cavalry U21 B', pts: 10, gd: '-12' },
    ];
  }
}
