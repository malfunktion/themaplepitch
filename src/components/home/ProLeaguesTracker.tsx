// src/components/home/ProLeaguesTracker.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getCplStandings, getNslStandings } from '@/lib/data/standings';
import type { StandingsRow } from '@/lib/types';

function slugify(name: string) {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ProLeaguesTracker({ league = 'CPL' }: { league?: 'CPL' | 'NSL' }) {
  const [activeLeague, setActiveLeague] = useState<'CPL' | 'NSL'>(league);
  const [cplStandings, setCplStandings] = useState<StandingsRow[]>([]);
  const [nslStandings, setNslStandings] = useState<StandingsRow[]>([]);
  const [dbPlayers, setDbPlayers] = useState<any[]>([]);

  useEffect(() => {
    // Fetch live standings from Supabase
    getCplStandings().then((data) => setCplStandings(data || []));
    getNslStandings().then((data) => setNslStandings(data || []));

    // Fetch live players from API
    fetch('/api/stats', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.players) setDbPlayers(data.players);
      })
      .catch((err) => console.error('Failed to fetch players for tracker:', err));
  }, []);

  const currentStandings = activeLeague === 'CPL' ? cplStandings : nslStandings;

  // Filter players by league
  const leaguePlayers = useMemo(() => {
    return dbPlayers.filter((p) => {
      const pLeague = String(p.league || '').toUpperCase();
      if (activeLeague === 'CPL') return pLeague.includes('CPL') || p.gender === 'men';
      return pLeague.includes('NSL') || p.gender === 'women';
    });
  }, [dbPlayers, activeLeague]);

  // Golden Boot (Top Goals)
  const goldenBoot = useMemo(() => {
    return [...leaguePlayers]
      .sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0))
      .slice(0, 5)
      .map((p, idx, arr) => {
        const maxGoals = arr[0]?.goals || 1;
        const widthPct = Math.max(20, Math.round(((p.goals ?? 0) / maxGoals) * 100));
        return { ...p, width: `${widthPct}%` };
      });
  }, [leaguePlayers]);

  // Assists
  const assistLeaders = useMemo(() => {
    return [...leaguePlayers]
      .sort((a, b) => (b.assists ?? 0) - (a.assists ?? 0))
      .slice(0, 5)
      .map((p, idx, arr) => {
        const maxAst = arr[0]?.assists || 1;
        const widthPct = Math.max(20, Math.round(((p.assists ?? 0) / maxAst) * 100));
        return { ...p, width: `${widthPct}%` };
      });
  }, [leaguePlayers]);

  // Goalkeepers / Rating Leaders
  const topPerformers = useMemo(() => {
    return [...leaguePlayers]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 5)
      .map((p) => ({ ...p, width: `${Math.min(100, Math.round(((p.rating ?? 7) / 10) * 100))}%` }));
  }, [leaguePlayers]);

  const halfIndex = Math.ceil(currentStandings.length / 2);
  const leftStandings = currentStandings.slice(0, halfIndex);
  const rightStandings = currentStandings.slice(halfIndex);

  const PLAYOFF_LINE = 4;
  const renderStandingsRow = (team: StandingsRow) => {
    const teamRoute = team.slug || team.external_id || slugify(team.clubName);
    return (
      <div key={team.id || team.clubName}>
        <div
          className={`grid grid-cols-[20px_1fr_20px_20px] items-center text-xs p-1 pl-1.5 border-l-2 ${
            team.position <= PLAYOFF_LINE ? 'border-crimson' : 'border-transparent'
          } hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors`}
        >
          <span className="text-charcoal-soft font-mono">{team.position}</span>
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href={`/teams/${teamRoute}`}
              className="text-charcoal dark:text-white font-bold truncate hover:text-crimson hover:underline"
            >
              {team.clubName}
            </Link>
          </div>
          <span className="text-neutral-500 text-center font-mono">{team.played ?? 0}</span>
          <span className="text-charcoal dark:text-white font-bold text-center font-mono">
            {team.points ?? 0}
          </span>
        </div>
        {team.position === PLAYOFF_LINE && (
          <div className="flex items-center gap-1.5 py-1 pl-1.5">
            <div className="flex-1 border-t border-dashed border-crimson/40"></div>
            <span className="text-[7px] font-mono text-crimson/70 tracking-wider whitespace-nowrap">
              PLAYOFF LINE
            </span>
            <div className="flex-1 border-t border-dashed border-crimson/40"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="col-span-4 row-span-6 bg-card border border-border p-4 flex flex-col gap-4 text-charcoal dark:text-white shadow-sm">
      {/* HEADER WITH TOGGLE */}
      <div className="flex justify-between items-center border-b border-border pb-2">
        <h2 className="text-charcoal dark:text-white font-black text-sm tracking-widest uppercase">
          PRO LEAGUES TRACKER
        </h2>
        <div className="flex bg-surface border border-border rounded-sm p-0.5 text-[9px] font-mono font-bold">
          <button
            onClick={() => setActiveLeague('CPL')}
            className={`px-3 py-1 rounded-sm transition-colors ${
              activeLeague === 'CPL' ? 'bg-crimson text-white' : 'text-neutral-500 hover:text-charcoal'
            }`}
          >
            CPL
          </button>
          <button
            onClick={() => setActiveLeague('NSL')}
            className={`px-3 py-1 rounded-sm transition-colors ${
              activeLeague === 'NSL' ? 'bg-crimson text-white' : 'text-neutral-500 hover:text-charcoal'
            }`}
          >
            NSL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 grid-rows-[auto_1fr] gap-4 h-full">
        {/* ROW 1: LEAGUE STANDINGS */}
        <div className="col-span-2 overflow-x-auto border-b border-border pb-4">
          {currentStandings.length === 0 ? (
            <div className="py-6 text-center text-xs font-mono text-charcoal-soft">
              LOADING {activeLeague} STANDINGS...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 min-w-[420px]">
              <div className="flex flex-col gap-1">
                <div className="grid grid-cols-[20px_1fr_20px_20px] text-[10px] text-charcoal-soft font-bold tracking-wider mb-1 px-1 font-mono">
                  <span>#</span>
                  <span>CLUB</span>
                  <span className="text-center">P</span>
                  <span className="text-center">PTS</span>
                </div>
                {leftStandings.map(renderStandingsRow)}
              </div>

              <div className="flex flex-col gap-1">
                <div className="grid grid-cols-[20px_1fr_20px_20px] text-[10px] text-charcoal-soft font-bold tracking-wider mb-1 px-1 font-mono">
                  <span>#</span>
                  <span>CLUB</span>
                  <span className="text-center">P</span>
                  <span className="text-center">PTS</span>
                </div>
                {rightStandings.map(renderStandingsRow)}
              </div>
            </div>
          )}
        </div>

        {/* ROW 2: GOLDEN BOOT & ASSISTS */}
        <div className="flex flex-col gap-2 border-r border-border pr-4">
          <h3 className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest border-b border-border pb-1 font-mono">
            Golden Boot Race
          </h3>
          {goldenBoot.length === 0 ? (
            <div className="text-[10px] font-mono text-charcoal-soft py-2">No player goals logged</div>
          ) : (
            goldenBoot.map((player, idx) => {
              const pRoute = player.slug || player.external_id || player.id;
              const teamObj = Array.isArray(player.current_team) ? player.current_team[0] : player.current_team;
              const tRoute = teamObj?.slug || slugify(teamObj?.name || player.league);
              return (
                <div key={player.id || idx} className="flex items-center justify-between text-xs p-1">
                  <div className="flex items-center gap-2 w-1/2 min-w-0">
                    <span className="text-charcoal-soft w-3 shrink-0 font-mono">{idx + 1}</span>
                    <div className="flex flex-col min-w-0">
                      <Link
                        href={`/players/${pRoute}`}
                        className="text-charcoal dark:text-white font-bold truncate hover:text-crimson hover:underline"
                      >
                        {player.name}
                      </Link>
                      <Link
                        href={`/teams/${tRoute}`}
                        className="text-charcoal-soft text-[9px] truncate hover:text-crimson hover:underline"
                      >
                        {teamObj?.name || player.league || 'Pro Club'}
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-1/2 justify-end shrink-0">
                    <div className="w-full bg-neutral-200 dark:bg-neutral-900 h-1.5 rounded-full overflow-hidden flex justify-end">
                      <div className="bg-crimson h-full" style={{ width: player.width }}></div>
                    </div>
                    <span className="text-charcoal dark:text-white font-bold w-4 text-right font-mono">
                      {player.goals ?? 0}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex flex-col gap-2 pl-4">
          <h3 className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest border-b border-border pb-1 font-mono">
            Assist Leaders
          </h3>
          {assistLeaders.length === 0 ? (
            <div className="text-[10px] font-mono text-charcoal-soft py-2">No assists logged</div>
          ) : (
            assistLeaders.map((player, idx) => {
              const pRoute = player.slug || player.external_id || player.id;
              const teamObj = Array.isArray(player.current_team) ? player.current_team[0] : player.current_team;
              const tRoute = teamObj?.slug || slugify(teamObj?.name || player.league);
              return (
                <div key={player.id || idx} className="flex items-center justify-between text-xs p-1">
                  <div className="flex items-center gap-2 w-1/2 min-w-0">
                    <span className="text-charcoal-soft w-3 shrink-0 font-mono">{idx + 1}</span>
                    <div className="flex flex-col min-w-0">
                      <Link
                        href={`/players/${pRoute}`}
                        className="text-charcoal dark:text-white font-bold truncate hover:text-crimson hover:underline"
                      >
                        {player.name}
                      </Link>
                      <Link
                        href={`/teams/${tRoute}`}
                        className="text-charcoal-soft text-[9px] truncate hover:text-crimson hover:underline"
                      >
                        {teamObj?.name || player.league || 'Pro Club'}
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-1/2 justify-end shrink-0">
                    <div className="w-full bg-neutral-200 dark:bg-neutral-900 h-1.5 rounded-full overflow-hidden flex justify-end">
                      <div className="bg-crimson h-full" style={{ width: player.width }}></div>
                    </div>
                    <span className="text-charcoal dark:text-white font-bold w-4 text-right font-mono">
                      {player.assists ?? 0}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
