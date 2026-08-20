'use client';

import React, { useState, useMemo } from 'react';

export type ScopeFilter = 'ALL' | 'DOMESTIC' | 'INTERNATIONAL' | 'ABROAD';

export interface SeasonStatRow {
  id: number;
  season: string;
  clubName: string;
  competition: string;
  scope_category: 'DOMESTIC' | 'INTERNATIONAL' | 'ABROAD';
  matches_played: number;
  minutes: number;
  goals: number;
  assists: number;
  xg?: number;
  rating?: number;
}

interface PlayerCareerTableProps {
  stats: SeasonStatRow[];
}

export default function PlayerCareerTable({ stats }: PlayerCareerTableProps) {
  const [activeScope, setActiveScope] = useState<ScopeFilter>('ALL');

  const filteredStats = useMemo(() => {
    if (activeScope === 'ALL') return stats;
    return stats.filter((row) => row.scope_category === activeScope);
  }, [stats, activeScope]);

  // Totals Computation
  const totals = useMemo(() => {
    return filteredStats.reduce(
      (acc, curr) => ({
        apps: acc.apps + curr.matches_played,
        mins: acc.mins + curr.minutes,
        goals: acc.goals + curr.goals,
        assists: acc.assists + curr.assists,
        xg: acc.xg + (curr.xg || 0),
      }),
      { apps: 0, mins: 0, goals: 0, assists: 0, xg: 0 }
    );
  }, [filteredStats]);

  return (
    <div className="bg-card dark:bg-[#171717] border border-border dark:border-neutral-800 rounded-sm p-4 font-mono">
      {/* Control Strip & Scope Toggles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border dark:border-neutral-800 pb-3 mb-4">
        <h3 className="text-xs font-bold tracking-wider uppercase text-charcoal dark:text-white">
          CAREER DOSSIER // HISTORICAL SEASONAL STATS
        </h3>
        <div className="flex flex-wrap gap-1">
          {(['ALL', 'DOMESTIC', 'INTERNATIONAL', 'ABROAD'] as ScopeFilter[]).map((scope) => (
            <button
              key={scope}
              onClick={() => setActiveScope(scope)}
              className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-sm border transition-colors ${
                activeScope === scope
                  ? 'bg-crimson text-white border-crimson shadow-sm'
                  : 'bg-transparent text-neutral-400 border-border dark:border-neutral-800 hover:text-white'
              }`}
            >
              [ {scope === 'ALL' ? 'ALL COMPETITIONS' : scope} ]
            </button>
          ))}
        </div>
      </div>

      {/* Main Career Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-border dark:border-neutral-800 text-neutral-500 uppercase tracking-widest text-[9px]">
              <th className="py-2 px-2">Season</th>
              <th className="py-2 px-2">Club / Program</th>
              <th className="py-2 px-2">Comp</th>
              <th className="py-2 px-2 text-right">Apps</th>
              <th className="py-2 px-2 text-right">Mins</th>
              <th className="py-2 px-2 text-right">G</th>
              <th className="py-2 px-2 text-right">A</th>
              <th className="py-2 px-2 text-right">xG</th>
              <th className="py-2 px-2 text-right">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 dark:divide-neutral-800/60 text-charcoal dark:text-neutral-200">
            {filteredStats.length > 0 ? (
              filteredStats.map((row) => (
                <tr key={row.id} className="hover:bg-neutral-100 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="py-2.5 px-2 font-bold text-crimson">{row.season}</td>
                  <td className="py-2.5 px-2 font-semibold">{row.clubName}</td>
                  <td className="py-2.5 px-2 text-neutral-400">{row.competition}</td>
                  <td className="py-2.5 px-2 text-right">{row.matches_played}</td>
                  <td className="py-2.5 px-2 text-right">{row.minutes.toLocaleString()}</td>
                  <td className="py-2.5 px-2 text-right font-bold">{row.goals}</td>
                  <td className="py-2.5 px-2 text-right font-bold">{row.assists}</td>
                  <td className="py-2.5 px-2 text-right text-neutral-400">
                    {row.xg !== undefined ? row.xg.toFixed(2) : '-'}
                  </td>
                  <td className="py-2.5 px-2 text-right font-bold text-crimson">
                    {row.rating !== undefined ? row.rating.toFixed(1) : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-6 text-center text-neutral-500 uppercase text-[10px]">
                  NO HISTORICAL RECORDS FOUND FOR THIS FILTER
                </td>
              </tr>
            )}
          </tbody>
          {/* Cumulative Career Summary Row */}
          {filteredStats.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-crimson font-bold text-charcoal dark:text-white bg-neutral-100/50 dark:bg-neutral-900/80">
                <td colSpan={3} className="py-2.5 px-2 uppercase text-[9px]">
                  CUMULATIVE TOTALS
                </td>
                <td className="py-2.5 px-2 text-right">{totals.apps}</td>
                <td className="py-2.5 px-2 text-right">{totals.mins.toLocaleString()}</td>
                <td className="py-2.5 px-2 text-right text-crimson">{totals.goals}</td>
                <td className="py-2.5 px-2 text-right text-crimson">{totals.assists}</td>
                <td className="py-2.5 px-2 text-right text-neutral-400">{totals.xg.toFixed(2)}</td>
                <td className="py-2.5 px-2 text-right text-crimson">-</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
