// src/app/components/common/StandingsWidget.tsx
'use client';

import React, { useState } from 'react';
import type { StandingsRow } from '@/lib/types';
import { Trophy } from 'lucide-react';
import Link from 'next/link';

interface StandingsWidgetProps {
  title?: string;
  cplStandings?: StandingsRow[];
  nslStandings?: StandingsRow[];
  defaultTab?: 'CPL' | 'NSL';
  // Allows different pages to pass custom footer links or filter states
  footerAction?: {
    label: string;
    href: string;
  };
  compact?: boolean; // True for sidebar, false for main grid
}

export default function StandingsWidget({
  title = 'LEAGUE STANDINGS',
  cplStandings = [],
  nslStandings = [],
  defaultTab = 'CPL',
  footerAction,
  compact = false,
}: StandingsWidgetProps) {
  const [leagueTab, setLeagueTab] = useState<'CPL' | 'NSL'>(defaultTab);
  const currentStandings = leagueTab === 'CPL' ? cplStandings : nslStandings;

  return (
    <div className="bg-card border border-border rounded-sm p-3 flex flex-col gap-3 text-charcoal dark:text-white shadow-sm w-full">
      {/* Header & League Toggle */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-crimson" strokeWidth={1.5} />
          <h2 className="text-xs font-mono font-bold tracking-widest">{title}</h2>
        </div>
        <div className="flex bg-neutral-100 dark:bg-bg border border-border rounded-sm p-0.5 text-[9px] font-mono font-bold">
          <button
            onClick={() => setLeagueTab('CPL')}
            className={`px-2 py-1 rounded-sm transition-colors ${
              leagueTab === 'CPL' ? 'bg-crimson text-white shadow-sm' : 'text-neutral-500 hover:text-charcoal dark:hover:text-white'
            }`}
          >
            CPL ({cplStandings.length || 8})
          </button>
          <button
            onClick={() => setLeagueTab('NSL')}
            className={`px-2 py-1 rounded-sm transition-colors ${
              leagueTab === 'NSL' ? 'bg-crimson text-white shadow-sm' : 'text-neutral-500 hover:text-charcoal dark:hover:text-white'
            }`}
          >
            NSL ({nslStandings.length || 6})
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
              {!compact && <th className="py-1.5 px-1 font-semibold text-center w-8">PL</th>}
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
                  {!compact && (
                    <td className="py-2 px-1 text-center font-mono text-neutral-500">{row.played ?? 0}</td>
                  )}
                  <td className="py-2 px-1 text-center font-mono text-neutral-500">
                    {(row.goalDifference ?? 0) > 0 ? `+${row.goalDifference}` : row.goalDifference ?? 0}
                  </td>
                  <td className="py-2 px-1 text-right font-mono font-bold">{row.points ?? 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={compact ? 4 : 5} className="py-6 text-center text-xs text-neutral-500 font-mono italic">
                  No standings data available for {leagueTab}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Customizable Footer Links / State Actions */}
      {footerAction && (
        <div className="pt-2 border-t border-border flex justify-end">
          <Link
            href={footerAction.href}
            className="text-[10px] font-mono text-crimson hover:underline tracking-wider font-bold"
          >
            {footerAction.label} →
          </Link>
        </div>
      )}
    </div>
  );
}
