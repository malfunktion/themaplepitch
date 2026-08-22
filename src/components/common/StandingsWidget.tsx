// src/components/common/StandingsWidget.tsx
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
  footerAction?: {
    label: string;
    href: string;
  };
  compact?: boolean;
  hideToggle?: boolean;
}

function slugify(name: string) {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function StandingsWidget({
  title = 'LEAGUE STANDINGS',
  cplStandings = [],
  nslStandings = [],
  defaultTab = 'CPL',
  footerAction,
  compact = false,
  hideToggle = false,
}: StandingsWidgetProps) {
  const [leagueTab, setLeagueTab] = useState<'CPL' | 'NSL'>(defaultTab);
  const currentStandings = hideToggle ? cplStandings : (leagueTab === 'CPL' ? cplStandings : nslStandings);

  return (
    <div className="bg-card border border-border rounded-sm p-3 flex flex-col gap-3 text-charcoal dark:text-white shadow-sm w-full">
      {/* Header & League Toggle */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-crimson" strokeWidth={1.5} />
          <h2 className="text-xs font-mono font-bold tracking-widest">{title}</h2>
        </div>
        {!hideToggle && (
          <div className="flex bg-neutral-100 dark:bg-bg border border-border rounded-sm p-0.5 text-[9px] font-mono font-bold">
            <button
              onClick={() => setLeagueTab('CPL')}
              className={`px-2 py-1 rounded-sm transition-colors ${
                leagueTab === 'CPL' ? 'bg-crimson text-white shadow-sm' : 'text-charcoal-soft hover:text-charcoal dark:hover:text-white'
              }`}
            >
              CPL ({cplStandings.length})
            </button>
            <button
              onClick={() => setLeagueTab('NSL')}
              className={`px-2 py-1 rounded-sm transition-colors ${
                leagueTab === 'NSL' ? 'bg-crimson text-white shadow-sm' : 'text-charcoal-soft hover:text-charcoal dark:hover:text-white'
              }`}
            >
              NSL ({nslStandings.length})
            </button>
          </div>
        )}
      </div>

      {/* Standings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-[9px] font-mono text-charcoal-soft uppercase">
              <th className="py-1.5 px-1 font-semibold w-6 text-center">#</th>
              <th className="py-1.5 px-1 font-semibold">Club</th>
              {!compact && <th className="py-1.5 px-1 font-semibold text-center w-8">PL</th>}
              <th className="py-1.5 px-1 font-semibold text-center w-8">GD</th>
              <th className="py-1.5 px-1 font-semibold text-right w-8">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-900/40 text-[11px]">
            {currentStandings && currentStandings.length > 0 ? (
              currentStandings.map((row: any, idx) => {
                const teamSlug = row.slug || row.teamSlug || slugify(row.clubName || 'team');
                return (
                  <tr key={idx} className="group hover:bg-neutral-50 dark:hover:bg-card/20 transition-colors">
                    <td className="py-2 px-1 text-center font-mono font-bold text-charcoal-soft group-hover:text-crimson">
                      {row.position || idx + 1}
                    </td>
                    <td className="py-2 px-1 font-bold truncate max-w-[120px]" title={row.clubName}>
                      <Link
                        href={`/teams/${teamSlug}`}
                        className="hover:text-crimson hover:underline transition-colors block truncate"
                      >
                        {row.clubName}
                      </Link>
                    </td>
                    {!compact && (
                      <td className="py-2 px-1 text-center font-mono text-charcoal-soft">{row.played ?? 0}</td>
                    )}
                    <td className="py-2 px-1 text-center font-mono text-charcoal-soft">
                      {(row.goalDifference ?? 0) > 0 ? `+${row.goalDifference}` : row.goalDifference ?? 0}
                    </td>
                    <td className="py-2 px-1 text-right font-mono font-bold">{row.points ?? 0}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={compact ? 4 : 5} className="py-6 text-center text-xs text-charcoal-soft font-mono italic">
                  No standings data available{hideToggle ? '.' : ` for ${leagueTab}.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
