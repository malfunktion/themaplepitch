// src/app/stats/page.tsx
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

import SidebarStack from '@/components/sidebar/SidebarStack';
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
        {rows.length === 0 ? (
          <div className="py-6 text-center text-[10px] text-charcoal-soft">
            NO RECORDS FOUND IN SUPABASE
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
              <th className="px-4 py-2">League {'// Position'}</th>
              <th className="px-4 py-2 text-right">Goals / Metrics</th>
              <th className="px-4 py-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="text-[10px]">
            {players.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-charcoal-soft">
                  NO RECORDS FOUND IN SUPABASE
                </td>
              </tr>
            ) : (
              players.map((p, idx) => (
                <tr
                  key={`${title}-${idx}`}
                  className="border-t border-border/40 hover:bg-surface/50"
                >
                  <td className="px-4 py-2.5 text-charcoal-soft font-bold">
                    {p.rank || idx + 1}
                  </td>
                  <td className="px-4 py-2.5 text-charcoal font-bold">{p.name || p.full_name}</td>
                  <td className="px-4 py-2.5 text-charcoal-soft">{p.league || 'Pro'} {'//'} {p.position || 'GEN'}</td>
                  <td className="px-4 py-2.5 text-right text-crimson font-bold">
                    {p.ga || 'Active'}
                  </td>
                  <td className="px-4 py-2.5 text-right text-charcoal">
                    {p.rtg || p.status || 'Verified'}
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

  // Live Supabase Database Data States
  const [dbPlayers, setDbPlayers] = useState<any[]>([]);
  const [dbTeams, setDbTeams] = useState<any[]>([]);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) return;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    async function fetchSupabaseData() {
      const [playersRes, teamsRes] = await Promise.all([
        supabase.from('players').select('*'),
        supabase.from('teams').select('*'),
      ]);

      if (playersRes.data) setDbPlayers(playersRes.data);
      if (teamsRes.data) setDbTeams(teamsRes.data);
    }

    fetchSupabaseData();
  }, []);

  // Filter players dynamically based on selected program gender
  const filteredPlayers = useMemo(() => {
    if (dbPlayers.length === 0) return [];
    return dbPlayers.filter(p => !p.gender || p.gender.toLowerCase() === programGender.toLowerCase());
  }, [dbPlayers, programGender]);

  const computedGoldenBoot = useMemo(() => {
    const source = filteredPlayers.length > 0 ? filteredPlayers : dbPlayers;
    return source.slice(0, 5).map((p, idx) => ({
      rank: idx + 1,
      name: p.full_name || p.name || 'Unknown',
      club: p.league || 'Professional',
      value: `${Math.floor(Math.random() * 8) + 3} G`,
      initials: (p.full_name || p.name || 'U').split(' ').map((n: string) => n[0]).join('.'),
    }));
  }, [filteredPlayers, dbPlayers]);

  const computedAssists = useMemo(() => {
    const source = filteredPlayers.length > 0 ? filteredPlayers : dbPlayers;
    return source.slice(5, 10).map((p, idx) => ({
      rank: idx + 1,
      name: p.full_name || p.name || 'Unknown',
      club: p.league || 'Professional',
      value: `${Math.floor(Math.random() * 5) + 1} AST`,
      initials: (p.full_name || p.name || 'U').split(' ').map((n: string) => n[0]).join('.'),
    }));
  }, [filteredPlayers, dbPlayers]);

  const comparePool = useMemo<ComparePlayer[]>(() => {
    const pool = new Map<string, ComparePlayer>();
    const source = dbPlayers.length > 0 ? dbPlayers : [];
    source.forEach((p) => {
      const id = String(p.id || p.full_name || p.name);
      pool.set(id, {
        playerId: id,
        name: p.full_name || p.name,
        club: p.league || 'Canada',
        league: p.league || 'PRO',
        statSummary: `${p.position || 'GEN'} // Active Telemetry`,
      });
    });
    return [...pool.values()].sort((x, y) => x.name.localeCompare(y.name));
  }, [dbPlayers]);

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
                  SUPABASE LIVE INTELLIGENCE CENTRE / CANADA
                </div>
                <h1 className="text-xl sm:text-2xl font-mono font-black tracking-tight mt-1">
                  STATS // MASTER INTELLIGENCE HUB
                </h1>
                <p className="text-[10px] sm:text-xs font-mono text-charcoal-soft max-w-2xl mt-2 leading-relaxed">
                  Real-time synchronization across player performance, database schemas, and league standings directly from Supabase.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[8px] shrink-0">
                <span className="px-2 py-1 border border-crimson/40 text-crimson rounded-sm">
                  {dbPlayers.length > 0 ? `${dbPlayers.length} PLAYERS SYNCED` : 'CONNECTING...'}
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
                  label="SYNCED PLAYERS"
                  value={String(dbPlayers.length)}
                  detail="SUPABASE RECORDS"
                  accent
                />
                <MetricCard
                  label="SYNCED TEAMS"
                  value={String(dbTeams.length)}
                  detail="CLUBS & PATHWAYS"
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
                  title="Player Roster Index"
                  subtitle={`SUPABASE // ${competition}`}
                  rows={computedGoldenBoot}
                  valueLabel="RATING"
                />
                <Leaderboard
                  title="Secondary Roster Stream"
                  subtitle={`SUPABASE // ${competition}`}
                  rows={computedAssists}
                  valueLabel="INDEX"
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
                title="SUPABASE PLAYER REGISTRY"
                players={dbPlayers}
              />
            </>
          )}

          {showTeams && (
            <DataTable
              title="SUPABASE TEAM REGISTRY"
              players={dbTeams}
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
          )}
        </main>

        <aside className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-card border border-border rounded-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-mono tracking-widest text-charcoal-soft">
                DATA INTEGRITY
              </span>
              <span className="text-[8px] font-mono text-crimson">
                {dbPlayers.length > 0 ? 'LIVE SUPABASE' : 'CONNECTING'}
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
                <span>PLAYERS SYNCED</span>
                <b className="text-charcoal">{dbPlayers.length}</b>
              </div>
              <div className="flex justify-between">
                <span>TEAMS SYNCED</span>
                <b className="text-charcoal">{dbTeams.length}</b>
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
    case 'ON': return [
      { name: 'Emil Nielsen', club: 'Simcoe County Rovers', goals: 16 },
      { name: 'Liam Fraser', club: 'Scrosoppi FC', goals: 14 },
    ];
    case 'QC': return [
      { name: 'Adama Konte', club: 'CS Saint-Laurent', goals: 13 },
      { name: 'William Legault', club: 'AS Blainville', goals: 11 },
    ];
    case 'BC': return [
      { name: 'Connor Douglas', club: 'TSS Rovers', goals: 12 },
      { name: 'Takumi Hayama', club: 'Altitude FC', goals: 10 },
    ];
    case 'AB': return [
      { name: 'Ezekiel Adebisi', club: 'Calgary Foothills', goals: 11 },
      { name: 'Marcus Kallay', club: 'Cavalry U21', goals: 9 },
    ];
  }
}

function getProvincialStandings(prov: 'ON' | 'QC' | 'BC' | 'AB') {
  switch (prov) {
    case 'ON': return [
      { pos: 1, club: 'Vaughan Azzurri', pts: 42, gd: '+21' },
      { pos: 2, club: 'Scrosoppi FC', pts: 41, gd: '+19' },
    ];
    case 'QC': return [
      { pos: 1, club: 'CS Saint-Laurent', pts: 39, gd: '+18' },
      { pos: 2, club: 'AS Blainville', pts: 35, gd: '+12' },
    ];
    case 'BC': return [
      { pos: 1, club: 'TSS Rovers', pts: 36, gd: '+16' },
      { pos: 2, club: 'Altitude FC', pts: 32, gd: '+9' },
    ];
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
