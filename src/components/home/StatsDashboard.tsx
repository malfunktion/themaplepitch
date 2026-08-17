'use client';

import React, { useState } from 'react';
import type { StandingsRow } from '@/lib/types';
import { Trophy, Shield } from 'lucide-react';

interface ScoutDashProps {
  standings?: StandingsRow[];
  nslStandings?: StandingsRow[];
}

export default function ScoutDash({ standings = [], nslStandings = [] }: ScoutDashProps) {
  const [leagueTab, setLeagueTab] = useState<'CPL' | 'NSL'>('CPL');

  const currentStandings = leagueTab === 'CPL' ? standings : nslStandings;

  return (
    <div className="bg-card border border-border rounded-sm p-3 flex flex-col gap-3 text-charcoal dark:text-white shadow-sm">
      {/* Header & League Toggle */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-crimson" strokeWidth={1.5} />
          <h2 className="text-xs font-mono font-bold tracking-widest">LEAGUE STANDINGS</h2>
        </div>
        <div className="flex bg-neutral-100 dark:bg-bg border border-border rounded-sm p-0.5 text-[9px] font-mono font-bold">
          <button
            onClick={() => setLeagueTab('CPL')}
            className={`px-2 py-1 rounded-sm transition-colors ${
              leagueTab === 'CPL' ? 'bg-crimson text-white shadow-sm' : 'text-neutral-500 hover:text-charcoal dark:hover:text-white'
            }`}
          >
            CPL
          </button>
          <button
            onClick={() => setLeagueTab('NSL')}
            className={`px-2 py-1 rounded-sm transition-colors ${
              leagueTab === 'NSL' ? 'bg-crimson text-white shadow-sm' : 'text-neutral-500 hover:text-charcoal dark:hover:text-white'
            }`}
          >
            NSL
          </button>
        </div>
      </div>

      {/* Standings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-[9px] font-mono text-neutral-500 uppercase">
              <th className="py-1.5 px-1 font-semibold w-6 text-center">#</th>
              <th className="py-1.5 px-1 font-semibold">Club</th>
              <th className="py-1.5 px-1 font-semibold text-center w-8">PL</th>
              <th className="py-1.5 px-1 font-semibold text-center w-8">GD</th>
              <th className="py-1.5 px-1 font-semibold text-right w-8">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-900/40 text-[11px]">
            {currentStandings && currentStandings.length > 0 ? (
              currentStandings.map((row, idx) => (
                <tr key={idx} className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/20 transition-colors">
                  <td className="py-2 px-1 text-center font-mono font-bold text-neutral-400 group-hover:text-crimson">
                    {row.position || idx + 1}
                  </td>
                  <td className="py-2 px-1 font-bold truncate max-w-[120px]" title={row.clubName}>
                    {row.clubName}
                  </td>
                  <td className="py-2 px-1 text-center font-mono text-neutral-500">{row.played ?? 0}</td>
                  <td className="py-2 px-1 text-center font-mono text-neutral-500">
                    {(row.goalDifference ?? 0) > 0 ? `+${row.goalDifference}` : row.goalDifference ?? 0}
                  </td>
                  <td className="py-2 px-1 text-right font-mono font-bold">{row.points ?? 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-6 text-center text-xs text-neutral-500 font-mono italic">
                  No standings data available for {leagueTab}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
