'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';

type Gender = 'MEN' | 'WOMEN';

interface DashboardPlayer {
  id?: number | string;
  name: string;
  slug?: string;
  external_id?: string;
  goals?: number;
  assists?: number;
  gender?: string;
  league?: string;
  is_canadian?: boolean;
  current_team?: { name?: string } | { name?: string }[] | null;
}

interface StatsDashboardProps {
  players?: DashboardPlayer[];
}

function initials(name: string) {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || '??'
  );
}

function clubName(p: DashboardPlayer) {
  const team = Array.isArray(p.current_team) ? p.current_team[0] : p.current_team;
  return team?.name || p.league || 'Unattached';
}

function playerRoute(p: DashboardPlayer) {
  return p.slug || p.external_id || p.id;
}

export default function StatsDashboard({ players = [] }: StatsDashboardProps) {
  const [gender, setGender] = useState<Gender>('MEN');

  const eligible = useMemo(() => {
    return players.filter((p) => {
      if (p.is_canadian === false) return false;
      const g = String(p.gender || 'men').toUpperCase();
      const targetIsFemale = gender === 'WOMEN';
      const comp = String(p.league || '').toUpperCase();
      const matchesGender = targetIsFemale
        ? g === 'WOMEN' || comp.includes('NSL')
        : g === 'MEN' || !comp.includes('NSL');
      return matchesGender;
    });
  }, [players, gender]);

  const goldenBootData = useMemo(
    () =>
      [...eligible]
        .filter((p) => (p.goals ?? 0) > 0)
        .sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0))
        .slice(0, 5),
    [eligible]
  );

  const playmakersData = useMemo(
    () =>
      [...eligible]
        .filter((p) => (p.assists ?? 0) > 0)
        .sort((a, b) => (b.assists ?? 0) - (a.assists ?? 0))
        .slice(0, 5),
    [eligible]
  );

  return (
    <section className="bg-[#0a0a0a] border border-neutral-800 rounded-sm p-4 sm:p-5 text-white font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3 mb-4">
        <div>
          <div className="text-[9px] text-neutral-500 tracking-[0.2em] uppercase">
            TELEMETRY SIGNAL
          </div>
          <h2 className="text-sm font-bold uppercase tracking-tight text-neutral-100 mt-0.5">
            Global Form Tracker
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-[#171717] border border-neutral-800 p-1 rounded-sm">
          <button
            onClick={() => setGender('MEN')}
            className={`px-3 py-1 text-[9px] font-bold transition-colors rounded-sm ${
              gender === 'MEN'
                ? 'bg-red-600 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            [ MEN ]
          </button>
          <button
            onClick={() => setGender('WOMEN')}
            className={`px-3 py-1 text-[9px] font-bold transition-colors rounded-sm ${
              gender === 'WOMEN'
                ? 'bg-red-600 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            [ WOMEN ]
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#171717] border border-neutral-800 rounded-sm p-3">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
            <span className="text-[10px] font-bold text-red-500 tracking-wider uppercase">
              Golden Boot Race
            </span>
            <span className="text-[8px] text-neutral-500">TOP 5</span>
          </div>
          <div className="space-y-2">
            {goldenBootData.length === 0 ? (
              <div className="text-[9px] text-neutral-500 py-3 text-center">
                NO GOAL DATA SYNCED YET
              </div>
            ) : (
              goldenBootData.map((player, idx) => (
                <div
                  key={player.id ?? idx}
                  className="flex items-center justify-between p-1.5 hover:bg-neutral-800/50 rounded-sm transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] text-neutral-500 w-3 font-bold shrink-0">
                      {idx + 1}.
                    </span>
                    <span className="w-6 h-6 rounded-sm bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[8px] font-bold text-neutral-300 shrink-0">
                      {initials(player.name)}
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={`/players/${playerRoute(player)}`}
                        className="text-xs font-bold text-neutral-200 hover:text-red-500 truncate block transition-colors"
                      >
                        {player.name}
                      </Link>
                      <span className="text-[8px] text-neutral-500 truncate block">
                        {clubName(player)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-red-500 shrink-0 pl-2">
                    {player.goals ?? 0} G
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-[#171717] border border-neutral-800 rounded-sm p-3">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
            <span className="text-[10px] font-bold text-neutral-300 tracking-wider uppercase">
              Top Playmakers
            </span>
            <span className="text-[8px] text-neutral-500">TOP 5</span>
          </div>
          <div className="space-y-2">
            {playmakersData.length === 0 ? (
              <div className="text-[9px] text-neutral-500 py-3 text-center">
                NO ASSIST DATA SYNCED YET
              </div>
            ) : (
              playmakersData.map((player, idx) => (
                <div
                  key={player.id ?? idx}
                  className="flex items-center justify-between p-1.5 hover:bg-neutral-800/50 rounded-sm transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] text-neutral-500 w-3 font-bold shrink-0">
                      {idx + 1}.
                    </span>
                    <span className="w-6 h-6 rounded-sm bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[8px] font-bold text-neutral-300 shrink-0">
                      {initials(player.name)}
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={`/players/${playerRoute(player)}`}
                        className="text-xs font-bold text-neutral-200 hover:text-red-500 truncate block transition-colors"
                      >
                        {player.name}
                      </Link>
                      <span className="text-[8px] text-neutral-500 truncate block">
                        {clubName(player)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-neutral-300 shrink-0 pl-2">
                    {player.assists ?? 0} AST
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-neutral-800 text-right">
        <Link
          href="/stats"
          className="text-[9px] text-red-500 hover:underline uppercase font-bold"
        >
          [ VIEW FULL STATS HUB ➔ ]
        </Link>
      </div>
    </section>
  );
}
