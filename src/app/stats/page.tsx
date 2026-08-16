// src/app/stats/page.tsx

'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import SidebarStack from '@/components/sidebar/SidebarStack';
import type { StandingsRow } from '@/lib/types';

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
          <span className="col-span-7">PLAYER {'// SCHOOL'}</span>
          <span className="col-span-4 text-right">{valueLabel}</span>
        </div>
        {rows.map((row) => (
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
                <div className="text-[10px] sm:text-[11px] font-bold text-charcoal truncate">
                  {row.name}
                </div>
                <div className="text-[8px] sm:text-[9px] text-charcoal-soft truncate">
                  {row.club}
                </div>
              </div>
            </div>
            <span className="col-span-4 text-right text-[11px] sm:text-xs font-bold text-crimson">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function DataTable({
  title,
  players,
  abroad = false,
}: {
  title: string;
  players: any[];
  abroad?: boolean;
}) {
  return (
    <section className="bg-card border border-border rounded-sm overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between gap-4">
        <div>
          <span className="text-[9px] font-mono tracking-[0.18em] text-charcoal-soft uppercase">
            RANKED DATASET
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
              <th className="px-4 py-2">Player</th>
              <th className="px-4 py-2">School {'// League'}</th>
              <th className="px-4 py-2 text-right">Goals / Assists</th>
              <th className="px-4 py-2 text-right">GPM / Status</th>
            </tr>
          </thead>
          <tbody className="text-[10px]">
            {players.map((p) => (
              <tr
                key={`${title}-${p.rank}`}
                className="border-t border-border/40 hover:bg-surface/50"
              >
                <td className="px-4 py-2.5 text-charcoal-soft font-bold">
                  {p.rank}
                </td>
                <td className="px-4 py-2.5 text-charcoal font-bold">{p.name}</td>
                <td className="px-4 py-2.5 text-charcoal-soft">{p.club}</td>
                <td className="px-4 py-2.5 text-right text-crimson font-bold">
                  {p.ga}
                </td>
                <td className="px-4 py-2.5 text-right text-charcoal">
                  {p.rtg ?? p.mins}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ComparePanel({
  pool,
  a,
  b,
  setA,
  setB,
}: {
  pool: ComparePlayer[];
  a: string;
  b: string;
  setA: (v: string) => void;
  setB: (v: string) => void;
}) {
  const first = pool.find((p) => p.playerId === a);
  const second = pool.find((p) => p.playerId === b);
  return (
    <section className="bg-card border border-border rounded-sm overflow-hidden">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[9px] font-mono tracking-[0.18em] text-charcoal-soft">
            SCOUT TERMINAL // PLAYER COMPARISON
          </span>
          <h2 className="text-sm font-mono font-bold text-charcoal mt-1">
            COMPARE TWO PLAYERS
          </h2>
        </div>
        <span className="text-[9px] font-mono text-charcoal-soft">
          CLIENT PREVIEW
        </span>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          ['PLAYER A', a, setA],
          ['PLAYER B', b, setB],
        ].map(([label, value, setter]) => (
          <label key={label as string} className="block">
            <span className="block text-[8px] font-mono tracking-widest text-charcoal-soft mb-1">
              {label as string}
            </span>
            <select
              value={value as string}
              onChange={(e) => (setter as (v: string) => void)(e.target.value)}
              className="w-full bg-surface border border-border rounded-sm px-3 py-2 text-xs font-mono text-charcoal outline-none focus:border-crimson"
            >
              <option value="">SELECT PLAYER</option>
              {pool.map((p) => (
                <option key={p.playerId} value={p.playerId}>
                  {p.name} — {p.club}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      {first && second ? (
        <div className="border-t border-border grid grid-cols-2 divide-x divide-border">
          {[first, second].map((p) => (
            <div key={p.playerId} className="p-4">
              <div className="text-[9px] font-mono text-charcoal-soft">
                {p.league}
              </div>
              <div className="text-sm font-mono font-bold text-charcoal mt-1">
                {p.name}
              </div>
              <div className="text-[9px] font-mono text-charcoal-soft mt-0.5">
                {p.club}
              </div>
              <div className="mt-3 text-xs font-mono text-crimson font-bold">
                {p.statSummary || 'PROFILE DATA PENDING'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-t border-border p-4 text-[9px] font-mono text-charcoal-soft">
          SELECT TWO PLAYERS TO INITIALISE THE COMPARISON VIEW.
        </div>
      )}
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

  const currentGoldenBoot =
    programGender === 'MEN' ? menGoldenBoot : womenGoldenBoot;
  const currentAssists = programGender === 'MEN' ? menAssists : womenAssists;
  const currentCleanSheets =
    programGender === 'MEN' ? menCleanSheets : womenCleanSheets;
  const currentAbroad = programGender === 'MEN' ? menAbroad : womenAbroad;
  const currentTeamOfWeek =
    programGender === 'MEN' ? menTeamOfWeek : womenTeamOfWeek;
  const currentDiscipline =
    programGender === 'MEN' ? menDisciplineLeaders : womenDisciplineLeaders;
  const currentSuspensionWatch =
    programGender === 'MEN' ? menSuspensionWatch : womenSuspensionWatch;
  const currentDutyTracker =
    programGender === 'MEN' ? menDutyTracker : womenDutyTracker;
  const currentRecords = programGender === 'MEN' ? menRecords : womenRecords;
  const currentCollegiate = programGender === 'MEN' ? menCollegiateStream : womenCollegiateStream;

  const streamPlayers =
    programGender === 'MEN' ? cplStreamPlayers : nslStreamPlayers;
  const secondaryStream =
    programGender === 'MEN' ? mlsStreamPlayers : abroadStreamPlayers;

  const comparePool = useMemo<ComparePlayer[]>(() => {
    const pool = new Map<string, ComparePlayer>();
    const add = (source: any[], defaultLeague: string) =>
      source.forEach((p) => {
        const id =
          p.playerId || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (!pool.has(id))
          pool.set(id, {
            playerId: id,
            name: p.name,
            club: p.club,
            league: p.league || defaultLeague,
            statSummary: `${p.value || p.ga || ''}${
              p.rtg ? ` • ${p.rtg} RTG` : ''
            }${p.mins ? ` • ${p.mins} MINS` : ''}`.trim(),
          });
      });
    [
      currentGoldenBoot,
      currentAssists,
      currentCleanSheets,
      currentAbroad,
      streamPlayers,
      secondaryStream,
      currentTeamOfWeek,
      currentCollegiate,
    ].forEach((source) => add(source, 'CANADA'));
    return [...pool.values()].sort((x, y) => x.name.localeCompare(y.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    programGender,
    currentGoldenBoot,
    currentAssists,
    currentCleanSheets,
    currentAbroad,
    streamPlayers,
    secondaryStream,
    currentTeamOfWeek,
    currentCollegiate,
  ]);

  const standings: StandingsRow[] = [
    { position: 1, clubName: 'Forge FC', played: 14, points: 28, goalDifference: 12 },
    { position: 2, clubName: 'Atlético Ottawa', played: 14, points: 26, goalDifference: 8 },
    { position: 3, clubName: 'Cavalry FC', played: 14, points: 24, goalDifference: 6 },
    { position: 4, clubName: 'York United FC', played: 14, points: 20, goalDifference: -2 },
  ];

  const nslStandings: StandingsRow[] = [
    { position: 1, clubName: 'AFC Toronto', played: 10, points: 22, goalDifference: 9 },
    { position: 2, clubName: 'Calgary Wild FC', played: 10, points: 19, goalDifference: 5 },
    { position: 3, clubName: 'Halifax Tides FC', played: 10, points: 15, goalDifference: 1 },
  ];

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
                  LIVE DATA CENTRE / CANADA
                </div>
                <h1 className="text-xl sm:text-2xl font-mono font-black tracking-tight mt-1">
                  STATS // MASTER INTELLIGENCE HUB
                </h1>
                <p className="text-[10px] sm:text-xs font-mono text-charcoal-soft max-w-2xl mt-2 leading-relaxed">
                  A single analytical surface for Canadian player performance,
                  league leaders, national-team duty, provincial pathways, collegiate pipelines and Canadians competing abroad.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[8px] shrink-0">
                <span className="px-2 py-1 border border-crimson/40 text-crimson rounded-sm">
                  DEMO DATA
                </span>
                <span className="px-2 py-1 border border-border text-charcoal-soft rounded-sm">
                  UPDATED // 11 AUG 2026
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
                <option>2024</option>
              </select>
              <select
                value={competition}
                onChange={(e) => setCompetition(e.target.value)}
                className="bg-card border border-border rounded-sm px-3 py-2 text-[10px] font-mono text-charcoal flex-1"
              >
                <option>ALL CANADIAN</option>
                <option>CPL</option>
                <option>NSL</option>
                <option>MLS // CANADIANS</option>
                <option>ABROAD</option>
                <option>COLLEGIATE (NCAA / U SPORTS)</option>
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
                  label="TOP SCORER"
                  value={currentGoldenBoot[0].value.replace(' G', '')}
                  detail={`${currentGoldenBoot[0].name} // ${season}`}
                  accent
                />
                <MetricCard
                  label="TOP PLAYMAKER"
                  value={currentAssists[0].value.replace(' AST', '')}
                  detail={`${currentAssists[0].name} // ASSISTS`}
                />
                <MetricCard
                  label="BEST ABROAD"
                  value={currentAbroad[0].value.replace(' RTG', '')}
                  detail={`${currentAbroad[0].name} // RATING`}
                />
                <MetricCard
                  label="CLEAN SHEETS"
                  value={currentCleanSheets[0].value.replace(' CS', '')}
                  detail={`${currentCleanSheets[0].name} // GOALKEEPER`}
                />
              </section>
              <section className="bg-card border border-border rounded-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-5">
                  <div className="md:col-span-2 min-h-[190px] bg-[#101010] relative overflow-hidden flex items-end p-4">
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent_49%,#888_50%,transparent_51%),linear-gradient(transparent_49%,#888_50%,transparent_51%)] bg-[length:28px_28px]" />
                    <div className="relative">
                      <span className="text-[9px] font-mono tracking-[0.2em] text-crimson">
                        STAT STORY // WEEK 14
                      </span>
                      <div className="text-white text-lg font-mono font-black mt-1">
                        THE NUMBERS BEHIND THE FORM
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-3 p-5 flex flex-col justify-center">
                    <div className="text-[9px] font-mono tracking-[0.18em] text-charcoal-soft">
                      {programGender === 'MEN'
                        ? 'CPL SCORING PACE'
                        : 'NSL SCORING PACE'}
                    </div>
                    <h2 className="text-base sm:text-lg font-mono font-black text-charcoal mt-1">
                      {programGender === 'MEN'
                        ? 'Campbell is setting the pace at the top of the Canadian scoring board.'
                        : 'Baucom has established the early benchmark for the Canadian women’s game.'}
                    </h2>
                    <p className="text-[10px] sm:text-xs font-mono text-charcoal-soft leading-relaxed mt-2">
                      This dashboard is designed to turn the weekly numbers into
                      a readable signal: who is producing, where the production
                      is happening and how Canadian players are moving through
                      the game.
                    </p>
                    <Link
                      href="/the-wire"
                      className="text-[9px] font-mono text-crimson hover:underline mt-3"
                    >
                      [ READ THE FULL BREAKDOWN → ]
                    </Link>
                  </div>
                </div>
              </section>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <Leaderboard
                  title="Golden Boot"
                  subtitle={`${competition} // ${season}`}
                  rows={currentGoldenBoot}
                  valueLabel="GOALS"
                />
                <Leaderboard
                  title="Playmakers"
                  subtitle={`${competition} // ${season}`}
                  rows={currentAssists}
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
            <>
              <ComparePanel
                pool={comparePool}
                a={compareA}
                b={compareB}
                setA={setCompareA}
                setB={setCompareB}
              />
              <DataTable
                title={
                  programGender === 'MEN'
                    ? 'CPL PLAYER LEADERS'
                    : 'NSL PLAYER LEADERS'
                }
                players={streamPlayers}
              />
            </>
          )}
          {showTeams && (
            <>
              <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <MetricCard
                  label="CPL LEADER"
                  value="28 PTS"
                  detail="FORGE FC"
                  accent
                />
                <MetricCard
                  label="NSL LEADER"
                  value="22 PTS"
                  detail="AFC TORONTO"
                />
                <MetricCard label="BEST GD" value="+12" detail="FORGE FC" />
                <MetricCard
                  label="FORM SIGNAL"
                  value="W W D W"
                  detail="TOP CURRENT RUN"
                />
              </section>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <DataTable
                  title="CPL // CANADIAN PREMIER LEAGUE"
                  players={cplStreamPlayers}
                />
                <DataTable
                  title="NSL // NORTHERN SUPER LEAGUE"
                  players={nslStreamPlayers}
                />
                <DataTable
                  title="MLS // CANADIANS STREAM"
                  players={mlsStreamPlayers}
                />
                <DataTable
                  title="EUROPE & ABROAD"
                  players={abroadStreamPlayers}
                  abroad
                />
              </div>
            </>
          )}
          {showAbroad && (
            <>
              <section className="bg-card border border-border rounded-sm p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-mono tracking-[0.18em] text-charcoal-soft">
                      CANADIAN PLAYER EXPORT // GLOBAL VIEW
                    </span>
                    <h2 className="text-lg font-mono font-black text-charcoal mt-1">
                      CANADIANS ABROAD
                    </h2>
                  </div>
                  <span className="text-[9px] font-mono text-crimson">
                    LIVE INDEX
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <MetricCard
                    label="TOP RATING"
                    value={currentAbroad[0].value.replace(' RTG', '')}
                    detail={currentAbroad[0].name}
                    accent
                  />
                  <MetricCard
                    label="STREAM"
                    value="10"
                    detail="TRACKED PLAYERS"
                  />
                  <MetricCard label="MARKETS" value="9" detail="COUNTRIES / LEAGUES" />
                </div>
              </section>
              <DataTable
                title="GLOBAL CANADIAN PERFORMANCE STREAM"
                players={abroadStreamPlayers}
                abroad
              />
              <section className="bg-card border border-border rounded-sm overflow-hidden">
                <div className="p-4 border-b border-border">
                  <span className="text-[9px] font-mono tracking-widest text-charcoal-soft">
                    INTERNATIONAL DUTY TRACKER
                  </span>
                  <h2 className="text-sm font-mono font-bold text-charcoal mt-1">
                    NATIONAL TEAM AVAILABILITY
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] font-mono text-[10px]">
                    <thead className="bg-surface/60 text-[8px] uppercase tracking-widest text-charcoal-soft">
                      <tr>
                        <th className="text-left px-4 py-2">#</th>
                        <th className="text-left px-4 py-2">Player</th>
                        <th className="text-left px-4 py-2">Pos</th>
                        <th className="text-right px-4 py-2">Caps</th>
                        <th className="text-right px-4 py-2">Goals</th>
                        <th className="text-right px-4 py-2">Last Call</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDutyTracker.map((p) => (
                        <tr key={p.playerId} className="border-t border-border/40">
                          <td className="px-4 py-2 text-charcoal-soft">{p.rank}</td>
                          <td className="px-4 py-2 font-bold">{p.name}</td>
                          <td className="px-4 py-2 text-charcoal-soft">
                            {p.position}
                          </td>
                          <td className="px-4 py-2 text-right">{p.caps}</td>
                          <td className="px-4 py-2 text-right text-crimson font-bold">
                            {p.goals}
                          </td>
                          <td className="px-4 py-2 text-right text-charcoal-soft">
                            {p.lastCalled}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
          {showCollegiate && (
            <>
              <section className="bg-card border border-border rounded-sm p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-mono tracking-[0.18em] text-charcoal-soft">
                      NCAA D1 & U SPORTS // PIPELINE DATASET
                    </span>
                    <h2 className="text-lg font-mono font-black text-charcoal mt-1">
                      COLLEGIATE FOOTBALL INTELLIGENCE
                    </h2>
                  </div>
                  <Link href="/collegiate-pipeline" className="text-[9px] font-mono text-crimson hover:underline">
                    [ OPEN COLLEGIATE PIPELINE TERMINAL → ]
                  </Link>
                </div>
              </section>
              <DataTable
                title={`COLLEGIATE PLAYER STREAM // ${programGender}`}
                players={currentCollegiate}
              />
            </>
          )}
          {showProvincial && (
            <>
              <section className="bg-card border border-border rounded-sm p-3">
                <div className="flex flex-wrap gap-1">
                  {(['ON', 'QC', 'BC', 'AB'] as const).map((prov) => (
                    <button
                      key={prov}
                      onClick={() => setProvStatsProvince(prov)}
                      className={`px-3 py-2 text-[9px] font-mono font-bold rounded-sm border ${
                        provStatsProvince === prov
                          ? 'bg-crimson text-white border-crimson'
                          : 'border-border text-charcoal-soft hover:text-charcoal'
                      }`}
                    >
                      {prov} {'// '}
                      {provStatsStatsHeading(prov).replace('LEAGUE1 ', '')}
                    </button>
                  ))}
                </div>
              </section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <section className="bg-card border border-border rounded-sm p-4">
                  <span className="text-[9px] font-mono tracking-widest text-charcoal-soft">
                    {provStatsStatsHeading(provStatsProvince)}
                  </span>
                  <h2 className="text-sm font-mono font-bold mt-1">
                    STANDINGS SIGNAL
                  </h2>
                  <div className="mt-3 space-y-1 font-mono">
                    {provincialStandings.map((r) => (
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
                    {provincialScorers.map((r, i) => (
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
            </>
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
                  {currentDiscipline.map((p) => (
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
                  <div className="mt-3 text-[8px] tracking-widest text-charcoal-soft">
                    SUSPENSION WATCH // 1 BOOKING FROM A BAN
                  </div>
                  {currentSuspensionWatch.map((p) => (
                    <div key={p.playerId} className="flex justify-between py-2 text-[10px]">
                      <span>{p.name}</span>
                      <span className="text-crimson font-bold">
                        {p.yellows} Y {'// 1 AWAY'}
                      </span>
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
                  {currentRecords.slice(0, 7).map((r) => (
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
                <Link
                  href="/the-wire"
                  className="block p-3 text-[9px] font-mono text-crimson hover:underline"
                >
                  [ OPEN HISTORICAL ARCHIVE → ]
                </Link>
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
                {currentTeamOfWeek.map((p) => (
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
              <span className="text-[8px] font-mono text-crimson">DEMO</span>
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
                <span>COMPETITION</span>
                <b className="text-charcoal">{competition}</b>
              </div>
              <div className="flex justify-between">
                <span>LAST REFRESH</span>
                <b className="text-charcoal">11 AUG 2026</b>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border text-[8px] leading-relaxed font-mono text-charcoal-soft">
              Production version should expose source attribution, freshness
              timestamps and methodology at the dataset level. Current figures
              are development fixtures.
            </div>
          </div>
          <SidebarStack standings={standings} nslStandings={nslStandings} />
        </aside>
      </div>
    </div>
  );
}

const menGoldenBoot = [
  { rank: 1, name: 'Terran Campbell', club: 'Forge FC', value: '14 G', initials: 'T.C' },
  { rank: 2, name: 'Moses Dyer', club: 'Vancouver FC', value: '11 G', initials: 'M.D' },
  { rank: 3, name: 'Alejandro Díaz', club: 'Pacific FC', value: '10 G', initials: 'A.D' },
  { rank: 4, name: 'Gabriele Prokop', club: 'York United', value: '9 G', initials: 'G.P' },
  { rank: 5, name: 'Brian Wright', club: 'Atlético Ottawa', value: '8 G', initials: 'B.W' },
];
const womenGoldenBoot = [
  { rank: 1, name: 'Jorian Baucom', club: 'AFC Toronto', value: '11 G', initials: 'J.B' },
  { rank: 2, name: 'Evelyne Viens', club: 'Montreal Roses', value: '9 G', initials: 'E.V' },
  { rank: 3, name: 'Melissa Tancredi', club: 'Calgary Wild', value: '8 G', initials: 'M.T' },
  { rank: 4, name: 'Cloé Lacasse', club: 'Ottawa Rapid', value: '7 G', initials: 'C.L' },
  { rank: 5, name: 'Sarah Stratigakis', club: 'Vancouver Rise', value: '6 G', initials: 'S.S' },
];
const menAssists = [
  { rank: 1, name: 'Manny Aparicio', club: 'Pacific FC', value: '8 AST', initials: 'M.A' },
  { rank: 2, name: 'Tristan Borges', club: 'Forge FC', value: '8 AST', initials: 'T.B' },
  { rank: 3, name: 'Ali Musse', club: 'Cavalry FC', value: '7 AST', initials: 'A.M' },
  { rank: 4, name: 'Sean Young', club: 'Pacific FC', value: '5 AST', initials: 'S.Y' },
  { rank: 5, name: 'Brian Wright', club: 'Atlético Ottawa', value: '5 AST', initials: 'B.W' },
];
const womenAssists = [
  { rank: 1, name: 'Sarah Stratigakis', club: 'Vancouver Rise', value: '6 AST', initials: 'S.S' },
  { rank: 2, name: 'Simi Awujo', club: 'Montreal Roses', value: '5 AST', initials: 'S.A' },
  { rank: 3, name: 'Evelyne Viens', club: 'Montreal Roses', value: '4 AST', initials: 'E.V' },
  { rank: 4, name: 'Adriana Leon', club: 'Calgary Wild', value: '4 AST', initials: 'A.L' },
  { rank: 5, name: 'Cloé Lacasse', club: 'Ottawa Rapid', value: '3 AST', initials: 'C.L' },
];
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
// --- Collegiate Streams ---
const menCollegiateStream = [
  { rank: 1, name: 'J. Smith', club: 'Syracuse Univ. (NCAA D1)', ga: '11 G • 3 A', rtg: '0.85 GPM' },
  { rank: 2, name: 'T. Wright', club: 'Cape Breton (U SPORTS)', ga: '9 G • 2 A', rtg: '0.78 GPM' },
  { rank: 3, name: 'M. Rossi', club: 'Wake Forest (NCAA D1)', ga: '7 G • 5 A', rtg: '0.62 GPM' },
  { rank: 4, name: 'A. Kone', club: 'Montreal (U SPORTS)', ga: '6 G • 2 A', rtg: '0.55 GPM' },
  { rank: 5, name: 'D. Osorio', club: 'UBC (U SPORTS)', ga: '5 G • 4 A', rtg: '0.50 GPM' },
];
const womenCollegiateStream = [
  { rank: 1, name: 'S. Alarie', club: 'Penn State (NCAA D1)', ga: '14 G • 4 A', rtg: '0.92 GPM' },
  { rank: 2, name: 'C. Briand', club: 'Laval (U SPORTS)', ga: '12 G • 2 A', rtg: '0.88 GPM' },
  { rank: 3, name: 'M. Leon', club: 'Florida State (NCAA D1)', ga: '10 G • 3 A', rtg: '0.75 GPM' },
  { rank: 4, name: 'K. Grewal', club: 'UBC (U SPORTS)', ga: '8 G • 3 A', rtg: '0.60 GPM' },
  { rank: 5, name: 'L. Awujo', club: 'USC (NCAA D1)', ga: '7 G • 2 A', rtg: '0.55 GPM' },
];
// --- 10-Player Stream Data Lists ---
const cplStreamPlayers = [
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
const nslStreamPlayers = [
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
const mlsStreamPlayers = [
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
const abroadStreamPlayers = [
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
const menTeamOfWeek = [
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
const womenTeamOfWeek = [
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
const menDisciplineLeaders = [
  { rank: 1, playerId: 'disc-m-01', name: 'Malcolm Shaw', club: 'Cavalry FC', league: 'CPL', yellows: 6, reds: 0 },
  { rank: 2, playerId: 'disc-m-02', name: 'Jonathan Osorio', club: 'Toronto FC', league: 'MLS', yellows: 5, reds: 0 },
  { rank: 3, playerId: 'disc-m-03', name: 'Derek Cornelius', club: 'Marseille', league: 'ABROAD', yellows: 5, reds: 1 },
  { rank: 4, playerId: 'disc-m-04', name: 'Kamal Miller', club: 'Portland Timbers', league: 'MLS', yellows: 4, reds: 0 },
  { rank: 5, playerId: 'disc-m-05', name: 'Sean Young', club: 'Pacific FC', league: 'CPL', yellows: 4, reds: 0 },
];
const womenDisciplineLeaders = [
  { rank: 1, playerId: 'disc-w-01', name: 'Vanessa Gilles', club: 'Vancouver Rise', league: 'NSL', yellows: 5, reds: 0 },
  { rank: 2, playerId: 'disc-w-02', name: 'Shelina Zadorsky', club: 'Halifax Tides', league: 'NSL', yellows: 4, reds: 0 },
  { rank: 3, playerId: 'disc-w-03', name: 'Kadeisha Buchanan', club: 'Chelsea FC', league: 'ABROAD', yellows: 4, reds: 0 },
  { rank: 4, playerId: 'disc-w-04', name: 'Jade Rose', club: 'AFC Toronto', league: 'NSL', yellows: 3, reds: 0 },
  { rank: 5, playerId: 'disc-w-05', name: 'Simi Awujo', club: 'Montreal Roses', league: 'NSL', yellows: 3, reds: 0 },
];
const menSuspensionWatch = [
  { playerId: 'susp-m-01', name: 'Kamal Miller', club: 'Portland Timbers', league: 'MLS', yellows: 4 },
  { playerId: 'susp-m-02', name: 'Sean Young', club: 'Pacific FC', league: 'CPL', yellows: 4 },
];
const womenSuspensionWatch = [
  { playerId: 'susp-w-01', name: 'Shelina Zadorsky', club: 'Halifax Tides', league: 'NSL', yellows: 4 },
  { playerId: 'susp-w-02', name: 'Kadeisha Buchanan', club: 'Chelsea FC', league: 'ABROAD', yellows: 4 },
];
// --- INTERNATIONAL DUTY TRACKER: CANMNT / CANWNT CAPS & GOALS ---
const menDutyTracker = [
  { rank: 1, playerId: 'duty-m-01', name: 'Richie Laryea', position: 'RB', caps: 45, goals: 2, lastCalled: 'Jun 2026' },
  { rank: 2, playerId: 'duty-m-02', name: 'Alphonso Davies', position: 'LB', caps: 42, goals: 3, lastCalled: 'Jun 2026' },
  { rank: 3, playerId: 'duty-m-03', name: 'Jonathan David', position: 'ST', caps: 38, goals: 19, lastCalled: 'Jun 2026' },
  { rank: 4, playerId: 'duty-m-04', name: 'Stephen Eustáquio', position: 'CM', caps: 35, goals: 4, lastCalled: 'Jun 2026' },
  { rank: 5, playerId: 'duty-m-05', name: 'Alistair Johnston', position: 'RB', caps: 33, goals: 2, lastCalled: 'Jun 2026' },
  { rank: 6, playerId: 'duty-m-06', name: 'Tajon Buchanan', position: 'RW', caps: 30, goals: 8, lastCalled: 'Jun 2026' },
  { rank: 7, playerId: 'duty-m-07', name: 'Ismaël Koné', position: 'CM', caps: 22, goals: 3, lastCalled: 'Mar 2026' },
  { rank: 8, playerId: 'duty-m-08', name: 'Moïse Bombito', position: 'CB', caps: 18, goals: 1, lastCalled: 'Jun 2026' },
];
const womenDutyTracker = [
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
function getProvincialStandings(prov: 'ON' | 'QC' | 'BC' | 'AB') {
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
const menRecords = [
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
const womenRecords = [
  { label: 'Most goals, inaugural NSL season', value: 'Jorian Baucom — 11 (2025)' },
  { label: 'First NSL hat-trick', value: 'Evelyne Viens — Montreal Roses' },
  { label: 'Longest clean-sheet streak', value: 'Katelyn Rowland — 4 straight' },
  { label: 'Highest single-match attendance', value: 'AFC Toronto — 12,410' },
  { label: 'Fastest goal from kickoff', value: "Simi Awujo — 48 ''" }, 
  { label: 'Most assists, inaugural NSL season', value: 'Sarah Stratigakis — 6' },
  { label: 'Longest home unbeaten streak', value: 'AFC Toronto — 7 matches' },
  { label: 'Most saves in a single match', value: 'Rylee Foster — 11 saves' },
  { label: 'Youngest starter in NSL history', value: 'Olivia Smith — 18y 112d' },
  { label: 'Largest away victory margin', value: 'Vancouver Rise 4-0 Ottawa Rapid' },
];
